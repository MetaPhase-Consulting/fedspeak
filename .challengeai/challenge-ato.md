# ChallengeATO

Authorization readiness: whether this system could be assessed today and whether
the evidence would hold.

## Covers

Control traceability, evidence sufficiency, the security package, the privacy
assessment, and bounded penetration testing against a running instance.

## The requirement

- **FISMA** requires federal systems to implement an information security
  program and to be authorized before operating.
- **NIST SP 800-37 Rev. 2** defines the Risk Management Framework.
- **FIPS 199** categorizes the system as low, moderate, or high impact. The
  categorization drives everything downstream, and it is recorded in
  `profile.yml`.
- **NIST SP 800-53 Rev. 5** provides the control baseline the categorization
  selects.
- **NIST SP 800-53A Rev. 5** provides the procedures an assessor uses.
- **The E-Government Act** requires a Privacy Impact Assessment where a
  system handles information **in identifiable form** — not merely
  information "about" individuals in aggregate — or initiates a qualifying
  electronic collection from ten or more non-federal persons.

## The package

A security package is a set, numbered so it can be handed over as one. The
System Security Plan describes the system, its boundary, and how each control is
met. Around it sit the assessment plan and report, the plan of action and
milestones, the risk assessment, the contingency and incident response plans,
configuration management, access control policy, continuous monitoring, and the
privacy impact assessment.

The boundary described in the SSP is the boundary the system actually
provisions. Anything outside it is inherited from the provider's own
authorization and is named as inherited rather than claimed.

## In this repository

FedSpeak has none of this, deliberately rather than by oversight — no
`docs/security/`, no SSP, no FIPS-199 categorization, no POA&M. It is not a
federal information system: no agency operates it, it carries no data on an
agency's behalf, and MetaPhase has not pursued an ATO for it. `profile.yml`
records `control_baseline: null` and `impact_level: null` to say exactly
that — "not pursued," not "unassessed and pending."

What FedSpeak has instead is `SECURITY.md`, a standard open-source
vulnerability-disclosure policy (report via a GitHub Issue tagged `security`,
or GitHub's private vulnerability reporting; 48-hour acknowledgment target).
`SECURITY.md`'s own "Scope" section is an honest, narrow self-assessment —
"public, read-only reference tool... no authentication... no user accounts...
no database" — and it holds up against the actual code: no auth anywhere in
`netlify/functions/`, no persistence beyond the committed
`src/shared/data/acronyms.json`, no environment variables or secrets required
to run it (confirmed: no `.env` file, no secret references in the Netlify
functions or `netlify.toml`).

## Evidence

- Pipeline output produced on every run: scan results, test reports, and a
  component inventory.
- A traceability record mapping each capability to its implementation and test.
- A reviewable record of the deployed configuration, so the boundary can be
  checked rather than taken on description.

FedSpeak's CI (`ci.yml`) produces none of the first category — no security
scan runs on a pull request or push at all; `dependency-hygiene.yml`'s
weekly `npm audit` is the only scan of any kind, and it's advisory
(`continue-on-error: true`) and never runs against a PR. Test output exists
(`npm run test:run` in CI) but isn't retained as an artifact. The "reviewable
record of deployed configuration" is effectively `netlify.toml` plus
Netlify's own dashboard — there's no infrastructure-as-code to inspect (see
ChallengeIaC).

## Review checklist

- Does the SSP describe the system as it is now, or as it was at the last
  release?
- Is every control claim backed by something a reader can open?
- Does the boundary in the SSP match what is actually provisioned?
- Has the data model started handling personal information the PIA does not
  mention?
- **A weakness, POA&M item, or vulnerability goes into a security document only
  with explicit approval.** Cataloguing theoretical gaps manufactures a record
  of insecurity. State what is implemented; independent assessment produces the
  authoritative findings. FedSpeak has no security document to add one to —
  a real vulnerability report belongs in `SECURITY.md`'s own disclosure
  process (a GitHub Security Advisory), not fabricated here.
