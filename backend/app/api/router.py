from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, Header
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import re

from app.core.database import db
from app.models.schemas import (
    Organization, OrganizationCreate, UserProfile, UserRole,
    BrandGuideline, BrandGuidelineCreate, ApprovedFact, ApprovedFactCreate,
    TerminologyRule, TerminologyRuleCreate, ToneProfile, BrandAsset, BrandAssetCreate,
    ContentSubmission, ContentSubmissionCreate, SubmissionStatus,
    ComplianceFinding, SuggestionStatus, ApplySuggestionRequest,
    ApprovalAction, ApprovalRecord, ContentRevision, Notification
)
from app.services.ai_auditor import AIAuditEngine
from app.services.visual_inspector import VisualInspector

api_router = APIRouter()

# --- WORKSPACES & AUTH ---
@api_router.get("/workspaces", response_model=List[Organization])
def list_workspaces():
    return list(db.organizations.values())

@api_router.get("/workspaces/{org_id}", response_model=Organization)
def get_workspace(org_id: str):
    if org_id not in db.organizations:
        raise HTTPException(status_code=404, detail="Organization not found")
    return db.organizations[org_id]

@api_router.post("/workspaces", response_model=Organization)
def create_workspace(data: OrganizationCreate):
    org = Organization(
        name=data.name,
        brand_name=data.brand_name,
        industry=data.industry,
        description=data.description,
        website_url=data.website_url,
        primary_color=data.primary_color or "#101827",
        secondary_color=data.secondary_color or "#3978E8"
    )
    db.organizations[org.id] = org
    db.facts[org.id] = []
    db.terminology[org.id] = []
    db.brand_assets[org.id] = []
    db.guideline_chunks[org.id] = []
    return org

@api_router.get("/workspaces/{org_id}/members", response_model=List[UserProfile])
def get_members(org_id: str):
    return list(db.users.values())

@api_router.post("/workspaces/{org_id}/members", response_model=UserProfile)
def invite_member(org_id: str, email: str, role: UserRole = UserRole.CREATOR):
    user = UserProfile(
        email=email,
        name=email.split("@")[0].replace(".", " ").title(),
        role=role,
        avatar_url=f"https://api.dicebear.com/7.x/initials/svg?seed={email}"
    )
    db.users[user.id] = user
    return user

# --- BRAND GUIDELINES ---
@api_router.get("/guidelines", response_model=List[BrandGuideline])
def list_guidelines(org_id: Optional[str] = None):
    return list(db.guidelines.values())

@api_router.post("/guidelines", response_model=BrandGuideline)
def create_guideline(data: BrandGuidelineCreate, org_id: str = "org-auracloud-001"):
    guide = BrandGuideline(
        organization_id=org_id,
        title=data.title,
        description=data.description,
        category=data.category or "general",
        extracted_text=data.content
    )
    db.guidelines[guide.id] = guide
    return guide

@api_router.delete("/guidelines/{guide_id}")
def delete_guideline(guide_id: str):
    if guide_id in db.guidelines:
        del db.guidelines[guide_id]
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Guideline not found")

# --- APPROVED FACTS ---
@api_router.get("/facts", response_model=List[ApprovedFact])
def list_facts(org_id: str = "org-auracloud-001"):
    return db.facts.get(org_id, [])

@api_router.post("/facts", response_model=ApprovedFact)
def create_fact(data: ApprovedFactCreate, org_id: str = "org-auracloud-001"):
    fact = ApprovedFact(
        organization_id=org_id,
        title=data.title,
        category=data.category,
        approved_statement=data.approved_statement,
        supporting_evidence=data.supporting_evidence,
        product_association=data.product_association
    )
    if org_id not in db.facts:
        db.facts[org_id] = []
    db.facts[org_id].append(fact)
    return fact

@api_router.delete("/facts/{fact_id}")
def delete_fact(fact_id: str, org_id: str = "org-auracloud-001"):
    facts = db.facts.get(org_id, [])
    db.facts[org_id] = [f for f in facts if f.id != fact_id]
    return {"status": "deleted"}

# --- TERMINOLOGY RULES ---
@api_router.get("/terminology", response_model=List[TerminologyRule])
def list_terminology(org_id: str = "org-auracloud-001"):
    return db.terminology.get(org_id, [])

@api_router.post("/terminology", response_model=TerminologyRule)
def create_terminology(data: TerminologyRuleCreate, org_id: str = "org-auracloud-001"):
    rule = TerminologyRule(
        organization_id=org_id,
        term=data.term,
        rule_type=data.rule_type,
        preferred_alternative=data.preferred_alternative,
        case_sensitive=data.case_sensitive,
        whole_word=data.whole_word,
        rule_description=data.rule_description,
        contextual_exceptions=data.contextual_exceptions
    )
    if org_id not in db.terminology:
        db.terminology[org_id] = []
    db.terminology[org_id].append(rule)
    return rule

@api_router.delete("/terminology/{rule_id}")
def delete_terminology(rule_id: str, org_id: str = "org-auracloud-001"):
    rules = db.terminology.get(org_id, [])
    db.terminology[org_id] = [r for r in rules if r.id != rule_id]
    return {"status": "deleted"}

# --- TONE OF VOICE ---
@api_router.get("/tone", response_model=ToneProfile)
def get_tone(org_id: str = "org-auracloud-001"):
    return db.tone_profiles.get(org_id, db.tone_profiles["org-auracloud-001"])

@api_router.put("/tone", response_model=ToneProfile)
def update_tone(profile: ToneProfile, org_id: str = "org-auracloud-001"):
    profile.organization_id = org_id
    profile.updated_at = datetime.utcnow()
    db.tone_profiles[org_id] = profile
    return profile

# --- BRAND ASSETS ---
@api_router.get("/assets", response_model=List[BrandAsset])
def list_assets(org_id: str = "org-auracloud-001"):
    return db.brand_assets.get(org_id, [])

@api_router.post("/assets", response_model=BrandAsset)
def create_asset(data: BrandAssetCreate, org_id: str = "org-auracloud-001"):
    asset = BrandAsset(
        organization_id=org_id,
        name=data.name,
        asset_type=data.asset_type,
        value=data.value,
        is_primary=data.is_primary
    )
    if org_id not in db.brand_assets:
        db.brand_assets[org_id] = []
    db.brand_assets[org_id].append(asset)
    return asset

# --- CONTENT SUBMISSION & AUDITING ---
@api_router.get("/content", response_model=List[ContentSubmission])
def list_content(org_id: str = "org-auracloud-001"):
    return [s for s in db.submissions.values() if s.organization_id == org_id]

@api_router.get("/content/{submission_id}", response_model=ContentSubmission)
def get_content_submission(submission_id: str):
    if submission_id not in db.submissions:
        raise HTTPException(status_code=404, detail="Submission not found")
    return db.submissions[submission_id]

@api_router.post("/content", response_model=ContentSubmission)
def submit_content(data: ContentSubmissionCreate, org_id: str = "org-auracloud-001"):
    words = len(re.findall(r'\b\w+\b', data.draft_text))
    sub = ContentSubmission(
        organization_id=org_id,
        title=data.title,
        content_type=data.content_type,
        target_platform=data.target_platform,
        associated_product=data.associated_product,
        campaign_name=data.campaign_name,
        original_text=data.draft_text,
        current_text=data.draft_text,
        status=SubmissionStatus.PROCESSING,
        word_count=words,
        character_count=len(data.draft_text)
    )
    db.submissions[sub.id] = sub

    # Trigger Automated Audit
    rules = db.terminology.get(org_id, [])
    chunks = db.guideline_chunks.get(org_id, [])
    facts = db.facts.get(org_id, [])
    tone = db.tone_profiles.get(org_id)

    findings = AIAuditEngine.audit_submission(
        submission=sub,
        terminology_rules=rules,
        guideline_chunks=chunks,
        approved_facts=facts,
        tone_profile=tone
    )
    db.findings[sub.id] = findings

    sub.status = SubmissionStatus.AUDITED
    sub.findings_count = len(findings)
    sub.critical_count = len([f for f in findings if f.severity.value in ["critical", "high"]])
    sub.compliance_score = AIAuditEngine.calculate_compliance_score(findings)

    return sub

@api_router.get("/audits/{submission_id}/findings", response_model=List[ComplianceFinding])
def get_submission_findings(submission_id: str):
    return db.findings.get(submission_id, [])

# --- CORRECTIONS WORKSPACE ---
@api_router.post("/suggestions/{finding_id}/apply")
def apply_suggestion(finding_id: str, request: ApplySuggestionRequest):
    # Find the finding across all submissions
    target_finding = None
    target_submission = None
    for sub_id, findings in db.findings.items():
        for f in findings:
            if f.id == finding_id:
                target_finding = f
                target_submission = db.submissions.get(sub_id)
                break
        if target_finding:
            break

    if not target_finding or not target_submission:
        raise HTTPException(status_code=404, detail="Finding not found")

    if request.accepted:
        target_finding.status = SuggestionStatus.ACCEPTED
        replacement = request.edited_text if request.edited_text else target_finding.suggested_correction
        
        # Replace in current_text (preserving original_text!)
        old_text = target_submission.current_text
        if target_finding.original_text in old_text:
            target_submission.current_text = old_text.replace(target_finding.original_text, replacement, 1)

        # Record revision history
        rev = ContentRevision(
            submission_id=target_submission.id,
            version_number=len(db.revisions.get(target_submission.id, [])) + 1,
            content_text=target_submission.current_text,
            change_summary=f"Applied correction for [{target_finding.category.value}]: replaced '{target_finding.original_text}' with '{replacement}'",
            author_name="Marcus Vance (Creator)"
        )
        if target_submission.id not in db.revisions:
            db.revisions[target_submission.id] = []
        db.revisions[target_submission.id].append(rev)

    else:
        target_finding.status = SuggestionStatus.REJECTED
        target_finding.user_comment = request.comment or "Creator opted to preserve original draft"

    # Re-evaluate compliance score using complete finding history and accepted/rejected states
    all_submission_findings = db.findings.get(target_submission.id, [])
    target_submission.compliance_score = AIAuditEngine.calculate_compliance_score(all_submission_findings)
    target_submission.findings_count = len([f for f in all_submission_findings if f.status != SuggestionStatus.ACCEPTED])
    target_submission.critical_count = len([
        f for f in all_submission_findings
        if f.status != SuggestionStatus.ACCEPTED and f.severity.value in ["critical", "high"]
    ])
    
    return {
        "status": "updated",
        "current_text": target_submission.current_text,
        "compliance_score": target_submission.compliance_score
    }

# --- APPROVAL CENTRE ---
@api_router.get("/approvals")
def get_approvals(org_id: str = "org-auracloud-001"):
    subs = [s for s in db.submissions.values() if s.organization_id == org_id]
    return {
        "pending": [s for s in subs if s.status in [SubmissionStatus.AUDITED, SubmissionStatus.PENDING_REVIEW, SubmissionStatus.RESUBMITTED]],
        "approved": [s for s in subs if s.status == SubmissionStatus.APPROVED],
        "changes_requested": [s for s in subs if s.status == SubmissionStatus.CHANGES_REQUESTED]
    }

@api_router.post("/approvals/{submission_id}/decision")
def review_decision(submission_id: str, action: ApprovalAction, x_user_role: Optional[str] = Header(None)):
    if submission_id not in db.submissions:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    acting_role = (x_user_role or action.reviewer_role or "reviewer").lower()
    if acting_role not in ["reviewer", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Segregation of duties policy prohibits content creators from approving submissions. Reviewer or Administrator authorization is required."
        )
    
    sub = db.submissions[submission_id]
    
    if action.decision == "approved":
        sub.status = SubmissionStatus.APPROVED
        stamp = f"SHA256:{uuid.uuid4().hex[:32]}"
        rec = ApprovalRecord(
            submission_id=sub.id,
            reviewer_id="user-reviewer-1",
            reviewer_name="Sarah Lin (Brand Reviewer)",
            decision="approved",
            comments=action.reviewer_comment or "Content adheres to verified brand identity standards.",
            content_version=len(db.revisions.get(sub.id, [])) + 1,
            cryptographic_stamp=stamp
        )
        if sub.id not in db.approvals:
            db.approvals[sub.id] = []
        db.approvals[sub.id].append(rec)

        # Notify creator
        db.notifications.append(
            Notification(
                organization_id=sub.organization_id,
                user_id=sub.creator_id,
                title="Submission Approved",
                message=f"'{sub.title}' was approved by Sarah Lin.",
                notification_type="approved",
                link=f"/app/approvals"
            )
        )

    elif action.decision == "changes_requested":
        sub.status = SubmissionStatus.CHANGES_REQUESTED
        db.notifications.append(
            Notification(
                organization_id=sub.organization_id,
                user_id=sub.creator_id,
                title="Changes Requested",
                message=f"Reviewer requested modifications on '{sub.title}': {action.reviewer_comment}",
                notification_type="changes_requested",
                link=f"/app/corrections/{sub.id}"
            )
        )
    else:
        sub.status = SubmissionStatus.REJECTED

    return {"status": sub.status, "submission": sub}

# --- REVISIONS & AUDIT LOGS ---
@api_router.get("/content/{submission_id}/revisions", response_model=List[ContentRevision])
def get_revisions(submission_id: str):
    return db.revisions.get(submission_id, [])

# --- GOVERNANCE ANALYTICS ---
@api_router.get("/analytics/overview")
def get_analytics(org_id: str = "org-auracloud-001"):
    return db.get_governance_analytics(org_id)

# --- VISUAL IDENTITY INSPECTION ---
@api_router.post("/visual/inspect")
async def inspect_visual(file: UploadFile = File(...), org_id: str = "org-auracloud-001"):
    contents = await file.read()
    org_assets = db.brand_assets.get(org_id, [])
    approved_colors = [a.value for a in org_assets if a.asset_type == "color_palette" and a.value]
    if not approved_colors:
        approved_colors = ["#0F172A", "#2563EB", "#38BDF8", "#FFFFFF", "#F8FAFC"]
    
    result = VisualInspector.inspect_image(contents, approved_colors)
    return result

# --- NOTIFICATIONS ---
@api_router.get("/notifications", response_model=List[Notification])
def get_notifications(org_id: str = "org-auracloud-001"):
    return [n for n in db.notifications if n.organization_id == org_id]

@api_router.post("/notifications/{notif_id}/read")
def mark_read(notif_id: str):
    for n in db.notifications:
        if n.id == notif_id:
            n.is_read = True
            return {"status": "ok"}
    return {"status": "not_found"}
