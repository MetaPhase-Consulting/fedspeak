// FedSpeak npm package entry point
// Re-exports from shared core (files synced via scripts/sync-cli-package.sh)

export { lookupAcronym, scanText, decode, getAllAcronyms, getAcronymCount } from './shared/decoder';
export { lookupName, scanTextForNames, encode } from './shared/encoder';
export { truncateResponse } from './shared/truncate';
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
} from './shared/types';
