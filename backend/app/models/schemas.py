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
