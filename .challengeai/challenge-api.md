# ChallengeAPI

The API: its contract, what it accepts, and what it discloses.

## Covers

API contracts, input validation, interoperability, versioning, rate limiting,
and federal API governance.

## The requirement

- **SP 800-53 Rev. 5** System and Communications Protection (SC) and System and
  Information Integrity (SI-10, input validation).
- **The Federal Source Code Policy and API guidance** expect government APIs to
  be documented, versioned, and stable for the people who build against them.
- **OMB guidance on open data** expects machine-readable access where the data
  is public.

## The contract

An API is a promise to people who cannot be consulted before it changes.

- **Versioned in the path**, moving independently of the product release, so
  adding a version does not by itself require a major release of the system.
- **Published as a machine-readable document**, so a client can generate against
  it rather than read prose.
- **Validated at the edge of the process.** Every parameter is parsed and
  bounded before it reaches a query. Unbounded pagination and unbounded result
  sizes are both denial-of-service vectors and cost vectors.
- **Health reported against dependencies**, not just process liveness. A process
  that is up and cannot reach its data is not healthy.
- **Rate limited at the edge**, so a burst is refused rather than queued.

## Errors

An error names what was wrong with the request without describing the internals
of the system. A stack trace, a driver message, or a query fragment in a
response body is an information disclosure finding.

## In this repository

FedSpeak's is a genuinely public API — two routes, `POST/GET /api/decode` and
`POST/GET /api/encode` (`netlify/functions/decode.ts`, `encode.ts`, redirected
from `/api/*` to `/.netlify/functions/*` in `netlify.toml`), each accepting a
single lookup (`acronym`/`name`) or a text-scan request (`text`), backed by
the same static `src/shared/data/acronyms.json` the website and npm package
read directly.

- **Versioning:** none in the path — `/api/decode` and `/api/encode` carry no
  version segment. The API contract's own version (`public/openapi.json`'s
  `info.version`) and the product's npm version (`package.json`,
  `cli-package/package.json`) are two independent numbers by design — a
  package release doesn't have to imply a contract change, and vice versa —
  so the two currently reading differently (`"0.1.0"` vs `"1.0.0"`) isn't
  itself a defect. What's real is that `info.version` has never moved since
  it was introduced: `git log -p -- public/openapi.json` shows only two
  commits touching this file, one adding the spec at `0.1.0` and a later one
  bumping the *product* to `v1.0.0` without touching the spec at all — so the
  contract version isn't being tracked against contract changes either, which
  is the actual gap.
- **Published as a machine-readable document:** yes, genuinely —
  `public/openapi.json` is a real OpenAPI 3.1 spec with both routes, request
  schemas, and examples, served as a static file.
- **Validated at the edge:** partially. Both handlers correctly reject a
  missing `acronym`/`name`/`text` with a 400 and a usage example. Neither
  bounds the *length* of an incoming `text` parameter before it reaches
  `scanText`/`scanTextForNames` (`src/shared/decoder.ts`,
  `src/shared/encoder.ts`) — `scanTextForNames` in particular sorts and
  substring-searches the full acronym set (1,119 entries) against the
  supplied text on every call. An arbitrarily large `text` body is accepted
  and processed with no length cap found in either function or either
  handler — an unbounded-input-size gap in the sense this tool's "requirement"
  section describes, even though the low-value target likely makes it low
  severity in practice.
- **Health:** no health endpoint of any kind was found — no `/api/health`,
  no dependency check. There's also no external dependency to check against;
  the data is a file bundled into the function's own deployment, not a
  network call, so "health" here would only ever be process liveness, which
  Netlify's own platform already reports.
- **Rate limiting:** none found — no rate-limit logic in either handler, no
  Netlify-level configuration in `netlify.toml`. `SECURITY.md` names "no
  authentication" as a deliberate design choice but doesn't address rate
  limiting or abuse at all.

## Evidence

- The published contract document.
- Route tests exercising the documented behaviour, including failure cases.

`public/openapi.json` is real, versioned-if-stale evidence of the contract.
Route-level test coverage is indirect: `tests/decoder.test.ts` and
`tests/encoder.test.ts` exercise the shared `decode`/`encode`/`scanText`
functions the handlers call, including edge cases, but nothing in `tests/`
invokes `netlify/functions/decode.ts`/`encode.ts` directly — the handler's
own request-parsing, CORS headers, and error-status logic (405, 400, 500)
aren't covered by anything in the test suite as of this writing.

## Review checklist

- Is every new parameter validated and bounded?
- Does a new route appear in the contract document in the same pull request?
- Does an error response leak an internal detail?
- Does a change alter the shape of an existing response? That is a breaking
  change to a published contract, and it belongs behind a new version.
- Is anything personal placed in a URL, where it reaches logs and history?
- **FedSpeak-specific:** does a PR that changes the actual API contract — a
  route added, a parameter added or removed, a response shape changed —
  bump `public/openapi.json`'s `info.version`? That's the trigger that
  should move it, independent of any `package.json` version bump; as of
  this writing nothing enforces it, and the spec's version has never moved
  since it was introduced.
