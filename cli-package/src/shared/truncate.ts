import type { DecodeResponse, EncodeResponse } from './types';

const JOIN39_CHAR_LIMIT = 2000;

type TruncatableResponse = DecodeResponse | EncodeResponse;

/**
 * Progressive truncation for Join39 2000-char compliance:
 * 1. Shorten descriptions to first sentence
 * 2. Drop descriptions entirely
 * 3. Trim results array
 */
export function truncateForJoin39<T extends TruncatableResponse>(response: T): T {
  let json = JSON.stringify(response);

  if (json.length <= JOIN39_CHAR_LIMIT) {
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
  if (json.length <= JOIN39_CHAR_LIMIT) {
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
  if (json.length <= JOIN39_CHAR_LIMIT) {
    return noDesc;
  }

  // Step 3: Trim results array until under limit
  const trimmed = { ...noDesc };
  while (
    trimmed.results.length > 0 &&
    JSON.stringify(trimmed).length > JOIN39_CHAR_LIMIT
  ) {
    trimmed.results = trimmed.results.slice(0, -1);
  }
  trimmed.count = trimmed.results.length;

  return trimmed;
}
