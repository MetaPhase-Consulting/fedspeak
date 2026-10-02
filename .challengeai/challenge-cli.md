# ChallengeCLI

The accelerator itself: the layer that carries the standards in this folder into
Claude and Codex so the work arrives shaped by them.

## Covers

Cross-runtime operation. The same guidance drives both runtimes, which is why
the federal layer lives in `.challengeai/` and the agent files point at it
rather than restating it.

## The requirement

None directly. ChallengeCLI is delivery tooling, and no federal authority
mandates it. It exists so the requirements the other eleven tools cover are
applied while code is written rather than discovered during assessment.

MetaPhase governs the suite under ISO/IEC 42001, the management-system standard
for artificial intelligence, which is what makes its use in federal delivery
defensible.

## One source, two runtimes

Guidance duplicated per runtime drifts, and drift is worse than absence: two
agents then follow two different rule sets while both appear governed. The
federal layer therefore has one home, and each runtime's entry file references
it instead of copying it.

Where a repository maintains parallel agent files, they are kept in agreement
and that agreement is worth enforcing mechanically rather than by habit.

## In this repository

FedSpeak has one agent entry point: `AGENTS.md` at the repo root. It is
runtime-neutral, points at this folder and `CHALLENGEAI.md` for federal
delivery standards, and carries the repo-specific rules (data policy,
module format, release gates). There are no parallel per-tool agent files
to keep in sync, which is the cleanest way to satisfy "One source, two
runtimes": any agent that reads `AGENTS.md` lands on the same guidance.
`README.md` is the human-facing repo guide and `CONTRIBUTING.md` is the
acronym-adding workflow; `AGENTS.md` defers to both rather than restating
them.
`README.md` and `CONTRIBUTING.md` are not kept byte-identical below a shared
heading the way some MetaPhase repos keep `AGENTS.md`/`README.md` in sync —
they cover different scopes (`README.md` is the general repo guide;
`CONTRIBUTING.md` is acronym-schema-specific instructions) and nothing
mechanically enforces agreement between them, since there's no true overlap to
drift out of sync. `README.md` is the one that references `.challengeai/`.

## Evidence

The folder is the evidence. Someone reading `.challengeai/` can see what the
team was held to without interviewing anyone.

## Review checklist

- Do the parallel agent files still agree with each other?
- Is anything here duplicated into a runtime-specific location, where the two
  copies will drift?
- Has a repository-specific detail leaked into a tool file? It belongs in
  `profile.yml`, this file's `In this repository` section, or the repository's
  own documentation.
- Does user-facing copy describe ChallengeAI as a feature of the product? It is
  how the product was built, and saying otherwise is wrong.
