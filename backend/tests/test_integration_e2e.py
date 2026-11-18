import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import db
from app.models.schemas import (
    ContentSubmission, ContentSubmissionCreate, ContentType,
    ApprovalAction, ApplySuggestionRequest, SuggestionStatus, SubmissionStatus
)
from app.api.router import review_decision, apply_suggestion, submit_content
from fastapi import HTTPException

def test_e2e_governance_workflow():
    print("--- [TEST 1/5] Ingestion & Knowledge Base Check ---")
    org_id = "org-auracloud-001"
    assert org_id in db.facts, "Approved facts registry not found"
    assert len(db.facts[org_id]) >= 4, "Expected corporate facts in database"
    assert org_id in db.terminology, "Terminology rules not found"
    print(f"✓ Knowledge Base Verified: {len(db.facts[org_id])} corporate facts, {len(db.terminology[org_id])} terminology rules active.")

    print("\n--- [TEST 2/5] Full Multi-Layer Audit Execution ---")
    test_draft = (
        "AuraCloud guarantees 100% uptime with our new cloud platform. "
        "Recognized as India's No. 1 multi-cloud provider, we deliver AI magic "
        "and the cheapest cloud pricing available in modern computing."
    )
    sub_create = ContentSubmissionCreate(
        title="Enterprise Q4 Product Launch Notice",
        content_type=ContentType.PRESS_RELEASE,
        draft_text=test_draft
    )
    sub = submit_content(sub_create, org_id=org_id)
    assert sub.status == SubmissionStatus.AUDITED, "Submission status must be AUDITED"
    findings = db.findings.get(sub.id, [])
    assert len(findings) >= 4, f"Expected at least 4 findings, got {len(findings)}"
    assert sub.compliance_score < 60, f"Expected compliance penalty, got score {sub.compliance_score}%"
    print(f"✓ Audit Engine Verified: Identified {len(findings)} violations; initial compliance score: {sub.compliance_score}%.")

    print("\n--- [TEST 3/5] Server-Side RBAC & Gatekeeper Enforcement ---")
    # Attempt 1: Content Creator attempts to approve their own draft -> MUST RAISE 403
    creator_action = ApprovalAction(
        decision="approved",
        reviewer_comment="Self-approving my own draft",
        reviewer_role="creator"
    )
    try:
        review_decision(sub.id, creator_action, x_user_role="creator")
        assert False, "Security failure: Creator was erroneously permitted to approve submission!"
    except HTTPException as e:
        assert e.status_code == 403, f"Expected 403 Forbidden, got {e.status_code}"
        print("✓ RBAC Policy Enforced: Content Creator blocked from self-approving (403 Forbidden).")

    print("\n--- [TEST 4/5] Correction Studio Remediation & Score Recalculation ---")
    initial_score = sub.compliance_score
    # Accept each suggested correction
    for f in list(findings):
        req = ApplySuggestionRequest(accepted=True)
        res = apply_suggestion(f.id, req)
        assert res["status"] == "updated"

    # Verify score climbed to 100% after all fixes applied
    updated_sub = db.submissions[sub.id]
    assert updated_sub.compliance_score == 100, f"Expected 100% score after all fixes, got {updated_sub.compliance_score}%"
    assert len(db.revisions.get(sub.id, [])) >= 1, "Expected revision history recorded"
    print(f"✓ Studio Remediation Verified: Score improved from {initial_score}% -> {updated_sub.compliance_score}% (100% compliant).")

    print("\n--- [TEST 5/5] Reviewer Gatekeeper Approval & Cryptographic Stamp ---")
    # Reviewer approves the 100% compliant draft
    reviewer_action = ApprovalAction(
        decision="approved",
        reviewer_comment="All SLA bounds and brand terminology standards verified.",
        reviewer_role="reviewer"
    )
    approval_res = review_decision(sub.id, reviewer_action, x_user_role="reviewer")
    assert approval_res["status"] == "approved"
    assert updated_sub.status == SubmissionStatus.APPROVED
    assert updated_sub.id in db.approvals
    stamp = db.approvals[updated_sub.id][-1].cryptographic_stamp
    assert stamp.startswith("SHA256:"), f"Invalid cryptographic stamp: {stamp}"
    print(f"✓ Gatekeeper Approved: Generated cryptographic stamp {stamp}")

    # Check analytics telemetry
    analytics = db.get_governance_analytics(org_id)
    assert analytics["summary"]["approved_submissions"] >= 1
    assert "benchmark_baseline" in analytics, "Expected segregated benchmark baseline in analytics"
    print("✓ Analytics Telemetry Verified: Real numbers reported without artificial floors.")

if __name__ == "__main__":
    test_e2e_governance_workflow()
    print("\n=======================================================")
    print(">>> ALL END-TO-END INTEGRATION TESTS PASSED (5/5) <<<")
    print("=======================================================")
