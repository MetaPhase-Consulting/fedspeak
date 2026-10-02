# What is different about building for the federal government

Commercial software ships when the team decides it is ready. A federal system
ships when someone with authority accepts the risk of operating it, in writing,
on the strength of evidence the team produced while building. That single
difference drives most of what follows.

FedSpeak itself has no ATO in flight and pursues none — see ChallengeATO for
why — but it is a reference tool built for people who work inside that world,
and its accuracy and presentation carry real consequences for them. The
sections below apply to that extent even without an authorization boundary of
FedSpeak's own.

## Authorization to Operate

A federal information system needs an ATO before it carries real data or real
users. An authorizing official signs it, and signs a specific system with a
specific boundary at a specific point in time.

The process is the NIST Risk Management Framework, SP 800-37 Rev. 2:

1. **Prepare** establish context, roles, and risk tolerance
2. **Categorize** the system against FIPS 199, as low, moderate, or high impact
3. **Select** the SP 800-53 Rev. 5 control baseline the categorization implies
4. **Implement** the controls
5. **Assess** whether they work, using SP 800-53A Rev. 5 procedures
6. **Authorize** the system, accepting residual risk
7. **Monitor** continuously, because an ATO describes a system that keeps changing

A system's categorization is recorded in `profile.yml`. FedSpeak's is `null`
— it is not a federal information system, does not carry federal data on
behalf of an agency, and no categorization has been performed (see
ChallengeATO).

**The consequence for development.** Evidence is a build output, not a document
written at the end. A control that was implemented but never evidenced is
indistinguishable, to an assessor, from one that was not implemented.

## Authorization is a claim, and claims are checkable

"Authorized", "compliant", and "accredited" describe a decision an authorizing
official made about a specific system at a specific time. Use them where that
decision exists, and describe the standards a system is built against where it
does not. Both are accurate statements; only one of them is checkable against a
signature.

The same care applies to language that implies federal endorsement without
asserting it, which an outside reader has no way to distinguish from the real
thing. FedSpeak decodes federal acronyms; nothing about the site, the API
responses, or the npm package should read as though a federal agency operates
or endorses it.

## Accessibility is law

Section 508 of the Rehabilitation Act requires federal electronic and
information technology to be accessible to people with disabilities. The
Revised Section 508 Standards incorporate **WCAG 2.0 Level AA** by reference
as the technical standard; WCAG 2.1 AA is a valid but stricter voluntary
target a project may adopt on top of it — a project choice distinct from what
the statute itself requires, worth keeping distinct wherever this feeds ATO
evidence (see ChallengeUI for what a given project targets specifically).
FedSpeak isn't a federal system and Section 508 doesn't apply to it as a legal
matter, but a meaningful share of its actual audience are federal employees
and contractors, some of whom use assistive technology — see ChallengeUI for
why that's treated as a real gap rather than a legal non-issue.

Accessibility is a legal obligation with a compliance consequence: a complaint
is a legal matter. The intended posture is to gate on it rather than merely
report it, and a claim of conformance is made on the strength of a scan
someone can open — but whether a given repository's CI actually enforces
that gate today, versus still reporting advisory, is a fact recorded in
`profile.yml`'s `gates` section, not assumed from this general principle.

## Cloud services carry their own authorization

FedRAMP authorizes cloud service offerings so that agencies do not each assess
the same provider. Building on an authorized service means inheriting the
controls that service already satisfies, and inheriting them is only valid for
services actually in the authorized boundary at the authorized impact level.

Choosing a service that is not authorized at the required level means either
authorizing it independently or not using it. This is a design constraint at the
moment of choosing a service, not a discovery to make during assessment.

FedSpeak doesn't handle federal data or operate on an agency's behalf, so this
constraint doesn't bind its choice of Netlify as a host — see ChallengeIaC.

## Privacy has its own gate

If a system collects, maintains, or disseminates information about individuals,
the E-Government Act requires a Privacy Impact Assessment. A system of records
retrieved by personal identifier additionally requires a System of Records
Notice published in the Federal Register.

The PIA is written from what the system actually does with personal
information, so a data model that quietly starts storing an identifier changes
the privacy posture whether or not anyone updates the document. FedSpeak
collects no personal information at all — no accounts, no stored user input,
no analytics — so `profile.yml` records `privacy_assessment_required: false`.
That's a statement about what exists today; it changes the moment the system
starts persisting anything about a person.

## Retention and disposition

The Federal Records Act governs what a federal system keeps and for how long.
Retention and disposition follow a records schedule. Audit records in particular
exist to be read later by somebody investigating something, which is why they
are written to be tamper evident and are kept for their scheduled term rather
than rotated once they grow large.

FedSpeak keeps no audit records of its own — see ChallengeMELT — so this
doesn't bind it directly today, but it's the rule that would apply the moment
any request or usage data started being persisted.

## The public reads everything

Federal systems operate in public. Repository contents, pull requests, and
issues can become public records. Plain language is required of public-facing
government communication by the Plain Writing Act. FedSpeak's repository is
already fully public (MIT licensed, open source), so this isn't a hypothetical
here — everything in it is already readable by anyone.

Two practical rules follow. Nothing permanent carries sensitive account or
resource identifiers, or vulnerability detail — an identifier recorded
deliberately so a reader can verify a deployment target (an AWS account
number in a runbook, say) is a legitimate exception to this rule, not a
violation of it. Dollar figures are a narrower exception still: they stay out
of permanent records where they're incidental, but where cost is the point of
the record — a POA&M's required "Resources required" field, for instance —
stripping the estimate makes the record worse, not more secure. And
documentation states what the system does rather than cataloguing what it does
not, because a system described mostly by its gaps reads as less trustworthy
than one described by its implementation.

## Government data is not government endorsement

FedSpeak decodes and expands U.S. government acronyms, some entries link to
official `.gov` sites, and the whole product is built around federal
terminology — close enough to the subject matter that a reader could
plausibly mistake it for an official government resource without a clear
signal otherwise. It isn't one: MetaPhase compiles, curates, and writes every
entry's description independently, and no agency has reviewed, endorsed, or
sponsored the database's content.

`src/components/Footer.tsx` names MetaPhase as the operator on every page
("Built by MetaPhase," linked to `metaphase.tech`), and neither the site nor
the API responses use any federal seal, agency logo, or wordmark. That
attribution is the whole of what keeps this distinction visible — see
ChallengeUI.

## What this means day to day

- Build the evidence while building the feature, in the same pull request.
- Treat accessibility as a build break, not a warning — that's the general
  target; FedSpeak's CI doesn't currently run any accessibility check at all
  (see ChallengeUI), so today it isn't gated on anything.
- Check a service's authorization before adopting it, not after — not a live
  constraint for FedSpeak specifically (see above), but the discipline to
  keep if that ever changes.
- Say what is implemented. Findings come from independent assessment, and a
  weakness, POA&M item, or vulnerability goes into a security document only
  with explicit approval. Cataloguing theoretical gaps manufactures a record
  of insecurity. FedSpeak has no security document of this kind at all today
  (no `docs/security/`, no POA&M) — see ChallengeATO.
