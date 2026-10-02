// FedSpeak MCP server — exposes decode/encode as Model Context Protocol tools.
// Shared by the npm package (stdio) and the Netlify function (Streamable HTTP).
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { decode, getAllEntries, getAgencies, getCategories, getAcronymCount } from './decoder.js';
import { encode } from './encoder.js';

export const MCP_SERVER_INFO = {
  name: 'fedspeak',
  version: '1.1.0',
} as const;

function text(payload: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }] };
}

export function createFedSpeakServer(): McpServer {
  const server = new McpServer(MCP_SERVER_INFO, {
    instructions:
      'FedSpeak decodes U.S. federal government acronyms (e.g. GSA, OMB, DOW, FedRAMP) into full names with ' +
      'descriptions, parent agency, and category, and encodes full names back to acronyms. Data is a curated ' +
      `static dataset of ${getAcronymCount()} entries maintained by MetaPhase. Use decode_acronym for one term, ` +
      'scan_text to find every acronym in a passage, encode_name for reverse lookup, and list_acronyms to browse.',
  });

  server.registerTool(
    'decode_acronym',
    {
      title: 'Decode a federal acronym',
      description: 'Look up a single U.S. federal government acronym (case-insensitive, aliases supported) and return its full name, description, agency, category, and URL.',
      inputSchema: { acronym: z.string().min(1).describe('The acronym to decode, e.g. "GSA" or "FedRAMP"') },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ acronym }) => text(decode({ acronym })),
  );

  server.registerTool(
    'scan_text',
    {
      title: 'Find acronyms in text',
      description: 'Scan a passage of text and return every known federal acronym found in it, with full definitions.',
      inputSchema: { text: z.string().min(1).describe('Free text to scan for federal acronyms') },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ text: input }) => text(decode({ text: input })),
  );

  server.registerTool(
    'encode_name',
    {
      title: 'Encode a full name to its acronym',
      description: 'Reverse lookup: given a full or partial agency/program name (e.g. "General Services Administration"), return the matching acronym(s). Pass "text" instead to find all known names in a passage.',
      inputSchema: {
        name: z.string().optional().describe('Full or partial name to convert to an acronym'),
        text: z.string().optional().describe('Free text to scan for full names'),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ name, text: input }) => {
      if (!name && !input) {
        return { ...text({ success: false, error: 'Provide "name" or "text".' }), isError: true };
      }
      return text(encode({ ...(name && { name }), ...(input && { text: input }) }));
    },
  );

  server.registerTool(
    'list_acronyms',
    {
      title: 'List acronyms',
      description: 'Browse the acronym database. Filter by parent agency (e.g. "GSA", "DOW", "EOP") and/or category (department, agency, office, bureau, program, process, regulation, system, general). Results are paginated.',
      inputSchema: {
        agency: z.string().optional().describe('Parent agency acronym to filter by'),
        category: z.string().optional().describe('Category to filter by'),
        query: z.string().optional().describe('Substring to match against acronym or full name'),
        limit: z.number().int().min(1).max(200).optional().describe('Max results (default 50)'),
        offset: z.number().int().min(0).optional().describe('Results to skip (default 0)'),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ agency, category, query, limit = 50, offset = 0 }) => {
      const q = query?.toLowerCase();
      const all = getAllEntries().filter(e =>
        (!agency || e.agency.toLowerCase() === agency.toLowerCase()) &&
        (!category || e.category === category) &&
        (!q || e.acronym.toLowerCase().includes(q) || e.full.toLowerCase().includes(q)),
      );
      const page = all.slice(offset, offset + limit).map(e => ({ acronym: e.acronym, full: e.full, agency: e.agency, category: e.category }));
      return text({ total: all.length, offset, limit, results: page });
    },
  );

  server.registerResource(
    'agencies',
    'fedspeak://agencies',
    { title: 'Agencies', description: 'All parent agency codes used in the dataset', mimeType: 'application/json' },
    async uri => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(getAgencies()) }] }),
  );

  server.registerResource(
    'categories',
    'fedspeak://categories',
    { title: 'Categories', description: 'All entry categories used in the dataset', mimeType: 'application/json' },
    async uri => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(getCategories()) }] }),
  );

  return server;
}
