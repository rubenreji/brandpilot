export type UserRole = "admin" | "reviewer" | "creator";

export type FindingSeverity = "critical" | "high" | "medium" | "low" | "informational";

export type IssueCategory =
  | "terminology"
  | "unsupported_claim"
  | "outdated_fact"
  | "tone_mismatch"
  | "missing_disclaimer"
  | "visual_inconsistency"
  | "accessibility";

export type ContentType =
  | "social_post"
  | "marketing_copy"
  | "product_description"
  | "website_content"
  | "email_campaign"
  | "advertisement"
  | "press_release"
  | "blog_post"
  | "general_document"
  | (string & {});

export type SubmissionStatus =
  | "draft"
  | "processing"
  | "audited"
  | "pending_review"
  | "in_review"
  | "changes_requested"
  | "resubmitted"
  | "approved"
  | "rejected"
  | "withdrawn";

export type SuggestionStatus = "pending" | "accepted" | "rejected" | "edited";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Organization {
  id: string;
  name: string;
  brand_name: string;
  slug?: string;
  industry: string;
  description?: string;
  website_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url?: string;
  members_count: number;
}

export type Workspace = Organization;

export interface BrandGuideline {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  category: string;
  version: string;
  status: string;
  file_name?: string;
  extracted_text?: string;
  uploaded_at: string;
  updated_at?: string;
  chunks_count: number;
  total_chunks?: number;
}

export type GuidelineDocument = BrandGuideline;

export interface GuidelineChunk {
  id: string;
  guideline_id: string;
  page_number?: number;
  section_header?: string;
  content: string;
  source_passage?: string;
}

export interface ApprovedFact {
  id: string;
  organization_id: string;
  title?: string;
  category: string;
  claim_text?: string;
  approved_statement?: string;
  supporting_evidence?: string;
  source_citation?: string;
  product_association?: string;
  approval_status?: string;
  last_verified_date?: string;
  confidence_level?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TerminologyRule {
  id: string;
  organization_id: string;
  term: string;
  rule_type: "preferred" | "prohibited" | "required" | "alternative";
  suggested_replacement?: string;
  preferred_alternative?: string;
  case_sensitive?: boolean;
  is_case_sensitive?: boolean;
  whole_word?: boolean;
  rule_description?: string;
  explanation?: string;
  contextual_exceptions?: string;
  created_at?: string;
}

export interface ToneProfile {
  id?: string;
  organization_id?: string;
  formality?: number;
  technicality?: number;
  confidence?: number;
  perspective?: string;
  formality_level?: number;
  professionalism_level?: number;
  friendliness_level?: number;
  confidence_level?: number;
  technical_complexity?: number;
  target_audience?: string;
  preferred_sentence_style?: string;
  words_to_avoid?: string[];
  example_approved_content?: string;
}

export interface BrandAsset {
  id: string;
  organization_id: string;
  name?: string;
  title?: string;
  asset_type: string;
  file_url?: string;
  color_hex?: string;
  category?: string;
  value?: string;
  dimensions?: string;
  is_primary?: boolean;
  status?: string;
  created_at?: string;
}

export interface ComplianceFinding {
  id: string;
  submission_id: string;
  category: IssueCategory;
  severity: FindingSeverity;
  original_text: string;
  start_index: number;
  end_index: number;
  explanation: string;
  relevant_brand_rule: string;
  source_document?: string;
  page_reference?: string;
  exact_supporting_passage?: string;
  suggested_correction: string;
  confidence: number;
  status: SuggestionStatus;
  user_comment?: string;
}

export interface ContentSubmission {
  id: string;
  organization_id: string;
  title: string;
  content_type: ContentType;
  target_platform?: string;
  associated_product?: string;
  campaign_name?: string;
  original_text: string;
  current_text: string;
  status: SubmissionStatus;
  word_count: number;
  character_count: number;
  compliance_score?: number;
  creator_id: string;
  creator_name: string;
  created_at: string;
  updated_at: string;
  findings_count: number;
  critical_count: number;
}

export interface ContentRevision {
  id: string;
  submission_id: string;
  version_number: number;
  content_text: string;
  change_summary: string;
  author_name: string;
  timestamp: string;
}

export interface ApprovalRecord {
  id: string;
  submission_id: string;
  reviewer_id: string;
  reviewer_name: string;
  decision: string;
  comments?: string;
  content_version: number;
  timestamp: string;
  cryptographic_stamp: string;
}

export interface Notification {
  id: string;
  organization_id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface AnalyticsSummary {
  total_audits: number;
  average_compliance_score: number;
  category_breakdown: Record<string, number>;
  trend_data?: any[];
  rule_violations?: any[];
}

export interface AuditResultResponse {
  submission: ContentSubmission;
  findings: ComplianceFinding[];
  compliance_score: number;
}
