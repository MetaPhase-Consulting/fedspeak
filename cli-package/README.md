# FedSpeak

[![Netlify Status](https://api.netlify.com/api/v1/badges/597db6a2-1d41-4e63-8b46-b1ac35c79a6d/deploy-status)](https://app.netlify.com/projects/fedspeak/deploys)
[![npm version](https://img.shields.io/npm/v/fedspeak)](https://www.npmjs.com/package/fedspeak)
[![CI](https://github.com/MetaPhase-Consulting/fedspeak/actions/workflows/ci.yml/badge.svg)](https://github.com/MetaPhase-Consulting/fedspeak/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built by MetaPhase](https://img.shields.io/badge/Built%20by-MetaPhase-fb641f)](https://metaphase.tech)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)

**Federal Acronym Decoder** — Decode and encode U.S. government acronyms from text or single lookups.

FedSpeak is a REST API, interactive website, and npm package that expands **1,119 federal government acronyms** with full names, descriptions, agency context, and category classifications.

**Website:** [fedspeak.dev](https://fedspeak.dev)

## Features

- **Decode** — Send any acronym, get the full expansion with description, agency, and category
- **Encode** — Send a full name, get the acronym back
- **Text Scanning** — Paste a block of text, FedSpeak finds and decodes every recognized acronym
- **1,119 Acronyms** — Departments, agencies, cybersecurity, NIST, CMMC, procurement, contract vehicles, legislation, and more
- **REST API** — GET and POST support, JSON responses, CORS enabled
- **npm Package** — Use the decoder directly in your Node.js projects
- **Interactive Demo** — Try it live at [fedspeak.dev](https://fedspeak.dev)

## Quick Start

### API

```bash
# Decode an acronym
curl -X POST https://fedspeak.netlify.app/api/decode \
  -H "Content-Type: application/json" \
  -d '{"acronym": "DOD"}'

# Scan text for acronyms
curl -X POST https://fedspeak.netlify.app/api/decode \
  -H "Content-Type: application/json" \
  -d '{"text": "The DOD and GSA are working with OMB on the new RFP"}'

# Encode a full name to its acronym
curl -X POST https://fedspeak.netlify.app/api/encode \
  -H "Content-Type: application/json" \
  -d '{"name": "General Services Administration"}'
```

### npm Package

```bash
npm install fedspeak
# or
npm install @metaphase-tech/fedspeak
```

```typescript
import { lookupAcronym, scanText, decode, encode, getAcronymCount } from 'fedspeak';

// Single lookup
const result = lookupAcronym('DOD');
console.log(result?.full); // "Department of Defense"

// Scan text for all acronyms
const found = scanText('The DOD and GSA are working with OMB');
found.forEach(r => console.log(`${r.acronym} = ${r.full}`));

// Full decode with response envelope
const response = decode({ text: 'Submit the RFP to the CO at GSA' });
console.log(response.results); // [{ acronym: 'RFP', ... }, { acronym: 'CO', ... }, { acronym: 'GSA', ... }]

// Reverse lookup: full name to acronym
const encoded = encode({ name: 'General Services Administration' });
console.log(encoded.results[0].acronym); // "GSA"

// Total count
console.log(getAcronymCount()); // 1069
```

## API Reference

### Decode

```
POST /api/decode
GET  /api/decode?acronym=GSA
GET  /api/decode?text=The+DOD+and+GSA+work+with+OMB
```

**Single lookup request:**

```json
{ "acronym": "GSA" }
```

**Text scan request:**

```json
{ "text": "The DOD and GSA are working with OMB on the new RFP" }
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

### Encode

```
POST /api/encode
GET  /api/encode?name=General+Services+Administration
GET  /api/encode?text=The+Department+of+Defense+is+working+with...
```

**Single lookup request:**

```json
{ "name": "General Services Administration" }
```

**Text scan request:**

```json
{ "text": "The Department of Defense and General Services Administration..." }
```

## npm Package API

### Functions

| Function | Description |
|----------|-------------|
| `lookupAcronym(query)` | Look up a single acronym. Returns `DecodedResult` or `null` |
| `scanText(text)` | Scan text for all recognized acronyms. Returns `DecodedResult[]` |
| `decode(request)` | Full decode with response envelope (`{ acronym }` or `{ text }`) |
| `lookupName(query)` | Reverse lookup: full name to acronym. Returns `EncodedResult` or `null` |
| `scanTextForNames(text)` | Scan text for full names, return their acronyms. Returns `EncodedResult[]` |
| `encode(request)` | Full encode with response envelope (`{ name }` or `{ text }`) |
| `getAllAcronyms()` | Get sorted array of all acronym keys |
| `getAcronymCount()` | Get total number of acronyms in the database |
| `truncateResponse(response)` | Truncate response to fit 2000-char limit |

### TypeScript Types

```typescript
import type {
  AcronymCategory,  // 'department' | 'agency' | 'office' | 'bureau' | 'program' | 'process' | 'regulation' | 'system' | 'general'
  AcronymEntry,     // { full, description, agency, category, url?, aliases? }
  AcronymData,      // Record of acronym key to AcronymEntry
  DecodedResult,    // Single decode result
  DecodeResponse,   // Full decode response envelope
  DecodeRequest,    // { acronym?: string; text?: string }
  EncodedResult,    // Single encode result
  EncodeResponse,   // Full encode response envelope
  EncodeRequest,    // { name?: string; text?: string }
} from 'fedspeak';
```

## Acronym Coverage

1,119 entries across these categories:

| Category | Examples |
|----------|----------|
| **Federal departments** | DOD, DOJ, DOE, HHS, DHS, VA, DOS, DOT, ... |
| **Agencies & offices** | NASA, GSA, EPA, SBA, CISA, NIST, OPM, FEMA, ... |
| **Cybersecurity & NIST** | CMMC, FedRAMP, FISMA, CVE, CVSS, ZTA, ATT&CK, CSF, ... |
| **Identity & auth** | IAL, AAL, FAL, MFA, FIDO, PIV, CAC, SSO, ... |
| **Procurement & acquisition** | FAR, DFARS, GWAC, IDIQ, BPA, RFP, CO, COR, ... |
| **Contract vehicles** | OASIS+, CIO-SP4, SEWP VI, 8(a) STARS III, ALLIANT 2, ... |
| **Legislation** | FITARA, FOIA, APA, NEPA, HIPAA, FISMA, ACA, ... |
| **IT & systems** | FedRAMP, ATO, HSPD-12, eMASS, Login.gov, ... |
| **Budget & finance** | OMB, CBO, GAO, PPBE, CR, ... |
| **HR & personnel** | OPM, GS, SES, USERRA, ... |

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
git clone https://github.com/MetaPhase-Consulting/fedspeak.git
cd fedspeak
npm install
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npx netlify dev` | Full local dev with API at localhost:8888 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript strict check |
| `npm run test:run` | Run tests once |
| `npm run test` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

### Project Structure

```
fedspeak/
├── netlify/functions/       Serverless API endpoints
│   ├── decode.ts            POST /api/decode
│   └── encode.ts            POST /api/encode
├── src/
│   ├── shared/              Core logic (shared by API, website, npm package)
│   │   ├── decoder.ts       lookupAcronym(), scanText(), decode()
│   │   ├── encoder.ts       lookupName(), scanTextForNames(), encode()
│   │   ├── truncate.ts      Response truncation
│   │   ├── types.ts         TypeScript interfaces
│   │   └── data/
│   │       └── acronyms.json
│   ├── components/          React UI components
│   └── pages/               React Router pages
├── cli-package/             npm package for publishing
├── tests/                   Vitest test suites
├── public/openapi.json      OpenAPI 3.1 specification
└── .github/workflows/       CI/CD pipelines
```

### Tech Stack

| Layer | Choice |
|-------|--------|
| Runtime | Node.js 20, TypeScript 5.5 |
| API | Netlify Functions v2 (serverless) |
| Data | Static JSON (no database) |
| Website | Vite + React 18 + Tailwind CSS + React Router |
| Testing | Vitest + @vitest/coverage-v8 |
| CI/CD | GitHub Actions |
| Deploy | Netlify |

### Adding Acronyms

Add entries to `src/shared/data/acronyms.json` in alphabetical order:

```json
"ACRONYM": {
  "full": "Full Name",
  "description": "Brief description (1-2 sentences).",
  "agency": "Parent agency acronym or General",
  "category": "department|agency|office|bureau|program|process|regulation|system|general",
  "url": "https://optional-official-website.gov",
  "aliases": ["optional", "alternate", "spellings"]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch from `dev`
3. Make your changes
4. Ensure `npm run lint`, `npm run typecheck`, and `npm run test:run` all pass
5. Open a PR to `dev`

### Branching

- **`dev`** — Default branch, active development
- **`main`** — Production, deploys to Netlify
- Feature branches merge into `dev` via PR
- `dev` merges into `main` via PR for releases

## License

[MIT](LICENSE) &copy; [MetaPhase](https://metaphase.tech)
