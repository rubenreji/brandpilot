import {
  Workspace,
  GuidelineDocument,
  ApprovedFact,
  TerminologyRule,
  ToneProfile,
  BrandAsset,
  ContentSubmission,
  ComplianceFinding,
  AuditResultResponse,
  ApprovalRecord,
  AnalyticsSummary,
  Notification
} from './types';

function getApiBase(): string {
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost && process.env.NEXT_PUBLIC_API_URL?.includes('localhost')) {
      return '';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || '';
}

function resolveUrl(endpoint: string): string {
  const base = getApiBase();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!base) {
    return cleanEndpoint.startsWith('/api') ? cleanEndpoint : `/api${cleanEndpoint}`;
  }
  const cleanBase = base.replace(/\/$/, '');
  const pathPart = cleanEndpoint.startsWith('/api') ? cleanEndpoint.slice(4) : cleanEndpoint;
  return `${cleanBase}${pathPart}`;
}

async function safeFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = resolveUrl(endpoint);
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    // Zero-friction fallback to client store engine
    return null;
  }
}

export const BrandPilotAPI = {
  async getWorkspaces(): Promise<Workspace[] | null> {
    return safeFetch<Workspace[]>('/workspaces');
  },

  async getDashboardOverview(orgId: string) {
    return safeFetch<any>(`/workspaces/${orgId}/overview`);
  },

  async getGuidelines(orgId: string): Promise<GuidelineDocument[] | null> {
    return safeFetch<GuidelineDocument[]>(`/workspaces/${orgId}/guidelines`);
  },

  async getFacts(orgId: string): Promise<ApprovedFact[] | null> {
    return safeFetch<ApprovedFact[]>(`/workspaces/${orgId}/facts`);
  },

  async createFact(orgId: string, fact: Partial<ApprovedFact>): Promise<ApprovedFact | null> {
    return safeFetch<ApprovedFact>(`/workspaces/${orgId}/facts`, {
      method: 'POST',
      body: JSON.stringify(fact)
    });
  },

  async deleteFact(orgId: string, factId: string): Promise<boolean> {
    const res = await safeFetch<any>(`/workspaces/${orgId}/facts/${factId}`, {
      method: 'DELETE'
    });
    return !!res;
  },

  async getTerminology(orgId: string): Promise<TerminologyRule[] | null> {
    return safeFetch<TerminologyRule[]>(`/workspaces/${orgId}/terminology`);
  },

  async createTerminologyRule(orgId: string, rule: Partial<TerminologyRule>): Promise<TerminologyRule | null> {
    return safeFetch<TerminologyRule>(`/workspaces/${orgId}/terminology`, {
      method: 'POST',
      body: JSON.stringify(rule)
    });
  },

  async deleteTerminologyRule(orgId: string, ruleId: string): Promise<boolean> {
    const res = await safeFetch<any>(`/workspaces/${orgId}/terminology/${ruleId}`, {
      method: 'DELETE'
    });
    return !!res;
  },

  async getToneProfile(orgId: string): Promise<ToneProfile | null> {
    return safeFetch<ToneProfile>(`/workspaces/${orgId}/tone`);
  },

  async updateToneProfile(orgId: string, profile: ToneProfile): Promise<ToneProfile | null> {
    return safeFetch<ToneProfile>(`/workspaces/${orgId}/tone`, {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  },

  async getBrandAssets(orgId: string): Promise<BrandAsset[] | null> {
    return safeFetch<BrandAsset[]>(`/workspaces/${orgId}/assets`);
  },

  async getSubmissions(orgId: string): Promise<ContentSubmission[] | null> {
    return safeFetch<ContentSubmission[]>(`/workspaces/${orgId}/submissions`);
  },

  async getSubmission(submissionId: string): Promise<ContentSubmission | null> {
    return safeFetch<ContentSubmission>(`/submissions/${submissionId}`);
  },

  async getFindings(submissionId: string): Promise<ComplianceFinding[] | null> {
    return safeFetch<ComplianceFinding[]>(`/submissions/${submissionId}/findings`);
  },

  async runAudit(orgId: string, payload: {
    title: string;
    content_type: string;
    original_text: string;
    campaign_name?: string;
    target_audience?: string;
    check_categories?: string[];
  }): Promise<AuditResultResponse | null> {
    // Try Next.js serverless route (/api/audit) which runs on Vercel
    const res = await safeFetch<AuditResultResponse>('/audit', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res) return res;

    return safeFetch<AuditResultResponse>(`/workspaces/${orgId}/audit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async applySuggestion(findingId: string, payload: {
    custom_text?: string;
    accepted: boolean;
  }) {
    return safeFetch<any>(`/findings/${findingId}/apply-suggestion`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async submitForApproval(submissionId: string, payload: { note?: string }) {
    return safeFetch<any>(`/submissions/${submissionId}/submit-for-approval`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async reviewApproval(submissionId: string, payload: {
    decision: 'approved' | 'rejected' | 'changes_requested';
    comments?: string;
    reviewer_name?: string;
  }) {
    return safeFetch<any>(`/submissions/${submissionId}/review`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAnalytics(orgId: string): Promise<AnalyticsSummary | null> {
    return safeFetch<AnalyticsSummary>(`/workspaces/${orgId}/analytics`);
  },

  async getNotifications(orgId: string): Promise<Notification[] | null> {
    return safeFetch<Notification[]>(`/workspaces/${orgId}/notifications`);
  },

  async inspectVisual(formData: FormData) {
    try {
      const url = resolveUrl('/visual/inspect');
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async autoExtractBrandGuidelines(payload: {
    guideline_text?: string;
    source_title?: string;
    org_id?: string;
  }) {
    return safeFetch<any>('/knowledge/auto-extract', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async dispatchPublishing(payload: {
    submission_id: string;
    platform: string;
    clearance_stamp?: string;
    destination_channel?: string;
  }) {
    return safeFetch<any>('/publishing/dispatch', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async inSituLint(payload: {
    text: string;
    context?: string;
    colors?: string[];
    org_id?: string;
  }) {
    return safeFetch<any>('/insitu/lint', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async auditMultimodalSpeech(payload: {
    title: string;
    transcript: string;
    speaker_role?: string;
    media_type?: string;
    jurisdiction?: string;
    org_id?: string;
  }) {
    return safeFetch<any>('/multimodal/audit-speech', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async dispatchSlackAlert(payload: {
    submission_id: string;
    channel?: string;
    severity_level?: string;
    alert_type?: string;
  }) {
    return safeFetch<any>('/webhooks/slack-alert', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getPublicVerification(submissionId: string) {
    return safeFetch<any>(`/verify/${submissionId}`);
  },

  async scanCompetitorVulnerabilities(payload: {
    competitor_name: string;
    copy_text: string;
    campaign_type?: string;
    target_jurisdiction?: string;
    org_id?: string;
  }) {
    return safeFetch<any>('/intelligence/competitor-scan', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getEnterpriseStatus() {
    return safeFetch<any>('/system/enterprise-status');
  },

  async testWebhookPing(payload: {
    target_url: string;
    event_type?: string;
    secret_key?: string;
  }) {
    return safeFetch<any>('/developer/webhooks/test-ping', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async listApiKeys() {
    return safeFetch<any>('/developer/api-keys');
  },

  async generateApiKey(payload: {
    key_name: string;
    scopes?: string[];
    expires_in_days?: number;
  }) {
    return safeFetch<any>('/developer/api-keys/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getSubscriptionUsage() {
    return safeFetch<any>('/billing/subscription-usage');
  },

  // --- ADVANCED VISUAL COMPLIANCE & DESIGN INSPECTION ---
  async getVisualPresets() {
    return safeFetch<any>('/visual/presets');
  },

  async inspectVisualPreset(presetId: string, orgId?: string) {
    return safeFetch<any>('/visual/presets/inspect', {
      method: 'POST',
      body: JSON.stringify({ preset_id: presetId, org_id: orgId || 'org-auracloud-001' })
    });
  },

  async inspectVisualGraphic(formData: FormData, orgId?: string) {
    try {
      const targetOrg = orgId || 'org-auracloud-001';
      const url = resolveUrl(`/visual/inspect?org_id=${targetOrg}`);
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
};

