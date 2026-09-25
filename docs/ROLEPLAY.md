# Role-play design and evaluation

This is a **fictional pedagogical simulation**, not a governed workflow. Meridian Institute, MI-DOC §2, MI-PRIV §3, HER-COMM §1 and MI-PRES §4 are invented. Standards links in the UI explain concepts; there is no W3C PROV, CARE, PREMIS or BagIt conformance claim.

## Usage and state sketch

The browser loads only `demo/index.html`, `style.css`, `app.mjs` and `model.mjs`. `model.mjs` owns an in-memory state `{scenario, description, plan, required, decisions, receipt, events, publicMetadata:false, accessGranted:false}`. `transition(state, action)` returns a new state or throws on an invalid role/action. `view(state, role)` projects Do now, Waiting and Later. The UI renders user-supplied text via `textContent`, not HTML. There is no storage, network API or export. A refresh or reset discards all typed text.

Usage path: `fresh('oral') → researcher.describe(change,input,output,evidence) → steward.determine → privacy.determine(needs-info) → researcher.revise(plan) → privacy.determine(accept) → community.determine(metadata,access,reason) → curator.receipt(accept|reject)`. Review decisions must have a reason; returned decisions cannot be silently overwritten before researcher revision. Curator receipt is unavailable until each distinct required reviewer has accepted a scoped plan. Even after a simulated acceptance, `accessGranted` and `publicMetadata` remain false. Metadata review is distinct from a mediated data request. `sky` asks only for a steward before a curator; `coastal` includes privacy on a proposed generalised derivative. No route interprets genuine consent or establishes safe generalisation.

The UI shows a role switcher, stage indicator, scoped question, fictional policy reference, change record, action queues and timeline. Role changes are purely a teaching affordance. No identity, access control or privacy boundary exists. The researcher's view intentionally includes reviewer reasons so a returned plan can be revised; there is **no separate private-notes field** and no public export. The timeline is visible to anyone with the page. Do not enter actual private information.

## Verification performed

- `python3 -m unittest discover -s tests -q`: catalog and docket checks, including expired release gaps, reviewer role separation, unknown community applicability, repository mode mismatch and transformation input schema parity.
- `npm test`: pure state tests for end-to-end oral handoff, negative self-approval/early receipt, rejection/revision, reset and open sky route.
- `npm run test:browser`: real Chromium interactions at desktop (1440×900) and mobile (390×844), including all five role choices, needs-info, researcher revision, community metadata/data choices, curator rejection then simulated acceptance, reset, open sky rejection, no horizontal overflow and zero axe-core violations on the tested sky state. Screenshots are local test artifacts, not shipped.

Automated axe and responsive probes are not a human accessibility study. Keyboard operation uses native buttons/selects/forms/details, a skip link and visible focus. The scenario copy, comprehension, cultural appropriateness and actual authority mandates have **not** been validated with researchers, privacy reviewers or communities.

## Limits and next pilot questions

The Python evaluator and JavaScript exercise are deliberately separate; no claim of shared runtime policy decisions. Python flags an expired latest policy release as a hold instead of losing it silently, but scope changes still globally supersede an old ID and should be governed by explicit withdrawal/release lineage. Its `community_governed` unknown state can be represented as JSON null; it does not assess whether a boolean answer is truthful. Repository access checks remain declared capability filters, not actual ingest rights. The institution JSON Schema and Python validator agree on nonempty project inputs, but cross-record relationships, output/input inequality and reviewer role mandates remain Python-only; general schema/runtime parity is not proven.

The browser accepts arbitrary short text; instructions cannot prevent a visitor from typing real material. It has no log/telemetry code, but publishing it through a hosting platform may create ordinary server access logs; do not treat it as approved private storage. The fonts are optional third-party fetches. There are no signed records, independent session identities, rights decisions, disclosure check, file checksums, preservation package, retention schedule, repository receipt or durable timeline. A real pilot needs appointed decision-makers, community-led design and review, actual policy sourcing, field-level ACL, security/privacy assessment and a validated repository connector before any real data or permission claim.
