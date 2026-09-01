# ChallengeIaC

Infrastructure: what is provisioned, what it costs, and where the authorization
boundary falls.

## Covers

Infrastructure as code, FedRAMP service selection, the authorization boundary,
and the cost consequences of a topology.

## The requirement

- **FedRAMP** authorizes cloud service offerings. Using an authorized service at
  the required impact level lets the system inherit the controls that service
  already satisfies.
- **SP 800-53 Rev. 5** Configuration Management, applied to infrastructure: the
  deployed configuration has to be reviewable and controlled.

Inheritance is only valid for services inside the authorized boundary at the
authorized level. Checking that before adopting a service is a design step, not
an assessment finding.

## In this repository

FedSpeak isn't a federal system and doesn't need FedRAMP-authorized
infrastructure — this section is included for completeness, not because the
constraint binds here (see federal-context.md).

There is no infrastructure-as-code tool in use — no Terraform, no
CloudFormation, no Pulumi, no OpenTofu. The entire "infrastructure" this
repository controls is `netlify.toml` (build command, publish directory,
functions directory, and two redirect rules) plus whatever's configured
directly in Netlify's own dashboard (the site's Netlify project, its custom
domain, and its GitHub-App connection) and Cloudflare's dashboard (DNS
records pointing `fedspeak.dev` at `fedspeak.netlify.app`, per `CLAUDE.md`).
None of that dashboard-level configuration is declared as code anywhere in
this repository — it's clicked, not committed, and there's no record here of
what's actually configured beyond what `netlify.toml` covers.

The topology is about as simple as this suite encounters: a static site plus
two serverless functions, both served from Netlify's own managed platform,
with Cloudflare fronting DNS only (not proxying — not confirmed either way
from this repository, since that's a Cloudflare dashboard setting, not a
committed file). There's no compute to size, no database to provision, no
network boundary this repository defines.

## Boundary

What the system provisions is the boundary. Everything else is inherited from
the provider and is named as inherited rather than claimed as implemented.

FedSpeak provisions essentially nothing itself — Netlify's build system and
function runtime, and Cloudflare's DNS, are both entirely the providers' own
managed infrastructure. There's no boundary to draw beyond "this repository's
code, as built and deployed by Netlify."

## Cost

Cost-relevant settings are variables, each carrying its reasoning. A default was
usually chosen against a measurement, and keeping the reasoning next to it means
the next person changes it knowingly.

Topology drives cost more than instance sizing does, and the expensive parts are
usually the ones added without being noticed: an always-on gateway, a
cross-region transfer, a log stream with no retention.

Nothing here is a cost-relevant variable in the usual sense — no instance
sizing, no always-on compute (Netlify Functions are invoked per-request), no
configured log retention to leave at a costly default because none is set up
at all (see ChallengeMELT). The two npm packages and the GitHub repository
itself carry no infrastructure cost.

## Evidence

- The infrastructure declaration is the record of what is provisioned.
- Validation results from the pipeline.
- Variables and their reasoning.

`netlify.toml` is the entire infrastructure declaration this repository
carries, and nothing in CI validates it (no `netlify build` dry-run, no
schema check) beyond Netlify's own build step succeeding or failing at
deploy time.

## Review checklist

- Is this service authorized at the required impact level?
- Does this change move anything across the authorization boundary?
- Is a cost-relevant setting hardcoded rather than declared as a variable with
  its reasoning?
- Does the running configuration still match what is declared?
- Is a new resource missing a retention or lifecycle setting, leaving it at the
  provider default?
- **FedSpeak-specific:** does a change to `netlify.toml`'s redirects or
  functions directory get verified against an actual Netlify preview deploy
  before merging, given nothing in CI validates it directly?
