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

export const INITIAL_SUBMISSIONS: ContentSubmission[] = [];

export const INITIAL_FINDINGS: Record<string, ComplianceFinding[]> = {};

export const INITIAL_NOTIFICATIONS: Notification[] = [];

