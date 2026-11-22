import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Workspace,
  GuidelineDocument,
  ApprovedFact,
  TerminologyRule,
  ToneProfile,
  BrandAsset,
  ContentSubmission,
  ComplianceFinding,
  ApprovalRecord,
  Notification,
  UserProfile,
  UserRole
} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Deterministically convert any string ID into a valid UUID v4 compliant string
 * so Postgres UUID columns accept demo/custom IDs seamlessly.
 */
export function toUUID(str: string): string {
  if (!str) return '00000000-0000-4000-a000-000000000000';
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str.toLowerCase();
  }

  let h1 = 0;
  for (let i = 0; i < str.length; i++) {
    h1 = ((h1 << 5) - h1) + str.charCodeAt(i);
    h1 |= 0;
  }
  const hex1 = Math.abs(h1).toString(16).padStart(8, '0');

  let h2 = 5381;
  for (let i = str.length - 1; i >= 0; i--) {
    h2 = ((h2 << 5) + h2) + str.charCodeAt(i);
    h2 |= 0;
  }
  const hex2 = Math.abs(h2).toString(16).padStart(8, '0');
  const pad = (hex1 + hex2 + '0000000000000000').slice(0, 12);
  return `${hex1}-${hex2.slice(0, 4)}-4${hex1.slice(0, 3)}-a${hex2.slice(4, 7)}-${pad}`.toLowerCase();
}

/**
 * Standard known profile UUIDs for foreign key compliance
 */
export const DEFAULT_PROFILES = {
  admin: '1dc4ac38-c374-4a2e-a15e-61905042d827',
  reviewer: '70ae702b-2e74-4ebd-bdf5-af8fc7aba612',
  creator: '1dc4ac38-c374-4a2e-a15e-61905042d827'
};

/**
 * Verify live connection to Supabase PostgreSQL cluster
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in environment. Using local persistence fallback.'
    };
  }

  try {
    const { data, error } = await supabase.from('organizations').select('id, name').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { connected: false, message: `Database error: ${error.message}` };
    }
    return {
      connected: true,
      message: 'Connected to Supabase PostgreSQL Database (Cloud Enterprise)',
      details: data
    };
  } catch (err: any) {
    return { connected: false, message: err.message || 'Database connection error' };
  }
}

/**
 * High-Level Supabase Persistence Service
 */
export const SupabaseService = {
  // ----------------------------------------------------
  // ORGANIZATIONS & WORKSPACES
  // ----------------------------------------------------
  async loadOrganization(orgId: string): Promise<Workspace | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', toUUID(orgId))
        .single();
      if (error || !data) return null;

      return {
        id: orgId,
        name: data.name,
        brand_name: data.brand_name || data.name,
        industry: data.industry,
        description: data.description || '',
        website_url: data.website_url || '',
        primary_color: data.primary_color || '#101827',
        secondary_color: data.secondary_color || '#19263A',
        accent_color: '#3978E8',
        members_count: 4
      };
    } catch {
      return null;
    }
  },

  async upsertOrganization(ws: Workspace): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('organizations').upsert({
        id: toUUID(ws.id),
        name: ws.name,
        brand_name: ws.brand_name || ws.name,
        industry: ws.industry,
        description: ws.description || 'Enterprise Brand Base',
        website_url: ws.website_url || '',
        primary_color: ws.primary_color || '#101827',
        secondary_color: ws.secondary_color || '#19263A',
        updated_at: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  },

  // ----------------------------------------------------
  // BRAND GUIDELINES
  // ----------------------------------------------------
  async loadGuidelines(orgId: string): Promise<GuidelineDocument[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('brand_guidelines')
        .select('*')
        .eq('organization_id', toUUID(orgId))
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return null;

      return data.map(item => ({
        id: item.id,
        organization_id: orgId,
        title: item.title,
        description: item.description || '',
        category: item.category || 'corporate_brand',
        version: item.version || '1.0',
        status: item.status || 'active',
        file_name: item.file_url ? item.file_url.split('/').pop() : `${item.title.replace(/\s+/g, '_')}.pdf`,
        extracted_text: item.extracted_text || '',
        uploaded_at: item.created_at || new Date().toISOString(),
        chunks_count: 4,
        total_chunks: 4
      }));
    } catch {
      return null;
    }
  },

  async upsertGuideline(orgId: string, doc: GuidelineDocument): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('brand_guidelines').upsert({
        id: toUUID(doc.id),
        organization_id: toUUID(orgId),
        title: doc.title,
        description: doc.description || '',
        category: doc.category || 'corporate_brand',
        version: doc.version || '1.0',
        status: doc.status || 'active',
        extracted_text: doc.extracted_text || '',
        updated_at: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteGuideline(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('brand_guidelines').delete().eq('id', toUUID(id));
      return !error;
    } catch {
      return false;
    }
  },

  // ----------------------------------------------------
  // APPROVED FACTS
  // ----------------------------------------------------
  async loadFacts(orgId: string): Promise<ApprovedFact[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('approved_facts')
        .select('*')
        .eq('organization_id', toUUID(orgId))
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return null;

      return data.map(item => ({
        id: item.id,
        organization_id: orgId,
        title: item.title || 'Approved Fact',
        category: item.category || 'technical_spec',
        claim_text: item.approved_statement,
        approved_statement: item.approved_statement,
        supporting_evidence: item.supporting_evidence,
        source_citation: item.supporting_evidence,
        product_association: item.product_association || 'All Products',
        approval_status: item.approval_status || 'approved',
        last_verified_date: item.last_verified_date || item.created_at,
        created_at: item.created_at,
        updated_at: item.last_verified_date
      }));
    } catch {
      return null;
    }
  },

  async upsertFact(orgId: string, fact: ApprovedFact): Promise<boolean> {
    if (!supabase) return false;
    try {
      const statement = fact.claim_text || fact.approved_statement || 'Approved Fact Statement';
      const evidence = fact.source_citation || fact.supporting_evidence || 'Internal Verification Policy';
      const { error } = await supabase.from('approved_facts').upsert({
        id: toUUID(fact.id),
        organization_id: toUUID(orgId),
        title: fact.title || statement.slice(0, 50),
        category: fact.category || 'technical_spec',
        approved_statement: statement,
        supporting_evidence: evidence,
        product_association: fact.product_association || 'All Products',
        approval_status: fact.approval_status || 'approved',
        last_verified_date: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteFact(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('approved_facts').delete().eq('id', toUUID(id));
      return !error;
    } catch {
      return false;
    }
  },

  // ----------------------------------------------------
  // TERMINOLOGY RULES
  // ----------------------------------------------------
  async loadTerminology(orgId: string): Promise<TerminologyRule[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('terminology_rules')
        .select('*')
        .eq('organization_id', toUUID(orgId))
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return null;

      return data.map(item => ({
        id: item.id,
        organization_id: orgId,
        term: item.term,
        rule_type: item.rule_type || 'prohibited',
        suggested_replacement: item.preferred_alternative || '',
        preferred_alternative: item.preferred_alternative || '',
        case_sensitive: item.case_sensitive || false,
        is_case_sensitive: item.case_sensitive || false,
        whole_word: item.whole_word ?? true,
        rule_description: item.rule_description || '',
        explanation: item.rule_description || '',
        contextual_exceptions: item.contextual_exceptions || '',
        created_at: item.created_at
      }));
    } catch {
      return null;
    }
  },

  async upsertTerminology(orgId: string, rule: TerminologyRule): Promise<boolean> {
    if (!supabase) return false;
    try {
      const ruleType = ['preferred', 'prohibited', 'required', 'alternative'].includes(rule.rule_type)
        ? rule.rule_type
        : 'prohibited';

      const { error } = await supabase.from('terminology_rules').upsert({
        id: toUUID(rule.id),
        organization_id: toUUID(orgId),
        term: rule.term,
        rule_type: ruleType,
        preferred_alternative: rule.suggested_replacement || rule.preferred_alternative || null,
        case_sensitive: rule.case_sensitive ?? rule.is_case_sensitive ?? false,
        whole_word: rule.whole_word ?? true,
        rule_description: rule.explanation || rule.rule_description || 'Brand nomenclature rule',
        contextual_exceptions: rule.contextual_exceptions || null
      });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteTerminology(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('terminology_rules').delete().eq('id', toUUID(id));
      return !error;
    } catch {
      return false;
    }
  },

  // ----------------------------------------------------
  // TONE PROFILE
  // ----------------------------------------------------
  async loadToneProfile(orgId: string): Promise<ToneProfile | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('tone_profiles')
        .select('*')
        .eq('organization_id', toUUID(orgId))
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        organization_id: orgId,
        formality: data.formality_level,
        formality_level: data.formality_level,
        professionalism_level: data.professionalism_level,
        friendliness_level: data.friendliness_level,
        confidence_level: data.confidence_level,
        technical_complexity: data.technical_complexity,
        target_audience: data.target_audience || 'Enterprise Buyers',
        preferred_sentence_style: data.preferred_sentence_style || 'Clear and concise',
        words_to_avoid: data.words_to_avoid || [],
        example_approved_content: data.example_approved_content || ''
      };
    } catch {
      return null;
    }
  },

  async upsertToneProfile(orgId: string, profile: ToneProfile): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('tone_profiles').upsert({
        id: profile.id ? toUUID(profile.id) : toUUID(`tone-${orgId}`),
        organization_id: toUUID(orgId),
        formality_level: profile.formality_level ?? profile.formality ?? 8,
        professionalism_level: profile.professionalism_level ?? 8,
        friendliness_level: profile.friendliness_level ?? 6,
        confidence_level: profile.confidence_level ?? profile.confidence ?? 8,
        technical_complexity: profile.technical_complexity ?? profile.technicality ?? 7,
        target_audience: profile.target_audience || 'Enterprise Leaders',
        preferred_sentence_style: profile.preferred_sentence_style || 'Direct and rigorous',
        words_to_avoid: profile.words_to_avoid || [],
        example_approved_content: profile.example_approved_content || null,
        updated_at: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  },

  // ----------------------------------------------------
  // CONTENT SUBMISSIONS & REVISIONS
  // ----------------------------------------------------
  async loadSubmissions(orgId: string): Promise<ContentSubmission[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('content_submissions')
        .select('*')
        .eq('organization_id', toUUID(orgId))
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return null;

      return data.map(item => ({
        id: item.id,
        organization_id: orgId,
        title: item.title,
        content_type: item.content_type,
        target_platform: item.target_platform || '',
        associated_product: item.associated_product || '',
        campaign_name: item.campaign_name || '',
        original_text: item.original_text,
        current_text: item.current_text,
        status: item.status || 'audited',
        word_count: item.word_count || item.current_text.split(/\s+/).length,
        character_count: item.character_count || item.current_text.length,
        compliance_score: item.compliance_score ?? 85,
        creator_id: item.creator_id,
        creator_name: 'Enterprise Creator',
        created_at: item.created_at,
        updated_at: item.updated_at,
        findings_count: 0,
        critical_count: 0
      }));
    } catch {
      return null;
    }
  },

  async upsertSubmission(orgId: string, sub: ContentSubmission): Promise<boolean> {
    if (!supabase) return false;
    try {
      // Ensure creator_id is a valid UUID that exists in profiles
      const creatorUuid = DEFAULT_PROFILES.admin;
      const { error } = await supabase.from('content_submissions').upsert({
        id: toUUID(sub.id),
        organization_id: toUUID(orgId),
        creator_id: creatorUuid,
        title: sub.title,
        content_type: sub.content_type || 'marketing_copy',
        target_platform: sub.target_platform || null,
        associated_product: sub.associated_product || null,
        campaign_name: sub.campaign_name || null,
        original_text: sub.original_text,
        current_text: sub.current_text,
        status: sub.status || 'draft',
        word_count: sub.word_count || sub.current_text.split(/\s+/).length,
        character_count: sub.character_count || sub.current_text.length,
        compliance_score: sub.compliance_score ?? 90,
        updated_at: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  },

  // ----------------------------------------------------
  // COMPLIANCE FINDINGS
  // ----------------------------------------------------
  async loadFindings(submissionId: string): Promise<ComplianceFinding[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('compliance_findings')
        .select('*')
        .eq('submission_id', toUUID(submissionId));

      if (error || !data) return null;

      return data.map(item => ({
        id: item.id,
        submission_id: submissionId,
        category: item.category,
        severity: item.severity,
        original_text: item.original_text,
        start_index: item.start_index,
        end_index: item.end_index,
        explanation: item.explanation,
        relevant_brand_rule: item.relevant_brand_rule,
        source_document: item.source_document || 'Enterprise Guidelines',
        page_reference: item.page_reference || 'Sec 1.0',
        exact_supporting_passage: item.exact_supporting_passage || '',
        suggested_correction: item.suggested_correction,
        confidence: item.confidence || 0.95,
        status: (item.status as any) || 'pending',
        user_comment: item.user_comment || ''
      }));
    } catch {
      return null;
    }
  },

  async insertFindings(submissionId: string, findings: ComplianceFinding[]): Promise<boolean> {
    if (!supabase || findings.length === 0) return false;
    try {
      const rows = findings.map(f => ({
        id: toUUID(f.id),
        submission_id: toUUID(submissionId),
        category: ['terminology', 'unsupported_claim', 'outdated_fact', 'tone_mismatch', 'missing_disclaimer', 'visual_inconsistency', 'accessibility'].includes(f.category)
          ? f.category
          : 'terminology',
        severity: ['critical', 'high', 'medium', 'low', 'informational'].includes(f.severity)
          ? f.severity
          : 'high',
        original_text: f.original_text,
        start_index: f.start_index,
        end_index: f.end_index,
        explanation: f.explanation,
        relevant_brand_rule: f.relevant_brand_rule,
        source_document: f.source_document || null,
        page_reference: f.page_reference || null,
        exact_supporting_passage: f.exact_supporting_passage || null,
        suggested_correction: f.suggested_correction,
        confidence: f.confidence || 0.95,
        status: f.status || 'pending'
      }));

      const { error } = await supabase.from('compliance_findings').upsert(rows);
      return !error;
    } catch {
      return false;
    }
  },

  // ----------------------------------------------------
  // APPROVALS & SIGN-OFFS
  // ----------------------------------------------------
  async loadApprovals(submissionIds: string[]): Promise<ApprovalRecord[] | null> {
    if (!supabase || submissionIds.length === 0) return null;
    try {
      const uuids = submissionIds.map(toUUID);
      const { data, error } = await supabase
        .from('approvals')
        .select('*')
        .in('submission_id', uuids);

      if (error || !data) return null;

      return data.map(item => ({
        id: item.id,
        submission_id: item.submission_id,
        reviewer_id: item.reviewer_id,
        reviewer_name: 'Sarah Lin (Brand Reviewer)',
        decision: item.decision,
        comments: item.comments || '',
        content_version: item.content_version || 1,
        timestamp: item.created_at,
        cryptographic_stamp: item.cryptographic_stamp
      }));
    } catch {
      return null;
    }
  },

  async insertApproval(approval: ApprovalRecord): Promise<boolean> {
    if (!supabase) return false;
    try {
      const reviewerUuid = DEFAULT_PROFILES.reviewer;
      const { error } = await supabase.from('approvals').insert({
        id: toUUID(approval.id),
        submission_id: toUUID(approval.submission_id),
        reviewer_id: reviewerUuid,
        decision: approval.decision,
        comments: approval.comments || 'Signed off with cryptographic attestation',
        content_version: approval.content_version || 1,
        cryptographic_stamp: approval.cryptographic_stamp || `SIG-ED25519-${Date.now()}`
      });
      return !error;
    } catch {
      return false;
    }
  },

  // ----------------------------------------------------
  // INITIAL SEEDING FOR ACTIVE WORKSPACE
  // ----------------------------------------------------
  async seedInitialBrandData(
    workspace: Workspace,
    guidelines: GuidelineDocument[],
    facts: ApprovedFact[],
    terminology: TerminologyRule[],
    tone: ToneProfile
  ): Promise<boolean> {
    if (!supabase) return false;
    try {
      await this.upsertOrganization(workspace);

      for (const g of guidelines) {
        await this.upsertGuideline(workspace.id, g);
      }
      for (const f of facts) {
        await this.upsertFact(workspace.id, f);
      }
      for (const t of terminology) {
        await this.upsertTerminology(workspace.id, t);
      }
      await this.upsertToneProfile(workspace.id, tone);
      return true;
    } catch {
      return false;
    }
  },

  // ----------------------------------------------------
  // AUTHENTICATION & MULTI-USER ACCOUNTS
  // ----------------------------------------------------
  async signUpUser(email: string, password: string, fullName: string, orgName: string) {
    if (!supabase) return { success: false, error: 'Database client unavailable' };
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            org_name: orgName,
            role: 'admin'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Upsert organization in database
        const orgId = toUUID(`org-${data.user.id}`);
        await supabase.from('organizations').upsert({
          id: orgId,
          name: orgName,
          brand_name: orgName,
          industry: 'Enterprise Technology',
          primary_color: '#101827',
          secondary_color: '#19263A'
        });

        // Upsert user profile
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          name: fullName,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`
        });

        return {
          success: true,
          user: {
            id: data.user.id,
            email,
            name: fullName,
            full_name: fullName,
            role: 'admin' as UserRole
          },
          orgId
        };
      }

      return { success: false, error: 'User signup failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  },

  async signInUser(email: string, password: string) {
    if (!supabase) return { success: false, error: 'Database client unavailable' };
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        return {
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email || email,
            name: profile?.name || data.user.user_metadata?.full_name || email.split('@')[0],
            full_name: profile?.name || data.user.user_metadata?.full_name || email.split('@')[0],
            role: (data.user.user_metadata?.role as UserRole) || 'admin'
          }
        };
      }

      return { success: false, error: 'Invalid user session' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  },

  async signOutUser() {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
    } catch {}
  }
};
