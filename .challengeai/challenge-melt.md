# ChallengeMELT

Metrics, events, logs, and traces: whether an operator can tell what happened.

## Covers

Observability coverage, alerting, audit logging, retention, and runbooks.

## The requirement

- **SP 800-53 Rev. 5** Audit and Accountability (AU) is the core family: what is
  recorded, protected, retained, and reviewed.
- **The Federal Records Act** governs retention and disposition. Records are kept
  on a schedule rather than until storage becomes inconvenient.
- **Incident Response (IR)** depends on this: an incident that cannot be
  reconstructed cannot be reported accurately.

## What gets recorded

- **Audit records are tamper evident and retained on a schedule**, not rotated
  by size. They exist to be read later by somebody investigating something.
- **Application logs carry no personal information and no secrets.** A log line
  is a permanent record in an environment where records are discoverable.
- **Absence is monitored as well as failure.** A scheduled job that stops
  running produces no errors at all, so the alarm is on the job not having run
  rather than on it having failed.

## Alerting

An alarm fires on a condition an operator can act on. An alarm nobody acts on
trains people to ignore alarms, which leaves the system worse off than having no
alarm at all.

Every alarm therefore has an action attached, and that action lives in a runbook
carrying the actual commands rather than describing them.

## In this repository

FedSpeak keeps no application-level logs, metrics, or traces of its own at
all. Neither `netlify/functions/decode.ts` nor `encode.ts` writes a log line
anywhere beyond an unhandled exception falling through to Netlify's own
platform-level function logs (caught broadly by a `try`/`catch` that returns
a generic 500 with no detail — see ChallengeAPI's "Errors" note on not
leaking internals, which this incidentally satisfies). There's no request
logging, no structured event stream, and nothing this repository configures
to capture one.

That absence is arguably appropriate given what the system is: no accounts,
no user-specific behavior, no data that changes, nothing an "audit record" in
the SP 800-53 AU sense would actually need to reconstruct. What it does mean
is there's no way, from this repository or its CI, to answer "was the API
actually being hit, by whom, how often" — that visibility, if it exists at
all, lives entirely in Netlify's own platform dashboard (function invocation
counts, bandwidth), which this repository doesn't configure, export, or
retain independently.

There is no alerting of any kind — no alarm defined anywhere, as code or
otherwise, and nothing here to fire on a scheduled job's absence, because
there's also no scheduled job in this repository besides
`dependency-hygiene.yml`'s own weekly cron, which GitHub Actions itself
would silently stop notifying about if it were ever disabled (no external
monitor watches for that).

## Retention

Retention is a decision with a records-schedule basis, recorded where the log
is configured. Changing it is a compliance change, not a cost optimization.

No retention period is declared anywhere in this repository, because there
is no log stream this repository configures to have one. Whatever Netlify
retains at the platform level by default is Netlify's own retention policy,
not a decision made or recorded here.

## Evidence

- Alarm definitions declared as code, so they are reviewable.
- Runbooks versioned with the system.
- Retention declared rather than left at a provider default.

FedSpeak has none of these three. This is the honest state of the repository,
not a placeholder for evidence that exists elsewhere and simply isn't linked.

## Review checklist

- Does a new log line carry anything personal, or any secret?
- Does a new scheduled task have an alarm on it not running?
- Does a new alarm have an action, or does it only notify?
- Is retention on a new log stream declared?
- Would this incident be reconstructable from what is recorded today?
- **FedSpeak-specific:** if request logging or any usage analytics is ever
  added, does it collect an IP address or other data that would flip
  `profile.yml`'s `privacy_assessment_required` from `false` to `true`? That
  field's honesty depends on this staying true going forward, not just at
  the time this file was written.
