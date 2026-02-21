import acronymsData from './data/acronyms.json';
import type { AcronymData, DecodedResult, DecodeResponse } from './types';

const acronyms: AcronymData = acronymsData as AcronymData;

// Build alias lookup map
const aliasMap: Map<string, string> = new Map();
for (const [key, entry] of Object.entries(acronyms)) {
  aliasMap.set(key.toUpperCase(), key);
  if (entry.aliases) {
    for (const alias of entry.aliases) {
      aliasMap.set(alias.toUpperCase(), key);
    }
  }
}

function toResult(key: string): DecodedResult {
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

export function lookupAcronym(query: string): DecodedResult | null {
  const normalized = query.trim().toUpperCase();
  const key = aliasMap.get(normalized);
  if (!key) return null;
  return toResult(key);
}

export function scanText(text: string): DecodedResult[] {
  // Extract potential acronyms: sequences of 2+ uppercase letters, digits, &, or -
  // Also handle things like "8(a)" and multi-word keys
  const words = text.split(/\s+/);
  const found = new Map<string, DecodedResult>();

  // Check individual words
  for (const word of words) {
    const cleaned = word.replace(/[.,;:!?()[\]{}'"]+$/g, '').replace(/^[.,;:!?()[\]{}'"]+/g, '');
    const upper = cleaned.toUpperCase();
    const key = aliasMap.get(upper);
    if (key && !found.has(key)) {
      found.set(key, toResult(key));
    }
  }

  // Check multi-word keys (e.g., "DATA Act", "NIST SP")
  const textUpper = text.toUpperCase();
  for (const [key] of Object.entries(acronyms)) {
    if (key.includes(' ') && textUpper.includes(key.toUpperCase()) && !found.has(key)) {
      found.set(key, toResult(key));
    }
  }

  return Array.from(found.values());
}

export function decode(request: { acronym?: string; text?: string }): DecodeResponse {
  if (request.acronym) {
    const result = lookupAcronym(request.acronym);
    return {
      success: !!result,
      query: request.acronym,
      mode: 'single',
      results: result ? [result] : [],
      count: result ? 1 : 0,
      truncated: false,
    };
  }

  if (request.text) {
    const results = scanText(request.text);
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

export function getAllAcronyms(): string[] {
  return Object.keys(acronyms).sort();
}

export function getAcronymCount(): number {
  return Object.keys(acronyms).length;
}
