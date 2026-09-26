import importlib.util
import json
import sys
import unittest
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "prototype"))
spec = importlib.util.spec_from_file_location("catalog", ROOT / "prototype" / "catalog.py")
catalog = importlib.util.module_from_spec(spec)
spec.loader.exec_module(catalog)
SOURCE = ROOT / "examples" / "meridian-institute.json"


class InstitutionTests(unittest.TestCase):
    def setUp(self):
        self.data = json.loads(SOURCE.read_text())

    def test_published_catalogue_matches_evaluator_source(self):
        self.assertEqual((ROOT / "demo/meridian-institute.json").read_bytes(), SOURCE.read_bytes())

    def test_catalog_references_and_coverage_are_valid(self):
        report = catalog.validate_catalog(self.data)
        self.assertEqual(report["projects"], 6)
        self.assertEqual(report["groups"], 6)
        self.assertGreaterEqual(report["policies"], 8)
        self.assertTrue(report["synthetic"])

    def test_catalog_matches_json_schema_draft_2020_12(self):
        schema = json.loads((ROOT / "schemas/fictional-institution.schema.json").read_text())
        Draft202012Validator.check_schema(schema)
        Draft202012Validator(schema, format_checker=FormatChecker()).validate(self.data)

    def test_large_astronomy_routes_to_scale_archive(self):
        r = catalog.evaluate(self.data, "stellar-survey")
        self.assertEqual(r["outcome"], "guidance")
        self.assertEqual(r["repository_candidates"], ["meridian-scale"])
        self.assertTrue(any(p["id"] == "ASTRO-FITS" for p in r["matched_policies"]))
        self.assertFalse(r["access_granted"])

    def test_restricted_interviews_need_human_and_secure_repository(self):
        r = catalog.evaluate(self.data, "neighbourhood-voices")
        self.assertEqual(r["outcome"], "hold")
        self.assertIn("meridian-vault", r["repository_candidates"])
        self.assertNotIn("meridian-community", r["repository_candidates"])
        self.assertIn("privacy", r["reviewer_ids"])
        self.assertIn("SOC-DDI", [p["id"] for p in r["matched_policies"]])
        self.assertNotIn("open", r["access_options"])

    def test_unknown_consent_holds_even_with_repository_candidate(self):
        r = catalog.evaluate(self.data, "variant-study")
        self.assertEqual(r["outcome"], "hold")
        self.assertIn("meridian-vault", r["repository_candidates"])
        self.assertIn("privacy", r["reviewer_ids"])

    def test_community_custody_and_private_metadata(self):
        r = catalog.evaluate(self.data, "oral-heritage")
        self.assertEqual(r["repository_candidates"], ["meridian-community"])
        self.assertIn("community", r["reviewer_ids"])
        self.assertEqual(r["metadata_visibility"], "private")
        self.assertNotIn("open", r["access_options"])

    def test_sensitive_location_blocks_open_funder_preference(self):
        r = catalog.evaluate(self.data, "coastal-species")
        self.assertEqual(r["outcome"], "hold")
        self.assertIn("FUN-OPEN", [p["id"] for p in r["matched_policies"]])
        self.assertNotIn("open", r["access_options"])
        self.assertEqual(r["metadata_visibility"], "private")

    def test_neuroimaging_requires_documentation_and_review(self):
        r = catalog.evaluate(self.data, "brain-maps")
        self.assertIn("meridian-vault", r["repository_candidates"])
        self.assertIn("privacy", r["reviewer_ids"])
        self.assertTrue(any("BIDS" in a for a in r["documentation"]))

    def test_no_feasible_repository_is_explicit_hold(self):
        altered = json.loads(json.dumps(self.data))
        p = next(p for p in altered["projects"] if p["id"] == "stellar-survey")
        p["size_gib"] = 300000
        r = catalog.evaluate(altered, "stellar-survey")
        self.assertEqual(r["repository_candidates"], [])
        self.assertEqual(r["outcome"], "hold")
        self.assertIn("preservation", r["reviewer_ids"])

    def test_unapproved_rule_is_rejected(self):
        altered = json.loads(json.dumps(self.data))
        del altered["policies"][0]["approved_by"]
        with self.assertRaises(ValueError):
            catalog.validate_catalog(altered)

    def test_as_of_filters_policy_releases(self):
        older = catalog.evaluate(self.data, "neighbourhood-voices", as_of="2026-01-15")
        self.assertNotIn("MI-PRIV", [p["id"] for p in older["matched_policies"]])
        newer = catalog.evaluate(self.data, "neighbourhood-voices", as_of="2026-09-25")
        self.assertIn("MI-PRIV", [p["id"] for p in newer["matched_policies"]])
        self.assertEqual(older["outcome"], "hold")

    def test_unknown_policy_scope_is_rejected_not_silently_skipped(self):
        altered = json.loads(json.dumps(self.data))
        altered["policies"][0]["scope"] = {"surprise": "value"}
        with self.assertRaises(ValueError):
            catalog.validate_catalog(altered)

    def test_review_rule_requires_valid_reviewer(self):
        altered = json.loads(json.dumps(self.data))
        next(p for p in altered["policies"] if p["id"] == "MI-PRIV")["owner"] = "nonexistent"
        with self.assertRaises(ValueError):
            catalog.validate_catalog(altered)

    def test_new_policy_release_supersedes_prior_release_for_new_evaluation(self):
        altered = json.loads(json.dumps(self.data))
        prior = next(p for p in altered["policies"] if p["id"] == "MI-DOC")
        replacement = {**prior, "version": "2027.1", "effective_from": "2027-01-01", "artifact": "new trace record", "citation": "MI-DOC §2 revision (fictional)"}
        altered["policies"].append(replacement)
        old = catalog.evaluate(altered, "stellar-survey", as_of="2026-09-25")
        new = catalog.evaluate(altered, "stellar-survey", as_of="2027-02-01")
        self.assertIn("versioned change/provenance record", old["documentation"])
        self.assertNotIn("new trace record", old["documentation"])
        self.assertIn("new trace record", new["documentation"])
        self.assertNotIn("versioned change/provenance record", new["documentation"])
        self.assertEqual([p["version"] for p in new["matched_policies"] if p["id"] == "MI-DOC"], ["2027.1"])

    def test_new_release_scope_change_does_not_revive_old_rule(self):
        altered = json.loads(json.dumps(self.data))
        prior = next(p for p in altered["policies"] if p["id"] == "MI-DOC")
        altered["policies"].append({**prior, "version": "2027.2", "effective_from": "2027-01-01", "scope": {"discipline": "genomics"}, "citation": "MI-DOC §2 scoped (fictional)"})
        r = catalog.evaluate(altered, "stellar-survey", as_of="2027-02-01")
        self.assertNotIn("MI-DOC", [p["id"] for p in r["matched_policies"]])

    def test_expired_replacement_holds_instead_of_losing_document_rule(self):
        prior = next(p for p in self.data["policies"] if p["id"] == "MI-DOC")
        self.data["policies"].append({**prior, "version": "2027.1", "effective_from": "2027-01-01", "effective_until": "2027-02-01"})
        result = catalog.evaluate(self.data, "stellar-survey", as_of="2027-03-01")
        self.assertEqual(result["outcome"], "hold")
        self.assertTrue(any("MI-DOC" in s for s in result["referrals"]))

    def test_researcher_cannot_own_review(self):
        next(p for p in self.data["policies"] if p["id"] == "HER-COMM")["owner"] = "researcher-04"
        with self.assertRaises(ValueError):
            catalog.validate_catalog(self.data)

    def test_unknown_community_applicability_holds(self):
        next(p for p in self.data["projects"] if p["id"] == "stellar-survey")["community_governed"] = None
        result = catalog.evaluate(self.data, "stellar-survey")
        self.assertEqual(result["outcome"], "hold")
        self.assertIn("community", result["reviewer_ids"])

    def test_repository_without_compatible_access_is_excluded(self):
        repo = next(r for r in self.data["repositories"] if r["id"] == "meridian-community")
        repo["access"] = ["open"]
        result = catalog.evaluate(self.data, "oral-heritage")
        self.assertEqual(result["repository_candidates"], [])
        self.assertIn("access mode", next(x for x in result["repository_exclusions"] if x["id"] == repo["id"])["reasons"])

    def test_schema_and_runtime_reject_missing_lineage(self):
        schema = json.loads((ROOT / "schemas/fictional-institution.schema.json").read_text())
        p = next(p for p in self.data["projects"] if p["id"] == "oral-heritage")
        p["inputs"] = []
        self.assertFalse(Draft202012Validator(schema).is_valid(self.data))
        with self.assertRaises(ValueError):
            catalog.validate_catalog(self.data)

    def test_ambiguous_policy_release_is_rejected(self):
        altered = json.loads(json.dumps(self.data))
        altered["policies"].append({**altered["policies"][0], "version": "other"})
        with self.assertRaises(ValueError):
            catalog.evaluate(altered, "stellar-survey")

    def test_versions_and_input_lineage_are_present(self):
        for p in self.data["projects"]:
            with self.subTest(p=p["id"]):
                r = catalog.evaluate(self.data, p["id"])
                self.assertEqual(r["provenance"]["output"], p["output"])
                self.assertEqual(r["provenance"]["inputs"], p["inputs"])
                self.assertTrue(all("version" in x and "citation" in x for x in r["matched_policies"]))

    def test_catalog_has_no_subject_level_content(self):
        s = json.dumps(self.data).lower()
        for forbidden in ("participant_name", "birth_date", "raw_interview", "genome_sequence"):
            self.assertNotIn(forbidden, s)


if __name__ == "__main__":
    unittest.main()
