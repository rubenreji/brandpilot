import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.ai_auditor import AIAuditEngine
from app.models.schemas import ContentSubmission, ContentType, SubmissionStatus
from app.core.database import db

def test_full_audit_workflow():
    org_id = "org-auracloud-001"
    rules = db.terminology[org_id]
    chunks = db.guideline_chunks[org_id]
    facts = db.facts[org_id]
    tone = db.tone_profiles[org_id]

    sub = ContentSubmission(
        organization_id=org_id,
        title="Test Press Release",
        content_type=ContentType.PRESS_RELEASE,
        original_text="We are India's No. 1 company. Our AI magic delivers 100% accuracy and is the cheapest.",
        current_text="We are India's No. 1 company. Our AI magic delivers 100% accuracy and is the cheapest."
    )

    findings = AIAuditEngine.audit_submission(
        submission=sub,
        terminology_rules=rules,
        guideline_chunks=chunks,
        approved_facts=facts,
        tone_profile=tone
    )

    # Must find all 4 violations
    assert len(findings) >= 4
    score = AIAuditEngine.calculate_compliance_score(findings)
    assert score < 50  # severely penalized for multiple critical issues
    print(f"✓ test_full_audit_workflow passed (Identified {len(findings)} findings, score={score})")

if __name__ == "__main__":
    test_full_audit_workflow()
    print("ALL AUDIT TESTS PASSED!")
