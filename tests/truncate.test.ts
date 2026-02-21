import { describe, it, expect } from 'vitest';
import { truncateResponse } from '../src/shared/truncate';
import type { DecodeResponse } from '../src/shared/types';

function makeResponse(count: number, descLength = 100): DecodeResponse {
  const results = Array.from({ length: count }, (_, i) => ({
    acronym: `ACR${i}`,
    full: `Full Name for Acronym ${i}`,
    description: 'A'.repeat(descLength) + '.' + ' More details here.',
    agency: 'TEST',
    category: 'agency' as const,
    url: 'https://example.gov',
  }));

  return {
    success: true,
    query: 'test query',
    mode: 'scan',
    results,
    count,
    truncated: false,
  };
}

describe('truncateResponse', () => {
  it('returns response unchanged when under 2000 chars', () => {
    const response = makeResponse(2, 50);
    const result = truncateResponse(response);
    expect(result.truncated).toBe(false);
    expect(result.results).toHaveLength(2);
  });

  it('shortens descriptions when over limit', () => {
    const response = makeResponse(10, 200);
    const result = truncateResponse(response);
    expect(result.truncated).toBe(true);
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(2000);
  });

  it('drops descriptions if shortening is not enough', () => {
    const response = makeResponse(15, 150);
    const result = truncateResponse(response);
    expect(result.truncated).toBe(true);
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(2000);
  });

  it('trims results array as last resort', () => {
    const response = makeResponse(50, 100);
    const result = truncateResponse(response);
    expect(result.truncated).toBe(true);
    expect(result.results.length).toBeLessThan(50);
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(2000);
  });
});
