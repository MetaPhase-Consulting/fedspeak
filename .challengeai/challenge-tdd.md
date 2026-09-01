# ChallengeTDD

The tests: what they prove, and what a green run actually means.

## Covers

Test traceability to capabilities, coverage of the paths that matter, and
release readiness.

## The requirement

SP 800-53 Rev. 5 System and Services Acquisition (SA-11, developer testing) and
System and Information Integrity (SI-2, flaw remediation). An assessor asks how
the team knows the system works, and expects an answer with artifacts.

## Breadth, then depth

Breadth across every kind of test comes first, so no category is missing: logic
in isolation, rendered behaviour, accessibility per route, real queries against
a real migrated database, route behaviour including failure cases, and the whole
system end to end at more than one viewport.

Depth follows risk. The paths where a defect changes what a user is shown, or
lets someone reach data they should not, earn the most.

## What a test should assert

A test that passes against a deliberately broken implementation is worse than no
test, because it reports confidence it has not earned. When adding a regression
test, break the fix on purpose and confirm the test fails.

A test asserting an implementation detail rather than a behaviour will break on
a harmless refactor and be deleted by whoever it inconveniences, which costs the
coverage it was written for.

## Traceability

A capability with no test named against it is either untested or untraceable,
and both are findings. The traceability record maps each capability to its
implementation and its test, which is what an assessor asks for.

## In this repository

FedSpeak's test coverage is narrow but real: three Vitest suites in `tests/`
— `decoder.test.ts` (19 cases), `encoder.test.ts` (13 cases), and
`truncate.test.ts` (4 cases), 36 individual assertions total — cover
`lookupAcronym`, `scanText`, `lookupName`, `scanTextForNames`, and the
progressive truncation logic in `src/shared/truncate.ts`, all run against the
real `acronyms.json` data rather than a mock, and all three run in CI on
every push to `main`/`dev` and every PR to `main` (`ci.yml`'s `test:run`
step). That's the full extent of what's tested, though — there is no
category of test beyond this one: no rendered-component tests (no
`@testing-library/react` in `package.json`'s devDependencies, and no `.tsx`
test files exist), no accessibility assertions (see ChallengeUI), no test
that invokes the actual Netlify function handlers
(`netlify/functions/decode.ts`/`encode.ts`) rather than the shared logic
they call (see ChallengeAPI), and no end-to-end test of the website at all.

Coverage is *measured* — `vitest.config.ts` configures the v8 provider with
text/json/html reporters, and `npm run test:coverage` exists as a script —
but not *enforced*: there's no `thresholds` block in the config, and `ci.yml`
runs `npm run test:run`, not `npm run test:coverage`, so a coverage report
isn't even generated in CI, let alone gated on. There is no traceability
record mapping any of these 36 test cases to a named capability beyond the
test file's own `describe`/`it` structure.

## Evidence

- Coverage reported on every change.
- End-to-end and accessibility reports retained as artifacts.
- The traceability record.

FedSpeak produces none of these three as CI artifacts today. `npm run
test:coverage` works locally and would produce an HTML report, but nothing
runs or retains it in the pipeline.

## Review checklist

- Does the new capability appear in the traceability record, naming its test?
- Would this test fail if the behaviour regressed? Confirm, do not assume.
- Does a database test run against a real schema rather than a mock?
- Is a test asserting an implementation detail that will break on a harmless
  refactor?
- **FedSpeak-specific:** does a new acronym entry that introduces a new
  alias, multi-word key, or category value get a corresponding case in
  `decoder.test.ts`/`encoder.test.ts`, or does it only get exercised
  incidentally by the existing generic assertions?
