# Agent Instructions — FedSpeak

## Context

FedSpeak is a Federal Acronym Decoder maintained by MetaPhase. The core data lives in `src/shared/data/acronyms.json`. The API runs as Netlify Functions, the website is Vite + React.

## When Adding Acronyms

1. **Read the existing file first** — `src/shared/data/acronyms.json` has 600+ entries. Do not create duplicates.
2. **Follow the exact schema:**
   ```json
   "ACRONYM": {
     "full": "Full Name",
     "description": "Brief 1-2 sentence description.",
     "agency": "Parent agency acronym or 'General'",
     "category": "department|agency|office|bureau|program|process|regulation|system|general"
   }
   ```
3. **Optional fields:** `url` (official website), `aliases` (alternate spellings/abbreviations)
4. **Keep keys sorted alphabetically** in the JSON file.
5. **Descriptions should be concise** — what the thing IS or DOES, not its full history.
6. **Agency field** — use the parent department acronym (e.g., `"DOD"` for DISA, `"DHS"` for TSA, `"General"` for cross-cutting terms).
7. **Category choices:**
   - `department` — Cabinet-level departments (DOD, HHS, etc.)
   - `agency` — Independent agencies or major sub-agencies
   - `office` — Named offices within agencies
   - `bureau` — Named bureaus within departments
   - `program` — Government programs (SNAP, TRICARE, etc.)
   - `process` — Acquisition processes, reviews, milestones
   - `regulation` — Laws, acts, regulations, standards
   - `system` — IT systems, databases, platforms
   - `general` — Everything else (titles, terms, concepts)

## When Modifying Code

- Run `npm run lint && npm run typecheck && npm run test:run` before committing.
- The shared logic in `src/shared/` is used by the API functions, the website, and the npm package.
- Changes to `types.ts` affect all three consumers.
- The `truncate.ts` module has function overloads for both DecodeResponse and EncodeResponse.

## When Working on the API

- Functions are in `netlify/functions/` using Netlify Functions v2 format.
- Both decode and encode support GET (query params) and POST (JSON body).
- Always include CORS headers in responses.
- Responses are progressively truncated to stay under 2000 chars (handled by truncate).

## When Working on the Website

- React 18 + React Router 7 + Tailwind 3.4
- Components in `src/components/`, pages in `src/pages/`
- The TryItDemo component uses the decoder directly (client-side), not the API.
- Swagger UI is loaded from CDN in ApiReference.tsx.

## Git Workflow

- Work in `dev` branch (default).
- PR to `main` for production deploys to Netlify.
- Commit messages: imperative mood with prefix (`feat:`, `fix:`, `docs:`, `chore:`).
