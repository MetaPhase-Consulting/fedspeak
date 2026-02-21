// FedSpeak npm package entry point
// Re-exports from shared core

export { lookupAcronym, scanText, decode, getAllAcronyms, getAcronymCount } from '../../src/shared/decoder';
export { truncateForJoin39 } from '../../src/shared/truncate';
export type {
  AcronymCategory,
  AcronymEntry,
  AcronymData,
  DecodedResult,
  DecodeResponse,
  DecodeRequest,
} from '../../src/shared/types';
