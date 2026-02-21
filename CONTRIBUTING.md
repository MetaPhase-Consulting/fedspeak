# Contributing to FedSpeak

Thanks for your interest in contributing to FedSpeak! This guide covers everything you need to get started.

## Getting Started

```bash
git clone https://github.com/MetaPhase-Consulting/fedspeak.git
cd fedspeak
npm install
npm run dev
```

The dev server runs at `localhost:8888` with hot reload and Netlify Functions.

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Netlify Functions |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript strict check |
| `npm run test:run` | Run tests (single run) |
| `npm run test` | Run tests (watch mode) |

## Adding Acronyms

The acronym database lives in `src/shared/data/acronyms.json`. To add new entries:

1. Check that the acronym doesn't already exist in the file.
2. Add the entry following this schema:

```json
"ACRONYM": {
  "full": "Full Name",
  "description": "Brief 1-2 sentence description of what it is or does.",
  "agency": "Parent agency acronym (or 'General')",
  "category": "department|agency|office|bureau|program|process|regulation|system|general",
  "url": "https://optional-official-website.gov"
}
```

3. Keep entries sorted alphabetically by key.
4. Descriptions should be concise — what the thing IS or DOES, not its history.
5. After adding entries, run `bash scripts/sync-cli-package.sh` to sync to the npm package.

### Category Guide

- `department` — Cabinet-level departments (DOD, HHS, etc.)
- `agency` — Independent agencies or major sub-agencies
- `office` — Named offices within agencies
- `bureau` — Named bureaus within departments
- `program` — Government programs (SNAP, TRICARE, etc.)
- `process` — Acquisition processes, reviews, milestones
- `regulation` — Laws, acts, regulations, standards
- `system` — IT systems, databases, platforms
- `general` — Everything else (titles, terms, concepts)

## Code Changes

- All code is TypeScript with strict mode enabled.
- Run `npm run lint && npm run typecheck && npm run test:run` before submitting.
- The shared logic in `src/shared/` is used by the API, website, and npm package — changes there affect all three.
- Follow existing code style: 2-space indent, single quotes, trailing commas.

## Git Workflow

1. Create a feature branch from `dev`.
2. Make your changes and ensure all checks pass.
3. Open a PR targeting `dev`.
4. PRs from `dev` to `main` trigger production deploys.

### Commit Messages

Use imperative mood with a prefix:

- `feat:` — New feature or acronym additions
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `chore:` — Maintenance, dependencies, CI

## Reporting Issues

Open an issue on [GitHub Issues](https://github.com/MetaPhase-Consulting/fedspeak/issues) with:

- A clear description of the problem or suggestion
- Steps to reproduce (for bugs)
- Expected vs actual behavior

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
