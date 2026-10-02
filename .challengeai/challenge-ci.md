# ChallengeCI

The pipeline: what it proves, and whether it can be bypassed.

## Covers

Workflow hardening, evidence gates, security scanning, and the release controls
that make a merge into a protected branch mean something.

## The requirement

SP 800-53 Rev. 5 control families, principally Configuration Management (CM),
System and Information Integrity (SI), and Risk Assessment (RA). An assessor
asks how change is controlled and how flaws are found; a pipeline that gates on
both answers the question with artifacts instead of assertions.

## Gates and reports

A gate blocks a merge. A report informs one. Both are useful and they are not
interchangeable, so which is which is a decision rather than an accident of
configuration.

The gates worth having cover: that the code compiles, conforms and behaves; that
the artifact can actually be produced; that the system works end to end; that
every rendered route passes accessibility; that no dependency carries a high or
critical advisory; and that no verified secret reached the history.

Which of those block, and which report, is declared in `profile.yml` so the
answer is written down rather than inferred from workflow files.

## Hardening

- Workflow permissions are least privilege, declared per workflow rather than
  inherited.
- Actions are pinned, and raised on a schedule.
- Deploy credentials come from short-lived federated identity rather than a
  long-lived key held in the repository or in secrets.
- The pipeline runs on pull requests from forks without secrets in scope.

## In this repository

FedSpeak has exactly two workflows: `ci.yml` (lint, typecheck, test, build —
on push to `main`/`dev` and PR to `main`) and `dependency-hygiene.yml`
(`npm audit` + `npm outdated`, weekly cron + manual dispatch only). That's
the entire gate list — see `profile.yml`'s `gates` section for the checks/
advisory split. Against this tool's list of "gates worth having": compile/
conform/behave is covered (lint, typecheck, test), the artifact-can-be-built
check is covered (`npm run build`), but **there is no end-to-end test, no
accessibility check, and no dependency/security scan on any pull request or
push** — the only scan that exists (`npm audit`) runs on a weekly schedule
with `continue-on-error: true`, never against a PR, so a vulnerable
dependency introduced in a PR would merge without CI ever flagging it there.
No secret-scanning of any kind (verified push-protection, gitleaks,
trufflehog, or similar) was found in either workflow or in repo settings
reachable from here.

- **Workflow permissions:** neither workflow declares a `permissions:` block
  — both run under whatever default `GITHUB_TOKEN` permissions the
  organization has set, not a least-privilege grant declared explicitly in
  the workflow file itself.
- **Action pinning:** `actions/checkout@v4` and `actions/setup-node@v4` are
  pinned to major-version tags, not to a commit SHA — a floating reference
  that moves as GitHub publishes new `v4` releases, not an immutable pin.
  Nothing in this repository raises action versions on a schedule (no
  Dependabot config for GitHub Actions was found; `.github/` has no
  `dependabot.yml` at all).
- **Deploy credentials:** CI itself never deploys — no deploy step, no
  secrets referenced in either workflow. Deployment is Netlify's own
  GitHub-App-based auto-deploy (triggered by the push itself, outside GitHub
  Actions entirely), so there's no CI-held credential to secure or rotate in
  the first place — see ChallengeCD.
- **Fork PRs:** since neither workflow uses any secret, running on a PR from
  a fork carries no secret-exposure risk regardless of trigger configuration.

## Evidence

Each run uploads its reports, and they are retained long enough to be asked for.
Coverage is surfaced on the change itself rather than only in a log.

FedSpeak's CI uploads no artifacts at all — no coverage report, no build
output, no scan report. Everything that ran is visible only in the raw
Actions log for as long as GitHub retains it.

## Review checklist

- Does a new job have wider permissions than it needs?
- Is a new action pinned?
- Did a required check get renamed? The name is what branch protection matches,
  so renaming one silently stops it gating.
- Does a job that cannot fail still report, so a required check is satisfied
  rather than left pending forever?
- Does the gate list in `profile.yml` still match what the pipeline runs?
- **FedSpeak-specific:** does a new PR introduce a dependency with a known
  high/critical advisory? Nothing in the PR pipeline itself would catch
  this — only the weekly, non-blocking `dependency-hygiene.yml` run would,
  potentially days later.
