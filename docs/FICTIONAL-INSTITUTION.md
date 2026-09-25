# Meridian Institute — entirely fictional exercise environment

The [catalogue](../examples/meridian-institute.json) is **synthetic**: fictional names, funders, policies, capacities, researchers and project metadata. It contains no participant records or real community agreement. A `role:` contact is a placeholder, not an address. Do not cite any Meridian rule as real guidance.

## Organisational and repository model

Six groups span astronomy, social science, genomics, history, biodiversity and neuroimaging. Each has a named PI and a subject-matched data steward. A central privacy reviewer and preservation curator handle referrals; the history project has a separate community-appointed decision route, deliberately not subordinate to the PI. Practices cover versioned change records, fixity, safe metadata and a living plan linked to dockets.

Four repositories offer **declared candidate capabilities**, not verified preservation services:

- `meridian-archive`: smaller general materials, possible public or mediated access, reviewed metadata visibility.
- `meridian-vault`: large restricted data in the fictional NL site, mediated or enclave access.
- `meridian-scale`: very large open-candidate scientific data; no restricted collections.
- `meridian-community`: restricted community-governed collections only, private discovery by default.

A candidate is only format/scale/classification/residency/governance fit based on declared fields. It is **not** acceptance, certification, cost/funding confirmation, integrity check, lawful basis or evidence that the repository has the required workflows. Unknown classification cannot default into a repository. Real curation would inspect files and agreements before a handoff.

## Projects exercising different paths

- **Sky survey:** 120,000 GiB FITS/Zarr derivatives; pipeline lineage and calibration history; scale archive candidate, open-candidate only, no access grant.
- **Urban interviews:** 80 GiB audio/text/tabular material, limited consent; DDI-style codebook and safe metadata, secure vault candidate with privacy referral.
- **Variant cohort:** 40,000 GiB FASTQ/VCF, unknown consent; secure vault candidate but hold pending authorised human assessment of permitted use.
- **Oral heritage:** 600 GiB WAV/TIFF/text, community-governed and restricted; only community collection candidate; community authority and privacy both review discoverability and reuse.
- **Coastal occurrence observations:** 300 GiB CSV/TIFF, sensitive site coordinates and an openness-preferring fictional funder; general archive candidate, **no open access option or public metadata** pending review.
- **MRI series:** 1,800 GiB NIfTI/JSON, pseudonymisation/de-identification context; BIDS-oriented sidecars and privacy review in secure vault. Defacing does not itself establish anonymity.

`size_gib` expresses an approximate project planning scale, not a tested transfer speed, quota reservation, deposit receipt or preservation commitment. Dataset bytes are absent.

## Executable evaluation

```sh
python3 prototype/catalog.py                         # evaluate all six
python3 prototype/catalog.py oral-heritage
python3 prototype/catalog.py neighbourhood-voices --as-of 2026-01-15
python3 -m unittest discover -s tests -v
```

The evaluator validates catalogue references, relevant steward assignments, reviewed fictional rule releases and restricted metadata defaults. It matches effective policy releases and selects one active version per rule ID; it lists cited rules and candidate repositories with exclusion reasons. It produces a documentation list, an input→output provenance stub, referrals and a hold/guidance outcome. **Neither `guidance` nor an `access_options` value means permission to open or deposit data**; `access_granted` and `deposit_accepted` remain false. Rule effects marked `preference` do not override restrictions. The demonstrator deliberately has no consent adjudication, conflict hierarchy, human-determination write path, actual custody or repository connector.

## Standards alignment, not conformance

| Concept | Current standard or practice to map to | What this prototype does and does not do |
|---|---|---|
| Project plans | [RDA DMP Common Standard](https://www.rd-alliance.org/groups/dmp-common-standards-wg/outputs/?output=94576) | Keeps project, funder, data-product and repository references for future maDMP export; **not** a conforming maDMP serializer. |
| Lineage | [W3C PROV-O](https://www.w3.org/TR/prov-o/) | Models input/output versions, actor, method and activity. Needs timestamps, qualified relations, stable identifiers and safe evidence links before interchange. |
| Deposit metadata | [DataCite Metadata Schema 4.7](https://schema.datacite.org/meta/kernel-4.7/) | Has titles, creators, formats and version links only in part; no DOI minting, full mandatory metadata or validated DataCite export. |
| Preservation | [PREMIS](https://www.loc.gov/standards/premis/) and [BagIt RFC 8493](https://www.rfc-editor.org/info/rfc8493/) | Suggests events, rights, manifests and checksums; creates no PREMIS events, BagIt packages or fixity schedule. |
| Packaged research objects | [RO-Crate specification](https://www.researchobject.org/ro-crate/specification) | Future packaging/machine-readable metadata option; no crate generated. |
| Astronomy | [FITS standard](https://fits.gsfc.nasa.gov/fits_standard.html) | Fictional astronomy rule prompts calibration/workflow history; does not parse FITS. |
| Social sciences | [DDI Lifecycle](https://ddialliance.org/ddi-lifecycle) | Asks for questionnaire/codebook/variable metadata; does not emit DDI XML. |
| Human genomics | [GA4GH Data Use Ontology](https://www.ga4gh.org/product/data-use-ontology-duo/) | Listed as a future encoding for *reviewed* data-use permissions; no automated consent inference. |
| Biodiversity | [Darwin Core](https://dwc.tdwg.org/) | Prompts occurrence metadata with sensitive-coordinate generalisation and review; no validator. |
| MRI/neuroimaging | [BIDS specification](https://bids-specification.readthedocs.io/en/stable/) | Prompts compatible sidecars and de-identification review; no BIDS validation. |
| Community governance | [CARE principles](https://www.gida-global.org/careprinciples) | Routes decisions to affected authority and restricts metadata; no universal proxy for a community's own terms. |

Schema: [`fictional-institution.schema.json`](../schemas/fictional-institution.schema.json) describes the synthetic fixture shape; [`decision-docket.schema.json`](../schemas/decision-docket.schema.json) describes the earlier minimal docket. Cross-record foreign keys and policy semantics are additionally validated in Python. Standard names in the fixture are **intended mapping targets**, not assertions of certified implementation.
