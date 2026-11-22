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
  ActivityItem,
  BrandBaseDefinition
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
    critical_count: 0,
    claim_verification_summary: {
      total_claims_analyzed: 5,
      supported_count: 0,
      contradicted_count: 2,
      unverified_count: 3,
      integrity_score: 42.0,
      claims: [
        {
          id: "claim-001",
          claim_text: "India's No. 1",
          status: "cannot_be_verified",
          confidence: 0.98,
          explanation: "Market leadership ranking asserted without dated third-party analyst citation (e.g. Gartner, IDC).",
          relevant_source: "AuraCloud Global Brand & Communication Manual v2.4",
          exact_passage: "Section 4.2: Factual Claims Policy: Unsubstantiated market leadership claims ('No. 1', 'cheapest') expose the company to regulatory censure and are prohibited.",
          suggested_correction: "a leading enterprise cloud platform"
        },
        {
          id: "claim-002",
          claim_text: "AI magic",
          status: "cannot_be_verified",
          confidence: 1.0,
          explanation: "Vague marketing hyperbole. Trivializes technical engineering and conflicts with our authoritative, transparent enterprise voice.",
          relevant_source: "AuraCloud Global Brand & Communication Manual v2.4",
          exact_passage: "Section 3.4: Nomenclature Rules: Never refer to our capabilities as 'AI magic'. Use 'automated cloud orchestration'.",
          suggested_correction: "intelligent automated orchestration"
        },
        {
          id: "claim-003",
          claim_text: "guarantees 100% accuracy",
          status: "cannot_be_verified",
          confidence: 0.99,
          explanation: "Empirical software and machine learning systems cannot promise 100% precision across all edge cases without statistical confidence qualifications.",
          relevant_source: "Legal Compliance Standard 4.2",
          exact_passage: "Section 4.2: Never state absolute guarantees, unsupported rankings, or exaggerated superlatives.",
          suggested_correction: "delivers high-reliability automated verification"
        },
        {
          id: "claim-004",
          claim_text: "cheapest solution available",
          status: "contradicted",
          confidence: 0.97,
          explanation: "Directly contradicts approved price book. AuraCloud pricing starts at $49/node, positioned as premium enterprise infrastructure.",
          relevant_source: "Approved Enterprise Price Book",
          exact_passage: "Price Book FY26: Developer tier commences at $49/node/month. Comparative price claims ('cheapest') prohibited under Lanham Act § 43(a).",
          suggested_correction: "cost-effective enterprise solution"
        },
        {
          id: "claim-005",
          claim_text: "auracloud",
          status: "cannot_be_verified",
          confidence: 1.0,
          explanation: "Deviates from mandatory camel-case nomenclature 'AuraCloud'.",
          relevant_source: "Corporate Brand Manual v2.4",
          exact_passage: "Section 3.4: Brand Nomenclature Policy: AuraCloud must always appear in camel-case.",
          suggested_correction: "AuraCloud"
        }
      ]
    }
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
    critical_count: 0,
    claim_verification_summary: {
      total_claims_analyzed: 3,
      supported_count: 3,
      contradicted_count: 0,
      unverified_count: 0,
      integrity_score: 100.0,
      claims: [
        {
          id: "claim-sec-01",
          claim_text: "Defense-in-depth isolation across distributed clusters",
          status: "supported",
          confidence: 0.99,
          explanation: "Architecture topology matches verified InfoSec baseline controls.",
          relevant_source: "InfoSec Cryptographic Controls Specification Sec 8.2",
          exact_passage: "AuraCloud enforces zero-trust architecture with defense-in-depth cluster isolation."
        },
        {
          id: "claim-sec-02",
          claim_text: "FIPS 140-3 validated AES-256-GCM encryption",
          status: "supported",
          confidence: 1.0,
          explanation: "NIST cryptographic module validation certified (#4128).",
          relevant_source: "NIST Cryptographic Module Validation Program",
          exact_passage: "Cryptographic module certified under FIPS 140-3 standards."
        },
        {
          id: "claim-sec-03",
          claim_text: "Automated mTLS 1.3 service mesh controls",
          status: "supported",
          confidence: 0.99,
          explanation: "Service mesh mutual TLS automation verified in infrastructure configuration.",
          relevant_source: "Security Architecture Standard 2026",
          exact_passage: "Enforces automated mTLS 1.3 service mesh isolation across all inter-service endpoints."
        }
      ]
    }
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
      status: "pending",
      verification_status: "cannot_be_verified",
      claim_type: "market_ranking",
      context_reasoning: "Market leadership ranking asserted without dated third-party analyst citation (e.g. Gartner Magic Quadrant, IDC MarketScape).",
      grounded_evidence: "Corporate Manual Section 4.2: Market ranking assertions must cite recognized industry analyst reports published within the trailing 12 months."
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
      status: "pending",
      verification_status: "cannot_be_verified",
      claim_type: "tone",
      context_reasoning: "Vague marketing hyperbole. Trivializes technical engineering and conflicts with our authoritative, transparent enterprise voice.",
      grounded_evidence: "Brand Tone Standard: Maintain clear, active voice with technical precision. Words to avoid include speculative buzzwords like 'magic'."
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
      status: "pending",
      verification_status: "cannot_be_verified",
      claim_type: "absolute_guarantee",
      context_reasoning: "Absolute performance guarantee. Machine learning systems cannot promise 100% precision across all edge cases without qualified confidence bounds.",
      grounded_evidence: "Legal Policy 4.2: Prohibits absolute performance guarantees without formal warranty limitation language."
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
      status: "pending",
      verification_status: "contradicted",
      claim_type: "pricing",
      context_reasoning: "Comparative pricing claim directly contradicts enterprise price book ($49/node) and invites regulatory scrutiny under Lanham Act § 43(a).",
      grounded_evidence: "Approved Price Book: AuraCloud solutions are positioned as premium enterprise infrastructure starting at $49/node, not commodity discounted services."
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
      status: "pending",
      verification_status: "cannot_be_verified",
      claim_type: "terminology",
      context_reasoning: "Nomenclature deviation: corporate brand guidelines require camel-case 'AuraCloud'.",
      grounded_evidence: "Brand Nomenclature Standard 3.4: AuraCloud capitalization is mandatory across all marketing channels."
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




// ==============================================================
// 12 HIGH-FIDELITY COMMERCIAL ENTERPRISE BRAND BASES
// ==============================================================

export const ALL_BRAND_BASES: BrandBaseDefinition[] = [
  // 1. AuraCloud Technologies
  {
    workspace: INITIAL_ORG,
    icon: "☁️",
    badge: "Cloud Infrastructure",
    guidelines: INITIAL_GUIDELINES,
    facts: INITIAL_FACTS,
    terminology: INITIAL_TERMINOLOGY,
    tone: INITIAL_TONE,
    assets: INITIAL_ASSETS,
    sampleDraft: {
      name: "AuraCloud SLA & Pricing Claims",
      headline: "Q4 Cloud Infrastructure & Distributed Orchestration Launch",
      contentType: "press_release",
      campaign: "Q4 Platform General Availability",
      targetAudience: "Enterprise CIOs and Cloud Architects",
      jurisdiction: "us_ftc",
      flaggedBody: `AuraCloud is excited to announce our new orchestration engine, recognized as India's No. 1 multi-cloud management platform. Built with cutting-edge AI magic that guarantees 100% accuracy across every container deployment, AuraCloud is the cheapest solution available in modern cloud computing. Our mission is to help companies transform effortlessly without complicated setups. Choose auracloud today for ultimate cloud supremacy.`,
      compliantBody: `AuraCloud provides unified multi-cloud governance across AWS, Google Cloud Platform, and Microsoft Azure. Backed by our 99.95% monthly uptime SLA, AuraCloud enables engineering teams to deploy compliant infrastructure securely and with high reliability. Our automated cloud orchestration ensures consistent policy enforcement across distributed clusters.`
    }
  },

  // 2. FinTrust Wealth Management
  {
    workspace: {
      id: "org-fintrust-002",
      name: "FinTrust Wealth Management LLC",
      brand_name: "FinTrust",
      slug: "fintrust",
      industry: "Global Investment Banking & Wealth Management",
      description: "SEC-registered algorithmic asset management and quantitative treasury solutions for institutional portfolios.",
      website_url: "https://fintrustwealth.com",
      primary_color: "#0B192C",
      secondary_color: "#1E3E62",
      accent_color: "#00FF87",
      logo_url: "/assets/fintrust-logo.svg",
      members_count: 8
    },
    icon: "📈",
    badge: "FinTech & Banking",
    guidelines: [
      {
        id: "guide-ft-001",
        organization_id: "org-fintrust-002",
        title: "FinTrust Statutory Financial Disclosures & SEC Compliance Manual v4.1",
        description: "SEC Reg BI, FINRA Rule 2210, and FTC statutory advertising standards for investment advisory.",
        category: "financial_compliance",
        version: "4.1",
        status: "active",
        file_name: "FinTrust_SEC_Compliance_Manual_v4.1.pdf",
        extracted_text: "FinTrust is an SEC-registered investment adviser. Strict prohibition against promising guaranteed returns, zero-risk yields, or risk-free capital gains. All performance statements must include standard past performance disclaimer.",
        uploaded_at: "2026-11-12T10:00:00Z",
        chunks_count: 5
      }
    ],
    facts: [
      {
        id: "fact-ft-001",
        organization_id: "org-fintrust-002",
        title: "SEC RIA Registration & AUM",
        category: "Corporate Registration",
        approved_statement: "FinTrust Wealth Management manages $42.8B in regulatory assets under management (AUM) under SEC Registration #801-94821.",
        supporting_evidence: "SEC Form ADV Part 1A Annual Amendment filed October 2026",
        product_association: "FinTrust Institutional",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      },
      {
        id: "fact-ft-002",
        organization_id: "org-fintrust-002",
        title: "Institutional Treasury Yield",
        category: "Treasury Rates",
        approved_statement: "FinTrust Institutional Cash Reserve yields 4.85% APY backed by short-term US Treasury Bills.",
        supporting_evidence: "Federal Reserve Daily Treasury Yield Curve & Custody Statement",
        product_association: "Cash Reserve Fund",
        approval_status: "approved",
        last_verified_date: "2026-11-15"
      },
      {
        id: "fact-ft-003",
        organization_id: "org-fintrust-002",
        title: "Custody Insurance Protection",
        category: "Asset Protection",
        approved_statement: "Securities in customer accounts protected up to $500,000 (including $250,000 for cash claims) by SIPC.",
        supporting_evidence: "Securities Investor Protection Corporation Member Directory 2026",
        product_association: "All Accounts",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      }
    ],
    terminology: [
      {
        id: "term-ft-001",
        organization_id: "org-fintrust-002",
        term: "guaranteed returns",
        rule_type: "prohibited",
        preferred_alternative: "projected target performance",
        case_sensitive: false,
        whole_word: true,
        rule_description: "SEC Rule 156 prohibit promising guaranteed return on equity securities.",
        contextual_exceptions: "Permitted only on FDIC-insured sweep deposits."
      },
      {
        id: "term-ft-002",
        organization_id: "org-fintrust-002",
        term: "risk-free",
        rule_type: "prohibited",
        preferred_alternative: "capital-preservation focused",
        case_sensitive: false,
        whole_word: true,
        rule_description: "FINRA Rule 2210: no investment strategy may be characterized as risk-free.",
        contextual_exceptions: "None."
      },
      {
        id: "term-ft-003",
        organization_id: "org-fintrust-002",
        term: "Past performance is no guarantee of future results. Investing involves risk of loss.",
        rule_type: "required",
        preferred_alternative: undefined,
        case_sensitive: false,
        whole_word: false,
        rule_description: "Statutory mandatory disclosure on all financial marketing collateral.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 9.8,
      technical_complexity: 8.5,
      confidence_level: 9.0,
      tone_keywords: ["Fiduciary Rigor", "Quantitative Precision", "Regulatory Transparency", "Capital Prudence"]
    },
    assets: [
      { id: "asset-ft-01", organization_id: "org-fintrust-002", name: "FinTrust Navy", asset_type: "color", value: "#0B192C", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" },
      { id: "asset-ft-02", organization_id: "org-fintrust-002", name: "Emerald Yield Green", asset_type: "color", value: "#00FF87", is_primary: false, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "FinTrust SEC Investment Portfolio",
      headline: "Announcing FinTrust Quantitative Multi-Asset Yield Strategy",
      contentType: "press_release",
      campaign: "Institutional Wealth Growth 2026",
      targetAudience: "Family Offices & Institutional Investors",
      jurisdiction: "us_ftc",
      flaggedBody: `FinTrust is proud to announce our new automated algorithm delivering guaranteed returns of 18.5% net of all management fees. Our proprietary algorithmic quant trading engine offers completely risk-free wealth expansion that beats every hedge fund in New York. Invest with FinTrust today to secure guaranteed financial freedom with zero downside exposure.`,
      compliantBody: `FinTrust introduces our quantitative multi-asset yield strategy, designed for institutional capital preservation and steady cash flow. The strategy targets short-duration fixed income and dynamic equity hedging. Past performance is no guarantee of future results. Investing involves risk of loss.`
    }
  },

  // 3. MediPulse Healthcare & Diagnostics
  {
    workspace: {
      id: "org-medipulse-003",
      name: "MediPulse Health AI Systems",
      brand_name: "MediPulse",
      slug: "medipulse",
      industry: "Clinical AI Diagnostics & HealthTech",
      description: "FDA-cleared medical image analysis and automated clinical workflow intelligence for hospital networks.",
      website_url: "https://medipulsehealth.com",
      primary_color: "#082F49",
      secondary_color: "#0369A1",
      accent_color: "#38BDF8",
      logo_url: "/assets/medipulse-logo.svg",
      members_count: 6
    },
    icon: "🩺",
    badge: "HealthTech & Medical",
    guidelines: [
      {
        id: "guide-mp-001",
        organization_id: "org-medipulse-003",
        title: "MediPulse Medical Claims & FDA 510(k) Truthfulness Standard v3.2",
        description: "HIPAA patient privacy, FDA medical device advertising restrictions, and clinical trial reporting.",
        category: "healthcare_compliance",
        version: "3.2",
        status: "active",
        file_name: "MediPulse_FDA_Medical_Guide_v3.2.pdf",
        extracted_text: "MediPulse AI tools are decision support software intended to assist, not replace, board-certified physicians. Strictly forbidden: claiming 100% cure rate, miracle breakthrough, or autonomous doctor replacement.",
        uploaded_at: "2026-11-05T08:30:00Z",
        chunks_count: 4
      }
    ],
    facts: [
      {
        id: "fact-mp-001",
        organization_id: "org-medipulse-003",
        title: "FDA 510(k) Clearance Scope",
        category: "Regulatory Clearance",
        approved_statement: "MediPulse Pulmonary AI has received FDA 510(k) clearance (K241908) as computer-assisted triage software for chest CT exams.",
        supporting_evidence: "FDA Premarket Notification Database Entry K241908",
        product_association: "MediPulse Pulmonary",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      },
      {
        id: "fact-mp-002",
        organization_id: "org-medipulse-003",
        title: "Clinical Validation Multi-Center Sensitivity",
        category: "Clinical Accuracy",
        approved_statement: "Validated across 142,000 multi-center clinical exams with 99.4% sensitivity and 96.2% specificity.",
        supporting_evidence: "Journal of Thoracic Oncology Multicenter Clinical Trial Report 2026",
        product_association: "MediPulse Diagnostic Suite",
        approval_status: "approved",
        last_verified_date: "2026-11-10"
      }
    ],
    terminology: [
      {
        id: "term-mp-001",
        organization_id: "org-medipulse-003",
        term: "100% cure rate",
        rule_type: "prohibited",
        preferred_alternative: "clinically proven diagnostic sensitivity",
        case_sensitive: false,
        whole_word: true,
        rule_description: "FDA regulations forbid curative guarantees for diagnostic imaging software.",
        contextual_exceptions: "None."
      },
      {
        id: "term-mp-002",
        organization_id: "org-medipulse-003",
        term: "replaces doctors",
        rule_type: "prohibited",
        preferred_alternative: "assists licensed clinicians with diagnostic workflow",
        case_sensitive: false,
        whole_word: true,
        rule_description: "AMA and FDA require clinical AI to be positioned as physician decision support.",
        contextual_exceptions: "None."
      },
      {
        id: "term-mp-003",
        organization_id: "org-medipulse-003",
        term: "Rx only: Software intended for use by trained medical professionals alongside standard diagnostic protocols.",
        rule_type: "required",
        preferred_alternative: undefined,
        case_sensitive: false,
        whole_word: false,
        rule_description: "Mandatory FDA device labeling disclosure.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 9.5,
      technical_complexity: 9.0,
      confidence_level: 8.8,
      tone_keywords: ["Clinical Rigor", "Patient Safety", "Peer-Reviewed", "HIPAA Compliant"]
    },
    assets: [
      { id: "asset-mp-01", organization_id: "org-medipulse-003", name: "Clinical Deep Blue", asset_type: "color", value: "#082F49", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "MediPulse Clinical Diagnostics",
      headline: "MediPulse AI Announces Landmark Diagnostic Hospital Deployment",
      contentType: "press_release",
      campaign: "Global Healthcare Innovation",
      targetAudience: "Chief Medical Officers & Radiologists",
      jurisdiction: "us_ftc",
      flaggedBody: `MediPulse is thrilled to announce our revolutionary healthcare AI that achieves a 100% cure rate for lung nodules and replaces doctors in hospital emergency rooms. Our miracle medical software diagnoses diseases without human error and eliminates all need for second opinions.`,
      compliantBody: `MediPulse announces the deployment of our FDA 510(k)-cleared AI diagnostic triage software across leading hospital networks. In clinical studies, MediPulse achieved 99.4% sensitivity in flagging critical pulmonary findings to assist radiologists. Rx only: Software intended for use by trained medical professionals alongside standard diagnostic protocols.`
    }
  },

  // 4. CyberShield X Federal Systems
  {
    workspace: {
      id: "org-cybershield-004",
      name: "CyberShield X Federal Systems",
      brand_name: "CyberShield X",
      slug: "cybershield",
      industry: "Defense Cybersecurity & Zero-Trust Infrastructure",
      description: "FIPS 140-3 validated zero-trust security orchestration and automated sovereign SOC defense platforms.",
      website_url: "https://cybershieldx.mil",
      primary_color: "#18181B",
      secondary_color: "#27272A",
      accent_color: "#EF4444",
      logo_url: "/assets/cybershield-logo.svg",
      members_count: 5
    },
    icon: "🛡️",
    badge: "Defense & Cyber",
    guidelines: [
      {
        id: "guide-cs-001",
        organization_id: "org-cybershield-004",
        title: "CyberShield X Federal Branding & Threat Attribution Policy v2.8",
        description: "Zero-trust terminology, NIST 800-53 standards, and prohibited absolute security warranties.",
        category: "cybersecurity_compliance",
        version: "2.8",
        status: "active",
        file_name: "CyberShieldX_NIST_Manual_v2.8.pdf",
        extracted_text: "CyberShield X enforces defense-in-depth engineering. Absolute security superlatives like 'unhackable', 'bulletproof', or '100% impenetrable' create false assurance and violate FTC truthfulness rules.",
        uploaded_at: "2026-11-08T12:00:00Z",
        chunks_count: 3
      }
    ],
    facts: [
      {
        id: "fact-cs-001",
        organization_id: "org-cybershield-004",
        title: "Cryptographic Module Validation",
        category: "Cryptographic Standards",
        approved_statement: "CyberShield X employs FIPS 140-3 Level 3 validated hardware security modules and ChaCha20-Poly1305 encryption.",
        supporting_evidence: "NIST Cryptographic Module Validation Program Certificate #4812",
        product_association: "CyberShield Enclave",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      },
      {
        id: "fact-cs-002",
        organization_id: "org-cybershield-004",
        title: "Automated Incident Containment Latency",
        category: "SLA Response",
        approved_statement: "Automated threat containment executes in under 250 milliseconds from initial anomaly detection.",
        supporting_evidence: "Mitre Engenuity ATT&CK Enterprise Evaluation Benchmark Report 2026",
        product_association: "CyberShield SOC",
        approval_status: "approved",
        last_verified_date: "2026-11-05"
      }
    ],
    terminology: [
      {
        id: "term-cs-001",
        organization_id: "org-cybershield-004",
        term: "unhackable",
        rule_type: "prohibited",
        preferred_alternative: "zero-trust architecture with defense-in-depth isolation",
        case_sensitive: false,
        whole_word: true,
        rule_description: "CISA and FTC prohibit unprovable absolute security claims.",
        contextual_exceptions: "None."
      },
      {
        id: "term-cs-002",
        organization_id: "org-cybershield-004",
        term: "bulletproof",
        rule_type: "prohibited",
        preferred_alternative: "resilient defense architecture",
        case_sensitive: false,
        whole_word: true,
        rule_description: "Colloquial hyperbole banned in federal procurement documentation.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 9.8,
      technical_complexity: 9.5,
      confidence_level: 9.2,
      tone_keywords: ["Zero Trust", "Sovereign Isolation", "Defense-in-Depth", "NIST Compliant"]
    },
    assets: [
      { id: "asset-cs-01", organization_id: "org-cybershield-004", name: "Tactical Charcoal", asset_type: "color", value: "#18181B", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "CyberShield Zero-Trust Defense",
      headline: "CyberShield X Unveils Next-Gen Sovereign Endpoint Protection",
      contentType: "press_release",
      campaign: "Federal Cyber Readiness",
      targetAudience: "Chief Information Security Officers (CISOs)",
      jurisdiction: "us_ftc",
      flaggedBody: `CyberShield X provides the world's only 100% impenetrable, unhackable endpoint protection. Our bulletproof cyber shield stops every adversary cold with military-grade AI magic that guarantees zero breaches ever occur.`,
      compliantBody: `CyberShield X introduces our zero-trust endpoint detection and automated response platform. Engineered in accordance with NIST 800-207 guidelines, CyberShield X enforces continuous cryptographic micro-segmentation and executes automated incident containment in under 250 milliseconds.`
    }
  },

  // 5. AeroSpace Dynamics & Avionics
  {
    workspace: {
      id: "org-aerospace-005",
      name: "AeroSpace Dynamics & Avionics Corp.",
      brand_name: "AeroSpace Dynamics",
      slug: "aerospace",
      industry: "Commercial Aviation & Orbital Satellite Telemetry",
      description: "AS9100D aerospace avionics, satellite constellation telemetry, and sub-orbital launch guidance systems.",
      website_url: "https://aerospacedynamics.com",
      primary_color: "#0F172A",
      secondary_color: "#1E293B",
      accent_color: "#38BDF8",
      logo_url: "/assets/aerospace-logo.svg",
      members_count: 6
    },
    icon: "🚀",
    badge: "Aerospace & Satellites",
    guidelines: [
      {
        id: "guide-as-001",
        organization_id: "org-aerospace-005",
        title: "AeroSpace Flight Reliability & DO-178C Communications Code v3.0",
        description: "AS9100D avionics reliability specifications and FAA safety compliance mandates.",
        category: "aviation_compliance",
        version: "3.0",
        status: "active",
        file_name: "AeroSpace_Avionics_Standard_v3.0.pdf",
        extracted_text: "AeroSpace Dynamics adheres strictly to FAA DO-178C Level A software rigor. Never publish claims stating zero-failure guarantee or unfailable propulsion.",
        uploaded_at: "2026-11-01T00:00:00Z",
        chunks_count: 3
      }
    ],
    facts: [
      {
        id: "fact-as-001",
        organization_id: "org-aerospace-005",
        title: "Avionics Flight Software Certification",
        category: "Avionics Certification",
        approved_statement: "Flight guidance software certified under FAA DO-178C Design Assurance Level A (DAL-A).",
        supporting_evidence: "FAA Aircraft Certification Service Type Inspection Authorization Report 2026",
        product_association: "Orbital Guidance",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      }
    ],
    terminology: [
      {
        id: "term-as-001",
        organization_id: "org-aerospace-005",
        term: "zero-failure guarantee",
        rule_type: "prohibited",
        preferred_alternative: "FAA DO-178C Level A certified flight reliability",
        case_sensitive: false,
        whole_word: true,
        rule_description: "Aerospace regulations strictly prohibit absolute zero-failure guarantees.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 9.6,
      technical_complexity: 9.8,
      confidence_level: 9.0,
      tone_keywords: ["Orbital Precision", "Aerospace Rigor", "AS9100D", "Safety Critical"]
    },
    assets: [
      { id: "asset-as-01", organization_id: "org-aerospace-005", name: "Deep Space Navy", asset_type: "color", value: "#0F172A", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "AeroSpace Orbital Telemetry",
      headline: "AeroSpace Dynamics Unveils Next-Gen Satellite Telemetry Array",
      contentType: "press_release",
      campaign: "Commercial Constellation Launch",
      targetAudience: "Satellite Operators & Defense Prime Contractors",
      jurisdiction: "global",
      flaggedBody: `AeroSpace Dynamics launches the cheapest rockets and avionics on Earth with a zero-failure guarantee and unfailable propulsion that never suffers mechanical degradation.`,
      compliantBody: `AeroSpace Dynamics announces our next-generation satellite telemetry array, flight-certified under FAA DO-178C Level A standards. Delivering 99.999% communications link availability, the system provides low-latency constellation control across orbital planes.`
    }
  },

  // 6. PulseEnergy CleanTech Grid
  {
    workspace: {
      id: "org-pulseenergy-006",
      name: "PulseEnergy CleanTech Grid Inc.",
      brand_name: "PulseEnergy",
      slug: "pulseenergy",
      industry: "Renewable Smart Grids & Carbon Ledger Intelligence",
      description: "ISO 14064 verified renewable energy storage dispatch and auditable carbon accounting ledgers.",
      website_url: "https://pulseenergygrid.com",
      primary_color: "#052E16",
      secondary_color: "#166534",
      accent_color: "#22C55E",
      logo_url: "/assets/pulseenergy-logo.svg",
      members_count: 4
    },
    icon: "⚡",
    badge: "CleanTech & ESG",
    guidelines: [
      {
        id: "guide-pe-001",
        organization_id: "org-pulseenergy-006",
        title: "PulseEnergy Environmental Claims & Anti-Greenwashing Standard v2.4",
        description: "EU Green Claims Directive and FTC Green Guides standards for carbon reduction claims.",
        category: "esg_compliance",
        version: "2.4",
        status: "active",
        file_name: "PulseEnergy_Green_Claims_Guide_v2.4.pdf",
        extracted_text: "All environmental claims must cite audited greenhouse gas reduction data. Prohibit unsubstantiated '100% green' or 'zero emissions without offsets' statements.",
        uploaded_at: "2026-11-10T11:00:00Z",
        chunks_count: 3
      }
    ],
    facts: [
      {
        id: "fact-pe-001",
        organization_id: "org-pulseenergy-006",
        title: "Managed Clean Energy Capacity",
        category: "Capacity Footprint",
        approved_statement: "PulseEnergy manages 14.2 Gigawatt-hours of utility-scale battery storage capacity.",
        supporting_evidence: "Interconnection Agreement Audits & Utility Commission Filings 2026",
        product_association: "GridDirect Storage",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      }
    ],
    terminology: [
      {
        id: "term-pe-001",
        organization_id: "org-pulseenergy-006",
        term: "zero emissions without trade-offs",
        rule_type: "prohibited",
        preferred_alternative: "independently audited carbon offset reduction",
        case_sensitive: false,
        whole_word: true,
        rule_description: "EU Green Claims Directive bans unqualified zero-emission claims.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 8.8,
      technical_complexity: 8.5,
      confidence_level: 9.0,
      tone_keywords: ["Verifiable CleanTech", "Audited ESG", "Grid Reliability", "ISO 14064"]
    },
    assets: [
      { id: "asset-pe-01", organization_id: "org-pulseenergy-006", name: "Forest Pine Green", asset_type: "color", value: "#052E16", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "PulseEnergy CleanTech Grid",
      headline: "PulseEnergy Unveils AI-Driven Smart Grid Virtual Power Plant",
      contentType: "press_release",
      campaign: "Clean Energy Transition 2026",
      targetAudience: "Municipal Utility Directors & ESG Officers",
      jurisdiction: "uk_asa",
      flaggedBody: `PulseEnergy guarantees our new smart battery grid eliminates 100% of carbon footprint overnight with zero emissions without trade-offs and endless free energy for all customers.`,
      compliantBody: `PulseEnergy announces the commissioning of a 14.2 GWh utility-scale virtual power plant. Utilizing algorithmic load-balancing, the system smooths peak grid demand and delivers auditable carbon offsets verified under ISO 14064 standards.`
    }
  },

  // 7. QuantumLogix Systems
  {
    workspace: {
      id: "org-quantumlogix-007",
      name: "QuantumLogix Systems Inc.",
      brand_name: "QuantumLogix",
      slug: "quantumlogix",
      industry: "Post-Quantum Cryptography & Quantum Computing",
      description: "NIST post-quantum standardized encryption algorithms and fault-tolerant quantum coprocessor runtimes.",
      website_url: "https://quantumlogix.tech",
      primary_color: "#1E1B4B",
      secondary_color: "#312E81",
      accent_color: "#818CF8",
      logo_url: "/assets/quantumlogix-logo.svg",
      members_count: 5
    },
    icon: "⚛️",
    badge: "Quantum & Cryptography",
    guidelines: [
      {
        id: "guide-ql-001",
        organization_id: "org-quantumlogix-007",
        title: "QuantumLogix Scientific Truth in Quantum Computing Standard v1.9",
        description: "NIST FIPS 203/204 lattice cryptography guidelines and quantum supremacy claim limits.",
        category: "quantum_compliance",
        version: "1.9",
        status: "active",
        file_name: "QuantumLogix_PQC_Guide_v1.9.pdf",
        extracted_text: "QuantumLogix develops NIST-standardized Post-Quantum Cryptography. Prohibit sensational claims of infinite computing or magical quantum supremacy.",
        uploaded_at: "2026-11-01T00:00:00Z",
        chunks_count: 3
      }
    ],
    facts: [
      {
        id: "fact-ql-001",
        organization_id: "org-quantumlogix-007",
        title: "NIST PQC Standardization Status",
        category: "Cryptographic Standards",
        approved_statement: "QuantumLogix algorithms fully comply with NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) standards.",
        supporting_evidence: "NIST Post-Quantum Cryptography Standardization Report 2026",
        product_association: "QuantumVault",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      }
    ],
    terminology: [
      {
        id: "term-ql-001",
        organization_id: "org-quantumlogix-007",
        term: "infinite computing power",
        rule_type: "prohibited",
        preferred_alternative: "exponential computational speedup on specific tensor algorithms",
        case_sensitive: false,
        whole_word: true,
        rule_description: "Scientific rigor prohibits claiming infinite computing power.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 9.8,
      technical_complexity: 9.9,
      confidence_level: 9.1,
      tone_keywords: ["Lattice Cryptography", "Quantum Fault-Tolerance", "NIST Standardized", "FIPS 203"]
    },
    assets: [
      { id: "asset-ql-01", organization_id: "org-quantumlogix-007", name: "Quantum Indigo", asset_type: "color", value: "#1E1B4B", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "QuantumLogix PQC Cryptography",
      headline: "QuantumLogix Deploys Commercial Post-Quantum Security Fabric",
      contentType: "press_release",
      campaign: "Post-Quantum Security Migration",
      targetAudience: "Chief Technology Officers & Cryptographers",
      jurisdiction: "global",
      flaggedBody: `QuantumLogix delivers infinite computing power with magical quantum supremacy that breaks all banking passwords instantly while creating unhackable quantum barriers.`,
      compliantBody: `QuantumLogix announces the general availability of our Post-Quantum Cryptographic Fabric. Built on NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) standards, the solution secures enterprise communications against harvest-now-decrypt-later quantum threats.`
    }
  },

  // 8. BioGenix Pharmaceuticals
  {
    workspace: {
      id: "org-biogenix-008",
      name: "BioGenix Molecular Therapeutics",
      brand_name: "BioGenix",
      slug: "biogenix",
      industry: "Biotech mRNA Oncology & Precision Therapeutics",
      description: "Clinical-stage biotechnology enterprise pioneering synthetic mRNA therapeutics for targeted oncology.",
      website_url: "https://biogenixtherapeutics.com",
      primary_color: "#14532D",
      secondary_color: "#15803D",
      accent_color: "#4ADE80",
      logo_url: "/assets/biogenix-logo.svg",
      members_count: 7
    },
    icon: "🧬",
    badge: "BioTech & Pharma",
    guidelines: [
      {
        id: "guide-bg-001",
        organization_id: "org-biogenix-008",
        title: "BioGenix FDA Clinical Trial Disclosure & Oncology Integrity Code v4.0",
        description: "Strict FDA prescription drug promotion compliance and anti-overpromising mandates.",
        category: "biotech_compliance",
        version: "4.0",
        status: "active",
        file_name: "BioGenix_FDA_Trial_Guide_v4.0.pdf",
        extracted_text: "BioGenix investigational therapies are currently undergoing Phase 3 clinical trials. Strictly prohibited: claiming a cure for cancer, guaranteed remission, or zero side effects.",
        uploaded_at: "2026-11-01T00:00:00Z",
        chunks_count: 4
      }
    ],
    facts: [
      {
        id: "fact-bg-001",
        organization_id: "org-biogenix-008",
        title: "Clinical Trial Phase Status",
        category: "Clinical Phase",
        approved_statement: "BioGenix BGX-402 is an investigational mRNA candidate currently evaluated in Phase 3 clinical trials (NCT05829140).",
        supporting_evidence: "ClinicalTrials.gov Registry Record NCT05829140",
        product_association: "BGX-402",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      }
    ],
    terminology: [
      {
        id: "term-bg-001",
        organization_id: "org-biogenix-008",
        term: "cure for cancer",
        rule_type: "prohibited",
        preferred_alternative: "investigational targeted oncological therapy",
        case_sensitive: false,
        whole_word: true,
        rule_description: "FDA and FTC prohibit claiming investigational drugs are a cure for cancer.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 9.7,
      technical_complexity: 9.8,
      confidence_level: 8.9,
      tone_keywords: ["Peer-Reviewed Science", "Phase 3 Rigor", "Patient Centricity", "cGMP Compliant"]
    },
    assets: [
      { id: "asset-bg-01", organization_id: "org-biogenix-008", name: "BioGenix Emerald", asset_type: "color", value: "#14532D", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "BioGenix mRNA Oncology",
      headline: "BioGenix Reports Phase 3 Oncology Trial Data",
      contentType: "press_release",
      campaign: "Phase 3 Clinical Trial Milestone",
      targetAudience: "Oncologists & Medical Research Institutes",
      jurisdiction: "us_ftc",
      flaggedBody: `BioGenix has discovered the ultimate miracle cure for cancer with our synthetic mRNA therapy that guarantees clinical remission and zero side effects for every patient.`,
      compliantBody: `BioGenix reports updated interim data from our ongoing Phase 3 clinical trial (NCT05829140) evaluating investigational candidate BGX-402 in patients with advanced solid tumors. The trial demonstrated a statistically significant improvement in progression-free survival.`
    }
  },

  // 9. Nexus Retail Omnichannel Systems
  {
    workspace: {
      id: "org-nexusretail-009",
      name: "Nexus Retail Omnichannel Systems",
      brand_name: "Nexus Retail",
      slug: "nexusretail",
      industry: "Omnichannel Commerce & Autonomous Checkout",
      description: "PCI-DSS Level 1 certified automated retail point-of-sale, inventory computer vision, and customer privacy enclaves.",
      website_url: "https://nexusretailsystems.com",
      primary_color: "#1C1917",
      secondary_color: "#292524",
      accent_color: "#F59E0B",
      logo_url: "/assets/nexus-logo.svg",
      members_count: 5
    },
    icon: "🛒",
    badge: "Retail & E-Commerce",
    guidelines: [
      {
        id: "guide-nr-001",
        organization_id: "org-nexusretail-009",
        title: "Nexus Retail Consumer Privacy & Truth in Advertising Code v2.5",
        description: "PCI-DSS Level 1 compliance, CCPA/CPRA consumer data protections, and pricing integrity.",
        category: "retail_compliance",
        version: "2.5",
        status: "active",
        file_name: "Nexus_Retail_CCPA_Manual_v2.5.pdf",
        extracted_text: "Nexus Retail ensures full compliance with consumer data privacy regulations. Prohibit tracking shoppers without consent or making unsupported cheapest POS claims.",
        uploaded_at: "2026-11-01T00:00:00Z",
        chunks_count: 3
      }
    ],
    facts: [
      {
        id: "fact-nr-001",
        organization_id: "org-nexusretail-009",
        title: "Storefront Point of Sale Reliability",
        category: "Uptime SLA",
        approved_statement: "Nexus Point-of-Sale maintains 99.98% availability across 12,000 retail storefronts.",
        supporting_evidence: "Q3 System Availability & Transaction Performance Audit 2026",
        product_association: "Nexus POS Core",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      }
    ],
    terminology: [
      {
        id: "term-nr-001",
        organization_id: "org-nexusretail-009",
        term: "tracks shoppers without consent",
        rule_type: "prohibited",
        preferred_alternative: "anonymous privacy-first spatial analytics",
        case_sensitive: false,
        whole_word: true,
        rule_description: "CCPA strictly forbids non-consensual biometric or customer tracking.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 8.5,
      technical_complexity: 8.0,
      confidence_level: 9.0,
      tone_keywords: ["Omnichannel Reliability", "CCPA Privacy", "PCI-DSS Level 1", "Frictionless"]
    },
    assets: [
      { id: "asset-nr-01", organization_id: "org-nexusretail-009", name: "Obsidian Slate", asset_type: "color", value: "#1C1917", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "Nexus Retail Omnichannel",
      headline: "Nexus Retail Deploys Autonomous Frictionless Checkout",
      contentType: "press_release",
      campaign: "Retail Transformation 2026",
      targetAudience: "Retail Executives & Store Operations",
      jurisdiction: "us_ftc",
      flaggedBody: `Nexus is the cheapest POS system in the world. We tracks shoppers without consent using facial scans to maximize retail profits with zero-cost checkout.`,
      compliantBody: `Nexus Retail announces the expansion of our autonomous checkout platform across 12,000 storefronts. Built on privacy-first spatial analytics, the system complies with CCPA and PCI-DSS Level 1 standards while delivering 99.98% point-of-sale transaction reliability.`
    }
  },

  // 10. AutoDrive Autonomous Vehicle AI
  {
    workspace: {
      id: "org-autodrive-010",
      name: "AutoDrive Mobility Technologies Inc.",
      brand_name: "AutoDrive",
      slug: "autodrive",
      industry: "Automotive Autonomous Driving & Fleet Telematics",
      description: "ISO 26262 ASIL-D functional safety certified SAE Level 4 autonomous vehicle perception software.",
      website_url: "https://autodrivemobility.com",
      primary_color: "#0F172A",
      secondary_color: "#1E293B",
      accent_color: "#E11D48",
      logo_url: "/assets/autodrive-logo.svg",
      members_count: 6
    },
    icon: "🚗",
    badge: "Automotive & AV AI",
    guidelines: [
      {
        id: "guide-ad-001",
        organization_id: "org-autodrive-010",
        title: "AutoDrive Vehicle Safety Claims & ISO 26262 Gating Manual v3.1",
        description: "NHTSA autonomous driving advertising guidelines and functional safety requirements.",
        category: "automotive_safety",
        version: "3.1",
        status: "active",
        file_name: "AutoDrive_Safety_Manual_v3.1.pdf",
        extracted_text: "AutoDrive Level 4 autonomous systems require clear boundary disclosure. Strictly prohibited: claims of 100% crash-proof safety, hands-free sleeping, or zero accidents ever.",
        uploaded_at: "2026-11-01T00:00:00Z",
        chunks_count: 4
      }
    ],
    facts: [
      {
        id: "fact-ad-001",
        organization_id: "org-autodrive-010",
        title: "Functional Safety Certification",
        category: "Safety Standard",
        approved_statement: "AutoDrive Pilot AI has achieved ISO 26262 ASIL-D functional safety certification from TUV Rheinland.",
        supporting_evidence: "TUV Rheinland Functional Safety Assessment Certificate #FS-2026-0941",
        product_association: "AutoDrive Pilot",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      }
    ],
    terminology: [
      {
        id: "term-ad-001",
        organization_id: "org-autodrive-010",
        term: "100% crash-proof",
        rule_type: "prohibited",
        preferred_alternative: "ISO 26262 ASIL-D certified fault-tolerant perception",
        case_sensitive: false,
        whole_word: true,
        rule_description: "NHTSA and FTC explicitly prohibit advertising vehicles as 100% crash-proof.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 9.5,
      technical_complexity: 9.2,
      confidence_level: 9.0,
      tone_keywords: ["ASIL-D Functional Safety", "Perception Rigor", "Fail-Operational", "ISO 26262"]
    },
    assets: [
      { id: "asset-ad-01", organization_id: "org-autodrive-010", name: "Midnight Chassis", asset_type: "color", value: "#0F172A", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "AutoDrive Level 4 Autonomous",
      headline: "AutoDrive Achieves Commercial Robotaxi Deployment Milestone",
      contentType: "press_release",
      campaign: "Autonomous Fleet Launch 2026",
      targetAudience: "Automotive OEMs & Transportation Regulators",
      jurisdiction: "us_ftc",
      flaggedBody: `Our 100% crash-proof autonomous self-driving car lets passengers sleep hands-free on the highway with zero accidents ever guaranteed in all weather conditions.`,
      compliantBody: `AutoDrive announces the commercial deployment of our SAE Level 4 autonomous vehicle software. Certified under ISO 26262 ASIL-D functional safety standards, the system operates with redundant multi-modal sensor fusion across geofenced urban operational design domains.`
    }
  },

  // 11. LuxVanguard Maison & Fine Horology
  {
    workspace: {
      id: "org-luxvanguard-011",
      name: "LuxVanguard Maison & Horlogerie",
      brand_name: "LuxVanguard",
      slug: "luxvanguard",
      industry: "Haute Horlogerie & Ethical Luxury Goods",
      description: "Geneva-crafted mechanical chronometers and ethically sourced high-jewelry collections.",
      website_url: "https://luxvanguard.ch",
      primary_color: "#18181B",
      secondary_color: "#27272A",
      accent_color: "#D4AF37",
      logo_url: "/assets/luxvanguard-logo.svg",
      members_count: 4
    },
    icon: "💎",
    badge: "Luxury & Horology",
    guidelines: [
      {
        id: "guide-lv-001",
        organization_id: "org-luxvanguard-011",
        title: "LuxVanguard Swiss Made Ordinance & Ethical Luxury Code v5.0",
        description: "Swiss Made legal criteria (Federal Council 232.119) and RJC conflict-free ethical gold standards.",
        category: "luxury_compliance",
        version: "5.0",
        status: "active",
        file_name: "LuxVanguard_Swiss_Made_Guide_v5.0.pdf",
        extracted_text: "LuxVanguard upholds Swiss horological tradition. Prohibit descriptions of mass manufacturing, synthetic imitation materials, or discount pricing language.",
        uploaded_at: "2026-11-01T00:00:00Z",
        chunks_count: 3
      }
    ],
    facts: [
      {
        id: "fact-lv-001",
        organization_id: "org-luxvanguard-011",
        title: "Swiss Made Certification",
        category: "Origin Standard",
        approved_statement: "Every LuxVanguard timepiece satisfies the Swiss Made Ordinance with 100% mechanical movement assembly in Geneva.",
        supporting_evidence: "Federation of the Swiss Watch Industry (FH) Registration #CH-9418",
        product_association: "All Calibres",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      }
    ],
    terminology: [
      {
        id: "term-lv-001",
        organization_id: "org-luxvanguard-011",
        term: "cheap luxury",
        rule_type: "prohibited",
        preferred_alternative: "accessible haute horlogerie craftsmanship",
        case_sensitive: false,
        whole_word: true,
        rule_description: "Maison brand guidelines strictly ban the word 'cheap'.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 9.9,
      technical_complexity: 8.8,
      confidence_level: 9.5,
      tone_keywords: ["Haute Horlogerie", "Geneva Handcrafted", "COSC Certified", "Ethical Gold"]
    },
    assets: [
      { id: "asset-lv-01", organization_id: "org-luxvanguard-011", name: "Royal Gold", asset_type: "color", value: "#D4AF37", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "LuxVanguard Fine Horology",
      headline: "LuxVanguard Unveils Grand Complication Tourbillon in Geneva",
      contentType: "press_release",
      campaign: "Watches & Wonders Geneva 2026",
      targetAudience: "Horology Collectors & Connoisseurs",
      jurisdiction: "global",
      flaggedBody: `LuxVanguard introduces our new cheap luxury mass manufactured gold watches featuring imitation diamond bezels for bargain hunters.`,
      compliantBody: `LuxVanguard presents the ChronoVanguard Tourbillon, hand-crafted in our Geneva manufacture in accordance with the Swiss Made Ordinance. Featuring a COSC-certified chronometer movement and 100% recycled 18K ethical gold, the creation celebrates three centuries of horological mastery.`
    }
  },

  // 12. Veritas Legal AI Technologies
  {
    workspace: {
      id: "org-veritaslegal-012",
      name: "Veritas Legal AI Technologies",
      brand_name: "Veritas Legal",
      slug: "veritaslegal",
      industry: "Enterprise Legal Tech & Privilege Enclaves",
      description: "ABA Rule 1.1/1.6 compliant contract analysis, citation verification, and litigation discovery enclaves.",
      website_url: "https://veritaslegal.ai",
      primary_color: "#1E293B",
      secondary_color: "#334155",
      accent_color: "#0EA5E9",
      logo_url: "/assets/veritas-logo.svg",
      members_count: 5
    },
    icon: "⚖️",
    badge: "LegalTech & Compliance",
    guidelines: [
      {
        id: "guide-vl-001",
        organization_id: "org-veritaslegal-012",
        title: "Veritas Legal Ethics & Unauthorized Practice of Law (UPL) Standard v3.4",
        description: "ABA Model Rules, state bar advertising guidelines, and attorney-client privilege protections.",
        category: "legal_compliance",
        version: "3.4",
        status: "active",
        file_name: "Veritas_Legal_Ethics_Standard_v3.4.pdf",
        extracted_text: "Veritas AI provides legal research and drafting assistance for licensed attorneys. Strictly prohibited: advertising that software replaces lawyers or guaranteeing courtroom wins.",
        uploaded_at: "2026-11-01T00:00:00Z",
        chunks_count: 3
      }
    ],
    facts: [
      {
        id: "fact-vl-001",
        organization_id: "org-veritaslegal-012",
        title: "Citation Validation Accuracy",
        category: "Citation Verification",
        approved_statement: "Veritas validates legal citations against Westlaw and Lexis databases with 99.2% verifiable accuracy.",
        supporting_evidence: "Stanford Legal Informatics Lab Independent Evaluation 2026",
        product_association: "Veritas BriefCheck",
        approval_status: "approved",
        last_verified_date: "2026-11-01"
      }
    ],
    terminology: [
      {
        id: "term-vl-001",
        organization_id: "org-veritaslegal-012",
        term: "replaces lawyers",
        rule_type: "prohibited",
        preferred_alternative: "augments legal professionals with verified case analysis",
        case_sensitive: false,
        whole_word: true,
        rule_description: "State bar unauthorized practice of law rules forbid claiming software replaces attorneys.",
        contextual_exceptions: "None."
      },
      {
        id: "term-vl-002",
        organization_id: "org-veritaslegal-012",
        term: "guaranteed courtroom win",
        rule_type: "prohibited",
        preferred_alternative: "statistically grounded litigation analytics",
        case_sensitive: false,
        whole_word: true,
        rule_description: "ABA Model Rule 7.1 strictly prohibits promising specific legal outcomes.",
        contextual_exceptions: "None."
      }
    ],
    tone: {
      formality_level: 9.8,
      technical_complexity: 9.6,
      confidence_level: 9.0,
      tone_keywords: ["Attorney-Client Enclave", "ABA Rule 1.6", "Privilege Protected", "Citation Grounded"]
    },
    assets: [
      { id: "asset-vl-01", organization_id: "org-veritaslegal-012", name: "Judicial Slate", asset_type: "color", value: "#1E293B", is_primary: true, status: "active", uploaded_at: "2026-11-01T00:00:00Z" }
    ],
    sampleDraft: {
      name: "Veritas Legal AI Privilege",
      headline: "Veritas Legal Unveils Court-Ready Citation Validation Engine",
      contentType: "press_release",
      campaign: "Legal Innovation 2026",
      targetAudience: "Law Firm Managing Partners & General Counsels",
      jurisdiction: "us_ftc",
      flaggedBody: `Veritas replaces lawyers completely and offers a guaranteed courtroom win with 100% infallible legal advice that eliminates all risk in corporate litigation.`,
      compliantBody: `Veritas Legal announces our court-ready brief verification platform. Designed to assist attorneys in accordance with ABA Model Rules, Veritas validates case law citations and flags precedent discrepancies with 99.2% verified accuracy inside a zero-retention privilege enclave.`
    }
  }
];

export const ALL_WORKSPACES: Organization[] = ALL_BRAND_BASES.map(b => b.workspace);
