import acronymsData from './data/acronyms.json';
import type { AcronymData, EncodedResult, EncodeResponse } from './types';

const acronyms: AcronymData = acronymsData as AcronymData;

// Build reverse lookup map: lowercase full name → acronym key
const reverseMap: Map<string, string> = new Map();
for (const [key, entry] of Object.entries(acronyms)) {
  reverseMap.set(entry.full.toLowerCase(), key);
}

function toResult(key: string): EncodedResult {
  const entry = acronyms[key];
  return {
    acronym: key,
    full: entry.full,
    description: entry.description,
    agency: entry.agency,
    category: entry.category,
    ...(entry.url && { url: entry.url }),
  };
}

export function lookupName(query: string): EncodedResult | null {
  const normalized = query.trim().toLowerCase();
  const key = reverseMap.get(normalized);
  if (!key) return null;
  return toResult(key);
}

export function scanTextForNames(text: string): EncodedResult[] {
  const found = new Map<string, EncodedResult>();
  const textLower = text.toLowerCase();

  // Check each full name against the text (longest first to prefer specific matches)
  const entries = Array.from(reverseMap.entries()).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [fullLower, key] of entries) {
    if (textLower.includes(fullLower) && !found.has(key)) {
      found.set(key, toResult(key));
    }
  }

  return Array.from(found.values());
}

export function encode(request: { name?: string; text?: string }): EncodeResponse {
  if (request.name) {
    const result = lookupName(request.name);
    return {
      success: !!result,
      query: request.name,
      mode: 'single',
      results: result ? [result] : [],
      count: result ? 1 : 0,
      truncated: false,
    };
  }

  if (request.text) {
    const results = scanTextForNames(request.text);
    return {
      success: results.length > 0,
      query: request.text,
      mode: 'scan',
      results,
      count: results.length,
      truncated: false,
    };
  }

  return {
    success: false,
    query: '',
    mode: 'single',
    results: [],
    count: 0,
    truncated: false,
  };
}
