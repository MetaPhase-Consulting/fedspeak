# ChallengeAC

Agile artifacts: whether what was asked for can be traced to what was built.

## Covers

Acceptance criteria, requirement traceability, ambiguity in what was requested,
and audit readiness of the delivery record.

## The requirement

SP 800-53 Rev. 5 System and Services Acquisition (SA-3, system development life
cycle) and Configuration Management (CM-3, change control). An assessor asks how
the team knows it built what was asked for, and how a change was decided.

## Traceability without ceremony

The requirement is that a capability can be traced to its implementation and its
test. It is not that a particular artifact exists before work starts.

A traceability record written as the work lands describes the system, so it
survives an assessment as written. A backlog written ahead of the work describes
intent, which drifts from what shipped and has to be reconciled against reality
before an assessor can use it. Either can satisfy the requirement; only one is
accurate by construction.

Where the record claims a capability is complete, that claim is checkable. A
partial state written honestly, with a sentence on the shortfall, reads better in
assessment than a completion that an assessor disproves.

## Change control

An assessor asking how a change was controlled is asking for a durable record
that shows what changed, who approved it, and how it was verified. A pull
request carrying one concern, with review and conversation resolution required,
answers that. A pull request carrying several makes the record of why any one of
them landed ambiguous.

## In this repository

FedSpeak has no formal traceability record — no requirements table, no linked
issue tracker mapping capability to implementation to test. What it has
instead is lightweight but real: `.github/ISSUE_TEMPLATE/add_acronym.md`
structures every acronym-addition request into a fixed shape (acronym, full
name, description, agency, category, source), and `.github/pull_request_template.md`
requires the PR itself to check off `lint`, `typecheck`, `test:run`, and
`build` before merge — that's the closest thing to a change-verification
record this repo has, and it's checked by the contributor, not enforced by
CI status alone (CI does run these same four independently, so a checked box
that doesn't match the CI result is visible). There's no traceability record
mapping any of the three named test files (`decoder.test.ts`,
`encoder.test.ts`, `truncate.test.ts`) to a specific capability beyond the
tests' own names and structure.

Whether one PR carries one concern, review approval is required, or
conversation resolution is enforced before merge to `main` is not verified —
see `profile.yml`'s `gates` section for what's actually confirmed versus what
`CONTRIBUTING.md`/`CLAUDE.md` describe as the intended workflow.

## Evidence

- A traceability record mapping each capability to its implementation and test,
  with honest states rather than aspirational ones.
- Change history, one concern per change, with the verification recorded.
- Review approval and conversation resolution enforced rather than optional.

FedSpeak's evidence here is thin by the standard above: the PR template's
checklist and the issue template's fixed schema are the whole of it. Test
files exist and are real, but nothing maps a specific test to a specific
capability by name.

## Review checklist

- Does the capability that just landed appear in the traceability record,
  naming its implementation and its test?
- Does the record claim completion for something only partly built?
- Does the change record say how it was verified?
- Is more than one concern bundled here, making the record of why it landed
  ambiguous?
- Was something ambiguous resolved by asking, or by guessing and documenting the
  guess?
- **FedSpeak-specific:** does a new acronym entry follow
  `add_acronym.md`'s fixed schema, and is its source cited in the issue or PR
  description? An entry added without a source is unverifiable content in a
  reference tool whose entire value is accuracy.
