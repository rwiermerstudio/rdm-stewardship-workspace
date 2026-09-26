# Inspectable materials and local handover

## Iteration plan

1. Give each existing route a small set of authored, fictional text files. Add tests that fail until the files and byte-based checks exist.
2. Let learners read the files, answer a concrete question and correct a mistaken answer. Keep the existing role handoffs and external holds.
3. Package the original materials and the learner's draft locally. Test extraction, hashes, JSON-LD expansion, exact links and authority boundaries.
4. Exercise all routes, returns, mobile navigation, keyboard interaction, reset and failure recovery. Push the feature branch for independent review; do not deploy.

The implementation follows these slices. The initial material-loader, exporter, learner-action and browser tests were run red before their implementations. A later failing test removed an inappropriate `conformsTo` assertion from the partial crate draft.

## What learners inspect

| Case | Material and deliberate problem | Outside decision that remains |
| --- | --- | --- |
| Interviews | Coded table and DDI-style variable guide. `confidence` lacks a definition. | Consent owner interprets the intended use. |
| Astronomy | ObsCore-style discovery row, calibration note and claimed run. Input versions disagree; the transfer list omits the run. | Steward verifies the real run; curator checks capacity and copies. |
| Imaging | BIDS-style companion fields and a claimed processing note. `PatientName` remains. No scan is included. | Trained image reviewer and privacy office inspect the real material. |
| Ecology | Darwin Core-style internal observations, defective public draft and reduced candidate. The draft retains `locality`. Tokens are fictional, not coordinates. | Independent location-risk assessment, even for the reduced candidate. |
| Genetics | Proposed use, unavailable-agreement register and paused run proposal. The agreement pointer is missing. | Consent owner interprets the actual agreement before DUO mapping or execution. No DUO term is supplied. |
| Oral histories | Invented transcript segments, incomplete correction log and agreement summary. One segment has no log row. | Appointed body decides description visibility separately from recording requests; no label authority is invented. |

`material-catalog.mjs` describes the actual files under `materials/`. `materials.mjs` loads their text and performs narrowly defined checks. CSV handling is deliberately limited to the supplied unquoted, comma-delimited examples. It is not a general CSV or domain validator. Unit tests mutate each defect and prove the check result changes, then remove a required file and prove it cannot pass.

The four learning milestones are observation, safe response, method note and completed role route. A hold can finish the learning route without granting permission. Reading materials is available at every stage. Recording an observation is a learning task, not a prerequisite for practising other roles. An incomplete observation remains visible in the progress goal and exported record. No answer silently changes the source files.

## Local package

The browser creates an uncompressed POSIX `.tar` archive without sending anything to a server. Extract it with an archive utility and start with `README.txt` and `handover-note.txt`.

- `materials/` contains the exact loaded exercise texts, including their intentional defects.
- `datacite-draft.json` provides selected DataCite 4.6 creator, title, publisher, publication-year, type, subject, language, version, description and rights fields. Publisher and year are teaching draft values. There is no DOI or identifier, and the record is not registration-ready.
- `ro-crate-metadata.json` uses the RO-Crate 1.2 context, descriptor/about/root structure, file descriptions, sizes, media types and linked research-history note. It is an unpublished partial draft, not a fully conformant RO-Crate. In particular, it does not invent the required publication date or dataset licensing decision. It uses `isBasedOn`, not a false `conformsTo` declaration.
- `human-decisions.json` is a local learning record. Researcher proposals, simulated replies, exact exercise checks and still-unobtained authorized decisions are separate. A `checks.json#CHECK-…` pointer identifies the matching top-level key in that local JSON dictionary, not a remote human approval.
- `history.json` separates claimed or proposed research history from lesson actions. It uses the distinction between entities, activities and agents taught by PROV and Workflow Run RO-Crate, without claiming either profile conformance or execution of a research workflow.
- `preservation-events.json` records selected PREMIS-inspired concepts: digest calculation, selected text validation and in-memory packaging. Each has an agent, time, objects, detail and outcome. These are not custody, archive acceptance or preservation-success claims, and not PREMIS XML.
- `manifest-sha256.json` holds actual SHA-256 digests for every other entry, including metadata. It excludes itself. No earlier or recipient-side digest comparison is claimed.

## Verification

Run from the repository root:

```sh
python3 -m unittest discover -s tests -v
npm test
npm run test:browser -- --workers=2
```

The export tests generate all six packages, independently extract them with Python `tarfile`, recompute SHA-256 with Python and Node, verify every local graph reference, and check the human authority boundaries. `jsonld` expands every graph against a locally cached copy of the official RO-Crate 1.2 context. These are real syntax, structure, payload and boundary checks, not full DataCite, RO-Crate, PREMIS, BIDS, DDI, Darwin Core or ObsCore conformance validation.

Browser tests exercise downloads for all six completed routes and inspect the downloaded archives. They cover wrong observations, corrections, loading failure/retry, source consultation without losing a selected reviewer answer, 320×568 focus clearance, keyboard operation and axe. Existing roleplay, return, package repair, hard hold and reset suites remain in place. Two existing geometry selectors now target `#action .answer-card` so they measure the active reviewer choices rather than a collapsed material question.

## Reference choices

Pinned teaching versions keep the exercise reproducible; they are not a claim to implement the latest release.

- [DataCite 4.6](https://schema.datacite.org/meta/kernel-4.6/)
- [RO-Crate 1.2 structure](https://www.researchobject.org/ro-crate/specification/1.2/structure.html) and [required root properties](https://www.researchobject.org/ro-crate/specification/1.2/root-data-entity.html)
- [Workflow Run RO-Crate](https://www.researchobject.org/workflow-run-crate/)
- [PROV-O](https://www.w3.org/TR/prov-o/)
- [PREMIS](https://www.loc.gov/standards/premis/)
- [DDI](https://ddialliance.org/), [BIDS](https://bids-specification.readthedocs.io/), [Darwin Core](https://dwc.tdwg.org/), [ObsCore](https://www.ivoa.net/documents/ObsCore/), [DUO](https://www.ga4gh.org/product/data-use-ontology-duo/)

`tests/fixtures/ro-crate-context-1.2.json` is the official context retrieved from `https://w3id.org/ro/crate/1.2/context`, which resolves to the RO-Crate specification's context document. Its source metadata and licensing fields are retained. The runtime does not fetch that context; it is needed only by the offline test. The PREMIS website and PDF returned HTTP 403 during this iteration, so no fresh full PREMIS-schema validation is claimed.
