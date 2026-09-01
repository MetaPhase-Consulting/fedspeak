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

FedSpeak has two agent entry points, not fully parallel: `CLAUDE.md` at the
repo root (Claude Code) and `.claude/agents.md` (also Claude-specific, despite
the generic name — it's a second, narrower file scoped to the acronym-adding
workflow specifically, not a Codex entry point). There is no `AGENTS.md`, so
Codex has no dedicated entry file in this repository as of this writing.
`CLAUDE.md` and `.claude/agents.md` are not kept byte-identical below a shared
heading the way some MetaPhase repos keep `AGENTS.md`/`CLAUDE.md` in sync —
they cover different scopes (`CLAUDE.md` is the general repo guide;
`.claude/agents.md` is acronym-schema-specific instructions) and nothing
mechanically enforces agreement between them, since there's no true overlap to
drift out of sync. `CLAUDE.md` is the one that references `.challengeai/`.

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
