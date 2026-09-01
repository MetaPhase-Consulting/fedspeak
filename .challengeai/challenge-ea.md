# ChallengeEA

Enterprise architecture: whether the system fits the environment it has to live
in.

## Covers

Federal architecture alignment, governance rigor, interoperability with agency
systems, and the traceability between a mission need and a technical choice.

## The requirement

- **The Clinger-Cohen Act** requires agencies to manage IT as a capital
  investment, with architecture as part of that discipline.
- **OMB Circular A-130** sets expectations for managing federal information
  resources.
- **The Federal Enterprise Architecture Framework** provides the reference
  models an agency maps its systems against.
- **The Federal Source Code Policy** governs custom-developed code, including
  reuse and, where applicable, release.

## Reasoning travels with the component

An architecture record that captures only the decision leaves the next team to
rediscover the constraint that produced it, and rediscovery usually happens by
reversing the decision and hitting the constraint again.

So each significant choice carries the alternatives that were considered and why
they were not taken, kept next to the description of the component rather than
in a separate decision archive, where somebody changing it will actually
encounter it.

## In this repository

FedSpeak has no formal architecture documentation and no `docs/architecture/`
— the closest thing is the "Project Structure" section in `README.md` and
`CLAUDE.md`, which both describe the same real shape: `src/shared/` (decoder,
encoder, truncation, types, and the acronym data itself) is the single source
of logic reused by three separate consumers — the Netlify Functions API
(`netlify/functions/decode.ts`, `encode.ts`), the React website
(`src/pages/`, `src/components/`), and the published npm package
(`cli-package/`, kept in sync via `scripts/sync-cli-package.sh`, which copies
`src/shared/*` into `cli-package/src/shared/` for a separate build/publish
step). That "one source, three consumers" shape is the entire architecture,
and it isn't written down anywhere as a deliberate decision with alternatives
considered — it's inferable from the file layout, not recorded as reasoning.

There is no agency mission need this traces to; FedSpeak is a MetaPhase-
initiated reference tool, not a system built against an agency requirement.
This tool's "reasoning travels with the component" principle and the
"Interoperability" section below are largely inapplicable as a result — noted
here rather than filled in with invented content.

FedSpeak is not deployed as federal infrastructure and has no authorization
boundary of its own to describe (see ChallengeATO, ChallengeIaC).

## Boundaries the architecture has to respect

- **The authorization boundary** is what the system provisions and controls. A
  component added outside it changes the security posture and the
  documentation that describes it.
- **Data stays inside the provider boundary** unless a deliberate decision says
  otherwise, and that decision is recorded with its reasoning.
- **Services are chosen from what is authorized** at the required impact level,
  checked before adoption.

Not applicable to FedSpeak in the ATO sense — it has no authorization boundary
and no federal data. See ChallengeIaC for what it actually provisions
(essentially nothing beyond Netlify's own managed platform).

## Interoperability

Where the system exchanges data with an agency system, the interface is
documented as a contract with a version, and the failure behaviour is
specified. An integration whose failure mode is unspecified becomes an
incident rather than a degraded state.

FedSpeak has no live integration with any agency system. It publishes its own
contract (see ChallengeAPI) for third parties to consume, but consumes
nothing from an agency system itself.

## Evidence

- Architecture documentation carrying the design and its reasoning.
- A reviewable record of what is actually provisioned.
- The published interface contract.

FedSpeak's only real evidence here is the published OpenAPI contract (see
ChallengeAPI) and the file layout itself; there's no design-reasoning
document to point to.

## Review checklist

- Does this choice have its reasoning recorded next to it?
- Were alternatives considered, and is the reason for not taking them written
  down?
- Does a new component sit inside the authorization boundary?
- Does data leave the provider boundary, and was that decided or assumed?
- Does a new integration specify what happens when the other side is down?
- **FedSpeak-specific:** does a change to `src/shared/` get synced into
  `cli-package/` via `scripts/sync-cli-package.sh` before the npm package is
  published, or does the published package silently drift from what the API
  and website actually run? The sync step is a manual script, not a CI gate
  — nothing currently verifies the two copies stay identical (see
  ChallengeCI, ChallengeCD).
