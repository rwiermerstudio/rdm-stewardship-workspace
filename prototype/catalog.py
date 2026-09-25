"""Evaluate entirely fictional institution metadata; no permission or policy advice.

Curated example rules here exercise architectural boundaries, not real requirements.
No research bytes, subject records, credentials or network operations are accepted.
"""

import argparse
import datetime as dt
import json
from pathlib import Path

from guide import advise

PROJECT_FIELDS = {"id", "group", "pi", "steward", "discipline", "size_gib", "formats", "classification", "residency", "community_governed", "consent_status", "metadata_visibility", "inputs", "output", "change_kind"}
POLICY_FIELDS = {"id", "version", "authority", "scope", "effect", "reason", "citation", "approved_by", "effective_from"}


def _unique(items, label):
    ids = [item["id"] for item in items]
    if len(ids) != len(set(ids)):
        raise ValueError(f"duplicate {label} id")
    return {item["id"]: item for item in items}


def validate_catalog(data):
    if not isinstance(data, dict) or data.get("institution", {}).get("status") != "synthetic":
        raise ValueError("this demonstrator only accepts explicitly synthetic catalogues")
    persons = _unique(data["people"], "person")
    groups = _unique(data["groups"], "group")
    repos = _unique(data["repositories"], "repository")
    projects = _unique(data["projects"], "project")
    releases = [(p["id"], p["version"]) for p in data["policies"]]
    if len(releases) != len(set(releases)):
        raise ValueError("duplicate policy release")
    for group in groups.values():
        if group["lead"] not in persons or any(x not in persons for x in group["members"]):
            raise ValueError("unknown group person")
    for repo in repos.values():
        if repo["custodian"] not in persons or repo["max_gib"] <= 0 or repo["status"] != "candidate-only":
            raise ValueError("invalid repository capability/custodian")
    for policy in data["policies"]:
        if not POLICY_FIELDS.issubset(policy) or not policy["approved_by"] or "fictional" not in policy["citation"].lower():
            raise ValueError("rule must be reviewed and labelled fictional")
        if not isinstance(policy["scope"], dict) or not policy["scope"] or not set(policy["scope"]).issubset({"all", "classification", "discipline", "community_governed", "funder"}):
            raise ValueError("unknown or empty policy scope")
        if policy["effect"] == "review":
            owner = persons.get(policy.get("owner"))
            expected = "community-authority" if policy["authority"] == "community" else "privacy-reviewer" if policy["id"] in {"MI-PRIV", "GEN-USE"} else "data-steward"
            if not owner or owner["role"] != expected or policy["owner"] == policy["approved_by"]:
                raise ValueError("review rule requires a separate decision owner with the right role")
        dt.date.fromisoformat(policy["effective_from"])
        if policy.get("effective_until") and dt.date.fromisoformat(policy["effective_until"]) < dt.date.fromisoformat(policy["effective_from"]):
            raise ValueError("invalid policy interval")
        if policy["effect"] not in {"document", "review", "preference"}:
            raise ValueError("unsupported policy effect")
    for project in projects.values():
        if not PROJECT_FIELDS.issubset(project) or project["group"] not in groups:
            raise ValueError("invalid project or group")
        if (project["pi"] not in groups[project["group"]]["members"]
                or project["steward"] not in persons
                or persons[project["steward"]]["role"] != "data-steward"
                or project["discipline"] not in persons[project["steward"]]["disciplines"]):
            raise ValueError("missing responsible researcher or disciplinary steward")
        if project["size_gib"] <= 0 or not project["formats"] or len(project["formats"]) != len(set(project["formats"])) or not project["inputs"] or project["output"] in project["inputs"]:
            raise ValueError("invalid dataset scale/formats")
        if project["metadata_visibility"] == "public" and project["classification"] != "open-candidate":
            raise ValueError("restricted/unknown data cannot default to public metadata")
        advise(_guide_input(project))
    return {"synthetic": True, "people": len(persons), "groups": len(groups), "repositories": len(repos), "policies": len(data["policies"]), "projects": len(projects)}


def _guide_input(project):
    return {
        "id": project["id"], "product_version": project["output"],
        "input_versions": project["inputs"], "change_kind": project["change_kind"],
        "classification": project["classification"], "consent_status": project["consent_status"],
        "community_authority": "unknown" if project["community_governed"] is None else "required" if project["community_governed"] else "not-applicable",
        "repository_status": "candidate",
    }


def _applies(policy, project, date):
    if dt.date.fromisoformat(policy["effective_from"]) > date:
        return False
    if policy.get("effective_until") and dt.date.fromisoformat(policy["effective_until"]) < date:
        return False
    for field, value in policy["scope"].items():
        if field == "all" and value is True:
            continue
        if project.get(field) != value:
            return False
    return True


def _active_releases(policies, project, date):
    """Select newest release; surface gaps rather than reviving superseded rules."""
    active = {}
    for policy in policies:
        if dt.date.fromisoformat(policy["effective_from"]) > date:
            continue
        prior = active.get(policy["id"])
        if prior and prior["effective_from"] == policy["effective_from"]:
            raise ValueError("ambiguous policy releases with same effective date")
        if not prior or prior["effective_from"] < policy["effective_from"]:
            active[policy["id"]] = policy
    matched = sorted((p for p in active.values() if _applies(p, project, date)), key=lambda p: p["id"])
    gaps = sorted(p["id"] for p in active.values() if p.get("effective_until") and dt.date.fromisoformat(p["effective_until"]) < date and all(q["id"] != p["id"] for q in matched))
    return matched, gaps


def _repository_fit(repo, project):
    reasons = []
    if repo.get("community_only", False) != project["community_governed"]:
        reasons.append("governance scope")
    if project["size_gib"] > repo["max_gib"]:
        reasons.append("size")
    if not set(project["formats"]).issubset(repo["formats"]):
        reasons.append("format")
    if project["classification"] not in repo["allowed_classifications"]:
        reasons.append("classification")
    if project["residency"] not in repo["residency"]:
        reasons.append("residency")
    if project["metadata_visibility"] not in repo["metadata_visibility"]:
        reasons.append("metadata visibility")
    if not (set(repo["access"]) & ({"mediated", "enclave"} if project["classification"] != "open-candidate" or project["community_governed"] is not False else {"open", "mediated", "enclave"})):
        reasons.append("access mode")
    return reasons


def evaluate(data, project_id, *, as_of="2026-09-25"):
    validate_catalog(data)
    date = dt.date.fromisoformat(as_of)
    projects = {p["id"]: p for p in data["projects"]}
    if project_id not in projects:
        raise ValueError("unknown project")
    project = projects[project_id]
    base = advise(_guide_input(project))
    matches, gaps = _active_releases(data["policies"], project, date)
    documentation = list(base["documentation"])
    reviewers = {project["steward"]}
    if project["classification"] != "open-candidate" or project["consent_status"] in {"limited", "unknown"}:
        reviewers.add("privacy")
    if project["community_governed"] is not False:
        reviewers.add("community")
    for rule in matches:
        if rule.get("artifact") and rule["effect"] == "document":
            documentation.append(rule["artifact"])
        if rule["effect"] == "review":
            reviewers.add(rule["owner"])
    candidates = []
    exclusions = []
    for repo in data["repositories"]:
        reasons = _repository_fit(repo, project)
        if reasons:
            exclusions.append({"id": repo["id"], "reasons": reasons})
        else:
            candidates.append(repo["id"])
    if not candidates:
        reviewers.add("preservation")
    candidates.sort()
    access = sorted({mode for repo in data["repositories"] if repo["id"] in candidates for mode in repo["access"]})
    if project["classification"] != "open-candidate" or project["community_governed"]:
        access = [mode for mode in access if mode != "open"]
    held = base["outcome"] == "hold" or bool([p for p in matches if p["effect"] == "review"]) or not candidates or bool(gaps)
    return {
        "project_id": project_id,
        "institution": data["institution"]["id"],
        "as_of": as_of,
        "outcome": "hold" if held else "guidance",
        "documentation": list(dict.fromkeys(documentation)),
        "provenance": {"inputs": project["inputs"], "output": project["output"], "actor_ref": project["pi"], "method_ref": project.get("method"), "activity": project["change_kind"]},
        "matched_policies": [{k: p[k] for k in ("id", "version", "authority", "citation", "approved_by")} for p in matches],
        "repository_candidates": candidates,
        "repository_exclusions": exclusions,
        "access_options": access,
        "metadata_visibility": project["metadata_visibility"],
        "reviewer_ids": sorted(reviewers),
        "referrals": base["referrals"] + (["preservation specialist: no candidate meets all stated capabilities"] if not candidates else []) + [f"policy steward: {id} latest release expired; no applicable current release confirmed" for id in gaps],
        "access_granted": False,
        "deposit_accepted": False,
        "limitations": "Fictional policies and declared repository capabilities only; no actual policy interpretation, permission, enforcement, custody or preservation guarantee.",
    }


def main():
    parser = argparse.ArgumentParser(description="Evaluate fictional Meridian research projects")
    parser.add_argument("project_id", nargs="?", help="project ID (omit to list all)")
    parser.add_argument("--as-of", default="2026-09-25", help="ISO policy evaluation date")
    args = parser.parse_args()
    data = json.loads((Path(__file__).resolve().parents[1] / "examples/meridian-institute.json").read_text())
    validate_catalog(data)
    if args.project_id:
        output = evaluate(data, args.project_id, as_of=args.as_of)
    else:
        output = [evaluate(data, p["id"], as_of=args.as_of) for p in data["projects"]]
    print(json.dumps(output, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
