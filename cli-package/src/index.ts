// FedSpeak npm package entry point
// Re-exports from shared core (files synced via scripts/sync-cli-package.sh)

export { lookupAcronym, scanText, decode, getAllAcronyms, getAcronymCount } from './shared/decoder.js';
export { lookupName, scanTextForNames, encode } from './shared/encoder.js';
export { truncateResponse } from './shared/truncate.js';
export type {
  AcronymCategory,
  AcronymEntry,
  AcronymData,
  DecodedResult,
  DecodeResponse,
  DecodeRequest,
  EncodedResult,
  EncodeResponse,
  EncodeRequest,
} from './shared/types.js';
export { createFedSpeakServer, MCP_SERVER_INFO } from './shared/mcp-server.js';
