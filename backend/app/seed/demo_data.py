from datetime import datetime
from app.models.schemas import (
    Organization, UserProfile, UserRole, BrandGuideline, GuidelineChunk,
    ApprovedFact, TerminologyRule, RuleType, ToneProfile, BrandAsset,
    ContentSubmission, ContentType, SubmissionStatus, ComplianceFinding,
    FindingSeverity, IssueCategory, SuggestionStatus, ApprovalRecord,
    ContentRevision, Notification, AuditLogEntry
)

DEMO_ORG_ID = "org-auracloud-001"

def get_demo_organization() -> Organization:
    return Organization(
        id=DEMO_ORG_ID,
        name="AuraCloud Technologies Inc.",
        brand_name="AuraCloud",
        industry="Enterprise Cloud Infrastructure & AI Platforms",
        description="AuraCloud delivers unified multi-cloud governance and automated infrastructure management for Fortune 500 enterprises.",
        website_url="https://auracloud.io",
        primary_color="#0F172A",
        secondary_color="#2563EB",
        logo_url="/assets/logo.svg",
        members_count=4
    )

def get_demo_users():
    return [
        UserProfile(
            id="user-admin-1",
            email="ruben@auracloud.io",
            name="Ruben John Reji",
            role=UserRole.ADMIN,
            avatar_url="https://api.dicebear.com/7.x/initials/svg?seed=Ruben"
        ),
        UserProfile(
            id="user-reviewer-1",
            email="sarah.lin@auracloud.io",
            name="Sarah Lin",
            role=UserRole.REVIEWER,
            avatar_url="https://api.dicebear.com/7.x/initials/svg?seed=Sarah"
        ),
        UserProfile(
            id="user-creator-1",
            email="marcus.vance@auracloud.io",
            name="Marcus Vance",
            role=UserRole.CREATOR,
            avatar_url="https://api.dicebear.com/7.x/initials/svg?seed=Marcus"
        )
    ]

def get_demo_guidelines():
    guideline = BrandGuideline(
        id="guide-001",
        organization_id=DEMO_ORG_ID,
        title="AuraCloud Global Brand & Communication Manual v2.4",
        description="Core identity, tone of voice, terminology standards, and claims substantiation guidelines.",
        category="corporate_brand",
        version="2.4",
        status="active",
        file_name="AuraCloud_Brand_Manual_v2.4.pdf",
        file_type="pdf",
        chunks_count=4
    )
    chunks = [
        GuidelineChunk(
            id="chunk-001",
            guideline_id="guide-001",
            page_number=4,
            section_header="1.2 Brand Positioning & Authority",
            content="AuraCloud positions itself as an enterprise-grade cloud governance authority. All communications must convey architectural rigor, stability, and verifiable evidence.",
            source_passage="Section 1.2: Brand Positioning: Every public communication must be supported by tested metrics. Do not resort to emotional hyperbole or sensationalized claims."
        ),
        GuidelineChunk(
            id="chunk-002",
            guideline_id="guide-001",
            page_number=9,
            section_header="2.1 Tone of Voice Standards",
            content="Our voice is confident, technical, and objective. We avoid colloquial buzzwords like 'magic', 'miracle', or 'foolproof'. We explain technological mechanisms clearly.",
            source_passage="Section 2.1: Tone of Voice: Avoid speculative hype and superficial promises. Use technical terminology accurately."
        ),
        GuidelineChunk(
            id="chunk-003",
            guideline_id="guide-001",
            page_number=15,
            section_header="3.4 Approved Nomenclature & Brand Rules",
            content="Always spell AuraCloud with capital 'A' and capital 'C'. Never refer to our capabilities as 'AI magic'. Use 'automated cloud orchestration' or 'predictive optimization'.",
            source_passage="Section 3.4: Nomenclature Rules: AuraCloud must always appear in camel-case. Derivatives such as 'Aura-Cloud' or 'auracloud' are prohibited."
        ),
        GuidelineChunk(
            id="chunk-004",
            guideline_id="guide-001",
            page_number=22,
            section_header="4.2 Claims & Legal Disclaimers",
            content="Never promise 100% accuracy or zero downtime without citing specific SLA agreements. All pricing comparisons require third-party audit verification.",
            source_passage="Section 4.2: Factual Claims Policy: Unsubstantiated market leadership claims ('No. 1', 'cheapest') expose the company to regulatory censure and are prohibited."
        )
    ]
    return [guideline], chunks

def get_demo_facts():
    return [
        ApprovedFact(
            id="fact-001",
            organization_id=DEMO_ORG_ID,
            title="Multi-Cloud Support Scope",
            category="Product Architecture",
            approved_statement="AuraCloud natively integrates across Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure environments.",
            supporting_evidence="Architecture Whitepaper 2026, Section 2; Multi-Cloud API SDK specification v3.1",
            product_association="AuraCloud Enterprise",
            approval_status="approved"
        ),
        ApprovedFact(
            id="fact-002",
            organization_id=DEMO_ORG_ID,
            title="Enterprise Service Level Agreement (SLA)",
            category="Reliability & Guarantees",
            approved_statement="AuraCloud guarantees 99.95% monthly infrastructure orchestration uptime under Enterprise Master Services Agreements.",
            supporting_evidence="Enterprise Customer Agreement Terms of Service, Schedule B (SLA Commitments)",
            product_association="AuraCloud Enterprise",
            approval_status="approved"
        ),
        ApprovedFact(
            id="fact-003",
            organization_id=DEMO_ORG_ID,
            title="Security & Compliance Certifications",
            category="Security & Compliance",
            approved_statement="AuraCloud has achieved SOC 2 Type II attestation, ISO/IEC 27001:2022 certification, and adheres to GDPR data privacy regulations.",
            supporting_evidence="Third-party audit report by Coalfire Systems (issued January 2026)",
            product_association="All Products",
            approval_status="approved"
        ),
        ApprovedFact(
            id="fact-004",
            organization_id=DEMO_ORG_ID,
            title="Starting Price Point",
            category="Pricing & Licensing",
            approved_statement="AuraCloud Professional tier starts at $49 per managed node per month, with annual commitment volume discounts available.",
            supporting_evidence="Approved Q4 2026 Enterprise Price Book signed by Chief Revenue Officer",
            product_association="AuraCloud Professional",
            approval_status="approved"
        )
    ]

def get_demo_terminology():
    return [
        TerminologyRule(
            id="term-001",
            organization_id=DEMO_ORG_ID,
            term="AI magic",
            rule_type=RuleType.PROHIBITED,
            preferred_alternative="intelligent automated orchestration",
            case_sensitive=False,
            whole_word=True,
            rule_description="The term 'AI magic' trivializes our engineering rigor and sounds unscientific to enterprise IT buyers.",
            contextual_exceptions="Never permitted in external collateral."
        ),
        TerminologyRule(
            id="term-002",
            organization_id=DEMO_ORG_ID,
            term="India's No. 1",
            rule_type=RuleType.PROHIBITED,
            preferred_alternative="leading enterprise cloud platform",
            case_sensitive=False,
            whole_word=True,
            rule_description="Rankings require audited analyst verification (Gartner/IDC) with active date citation.",
            contextual_exceptions="Permitted only when citing official Gartner Magic Quadrant report."
        ),
        TerminologyRule(
            id="term-003",
            organization_id=DEMO_ORG_ID,
            term="100% accuracy",
            rule_type=RuleType.PROHIBITED,
            preferred_alternative="high-precision automated verification",
            case_sensitive=False,
            whole_word=True,
            rule_description="Absolute performance claims are legally vulnerable and statistically unrealistic in distributed systems.",
            contextual_exceptions="None."
        ),
        TerminologyRule(
            id="term-004",
            organization_id=DEMO_ORG_ID,
            term="cheapest",
            rule_type=RuleType.PROHIBITED,
            preferred_alternative="cost-effective enterprise solution",
            case_sensitive=False,
            whole_word=True,
            rule_description="Comparative pricing claims without published competitive benchmarking invite regulatory scrutiny.",
            contextual_exceptions="None."
        ),
        TerminologyRule(
            id="term-005",
            organization_id=DEMO_ORG_ID,
            term="auracloud",
            rule_type=RuleType.PREFERRED,
            preferred_alternative="AuraCloud",
            case_sensitive=True,
            whole_word=True,
            rule_description="Official brand name capitalization rule: capital 'A', capital 'C'.",
            contextual_exceptions="Permitted in CLI package names (e.g. npm install auracloud)."
        ),
        TerminologyRule(
            id="term-006",
            organization_id=DEMO_ORG_ID,
            term="Results may vary depending on cloud workload configuration.",
            rule_type=RuleType.REQUIRED,
            preferred_alternative=None,
            case_sensitive=False,
            whole_word=False,
            rule_description="Mandatory disclaimer required on any marketing assets showcasing performance benchmarks.",
            contextual_exceptions="Not required on short social media cards under 140 characters."
        )
    ]

def get_demo_tone():
    return ToneProfile(
        id="tone-001",
        organization_id=DEMO_ORG_ID,
        formality_level=8,
        professionalism_level=9,
        friendliness_level=6,
        confidence_level=8,
        technical_complexity=7,
        target_audience="Enterprise CIOs, Cloud Architects, and Infrastructure Engineers",
        preferred_sentence_style="Precise, active-voice statements grounded in technical mechanics and verifiable operational outcomes.",
        words_to_avoid=["cheap", "magic", "miracle", "revolutionary", "flawless", "100% guaranteed"],
        example_approved_content="AuraCloud delivers unified multi-cloud governance, reducing infrastructure drift and enforcing security compliance across distributed enterprise clusters."
    )

def get_demo_assets():
    return [
        BrandAsset(
            id="asset-001",
            organization_id=DEMO_ORG_ID,
            name="Official Primary Logo (Dark)",
            asset_type="logo_primary",
            file_url="/assets/logo-dark.svg",
            value="#0F172A",
            dimensions="512x128 px",
            is_primary=True,
            status="active"
        ),
        BrandAsset(
            id="asset-002",
            organization_id=DEMO_ORG_ID,
            name="Official Primary Logo (White)",
            asset_type="logo_secondary",
            file_url="/assets/logo-white.svg",
            value="#FFFFFF",
            dimensions="512x128 px",
            is_primary=False,
            status="active"
        ),
        BrandAsset(
            id="asset-003",
            organization_id=DEMO_ORG_ID,
            name="Brand Primary Navy",
            asset_type="color_palette",
            value="#0F172A",
            dimensions="RGB(15, 23, 42)",
            is_primary=True,
            status="active"
        ),
        BrandAsset(
            id="asset-004",
            organization_id=DEMO_ORG_ID,
            name="Brand Accent Blue",
            asset_type="color_palette",
            value="#2563EB",
            dimensions="RGB(37, 99, 235)",
            is_primary=False,
            status="active"
        ),
        BrandAsset(
            id="asset-005",
            organization_id=DEMO_ORG_ID,
            name="Brand Sky Cyan",
            asset_type="color_palette",
            value="#38BDF8",
            dimensions="RGB(56, 189, 248)",
            is_primary=False,
            status="active"
        )
    ]

def get_demo_submissions():
    # 1. Non-compliant draft ready for demonstration
    sub_flagged = ContentSubmission(
        id="sub-demo-flagged",
        organization_id=DEMO_ORG_ID,
        title="Q4 Product Announcement — Press Release Draft",
        content_type=ContentType.PRESS_RELEASE,
        target_platform="Corporate Newsroom & PR Newswire",
        associated_product="AuraCloud Enterprise",
        campaign_name="Q4 Enterprise Scaling",
        original_text="We are thrilled to announce that AuraCloud is India's No. 1 AI cloud company. Our revolutionary AI magic guarantees 100% accuracy and is the cheapest solution available on the market today. Join thousands of developers who trust auracloud without hesitation.",
        current_text="We are thrilled to announce that AuraCloud is India's No. 1 AI cloud company. Our revolutionary AI magic guarantees 100% accuracy and is the cheapest solution available on the market today. Join thousands of developers who trust auracloud without hesitation.",
        status=SubmissionStatus.AUDITED,
        word_count=35,
        character_count=248,
        compliance_score=34,
        creator_id="user-creator-1",
        creator_name="Marcus Vance",
        findings_count=5,
        critical_count=2
    )

    # 2. Fully compliant approved submission
    sub_approved = ContentSubmission(
        id="sub-demo-approved",
        organization_id=DEMO_ORG_ID,
        title="Multi-Cloud Enterprise Security Architecture Brief",
        content_type=ContentType.MARKETING_COPY,
        target_platform="Corporate Blog & LinkedIn",
        associated_product="AuraCloud Enterprise",
        campaign_name="Infrastructure Security Series",
        original_text="AuraCloud provides unified multi-cloud governance across AWS, Google Cloud Platform, and Microsoft Azure. Backed by our 99.95% monthly uptime SLA, AuraCloud enables engineering teams to deploy compliant infrastructure securely and with high reliability.",
        current_text="AuraCloud provides unified multi-cloud governance across AWS, Google Cloud Platform, and Microsoft Azure. Backed by our 99.95% monthly uptime SLA, AuraCloud enables engineering teams to deploy compliant infrastructure securely and with high reliability.",
        status=SubmissionStatus.APPROVED,
        word_count=32,
        character_count=264,
        compliance_score=100,
        creator_id="user-creator-1",
        creator_name="Marcus Vance",
        findings_count=0,
        critical_count=0
    )

    return [sub_flagged, sub_approved]

def get_demo_findings(submission_id: str):
    return [
        ComplianceFinding(
            id="find-001",
            submission_id=submission_id,
            category=IssueCategory.UNSUPPORTED_CLAIM,
            severity=FindingSeverity.HIGH,
            original_text="India's No. 1",
            start_index=45,
            end_index=58,
            explanation="Unsupported market leadership ranking. Market position claims must cite dated third-party analyst recognition (e.g. Gartner, IDC).",
            relevant_brand_rule="Factual Claims Policy 4.2: Prohibited Market Superlatives",
            source_document="AuraCloud Global Brand & Communication Manual v2.4",
            page_reference="Page 22, Section 4.2",
            exact_supporting_passage="Section 4.2: Factual Claims Policy: Unsubstantiated market leadership claims ('No. 1', 'cheapest') expose the company to regulatory censure and are prohibited.",
            suggested_correction="a leading enterprise cloud platform",
            confidence=0.98,
            status=SuggestionStatus.PENDING
        ),
        ComplianceFinding(
            id="find-002",
            submission_id=submission_id,
            category=IssueCategory.TERMINOLOGY,
            severity=FindingSeverity.HIGH,
            original_text="AI magic",
            start_index=93,
            end_index=101,
            explanation="The phrase 'AI magic' is explicitly prohibited. It trivializes enterprise software engineering and violates brand voice standards.",
            relevant_brand_rule="Terminology Policy: Prohibited Term 'AI magic'",
            source_document="AuraCloud Global Brand & Communication Manual v2.4",
            page_reference="Page 15, Section 3.4",
            exact_supporting_passage="Section 3.4: Nomenclature Rules: Never refer to our capabilities as 'AI magic'. Use 'automated cloud orchestration' or 'predictive optimization'.",
            suggested_correction="intelligent automated orchestration",
            confidence=1.0,
            status=SuggestionStatus.PENDING
        ),
        ComplianceFinding(
            id="find-003",
            submission_id=submission_id,
            category=IssueCategory.UNSUPPORTED_CLAIM,
            severity=FindingSeverity.CRITICAL,
            original_text="guarantees 100% accuracy",
            start_index=102,
            end_index=126,
            explanation="Absolute performance guarantee. Legally prohibited under our compliance guidelines without qualified warranty limits and SLA bounds.",
            relevant_brand_rule="Legal Compliance Standard: Prohibited Absolute Guarantees",
            source_document="AuraCloud Global Brand & Communication Manual v2.4",
            page_reference="Page 22, Section 4.2",
            exact_supporting_passage="Section 4.2: Never state absolute guarantees, unsupported rankings, or exaggerated superlatives. All product descriptions must reflect verifiable specifications.",
            suggested_correction="delivers high-reliability automated verification",
            confidence=0.99,
            status=SuggestionStatus.PENDING
        ),
        ComplianceFinding(
            id="find-004",
            submission_id=submission_id,
            category=IssueCategory.UNSUPPORTED_CLAIM,
            severity=FindingSeverity.CRITICAL,
            original_text="cheapest solution available",
            start_index=138,
            end_index=165,
            explanation="Unsubstantiated comparative pricing claim. Price superlatives require a defined competitor benchmark and active pricing audit.",
            relevant_brand_rule="Factual Claims Policy 4.2: Comparative Pricing",
            source_document="AuraCloud Global Brand & Communication Manual v2.4",
            page_reference="Page 22, Section 4.2",
            exact_supporting_passage="Section 4.2: Comparative pricing claims ('cheapest') without published competitive benchmarking invite regulatory scrutiny.",
            suggested_correction="cost-effective enterprise solution",
            confidence=0.97,
            status=SuggestionStatus.PENDING
        ),
        ComplianceFinding(
            id="find-005",
            submission_id=submission_id,
            category=IssueCategory.TERMINOLOGY,
            severity=FindingSeverity.MEDIUM,
            original_text="auracloud",
            start_index=226,
            end_index=235,
            explanation="Incorrect brand capitalization. AuraCloud must always be capitalized with capital 'A' and capital 'C'.",
            relevant_brand_rule="Brand Nomenclature Policy 3.4: Capitalization Standard",
            source_document="AuraCloud Global Brand & Communication Manual v2.4",
            page_reference="Page 15, Section 3.4",
            exact_supporting_passage="Section 3.4: Nomenclature Rules: AuraCloud must always appear in camel-case. Derivatives such as 'auracloud' are prohibited.",
            suggested_correction="AuraCloud",
            confidence=1.0,
            status=SuggestionStatus.PENDING
        )
    ]

def get_all_demo_organizations():
    return [
        get_demo_organization(),
        Organization(
            id="org-fintrust-002",
            name="FinTrust Wealth Management LLC",
            brand_name="FinTrust",
            industry="Global Investment Banking & Wealth Management",
            description="SEC-registered algorithmic asset management and quantitative treasury solutions.",
            website_url="https://fintrustwealth.com",
            primary_color="#0B192C",
            secondary_color="#1E3E62",
            members_count=8
        ),
        Organization(
            id="org-medipulse-003",
            name="MediPulse Health AI Systems",
            brand_name="MediPulse",
            industry="Clinical AI Diagnostics & HealthTech",
            description="FDA-cleared medical image analysis and automated clinical workflow intelligence.",
            website_url="https://medipulsehealth.com",
            primary_color="#082F49",
            secondary_color="#0369A1",
            members_count=6
        ),
        Organization(
            id="org-cybershield-004",
            name="CyberShield X Federal Systems",
            brand_name="CyberShield X",
            industry="Defense Cybersecurity & Zero-Trust Infrastructure",
            description="FIPS 140-3 validated zero-trust security orchestration and sovereign SOC defense.",
            website_url="https://cybershieldx.mil",
            primary_color="#18181B",
            secondary_color="#27272A",
            members_count=5
        ),
        Organization(
            id="org-aerospace-005",
            name="AeroSpace Dynamics & Avionics Corp.",
            brand_name="AeroSpace Dynamics",
            industry="Commercial Aviation & Orbital Satellite Telemetry",
            description="AS9100D aerospace avionics, satellite constellation telemetry, and sub-orbital launch guidance.",
            website_url="https://aerospacedynamics.com",
            primary_color="#0F172A",
            secondary_color="#1E293B",
            members_count=6
        ),
        Organization(
            id="org-pulseenergy-006",
            name="PulseEnergy CleanTech Grid Inc.",
            brand_name="PulseEnergy",
            industry="Renewable Smart Grids & Carbon Ledger Intelligence",
            description="ISO 14064 verified renewable energy storage dispatch and auditable carbon accounting.",
            website_url="https://pulseenergygrid.com",
            primary_color="#052E16",
            secondary_color="#166534",
            members_count=4
        ),
        Organization(
            id="org-quantumlogix-007",
            name="QuantumLogix Systems Inc.",
            brand_name="QuantumLogix",
            industry="Post-Quantum Cryptography & Quantum Computing",
            description="NIST post-quantum standardized encryption algorithms and fault-tolerant coprocessor runtimes.",
            website_url="https://quantumlogix.tech",
            primary_color="#1E1B4B",
            secondary_color="#312E81",
            members_count=5
        ),
        Organization(
            id="org-biogenix-008",
            name="BioGenix Molecular Therapeutics",
            brand_name="BioGenix",
            industry="Biotech mRNA Oncology & Precision Therapeutics",
            description="Clinical-stage biotechnology enterprise pioneering synthetic mRNA therapeutics.",
            website_url="https://biogenixtherapeutics.com",
            primary_color="#14532D",
            secondary_color="#15803D",
            members_count=7
        ),
        Organization(
            id="org-nexusretail-009",
            name="Nexus Retail Omnichannel Systems",
            brand_name="Nexus Retail",
            industry="Omnichannel Commerce & Autonomous Checkout",
            description="PCI-DSS Level 1 certified automated retail point-of-sale and privacy enclaves.",
            website_url="https://nexusretailsystems.com",
            primary_color="#1C1917",
            secondary_color="#292524",
            members_count=5
        ),
        Organization(
            id="org-autodrive-010",
            name="AutoDrive Mobility Technologies Inc.",
            brand_name="AutoDrive",
            industry="Automotive Autonomous Driving & Fleet Telematics",
            description="ISO 26262 ASIL-D functional safety certified SAE Level 4 autonomous vehicle software.",
            website_url="https://autodrivemobility.com",
            primary_color="#0F172A",
            secondary_color="#1E293B",
            members_count=6
        ),
        Organization(
            id="org-luxvanguard-011",
            name="LuxVanguard Maison & Horlogerie",
            brand_name="LuxVanguard",
            industry="Haute Horlogerie & Ethical Luxury Goods",
            description="Geneva-crafted mechanical chronometers and ethically sourced high-jewelry collections.",
            website_url="https://luxvanguard.ch",
            primary_color="#18181B",
            secondary_color="#27272A",
            members_count=4
        ),
        Organization(
            id="org-veritaslegal-012",
            name="Veritas Legal AI Technologies",
            brand_name="Veritas Legal",
            industry="Enterprise Legal Tech & Privilege Enclaves",
            description="ABA Rule 1.1/1.6 compliant contract analysis, citation verification, and litigation discovery.",
            website_url="https://veritaslegal.ai",
            primary_color="#1E293B",
            secondary_color="#334155",
            members_count=5
        )
    ]
