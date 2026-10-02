import { describe, it, expect } from 'vitest';
import data from '../src/shared/data/acronyms.json' with { type: 'json' };
import type { AcronymData } from '../src/shared/types';

const acronyms = data as AcronymData;
const keys = Object.keys(acronyms);
const CATEGORIES = ['department', 'agency', 'office', 'bureau', 'program', 'process', 'regulation', 'system', 'general'];

describe('acronyms.json invariants', () => {
  it('has keys sorted alphabetically', () => {
    expect(keys).toEqual([...keys].sort());
  });

  it('every entry has full, description, agency, and a valid category', () => {
    for (const [key, entry] of Object.entries(acronyms)) {
      expect(entry.full, key).toBeTruthy();
      expect(entry.description, key).toBeTruthy();
      expect(entry.agency, key).toBeTruthy();
      expect(CATEGORIES, `${key} category "${entry.category}"`).toContain(entry.category);
    }
  });

  it('every agency code is "General" or itself a decodable key', () => {
    const unresolved = new Set<string>();
    for (const entry of Object.values(acronyms)) {
      if (entry.agency !== 'General' && !acronyms[entry.agency]) unresolved.add(entry.agency);
    }
    expect([...unresolved]).toEqual([]);
  });

  it('urls are https', () => {
    for (const [key, entry] of Object.entries(acronyms)) {
      if (entry.url) expect(entry.url, key).toMatch(/^https:\/\//);
    }
  });

  it('aliases do not collide with keys or other aliases (case-insensitive)', () => {
    const seen = new Map<string, string>();
    for (const key of keys) seen.set(key.toUpperCase(), key);
    for (const [key, entry] of Object.entries(acronyms)) {
      for (const alias of entry.aliases ?? []) {
        const upper = alias.toUpperCase();
        const owner = seen.get(upper);
        expect(owner === undefined || owner === key, `alias "${alias}" on ${key} collides with ${owner}`).toBe(true);
        seen.set(upper, key);
      }
    }
  });

  it('descriptions are concise', () => {
    for (const [key, entry] of Object.entries(acronyms)) {
      expect(entry.description.length, key).toBeLessThanOrEqual(400);
    }
  });
});
