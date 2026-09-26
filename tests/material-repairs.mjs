// Byte mutations prove checks react; these do not authorize real corrections.
export const repairs={
  "neighbourhood-voices": [
    {
      "path": "guide-EXAMPLE.csv",
      "before": "change_code,1 unchanged; 2 changed\n",
      "after": "change_code,1 unchanged; 2 changed\nconfidence,Invented coder confidence category\n"
    }
  ],
  "stellar-survey": [
    {
      "path": "pipeline-run-EXAMPLE.json",
      "before": "raw-v0",
      "after": "raw-v1"
    },
    {
      "path": "manifest-EXAMPLE.json",
      "before": "\"discovery-EXAMPLE.csv\",",
      "after": "\"pipeline-run-EXAMPLE.json\",\n    \"discovery-EXAMPLE.csv\","
    }
  ],
  "brain-maps": [
    {
      "path": "scan-EXAMPLE.json",
      "before": "  \"PatientName\": \"EXAMPLE NOT A PERSON\",\n",
      "after": ""
    }
  ],
  "coastal-species": [
    {
      "path": "public-draft-EXAMPLE.csv",
      "before": ",locality",
      "after": ""
    },
    {
      "path": "public-draft-EXAMPLE.csv",
      "before": ",EXAMPLE-secret-site-A",
      "after": ""
    }
  ],
  "variant-study": [
    {
      "path": "proposed-use-EXAMPLE.json",
      "before": "\"agreementReference\": null",
      "after": "\"agreementReference\": \"EXAMPLE supplied pointer, still unverified\""
    }
  ],
  "oral-heritage": [
    {
      "path": "correction-log-EXAMPLE.csv",
      "before": "EXAMPLE-01,hall replaces room\n",
      "after": "EXAMPLE-01,hall replaces room\nEXAMPLE-02,no change claimed; verify against recording\n"
    }
  ]
};
