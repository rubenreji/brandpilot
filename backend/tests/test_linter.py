import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.linter import DeterministicLinter
from app.models.schemas import TerminologyRule, RuleType, FindingSeverity, IssueCategory

def test_prohibited_terms_detected():
    rules = [
        TerminologyRule(
            id="1",
            organization_id="org-1",
            term="AI magic",
            rule_type=RuleType.PROHIBITED,
            preferred_alternative="automated intelligence",
            rule_description="Avoid hype"
        )
    ]
    text = "We built an AI magic tool for teams."
    findings = DeterministicLinter.lint_text(text, rules, "sub-1")
    assert len(findings) == 1
    assert findings[0].category == IssueCategory.TERMINOLOGY
    assert findings[0].original_text == "AI magic"
    assert findings[0].suggested_correction == "automated intelligence"
    print("✓ test_prohibited_terms_detected passed")

def test_missing_required_disclaimer_detected():
    rules = [
        TerminologyRule(
            id="2",
            organization_id="org-1",
            term="Results may vary depending on cloud workload configuration.",
            rule_type=RuleType.REQUIRED,
            rule_description="Mandatory disclaimer for benchmark claims"
        )
    ]
    text = "Our software benchmarks show 10x speedup."
    findings = DeterministicLinter.lint_text(text, rules, "sub-2")
    assert any(f.category == IssueCategory.MISSING_DISCLAIMER for f in findings)
    print("✓ test_missing_required_disclaimer_detected passed")

def test_absolute_performance_guarantee_detected():
    rules = []
    text = "We guarantee 100% accuracy on every document."
    findings = DeterministicLinter.lint_text(text, rules, "sub-3")
    assert any(f.severity == FindingSeverity.CRITICAL for f in findings)
    print("✓ test_absolute_performance_guarantee_detected passed")

if __name__ == "__main__":
    test_prohibited_terms_detected()
    test_missing_required_disclaimer_detected()
    test_absolute_performance_guarantee_detected()
    print("ALL LINTER TESTS PASSED!")
