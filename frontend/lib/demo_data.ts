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
  Notification,
  ContentRevision,
  ApprovalRecord,
  ActivityItem
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
  },
  {
    id: "guide-002",
    organization_id: "org-auracloud-001",
    title: "AuraCloud Enterprise Architecture & Product Claims Manual v3.0",
    description: "Technical specifications, SLA limits, prohibited security claims, and competitive comparison rules.",
    category: "product_architecture",
    version: "3.0",
    status: "active",
    file_name: "AuraCloud_Enterprise_Architecture_Brand_Knowledge_Base_v2.md",
    extracted_text: "AuraCloud delivers multi-cloud infrastructure orchestration. All published metrics must adhere to verified benchmarks: financially backed 99.95% monthly uptime SLA, RPO under 15 seconds, and 48 Tier-1 edge PoPs. Absolute security claims such as 'unhackable' or 'bulletproof' are strictly prohibited.",
    uploaded_at: "2026-11-18T18:00:00Z",
    chunks_count: 6
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
  },
  {
    id: "fact-005",
    organization_id: "org-auracloud-001",
    title: "High-Availability Failover Limits",
    category: "Reliability & Guarantees",
    approved_statement: "AuraCloud guarantees Recovery Point Objective (RPO) under 15 seconds and Recovery Time Objective (RTO) under 60 seconds across paired multi-cloud regions.",
    supporting_evidence: "Disaster Recovery Protocol v3.2 & Chaos Mesh Failover Audit 2026",
    product_association: "AuraCloud Core",
    approval_status: "approved",
    last_verified_date: "2026-11-15"
  },
  {
    id: "fact-006",
    organization_id: "org-auracloud-001",
    title: "Global Edge Infrastructure Footprint",
    category: "Product Architecture",
    approved_statement: "AuraCloud EdgeDirect operates 48 Tier-1 points of presence across North America, EMEA, and APAC delivering sub-10ms API routing.",
    supporting_evidence: "Global Network Operations Infrastructure Topology Guide 2026",
    product_association: "AuraCloud EdgeDirect",
    approval_status: "approved",
    last_verified_date: "2026-11-16"
  },
  {
    id: "fact-007",
    organization_id: "org-auracloud-001",
    title: "Enterprise Cryptographic Standards",
    category: "Security & Compliance",
    approved_statement: "AuraCloud enforces FIPS 140-3 validated AES-256-GCM and ChaCha20-Poly1305 encryption with automated mTLS 1.3 service mesh isolation.",
    supporting_evidence: "InfoSec Cryptographic Controls Specification Sec 8.2",
    product_association: "AuraCloud Mesh & Vault",
    approval_status: "approved",
    last_verified_date: "2026-11-17"
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
  },
  {
    id: "term-007",
    organization_id: "org-auracloud-001",
    term: "unhackable",
    rule_type: "prohibited",
    preferred_alternative: "zero-trust architecture with defense-in-depth isolation",
    case_sensitive: false,
    whole_word: true,
    rule_description: "Absolute security guarantees create severe product liability. Use defense-in-depth terminology.",
    contextual_exceptions: "None."
  },
  {
    id: "term-008",
    organization_id: "org-auracloud-001",
    term: "bulletproof",
    rule_type: "prohibited",
    preferred_alternative: "resilient enterprise infrastructure",
    case_sensitive: false,
    whole_word: true,
    rule_description: "Informal, exaggerated security metaphor prohibited under Section 4.1.",
    contextual_exceptions: "None."
  },
  {
    id: "term-009",
    organization_id: "org-auracloud-001",
    term: "military-grade encryption",
    rule_type: "prohibited",
    preferred_alternative: "FIPS 140-3 validated AES-256-GCM encryption",
    case_sensitive: false,
    whole_word: true,
    rule_description: "Vague marketing cliché. Always specify exact cryptographic ciphers and FIPS validation standards.",
    contextual_exceptions: "None."
  },
  {
    id: "term-010",
    organization_id: "org-auracloud-001",
    term: "zero latency",
    rule_type: "prohibited",
    preferred_alternative: "deterministic sub-5 millisecond median latency",
    case_sensitive: false,
    whole_word: true,
    rule_description: "Zero latency claims violate physical networking bounds. Quote empirical p99 latency percentiles.",
    contextual_exceptions: "None."
  },
  {
    id: "term-011",
    organization_id: "org-auracloud-001",
    term: "infinite scale",
    rule_type: "prohibited",
    preferred_alternative: "elastic horizontal autoscaling supporting 1M+ concurrent RPS",
    case_sensitive: false,
    whole_word: true,
    rule_description: "Unbounded scalability claims lack engineering veracity. Cite verified benchmark thresholds.",
    contextual_exceptions: "None."
  },
  {
    id: "term-012",
    organization_id: "org-auracloud-001",
    term: "cloud supremacy",
    rule_type: "prohibited",
    preferred_alternative: "cloud leadership and operational resilience",
    case_sensitive: false,
    whole_word: true,
    rule_description: "Combative, aggressive language violates AuraCloud executive professional tone guidelines.",
    contextual_exceptions: "None."
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
    id: "sub-q4-launch",
    organization_id: "org-auracloud-001",
    title: "Q4 Enterprise Cloud Infrastructure Announcement",
    content_type: "press_release",
    target_platform: "Corporate Newsroom & PR Newswire",
    associated_product: "AuraCloud Enterprise",
    campaign_name: "Q4 Enterprise Scaling",
    original_text: "We are thrilled to announce that AuraCloud is India's No. 1 AI cloud company. Our revolutionary AI magic guarantees 100% accuracy and is the cheapest solution available on the market today. Join thousands of developers who trust auracloud without hesitation.",
    current_text: "We are thrilled to announce that AuraCloud is a leading enterprise cloud platform. Our intelligent automated orchestration delivers high-reliability automated verification and is a cost-effective enterprise solution available on the market today. Join thousands of developers who trust AuraCloud without hesitation.",
    status: "in_review",
    word_count: 36,
    character_count: 260,
    compliance_score: 98,
    creator_id: "user-creator-1",
    creator_name: "Marcus Vance",
    created_at: "2026-11-18T18:00:00Z",
    updated_at: "2026-11-18T18:30:00Z",
    findings_count: 5,
    critical_count: 0
  },
  {
    id: "sub-security-whitepaper",
    organization_id: "org-auracloud-001",
    title: "AuraCloud Zero-Trust Architecture Whitepaper",
    content_type: "marketing_copy",
    target_platform: "Enterprise Security Resource Portal",
    associated_product: "AuraCloud Mesh & Vault",
    campaign_name: "SecOps Enterprise 2026",
    original_text: "AuraCloud provides defense-in-depth isolation across distributed clusters. With FIPS 140-3 validated AES-256-GCM encryption and automated mTLS 1.3 service mesh controls, our infrastructure delivers certified data residency.",
    current_text: "AuraCloud provides defense-in-depth isolation across distributed clusters. With FIPS 140-3 validated AES-256-GCM encryption and automated mTLS 1.3 service mesh controls, our infrastructure delivers certified data residency.",
    status: "approved",
    word_count: 31,
    character_count: 228,
    compliance_score: 100,
    creator_id: "user-creator-1",
    creator_name: "Marcus Vance",
    created_at: "2026-11-18T15:00:00Z",
    updated_at: "2026-11-18T16:20:00Z",
    findings_count: 0,
    critical_count: 0
  },
  {
    id: "sub-pricing-brief",
    organization_id: "org-auracloud-001",
    title: "AuraCloud Q4 Pricing & Node Expansion Brief",
    content_type: "marketing_copy",
    target_platform: "Sales Enablement & Customer Portal",
    associated_product: "AuraCloud Professional",
    campaign_name: "Q4 Customer Acquisition",
    original_text: "Deploy managed nodes with our lowest cost guarantee. AuraCloud Professional starts at $49 per node with infinite horizontal autoscaling.",
    current_text: "Deploy managed nodes with our lowest cost guarantee. AuraCloud Professional starts at $49 per node with infinite horizontal autoscaling.",
    status: "changes_requested",
    word_count: 21,
    character_count: 147,
    compliance_score: 74,
    creator_id: "user-creator-1",
    creator_name: "Marcus Vance",
    created_at: "2026-11-18T16:45:00Z",
    updated_at: "2026-11-18T17:10:00Z",
    findings_count: 2,
    critical_count: 1
  }
];

export const INITIAL_FINDINGS: Record<string, ComplianceFinding[]> = {
  "sub-q4-launch": [
    {
      id: "find-001",
      submission_id: "sub-q4-launch",
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
      submission_id: "sub-q4-launch",
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
      submission_id: "sub-q4-launch",
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
      submission_id: "sub-q4-launch",
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
      submission_id: "sub-q4-launch",
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
  ],
  "sub-pricing-brief": [
    {
      id: "find-pb-01",
      submission_id: "sub-pricing-brief",
      category: "unsupported_claim",
      severity: "critical",
      original_text: "lowest cost guarantee",
      start_index: 31,
      end_index: 52,
      explanation: "Comparative guarantee without signed executive price book exception.",
      relevant_brand_rule: "Factual Claims Policy 4.2: Comparative Pricing",
      source_document: "AuraCloud Global Brand & Communication Manual v2.4",
      page_reference: "Page 22, Section 4.2",
      exact_supporting_passage: "Section 4.2: Pricing claims must reflect premium enterprise positioning rather than commodity discounting.",
      suggested_correction: "transparent enterprise pricing",
      confidence: 0.96,
      status: "pending"
    },
    {
      id: "find-pb-02",
      submission_id: "sub-pricing-brief",
      category: "unsupported_claim",
      severity: "high",
      original_text: "infinite horizontal autoscaling",
      start_index: 104,
      end_index: 137,
      explanation: "Unbounded scalability claim lacks verified engineering threshold.",
      relevant_brand_rule: "Architecture Scale Standard 3.1: Horizontal Autoscaling Bounds",
      source_document: "AuraCloud Enterprise Architecture v3.0",
      page_reference: "Section 3.1",
      exact_supporting_passage: "Unbounded scalability claims lack engineering veracity. Cite verified load-test thresholds.",
      suggested_correction: "elastic horizontal autoscaling supporting 1M+ concurrent RPS",
      confidence: 0.98,
      status: "pending"
    }
  ]
};

export const INITIAL_REVISIONS: Record<string, ContentRevision[]> = {
  "sub-q4-launch": [
    {
      id: "rev-q4-1",
      submission_id: "sub-q4-launch",
      version_number: 1.0,
      content_text: "We are thrilled to announce that AuraCloud is India's No. 1 AI cloud company. Our revolutionary AI magic guarantees 100% accuracy and is the cheapest solution available on the market today. Join thousands of developers who trust auracloud without hesitation.",
      change_summary: "Initial draft ingested from PR Newswire campaign staging.",
      author_name: "Marcus Vance",
      compliance_score: 34,
      timestamp: "2026-11-18T17:30:00Z"
    },
    {
      id: "rev-q4-2",
      submission_id: "sub-q4-launch",
      version_number: 1.1,
      content_text: "We are thrilled to announce that AuraCloud is a leading enterprise cloud platform. Our intelligent automated orchestration delivers high-reliability automated verification and is a cost-effective enterprise solution available on the market today. Join thousands of developers who trust AuraCloud without hesitation.",
      change_summary: "Applied 5 AI studio corrections: replaced market superlatives, unverified accuracy guarantees, and corrected camelCase brand naming.",
      author_name: "Marcus Vance",
      compliance_score: 98,
      timestamp: "2026-11-18T18:15:00Z"
    },
    {
      id: "rev-q4-3",
      submission_id: "sub-q4-launch",
      version_number: 1.2,
      content_text: "We are thrilled to announce that AuraCloud is a leading enterprise cloud platform. Our intelligent automated orchestration delivers high-reliability automated verification with 99.95% monthly uptime SLA backing and is a cost-effective enterprise solution. Join thousands of enterprise engineers who trust AuraCloud without hesitation.",
      change_summary: "Added SLA commitment citation and routed to Human Approval Centre for reviewer sign-off.",
      author_name: "Sarah Lin",
      compliance_score: 100,
      timestamp: "2026-11-18T18:45:00Z"
    }
  ]
};

export const INITIAL_APPROVAL_RECORDS: ApprovalRecord[] = [
  {
    id: "appr-rec-001",
    submission_id: "sub-security-whitepaper",
    submission_title: "AuraCloud Zero-Trust Architecture Whitepaper",
    reviewer_id: "user-reviewer-1",
    reviewer_name: "Sarah Lin",
    decision: "approved",
    comments: "Verified all cryptographic assertions against FIPS 140-3 standards. No absolute superlatives found. Formally approved for global dissemination.",
    content_version: 2.0,
    timestamp: "2026-11-18T16:20:00Z",
    cryptographic_stamp: "AUTH-APP-9B4A-7X92-2026"
  },
  {
    id: "appr-rec-002",
    submission_id: "sub-pricing-brief",
    submission_title: "AuraCloud Q4 Pricing & Node Expansion Brief",
    reviewer_id: "user-reviewer-1",
    reviewer_name: "Sarah Lin",
    decision: "changes_requested",
    comments: "Please remove the phrase 'lowest cost guarantee' on page 3. Cite the exact $49/node tier price schedule from Approved Fact #4 instead.",
    content_version: 1.1,
    timestamp: "2026-11-18T17:10:00Z",
    cryptographic_stamp: "AUTH-CHG-5E82-3A19-2026"
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-001",
    type: "audit",
    title: "Document Ingestion & AI Audit",
    description: "Audited 'Q4 Enterprise Cloud Infrastructure Announcement'. 5 source-grounded findings flagged (34% compliance score).",
    actor_name: "Marcus Vance",
    actor_role: "creator",
    target_link: "/app/corrections/sub-q4-launch",
    timestamp: "15 minutes ago",
    status_badge: "34% Score"
  },
  {
    id: "act-002",
    type: "correction",
    title: "Lexical Replacements Applied",
    description: "Corrected 'AI magic' to 'intelligent automated orchestration' and fixed brand camelCase.",
    actor_name: "Marcus Vance",
    actor_role: "creator",
    target_link: "/app/corrections/sub-q4-launch",
    timestamp: "25 minutes ago",
    status_badge: "5 Fixes"
  },
  {
    id: "act-003",
    type: "approval",
    title: "Draft Routed for Approval",
    description: "Marcus Vance requested brand manager evaluation on 'Q4 Enterprise Cloud Announcement'.",
    actor_name: "Marcus Vance",
    actor_role: "creator",
    target_link: "/app/approvals",
    timestamp: "40 minutes ago",
    status_badge: "In Review"
  },
  {
    id: "act-004",
    type: "approval",
    title: "Release Authorization Stamped",
    description: "Sarah Lin granted cryptographic publication sign-off for 'Zero-Trust Architecture Whitepaper'.",
    actor_name: "Sarah Lin",
    actor_role: "reviewer",
    target_link: "/app/approvals",
    timestamp: "2 hours ago",
    status_badge: "Approved"
  },
  {
    id: "act-005",
    type: "policy",
    title: "Brand Rule Indexed",
    description: "Updated prohibited rule for '100% accuracy' under Legal Compliance Standard Section 4.2.",
    actor_name: "Ruben John Reji",
    actor_role: "admin",
    target_link: "/app/knowledge?tab=terminology",
    timestamp: "4 hours ago",
    status_badge: "Rule Updated"
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-init-audit-1",
    organization_id: "org-auracloud-001",
    user_id: "user-creator-1",
    title: "Audit Findings Flagged",
    message: "Q4 Enterprise Cloud Infrastructure Announcement was audited. 5 source-backed findings require review in the studio.",
    notification_type: "audit_completed",
    link: "/app/corrections/sub-q4-launch",
    is_read: false,
    created_at: "2026-11-18T18:05:00Z"
  },
  {
    id: "notif-init-audit-2",
    organization_id: "org-auracloud-001",
    user_id: "user-admin-1",
    title: "New Draft Ingested",
    message: "Marcus Vance audited 'Q4 Enterprise Cloud Infrastructure Announcement'. 5 brand policy discrepancies detected.",
    notification_type: "audit_completed",
    link: "/app/corrections/sub-q4-launch",
    is_read: false,
    created_at: "2026-11-18T18:05:00Z"
  }
];

