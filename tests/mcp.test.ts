import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createFedSpeakServer } from '../src/shared/mcp-server';
import handler from '../netlify/functions/mcp';

function parseText(result: { content: unknown }): Record<string, unknown> {
  const content = result.content as Array<{ type: string; text: string }>;
  expect(content[0].type).toBe('text');
  return JSON.parse(content[0].text);
}

describe('FedSpeak MCP server (in-memory)', () => {
  const client = new Client({ name: 'test-client', version: '0.0.0' });
  const server = createFedSpeakServer();

  beforeAll(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await client.connect(clientTransport);
  });

  afterAll(async () => {
    await client.close();
    await server.close();
  });

  it('lists the four tools', async () => {
    const { tools } = await client.listTools();
    expect(tools.map(t => t.name).sort()).toEqual(['decode_acronym', 'encode_name', 'list_acronyms', 'scan_text']);
  });

  it('decode_acronym returns a full entry', async () => {
    const res = parseText(await client.callTool({ name: 'decode_acronym', arguments: { acronym: 'gsa' } }));
    expect(res.success).toBe(true);
    const results = res.results as Array<{ acronym: string; full: string }>;
    expect(results[0].acronym).toBe('GSA');
    expect(results[0].full).toBe('General Services Administration');
  });

  it('scan_text finds multiple acronyms', async () => {
    const res = parseText(await client.callTool({ name: 'scan_text', arguments: { text: 'The DOW and OMB met with GSA.' } }));
    const found = (res.results as Array<{ acronym: string }>).map(r => r.acronym);
    expect(found).toEqual(expect.arrayContaining(['DOW', 'OMB', 'GSA']));
  });

  it('encode_name reverse-looks-up a name', async () => {
    const res = parseText(await client.callTool({ name: 'encode_name', arguments: { name: 'General Services Administration' } }));
    expect(res.success).toBe(true);
    expect((res.results as Array<{ acronym: string }>)[0].acronym).toBe('GSA');
  });

  it('encode_name without args is an error result', async () => {
    const result = await client.callTool({ name: 'encode_name', arguments: {} });
    expect(result.isError).toBe(true);
  });

  it('list_acronyms filters and paginates', async () => {
    const res = parseText(await client.callTool({ name: 'list_acronyms', arguments: { agency: 'GSA', limit: 5 } }));
    expect(res.total as number).toBeGreaterThan(5);
    expect((res.results as unknown[]).length).toBe(5);
    for (const r of res.results as Array<{ agency: string }>) expect(r.agency).toBe('GSA');
  });

  it('exposes agencies and categories resources', async () => {
    const { resources } = await client.listResources();
    expect(resources.map(r => r.uri).sort()).toEqual(['fedspeak://agencies', 'fedspeak://categories']);
    const cats = await client.readResource({ uri: 'fedspeak://categories' });
    const list = JSON.parse((cats.contents[0] as { text: string }).text) as string[];
    expect(list).toContain('agency');
  });
});

describe('Netlify /mcp handler (Streamable HTTP, stateless)', () => {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };

  it('answers CORS preflight', async () => {
    const res = await handler(new Request('https://fedspeak.dev/mcp', { method: 'OPTIONS' }));
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('handles initialize', async () => {
    const body = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '0' } } };
    const res = await handler(new Request('https://fedspeak.dev/mcp', { method: 'POST', headers, body: JSON.stringify(body) }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.result.serverInfo.name).toBe('fedspeak');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('handles tools/list without a session (stateless)', async () => {
    const body = { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} };
    const res = await handler(new Request('https://fedspeak.dev/mcp', { method: 'POST', headers, body: JSON.stringify(body) }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.result.tools.map((t: { name: string }) => t.name)).toContain('decode_acronym');
  });
});
