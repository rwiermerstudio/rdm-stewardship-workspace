# ADR 001 — Workspaces with versioned decision dockets

**Status:** proposed architecture for pilot; no production implementation.

## Alternatives considered

**A. Policy-backed dockets.** A researcher opens a narrowly scoped decision when data change, sharing or preservation arises. Immutable policy releases and append-only evaluations make advice reproducible. Strong auditability and targeted questions; alone, however, it risks becoming a disconnected case-management queue rather than an everyday plan.

**B. Research stewardship workspace.** A project and its products accumulate plan assertions, change/provenance activities, governance mandates and repository handoffs. The living DMP is a generated view. Better researcher continuity and handoffs; risks building a large, duplicated institutional system before a specific decision workflow is proven.

**C. Stateless questionnaire or DMP-centric portal.** Simpler to launch or integrate with a pre-existing DMP tool, but a one-shot answer is hard to reconstruct after policy or consent changes. A document-centric record can conflate declaration with actual custody/permission.

## Synthesis

Choose a **thin workspace** grouping products and actions, whose durable decision atom is the **docket/evaluation pair**. Only reviewed assertions feed a plan export. No built-in “compliance score,” universal policy hierarchy, automatic release permission, or research-data hosting. Implement one deployable modular application, not a constellation of services. Expand the workspace only after observing researcher workflows in a pilot.

The small public interface is `record a context/change → get cited documentation and preservation guidance or an explicit hold → record a human determination → export approved view`. Complexity stays inside authority selection, rule versioning and audit, rather than leaking into researcher forms.

## Design red-flag check

- **Shallow modules:** document routing and policy resolution have separate decision logic, not pass-through wrappers over forms.
- **Leakage:** UI cannot grant repository access; resolver cannot inspect raw data; exports cannot assume that all metadata is public.
- **Temporal decomposition:** domain boundaries follow ownership (policy, governance, evidence, preservation), not separate services for “step 1/2/3.”
- **Hidden dependencies:** every evaluation pins exact fact/policy/mandate versions; a new rule release cannot retroactively alter a prior result.

## Consequences and unresolved choices

A reviewed policy catalogue and specialist capacity are prerequisites; no amount of software removes the curation burden. A concrete institution and affected communities must co-design local authority and governance, including cases where a community rejects documentation itself. The eventual data store and identity model must satisfy a local security/privacy review. Existing DMP, ethics and repository systems may become authoritative for their own records; do not sync them bidirectionally without a negotiated source-of-truth contract.
