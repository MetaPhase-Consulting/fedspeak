# ChallengeCD

Deployment: whether a release can be made safely and undone quickly.

## Covers

Rollout safety, rollback readiness, secrets handling, and the operational
controls around putting a change in front of users.

## The requirement

SP 800-53 Rev. 5 Configuration Management (CM-3 change control, CM-5 access
restrictions for change) and Contingency Planning (CP-10 system recovery). An
authorized system must be able to show that changes are controlled and that a
bad change can be reversed.

## Know where the risk is actually taken

Every deployment model takes the risk somewhere. What matters is that everyone
knows where, because a branch treated as a safety gate that does not gate
anything is worse than no gate: it produces confidence without protection.

Where a promotion redeploys code that is already live, the promotion names a
version rather than de-risking anything, and the risk was taken earlier.

## Rollout and rollback

- **Health-gated rollout**, so a release that never passes its health check
  reverses itself rather than waiting to be noticed.
- **Rollback documented and rehearsed.** A procedure that has never been run is
  a hypothesis.
- **Credentials from short-lived federated identity**, so no long-lived key
  exists to leak or rotate.

A change that cannot be rolled back without also reversing a data migration is
a different class of change, and saying so at review time is the point.

## In this repository

FedSpeak has two genuinely separate deployment paths that don't share the
same rigor, and this section names both honestly.

**The website + API** deploy via Netlify's own GitHub App integration — a
push to `main` (production) or `dev` (per `CLAUDE.md`'s branching section,
though `netlify.toml` doesn't distinguish branch contexts) triggers a
Netlify build and deploy directly, entirely outside GitHub Actions. There is
no health-gated rollout: Netlify's default deploy model replaces the live
site once the build succeeds, with no automated check of the *deployed*
result before it goes live to all traffic. Rollback is whatever Netlify's
own dashboard provides (redeploying a previous deploy from its deploy
history) — a real capability, but not documented anywhere in this
repository as a runbook, and not something this repository's CI performs or
verifies.

**The npm packages** (`fedspeak` and `@metaphase-tech/fedspeak`, both
confirmed live on the registry at `1.0.0`) are not published by CI at all —
no workflow in `.github/workflows/` runs `npm publish` or references an npm
token. Publishing is a manual, undocumented-in-repo process:
`scripts/sync-cli-package.sh` copies `src/shared/*` into `cli-package/`, and
someone presumably runs `npm publish` from there by hand afterward — this
step, and who's authorized to run it, isn't written down anywhere in
`CONTRIBUTING.md` or `CLAUDE.md`.

## Secrets

Secrets reach the running system at start from a secret store, never from the
repository and never from a build artifact. The repository is scanned on every
push and on a schedule, and a verified finding fails the build.

A value inlined at build time is baked into whatever ships and is readable by
anyone holding the artifact. That can be an acceptable trade, but it is a
decision to make deliberately rather than discover.

FedSpeak needs none of this machinery because it holds no secrets at all —
confirmed directly: no `.env` file or `.env.example`, no environment
variable referenced in `netlify/functions/`, `src/`, or `netlify.toml`, and
`CLAUDE.md`/`SECURITY.md` both state this explicitly ("No secrets or env
vars needed"). The npm publish step above would need an npm auth token
somewhere on whoever's machine runs it, but that credential lives outside
this repository entirely — not in CI, not in a GitHub secret.

## Evidence

- Deploy runs recorded per change and retained.
- A release runbook carrying the verification commands and the rollback
  procedure.
- Whatever the platform keeps as the previous good revision is the rollback
  record.

Netlify retains its own deploy history (visible in Netlify's dashboard, not
in this repository), which functions as the rollback record by platform
default. There is no release runbook in this repository for either the
website/API path or the npm-publish path.

## Review checklist

- Does the deploy watch its own run with a failure exit status? A watch that
  returns success whichever way the run ended will let a failed deploy be tagged
  as a release.
- Is the run identified by commit rather than by branch? A branch filter asked
  seconds after a merge returns the previous run, which is already green.
- Can this change be rolled back without a data migration being reversed? If
  not, say so in the pull request.
- Does anything new read a secret at build time rather than at run time?
- **FedSpeak-specific:** if a PR changes `src/shared/`, does the same PR (or
  a documented follow-up) run `scripts/sync-cli-package.sh` before the next
  npm publish? A merged fix that never gets synced into `cli-package/` ships
  to the website and API but not to either published npm package.
