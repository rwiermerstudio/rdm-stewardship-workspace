"""Illustrative RDM documentation router. No policy evaluation or access grants.

This module deliberately has no network, storage, repository or LLM calls.
It accepts metadata-only fictional dockets and returns advisory artifact names.
Do not use its outcome as a legal, ethics, preservation or access decision.
"""

import json
import re
import sys
from pathlib import Path

FIELDS = {
    "change_kind": {"correction", "transformation", "protocol", "deposit"},
    "classification": {"open-candidate", "restricted", "unknown"},
    "consent_status": {"confirmed", "limited", "unknown", "not-applicable"},
    "community_authority": {"not-applicable", "reviewed", "required", "unknown"},
    "repository_status": {"none", "candidate", "reviewed"},
}
ID = re.compile(r"^[A-Za-z0-9_-]{1,64}$")
VERSION = re.compile(r"^[A-Za-z0-9._-]{1,64}$")
ARTIFACTS = {
    "correction": ("change log (reason and QC evidence)", "dataset version and README/data dictionary"),
    "transformation": ("provenance activity (input/output versions, actor, method, time)", "README/data dictionary and workflow/method record"),
    "protocol": ("protocol/method amendment", "external ethics or governance approval reference, when applicable"),
    "deposit": ("preservation manifest and checksums", "format inventory, rights/access statement and repository receipt"),
}


def validate(docket):
    """Validate the small public input shape without importing a schema library."""
    if not isinstance(docket, dict):
        raise ValueError("docket must be an object")
    allowed = {"id", "product_version", "input_versions", *FIELDS}
    if set(docket) - allowed or allowed - {"input_versions"} - set(docket):
        raise ValueError("unknown or missing fields")
    if not isinstance(docket["id"], str) or not ID.fullmatch(docket["id"]):
        raise ValueError("invalid docket id")
    if not isinstance(docket["product_version"], str) or not VERSION.fullmatch(docket["product_version"]):
        raise ValueError("invalid product version")
    for field, values in FIELDS.items():
        if not isinstance(docket[field], str) or docket[field] not in values:
            raise ValueError(f"invalid {field}")
    inputs = docket.get("input_versions", [])
    if (not isinstance(inputs, list) or len(inputs) > 100
            or any(not isinstance(v, str) or not VERSION.fullmatch(v) for v in inputs)
            or len(inputs) != len(set(inputs))):
        raise ValueError("invalid input_versions")
    if docket["change_kind"] == "transformation" and not inputs:
        raise ValueError("transformation requires an input version")
    if docket["product_version"] in inputs:
        raise ValueError("output must differ from inputs")
    return docket


def advise(docket):
    """Suggest documentation; hold on unresolved governance. Never return 'allow'."""
    d = validate(docket)
    artifacts = list(ARTIFACTS[d["change_kind"]])
    if d["change_kind"] != "deposit":
        artifacts.append("living DMP/plan assertion linked to this change")
    else:
        artifacts.append("preservation review and future fixity schedule")
    referrals = []
    if d["classification"] != "open-candidate":
        referrals.append("institutional data steward: confirm classification and safe metadata")
    if d["consent_status"] in {"limited", "unknown"}:
        referrals.append("privacy/ethics specialist: assess consent or permitted use")
    if d["community_authority"] != "not-applicable":
        referrals.append("relevant community decision authority: confirm scope and discoverability")
    if d["change_kind"] == "deposit" and d["repository_status"] != "reviewed":
        referrals.append("repository/preservation specialist: verify destination and custody")
    if d["change_kind"] == "protocol":
        referrals.append("ethics/protocol owner: assess whether amendment needs approval")
    return {
        "docket_id": d["id"],
        "outcome": "hold" if referrals else "guidance",
        "documentation": artifacts,
        "preservation_next_steps": [
            "identify responsible repository and retention review owner",
            "prepare versioned manifest, integrity checks and rights/access statement",
            "request actual repository receipt before marking deposit complete",
        ],
        "referrals": referrals,
        "access_granted": False,
        "policy_release_refs": [],
        "limitation": "Illustrative only: no institutional, disciplinary, funder, consent or community rule has been evaluated.",
    }


def main(argv):
    if len(argv) != 2:
        raise SystemExit("usage: python3 prototype/guide.py examples/<fictional-docket>.json")
    path = Path(argv[1])
    print(json.dumps(advise(json.loads(path.read_text(encoding="utf-8"))), indent=2))


if __name__ == "__main__":
    main(sys.argv)
