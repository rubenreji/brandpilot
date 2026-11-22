from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

# --- ENUMS ---
class UserRole(str, Enum):
    ADMIN = "admin"
    REVIEWER = "reviewer"
    CREATOR = "creator"

class RuleType(str, Enum):
    PREFERRED = "preferred"
    PROHIBITED = "prohibited"
    REQUIRED = "required"
    ALTERNATIVE = "alternative"

class FindingSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFORMATIONAL = "informational"

class IssueCategory(str, Enum):
    TERMINOLOGY = "terminology"
    UNSUPPORTED_CLAIM = "unsupported_claim"
    OUTDATED_FACT = "outdated_fact"
    TONE_MISMATCH = "tone_mismatch"
    MISSING_DISCLAIMER = "missing_disclaimer"
    VISUAL_INCONSISTENCY = "visual_inconsistency"
    ACCESSIBILITY = "accessibility"

class ContentType(str, Enum):
    SOCIAL_POST = "social_post"
    MARKETING_COPY = "marketing_copy"
    PRODUCT_DESCRIPTION = "product_description"
    WEBSITE_CONTENT = "website_content"
    EMAIL_CAMPAIGN = "email_campaign"
    ADVERTISEMENT = "advertisement"
    PRESS_RELEASE = "press_release"
    GENERAL_DOCUMENT = "general_document"

class SubmissionStatus(str, Enum):
    DRAFT = "draft"
    PROCESSING = "processing"
    AUDITED = "audited"
    PENDING_REVIEW = "pending_review"
    CHANGES_REQUESTED = "changes_requested"
    RESUBMITTED = "resubmitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class SuggestionStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EDITED = "edited"

class VerificationStatus(str, Enum):
    SUPPORTED = "supported"
    CONTRADICTED = "contradicted"
    CANNOT_BE_VERIFIED = "cannot_be_verified"

# --- SCHEMAS ---

# Organization & User
class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    role: UserRole = UserRole.CREATOR
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Organization(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand_name: str
    industry: str
    description: Optional[str] = None
    website_url: Optional[str] = None
    primary_color: str = "#101827"
    secondary_color: str = "#3978E8"
    logo_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    members_count: int = 1

class OrganizationCreate(BaseModel):
    name: str
    brand_name: str
    industry: str
    description: Optional[str] = None
    website_url: Optional[str] = None
    primary_color: Optional[str] = "#101827"
    secondary_color: Optional[str] = "#3978E8"

# Brand Guidelines
class GuidelineChunk(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    guideline_id: str
    page_number: Optional[int] = 1
    section_header: Optional[str] = None
    content: str
    source_passage: Optional[str] = None

class BrandGuideline(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    title: str
    description: Optional[str] = None
    category: str = "general"
    version: str = "1.0"
    status: str = "active"
    file_name: Optional[str] = None
    file_type: Optional[str] = "text"
    extracted_text: Optional[str] = None
    created_by: str = "Administrator"
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    chunks_count: int = 0

class BrandGuidelineCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "general"
    content: Optional[str] = None

# Approved Facts
class ApprovedFact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    title: str
    category: str
    approved_statement: str
    supporting_evidence: str
    product_association: Optional[str] = "All Products"
    approval_status: str = "approved"
    last_verified_date: datetime = Field(default_factory=datetime.utcnow)
    created_by: str = "Administrator"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ApprovedFactCreate(BaseModel):
    title: str
    category: str
    approved_statement: str
    supporting_evidence: str
    product_association: Optional[str] = "All Products"

# Terminology
class TerminologyRule(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    term: str
    rule_type: RuleType
    preferred_alternative: Optional[str] = None
    case_sensitive: bool = False
    whole_word: bool = True
    rule_description: str
    contextual_exceptions: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TerminologyRuleCreate(BaseModel):
    term: str
    rule_type: RuleType
    preferred_alternative: Optional[str] = None
    case_sensitive: bool = False
    whole_word: bool = True
    rule_description: str
    contextual_exceptions: Optional[str] = None

# Tone of Voice
class ToneProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    formality_level: int = 7  # 1-10
    professionalism_level: int = 8  # 1-10
    friendliness_level: int = 6  # 1-10
    confidence_level: int = 8  # 1-10
    technical_complexity: int = 6  # 1-10
    target_audience: str = "Enterprise IT, Brand Managers, and Creative Teams"
    preferred_sentence_style: str = "Clear, active voice, concise with authoritative yet approachable cadence."
    words_to_avoid: List[str] = ["cheap", "magic", "guaranteed 100%", "No. 1 without proof", "revolutionary"]
    example_approved_content: str = "BrandPilot gives enterprises verifiable control over brand consistency."
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Brand Asset
class BrandAsset(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    name: str
    asset_type: str  # "logo_primary", "logo_secondary", "color_palette", "typography", "graphic"
    file_url: Optional[str] = None
    value: Optional[str] = None  # e.g., hex code #101827 or font name
    dimensions: Optional[str] = None
    is_primary: bool = False
    status: str = "active"
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class BrandAssetCreate(BaseModel):
    name: str
    asset_type: str
    value: Optional[str] = None
    is_primary: bool = False

# Findings & Audit
class ComplianceFinding(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    submission_id: str
    category: IssueCategory
    severity: FindingSeverity
    original_text: str
    start_index: int
    end_index: int
    explanation: str
    relevant_brand_rule: str
    source_document: Optional[str] = None
    page_reference: Optional[str] = None
    exact_supporting_passage: Optional[str] = None
    suggested_correction: str
    confidence: float = 0.95
    status: SuggestionStatus = SuggestionStatus.PENDING
    user_comment: Optional[str] = None
    verification_status: Optional[str] = "contradicted"  # "supported", "contradicted", "cannot_be_verified"
    claim_type: Optional[str] = "factual"  # "factual", "terminology", "superlative", "tone", "regulatory"
    context_reasoning: Optional[str] = None
    grounded_evidence: Optional[str] = None

class VerifiedClaim(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    claim_text: str
    status: str = "supported"  # "supported", "contradicted", "cannot_be_verified"
    confidence: float = 0.95
    explanation: str
    relevant_source: Optional[str] = None
    exact_passage: Optional[str] = None
    suggested_correction: Optional[str] = None

class ClaimVerificationSummary(BaseModel):
    total_claims_analyzed: int = 0
    supported_count: int = 0
    contradicted_count: int = 0
    unverified_count: int = 0
    integrity_score: float = 100.0
    claims: List[VerifiedClaim] = []

class ContentSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    title: str
    content_type: ContentType
    target_platform: Optional[str] = "Corporate Web"
    associated_product: Optional[str] = "BrandPilot"
    campaign_name: Optional[str] = "Q4 Brand Rollout"
    original_text: str
    current_text: str
    status: SubmissionStatus = SubmissionStatus.DRAFT
    word_count: int = 0
    character_count: int = 0
    compliance_score: Optional[int] = None
    creator_id: str = "user-creator-1"
    creator_name: str = "Content Creator"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    findings_count: int = 0
    critical_count: int = 0
    claim_verification_summary: Optional[ClaimVerificationSummary] = None

class ContentSubmissionCreate(BaseModel):
    title: str
    content_type: ContentType
    target_platform: Optional[str] = "Corporate Web"
    associated_product: Optional[str] = "BrandPilot"
    campaign_name: Optional[str] = "Q4 Brand Rollout"
    draft_text: str

class ApplySuggestionRequest(BaseModel):
    accepted: bool
    edited_text: Optional[str] = None
    comment: Optional[str] = None

class ContentRevision(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    submission_id: str
    version_number: int
    content_text: str
    change_summary: str
    author_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ApprovalAction(BaseModel):
    decision: str  # "approved", "changes_requested", "rejected"
    reviewer_comment: Optional[str] = None
    reviewer_id: Optional[str] = "user-reviewer-1"
    reviewer_name: Optional[str] = "Sarah Lin"
    reviewer_role: Optional[str] = "reviewer"

class ApprovalRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    submission_id: str
    reviewer_id: str
    reviewer_name: str
    decision: str
    comments: Optional[str] = None
    content_version: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    cryptographic_stamp: str

class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    user_id: str
    title: str
    message: str
    notification_type: str  # "audit_completed", "review_assigned", "changes_requested", "approved"
    link: Optional[str] = None
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AuditLogEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organization_id: str
    user_id: str
    user_name: str
    action: str
    entity_type: str
    entity_id: str
    details: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# --- ADVANCED ROUND 3 SCHEMAS: INGESTION, PUBLISHING & IN-SITU ---

class AutoExtractRequest(BaseModel):
    guideline_text: Optional[str] = None
    source_title: Optional[str] = "AuraCloud Enterprise Brand & Governance Manual v3.0"
    org_id: Optional[str] = "org-auracloud-001"

class PublishingDispatchRequest(BaseModel):
    submission_id: str
    platform: str = "Webflow CMS"  # Webflow CMS, WordPress Production, Ghost Blog, HubSpot Campaigns, Notion
    clearance_stamp: Optional[str] = None
    destination_channel: Optional[str] = "Production Public Cloud"
    target_slug: Optional[str] = None

class InSituLintRequest(BaseModel):
    text: str
    context: Optional[str] = "social_post"  # social_post, blog_editor, figma_canvas
    colors: Optional[List[str]] = None
    org_id: Optional[str] = "org-auracloud-001"

class MultimodalSpeechAuditRequest(BaseModel):
    title: str = "Keynote Address or Video Ad"
    transcript: str
    speaker_role: Optional[str] = "Executive Keynote Speaker"
    media_type: Optional[str] = "keynote_video"  # keynote_video, podcast_audio, promo_video
    jurisdiction: Optional[str] = "global"  # global, us_ftc, eu_ai_act, uk_asa
    org_id: Optional[str] = "org-auracloud-001"

class SlackAlertDispatchRequest(BaseModel):
    submission_id: str
    channel: Optional[str] = "#brand-governance-alerts"
    severity_level: Optional[str] = "critical"
    alert_type: Optional[str] = "regulatory_violation"

# --- EXECUTIVE & INTELLIGENCE EXTENSIONS ---

class CompetitorScanRequest(BaseModel):
    competitor_name: str = "Rival Cloud Platform"
    copy_text: str
    campaign_type: Optional[str] = "press_release"
    target_jurisdiction: Optional[str] = "us_ftc"  # us_ftc, global, eu_ai_act, uk_asa
    org_id: Optional[str] = "org-auracloud-001"

class PublicVerificationResponse(BaseModel):
    is_verified: bool
    status: str
    submission_id: str
    title: str
    content_text: str
    compliance_score: int
    reviewer_name: str
    reviewer_role: str
    approval_timestamp: str
    cryptographic_stamp: str
    sha256_document_digest: str
    active_guideline_version: str
    tamper_proof_seal: str
    organization_name: str

# --- COMMERCIAL ENTERPRISE DEPLOYMENT & DEVELOPER SCHEMAS ---

class WebhookTestPingRequest(BaseModel):
    target_url: str = "https://hooks.auracloud.io/brandpilot/events"
    event_type: str = "audit.flagged"
    secret_key: Optional[str] = "whsec_live_9b42e718c30f4a9b"

class ApiKeyGenerateRequest(BaseModel):
    key_name: str = "Production CI/CD Automation"
    scopes: List[str] = Field(default_factory=lambda: ["audit:read", "audit:write", "insitu:lint"])
    expires_in_days: int = 365

# --- ADVANCED VISUAL COMPLIANCE & DESIGN INSPECTION SCHEMAS ---

class VisualBoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    x_pct: float
    y_pct: float
    w_pct: float
    h_pct: float

class VisualFindingCategory(str, Enum):
    COLOR_DIVERGENCE = "color_divergence"
    LOGO_DISTORTION = "logo_distortion"
    LOGO_CLEARANCE = "logo_clearance"
    EMBEDDED_TEXT_VIOLATION = "embedded_text_violation"
    CONTRAST_ACCESSIBILITY = "contrast_accessibility"

class VisualFinding(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    severity: str  # critical, high, medium, low
    title: str
    description: str
    detected_value: Optional[str] = None
    recommended_value: Optional[str] = None
    bounding_box: Optional[VisualBoundingBox] = None
    wcag_level: Optional[str] = None
    remediation_action: Optional[str] = None

class ColorClusterInfo(BaseModel):
    hex: str
    percentage: float
    is_compliant: bool
    nearest_token: Optional[str] = None
    distance: Optional[float] = None
    role: Optional[str] = None
    bounding_box: Optional[VisualBoundingBox] = None

class LogoInspectionDetails(BaseModel):
    detected: bool = True
    confidence: float = 0.98
    aspect_ratio: float = 1.0
    expected_aspect_ratio: float = 1.0
    aspect_distortion_pct: float = 0.0
    is_distorted: bool = False
    clear_space_passed: bool = True
    clear_space_margin_ratio: float = 0.65
    required_margin_ratio: float = 0.50
    bounding_box: Optional[VisualBoundingBox] = None
    exclusion_zone_box: Optional[VisualBoundingBox] = None

class ContrastCheckZone(BaseModel):
    zone_name: str
    foreground_hex: str
    background_hex: str
    contrast_ratio: float
    wcag_aa_pass: bool
    wcag_aaa_pass: bool
    is_large_text: bool = False
    bounding_box: Optional[VisualBoundingBox] = None

class OCRTextFinding(BaseModel):
    extracted_text: str
    line_number: int = 1
    bounding_box: Optional[VisualBoundingBox] = None
    violations_count: int = 0
    findings: List[Dict[str, Any]] = Field(default_factory=list)

class VisualInspectionScoreBreakdown(BaseModel):
    color_palette_score: int
    logo_integrity_score: int
    embedded_copy_score: int
    wcag_contrast_score: int
    composite_score: int
    compliance_grade: str

class VisualInspectionReport(BaseModel):
    status: str
    asset_dimensions: str
    image_preview_url: Optional[str] = None
    score: VisualInspectionScoreBreakdown
    findings: List[VisualFinding]
    dominant_colors: List[ColorClusterInfo]
    logo_inspection: LogoInspectionDetails
    wcag_contrast_checks: List[ContrastCheckZone]
    ocr_extracted_copy: List[OCRTextFinding]
    limitations_note: str

class VisualInspectPresetRequest(BaseModel):
    preset_id: str
    org_id: Optional[str] = "org-auracloud-001"




