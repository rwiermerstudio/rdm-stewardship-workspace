# Research Stewardship Workspace

**Architecture and executable decision-guide prototype** for researchers documenting change and provenance, planning long-term preservation, interpreting institutional/disciplinary guidance, and handling sensitive or community-governed data. This is a greenfield design and demonstrator, **not** a production compliance, ethics, repository, or access-control service.

The central object is a **decision docket** attached to a project and data-product version. A researcher records a change or intended reuse, sees the most appropriate documentation artifact and preservation next steps, and is referred to the right human authority when a rule, consent term, or community agreement is unclear. A living DMP is a *view* assembled from such reviewed records, never a competing source of truth.

## Start with a researcher question

> “We corrected an interview transcript and made a new analysis dataset. What should we record? Can it be preserved and shared?”

1. Describe the change without uploading participant data: what input version, method, operator, date and output version? What can be safely linked as evidence?
2. The guide suggests a change log and README/data dictionary for content changes, a provenance activity linking input and output versions, and—where justified—a methods/workflow record. For a preservation handoff it adds a manifest with checksums, format inventory, rights/access statement and a future review date.
3. It resolves **curator-approved, versioned** institution, funder, discipline, repository and community/consent guidance. Citations and relevant policy versions accompany every suggestion.
4. Unclear consent or community authority creates a **hold and named referral**, not an inferred permission. A specialist/community representative can record a determination; an external repository or storage provider must independently enforce any access decision.
5. A later policy or consent change triggers a *new* evaluation linked to the earlier one, not a silent rewrite. A versioned DMP/deposit export can be generated from approved docket records.

## What is here

- [Architecture](docs/ARCHITECTURE.md): user journeys, boundaries, domain model, policy resolution, documentation and preservation routing, privacy and community governance.
- [Decision record](docs/DECISIONS.md): two architectural candidates, synthesis and explicit trade-offs.
- [Pilot and acceptance tests](docs/PILOT.md): phased delivery, example scenarios, measures, stakeholder review and non-goals.
- [Source register](docs/SOURCES.md): source-backed standards and applicability limits.
- [`schemas/decision-docket.schema.json`](schemas/decision-docket.schema.json): portable input contract for a decision, not a policy schema or real researcher record.
- [`prototype/guide.py`](prototype/guide.py): dependency-free illustrative classifier. It **never grants access** and never interprets real institutional policy; fixtures are pedagogical examples only.

## Run the demonstrator

```sh
python3 -m unittest discover -s tests -v
python3 prototype/guide.py examples/open-change.json
python3 prototype/guide.py examples/restricted-derivative.json
```

The examples are entirely fictional. Do not enter real participant identifiers, raw content, credentials, consent records or community-restricted information in the demonstrator or GitHub issues. In particular, **GitHub is for source, design and synthetic tests, not research-data custody**.

## Pilot boundary

One participating institution, two contrasting disciplines, a steward-reviewed guidance pack, and ~10 consenting pilot projects. Build a modular monolith and an advisory UI first; integrate with one repository via a reviewed handoff later. Formal policy interpretation, lawful basis, preservation guarantees and community permissions remain with authorised people and institutions. See [PILOT.md](docs/PILOT.md).

## Status

Architecture + runnable, deliberately narrow prototype. No institutional policies loaded, no live DMP/repository/identity connectors, no production deployment or legal certification. This project does not assert that one documentation format, retention period, repository or openness level is universally best.

## License

[MIT](LICENSE) for code and project-authored documentation. Linked external standards retain their own terms. Contributions involving community-governed practices must involve relevant community decision-makers before productising those rules.
