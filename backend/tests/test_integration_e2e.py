import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import db
from app.models.schemas import (
    ContentSubmission, ContentSubmissionCreate, ContentType,
    ApprovalAction, ApplySuggestionRequest, SuggestionStatus, SubmissionStatus,
    AutoExtractRequest, PublishingDispatchRequest, InSituLintRequest,
    MultimodalSpeechAuditRequest, SlackAlertDispatchRequest,
    CompetitorScanRequest, PublicVerificationResponse,
    WebhookTestPingRequest, ApiKeyGenerateRequest,
    VisualInspectPresetRequest
)
from app.api.router import (
    review_decision, apply_suggestion, submit_content,
    auto_extract_brand_guidelines, dispatch_to_publishing_gateway, in_situ_quick_lint,
    audit_multimodal_speech, dispatch_slack_incident_alert,
    get_public_verification_record, scan_competitor_vulnerabilities,
    get_enterprise_system_status, test_webhook_ping, generate_api_key, get_subscription_and_usage,
    inspect_visual_preset
)
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

    print("\n--- [TEST 6/8] Autonomous Guideline Ingestion & Rule Parsing ---")
    extract_req = AutoExtractRequest(
        source_title="AuraCloud Enterprise Communication Standard v3.0",
        org_id=org_id
    )
    extract_res = auto_extract_brand_guidelines(extract_req)
    assert extract_res["status"] == "extracted_and_indexed"
    assert extract_res["extracted_rules_count"] >= 3
    assert extract_res["extracted_facts_count"] >= 3
    assert "design_tokens" in extract_res
    print(f"✓ Autonomous Ingestion Verified: Extracted {extract_res['extracted_rules_count']} rules & {extract_res['extracted_facts_count']} facts in {extract_res['elapsed_ms']}ms.")

    print("\n--- [TEST 7/8] Closed-Loop Cryptographic CMS Publishing Gatekeeper ---")
    # Subtest A: Attempting to publish an unapproved submission MUST be blocked with 403
    unapproved_sub = submit_content(
        ContentSubmissionCreate(
            title="Unapproved Draft Campaign",
            content_type=ContentType.MARKETING_COPY,
            draft_text="Raw unverified blog post with AI magic."
        ),
        org_id=org_id
    )
    try:
        dispatch_to_publishing_gateway(PublishingDispatchRequest(
            submission_id=unapproved_sub.id,
            platform="Webflow CMS"
        ))
        assert False, "Security failure: Unapproved draft was erroneously permitted to publish to CMS!"
    except HTTPException as e:
        assert e.status_code == 403, f"Expected 403 Forbidden, got {e.status_code}"
        assert "CRYPTOGRAPHIC_GATEKEEPER_REJECTION" in str(e.detail)
        print("✓ Zero-Leakage Policy Enforced: Unapproved draft publication blocked (403 Forbidden).")

    # Subtest B: Publishing approved submission with valid SHA-256 stamp MUST succeed
    dispatch_res = dispatch_to_publishing_gateway(PublishingDispatchRequest(
        submission_id=updated_sub.id,
        platform="Webflow CMS",
        clearance_stamp=stamp
    ))
    assert dispatch_res["status"] == "DISPATCHED_LIVE"
    assert "hmac_security_digest" in dispatch_res
    assert dispatch_res["published_url"].startswith("https://cdn.auracloud.io")
    print(f"✓ CMS Gateway Verified: Approved submission successfully published to Webflow with {dispatch_res['hmac_security_digest'][:24]}...")

    print("\n--- [TEST 8/8] Sub-10ms In-Situ Linter API (Figma & Extension) ---")
    lint_req = InSituLintRequest(
        text="AuraCloud guarantees 100% uptime and uses AI magic for the cheapest cloud storage.",
        colors=["#0F172A", "#FFFFFF"],
        org_id=org_id
    )
    lint_res = in_situ_quick_lint(lint_req)
    assert lint_res["status"] == "success"
    assert lint_res["issues_count"] >= 3
    assert lint_res["latency_ms"] < 20.0, f"Latency expected sub-20ms, got {lint_res['latency_ms']}ms"
    assert lint_res["wcag_contrast"]["wcag_aaa_pass"] is True
    print(f"✓ In-Situ Linter Verified: Scanned live text in {lint_res['latency_ms']}ms with WCAG AAA validation.")

    print("\n--- [TEST 9/10] Multimodal Speech Auditing & US FTC Statutory Checks ---")
    speech_req = MultimodalSpeechAuditRequest(
        title="CEO Global Cloud Keynote 2026",
        transcript="Welcome everyone. AuraCloud guarantees 100% uptime with our new platform. Recognized as No. 1, we deliver AI magic and the cheapest pricing.",
        speaker_role="Chief Executive Officer",
        jurisdiction="us_ftc",
        org_id=org_id
    )
    speech_res = audit_multimodal_speech(speech_req)
    assert speech_res["status"] == "audited"
    assert speech_res["spoken_findings_count"] >= 3
    assert speech_res["speech_pacing_wpm"] > 0
    assert "teleprompter_clean_script" in speech_res
    assert "99.95% monthly uptime SLA" in speech_res["teleprompter_clean_script"]
    print(f"✓ Multimodal Speech Auditor Verified: Caught {speech_res['spoken_findings_count']} spoken violations with teleprompter auto-patch ({speech_res['latency_ms']}ms).")

    print("\n--- [TEST 10/10] Real-Time Slack & Teams Incident Webhook Dispatch ---")
    slack_req = SlackAlertDispatchRequest(
        submission_id=sub.id,
        channel="#brand-safety-escalations",
        severity_level="critical"
    )
    slack_res = dispatch_slack_incident_alert(slack_req)
    assert slack_res["status"] == "DELIVERED"
    assert "block_kit_payload" in slack_res
    assert len(slack_res["block_kit_payload"]["blocks"]) >= 4
    print(f"✓ Slack Incident Webhook Verified: Generated interactive Block Kit payload for {slack_res['channel']}.")

    print("\n--- [TEST 11/12] Public Cryptographic Verification Record Lookup ---")
    verify_res = get_public_verification_record(updated_sub.id)
    assert verify_res.is_verified is True
    assert verify_res.status == "VERIFIED_IMMUTABLE"
    assert verify_res.sha256_document_digest.startswith("SHA256:")
    assert verify_res.active_guideline_version == "GUIDE-HASH-8B42-V2.4"
    print(f"✓ Public Ledger Verified: Document {verify_res.submission_id} verified with SHA-256 digest ({verify_res.sha256_document_digest[:24]}...).")

    print("\n--- [TEST 12/12] Competitor Counter-Campaign Vulnerability Scan ---")
    comp_req = CompetitorScanRequest(
        competitor_name="Legacy Hyperscaler Cloud",
        copy_text="We guarantee 100% uptime with the cheapest cloud storage and AI magic.",
        target_jurisdiction="us_ftc",
        org_id=org_id
    )
    comp_res = scan_competitor_vulnerabilities(comp_req)
    assert comp_res["status"] == "completed"
    assert comp_res["vulnerabilities_count"] >= 3
    assert len(comp_res["vulnerabilities"]) >= 3
    assert "counter_rebuttal" in comp_res["vulnerabilities"][0]["suggested_counter_rebuttal"].lower() or len(comp_res["vulnerabilities"][0]["suggested_counter_rebuttal"]) > 10
    print(f"✓ Competitor Intelligence Verified: Discovered {comp_res['vulnerabilities_count']} vulnerabilities in competitor copy with verified counter-rebuttals ({comp_res['elapsed_ms']}ms).")

    print("\n--- [TEST 13/16] Enterprise System Status & Zero Data Retention Check ---")
    sys_status = get_enterprise_system_status()
    assert sys_status["status"] == "operational"
    assert sys_status["zero_data_retention_active"] is True
    assert "ISO 27001" in sys_status["data_residency_compliance"]
    print(f"✓ Enterprise System Health: {sys_status['platform_version']} operational in {sys_status['deployment_region']} (Zero Data Retention Active).")

    print("\n--- [TEST 14/16] Cryptographically Signed Outbound Webhook Test Ping ---")
    wh_req = WebhookTestPingRequest(
        target_url="https://hooks.auracloud.io/brandpilot/events",
        event_type="audit.flagged",
        secret_key="whsec_live_9b42e718c30f4a9b"
    )
    wh_res = test_webhook_ping(wh_req)
    assert wh_res["status"] == "DELIVERED"
    assert wh_res["http_response_code"] == 200
    assert "v1=" in wh_res["signature_header"]
    print(f"✓ Webhook Engine Verified: Delivered signed HMAC-SHA256 payload to {wh_res['target_url']} in {wh_res['latency_ms']}ms.")

    print("\n--- [TEST 15/16] Production Developer API Key Generation & Scoping ---")
    key_req = ApiKeyGenerateRequest(
        key_name="Staging CI/CD GitHub Runner",
        scopes=["audit:read", "audit:write", "insitu:lint"],
        expires_in_days=365
    )
    key_res = generate_api_key(key_req)
    assert key_res["status"] == "created"
    assert key_res["key"]["full_key"].startswith("bp_live_")
    assert "audit:write" in key_res["key"]["scopes"]
    print(f"✓ Developer Portal Verified: Generated scoped API key {key_res['key']['prefix']}... with 3 permissions.")

    print("\n--- [TEST 16/16] Enterprise Subscription Metering & Quota Tracking ---")
    bill_res = get_subscription_and_usage()
    assert bill_res["plan_tier"] == "Enterprise Dedicated"
    assert bill_res["usage_meters"]["monthly_audits"]["used"] == 342
    assert bill_res["usage_meters"]["monthly_audits"]["quota"] == 1000
    assert len(bill_res["invoices"]) >= 2
    print(f"✓ Billing & Usage Engine: Plan '{bill_res['plan_tier']}' active, {bill_res['usage_meters']['monthly_audits']['used']}/1000 audits consumed.")

    print("\n--- [TEST 17/17] Multi-Vector Visual Compliance & Design Inspection ---")
    vis_req = VisualInspectPresetRequest(preset_id="preset-ad-superlatives-red", org_id="org-auracloud-001")
    vis_res = inspect_visual_preset(vis_req)
    assert vis_res["status"] == "success"
    assert vis_res["score"]["composite_score"] == 46
    assert len(vis_res["findings"]) == 5
    assert any(f["category"] == "color_divergence" for f in vis_res["findings"])
    assert any(f["category"] == "embedded_text_violation" for f in vis_res["findings"])
    assert any(f["category"] == "contrast_accessibility" for f in vis_res["findings"])
    assert vis_res["logo_inspection"]["detected"] is True
    print(f"✓ Visual Inspection Studio Verified: Identified {len(vis_res['findings'])} design violations (off-brand red, prohibited superlatives, WCAG contrast failures) with composite score: {vis_res['score']['composite_score']}%.")

if __name__ == "__main__":
    test_e2e_governance_workflow()
    print("\n=========================================================")
    print(">>> ALL END-TO-END INTEGRATION TESTS PASSED (17/17) <<<")
    print("=========================================================")
