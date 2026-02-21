import { describe, it, expect } from 'vitest';
import { lookupName, scanTextForNames, encode } from '../src/shared/encoder';

describe('lookupName', () => {
  it('finds an exact match by full name', () => {
    const result = lookupName('General Services Administration');
    expect(result).not.toBeNull();
    expect(result!.acronym).toBe('GSA');
  });

  it('is case-insensitive', () => {
    const result = lookupName('general services administration');
    expect(result).not.toBeNull();
    expect(result!.acronym).toBe('GSA');
  });

  it('trims whitespace', () => {
    const result = lookupName('  General Services Administration  ');
    expect(result).not.toBeNull();
    expect(result!.acronym).toBe('GSA');
  });

  it('returns null for unknown names', () => {
    const result = lookupName('Bureau of Imaginary Things');
    expect(result).toBeNull();
  });

  it('returns null for empty string', () => {
    const result = lookupName('');
    expect(result).toBeNull();
  });

  it('finds Department of War', () => {
    const result = lookupName('Department of War');
    expect(result).not.toBeNull();
    expect(result!.acronym).toBe('DOW');
  });
});

describe('scanTextForNames', () => {
  it('finds full names in text', () => {
    const results = scanTextForNames(
      'The General Services Administration and the Office of Management and Budget are collaborating.'
    );
    const acronyms = results.map(r => r.acronym);
    expect(acronyms).toContain('GSA');
    expect(acronyms).toContain('OMB');
  });

  it('returns empty array for text with no matching names', () => {
    const results = scanTextForNames('Hello world, this is a normal sentence.');
    expect(results).toHaveLength(0);
  });

  it('does not return duplicates', () => {
    const results = scanTextForNames(
      'The General Services Administration works with the General Services Administration.'
    );
    const gsaResults = results.filter(r => r.acronym === 'GSA');
    expect(gsaResults).toHaveLength(1);
  });
});

describe('encode', () => {
  it('handles single name mode', () => {
    const response = encode({ name: 'General Services Administration' });
    expect(response.success).toBe(true);
    expect(response.mode).toBe('single');
    expect(response.count).toBe(1);
    expect(response.results[0].acronym).toBe('GSA');
  });

  it('handles text scan mode', () => {
    const response = encode({
      text: 'The General Services Administration and the Office of Management and Budget',
    });
    expect(response.success).toBe(true);
    expect(response.mode).toBe('scan');
    expect(response.count).toBeGreaterThanOrEqual(2);
  });

  it('returns failure for unknown name', () => {
    const response = encode({ name: 'Bureau of Imaginary Things' });
    expect(response.success).toBe(false);
    expect(response.count).toBe(0);
  });

  it('returns failure for empty request', () => {
    const response = encode({});
    expect(response.success).toBe(false);
  });
});
