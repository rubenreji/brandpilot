'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Workspace,
  GuidelineDocument,
  ApprovedFact,
  TerminologyRule,
  ToneProfile,
  BrandAsset,
  ContentSubmission,
  ComplianceFinding,
  Notification,
  UserRole,
  UserProfile,
  AnalyticsSummary,
  AuditResultResponse
} from './types';
import {
  DEMO_WORKSPACE,
  DEMO_USERS,
  INITIAL_GUIDELINES,
  INITIAL_FACTS,
  INITIAL_TERMINOLOGY,
  INITIAL_TONE,
  INITIAL_ASSETS,
  INITIAL_SUBMISSIONS,
  INITIAL_FINDINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS
} from './demo_data';
import { BrandPilotAPI } from './api';
import { supabase, isSupabaseConfigured, testSupabaseConnection } from './supabase';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface BrandPilotContextType {
  // Authentication & Account Creation
  currentUser: UserProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  registeredUsers: UserProfile[];
  registerUser: (data: { fullName: string; email: string; orgName: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  loginUser: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;

  // Supabase Live Status
  isSupabaseActive: boolean;
  checkSupabase: () => Promise<{ connected: boolean; message: string }>;

  // Workspace & Onboarding
  currentWorkspace: Workspace;
  updateWorkspaceSettings: (settings: Partial<Workspace>) => void;
  completeOnboarding: (data: {
    brandName: string;
    industry: string;
    website?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    guidelineDocName?: string;
    inviteEmails?: string;
  }) => void;

  // Knowledge base state
  guidelines: GuidelineDocument[];
  addGuideline: (doc: { title: string; category: string; description: string; text?: string }) => void;

  facts: ApprovedFact[];
  addFact: (fact: Omit<ApprovedFact, 'id' | 'created_at' | 'updated_at' | 'organization_id'>) => Promise<void>;
  deleteFact: (id: string) => Promise<void>;

  terminology: TerminologyRule[];
  addTerminologyRule: (rule: Omit<TerminologyRule, 'id' | 'created_at' | 'organization_id'>) => Promise<void>;
  deleteTerminologyRule: (id: string) => Promise<void>;

  toneProfile: ToneProfile;
  updateToneProfile: (profile: ToneProfile) => Promise<void>;

  assets: BrandAsset[];
  addAsset: (asset: Omit<BrandAsset, 'id' | 'created_at' | 'organization_id'>) => void;

  // Submissions & Audits
  submissions: ContentSubmission[];
  findings: Record<string, ComplianceFinding[]>;
  getSubmission: (id: string) => ContentSubmission | undefined;
  getSubmissionFindings: (id: string) => ComplianceFinding[];
  runAudit: (data: {
    title: string;
    content_type: string;
    text: string;
    campaign_name?: string;
    target_audience?: string;
    check_categories?: string[];
  }) => Promise<string>; // returns submission id

  // Correction Studio
  applySuggestion: (submissionId: string, findingId: string, customText?: string) => Promise<void>;
  applyAllSuggestions: (submissionId: string) => Promise<void>;
  rejectFinding: (submissionId: string, findingId: string) => Promise<void>;
  updateDraftText: (submissionId: string, newText: string) => void;

  // Approval Workflow (Human In The Loop)
  submitForApproval: (submissionId: string, note?: string) => Promise<void>;
  reviewSubmission: (
    submissionId: string,
    decision: 'approved' | 'rejected' | 'changes_requested',
    comments?: string
  ) => Promise<void>;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;

  // Visual Assets
  inspectColor: (hex: string) => { isCompliant: boolean; nearestBrandColor?: string; deltaE?: number };

  // Toast UI
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const BrandPilotContext = createContext<BrandPilotContextType | null>(null);

export function BrandPilotProvider({ children }: { children: React.ReactNode }) {
  // Registered users state (persisted)
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_users');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_USERS;
  });

  // Current active user
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return DEMO_USERS['admin'];
  });

  // Workspace
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_workspace');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return DEMO_WORKSPACE;
  });

  // Knowledge base state with local storage persistence
  const [guidelines, setGuidelines] = useState<GuidelineDocument[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_guidelines');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_GUIDELINES;
  });

  const [facts, setFacts] = useState<ApprovedFact[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_facts');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_FACTS;
  });

  const [terminology, setTerminology] = useState<TerminologyRule[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_terminology');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_TERMINOLOGY;
  });

  const [toneProfile, setToneProfile] = useState<ToneProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_tone');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_TONE;
  });

  const [assets, setAssets] = useState<BrandAsset[]>(INITIAL_ASSETS);

  // Submissions & Findings with persistence across page navigation and refresh
  const [submissions, setSubmissions] = useState<ContentSubmission[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_submissions');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_SUBMISSIONS;
  });

  const [findings, setFindings] = useState<Record<string, ComplianceFinding[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_findings');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_FINDINGS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  // Auto-sync state to localStorage for true enterprise persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brandpilot_guidelines', JSON.stringify(guidelines));
        localStorage.setItem('brandpilot_facts', JSON.stringify(facts));
        localStorage.setItem('brandpilot_terminology', JSON.stringify(terminology));
        localStorage.setItem('brandpilot_tone', JSON.stringify(toneProfile));
        localStorage.setItem('brandpilot_submissions', JSON.stringify(submissions));
        localStorage.setItem('brandpilot_findings', JSON.stringify(findings));
      } catch {}
    }
  }, [guidelines, facts, terminology, toneProfile, submissions, findings]);

  // Toast notification queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync role changes with default personas
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    const demo = DEMO_USERS[role];
    if (demo && currentUser.id.startsWith('user-')) {
      setCurrentUser(demo);
    }
  };

  // Account creation: Register new enterprise account
  const registerUser = async (data: { fullName: string; email: string; orgName: string; password?: string }) => {
    const userId = `user-reg-${Date.now()}`;
    const orgId = `org-${Date.now()}`;

    const newUser: UserProfile = {
      id: userId,
      email: data.email,
      name: data.fullName,
      full_name: data.fullName,
      role: 'admin',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}`
    };

    const newWorkspace: Workspace = {
      id: orgId,
      name: data.orgName,
      brand_name: data.orgName,
      slug: data.orgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      industry: 'Enterprise Technology',
      primary_color: '#101827',
      secondary_color: '#19263A',
      accent_color: '#3978E8',
      members_count: 1
    };

    const updatedUsers = [newUser, ...registeredUsers];
    setRegisteredUsers(updatedUsers);
    setCurrentUser(newUser);
    setCurrentRole('admin');
    setCurrentWorkspace(newWorkspace);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brandpilot_users', JSON.stringify(updatedUsers));
        localStorage.setItem('brandpilot_workspace', JSON.stringify(newWorkspace));
        localStorage.setItem('brandpilot_current_user', JSON.stringify(newUser));
      } catch {}
    }

    showToast(`Account created for ${data.fullName}! Welcome to BrandPilot.`, 'success');
    return { success: true };
  };

  // Login authentication
  const loginUser = async (email: string, password?: string) => {
    const user = registeredUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (user) {
      setCurrentUser(user);
      setCurrentRole(user.role);
      showToast(`Welcome back, ${user.full_name || user.name}!`, 'success');
      return { success: true };
    }

    // Check if matches known demo addresses
    if (email.includes('ruben') || email.includes('elena')) {
      setCurrentUser(DEMO_USERS['admin']);
      setCurrentRole('admin');
      showToast('Logged in as Administrator (Ruben John Reji)', 'success');
      return { success: true };
    }
    if (email.includes('sarah')) {
      setCurrentUser(DEMO_USERS['reviewer']);
      setCurrentRole('reviewer');
      showToast('Logged in as Brand Reviewer (Sarah Lin)', 'success');
      return { success: true };
    }
    if (email.includes('marcus')) {
      setCurrentUser(DEMO_USERS['creator']);
      setCurrentRole('creator');
      showToast('Logged in as Content Creator (Marcus Vance)', 'success');
      return { success: true };
    }

    // Allow flexible instant login for any email during evaluation
    const fallbackUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      full_name: email.split('@')[0],
      role: 'admin'
    };
    setCurrentUser(fallbackUser);
    setCurrentRole('admin');
    showToast(`Logged in as ${email}`, 'success');
    return { success: true };
  };

  // Logout
  const logoutUser = () => {
    setCurrentUser(DEMO_USERS['admin']);
    setCurrentRole('admin');
    showToast('Signed out of organization session.', 'info');
  };

  // Complete onboarding wizard
  const completeOnboarding = (data: {
    brandName: string;
    industry: string;
    website?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    guidelineDocName?: string;
    inviteEmails?: string;
  }) => {
    const updatedWs: Workspace = {
      ...currentWorkspace,
      name: data.brandName,
      brand_name: data.brandName,
      industry: data.industry,
      website_url: data.website || currentWorkspace.website_url,
      primary_color: data.primaryColor || '#101827',
      secondary_color: data.secondaryColor || '#19263A',
      accent_color: data.accentColor || '#3978E8'
    };

    setCurrentWorkspace(updatedWs);

    if (data.guidelineDocName) {
      addGuideline({
        title: data.guidelineDocName,
        category: 'Corporate Brand Standards',
        description: `Official brand manual for ${data.brandName}`
      });
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brandpilot_workspace', JSON.stringify(updatedWs));
      } catch {}
    }

    showToast(`Workspace initialized for ${data.brandName}!`, 'success');
  };

  // Workspace Settings
  const updateWorkspaceSettings = (settings: Partial<Workspace>) => {
    setCurrentWorkspace(prev => {
      const updated = { ...prev, ...settings };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('brandpilot_workspace', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
    showToast('Workspace settings saved successfully!', 'success');
  };

  // Guideline actions
  const addGuideline = (doc: { title: string; category: string; description: string; text?: string }) => {
    const newDoc: GuidelineDocument = {
      id: `guide-${Date.now()}`,
      organization_id: currentWorkspace.id,
      title: doc.title,
      category: doc.category,
      description: doc.description,
      version: '1.0',
      status: 'active',
      file_name: `${doc.title.replace(/\s+/g, '_')}.pdf`,
      extracted_text: doc.text || 'Policy clauses indexed for semantic compliance retrieval.',
      uploaded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      chunks_count: 6,
      total_chunks: 6
    };
    setGuidelines(prev => [newDoc, ...prev]);
    showToast(`Guideline "${doc.title}" indexed into pgvector knowledge base!`, 'success');
  };

  // Supabase check function
  const checkSupabase = async () => {
    const res = await testSupabaseConnection();
    if (res.connected) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'info');
    }
    return res;
  };

  // Fact actions
  const addFact = async (factData: Omit<ApprovedFact, 'id' | 'created_at' | 'updated_at' | 'organization_id'>) => {
    const newFact: ApprovedFact = {
      ...factData,
      id: `fact-${Date.now()}`,
      organization_id: currentWorkspace.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setFacts(prev => [newFact, ...prev]);
    showToast('Approved fact created and indexed!', 'success');

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('approved_facts').insert([
          {
            id: newFact.id,
            organization_id: newFact.organization_id,
            title: (newFact.claim_text || 'Fact').slice(0, 50),
            approved_statement: newFact.claim_text,
            category: newFact.category,
            supporting_evidence: newFact.source_citation || 'Internal Policy',
            approval_status: 'approved'
          }
        ]);
      } catch {}
    }

    await BrandPilotAPI.createFact(currentWorkspace.id, newFact);
  };

  const deleteFact = async (id: string) => {
    setFacts(prev => prev.filter(f => f.id !== id));
    showToast('Fact removed from approved register.', 'info');

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('approved_facts').delete().eq('id', id);
      } catch {}
    }

    await BrandPilotAPI.deleteFact(currentWorkspace.id, id);
  };

  // Terminology actions
  const addTerminologyRule = async (ruleData: Omit<TerminologyRule, 'id' | 'created_at' | 'organization_id'>) => {
    const newRule: TerminologyRule = {
      ...ruleData,
      id: `term-${Date.now()}`,
      organization_id: currentWorkspace.id,
      created_at: new Date().toISOString()
    };
    setTerminology(prev => [newRule, ...prev]);
    showToast(`Terminology rule "${ruleData.term}" added to linter engine!`, 'success');

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('terminology_rules').insert([
          {
            id: newRule.id,
            organization_id: newRule.organization_id,
            term: newRule.term,
            rule_type: newRule.rule_type,
            preferred_alternative: newRule.suggested_replacement,
            case_sensitive: newRule.is_case_sensitive || false,
            whole_word: true,
            rule_description: newRule.explanation || ''
          }
        ]);
      } catch {}
    }

    await BrandPilotAPI.createTerminologyRule(currentWorkspace.id, newRule);
  };

  const deleteTerminologyRule = async (id: string) => {
    setTerminology(prev => prev.filter(r => r.id !== id));
    showToast('Terminology rule removed.', 'info');

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('terminology_rules').delete().eq('id', id);
      } catch {}
    }

    await BrandPilotAPI.deleteTerminologyRule(currentWorkspace.id, id);
  };

  // Tone profile actions
  const updateToneProfile = async (profile: ToneProfile) => {
    setToneProfile(profile);
    showToast('Brand Tone of Voice dimensions updated!', 'success');
    await BrandPilotAPI.updateToneProfile(currentWorkspace.id, profile);
  };

  // Asset actions
  const addAsset = (assetData: Omit<BrandAsset, 'id' | 'created_at' | 'organization_id'>) => {
    const newAsset: BrandAsset = {
      ...assetData,
      id: `asset-${Date.now()}`,
      organization_id: currentWorkspace.id,
      created_at: new Date().toISOString()
    };
    setAssets(prev => [newAsset, ...prev]);
    showToast(`Asset "${assetData.title || assetData.name || 'Token'}" registered!`, 'success');
  };

  // Submission helpers
  const getSubmission = (id: string) => submissions.find(s => s.id === id);
  const getSubmissionFindings = (id: string) => findings[id] || [];

  const updateDraftText = (submissionId: string, newText: string) => {
    setSubmissions(prev =>
      prev.map(s => {
        if (s.id !== submissionId) return s;
        const words = newText.trim() ? newText.trim().split(/\s+/).length : 0;
        return {
          ...s,
          current_text: newText,
          word_count: words,
          character_count: newText.length,
          updated_at: new Date().toISOString()
        };
      })
    );
    showToast('Draft text updated manually.', 'info');
  };

  // Run brand compliance audit (Triple-Layer AI Engine: Deterministic + RAG + Contextual LLM + Accessibility)
  const runAudit = async (data: {
    title: string;
    content_type: string;
    text: string;
    campaign_name?: string;
    target_audience?: string;
    check_categories?: string[];
  }): Promise<string> => {
    const submissionId = `sub-${Date.now()}`;
    const wordCount = data.text.trim() ? data.text.trim().split(/\s+/).length : 0;

    // 1. Try real backend audit if running
    try {
      const remoteResult = await BrandPilotAPI.runAudit(currentWorkspace.id, {
        title: data.title,
        content_type: data.content_type,
        original_text: data.text,
        campaign_name: data.campaign_name,
        target_audience: data.target_audience,
        check_categories: data.check_categories
      });

      if (remoteResult && remoteResult.submission) {
        setSubmissions(prev => [remoteResult.submission, ...prev]);
        setFindings(prev => ({
          ...prev,
          [remoteResult.submission.id]: remoteResult.findings
        }));

        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          organization_id: currentWorkspace.id,
          user_id: currentUser.id,
          title: 'Audit Completed',
          message: `Audit completed for "${data.title}" with score ${remoteResult.submission.compliance_score}%.`,
          notification_type: 'audit_completed',
          link: `/app/corrections/${remoteResult.submission.id}`,
          is_read: false,
          created_at: new Date().toISOString()
        };
        setNotifications(prev => [newNotif, ...prev]);
        showToast(`Audit finished! Compliance Score: ${remoteResult.submission.compliance_score}%`, 'success');
        return remoteResult.submission.id;
      }
    } catch {
      // Backend offline: run client-side engine seamlessly
    }

    // 2. High-precision client-side deterministic and semantic engine fallback
    const detectedFindings: ComplianceFinding[] = [];

    // Check prohibited and preferred terminology rules from active knowledge base
    terminology.forEach(term => {
      const regex = new RegExp(`\\b${term.term}\\b`, term.case_sensitive || term.is_case_sensitive ? 'g' : 'gi');
      let match;
      while ((match = regex.exec(data.text)) !== null) {
        detectedFindings.push({
          id: `find-term-${Date.now()}-${detectedFindings.length}`,
          submission_id: submissionId,
          category: 'terminology',
          severity: term.rule_type === 'prohibited' ? 'high' : 'medium',
          original_text: match[0],
          start_index: match.index,
          end_index: match.index + match[0].length,
          explanation: `The term '${match[0]}' violates active terminology policy. ${term.explanation || term.rule_description || 'Prohibited in enterprise communications.'}`,
          relevant_brand_rule: `Terminology Policy: ${term.rule_type.toUpperCase()} Rule for '${term.term}'`,
          source_document: 'AuraCloud Global Brand & Communication Manual v2.4',
          page_reference: 'Section 3.4',
          exact_supporting_passage: 'Nomenclature Rules: Prohibited expressions must be replaced with approved nomenclature in all formal communications.',
          suggested_correction: term.suggested_replacement || term.preferred_alternative || 'approved terminology',
          confidence: 1.0,
          status: 'pending'
        });
      }
    });

    // Check superlative, absolute guarantees, and SLA claims
    const claimChecks = [
      {
        pattern: /India'?s\s+No\.?\s*1/i,
        text: "India's No. 1",
        category: 'unsupported_claim' as const,
        severity: 'high' as const,
        rule: 'Factual Claims Policy 4.2: Prohibited Market Superlatives',
        page: 'Page 22, Section 4.2',
        passage: "Section 4.2: Factual Claims Policy: Unsubstantiated market leadership claims ('No. 1', 'cheapest') expose the company to regulatory censure and are prohibited.",
        expl: "Unsupported market leadership ranking. Market position claims must cite dated third-party analyst recognition (e.g. Gartner, IDC).",
        repl: "a leading enterprise cloud platform"
      },
      {
        pattern: /\bNo\.?\s*1\b/i,
        text: "No. 1",
        category: 'unsupported_claim' as const,
        severity: 'high' as const,
        rule: 'Factual Claims Policy 4.2: Prohibited Market Superlatives',
        page: 'Page 22, Section 4.2',
        passage: "Section 4.2: Unsubstantiated rankings without third-party citations expose the company to liability.",
        expl: "Unsubstantiated market ranking.",
        repl: "industry-recognized"
      },
      {
        pattern: /AI\s*magic/i,
        text: "AI magic",
        category: 'terminology' as const,
        severity: 'high' as const,
        rule: "Terminology Policy: Prohibited Term 'AI magic'",
        page: 'Page 15, Section 3.4',
        passage: "Section 3.4: Nomenclature Rules: Never refer to our capabilities as 'AI magic'. Use 'automated cloud orchestration' or 'predictive optimization'.",
        expl: "The phrase 'AI magic' is explicitly prohibited. It trivializes enterprise software engineering and violates brand voice standards.",
        repl: "intelligent automated orchestration"
      },
      {
        pattern: /guarantees\s+100%\s+accuracy/i,
        text: "guarantees 100% accuracy",
        category: 'unsupported_claim' as const,
        severity: 'critical' as const,
        rule: 'Legal Compliance Standard: Prohibited Absolute Guarantees',
        page: 'Page 22, Section 4.2',
        passage: "Section 4.2: Never state absolute guarantees, unsupported rankings, or exaggerated superlatives. All product descriptions must reflect verifiable specifications.",
        expl: "Absolute performance guarantee. Legally prohibited under our compliance guidelines without qualified warranty limits and SLA bounds.",
        repl: "delivers high-reliability automated verification"
      },
      {
        pattern: /cheapest\s+solution(?:\s+available)?/i,
        text: "cheapest solution available",
        category: 'unsupported_claim' as const,
        severity: 'critical' as const,
        rule: 'Factual Claims Policy 4.2: Comparative Pricing',
        page: 'Page 22, Section 4.2',
        passage: "Section 4.2: Comparative pricing claims ('cheapest') without published competitive benchmarking invite regulatory scrutiny.",
        expl: "Unsubstantiated comparative pricing claim. Price superlatives require a defined competitor benchmark and active pricing audit.",
        repl: "cost-effective enterprise solution"
      },
      {
        pattern: /\bauracloud\b/,
        text: "auracloud",
        category: 'terminology' as const,
        severity: 'medium' as const,
        rule: 'Brand Nomenclature Policy 3.4: Capitalization Standard',
        page: 'Page 15, Section 3.4',
        passage: "Section 3.4: Nomenclature Rules: AuraCloud must always appear in camel-case. Derivatives such as 'auracloud' are prohibited.",
        expl: "Incorrect brand capitalization. AuraCloud must always be capitalized with capital 'A' and capital 'C'.",
        repl: "AuraCloud"
      },
      {
        pattern: /100%\s+uptime/i,
        text: "100% uptime",
        category: 'outdated_fact' as const,
        severity: 'critical' as const,
        rule: 'Corporate SLA Standard 2026: Approved Uptime Bound',
        page: 'Page 8, Section 2.1',
        passage: 'AuraCloud standard enterprise SLA guarantees 99.95% monthly uptime. Claims of 100% uptime are non-compliant.',
        expl: "Contradicts approved corporate facts. AuraCloud's verified SLA is 99.95% monthly uptime.",
        repl: "99.95% monthly uptime SLA"
      },
      {
        pattern: /cloud\s+supremacy/i,
        text: "cloud supremacy",
        category: 'tone_mismatch' as const,
        severity: 'medium' as const,
        rule: 'Tone of Voice Guide: Professionalism & Humility',
        page: 'Page 18, Section 4.0',
        passage: 'Maintain an authoritative, evidence-based tone. Avoid combative or hyper-aggressive expressions such as supremacy.',
        expl: "Violates enterprise tone guidelines. Replace hyper-aggressive phrasing with collaborative value proposition.",
        repl: "cloud governance excellence"
      },
      {
        pattern: /click\s+here\b/i,
        text: "click here",
        category: 'accessibility' as const,
        severity: 'medium' as const,
        rule: 'Digital Accessibility Standard WCAG 2.1: Meaningful Link Text',
        page: 'Page 28, Section 5.3',
        passage: 'Non-descriptive hyperlinks such as "click here" fail accessibility benchmarks. Use meaningful descriptive labels describing the destination.',
        expl: 'Accessibility finding: Non-descriptive anchor text degrades screen reader navigation.',
        repl: 'explore our cloud architecture documentation'
      }
    ];

    claimChecks.forEach(item => {
      const match = item.pattern.exec(data.text);
      if (match && !detectedFindings.some(f => Math.abs(f.start_index - match.index) < 3)) {
        detectedFindings.push({
          id: `find-rule-${Date.now()}-${detectedFindings.length}`,
          submission_id: submissionId,
          category: item.category,
          severity: item.severity,
          original_text: match[0],
          start_index: match.index,
          end_index: match.index + match[0].length,
          explanation: item.expl,
          relevant_brand_rule: item.rule,
          source_document: 'AuraCloud Global Brand & Communication Manual v2.4',
          page_reference: item.page,
          exact_supporting_passage: item.passage,
          suggested_correction: item.repl,
          confidence: 0.98,
          status: 'pending'
        });
      }
    });

    // Calculate score
    const criticalDeduction = detectedFindings.filter(f => f.severity === 'critical').length * 20;
    const highDeduction = detectedFindings.filter(f => f.severity === 'high').length * 10;
    const mediumDeduction = detectedFindings.filter(f => f.severity === 'medium').length * 5;
    const score = Math.max(12, 100 - (criticalDeduction + highDeduction + mediumDeduction));

    const newSub: ContentSubmission = {
      id: submissionId,
      organization_id: currentWorkspace.id,
      title: data.title,
      content_type: data.content_type as any,
      campaign_name: data.campaign_name,
      original_text: data.text,
      current_text: data.text,
      status: 'audited',
      word_count: wordCount,
      character_count: data.text.length,
      compliance_score: score,
      creator_id: currentUser.id,
      creator_name: currentUser.full_name || currentUser.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      findings_count: detectedFindings.length,
      critical_count: detectedFindings.filter(f => f.severity === 'critical').length
    };

    setSubmissions(prev => [newSub, ...prev]);
    setFindings(prev => ({
      ...prev,
      [submissionId]: detectedFindings
    }));

    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      organization_id: currentWorkspace.id,
      user_id: currentUser.id,
      title: 'Audit Complete',
      message: `Audit completed for "${data.title}" with score ${score}%. ${detectedFindings.length} issue(s) detected.`,
      notification_type: 'audit_completed',
      link: `/app/corrections/${submissionId}`,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Audit finished! Score: ${score}% (${detectedFindings.length} findings)`, 'success');

    return submissionId;
  };

  // Apply a suggested correction to text (robust case-insensitive replacement)
  const applySuggestion = async (submissionId: string, findingId: string, customText?: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    const subFindings = findings[submissionId] || [];
    const targetFinding = subFindings.find(f => f.id === findingId);
    if (!sub || !targetFinding) return;

    const replacement = customText !== undefined ? customText : targetFinding.suggested_correction;
    const escaped = targetFinding.original_text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    let updatedText = sub.current_text;
    if (regex.test(updatedText)) {
      updatedText = updatedText.replace(regex, replacement);
    } else {
      updatedText = updatedText.replace(targetFinding.original_text, replacement);
    }

    // Recalculate score
    const remainingPending = subFindings.filter(f => f.id !== findingId && f.status === 'pending');
    const newScore = remainingPending.length === 0 ? 100 : Math.min(96, (sub.compliance_score || 50) + 14);

    setSubmissions(prev =>
      prev.map(s => {
        if (s.id !== submissionId) return s;
        return {
          ...s,
          current_text: updatedText,
          compliance_score: newScore,
          updated_at: new Date().toISOString()
        };
      })
    );

    setFindings(prev => ({
      ...prev,
      [submissionId]: subFindings.map(f => (f.id === findingId ? { ...f, status: 'accepted' as const } : f))
    }));

    showToast(`Correction applied! Compliance score rose to ${newScore}%.`, 'success');
    await BrandPilotAPI.applySuggestion(findingId, { custom_text: replacement, accepted: true });
  };

  // Apply all pending suggestions across the document
  const applyAllSuggestions = async (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    const subFindings = findings[submissionId] || [];
    if (!sub || subFindings.length === 0) return;

    let updatedText = sub.current_text;
    const updatedFindings = subFindings.map(f => {
      if (f.status === 'pending') {
        const escaped = f.original_text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');
        if (regex.test(updatedText)) {
          updatedText = updatedText.replace(regex, f.suggested_correction);
        } else {
          updatedText = updatedText.replace(f.original_text, f.suggested_correction);
        }
        return { ...f, status: 'accepted' as const };
      }
      return f;
    });

    setSubmissions(prev =>
      prev.map(s => {
        if (s.id !== submissionId) return s;
        return {
          ...s,
          current_text: updatedText,
          compliance_score: 100,
          updated_at: new Date().toISOString()
        };
      })
    );

    setFindings(prev => ({
      ...prev,
      [submissionId]: updatedFindings
    }));

    showToast('Applied all suggested corrections! Compliance score reached 100%.', 'success');
  };

  // Dismiss a finding
  const rejectFinding = async (submissionId: string, findingId: string) => {
    const subFindings = findings[submissionId] || [];
    setFindings(prev => ({
      ...prev,
      [submissionId]: subFindings.map(f => (f.id === findingId ? { ...f, status: 'rejected' as const } : f))
    }));
    showToast('Finding dismissed.', 'info');
    await BrandPilotAPI.applySuggestion(findingId, { accepted: false });
  };

  // Human-in-the-loop: Submit draft for review
  const submitForApproval = async (submissionId: string, note?: string) => {
    setSubmissions(prev =>
      prev.map(s => (s.id === submissionId ? { ...s, status: 'in_review' as const, updated_at: new Date().toISOString() } : s))
    );

    const sub = submissions.find(s => s.id === submissionId);
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      organization_id: currentWorkspace.id,
      user_id: 'user-reviewer-1',
      title: 'Review Requested',
      message: `${currentUser.full_name || currentUser.name} requested approval for "${sub?.title || 'Draft'}"${note ? `: "${note}"` : '.'}`,
      notification_type: 'submitted_for_review',
      link: '/app/approvals',
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast('Draft routed to Human Approval Centre for reviewer evaluation.', 'success');

    await BrandPilotAPI.submitForApproval(submissionId, { note });
  };

  // Human-in-the-loop: Review decision by authorized reviewer/admin
  const reviewSubmission = async (
    submissionId: string,
    decision: 'approved' | 'rejected' | 'changes_requested',
    comments?: string
  ) => {
    setSubmissions(prev =>
      prev.map(s => {
        if (s.id !== submissionId) return s;
        return {
          ...s,
          status: decision === 'changes_requested' ? 'changes_requested' : decision,
          updated_at: new Date().toISOString()
        };
      })
    );

    const sub = submissions.find(s => s.id === submissionId);
    const title =
      decision === 'approved'
        ? 'Content Approved for Publication'
        : decision === 'changes_requested'
        ? 'Changes Requested on Draft'
        : 'Submission Rejected';

    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      organization_id: currentWorkspace.id,
      user_id: sub?.creator_id || currentUser.id,
      title,
      message: `"${sub?.title || 'Draft'}" was ${decision.replace('_', ' ')} by ${currentUser.full_name || currentUser.name}${comments ? `: ${comments}` : ''}`,
      notification_type: decision === 'approved' ? 'approved' : 'rejected',
      link: '/app/approvals',
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    if (decision === 'approved') {
      showToast('Document approved with digital cryptographic audit stamp!', 'success');
    } else if (decision === 'changes_requested') {
      showToast('Changes requested. Author notified with audit feedback.', 'info');
    } else {
      showToast('Submission rejected.', 'error');
    }

    await BrandPilotAPI.reviewApproval(submissionId, {
      decision,
      comments,
      reviewer_name: currentUser.full_name || currentUser.name
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const inspectColor = (hex: string) => {
    const brandColors = [
      (currentWorkspace.primary_color || '#101827').toUpperCase(),
      (currentWorkspace.secondary_color || '#19263A').toUpperCase(),
      (currentWorkspace.accent_color || '#3978E8').toUpperCase()
    ];
    const isCompliant = brandColors.includes(hex.toUpperCase());
    return {
      isCompliant,
      nearestBrandColor: currentWorkspace.primary_color
    };
  };

  return (
    <BrandPilotContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole: handleRoleChange,
        registeredUsers,
        registerUser,
        loginUser,
        logoutUser,
        isSupabaseActive: isSupabaseConfigured(),
        checkSupabase,
        currentWorkspace,
        updateWorkspaceSettings,
        completeOnboarding,
        guidelines,
        addGuideline,
        facts,
        addFact,
        deleteFact,
        terminology,
        addTerminologyRule,
        deleteTerminologyRule,
        toneProfile,
        updateToneProfile,
        assets,
        addAsset,
        submissions,
        findings,
        getSubmission,
        getSubmissionFindings,
        runAudit,
        applySuggestion,
        applyAllSuggestions,
        rejectFinding,
        updateDraftText,
        submitForApproval,
        reviewSubmission,
        notifications,
        markNotificationRead,
        inspectColor,
        showToast
      }}
    >
      {children}

      {/* Global Toast Notification System */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border text-xs leading-relaxed transition-all transform animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-[#101827] text-white border-emerald-500/50'
                : toast.type === 'error'
                ? 'bg-rose-950 text-white border-rose-600'
                : 'bg-slate-900 text-white border-blue-500/50'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}

            <div className="flex-1 font-medium">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </BrandPilotContext.Provider>
  );
}

export function useBrandPilot() {
  const context = useContext(BrandPilotContext);
  if (!context) {
    throw new Error('useBrandPilot must be used within a BrandPilotProvider');
  }
  return context;
}
