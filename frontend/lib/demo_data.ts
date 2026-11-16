import {
  Organization,
  UserProfile,
  BrandGuideline,
  GuidelineChunk,
  ApprovedFact,
  TerminologyRule,
  ToneProfile,
  BrandAsset,
  ContentSubmission,
  ComplianceFinding,
  Notification
} from "./types";

export const INITIAL_ORG: Organization = {
  id: "org-auracloud-001",
  name: "AuraCloud Technologies Inc.",
  brand_name: "AuraCloud",
  slug: "auracloud",
  industry: "Enterprise Cloud Infrastructure & AI Platforms",
  description: "Unified multi-cloud governance and automated infrastructure management for Fortune 500 enterprises.",
  website_url: "https://auracloud.io",
  primary_color: "#101827",
  secondary_color: "#19263A",
  accent_color: "#3978E8",
  logo_url: "/assets/logo.svg",
  members_count: 4
};

export const DEMO_WORKSPACE = INITIAL_ORG;

export const INITIAL_USERS: UserProfile[] = [
  {
    id: "user-admin-1",
    email: "ruben@auracloud.io",
    name: "Ruben John Reji",
    full_name: "Ruben John Reji",
    role: "admin",
    avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=Ruben"
  },
  {
    id: "user-reviewer-1",
    email: "sarah.lin@auracloud.io",
    name: "Sarah Lin",
    full_name: "Sarah Lin",
    role: "reviewer",
    avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah"
  },
  {
    id: "user-creator-1",
    email: "marcus.vance@auracloud.io",
    name: "Marcus Vance",
    full_name: "Marcus Vance",
    role: "creator",
    avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=Marcus"
  }
];

export const DEMO_USERS: Record<string, UserProfile> = {
  admin: INITIAL_USERS[0],
  reviewer: INITIAL_USERS[1],
  creator: INITIAL_USERS[2]
};

export const INITIAL_GUIDELINES: BrandGuideline[] = [
  {
    id: "guide-001",
    organization_id: "org-auracloud-001",
    title: "AuraCloud Global Brand & Communication Manual v2.4",
    description: "Core identity, tone of voice, terminology standards, and claims substantiation guidelines.",
    category: "corporate_brand",
    version: "2.4",
    status: "active",
    file_name: "AuraCloud_Brand_Manual_v2.4.pdf",
    extracted_text: "AuraCloud positions itself as an enterprise-grade cloud governance authority. All communications must convey architectural rigor, stability, and verifiable evidence. Avoid speculative hype and superficial promises. Never state absolute guarantees or unsupported market rankings.",
    uploaded_at: "2026-11-10T14:30:00Z",
    chunks_count: 4
  }
];

export const INITIAL_FACTS: ApprovedFact[] = [
  {
    id: "fact-001",
    organization_id: "org-auracloud-001",
    title: "Multi-Cloud Support Scope",
    category: "Product Architecture",
    approved_statement: "AuraCloud natively integrates across Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure environments.",
    supporting_evidence: "Architecture Whitepaper 2026, Section 2; Multi-Cloud API SDK specification v3.1",
    product_association: "AuraCloud Enterprise",
    approval_status: "approved",
    last_verified_date: "2026-11-01"
  },
  {
    id: "fact-002",
    organization_id: "org-auracloud-001",
    title: "Enterprise Service Level Agreement (SLA)",
    category: "Reliability & Guarantees",
    approved_statement: "AuraCloud guarantees 99.95% monthly infrastructure orchestration uptime under Enterprise Master Services Agreements.",
    supporting_evidence: "Enterprise Customer Agreement Terms of Service, Schedule B (SLA Commitments)",
    product_association: "AuraCloud Enterprise",
    approval_status: "approved",
    last_verified_date: "2026-11-05"
  },
  {
    id: "fact-003",
    organization_id: "org-auracloud-001",
    title: "Security & Compliance Certifications",
    category: "Security & Compliance",
    approved_statement: "AuraCloud has achieved SOC 2 Type II attestation, ISO/IEC 27001:2022 certification, and adheres to GDPR data privacy regulations.",
    supporting_evidence: "Third-party audit report by Coalfire Systems (issued January 2026)",
    product_association: "All Products",
    approval_status: "approved",
    last_verified_date: "2026-11-12"
  },
  {
    id: "fact-004",
    organization_id: "org-auracloud-001",
    title: "Starting Price Point",
    category: "Pricing & Licensing",
    approved_statement: "AuraCloud Professional tier starts at $49 per managed node per month, with annual commitment volume discounts available.",
    supporting_evidence: "Approved Q4 2026 Enterprise Price Book signed by Chief Revenue Officer",
    product_association: "AuraCloud Professional",
    approval_status: "approved",
    last_verified_date: "2026-11-14"
  }
];

export const INITIAL_TERMINOLOGY: TerminologyRule[] = [
  {
    id: "term-001",
    organization_id: "org-auracloud-001",
    term: "AI magic",
    rule_type: "prohibited",
    preferred_alternative: "intelligent automated orchestration",
    case_sensitive: false,
    whole_word: true,
    rule_description: "The term 'AI magic' trivializes our engineering rigor and sounds unscientific to enterprise IT buyers.",
    contextual_exceptions: "Never permitted in external collateral."
  },
  {
    id: "term-002",
    organization_id: "org-auracloud-001",
    term: "India's No. 1",
    rule_type: "prohibited",
    preferred_alternative: "leading enterprise cloud platform",
    case_sensitive: false,
    whole_word: true,
    rule_description: "Rankings require audited analyst verification (Gartner/IDC) with active date citation.",
    contextual_exceptions: "Permitted only when citing official Gartner Magic Quadrant report."
  },
  {
    id: "term-003",
    organization_id: "org-auracloud-001",
    term: "100% accuracy",
    rule_type: "prohibited",
    preferred_alternative: "high-precision automated verification",
    case_sensitive: false,
    whole_word: true,
    rule_description: "Absolute performance claims are legally vulnerable and statistically unrealistic in distributed systems.",
    contextual_exceptions: "None."
  },
  {
    id: "term-004",
    organization_id: "org-auracloud-001",
    term: "cheapest",
    rule_type: "prohibited",
    preferred_alternative: "cost-effective enterprise solution",
    case_sensitive: false,
    whole_word: true,
    rule_description: "Comparative pricing claims without published competitive benchmarking invite regulatory scrutiny.",
    contextual_exceptions: "None."
  },
  {
    id: "term-005",
    organization_id: "org-auracloud-001",
    term: "auracloud",
    rule_type: "preferred",
    preferred_alternative: "AuraCloud",
    case_sensitive: true,
    whole_word: true,
    rule_description: "Official brand name capitalization rule: capital 'A', capital 'C'.",
    contextual_exceptions: "Permitted in CLI package names."
  },
  {
    id: "term-006",
    organization_id: "org-auracloud-001",
    term: "Results may vary depending on cloud workload configuration.",
    rule_type: "required",
    preferred_alternative: undefined,
    case_sensitive: false,
    whole_word: false,
    rule_description: "Mandatory disclaimer required on any marketing assets showcasing performance benchmarks.",
    contextual_exceptions: "Not required on short social media cards under 140 characters."
  }
];

export const INITIAL_TONE: ToneProfile = {
  id: "tone-001",
  organization_id: "org-auracloud-001",
  formality_level: 8,
  professionalism_level: 9,
  friendliness_level: 6,
  confidence_level: 8,
  technical_complexity: 7,
  target_audience: "Enterprise CIOs, Cloud Architects, and Infrastructure Engineers",
  preferred_sentence_style: "Precise, active-voice statements grounded in technical mechanics and verifiable operational outcomes.",
  words_to_avoid: ["cheap", "magic", "miracle", "revolutionary", "flawless", "100% guaranteed"],
  example_approved_content: "AuraCloud delivers unified multi-cloud governance, reducing infrastructure drift and enforcing security compliance across distributed enterprise clusters."
};

export const INITIAL_ASSETS: BrandAsset[] = [
  {
    id: "asset-001",
    organization_id: "org-auracloud-001",
    name: "Official Primary Logo (Dark)",
    asset_type: "logo_primary",
    value: "#0F172A",
    dimensions: "512x128 px",
    is_primary: true,
    status: "active"
  },
  {
    id: "asset-002",
    organization_id: "org-auracloud-001",
    name: "Official Logo (White Monochromatic)",
    asset_type: "logo_secondary",
    value: "#FFFFFF",
    dimensions: "512x128 px",
    is_primary: false,
    status: "active"
  },
  {
    id: "asset-003",
    organization_id: "org-auracloud-001",
    name: "Primary Surface Navy",
    asset_type: "color_palette",
    value: "#0F172A",
    dimensions: "RGB(15, 23, 42)",
    is_primary: true,
    status: "active"
  },
  {
    id: "asset-004",
    organization_id: "org-auracloud-001",
    name: "Accent Royal Blue",
    asset_type: "color_palette",
    value: "#2563EB",
    dimensions: "RGB(37, 99, 235)",
    is_primary: false,
    status: "active"
  },
  {
    id: "asset-005",
    organization_id: "org-auracloud-001",
    name: "Sky Cyan Accent",
    asset_type: "color_palette",
    value: "#38BDF8",
    dimensions: "RGB(56, 189, 248)",
    is_primary: false,
    status: "active"
  }
];

export const INITIAL_SUBMISSIONS: ContentSubmission[] = [
  {
    id: "sub-demo-flagged",
    organization_id: "org-auracloud-001",
    title: "Q4 Product Announcement — Press Release Draft",
    content_type: "press_release",
    target_platform: "Corporate Newsroom & PR Newswire",
    associated_product: "AuraCloud Enterprise",
    campaign_name: "Q4 Enterprise Scaling",
    original_text: "We are thrilled to announce that AuraCloud is India's No. 1 AI cloud company. Our revolutionary AI magic guarantees 100% accuracy and is the cheapest solution available on the market today. Join thousands of developers who trust auracloud without hesitation.",
    current_text: "We are thrilled to announce that AuraCloud is India's No. 1 AI cloud company. Our revolutionary AI magic guarantees 100% accuracy and is the cheapest solution available on the market today. Join thousands of developers who trust auracloud without hesitation.",
    status: "audited",
    word_count: 35,
    character_count: 248,
    compliance_score: 34,
    creator_id: "user-creator-1",
    creator_name: "Marcus Vance",
    created_at: "2026-11-14T10:15:00Z",
    updated_at: "2026-11-14T10:15:00Z",
    findings_count: 5,
    critical_count: 2
  },
  {
    id: "sub-demo-approved",
    organization_id: "org-auracloud-001",
    title: "Multi-Cloud Enterprise Security Architecture Brief",
    content_type: "marketing_copy",
    target_platform: "Corporate Blog & LinkedIn",
    associated_product: "AuraCloud Enterprise",
    campaign_name: "Infrastructure Security Series",
    original_text: "AuraCloud provides unified multi-cloud governance across AWS, Google Cloud Platform, and Microsoft Azure. Backed by our 99.95% monthly uptime SLA, AuraCloud enables engineering teams to deploy compliant infrastructure securely and with high reliability.",
    current_text: "AuraCloud provides unified multi-cloud governance across AWS, Google Cloud Platform, and Microsoft Azure. Backed by our 99.95% monthly uptime SLA, AuraCloud enables engineering teams to deploy compliant infrastructure securely and with high reliability.",
    status: "approved",
    word_count: 32,
    character_count: 264,
    compliance_score: 100,
    creator_id: "user-creator-1",
    creator_name: "Marcus Vance",
    created_at: "2026-11-12T16:20:00Z",
    updated_at: "2026-11-13T09:45:00Z",
    findings_count: 0,
    critical_count: 0
  }
];

export const INITIAL_FINDINGS: Record<string, ComplianceFinding[]> = {
  "sub-demo-flagged": [
    {
      id: "find-001",
      submission_id: "sub-demo-flagged",
      category: "unsupported_claim",
      severity: "high",
      original_text: "India's No. 1",
      start_index: 45,
      end_index: 58,
      explanation: "Unsupported market leadership ranking. Market position claims must cite dated third-party analyst recognition (e.g. Gartner, IDC).",
      relevant_brand_rule: "Factual Claims Policy 4.2: Prohibited Market Superlatives",
      source_document: "AuraCloud Global Brand & Communication Manual v2.4",
      page_reference: "Page 22, Section 4.2",
      exact_supporting_passage: "Section 4.2: Factual Claims Policy: Unsubstantiated market leadership claims ('No. 1', 'cheapest') expose the company to regulatory censure and are prohibited.",
      suggested_correction: "a leading enterprise cloud platform",
      confidence: 0.98,
      status: "pending"
    },
    {
      id: "find-002",
      submission_id: "sub-demo-flagged",
      category: "terminology",
      severity: "high",
      original_text: "AI magic",
      start_index: 93,
      end_index: 101,
      explanation: "The phrase 'AI magic' is explicitly prohibited. It trivializes enterprise software engineering and violates brand voice standards.",
      relevant_brand_rule: "Terminology Policy: Prohibited Term 'AI magic'",
      source_document: "AuraCloud Global Brand & Communication Manual v2.4",
      page_reference: "Page 15, Section 3.4",
      exact_supporting_passage: "Section 3.4: Nomenclature Rules: Never refer to our capabilities as 'AI magic'. Use 'automated cloud orchestration' or 'predictive optimization'.",
      suggested_correction: "intelligent automated orchestration",
      confidence: 1.0,
      status: "pending"
    },
    {
      id: "find-003",
      submission_id: "sub-demo-flagged",
      category: "unsupported_claim",
      severity: "critical",
      original_text: "guarantees 100% accuracy",
      start_index: 102,
      end_index: 126,
      explanation: "Absolute performance guarantee. Legally prohibited under our compliance guidelines without qualified warranty limits and SLA bounds.",
      relevant_brand_rule: "Legal Compliance Standard: Prohibited Absolute Guarantees",
      source_document: "AuraCloud Global Brand & Communication Manual v2.4",
      page_reference: "Page 22, Section 4.2",
      exact_supporting_passage: "Section 4.2: Never state absolute guarantees, unsupported rankings, or exaggerated superlatives. All product descriptions must reflect verifiable specifications.",
      suggested_correction: "delivers high-reliability automated verification",
      confidence: 0.99,
      status: "pending"
    },
    {
      id: "find-004",
      submission_id: "sub-demo-flagged",
      category: "unsupported_claim",
      severity: "critical",
      original_text: "cheapest solution available",
      start_index: 138,
      end_index: 165,
      explanation: "Unsubstantiated comparative pricing claim. Price superlatives require a defined competitor benchmark and active pricing audit.",
      relevant_brand_rule: "Factual Claims Policy 4.2: Comparative Pricing",
      source_document: "AuraCloud Global Brand & Communication Manual v2.4",
      page_reference: "Page 22, Section 4.2",
      exact_supporting_passage: "Section 4.2: Comparative pricing claims ('cheapest') without published competitive benchmarking invite regulatory scrutiny.",
      suggested_correction: "cost-effective enterprise solution",
      confidence: 0.97,
      status: "pending"
    },
    {
      id: "find-005",
      submission_id: "sub-demo-flagged",
      category: "terminology",
      severity: "medium",
      original_text: "auracloud",
      start_index: 226,
      end_index: 235,
      explanation: "Incorrect brand capitalization. AuraCloud must always be capitalized with capital 'A' and capital 'C'.",
      relevant_brand_rule: "Brand Nomenclature Policy 3.4: Capitalization Standard",
      source_document: "AuraCloud Global Brand & Communication Manual v2.4",
      page_reference: "Page 15, Section 3.4",
      exact_supporting_passage: "Section 3.4: Nomenclature Rules: AuraCloud must always appear in camel-case. Derivatives such as 'auracloud' are prohibited.",
      suggested_correction: "AuraCloud",
      confidence: 1.0,
      status: "pending"
    }
  ]
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    organization_id: "org-auracloud-001",
    user_id: "user-creator-1",
    title: "Audit Completed",
    message: "Q4 Product Announcement draft has been audited. 5 compliance findings identified.",
    notification_type: "audit_completed",
    link: "/app/corrections/sub-demo-flagged",
    is_read: false,
    created_at: "2026-11-14T10:16:00Z"
  },
  {
    id: "notif-2",
    organization_id: "org-auracloud-001",
    user_id: "user-creator-1",
    title: "Content Approved",
    message: "Multi-Cloud Enterprise Security Architecture Brief was approved by Sarah Lin.",
    notification_type: "approved",
    link: "/app/approvals",
    is_read: true,
    created_at: "2026-11-13T09:45:00Z"
  }
];
