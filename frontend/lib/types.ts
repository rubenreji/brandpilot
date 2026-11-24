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
  tone_keywords?: string[];
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
  uploaded_at?: string;
}

export interface VerifiedClaim {
  id: string;
  claim_text: string;
  status: 'supported' | 'contradicted' | 'cannot_be_verified';
  confidence: number;
  explanation: string;
  relevant_source?: string;
  exact_passage?: string;
  suggested_correction?: string;
}

export interface ClaimVerificationSummary {
  total_claims_analyzed: number;
  supported_count: number;
  contradicted_count: number;
  unverified_count: number;
  integrity_score: number;
  claims: VerifiedClaim[];
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
  verification_status?: 'supported' | 'contradicted' | 'cannot_be_verified' | 'unverified';
  claim_type?: string;
  context_reasoning?: string;
  grounded_evidence?: string;
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
  claim_verification_summary?: ClaimVerificationSummary;
}

export interface ContentRevision {
  id: string;
  submission_id: string;
  version_number: number;
  content_text: string;
  change_summary: string;
  author_name: string;
  compliance_score?: number;
  timestamp: string;
}

export interface ApprovalRecord {
  id: string;
  submission_id: string;
  submission_title?: string;
  reviewer_id: string;
  reviewer_name: string;
  decision: 'approved' | 'rejected' | 'changes_requested' | string;
  comments?: string;
  content_version: number;
  timestamp: string;
  cryptographic_stamp: string;
}

export interface ActivityItem {
  id: string;
  type: 'audit' | 'correction' | 'approval' | 'policy';
  title: string;
  description: string;
  actor_name: string;
  actor_role: UserRole;
  target_link?: string;
  timestamp: string;
  status_badge?: string;
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

export interface AutoExtractResult {
  status: string;
  source_title: string;
  extracted_rules_count: number;
  extracted_facts_count: number;
  rules: any[];
  facts: any[];
  tone_calibration: Record<string, any>;
  design_tokens: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    logo_exclusion_space: string;
  };
  elapsed_ms: number;
}

export interface PublishingDispatchResult {
  status: 'DISPATCHED_LIVE' | 'BLOCKED';
  dispatch_id?: string;
  submission_id: string;
  title: string;
  platform: string;
  destination_channel: string;
  clearance_stamp: string;
  reviewer_name: string;
  published_url: string;
  hmac_security_digest: string;
  timestamp: string;
  message: string;
  error?: string;
}

export interface InSituIssue {
  original_text: string;
  start_index: number;
  end_index: number;
  suggested_replacement: string;
  category: string;
  severity: string;
  rule_name: string;
}

export interface InSituLintResult {
  status: string;
  latency_ms: number;
  issues_count: number;
  compliance_score: number;
  issues: InSituIssue[];
  wcag_contrast?: {
    foreground: string;
    background: string;
    estimated_contrast: string;
    wcag_aa_pass: boolean;
    wcag_aaa_pass: boolean;
  };
}

export interface SpokenFinding {
  timestamp_sec: number;
  timestamp_display: string;
  original_speech: string;
  suggested_teleprompter_speech: string;
  rule_name: string;
  severity: string;
  category: string;
  jurisdiction?: string;
  explanation: string;
}

export interface MultimodalSpeechResult {
  status: string;
  title: string;
  media_type: string;
  speaker_role: string;
  jurisdiction: string;
  compliance_score: number;
  word_count: number;
  duration_seconds: number;
  speech_pacing_wpm: number;
  formality_score: number;
  spoken_findings_count: number;
  spoken_findings: SpokenFinding[];
  teleprompter_clean_script: string;
  latency_ms: number;
}

export interface SlackAlertResult {
  status: string;
  channel: string;
  delivered_at: string;
  block_kit_payload: any;
}

export interface PublicVerificationRecord {
  is_verified: boolean;
  status: string;
  submission_id: string;
  title: string;
  content_text: string;
  compliance_score: number;
  reviewer_name: string;
  reviewer_role: string;
  approval_timestamp: string;
  cryptographic_stamp: string;
  sha256_document_digest: string;
  active_guideline_version: string;
  tamper_proof_seal: string;
  organization_name: string;
}

export interface CompetitorVulnerability {
  matched_claim: string;
  claim?: string;
  vulnerability_type: string;
  vulnerability?: string;
  legal_risk: string;
  statutory_statute: string;
  statutory_reference?: string;
  suggested_counter_rebuttal: string;
  counter_rebuttal?: string;
  fact_source?: string;
  severity?: 'critical' | 'high' | 'medium';
}

export interface CompetitorScanResult {
  status: string;
  competitor_name: string;
  vulnerability_score: number;
  vulnerabilities_count: number;
  vulnerabilities: CompetitorVulnerability[];
  executive_summary: string;
  jurisdiction?: string;
  elapsed_ms: number;
}

export interface EnterpriseSystemStatus {
  status: string;
  platform_version: string;
  deployment_region: string;
  available_regions: string[];
  data_residency_compliance: string;
  zero_data_retention_active: boolean;
  zero_data_retention_policy: string;
  uptime_sla_percentage: number;
  immutable_ledger_status: string;
  active_organizations: number;
  active_rules_cached: number;
  active_facts_verified: number;
  timestamp: string;
}

export interface WebhookTestPingResult {
  status: string;
  http_response_code: number;
  latency_ms: number;
  target_url: string;
  event_type: string;
  signature_header: string;
  payload_dispatched: any;
  message: string;
}

export interface EnterpriseApiKey {
  id: string;
  name: string;
  prefix: string;
  full_key?: string;
  scopes: string[];
  created_at: string;
  last_used_at: string;
  status: 'active' | 'revoked';
}

export interface EnterpriseInvoice {
  id: string;
  date: string;
  amount: string;
  status: string;
  description: string;
  pdf_url?: string;
}

export interface SubscriptionUsage {
  plan_tier: string;
  plan_status: string;
  billing_period: string;
  renewal_date: string;
  seats_allocated: number;
  seats_used: number;
  usage_meters: {
    monthly_audits: { used: number; quota: number; percentage: number };
    insitu_api_calls: { used: number; quota: number; percentage: number };
    brand_guidelines: { used: number; quota: string };
    custom_domains: { used: number; quota: number };
  };
  payment_method: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_contact: {
    name: string;
    email: string;
    tax_id: string;
  };
  invoices: EnterpriseInvoice[];
}

export interface BrandBaseDefinition {
  workspace: Organization;
  icon: string;
  badge: string;
  guidelines: BrandGuideline[];
  facts: ApprovedFact[];
  terminology: TerminologyRule[];
  tone: ToneProfile;
  assets: BrandAsset[];
  sampleDraft: {
    name: string;
    headline: string;
    contentType: string;
    campaign: string;
    targetAudience: string;
    jurisdiction: 'global' | 'us_ftc' | 'eu_ai_act' | 'uk_asa';
    flaggedBody: string;
    compliantBody: string;
  };
}

// --- ADVANCED VISUAL BRAND COMPLIANCE & DESIGN INSPECTION TYPES ---

export interface VisualBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  x_pct: number;
  y_pct: number;
  w_pct: number;
  h_pct: number;
}

export type VisualFindingCategory =
  | 'color_divergence'
  | 'logo_distortion'
  | 'logo_clearance'
  | 'embedded_text_violation'
  | 'contrast_accessibility'
  | 'visual_processing_error';

export interface VisualFinding {
  id: string;
  category: VisualFindingCategory | string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  detected_value?: string;
  recommended_value?: string;
  bounding_box?: VisualBoundingBox;
  wcag_level?: string;
  remediation_action?: string;
}

export interface ColorClusterInfo {
  hex: string;
  percentage: number;
  is_compliant: boolean;
  nearest_token?: string;
  distance?: number;
  role?: string;
  bounding_box?: VisualBoundingBox;
}

export interface LogoInspectionDetails {
  detected: boolean;
  confidence: number;
  aspect_ratio: number;
  expected_aspect_ratio: number;
  aspect_distortion_pct: number;
  is_distorted: boolean;
  clear_space_passed: boolean;
  clear_space_margin_ratio: number;
  required_margin_ratio: number;
  bounding_box?: VisualBoundingBox;
  exclusion_zone_box?: VisualBoundingBox;
}

export interface ContrastCheckZone {
  zone_name: string;
  foreground_hex: string;
  background_hex: string;
  contrast_ratio: number;
  wcag_aa_pass: boolean;
  wcag_aaa_pass: boolean;
  is_large_text?: boolean;
  bounding_box?: VisualBoundingBox;
}

export interface OCRTextFinding {
  extracted_text: string;
  line_number: number;
  bounding_box?: VisualBoundingBox;
  violations_count: number;
  findings?: any[];
}

export interface VisualInspectionScoreBreakdown {
  color_palette_score: number;
  logo_integrity_score: number;
  embedded_copy_score: number;
  wcag_contrast_score: number;
  composite_score: number;
  compliance_grade: string;
}

export interface VisualInspectionReport {
  status: 'success' | 'error';
  asset_dimensions: string;
  image_preview_url?: string;
  score: VisualInspectionScoreBreakdown;
  findings: VisualFinding[];
  dominant_colors: ColorClusterInfo[];
  logo_inspection: LogoInspectionDetails;
  wcag_contrast_checks: ContrastCheckZone[];
  ocr_extracted_copy: OCRTextFinding[];
  limitations_note: string;
}

export interface VisualPreset {
  id: string;
  title: string;
  description: string;
  type: string;
  expected_score: number;
  status: 'compliant' | 'non_compliant';
}

// =============================================================================
// COMMERCIAL ENTERPRISE SOFTWARE EXTENSIONS
// =============================================================================

// 1. Brand Sentinel: Automated 24/7 Live Crawler & Monitor
export interface SentinelMonitoredTarget {
  id: string;
  url: string;
  label: string;
  category: 'website' | 'blog' | 'docs' | 'social';
  check_frequency: '1h' | '6h' | '24h' | 'weekly';
  status: 'clean' | 'drift_detected' | 'checking' | 'error';
  last_checked: string;
  compliance_score: number;
  drift_count: number;
  active: boolean;
}

export interface SentinelDriftIssue {
  id: string;
  target_id: string;
  target_url: string;
  element_selector: string;
  offending_text: string;
  suggested_fix: string;
  rule_violated: string;
  severity: 'critical' | 'high' | 'medium';
  first_detected_at: string;
  status: 'active' | 'resolved' | 'dismissed';
}

// 2. Stripe Billing & Subscription Tiers
export interface BillingPlanTier {
  id: 'starter' | 'professional' | 'enterprise';
  name: string;
  price_monthly: number;
  price_annual: number;
  description: string;
  features: string[];
  audits_limit: number;
  visual_scans_limit: number;
  seats_limit: number;
  sentinel_targets_limit: number;
  is_popular?: boolean;
}

export interface CommercialInvoice {
  id: string;
  invoice_number: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Draft';
  plan_name: string;
  pdf_url?: string;
}

// 3. Collaborative Review & In-Line Commenting
export interface CollaborativeComment {
  id: string;
  submission_id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  user_avatar?: string;
  target_text?: string;
  comment_text: string;
  created_at: string;
  resolved: boolean;
  is_legal_escalation?: boolean;
}

// 4. Cloud Storage & DAM Connectors
export interface DAMConnector {
  id: string;
  provider: 'aws_s3' | 'cloudflare_r2' | 'google_drive' | 'sharepoint' | 'bynder';
  name: string;
  status: 'connected' | 'disconnected' | 'syncing';
  last_sync_at: string;
  synced_assets_count: number;
  bucket_or_folder?: string;
  auto_sync: boolean;
}

// 5. Custom AI Engine & Model Provider
export interface AIProviderConfig {
  provider: 'brandpilot_default' | 'openai' | 'anthropic' | 'google_vertex' | 'azure_openai';
  model_name: string;
  api_key_masked?: string;
  endpoint_url?: string;
  data_residency_region: 'us' | 'eu' | 'ap';
  zero_data_retention: boolean;
  status: 'active' | 'configured' | 'unconfigured';
}




