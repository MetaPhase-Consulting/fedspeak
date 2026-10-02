# FedSpeak Agent Guidelines

Persistent repo-level guidance for AI coding agents working in FedSpeak.
Read this before starting work; update it whenever the user gives new standing guidance.

## Project

- Repo: FedSpeak — Federal Acronym Decoder (https://github.com/MetaPhase-Consulting/fedspeak)
- Hosting: Netlify (SPA + Functions v2). Production domain `fedspeak.dev` (Cloudflare DNS → `fedspeak.netlify.app`).
- Surfaces: website, REST API (`/api/decode`, `/api/encode`), MCP server (`/mcp` remote, `fedspeak-mcp` stdio), npm package (`fedspeak` and `@metaphase-tech/fedspeak`), CLI.
- Data: one static JSON file, `src/shared/data/acronyms.json`. No database, no auth, no secrets, no env vars, no user data stored.
- Default branch: `dev`. Production branch: `main`.
- Built with **ChallengeAI**, MetaPhase's accelerator suite for federal software delivery. The federal layer lives in [`.challengeai/`](.challengeai/); [`CHALLENGEAI.md`](CHALLENGEAI.md) is the index. FedSpeak is not itself a federal information system; `.challengeai/profile.yml` says so directly.

## Reading Order

1. `README.md` — overview, quick start, API and package reference, project structure.
2. This file.
3. [`CHALLENGEAI.md`](CHALLENGEAI.md) and the [`.challengeai/`](.challengeai/) folder — federal delivery standards and how this repo measures against them.
4. `CONTRIBUTING.md` — how to add acronyms, commit style, git workflow.
5. `CHANGELOG.md` — what shipped in each version.
6. `public/llms.txt` — the agent-facing description of the service (keep it accurate when endpoints or counts change).

## Standing Preferences

- **No AI attribution anywhere.** No `Co-Authored-By` trailers naming a model or vendor, no "Generated with" lines, no model names in commit messages, PR titles, PR bodies, branch names, or code comments. Commits and PRs are authored by humans only. If a tool injects such a trailer, strip it before pushing.
- **This file and the ChallengeAI layer are the only agent guidance.** Do not add vendor- or tool-specific instruction files or dot-folders. Conventions belong in `README.md`, `CONTRIBUTING.md`, or here; federal delivery standards belong in [`.challengeai/`](.challengeai/) with [`CHALLENGEAI.md`](CHALLENGEAI.md) as the index.
- Branch names: short, descriptive, professional (`feat/data-2026-refresh`, `chore/security-deps-batch`).
- Commit messages: imperative mood, prefixed (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `release:`).
- Refer to the company as **"MetaPhase"** in user-facing copy. Full legal name only in `LICENSE`.
- Never remove entries from `.gitignore` without explicit permission.
- Prefer one PR per unit of work. When asked, collapse stacked PRs into a single PR to `dev` rather than leaving several open.

## Data Rules (acronyms.json)

- **Add missing terms, update stale ones, delete nothing.** Old names stay decodable (see `DOD` → `DOW`).
- **No editorial commentary.** Descriptions state facts. For 2025–26 reorganizations, keep the original sentence and append a dated, neutral status sentence, e.g. "Revoked by Executive Order 14151 on January 20, 2025." Verify with a current source before writing.
- Schema per entry: `full`, `description` (1–2 sentences, ≤400 chars), `agency` (a key in the file or `General`), `category` (one of `department|agency|office|bureau|program|process|regulation|system|general`), optional `url` (https) and `aliases`.
- Keys sorted alphabetically. Aliases must not collide with any key or other alias (case-insensitive). `tests/data.test.ts` enforces all of this.
- `agency` for Department of War components is `DOW`, not `DOD`.
- Hardcoded counts live in `README.md`, `cli-package/README.md`, `index.html`, and `public/llms.txt`. Update them when the total changes.
- After any change under `src/shared/` or to the data, run `scripts/sync-cli-package.sh` and commit the synced copies in `cli-package/`.
- Known open question: `SSA` is Source Selection Authority; Social Security Administration has no entry. Do not resolve this without the user.

## Repository Map

- `netlify/functions/` — `decode.ts`, `encode.ts` (REST), `mcp.ts` (MCP Streamable HTTP, stateless, CORS). Routed in `netlify.toml`; the `/mcp` redirect must stay ahead of the SPA catch-all.
- `src/shared/` — core logic shared by API, website, and npm package: `types.ts`, `decoder.ts`, `encoder.ts`, `truncate.ts` (2000-char progressive truncation), `mcp-server.ts` (`createFedSpeakServer()`), `data/acronyms.json`.
- `src/components/`, `src/pages/` — React UI. Routes: `/`, `/search`, `/scan`, `/docs`, `/api`, `/package`, `/cli`.
- `cli-package/` — published npm package. `src/shared/` here is a synced copy, never edited directly. `src/mcp.ts` is the `fedspeak-mcp` stdio binary.
- `public/` — `openapi.json`, `llms.txt`, `llms-full.txt`, `robots.txt`, `sitemap.xml`, manifest, favicon.
- `tests/` — Vitest: `decoder`, `encoder`, `truncate`, `mcp`, `data`.
- `scripts/sync-cli-package.sh` — copies shared sources, data, README, LICENSE into `cli-package/`.
- `.github/workflows/ci.yml` — lint → typecheck → test → build on Node 20. `dependabot.yml` — one consolidated version-update PR per month (all npm deps in both manifests, patch through major) plus one monthly PR for GitHub Actions. Security advisories are the only exception: those arrive as individual, immediate PRs and should be merged promptly. Do not change this cadence without the user.

## Module Format

Files under `src/shared/` use `.js` extensions on relative imports and `with { type: 'json' }` on JSON imports so the npm package compiles to Node-loadable ESM (`cli-package/tsconfig.json` uses `module: NodeNext`). Vite, Vitest, ESLint, and Netlify's esbuild all accept this. Do not strip the extensions or attributes.

## MCP Server

- Tools: `decode_acronym`, `scan_text`, `encode_name`, `list_acronyms`. Resources: `fedspeak://agencies`, `fedspeak://categories`.
- All tools are read-only and idempotent; keep the annotations that say so. No LLM calls, no network calls, data only.
- The remote endpoint is stateless (`sessionIdGenerator: undefined`, JSON responses). Do not add session state; Netlify functions do not share memory.
- `MCP_SERVER_INFO.version` in `src/shared/mcp-server.ts` should match the package version.

## Tech Stack

- Node 20 in CI (`.github/workflows/ci.yml`); `cli-package` declares `engines.node >= 20`. Check `engines` of any new dependency against Node 20 before installing.
- TypeScript 5.9 strict, no `any`. 2-space indent, single quotes, trailing commas.
- Vite 7 + React 18 + Tailwind 3.4 + React Router 7. Vitest 4. ESLint 9 flat config. lucide-react icons.
- `@modelcontextprotocol/sdk` + `zod` 3 for MCP.
- `package-lock.json` is the single lockfile.

## Branching and Releases

- Feature branches off `dev`; PRs target `dev` (`gh pr create --base dev`). `dev → main` PRs deploy production.
- Release checklist: bump `version` in `package.json`, `cli-package/package.json`, and `public/openapi.json`; update `MCP_SERVER_INFO.version`; add a `CHANGELOG.md` entry; sync `cli-package`; merge to `main`; tag `vX.Y.Z`; the user publishes `cli-package` under both npm names (agents cannot publish from this machine).
- CI note: in this repo GitHub Actions has not been firing on `push`/`pull_request`. Until an org admin fixes it, trigger a run with `gh workflow run ci.yml --ref <branch>` and wait for it before calling a PR ready.

## PR Review Workflow

1. Fetch comments: `gh api repos/MetaPhase-Consulting/fedspeak/pulls/{N}/comments` and `.../issues/{N}/comments`.
2. Triage and fix every actionable item.
3. Reply inline with `-F in_reply_to={comment_id}`. Never leave review comments unanswered on a PR marked ready.
4. Push, re-run CI, confirm green.

## Release Gates

Every PR must pass locally and in CI:

- `npm run lint`
- `npm run typecheck`
- `npm run test:run`
- `npm run build`
- `npm audit` → 0 vulnerabilities (dev dependencies included)
- For anything touching `src/shared/` or the data: `scripts/sync-cli-package.sh`, then `cd cli-package && npm run build`.
- For anything touching `netlify/`: `netlify dev --offline` smoke of `/api/decode` and `/mcp`.

## Never Do Autonomously

- Merge PRs, deploy to `main`, tag releases, or publish to npm.
- Delete acronym entries or rewrite descriptions in a way that adds opinion.
- Close Dependabot PRs before the superseding change has merged, or change the monthly consolidated-PR cadence.
- Add authentication, telemetry, or any form of user data collection.

## Maintenance Rule

When the user gives process feedback, record it here so every future session picks it up. Keep this file the single source of repo-specific agent guidance; federal standards stay in `.challengeai/`. Do not create parallel agent files that would need syncing.
