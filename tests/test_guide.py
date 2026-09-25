import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("guide", ROOT / "prototype" / "guide.py")
guide = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guide)


class GuideTests(unittest.TestCase):
    def fixture(self, name):
        return json.loads((ROOT / "examples" / name).read_text(encoding="utf-8"))

    def test_open_correction_has_change_record_not_grant(self):
        result = guide.advise(self.fixture("open-change.json"))
        self.assertEqual(result["outcome"], "guidance")
        self.assertFalse(result["access_granted"])
        self.assertTrue(any("change log" in x for x in result["documentation"]))
        self.assertEqual(result["policy_release_refs"], [])

    def test_restricted_derivative_holds_for_multiple_authorities(self):
        result = guide.advise(self.fixture("restricted-derivative.json"))
        self.assertEqual(result["outcome"], "hold")
        self.assertFalse(result["access_granted"])
        self.assertTrue(any("provenance" in x for x in result["documentation"]))
        self.assertTrue(any("community" in x for x in result["referrals"]))
        self.assertTrue(any("consent" in x for x in result["referrals"]))

    def test_unknown_classification_holds(self):
        d = self.fixture("open-change.json")
        d["classification"] = "unknown"
        self.assertEqual(guide.advise(d)["outcome"], "hold")

    def test_deposit_requires_repository_review(self):
        d = self.fixture("open-change.json")
        d["change_kind"] = "deposit"
        self.assertEqual(guide.advise(d)["outcome"], "hold")
        self.assertTrue(any("receipt" in s for s in guide.advise(d)["documentation"]))

    def test_reviewed_deposit_still_not_permission(self):
        d = self.fixture("open-change.json")
        d["change_kind"] = "deposit"
        d["repository_status"] = "reviewed"
        result = guide.advise(d)
        self.assertEqual(result["outcome"], "guidance")
        self.assertFalse(result["access_granted"])

    def test_invalid_fields_and_lineage_rejected(self):
        d = self.fixture("restricted-derivative.json")
        for key, value in [("consent_status", "yes"), ("input_versions", []),
                           ("product_version", "interview-source-v1")]:
            altered = {**d, key: value}
            with self.subTest(key=key), self.assertRaises(ValueError):
                guide.advise(altered)
        with self.assertRaises(ValueError):
            guide.advise({**d, "participant_name": "fictional"})

    def test_schema_and_example_required_fields(self):
        schema = json.loads((ROOT / "schemas" / "decision-docket.schema.json").read_text())
        self.assertFalse(schema["additionalProperties"])
        for name in ("open-change.json", "restricted-derivative.json"):
            d = self.fixture(name)
            self.assertTrue(set(schema["required"]).issubset(d))
            self.assertEqual(guide.validate(d), d)


if __name__ == "__main__":
    unittest.main()
