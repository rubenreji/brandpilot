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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function safeFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = API_BASE ? `${API_BASE}${endpoint}` : `/api${endpoint.startsWith('/api') ? endpoint.slice(4) : endpoint}`;
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
      const res = await fetch(`${API_BASE}/visual/inspect`, {
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
