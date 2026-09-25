# Architecture: evidence-led guidance, not automated permission

## Context and explicit assumptions

This is a new product; there is no institutional policy catalogue, identity provider, approved repository, or agreement authority to integrate today. Target users are researchers at an initial European university pilot, data stewards, repository/preservation staff, privacy/ethics specialists and relevant community authorities. An institution or discipline must configure and validate its own guidance. The architecture should travel across jurisdictions, but the first pilot is not a universal regulatory engine.

## Usage-first sketch

1. A researcher creates a project and data-product **metadata stub**, recording discipline, funder, institution, data classification and *unknowns* without entering subject-level content.
2. At a change checkpoint, they attach a proposed change to immutable input/output version identifiers and describe the method and responsible actor. The app asks only the next relevant question (e.g. is this a correction, transformation or access change?).
3. A documentation router offers a *set of fit-for-purpose artifacts* and asks where each record actually lives; it never conflates a changelog with full lineage evidence or a DMP with preservation custody.
4. A policy resolver evaluates applicable, reviewed releases and agreement constraints as of the decision time. The result names the source clause and exact version, matched evidence, missing facts, conflicts, and the responsible reviewer.
5. The preservation planner suggests a package and candidate route, *not* a certified preservation guarantee. A specialist reviews formats, fixity, rights, retention, repository capability and costs before handoff.
6. When community protocols, consent or cultural sensitivity may apply, the appropriate authority decides what documentation and discoverability are acceptable. Even public metadata may disclose sensitive locations, people or knowledge.
7. The researcher revisits the docket when facts or rules change. A new evaluation supersedes—not edits—the previous one. Approved assertions feed a versioned living DMP export.

## Candidate shapes and chosen boundary

See [DECISIONS.md](DECISIONS.md) and the [six-project architecture evaluation](EVALUATION.md). A decision docket is the durable, auditable *unit of advice*; a researcher workspace groups dockets, data products, actions and plan assertions. This combines a short, purposeful question flow with durable institutional accountability. Begin as a **modular monolith**, not microservices. The fictional Meridian tests specifically exposed the need for hard repository-feasibility filters, independent community authority and date-aware policy release selection; these remain advisory until real providers and people verify them.

```text
Researcher / steward / community reviewer
                 │ metadata-only, role-scoped
                 ▼
        Workspace + decision dockets
       ┌─────────┼──────────────┐
       ▼         ▼              ▼
Document router  Policy resolver  Preservation planner
       │         │              │
       │  Curated policy releases│
       │  and governance mandates│
       └─────────┼──────────────┘
                 ▼
       Versioned decision ledger ──► approved DMP / deposit export
                 │
       capability-scoped adapter boundary
      ┌──────────┼───────────┐
      ▼          ▼           ▼
Identity/ethics  Approved storage  Repository
                    (data bytes stay here)
```

The product owns metadata, reasons, action queues, and *pointers*. It does not own research data bytes or override storage/repository permissions. Adapters return a receipt or failed handoff; the workspace never treats a suggestion as enforcement.

## Domain contract (conceptual TypeScript)

```ts
type Ref = { id: string; version: string; uri?: string };
type DataProduct = {
  id: string; projectId: string; kind: 'dataset' | 'software' | 'workflow';
  versions: Ref[]; classification: 'open-candidate' | 'restricted' | 'unknown';
  custodianId: string; storageRef?: string; // reference, never raw content
};
type Change = {
  input: Ref[]; output: Ref; kind: 'correction' | 'transformation' | 'selection' | 'access-change';
  actorRef: string; occurredAt: string; methodRef?: string; evidenceRef?: string;
};
type GovernanceMandate = {
  id: string; authorityRef: string; scope: string; version: string;
  permittedUses?: string[]; prohibitedUses?: string[];
  reviewRoute: string; expiresAt?: string; sourceRef: string;
};
type PolicyRelease = {
  id: string; version: string; issuer: string; sourceUri: string;
  approvedBy: string; effectiveFrom: string; effectiveUntil?: string;
  scope: string; rules: Array<{id: string; sourceClause: string; effect: string}>;
};
type Docket = {
  id: string; projectId: string; subject: Ref; question: 'change' | 'preservation' | 'access';
  factsRevision: string; change?: Change; mandateRefs: Ref[];
  status: 'draft' | 'needs-review' | 'advised' | 'closed';
};
type Evaluation = {
  id: string; docketId: string; factsRevision: string;
  policyRefs: Ref[]; mandateRefs: Ref[]; matchedRuleIds: string[];
  documentation: Array<{artifact: string; why: string}>;
  preservationSteps: string[]; unresolved: string[];
  outcome: 'guidance' | 'hold' | 'specialist-determination';
  reviewerRef?: string; supersedes?: string; evaluatedAt: string;
};
type DepositReceipt = {
  product: Ref; repositoryRef: string; submittedAt: string;
  status: 'proposed' | 'submitted' | 'accepted' | 'rejected';
  manifestRef?: string; fixityEvidenceRef?: string; accessStatementRef?: string;
};
```

`Evaluation` records guidance, **not** the right to grant access. Future enforcement requires a separately demonstrated connector with the repository's actual access checks. `Ref` identifiers must be opaque and permission-scoped; never assume a public URL is safe. Preserve an append-only decision/event log with current projections, access-controlled by project and role. Corrections supersede prior records and remain attributable. Idempotency key = docket ID + facts revision + selected release/mandate versions; repeat evaluation of the same inputs yields the same advice. Time-dependent reevaluations create a new key and link via `supersedes`.

## Documentation router: choose records by purpose

| Trigger | Suggested record(s) | Reason and boundary |
|---|---|---|
| Raw-data correction | change log + dataset version + reason and QC evidence | Tracks what was corrected; do not overwrite original without a governed process. |
| Transformation/analysis derivative | provenance activity: input/output versions, actor, time, method, software/workflow version + README/data dictionary | Reconstructs lineage; a prose changelog alone is insufficient. W3C PROV is an **interoperability mapping**, not a required user-facing form. |
| Data collection/protocol change | methods/protocol amendment + decision/approval reference | Explains comparability and review; ethics approval is external. |
| Ownership, permitted use, consent or community decision | restricted governance record with decision-maker and scope + safe pointer | May require protected documentation or even suppression of descriptive metadata. Do not put sensitive clauses in public records. |
| Deposit or migration | preservation package manifest, fixity evidence, format inventory, metadata, rights/access statement, receipt, review schedule | Records custody and integrity; neither a ZIP nor a checksum by itself ensures long-term preservation. |
| Project-wide obligations change | versioned plan assertion / DMP snapshot linked to dockets | Keeps funder-facing plan aligned with work. Map to RDA DMP Common Standard where suitable; avoid silent two-way sync. |

Prompts are *recommendations*, not a form monopoly. Capture an artifact's location, access tier and responsible custodian. Ask domain stewards to map local lab notebooks, ELNs, code repositories, discipline metadata profiles or archival systems into these functions.

## Policy resolver and uncertainty

- Curators publish immutable releases with issuer, scope, provenance, effective interval, citation, review status and owner. Unapproved text can be displayed as reference but cannot drive a rule. Keep independent institution, funder, disciplinary, repository, jurisdictional and community authorities; there is **no universal precedence order**.
- Filter applicability first; accumulate compatible obligations; show incompatibilities verbatim with both citations. A narrower permission term or prohibition is never overridden by a generic openness preference. Actual legal interpretation and conflicts go to the named authority.
- Three-valued facts: `true`, `false`, `unknown`. Unknown consent, mandate, classification, location or authority never becomes `false`; block any automated sharing recommendation and make a referral.
- Guidance outcomes: `guidance`, `hold`, or `specialist-determination`. No compliance percentage or automatic `allow` for data release. Rules may recommend an artifact/route; only authorised humans can issue determinations.
- A new policy release leaves earlier decisions intact; re-evaluation shows the *diff* in obligations and requires review when material. Every output includes exact source and release ID, evaluation time, recorded assumptions and outstanding questions.

## Community/content-sensitive governance

CARE (Collective Benefit, Authority to Control, Responsibility, Ethics) complements FAIR: accessible can mean **authenticated/controlled access**, not public-by-default. Ask whose authority applies, what uses and audiences are permitted, whether public metadata itself creates harm, how review and withdrawal work, and who should be invited into design. These are questions for the affected people, not universal rules written by a product team. Support community-chosen terminology, locally approved protocols, culturally appropriate metadata visibility and review channel, including a route outside the PI hierarchy. Do not force Indigenous governance into a single checkbox or claim CARE confers a universal legal status. Revocation can stop future issuance in connected systems; distributed copies cannot be recalled by promise.

## Preservation is a service plan, not a file format

For each version, distinguish working storage, backup, retention and archival preservation. Capture selected bits with checksums, independent fixity checks, format inventory and migration strategy, rights/access/consent review, metadata, custody receipts, repository capabilities, and funded responsible owner/review dates. Ask repository staff to verify fit and commitments; a CoreTrustSeal-certified repository may be useful evidence but certification does not establish appropriateness for every dataset or guarantee permanent retention. No generic retention number is embedded.

## Security, trust and operational constraints

- Store minimal metadata and opaque references, not raw research data, secrets, subjects or restricted cultural content. Implement field-level ACL, least privilege, institutional SSO, reviewer isolation and encryption at rest/in transit **before real use**. Segment private governance notes from public export.
- Logs and telemetry must not contain sensitive intake values. Exports require separate review of metadata disclosure. Redact citations where policy text itself is restricted. Support safe deletion/retention processes subject to institutional obligations; immutable audit does not mean keeping personal data forever.
- Threats: mistaken public release, mis-scoped mandate, stale or forged policy, unauthorized reviewer, metadata inference, connector failure, misleading advice. Mitigations: signed/approved releases, holds, traceable reviews, redacted exports, connector receipts, negative tests and institutional privacy/ethics assessment.
- MVP has no AI policy interpretation. If later adding retrieval/LLMs, treat answers as untrusted drafts for curator approval, show clause-level evidence, and never use generation to decide authorization.

## Interfaces and lifecycle

Initial API (later implementation): `POST /projects`, `POST /products`, `POST /dockets`, `POST /dockets/{id}/evaluations`, `GET /dockets/{id}/history`, `POST /dockets/{id}/determinations` (reviewer only), `POST /policy-releases` (curator only), `GET /projects/{id}/plan-snapshots`. Returns typed errors for missing authority, stale policy, conflicting constraints and unsupported repository; never masks them as an open-access recommendation. An event outbox supports idempotent adapters, but no split services until an actual scaling or governance need is demonstrated.

## Conceptual acceptance scenarios

A. Open, non-sensitive code-and-data correction yields a versioned change log, input/output relation and deposit checklist with cited rules; no approval inferred. B. Derived interview data with uncertain consent yields documentation tasks and a hold; no public metadata export by default. C. A community representative rejects a proposed use: new review supersedes earlier advice; future connected access issuance is stopped, with pre-existing external copies disclosed as a limit. D. Two applicable rules disagree: expose both versions and route to a named steward; do not invent a precedence score. E. Repository handoff fails: status remains proposed/submitted, never accepted without receipt.
