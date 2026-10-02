#!/usr/bin/env node
// FedSpeak MCP server over stdio. Usage: npx -p @metaphase-tech/fedspeak fedspeak-mcp
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createFedSpeakServer } from './shared/mcp-server.js';

const server = createFedSpeakServer();
const transport = new StdioServerTransport();
server.connect(transport).catch((err: unknown) => {
  console.error('fedspeak-mcp failed to start:', err);
  process.exit(1);
});
