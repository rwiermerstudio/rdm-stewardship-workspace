# Architecture evaluation

## Expanded browser evaluation

All six catalogue IDs now have a briefing and safe invented manifest in `demo/scenarios.mjs`. The model assembles a plain-text record and handoff checklist from catalogue facts, typed safe pointers, and simulated reviewer reasons; there is no download, persistence or validation of those pointers. Test-first changes added Node checks for six differentiated routes, provenance attribution and hard holds, plus Playwright desktop/mobile checks of briefing, drafts, transitions, overflow and axe-core at a submitted sky state. The oral path exercises returned privacy review, separate community metadata/access, curator rejection and simulated acceptance. Sky has one steward question; variant unknown consent and coastal location risk block simulated acceptance even after review clicks. Neighbourhood and MRI have different prompts/checklists but do not have an individually exercised full browser handoff test. Scenario copy and small samples are seeded illustrations; the catalogue is the source for IDs, size, formats, versions, classification and consent status.

This reduces repetitive version and handoff writing in an exercise, not measured researcher workload. No task-duration study or user comprehension test exists. A real pilot must verify consent, community authority, location risk, defacing, file fixity and repository capability outside this browser. The current text inputs cannot prevent real sensitive content; use only invented references.

For the later static multi-role exercise and its tested/untested boundaries, see [role-play design and evaluation](ROLEPLAY.md). The results below refer to the earlier Python-only fictional Meridian catalogue and are not evidence of a real repository or permission process.

**Method.** The synthetic six-project catalogue exercises the documented decision-docket/workspace architecture through the CLI prototype. `tests/test_institution.py` provides executable checks for scope, version selection, repository feasibility, high-risk referrals, unknown consent, authority separation, and a deliberately impossible repository fit. These are *simulated scenario tests*, not researcher interviews or a real compliance audit. The catalogue is fully fictional.

## Observed demonstrator outcomes

| Case | Guidance/hold | Candidate | Decision feature exercised |
|---|---|---|---|
| Sky survey | guidance | scale archive | Six-figure-GiB scale and FITS/Zarr format exclude general archive; openness is still not an access grant. |
| Urban interviews | hold | secure vault | Limited consent and restricted audio trigger privacy referral; community collection is not a generic audio destination. |
| Variant cohort | hold | secure vault | A feasible repository cannot cure unknown consent. |
| Oral heritage | hold | community collection | Community authority and private metadata govern even discovery; research PI cannot substitute for that authority. |
| Coastal occurrences | hold | general archive | Fictional funder's openness preference cannot relax sensitive-location restrictions. |
| MRI series | hold | secure vault | Imaging sidecars and privacy review are needed even after a defacing step. |

The prototype returned **one guidance and five holds** for these six synthetic cases. Every case has at least one capability-fit candidate and a named steward; this was achieved by adding WAV capability to the secure vault while keeping the community collection restricted to community-governed cases. A counterfactual sky survey exceeding every archive's declared capacity returns **no candidate and a preservation hold**. A later policy release supersedes the previous rule for *new evaluations*, while the old as-of query still returns the earlier release. Duplicate effective dates for the same rule are rejected.

## What the exercise changed in the architecture

1. **Repository fit needs hard filters before ranking.** Scale, formats, residency, classification, metadata visibility and governance scope are feasibility constraints, not soft preference weights. The output now carries exclusion reasons. Facility description alone is insufficient: a repository's ability to preserve *and* enforce conditions needs human verification and a receipt.
2. **Restricted audio is not necessarily community-governed.** Treating all oral data alike would route social-science interviews to the wrong collection. Repository governance and data sensitivity are distinct dimensions.
3. **Funder openness is a preference, not a permission.** The biodiversity example demonstrates a conflict in *intent* even when there is no formal rule conflict: protect location metadata while surfacing the funder's objective for later safe derivatives. Future versions need a reviewed *derivative-specific* decision, not a single project-wide openness flag.
4. **Policy time matters.** An evaluator needs the exact release in force on its as-of date and reproducible old results. This prototype evaluates historical dates but does **not yet persist a docket history**, sign policy releases, or compare an evaluation diff against an actual prior result.
5. **Documentation artifacts need provenance of the recommendation.** Matched rules are cited and versioned, but each output artifact is not yet individually linked to the clause that prompted it; a production design must carry per-artifact `why/source/rule` and preserve researcher overrides with reasons.
6. **Human authority cannot be faked in a registry.** The fictional community reviewer exercises routing only; authentic community representation, permitted metadata, withdrawal and reuse terms must be co-designed, authenticated and agreed outside the demonstrator. A `hold` is safer than an invented approval.
7. **Preservation is not mere compatibility.** Format and size matching do not prove ingest, bit preservation, migration support, budget, retention commitment or access enforcement. A real preservation package needs checksums, file manifest, fixity-event log, rights/consent assessment, repository acceptance and ongoing accountable owner.
8. **Metadata schemas should be export mappings, not magic conformance.** The synthetic object keys can be mapped to PROV, maDMP, PREMIS, DataCite and subject schemas, but none of those standards is fully serialized or validated in the prototype. Validation and redaction belong at actual export boundaries.

## Next implementation slices (prioritised)

1. **Immutable docket/evaluation persistence** with fact revision, policy release IDs, human determination and supersession diff; safe per-artifact citations; replay tests against released policy packs.
2. **Authority and privacy controls:** institutional identity, role/field permissions, community decision channel, non-public metadata and export review. Avoid raw subject-level data in app/logs.
3. **Preservation handoff:** real repository capability attestations, checksum manifest, acknowledgement receipt and failure states; do not claim accepted deposit from candidate routing.
4. **Standards adapters:** maDMP/PROV/DataCite/PREMIS/RO-Crate mappings and domain validators (DDI, BIDS, Darwin Core, etc.) where partner workflows require them; test round trips and disclosure risks.
5. **Pilot with real people:** validate comprehension, burden and decisions with researchers, stewards, repository staff, privacy/ethics specialists and affected communities before any regulatory language is shown to end users.

This exercise supports the *docket plus thin workspace* shape, but it also demonstrates that the present CLI remains an advisory test rig rather than the proposed deployed RDM service. No real institution, person, repository service, policy clause or project data has been used.
