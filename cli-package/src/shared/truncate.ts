import type { DecodeResponse, EncodeResponse } from './types';

const RESPONSE_CHAR_LIMIT = 2000;

type TruncatableResponse = DecodeResponse | EncodeResponse;

/**
 * Progressive response truncation to stay under 2000 chars:
 * 1. Shorten descriptions to first sentence
 * 2. Drop descriptions entirely
 * 3. Trim results array
 */
export function truncateResponse<T extends TruncatableResponse>(response: T): T {
  let json = JSON.stringify(response);

  if (json.length <= RESPONSE_CHAR_LIMIT) {
    return response;
  }

  // Step 1: Shorten descriptions to first sentence
  const shortened: T = {
    ...response,
    results: response.results.map((r: { description: string }) => ({
      ...r,
      description: r.description.split('. ')[0] + '.',
    })),
    truncated: true,
  };

  json = JSON.stringify(shortened);
  if (json.length <= RESPONSE_CHAR_LIMIT) {
    return shortened;
  }

  // Step 2: Drop descriptions entirely
  const noDesc: T = {
    ...shortened,
    results: shortened.results.map((r: { description: string }) => ({
      ...r,
      description: '',
    })),
  };

  json = JSON.stringify(noDesc);
  if (json.length <= RESPONSE_CHAR_LIMIT) {
    return noDesc;
  }

  // Step 3: Trim results array until under limit
  const trimmed = { ...noDesc };
  while (
    trimmed.results.length > 0 &&
    JSON.stringify(trimmed).length > RESPONSE_CHAR_LIMIT
  ) {
    trimmed.results = trimmed.results.slice(0, -1);
  }
  trimmed.count = trimmed.results.length;

  return trimmed;
}
