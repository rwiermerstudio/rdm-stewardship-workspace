# Research Stewardship Workspace

**Fictional role-play and executable decision-guide prototype** for researchers documenting change and provenance, planning long-term preservation, interpreting institutional/disciplinary guidance, and handling sensitive or community-governed data. This is **not** a production compliance, ethics, repository, or access-control service.

## Try the browser exercise

[Open the Meridian Stewardship Studio](https://rwiermerstudio.github.io/rdm-stewardship-workspace/) or serve the `demo/` directory with `python3 -m http.server 8765 --directory demo` and visit `http://localhost:8765`. The static HTML/CSS/JavaScript has no account, backend, uploads, persistence or analytics; it resets on refresh. Internet access is optional (only the web fonts and external standards links use it).

Choose among six catalogue projects. Each briefing states your job now, expected formats and scale, a safe synthetic manifest, what is known and unresolved, options and a next step. The version IDs are prefilled from the fictional catalogue. Enter only invented change and evidence references, not data. The browser assembles a change/provenance draft and a preservation checklist as you go, labelled by catalogue, researcher and simulated reviewer source. Switch roles to test decisions; a return goes back to the researcher. Community metadata visibility and file access remain separate. Unknown genomic consent and coastal re-identification block a simulated acceptance even if the role-play reviewers click accept. Reset or refresh discards the exercise.

**How to compare:** Sky calibration uses a single steward review for a 120,000 GiB FITS/Zarr pipeline and large-object archive candidate. Oral heritage needs steward, privacy and community custody review for 600 GiB WAV/TIFF/TXT, with private metadata. Coastal GIS keeps raw locations restricted and holds a generalized derivative for re-identification review. Neighbourhood interviews require limited-consent review and a coding record. The variant cohort has an unknown-consent hold despite a vault candidate. MRI needs defacing and sidecar disclosure checks. Sample manifests contain no actual images, coordinates, recordings, transcripts or variants. Briefing prose and file names beyond catalogue fields are seeded illustrations, not validated records.

**Simulation, not permission.** Switching roles is not authentication; fictional decisions do not grant rights, create files, check real checksums, mint metadata, reserve space or transfer custody. Text fields cannot reliably distinguish fictional from real material—do **not** enter actual names, private reviewer notes, coordinates, consent text or credentials. There is no export, including no public export of reviewer notes. Use a real institution's approved process for real research.

```sh
python3 -m pip install -r requirements-dev.txt
python3 -m unittest discover -s tests -v
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

See [role-play design and evaluation](docs/ROLEPLAY.md) for the state transitions, test evidence and remaining limits.

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
- [Fictional Meridian Institute](docs/FICTIONAL-INSTITUTION.md): six research groups, role-based stewards/reviewers, four candidate repositories, ten invented policies and six diverse projects with a standards mapping.
- [Architecture evaluation](docs/EVALUATION.md): observed scenario results, gaps found and prioritised next steps.
- [Critical multi-role demo review](docs/CRITICAL-REVIEW.md): verified gaps, human-language criteria, proposed role-play and open product decisions.
- [`examples/meridian-institute.json`](examples/meridian-institute.json) and its [JSON Schema](schemas/fictional-institution.schema.json): explicitly synthetic catalogue; no real people, policies or research records.
- [`prototype/catalog.py`](prototype/catalog.py): validated, date-aware fictional policy and repository-fit evaluator with exclusion reasons and referrals. It never grants access or accepts a deposit.
- [`schemas/decision-docket.schema.json`](schemas/decision-docket.schema.json): portable input contract for a decision, not a policy schema or real researcher record.
- [`prototype/guide.py`](prototype/guide.py): dependency-free illustrative classifier. It **never grants access** and never interprets real institutional policy; fixtures are pedagogical examples only.

## Run the demonstrator

```sh
python3 -m pip install -r requirements-dev.txt  # tests validate JSON Schema; CLI itself uses stdlib
python3 -m unittest discover -s tests -v
python3 prototype/guide.py examples/open-change.json
python3 prototype/guide.py examples/restricted-derivative.json
python3 prototype/catalog.py                       # all six fictional projects
python3 prototype/catalog.py oral-heritage         # community review and custody
python3 prototype/catalog.py neighbourhood-voices --as-of 2026-01-15
```

The examples are entirely fictional. Do not enter real participant identifiers, raw content, credentials, consent records or community-restricted information in the demonstrator or GitHub issues. In particular, **GitHub is for source, design and synthetic tests, not research-data custody**.

## Pilot boundary

One participating institution, two contrasting disciplines, a steward-reviewed guidance pack, and ~10 consenting pilot projects. Build a modular monolith and an advisory UI first; integrate with one repository via a reviewed handoff later. Formal policy interpretation, lawful basis, preservation guarantees and community permissions remain with authorised people and institutions. See [PILOT.md](docs/PILOT.md).

## Status

Static fictional role-play plus runnable, deliberately narrow Python prototype. No actual institutional policies loaded, no live DMP/repository/identity connectors, no production deployment or legal certification. This project does not assert that one documentation format, retention period, repository or openness level is universally best.

## License

[MIT](LICENSE) for code and project-authored documentation. Linked external standards retain their own terms. Contributions involving community-governed practices must involve relevant community decision-makers before productising those rules.
