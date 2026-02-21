import { describe, it, expect } from 'vitest';
import { lookupAcronym, scanText, decode, getAllAcronyms, getAcronymCount } from '../src/shared/decoder';

describe('lookupAcronym', () => {
  it('finds an exact match', () => {
    const result = lookupAcronym('DOD');
    expect(result).not.toBeNull();
    expect(result!.full).toBe('Department of Defense');
    expect(result!.agency).toBe('DOD');
    expect(result!.category).toBe('department');
  });

  it('is case-insensitive', () => {
    const result = lookupAcronym('dod');
    expect(result).not.toBeNull();
    expect(result!.full).toBe('Department of Defense');
  });

  it('trims whitespace', () => {
    const result = lookupAcronym('  GSA  ');
    expect(result).not.toBeNull();
    expect(result!.full).toBe('General Services Administration');
  });

  it('returns null for unknown acronyms', () => {
    const result = lookupAcronym('XYZZY');
    expect(result).toBeNull();
  });

  it('returns null for empty string', () => {
    const result = lookupAcronym('');
    expect(result).toBeNull();
  });

  it('includes url when available', () => {
    const result = lookupAcronym('NASA');
    expect(result).not.toBeNull();
    expect(result!.url).toBe('https://www.nasa.gov');
  });
});

describe('scanText', () => {
  it('finds multiple acronyms in text', () => {
    const results = scanText('The DOD and GSA are working with OMB on the new RFP');
    const acronyms = results.map(r => r.acronym);
    expect(acronyms).toContain('DOD');
    expect(acronyms).toContain('GSA');
    expect(acronyms).toContain('OMB');
    expect(acronyms).toContain('RFP');
  });

  it('returns empty array for text with no acronyms', () => {
    const results = scanText('Hello world, this is a normal sentence');
    expect(results).toHaveLength(0);
  });

  it('handles punctuation around acronyms', () => {
    const results = scanText('Contact the FBI, CIA, and NSA.');
    const acronyms = results.map(r => r.acronym);
    expect(acronyms).toContain('FBI');
    expect(acronyms).toContain('CIA');
    expect(acronyms).toContain('NSA');
  });

  it('does not return duplicates', () => {
    const results = scanText('The DOD works with DOD on DOD projects');
    const dodResults = results.filter(r => r.acronym === 'DOD');
    expect(dodResults).toHaveLength(1);
  });

  it('handles empty text', () => {
    const results = scanText('');
    expect(results).toHaveLength(0);
  });
});

describe('decode', () => {
  it('handles single acronym mode', () => {
    const response = decode({ acronym: 'DOD' });
    expect(response.success).toBe(true);
    expect(response.mode).toBe('single');
    expect(response.count).toBe(1);
    expect(response.results[0].full).toBe('Department of Defense');
  });

  it('handles text scan mode', () => {
    const response = decode({ text: 'The DOD and GSA work with OMB' });
    expect(response.success).toBe(true);
    expect(response.mode).toBe('scan');
    expect(response.count).toBeGreaterThanOrEqual(3);
  });

  it('returns failure for unknown acronym', () => {
    const response = decode({ acronym: 'XYZZY' });
    expect(response.success).toBe(false);
    expect(response.count).toBe(0);
  });

  it('returns failure for empty request', () => {
    const response = decode({});
    expect(response.success).toBe(false);
    expect(response.count).toBe(0);
  });
});

describe('getAllAcronyms', () => {
  it('returns a sorted array', () => {
    const all = getAllAcronyms();
    expect(all.length).toBeGreaterThan(100);
    const sorted = [...all].sort();
    expect(all).toEqual(sorted);
  });
});

describe('getAcronymCount', () => {
  it('returns count greater than 200', () => {
    expect(getAcronymCount()).toBeGreaterThanOrEqual(200);
  });
});
