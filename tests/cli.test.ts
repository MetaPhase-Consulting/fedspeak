import { describe, it, expect } from 'vitest';
import { parseArgs, run, HELP } from '../cli-package/src/cli-core';

describe('fedspeak CLI', () => {
  it('parses positional terms and flags', () => {
    const o = parseArgs(['GSA', 'OMB', '--json']);
    expect(o.terms).toEqual(['GSA', 'OMB']);
    expect(o.json).toBe(true);
  });

  it('decodes a single acronym in the documented format', () => {
    const r = run(['GSA'], '1.2.0');
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain('GSA — General Services Administration');
    expect(r.stdout).toContain('Agency: GSA | Category: agency');
    expect(r.stdout).toContain('https://www.gsa.gov');
  });

  it('decodes multiple acronyms and reports misses on stderr with exit 1', () => {
    const r = run(['DOW', 'XYZZY'], '1.2.0');
    expect(r.exitCode).toBe(1);
    expect(r.stdout).toContain('DOW — Department of War');
    expect(r.stdout).toContain('XYZZY — not found');
    expect(r.stderr).toContain('XYZZY');
  });

  it('scans text', () => {
    const r = run(['--text', 'The GSA and OMB released the RFP'], '1.2.0');
    expect(r.exitCode).toBe(0);
    for (const a of ['GSA', 'OMB', 'RFP']) expect(r.stdout).toContain(`${a} — `);
  });

  it('encodes a full name', () => {
    const r = run(['--encode', 'General Services Administration'], '1.2.0');
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain('→ GSA');
  });

  it('emits JSON', () => {
    const r = run(['GSA', '--json'], '1.2.0');
    const j = JSON.parse(r.stdout);
    expect(j.success).toBe(true);
    expect(j.results[0].acronym).toBe('GSA');
  });

  it('shows help with no args (exit 2) and on --help (exit 0)', () => {
    expect(run([], '1.2.0')).toMatchObject({ stdout: HELP, exitCode: 2 });
    expect(run(['--help'], '1.2.0')).toMatchObject({ stdout: HELP, exitCode: 0 });
  });

  it('rejects unknown options', () => {
    const r = run(['--bogus'], '1.2.0');
    expect(r.exitCode).toBe(2);
    expect(r.stderr).toContain('Unknown option');
  });

  it('prints version with acronym count', () => {
    expect(run(['--version'], '1.2.0').stdout).toMatch(/^fedspeak 1\.2\.0 \(\d+ acronyms\)$/);
  });
});
