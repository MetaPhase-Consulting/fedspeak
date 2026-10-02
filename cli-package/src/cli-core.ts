// FedSpeak CLI core: pure functions so the binary stays thin and testable.
import { decode, getAcronymCount } from './shared/decoder.js';
import { encode } from './shared/encoder.js';
import type { DecodedResult, EncodedResult } from './shared/types.js';

export interface CliOptions {
  terms: string[];
  text?: string;
  encode?: string;
  json: boolean;
  help: boolean;
  version: boolean;
}

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export const HELP = `fedspeak — Federal Acronym Decoder

Usage:
  fedspeak <ACRONYM> [ACRONYM ...]     Decode one or more acronyms
  fedspeak --text "<passage>"          Find every known acronym in a passage
  fedspeak --encode "<full name>"      Reverse lookup: full name to acronym
  fedspeak --json ...                  Emit JSON instead of formatted text

Options:
  -t, --text <passage>    Scan free text
  -e, --encode <name>     Encode a full name
  -j, --json              JSON output
  -h, --help              Show this help
  -V, --version           Show version

Examples:
  fedspeak GSA
  fedspeak DOW OMB CISA
  fedspeak --text "The GSA and OMB released the RFP"
  fedspeak --encode "General Services Administration"

Web: https://fedspeak.dev   API: https://fedspeak.dev/api/decode   MCP: https://fedspeak.dev/mcp`;

export function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { terms: [], json: false, help: false, version: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '-h': case '--help': opts.help = true; break;
      case '-V': case '--version': opts.version = true; break;
      case '-j': case '--json': opts.json = true; break;
      case '-t': case '--text': opts.text = argv[++i]; break;
      case '-e': case '--encode': opts.encode = argv[++i]; break;
      default:
        if (arg.startsWith('--text=')) opts.text = arg.slice(7);
        else if (arg.startsWith('--encode=')) opts.encode = arg.slice(9);
        else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
        else opts.terms.push(arg);
    }
  }
  return opts;
}

export function formatDecoded(r: DecodedResult): string {
  const lines = [`${r.acronym} — ${r.full}`, `  ${r.description}`, `  Agency: ${r.agency} | Category: ${r.category}`];
  if (r.url) lines.push(`  ${r.url}`);
  return lines.join('\n');
}

export function formatEncoded(r: EncodedResult): string {
  return `${r.full} → ${r.acronym}\n  Agency: ${r.agency} | Category: ${r.category}`;
}

export function run(argv: string[], version: string): CliResult {
  let opts: CliOptions;
  try {
    opts = parseArgs(argv);
  } catch (err) {
    return { stdout: '', stderr: `${(err as Error).message}\n\n${HELP}`, exitCode: 2 };
  }

  if (opts.help) return { stdout: HELP, stderr: '', exitCode: 0 };
  if (opts.version) return { stdout: `fedspeak ${version} (${getAcronymCount()} acronyms)`, stderr: '', exitCode: 0 };

  if (opts.encode !== undefined) {
    const res = encode({ name: opts.encode });
    if (opts.json) return { stdout: JSON.stringify(res, null, 2), stderr: '', exitCode: res.success ? 0 : 1 };
    if (!res.success) return { stdout: '', stderr: `No acronym found for "${opts.encode}".`, exitCode: 1 };
    return { stdout: res.results.map(formatEncoded).join('\n\n'), stderr: '', exitCode: 0 };
  }

  if (opts.text !== undefined) {
    const res = decode({ text: opts.text });
    if (opts.json) return { stdout: JSON.stringify(res, null, 2), stderr: '', exitCode: 0 };
    if (res.count === 0) return { stdout: 'No known acronyms found.', stderr: '', exitCode: 0 };
    return { stdout: res.results.map(formatDecoded).join('\n\n'), stderr: '', exitCode: 0 };
  }

  if (opts.terms.length === 0) return { stdout: HELP, stderr: '', exitCode: 2 };

  const results = opts.terms.map(term => ({ term, res: decode({ acronym: term }) }));
  const misses = results.filter(r => !r.res.success).map(r => r.term);

  if (opts.json) {
    const payload = results.length === 1 ? results[0].res : results.map(r => r.res);
    return { stdout: JSON.stringify(payload, null, 2), stderr: '', exitCode: misses.length ? 1 : 0 };
  }

  const out = results
    .map(({ term, res }) => (res.success ? formatDecoded(res.results[0]) : `${term} — not found`))
    .join('\n\n');
  const stderr = misses.length ? `Not found: ${misses.join(', ')}` : '';
  return { stdout: out, stderr, exitCode: misses.length ? 1 : 0 };
}
