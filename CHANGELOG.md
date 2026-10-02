# Changelog

All notable changes to FedSpeak are documented here. Versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- Toolchain moved to Node 22 (`.nvmrc`, `engines`, Netlify `NODE_VERSION`, CI). The published npm package still supports Node 20.
- Major upgrades from the first monthly Dependabot batch: React 19, React Router 8 (`react-router-dom` removed; imports come from `react-router`), Vite 8, Tailwind CSS 4 (CSS-first config, `@tailwindcss/postcss`, `tailwind.config.js` removed, v3 border-color default preserved), Vitest 5, ESLint 10 with `eslint-plugin-react-hooks` 7, `@netlify/functions` 6, zod 4, lucide-react 1.x, `@types/node` 26.
- TypeScript stays on 5.9: `typescript-eslint` 8 does not yet support TypeScript 6/7.
- Header mobile menu closes on navigation without a state-setting effect; Search page sort buttons and pagination are render helpers rather than components defined inside render (new react-hooks rules).

## [1.1.0] - 2026-10-02

### Added
- **MCP server.** FedSpeak is now a Model Context Protocol server. Remote Streamable HTTP endpoint at `https://fedspeak.dev/mcp` (stateless, no auth) and a `fedspeak-mcp` stdio binary in the npm package. Tools: `decode_acronym`, `scan_text`, `encode_name`, `list_acronyms`. Resources: `fedspeak://agencies`, `fedspeak://categories`. `createFedSpeakServer()` is exported for embedding.
- **Agent discovery files.** `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap.xml`; `openapi.json` gains `externalDocs` and `x-mcp`.
- **37 acronyms** (1,119 → 1,156), covering the 2025–26 federal digital landscape: America.gov, National Design Studio (NDS), USAi, USA.gov, TTS, USWDS, DAP, Cloud.gov, Search.gov, Data.gov, Code.gov, Regulations.gov, Grants.gov, Pay.gov, Vote.gov, Challenge.gov, Performance.gov, Digital.gov, ID.me, PRAC, OFCIO, ONCD, OSC, PMF, USAJOBS, ICR, FRN, NSPM, NEA, NEH, IMLS, CPB, AmeriCorps, Schedule F, Schedule Policy/Career, MAHA, Genesis Mission.
- Aliases: `DEI` → DEIA, `U.S. DOGE Service` → USDS, `Schedule P/C`, `MAHA Commission`, `National Design Studio`.
- ChallengeAI federal delivery layer under `.challengeai/` (docs only).
- `.github/dependabot.yml` with weekly grouped minor/patch updates; CI now runs on pull requests to `dev` and supports manual dispatch.

### Changed
- Dated status sentences appended to USAID, CFPB, ED, USDS, DOGE, 18F, DEIA, DEIA-EO, AA, USAGM, USIP. Original text retained; nothing removed.
- `agency` set to `DOW` on the 130 entries still tagged `DOD`, matching the September 2025 rename.
- Dependencies: react-router 7.18, vitest 4.1, vite 7.3.6, eslint 9.39.5, and friends. `npm audit` reports 0 vulnerabilities.

### Fixed
- Redundant aliases `COOP` (on CONOPS2) and `USSS` (on SS) removed; both shadowed entries that exist as their own keys. New `tests/data.test.ts` guards sorted keys, valid categories, resolvable agency codes, https URLs, and alias/key collisions.
- **npm package could not be loaded by Node directly.** Compiled ESM used extensionless relative imports and a bare JSON import. Shared sources now use `.js` specifiers and `with { type: 'json' }`; the package compiles with `module: NodeNext`.

## [1.0.0] - 2026-02-21

Initial public release: decode/encode REST API, website with search and text scan, npm package and CLI, 1,119 acronyms.
