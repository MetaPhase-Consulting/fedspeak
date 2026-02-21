# FedSpeak

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![Built by MetaPhase](https://img.shields.io/badge/Built%20by-MetaPhase-fb641f)](https://metaphase.tech)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://app.netlify.com/projects/fedspeak/deploys)
[![npm](https://img.shields.io/npm/v/fedspeak)](https://www.npmjs.com/package/fedspeak)
[![CI](https://github.com/MetaPhase-Consulting/fedspeak/actions/workflows/ci.yml/badge.svg)](https://github.com/MetaPhase-Consulting/fedspeak/actions/workflows/ci.yml)

**Federal Acronym Decoder** — Decode U.S. government acronyms from text or single lookups.

FedSpeak is a REST API, interactive website, and npm package that expands 215+ federal government acronyms with full names, descriptions, agency context, and category classifications.

## Features

- **Single Lookup** — Send any acronym, get the full expansion with description, agency, and category
- **Text Scanning** — Paste a block of text, FedSpeak finds and decodes every recognized acronym
- **REST API** — GET and POST support, JSON responses, CORS enabled
- **Join39 Ready** — Built for the Join39 Agent Store with automatic 2000-char response truncation
- **215+ Acronyms** — Departments, agencies, procurement, IT/cyber, military, HR, finance, and more
- **Interactive Demo** — Try it live at [fedspeak.dev](https://fedspeak.dev)

## Quick Start

### Local Development

```bash
git clone https://github.com/MetaPhase-Consulting/fedspeak.git
cd fedspeak
npm install
npm run dev
```

### With Netlify Functions (API)

```bash
npx netlify dev
```

This starts the full stack locally:
- **Website:** http://localhost:8888
- **API:** http://localhost:8888/api/decode

## API Usage

### Endpoint

```
POST https://fedspeak.dev/api/decode
```

### Single Lookup

```bash
curl -X POST https://fedspeak.dev/api/decode \
  -H "Content-Type: application/json" \
  -d '{"acronym": "GSA"}'
```

**Response:**
```json
{
  "success": true,
  "query": "GSA",
  "mode": "single",
  "results": [{
    "acronym": "GSA",
    "full": "General Services Administration",
    "description": "Federal agency managing government buildings, procurement, and technology solutions.",
    "agency": "GSA",
    "category": "agency",
    "url": "https://www.gsa.gov"
  }],
  "count": 1,
  "truncated": false
}
```

### Text Scan

```bash
curl -X POST https://fedspeak.dev/api/decode \
  -H "Content-Type: application/json" \
  -d '{"text": "The DOW and GSA are working with OMB on the new RFP"}'
```

**Response:**
```json
{
  "success": true,
  "query": "The DOW and GSA are working with OMB on the new RFP",
  "mode": "scan",
  "results": [
    { "acronym": "DOW", "full": "Department of War", "..." : "..." },
    { "acronym": "GSA", "full": "General Services Administration", "..." : "..." },
    { "acronym": "OMB", "full": "Office of Management and Budget", "..." : "..." },
    { "acronym": "RFP", "full": "Request for Proposal", "..." : "..." }
  ],
  "count": 4,
  "truncated": false
}
```

### GET Support

```bash
curl "https://fedspeak.dev/api/decode?acronym=GSA"
curl "https://fedspeak.dev/api/decode?text=The+DOW+and+GSA+work+with+OMB"
```

## npm Package

```bash
npm install fedspeak
```

```typescript
import { decode, lookupAcronym, scanText } from 'fedspeak';

// Single lookup
const result = lookupAcronym('GSA');
console.log(result?.full); // "General Services Administration"

// Text scan
const results = scanText('The DOW and GSA work with OMB');
results.forEach(r => console.log(`${r.acronym} = ${r.full}`));

// Full decode (returns structured response)
const response = decode({ text: 'The DOW and GSA work with OMB' });
console.log(response.results);
```

## Acronym Categories

| Category | Examples |
|---|---|
| **department** | DOW, DOJ, DOS, HHS, VA |
| **agency** | GSA, EPA, NASA, FEMA, FBI, CIA |
| **office** | OMB, OSTP, ODNI, OIG |
| **bureau** | IRS, BLS, BLM, NPS, ATF |
| **program** | FedRAMP, CMMC, OASIS, SBIR, TSP |
| **process** | RFP, RFI, SOW, IDIQ, ATO, FFP |
| **regulation** | FAR, FISMA, FOIA, HIPAA, NDAA |
| **system** | SAM, CAC, PIV, GPC, FPDS |
| **general** | CIO, SME, POC, FTE, PII, CUI |

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 20, TypeScript 5.5 |
| API | Netlify Functions v2 (serverless) |
| Data | Static JSON (no database) |
| Website | Vite + React 18 + Tailwind CSS |
| Testing | Vitest + @vitest/coverage-v8 |
| CI/CD | GitHub Actions |
| Deploy | Netlify |

## Project Structure

```
fedspeak/
├── netlify/functions/
│   └── decode.ts              ← API endpoint
├── src/
│   ├── shared/                ← Core logic (shared by API, website, npm)
│   │   ├── types.ts
│   │   ├── decoder.ts         ← lookupAcronym(), scanText(), decode()
│   │   ├── truncate.ts        ← Join39 2000-char truncation
│   │   └── data/
│   │       └── acronyms.json  ← 215+ federal acronyms
│   ├── components/            ← React components
│   ├── pages/                 ← Route pages
│   └── cli/                   ← CLI (deferred)
├── tests/                     ← Vitest tests
└── cli-package/               ← npm package
```

## Development

```bash
# Install dependencies
npm install

# Start dev server (website only)
npm run dev

# Start with Netlify Functions
npx netlify dev

# Run tests
npm run test:run

# Lint
npm run lint

# Type check
npm run typecheck

# Build
npm run build
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

## Join39 Integration

FedSpeak is designed for the [Join39 Agent Store](https://join39.com) and can be installed on any Join39 bot (e.g., AGENT-M).

**Registration details:**
- **Name:** FedSpeak
- **Endpoint:** `https://fedspeak.dev/api/decode`
- **Method:** POST
- **Schema:** `{ "text": "string" }` or `{ "acronym": "string" }`

Response truncation is automatic — if the JSON response exceeds 2000 characters, FedSpeak progressively shortens descriptions, then drops them, then trims the results array.

## Contributing

Contributions are welcome! Please open an issue or pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request against `dev`

## Gitflow

- `dev` — default branch, active development
- `main` — production deploys to Netlify
- Feature branches merge into `dev` via PR
- `dev` merges into `main` via PR for production releases

## License

[MIT](LICENSE) &copy; [MetaPhase Consulting](https://metaphase.tech)
