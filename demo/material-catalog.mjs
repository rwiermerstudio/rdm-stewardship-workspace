// Authored fictional teaching material, not subject records.
export const materialCatalog={
  "neighbourhood-voices": {
    "standard": {
      "name": "DDI-style table and variable guide",
      "url": "https://ddialliance.org/"
    },
    "files": [
      {
        "path": "coded-table-EXAMPLE.csv",
        "description": "Two invented interview coding rows; no participant data.",
        "encodingFormat": "text/csv"
      },
      {
        "path": "guide-EXAMPLE.csv",
        "description": "Deliberately incomplete guide to the table columns.",
        "encodingFormat": "text/csv"
      },
      {
        "path": "method-EXAMPLE.json",
        "description": "Claimed coding history, not a run observed by this page.",
        "encodingFormat": "application/json"
      },
      {
        "path": "agreement-EXAMPLE.txt",
        "description": "Fictional restricted-use passage for discussion.",
        "encodingFormat": "text/plain"
      }
    ],
    "checks": [
      {
        "id": "column-definitions",
        "kind": "columns",
        "files": [
          "coded-table-EXAMPLE.csv",
          "guide-EXAMPLE.csv"
        ],
        "label": "Every table column has a guide entry"
      }
    ],
    "question": {
      "prompt": "Compare the table header with the guide. What should travel to the steward?",
      "options": [
        {
          "id": "inspect",
          "label": "confidence has no definition in guide-EXAMPLE.csv. Request its meaning and retain the table and guide privately; the consent owner still decides the proposed use.",
          "correct": true
        },
        {
          "id": "assume",
          "label": "The rows use codes, so publish the table without a definition of confidence.",
          "correct": false
        }
      ],
      "correction": "confidence has no definition in guide-EXAMPLE.csv. Request its meaning and retain the table and guide privately; the consent owner still decides the proposed use."
    },
    "history": {
      "kind": "manual",
      "status": "claimed",
      "input": "invented interview excerpts v1",
      "output": "coded-table-EXAMPLE.csv",
      "method": "method-EXAMPLE.json"
    }
  },
  "stellar-survey": {
    "standard": {
      "name": "ObsCore-style discovery row and processing record",
      "url": "https://www.ivoa.net/documents/ObsCore/"
    },
    "files": [
      {
        "path": "discovery-EXAMPLE.csv",
        "description": "Small discovery sample; no FITS payload or sky coordinates.",
        "encodingFormat": "text/csv"
      },
      {
        "path": "pipeline-run-EXAMPLE.json",
        "description": "A researcher-supplied run claim with a mismatched input version.",
        "encodingFormat": "application/json"
      },
      {
        "path": "calibration-EXAMPLE.json",
        "description": "The intended input version and invented calibration parameter.",
        "encodingFormat": "application/json"
      },
      {
        "path": "manifest-EXAMPLE.json",
        "description": "A deliberately incomplete transfer list.",
        "encodingFormat": "application/json"
      }
    ],
    "checks": [
      {
        "id": "run-input-version",
        "kind": "equal",
        "files": [
          "pipeline-run-EXAMPLE.json",
          "calibration-EXAMPLE.json"
        ],
        "field": "inputVersion",
        "label": "Run and calibration name the same input version"
      },
      {
        "id": "manifest-includes-run",
        "kind": "manifest",
        "files": [
          "manifest-EXAMPLE.json",
          "pipeline-run-EXAMPLE.json"
        ],
        "label": "Transfer list includes the supplied run note"
      }
    ],
    "question": {
      "prompt": "Read the run and calibration notes. What can you tell the steward?",
      "options": [
        {
          "id": "inspect",
          "label": "pipeline-run-EXAMPLE.json says raw-v0 but calibration-EXAMPLE.json says raw-v1. Ask which input was actually used; also add the run note to the transfer list.",
          "correct": true
        },
        {
          "id": "assume",
          "label": "The discovery row describes an image, so the raw-v0 run must explain the raw-v1 calibration.",
          "correct": false
        }
      ],
      "correction": "pipeline-run-EXAMPLE.json says raw-v0 but calibration-EXAMPLE.json says raw-v1. Ask which input was actually used; also add the run note to the transfer list."
    },
    "history": {
      "kind": "computation",
      "status": "claimed, unverified",
      "input": "raw-v0 claimed; raw-v1 intended",
      "output": "calibrated-v2 (payload not included)",
      "method": "pipeline-run-EXAMPLE.json"
    }
  },
  "brain-maps": {
    "standard": {
      "name": "BIDS-style companion information only",
      "url": "https://bids-specification.readthedocs.io/"
    },
    "files": [
      {
        "path": "scan-EXAMPLE.json",
        "description": "Invented companion fields for an absent scan. PatientName is intentionally unsafe.",
        "encodingFormat": "application/json"
      },
      {
        "path": "dataset_description.json",
        "description": "Teaching description, not a complete BIDS dataset.",
        "encodingFormat": "application/json"
      },
      {
        "path": "defacing-run-EXAMPLE.json",
        "description": "Claimed processing history. No image is supplied or inspected.",
        "encodingFormat": "application/json"
      }
    ],
    "checks": [
      {
        "id": "companion-direct-name",
        "kind": "absent-key",
        "files": [
          "scan-EXAMPLE.json"
        ],
        "field": "PatientName",
        "label": "Companion has no PatientName field"
      }
    ],
    "question": {
      "prompt": "Open scan-EXAMPLE.json. What did this text inspection find?",
      "options": [
        {
          "id": "inspect",
          "label": "scan-EXAMPLE.json still has PatientName. Propose removing that field while retaining useful scan context; request trained image inspection separately.",
          "correct": true
        },
        {
          "id": "assume",
          "label": "The run says face removal completed, so the companion fields and unseen image are safe to transfer.",
          "correct": false
        }
      ],
      "correction": "scan-EXAMPLE.json still has PatientName. Propose removing that field while retaining useful scan context; request trained image inspection separately."
    },
    "history": {
      "kind": "computation",
      "status": "claimed, unverified",
      "input": "scan-original-EXAMPLE.nii (absent)",
      "output": "scan-EXAMPLE.nii (absent)",
      "method": "defacing-run-EXAMPLE.json"
    }
  },
  "coastal-species": {
    "standard": {
      "name": "Darwin Core-style internal and proposed public observations",
      "url": "https://dwc.tdwg.org/"
    },
    "files": [
      {
        "path": "internal-EXAMPLE.csv",
        "description": "Invented internal site tokens only; not real locations.",
        "encodingFormat": "text/csv"
      },
      {
        "path": "public-draft-EXAMPLE.csv",
        "description": "Proposed public draft accidentally retains an internal locality column.",
        "encodingFormat": "text/csv"
      },
      {
        "path": "public-candidate-EXAMPLE.csv",
        "description": "Reduced candidate without locality; still NOT cleared for release.",
        "encodingFormat": "text/csv"
      },
      {
        "path": "method-EXAMPLE.txt",
        "description": "Area method and remaining independent risk question.",
        "encodingFormat": "text/plain"
      }
    ],
    "checks": [
      {
        "id": "public-locality",
        "kind": "absent-column",
        "files": [
          "public-draft-EXAMPLE.csv"
        ],
        "field": "locality",
        "label": "Public draft omits the internal locality column"
      }
    ],
    "question": {
      "prompt": "Compare the internal observations, public draft and reduced candidate. What remains to do?",
      "options": [
        {
          "id": "inspect",
          "label": "public-draft-EXAMPLE.csv retains locality. The reduced candidate removes it, but an independent specialist must still assess the map and caption before release.",
          "correct": true
        },
        {
          "id": "assume",
          "label": "public-candidate-EXAMPLE.csv has no locality column, so publish it without outside assessment.",
          "correct": false
        }
      ],
      "correction": "public-draft-EXAMPLE.csv retains locality. The reduced candidate removes it, but an independent specialist must still assess the map and caption before release."
    },
    "history": {
      "kind": "manual",
      "status": "illustrated, not a real transformation",
      "input": "internal-EXAMPLE.csv",
      "output": "public-candidate-EXAMPLE.csv",
      "method": "method-EXAMPLE.txt"
    }
  },
  "variant-study": {
    "standard": {
      "name": "Proposed use; DUO mapping deliberately unresolved",
      "url": "https://www.ga4gh.org/product/data-use-ontology-duo/"
    },
    "files": [
      {
        "path": "proposed-use-EXAMPLE.json",
        "description": "Proposed analysis only; no sequences or variants.",
        "encodingFormat": "application/json"
      },
      {
        "path": "agreement-EXAMPLE.txt",
        "description": "Agreement status, not invented consent.",
        "encodingFormat": "text/plain"
      },
      {
        "path": "run-proposal-EXAMPLE.json",
        "description": "Planned computational history; the job has not run.",
        "encodingFormat": "application/json"
      }
    ],
    "checks": [
      {
        "id": "agreement-reference",
        "kind": "nonempty",
        "files": [
          "proposed-use-EXAMPLE.json"
        ],
        "field": "agreementReference",
        "label": "Proposed use identifies an agreement to consult"
      }
    ],
    "question": {
      "prompt": "Read the proposed use beside the agreement register. What can you record?",
      "options": [
        {
          "id": "inspect",
          "label": "agreementReference is null in proposed-use-EXAMPLE.json. Ask the consent owner for the agreement and its interpretation; leave DUO unresolved and the run paused.",
          "correct": true
        },
        {
          "id": "assume",
          "label": "A secure vault permits reuse, so choose a general-research DUO term and start the proposed run.",
          "correct": false
        }
      ],
      "correction": "agreementReference is null in proposed-use-EXAMPLE.json. Ask the consent owner for the agreement and its interpretation; leave DUO unresolved and the run paused."
    },
    "history": {
      "kind": "computation",
      "status": "proposed, not executed",
      "input": "sequence-v1 (not supplied)",
      "output": "variant-calls-v2 (not produced)",
      "method": "run-proposal-EXAMPLE.json"
    }
  },
  "oral-heritage": {
    "standard": {
      "name": "Local agreement and correction log; no invented label authority",
      "url": "https://www.researchobject.org/ro-crate/"
    },
    "files": [
      {
        "path": "transcript-EXAMPLE.csv",
        "description": "Two invented transcript segments; no audio or real testimony.",
        "encodingFormat": "text/csv"
      },
      {
        "path": "correction-log-EXAMPLE.csv",
        "description": "One transcript segment is missing from the correction account.",
        "encodingFormat": "text/csv"
      },
      {
        "path": "agreement-EXAMPLE.json",
        "description": "Fictional agreement summary separates discovery and access.",
        "encodingFormat": "application/json"
      },
      {
        "path": "method-EXAMPLE.txt",
        "description": "Claimed manual correction, requiring a real source comparison.",
        "encodingFormat": "text/plain"
      }
    ],
    "checks": [
      {
        "id": "segment-coverage",
        "kind": "coverage",
        "files": [
          "transcript-EXAMPLE.csv",
          "correction-log-EXAMPLE.csv"
        ],
        "label": "Correction log accounts for every transcript segment"
      }
    ],
    "question": {
      "prompt": "Compare the transcript segments with the correction log. What should the next person know?",
      "options": [
        {
          "id": "inspect",
          "label": "EXAMPLE-02 is missing from correction-log-EXAMPLE.csv. Request its correction account; the agreement still leaves title visibility and file requests to the appointed body.",
          "correct": true
        },
        {
          "id": "assume",
          "label": "One correction row proves the whole transcript was checked and authorizes a public title.",
          "correct": false
        }
      ],
      "correction": "EXAMPLE-02 is missing from correction-log-EXAMPLE.csv. Request its correction account; the agreement still leaves title visibility and file requests to the appointed body."
    },
    "history": {
      "kind": "manual",
      "status": "claimed, unverified",
      "input": "recording-v1 (not supplied)",
      "output": "transcript-EXAMPLE.csv",
      "method": "method-EXAMPLE.txt"
    }
  }
};
