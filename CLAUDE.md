# CLAUDE.md — FedSpeak

## About This Repo

**FedSpeak** is a Federal Acronym Decoder API and website built by MetaPhase. It decodes (and encodes) U.S. government acronyms from text or single lookups.

## Project Structure

```
fedspeak/
├── netlify/functions/       — Serverless API endpoints (Netlify Functions v2)
│   ├── decode.ts            — POST /api/decode (acronym → full name)
│   └── encode.ts            — POST /api/encode (full name → acronym)
├── src/
│   ├── shared/              — Core logic shared by API, website, and npm package
│   │   ├── types.ts         — TypeScript interfaces
│   │   ├── decoder.ts       — lookupAcronym(), scanText(), decode()
│   │   ├── encoder.ts       — lookupName(), scanTextForNames(), encode()
│   │   ├── truncate.ts      — Response truncation (2000-char limit)
│   │   └── data/
│   │       └── acronyms.json — Acronym database (sorted alphabetically)
│   ├── components/          — React UI components
│   ├── pages/               — React Router pages
│   └── cli/                 — CLI scaffold (deferred)
├── cli-package/             — npm package scaffold for publishing
├── tests/                   — Vitest test suites
├── public/openapi.json      — OpenAPI 3.1 specification
└── .github/workflows/       — CI/CD (lint → typecheck → test → build)
```

## Build, Test, and Development Commands

- `npm run dev` — Start Vite dev server + Netlify functions (localhost:8888)
- `npm run build` — Production build
- `npm run lint` — ESLint (v9 flat config)
- `npm run typecheck` — TypeScript strict check
- `npm run test` — Vitest in watch mode
- `npm run test:run` — Vitest single run (CI)
- `npm run test:coverage` — Vitest with v8 coverage
- `netlify dev` — Full local dev with functions at localhost:8888

## Tech Stack

- **Runtime:** Node.js 20, TypeScript 5.5
- **API:** Netlify Functions v2 (serverless)
- **Data:** Static JSON (no database)
- **Website:** Vite 7.x + React 18 + Tailwind 3.4 + React Router 7
- **Testing:** Vitest + @vitest/coverage-v8
- **Linting:** ESLint v9 flat config
- **Icons:** lucide-react
- **CI/CD:** GitHub Actions → Netlify

## Coding Style & Conventions

- TypeScript strict mode, no `any` (eslint-disable only for external lib types)
- 2-space indent, single quotes, trailing commas
- ESLint v9 flat config matching MetaPhase org patterns (geoforge, dutystation)
- Prettier for formatting
- Filenames: kebab-case for components/pages, camelCase for shared logic
- React: functional components only, hooks

## Acronym Data Format

Every entry in `acronyms.json` follows this schema:

```json
"ACRONYM": {
  "full": "Full Name",
  "description": "Brief description of what it is/does.",
  "agency": "Parent agency acronym (or 'General')",
  "category": "department|agency|office|bureau|program|process|regulation|system|general",
  "url": "https://optional-official-website.gov",
  "aliases": ["optional", "alternate", "spellings"]
}
```

Keys are sorted alphabetically. Keep descriptions concise (1-2 sentences).

## API Design

Both endpoints support GET (query params) and POST (JSON body):

- **Decode:** `POST /api/decode` — `{ "acronym": "GSA" }` or `{ "text": "The GSA and OMB..." }`
- **Encode:** `POST /api/encode` — `{ "name": "General Services Administration" }` or `{ "text": "..." }`

Responses are progressively truncated to stay under 2000 chars.

## Branching & Deployment

- **`dev`** — Default working branch. All development happens here.
- **`main`** — Production branch. Merges from `dev` via PR trigger Netlify deploy.
- **Domain:** fedspeak.dev (Cloudflare DNS) → fedspeak.netlify.app (Netlify)

## Commit & PR Guidelines

- Commits: imperative mood, prefixed (`feat:`, `fix:`, `docs:`, `chore:`)
- PRs: dev → main for production deploys
- CI must pass (lint, typecheck, test, build) before merge

## Testing

- Tests in `tests/` directory
- `decoder.test.ts` — lookup, scan, alias, edge cases
- `encoder.test.ts` — reverse lookup, name scan
- `truncate.test.ts` — progressive truncation logic
- All tests must pass before committing

## Security

- No authentication on API (public, read-only data)
- CORS headers set in Netlify functions
- No secrets or env vars needed
- Static JSON data, no database, no user input stored
