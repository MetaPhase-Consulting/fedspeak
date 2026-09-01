# ChallengeUI

The interface: whether everyone can use it, and whether it reads as what it
actually is.

## Covers

Section 508 conformance, WCAG 2.0/2.1 Level AA, USWDS conventions, and the line
between following federal design conventions and implying government authorship.

## The requirement

- **Section 508 of the Rehabilitation Act** requires federal electronic and
  information technology to be accessible to people with disabilities.
- **WCAG 2.0 Level AA** is the technical standard the Revised Section 508
  Standards actually incorporate by reference — not 2.1. A project may adopt
  WCAG 2.1 AA (a superset, adding criteria like reflow and orientation) as
  its own stricter target, which is a project choice beyond the legal
  minimum, not what the statute itself requires — worth keeping distinct in
  anything that becomes ATO evidence. `profile.yml`'s `accessibility` field
  records which one a given project actually targets.
- **The U.S. Web Design System** is the shared design system for federal
  websites. It is a convention rather than a statute, and following it makes a
  federal site behave the way its users already expect.

Accessibility here is a legal obligation. A failure is a compliance matter, not
a defect to prioritize against other work.

## What automated checks reach

An automated rule engine catches a meaningful share of WCAG failures and is
worth running on every route, at more than one viewport, as a gate. It does not
reach reading order, focus order that is technically valid but incoherent, alt
text that is present but wrong, or whether an error message actually tells
someone what to do.

Reflow at a 320 CSS-pixel viewport — WCAG 1.4.10, which corresponds to 400%
zoom on a common 1280px desktop width, not 200% — is checkable and often
missed. It's a distinct requirement from WCAG 1.4.4's 200% text-resize check;
testing only to 200% zoom can miss horizontal-scrolling failures that only
appear at the 400%/320px reflow condition. Both remain largely manual passes.

Contrast is measured rather than judged by eye, and the measured ratio is
recorded next to the color pair it describes, so a later change to a token is a
visible change to a number.

## In this repository

FedSpeak is legally exempt from Section 508 — it isn't a federal system —
but a real share of its audience is federal employees and contractors who
look up acronyms while doing federal work, some using assistive technology.
That's the practical reason this tool applies here even without a legal
mandate.

Against that, there is **no accessibility target declared anywhere** in this
repository — not in `README.md`, not in `CLAUDE.md`, not in
`.claude/agents.md` — and **no automated accessibility check runs at any
point**: `ci.yml` runs lint, typecheck, test, and build only; no axe-core,
no Lighthouse, no `@axe-core/playwright` or equivalent appears in
`package.json`'s devDependencies or in any workflow file. `profile.yml`
records `accessibility: null` and `accessibility_authority: null` rather
than inventing a target this repository doesn't actually hold itself to.

What exists is unverified and inconsistent: a grep across `src/components/`
and `src/pages/` finds `aria-*`/`alt`/`role` attributes in only 3 of the ~13
files (`Header.tsx`, `SearchPage.tsx`, `PackagePage.tsx`) — some baseline
accessibility awareness in a handful of components, with no scan or test to
confirm it's correct, complete, or consistently applied elsewhere. No
measured contrast ratios are recorded anywhere, and no 320px reflow check
(automated or manual) was found.

## Who operates the service

A system that returns government data, or follows federal design conventions,
still says who operates it. Attribution is reachable from every route, and the
operator is named where a reader goes looking.

Federal seals, agency logos and wordmarks, and wording claiming agency
authorship stay out. USWDS conventions are deliberate and permitted by this
rule, which governs attribution rather than appearance.

`src/components/Footer.tsx` renders "Built by MetaPhase" (linked to
`metaphase.tech`) on every page via the shared `Footer` component, which is
real, correct, and confirmed against the actual component — this is the one
part of ChallengeUI's requirements this repository meets cleanly. No federal
seal, agency logo, or official wordmark appears anywhere in `src/` or
`public/` as of this writing.

## Evidence

- A per-route accessibility assertion in the test suite, failing the build.
- A scan of every rendered route at more than one viewport, with its report
  retained.
- Contrast ratios recorded alongside the tokens they describe.

FedSpeak produces none of this evidence today — no accessibility assertions
in `tests/`, no scan of any kind, no recorded contrast ratios. This is the
single largest gap this tool file identifies in this repository.

## Review checklist

- Does every interactive element reach keyboard focus, in a visible way?
- Does every image carry alt text, and every form control a label?
- Is anything conveyed by color alone?
- Does the page survive 200 percent text resize (WCAG 1.4.4)?
- Does the page reflow without horizontal scrolling at a 320px viewport
  (WCAG 1.4.10, i.e. 400% zoom) — checked separately from the 200% case above?
- Does any new copy imply this is an official government system?
- Is a heading level skipped, and is there exactly one `h1`?
- **FedSpeak-specific:** does the "Built by MetaPhase" attribution in
  `Footer.tsx` still render on any new page or route added to
  `src/pages/`? A page that bypasses the shared layout could lose it
  silently.
