# ChallengeSQL

The data layer: correctness, performance, and who can reach what.

## Covers

Schema design, query correctness and performance, migrations, and database-level
access control.

## The requirement

SP 800-53 Rev. 5 Access Control (AC), Audit and Accountability (AU), and System
and Communications Protection (SC-28, protection at rest). Where the data
concerns individuals, the Privacy Act and the PIA govern what may be stored and
for how long.

## Access

- **Reached through a server-side layer.** The browser holds no database
  credential and issues no query.
- **Least privilege by role.** The application connects as a role holding narrow
  per-table grants rather than as the owner, and something asserts those grants
  so a migration that widens access fails rather than passing silently.

  Build this early. A role added after the schema has grown means auditing every
  table to work out what the application actually needs.
- **Row-level security enabled and forced** on tables that carry it, so the
  owner cannot bypass the policy by accident.

## Migrations

Migrations are checksummed, and the runner records a hash of each file.

**An applied migration is never edited, comments included.** Changing one makes
the runner report a mismatch on every subsequent run, and the fix for a bad
migration is another migration.

## Performance

Queries that touch a growing table are checked against a plan rather than
against intuition. An index helps only when the planner chooses it, and a join,
a function on a column, or a mismatched type will each quietly defeat one.

## In this repository

FedSpeak has no database at all — `CLAUDE.md` states this directly ("Data:
Static JSON (no database)") and it's confirmed by the actual code: the entire
data layer is `src/shared/data/acronyms.json`, a single committed file (1,119
entries), read into an in-memory `Map` at module load in both
`src/shared/decoder.ts` and `src/shared/encoder.ts`. There is no schema
migration system, no database role or grants to audit, and no row-level
security, because there are no rows in the database sense — every "record"
is a JSON object edited directly in a pull request.

Most of this tool's requirements — access control roles, RLS, migration
checksums — don't apply to a static, read-only, committed dataset with no
runtime write path. What does carry over is data *correctness*: entries are
added by hand (per `CONTRIBUTING.md`'s and `.claude/agents.md`'s documented
schema), kept in alphabetical order by convention rather than enforced
ordering, and there's no automated check that a new entry conforms to the
schema (required fields present, `category` one of the nine allowed values,
no duplicate key) before it merges. `AcronymCategory` in `src/shared/types.ts` *is* a strict nine-value
union, but `decoder.ts`/`encoder.ts` import the JSON and cast it directly
(`acronymsData as AcronymData`) rather than letting TypeScript infer and
check the JSON module's literal types — an explicit `as` cast suppresses
that check, so an entry with an unrecognized `category` string, or a missing
required field, would not be caught by `npm run typecheck` in CI. It would
only surface at runtime, and only if something actually reads that field in
a way that breaks (the app mostly just echoes `category` back verbatim, so
even that's not guaranteed).

## Evidence

- The migration history is the schema history.
- The grants held by the application role, and whatever asserts them, are the
  access-control evidence.
- Database tests run against a real migrated database rather than a mock.

None of this applies in the usual sense. The closest equivalent evidence is
`tests/decoder.test.ts` and `tests/encoder.test.ts`, which exercise lookups
against the real `acronyms.json` file (not a mock or fixture), so a broken or
malformed entry that changes lookup behavior would surface there if a test
happens to cover it — not a systematic guarantee, since the tests weren't
written to validate every entry's shape.

## Review checklist

- Does this migration edit one that has already been applied?
- Does a new table need row-level security, and is it forced as well as enabled?
- Does the application role get the narrowest grant that works?
- Does a new query have a plan that uses the index it was written for?
- Does a new column hold personal information the PIA does not mention?
- **FedSpeak-specific:** does a new or edited entry in `acronyms.json` match
  the documented schema exactly — required fields present, `category` one of
  the nine documented values, key placed in alphabetical order? Nothing in
  CI currently checks this beyond TypeScript's structural typing.
