# Critical review: from a safe CLI test rig to a human demo

**Status:** design review, not a production safety sign-off. Based on code inspection, 25 passing existing tests, direct CLI runs and independent read-only role/architecture reviews. The mutation probes below were read-only and independently repeated; they are not tests of real law, a real institution or a deployed service.

## Verdict

The six-project fixture demonstrates *classification and routing vocabulary*, but not a researcher/steward workflow. It names documents and reviewers; nobody can create a change record, assign a review, answer it, revise an action, or see a completed deposit. The next version should tell a coherent story from **researcher question → evidence/decision → human review → next action**, not expose JSON and policy codes to a researcher. Keep real-world compliance claims out of a fictional demo.

### Blocking issues before an interactive role demo

1. **The hold is terminal.** `prototype/guide.py:64-88` and `prototype/catalog.py:155-173` produce `hold` and reviewer IDs, but no assignment, reason-specific question, decision record or resumption. Even `community_authority: reviewed` still triggers a generic referral. *Remedy:* one scoped review case with explicit requester, decision owner, missing information, status, evidence reference, outcome and return path. A review must be demonstrably resolvable or rejected; no magic approval button.
2. **Outputs imply more authority than exists.** `catalog.py:152-172` returns `guidance`, a candidate repository and `access_options: ["open"]` for the sky project despite no human rights review or repository reservation. Mutating the only candidate's access list to empty still returned `guidance`. *Remedy:* staged language: “possible option based on supplied facts”, “needs confirmation”, “reviewed route”, “accepted deposit”. Bind modes to each repository and show unmet conditions.
3. **Authority is not enforced.** `catalog.py:41-47` checks that `approved_by` is nonempty and a review owner exists, not that they have the right mandate. Changing the community policy's owner to the project PI was accepted in a mutation run. *Remedy:* separate researcher, data steward, privacy, repository and community authority; provenance of the appointment and explicit role-specific decisions. For a fictional demo, allow a clearly labelled simulated approver, never describe it as real authorisation.
4. **Unknowns and privacy can silently turn into reassuring defaults.** `catalog.py:67-74` maps Boolean `community_governed: false` to “not applicable”; there is no unknown state. `catalog.py:61-62` checks public metadata by classification only. A mutated public sky-project title containing an address still produced `public` + `guidance`. *Remedy:* ask “is any other party's permission needed?” with **yes/no/not sure**, treat not sure as review, keep metadata private until a distinct disclosure review; do not promise string-based detection can prevent leaks.
5. **Policy version selection can lose a rule without explanation.** `catalog.py:90-101` globally supersedes a rule ID before scope/expiry filtering. An expired newer MI-DOC release made the earlier rule disappear in an as-of evaluation. *Remedy:* specify whether an update replaces the old rule globally or by scope, model withdrawal explicitly, reject gaps/overlaps that lack a reviewed decision, and make any disappeared obligation visible.
6. **The demo does not capture its advertised evidence.** The README and architecture describe operator, time, method and evidence links; the input contract has no event timestamp or evidence reference (`prototype/guide.py:13-53`), while the fixed catalogue merely supplies a method string. Artifact suggestions are not linked to their specific rule and cannot be saved. *Remedy:* a versioned event record and one small usable artifact; defer full maDMP/PROV/PREMIS interchange until one mapped export is actually validated.

### Important, but second slice

- The docket JSON Schema accepts some input the Python validator rejects (a transformation without inputs); make the schema/runtime contract match and test it.
- A project-wide classification/size is too coarse for raw and derived products with different uses, sensitivities and retention. Model **product versions and intended use** as the unit of advice.
- Repository format, scale and region flags do not prove rights, preservation commitment, cost or ingest. Simulate a handoff with an acceptance/rejection receipt before calling anything deposited.
- `FUN-OPEN` appears among coastal species rules but the output does not tell a human why it is not followed. Explain a safe-derivative option separately from the restricted raw dataset.
- The `standards` array is a list of aspirations. Do not badge conformance until one real export/validator and disclosure check pass.

## Recommended first realistic demo (choice pending)

A **browser-based, seeded, resettable role-play** using the existing fictional institute. Avoid accounts and real data at first. The researcher sees a short question in everyday language (“What changed?”, “What did you start from?”, “Who may see this result?”), not a policy form. The screen shows: **Do now / Waiting for someone / Later / Why this matters**. Each action names a person or team and a record destination. Specialist views see the specific question, governing source version and safe evidence link, then record a scoped decision with reason. A timeline shows what changed; a preservation reviewer accepts/rejects a simulated handoff receipt. Mark every simulation and every still-unverified requirement visibly.

Three walkthroughs test the architecture, rather than repeating the same template: (1) sky-calibration correction → lineage evidence → archive candidate → simulated repository check; (2) interviews/derived table with limited consent → privacy question → narrowed use, refusal or renewed review; (3) oral histories → community authority approves/rejects metadata visibility separately from data access → new version and re-review. A biodiversity derivative can be a fourth to contrast sensitive raw locations and a safe generalised product.

## Human-language criteria for acceptance

- A researcher can explain *what to do next*, *who answers a hold*, *what is still unknown*, and the difference between “possible archive” and “accepted deposit” without reading documentation.
- Each role sees only relevant questions; jargon has contextual help (e.g. “record of how this version was made” before “provenance”). No forced legal conclusion or false confidence bar.
- Complete one scenario via keyboard on desktop and phone; reset works; private fields and reviewer-only reasoning never appear in an export or alternate role view.
- Scenario copy is checked with researchers, stewards and relevant community reviewers; passing code tests does **not** prove that it is understandable or culturally appropriate.

## Decisions for the product owner

1. First release: guided simulated browser role-play (recommended), or authenticated working prototype with persistent records? The latter requires identity, privacy, governance and security design before any real data.
2. Which story is the main route: documentation/change, sensitive-use review, or preservation handoff? Recommended: one end-to-end interview/community decision, plus short contrasting routes.
3. Should the demo assume English-only terminology or offer Dutch as well? The fictional institution is set in NL; policies remain fictitious regardless of language.

Do not resolve real institutional/community authority by assuming a fictional role name conveys permission. If those workflows become more than simulation, appoint and verify actual decision makers in a named pilot.
