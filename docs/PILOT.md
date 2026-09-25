# Pilot plan and acceptance criteria

## Decision use and scope

Test whether a guided, cited RDM decision record helps researchers take an appropriate next step and makes institutional/community review reconstructible. Start with one willing institution, two contrasting disciplines, ~10 consenting projects, institutional data steward and repository staff, privacy/ethics staff, and representatives of affected communities where community-governed data are in scope. No generic community authority can substitute for actual representation. These numbers are **design targets**, not measured participation.

## Phases

1. **Discovery and governance.** Interview users about actual change/provenance records, DMP and deposit handoffs; select two contrasting workflows. Secure institutional permission to pilot and relevant community co-design. Inventory authoritative policy documents and named owners. Agree what information is out of scope for the app.
2. **Contract and rule curation.** Review 5–10 representative situations with specialists; approve narrow rule releases with issuer, applicability, effective dates, citations and referral owner. Define artifact mappings for local notebooks, code systems and repositories. Write negative/ambiguous scenario tests before implementing live advice.
3. **Advisory MVP.** Metadata-only intake, product version/change records, documentation router, versioned decision history, human handoff, preservation package checklist, reviewed plan snapshot. No raw data upload, auto-access authorization, legal interpretation, global repository ranking or LLM policy extraction.
4. **Single repository handoff.** Negotiate provider capability, deposit receipt and failure states, rights/access review, integrity verification and responsibility for future fixity. Keep status `proposed` or `submitted` until an actual receipt is recorded.
5. **Independent review.** Accessibility, security and privacy assessment, policy-authority audit, researcher/steward usability, community review where relevant; decide whether to widen to more disciplines/institutions or stop.

## Required scenario tests

- Open correction: record input/output versions, change reason and QC evidence; suggest change log, README/data dictionary and fixity checklist with cited policy; no access grant is implied.
- Restricted derivative: unknown consent/community scope must cause `hold` and referral, even if another rule prefers open sharing.
- Community decision/withdrawal: appropriate authority's updated mandate triggers a new evaluation; future issuance is stopped if a connected provider can enforce it, and inability to recall copies is explicit.
- Contradictory source policies: display both clauses/releases and send to a named reviewer, without synthetic precedence.
- Preservation handoff: selected file version + checksum manifest + format/rights metadata + repository receipt; a rejected/failed deposit never appears complete.
- Policy version changes: old advice stays reconstructible; material differences are highlighted and require reassessment.
- Metadata disclosure: a sensitive place/person in a public title must be detected by human review before export; default private when uncertainty remains.

## Measures, not compliance theater

Collect time to first actionable next step; proportion of decisions with source citation and named owner; reviewer time per case; incorrect/open recommendations on negative scenarios (target **zero** in reviewed test set); completeness of provenance links; successful reconciliation of deposit receipts; researcher/steward and affected-community judgments of usability and trust. Measure repeat work and missing handoffs, not merely count of completed DMPs. Protect pilot telemetry; do not log sensitive intake.

## Gate to production

No production release until institutional policy owners, legal/privacy staff, security team, repository operator and relevant community authorities approve the actual scope. Demonstrate field-level authorization, redacted exports, retention/deletion handling, restoration, accessibility with users, audit integrity, adversarial tests, and provider enforcement. Explicitly separate published recommendations from verified external actions.
