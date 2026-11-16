-- BrandPilot Database Schema Migration: 001_initial_schema.sql
-- Production PostgreSQL DDL with Row Level Security (RLS) & pgvector support

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    description TEXT,
    website_url VARCHAR(255),
    primary_color VARCHAR(16) DEFAULT '#101827',
    secondary_color VARCHAR(16) DEFAULT '#3978E8',
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (Users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Memberships (Role-Based Access Control)
CREATE TYPE user_role_enum AS ENUM ('admin', 'reviewer', 'creator');

CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL DEFAULT 'creator',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- 4. Brand Guidelines
CREATE TABLE brand_guidelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    version VARCHAR(32) DEFAULT '1.0',
    status VARCHAR(32) DEFAULT 'active',
    file_url TEXT,
    extracted_text TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Guideline Chunks (pgvector embeddings for RAG)
CREATE TABLE guideline_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guideline_id UUID NOT NULL REFERENCES brand_guidelines(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    page_number INT,
    section_header VARCHAR(255),
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_guideline_chunks_org ON guideline_chunks(organization_id);
CREATE INDEX idx_guideline_chunks_embedding ON guideline_chunks USING hnsw (embedding vector_cosine_ops);

-- 6. Approved Facts
CREATE TABLE approved_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    approved_statement TEXT NOT NULL,
    supporting_evidence TEXT NOT NULL,
    product_association VARCHAR(255) DEFAULT 'All Products',
    approval_status VARCHAR(50) DEFAULT 'approved',
    last_verified_date TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Terminology Rules
CREATE TYPE rule_type_enum AS ENUM ('preferred', 'prohibited', 'required', 'alternative');

CREATE TABLE terminology_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    term VARCHAR(255) NOT NULL,
    rule_type rule_type_enum NOT NULL,
    preferred_alternative VARCHAR(255),
    case_sensitive BOOLEAN DEFAULT FALSE,
    whole_word BOOLEAN DEFAULT TRUE,
    rule_description TEXT NOT NULL,
    contextual_exceptions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tone Profiles
CREATE TABLE tone_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    formality_level INT CHECK (formality_level BETWEEN 1 AND 10) DEFAULT 8,
    professionalism_level INT CHECK (professionalism_level BETWEEN 1 AND 10) DEFAULT 8,
    friendliness_level INT CHECK (friendliness_level BETWEEN 1 AND 10) DEFAULT 6,
    confidence_level INT CHECK (confidence_level BETWEEN 1 AND 10) DEFAULT 8,
    technical_complexity INT CHECK (technical_complexity BETWEEN 1 AND 10) DEFAULT 7,
    target_audience TEXT NOT NULL,
    preferred_sentence_style TEXT NOT NULL,
    words_to_avoid TEXT[] DEFAULT '{}',
    example_approved_content TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Brand Assets
CREATE TABLE brand_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    file_url TEXT,
    value VARCHAR(255),
    dimensions VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Content Submissions
CREATE TYPE content_status_enum AS ENUM (
    'draft', 'processing', 'audited', 'pending_review',
    'changes_requested', 'resubmitted', 'approved', 'rejected', 'withdrawn'
);

CREATE TABLE content_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES profiles(id),
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    target_platform VARCHAR(100),
    associated_product VARCHAR(255),
    campaign_name VARCHAR(255),
    original_text TEXT NOT NULL,
    current_text TEXT NOT NULL,
    status content_status_enum DEFAULT 'draft',
    word_count INT DEFAULT 0,
    character_count INT DEFAULT 0,
    compliance_score INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Compliance Findings (Audit Issues)
CREATE TYPE severity_enum AS ENUM ('critical', 'high', 'medium', 'low', 'informational');
CREATE TYPE issue_category_enum AS ENUM (
    'terminology', 'unsupported_claim', 'outdated_fact',
    'tone_mismatch', 'missing_disclaimer', 'visual_inconsistency', 'accessibility'
);

CREATE TABLE compliance_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES content_submissions(id) ON DELETE CASCADE,
    category issue_category_enum NOT NULL,
    severity severity_enum NOT NULL,
    original_text TEXT NOT NULL,
    start_index INT NOT NULL,
    end_index INT NOT NULL,
    explanation TEXT NOT NULL,
    relevant_brand_rule TEXT NOT NULL,
    source_document VARCHAR(255),
    page_reference VARCHAR(100),
    exact_supporting_passage TEXT,
    suggested_correction TEXT NOT NULL,
    confidence FLOAT DEFAULT 0.95,
    status VARCHAR(32) DEFAULT 'pending',
    user_comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Content Revisions
CREATE TABLE content_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES content_submissions(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    content_text TEXT NOT NULL,
    change_summary TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Approvals & Human Sign-off
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES content_submissions(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    decision VARCHAR(50) NOT NULL,
    comments TEXT,
    content_version INT NOT NULL,
    cryptographic_stamp VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE guideline_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approved_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminology_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tone_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Scoped access helper: User belongs to org
CREATE OR REPLACE FUNCTION user_belongs_to_org(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.organization_id = org_id
    AND memberships.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies Examples
CREATE POLICY "Users can access their organization data"
ON brand_guidelines FOR ALL
USING (user_belongs_to_org(organization_id));

CREATE POLICY "Users can access guideline chunks of their org"
ON guideline_chunks FOR ALL
USING (user_belongs_to_org(organization_id));

CREATE POLICY "Users can access submissions of their org"
ON content_submissions FOR ALL
USING (user_belongs_to_org(organization_id));
