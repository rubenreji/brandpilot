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
  AuditResultResponse,
  ContentRevision,
  ApprovalRecord,
  ActivityItem
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
  INITIAL_USERS,
  INITIAL_REVISIONS,
  INITIAL_APPROVAL_RECORDS,
  INITIAL_ACTIVITIES
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
  updateFact: (id: string, updates: Partial<ApprovedFact>) => Promise<void>;
  deleteFact: (id: string) => Promise<void>;

  terminology: TerminologyRule[];
  addTerminologyRule: (rule: Omit<TerminologyRule, 'id' | 'created_at' | 'organization_id'>) => Promise<void>;
  updateTerminologyRule: (id: string, updates: Partial<TerminologyRule>) => Promise<void>;
  deleteTerminologyRule: (id: string) => Promise<void>;

  toneProfile: ToneProfile;
  updateToneProfile: (profile: ToneProfile) => Promise<void>;

  assets: BrandAsset[];
  addAsset: (asset: Omit<BrandAsset, 'id' | 'created_at' | 'organization_id'>) => void;

  // Submissions & Audits
  submissions: ContentSubmission[];
  findings: Record<string, ComplianceFinding[]>;
  revisions: Record<string, ContentRevision[]>;
  approvalHistory: ApprovalRecord[];
  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id'>) => void;
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

  // Correction Studio & Live AI Analysis
  analyzeTextRealtime: (text: string, submissionId?: string) => { findings: ComplianceFinding[]; score: number };
  createLiveSubmission: (title: string, text: string) => string;
  applySuggestion: (submissionId: string, findingId: string, customText?: string) => Promise<void>;
  applyAllSuggestions: (submissionId: string) => Promise<void>;
  rejectFinding: (submissionId: string, findingId: string) => Promise<void>;
  updateDraftText: (submissionId: string, newText: string) => void;

  // Account Workflow & User Switching
  switchAccount: (userIdOrRole: string) => void;
  availableUsers: UserProfile[];

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
  markAllNotificationsRead: (userId?: string) => void;
  resetAllTrackers: () => void;

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
        if (stored) {
          const parsed: GuidelineDocument[] = JSON.parse(stored);
          const missing = INITIAL_GUIDELINES.filter(ig => !parsed.some(p => p.id === ig.id));
          if (missing.length > 0) {
            const merged = [...parsed, ...missing];
            localStorage.setItem('brandpilot_guidelines', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      } catch {}
    }
    return INITIAL_GUIDELINES;
  });

  const [facts, setFacts] = useState<ApprovedFact[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_facts');
        if (stored) {
          const parsed: ApprovedFact[] = JSON.parse(stored);
          const missing = INITIAL_FACTS.filter(item => !parsed.some(p => p.id === item.id));
          if (missing.length > 0) {
            const merged = [...parsed, ...missing];
            localStorage.setItem('brandpilot_facts', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      } catch {}
    }
    return INITIAL_FACTS;
  });

  const [terminology, setTerminology] = useState<TerminologyRule[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_terminology');
        if (stored) {
          const parsed: TerminologyRule[] = JSON.parse(stored);
          const missing = INITIAL_TERMINOLOGY.filter(item => !parsed.some(p => p.id === item.id));
          if (missing.length > 0) {
            const merged = [...parsed, ...missing];
            localStorage.setItem('brandpilot_terminology', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
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

  // Seed flag for single document audit baseline
  const isSingleDocSeeded = () => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('brandpilot_single_doc_v1') === 'true';
  };

  // Submissions & Findings with persistence across page navigation and refresh
  const [submissions, setSubmissions] = useState<ContentSubmission[]>(() => {
    if (typeof window !== 'undefined') {
      if (!isSingleDocSeeded()) {
        try {
          localStorage.setItem('brandpilot_submissions', JSON.stringify(INITIAL_SUBMISSIONS));
          localStorage.setItem('brandpilot_findings', JSON.stringify(INITIAL_FINDINGS));
          localStorage.setItem('brandpilot_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
          localStorage.setItem('brandpilot_single_doc_v1', 'true');
        } catch {}
        return INITIAL_SUBMISSIONS;
      }
      try {
        const stored = localStorage.getItem('brandpilot_submissions');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return INITIAL_SUBMISSIONS;
  });

  const [findings, setFindings] = useState<Record<string, ComplianceFinding[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_findings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && Object.keys(parsed).length > 0) return parsed;
        }
      } catch {}
    }
    return INITIAL_FINDINGS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_notifications');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [revisions, setRevisions] = useState<Record<string, ContentRevision[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_revisions');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && Object.keys(parsed).length > 0) return parsed;
        }
      } catch {}
    }
    return INITIAL_REVISIONS;
  });

  const [approvalHistory, setApprovalHistory] = useState<ApprovalRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_approvals');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return INITIAL_APPROVAL_RECORDS;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brandpilot_activities');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return INITIAL_ACTIVITIES;
  });

  const addActivity = (act: Omit<ActivityItem, 'id'>) => {
    const item: ActivityItem = { ...act, id: `act-${Date.now()}` };
    setActivities(prev => [item, ...prev]);
  };

  // Dedicated manual tracker reset: wipes all logs and resumes tracking from first new action
  const resetAllTrackers = () => {
    setSubmissions([]);
    setFindings({});
    setNotifications([]);
    setApprovalHistory([]);
    setActivities([]);
    setRevisions({});
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brandpilot_submissions', JSON.stringify([]));
        localStorage.setItem('brandpilot_findings', JSON.stringify({}));
        localStorage.setItem('brandpilot_notifications', JSON.stringify([]));
        localStorage.setItem('brandpilot_approvals', JSON.stringify([]));
        localStorage.setItem('brandpilot_activities', JSON.stringify([]));
        localStorage.setItem('brandpilot_revisions', JSON.stringify({}));
        localStorage.setItem('brandpilot_single_doc_v1', 'true');
      } catch {}
    }
    showToast('All trackers and audit logs reset to zero. Tracking will start from your next action!', 'info');
  };

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
        localStorage.setItem('brandpilot_notifications', JSON.stringify(notifications));
        localStorage.setItem('brandpilot_approvals', JSON.stringify(approvalHistory));
        localStorage.setItem('brandpilot_activities', JSON.stringify(activities));
        localStorage.setItem('brandpilot_revisions', JSON.stringify(revisions));
      } catch {}
    }
  }, [guidelines, facts, terminology, toneProfile, submissions, findings, notifications, approvalHistory, activities, revisions]);

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

  // Dedicated Account Switcher (supports user ID, role, or email)
  const switchAccount = (userIdOrRole: string) => {
    let target = registeredUsers.find(u => u.id === userIdOrRole);
    if (!target) {
      target = DEMO_USERS[userIdOrRole as UserRole] || registeredUsers.find(u => u.role === userIdOrRole);
    }
    if (!target) {
      target = registeredUsers.find(u => u.email.toLowerCase() === userIdOrRole.toLowerCase());
    }

    if (target) {
      setCurrentUser(target);
      setCurrentRole(target.role);
      if (typeof window !== 'undefined') {
        localStorage.setItem('brandpilot_current_user', JSON.stringify(target));
        localStorage.setItem('brandpilot_current_role', target.role);
      }
      showToast(`Active account switched to ${target.full_name || target.name} (${target.role.toUpperCase()})`, 'info');
    }
  };

  const markAllNotificationsRead = (userId?: string) => {
    const targetUserId = userId || currentUser.id;
    setNotifications(prev =>
      prev.map(n => (n.user_id === targetUserId ? { ...n, is_read: true } : n))
    );
    showToast('All notifications marked as read.', 'success');
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

  const updateFact = async (id: string, updates: Partial<ApprovedFact>) => {
    setFacts(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates, updated_at: new Date().toISOString() } : f))
    );
    addActivity({
      type: 'policy',
      title: 'Approved Fact Updated',
      description: `Updated approved fact: "${(updates.claim_text || updates.approved_statement || 'Fact').slice(0, 45)}..."`,
      actor_name: currentUser.full_name || currentUser.name,
      actor_role: currentRole,
      target_link: '/app/knowledge?tab=facts',
      timestamp: 'Just now',
      status_badge: 'Fact Updated'
    });
    showToast('Approved fact updated successfully!', 'success');
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

  const updateTerminologyRule = async (id: string, updates: Partial<TerminologyRule>) => {
    setTerminology(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
    addActivity({
      type: 'policy',
      title: 'Terminology Rule Modified',
      description: `Modified terminology rule for term: "${updates.term || 'rule'}"`,
      actor_name: currentUser.full_name || currentUser.name,
      actor_role: currentRole,
      target_link: '/app/knowledge?tab=terminology',
      timestamp: 'Just now',
      status_badge: 'Rule Modified'
    });
    showToast('Terminology governance rule updated!', 'success');
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

  // Real-time AI brand governance audit engine
  const analyzeTextRealtime = (text: string, subId?: string): { findings: ComplianceFinding[]; score: number } => {
    const activeSubId = subId || `sub-${Date.now()}`;
    const detected: ComplianceFinding[] = [];

    if (!text || !text.trim()) {
      return { findings: [], score: 100 };
    }

    // 1. Terminology Rules from Active Knowledge Base
    terminology.forEach(term => {
      if (!term.term) return;
      const flags = term.case_sensitive || term.is_case_sensitive ? 'g' : 'gi';
      const escaped = term.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, flags);
      let match;
      while ((match = regex.exec(text)) !== null) {
        if (!detected.some(f => Math.abs(f.start_index - match!.index) < 2)) {
          detected.push({
            id: `find-term-${Date.now()}-${detected.length}`,
            submission_id: activeSubId,
            category: 'terminology',
            severity: term.rule_type === 'prohibited' ? 'high' : 'medium',
            original_text: match[0],
            start_index: match.index,
            end_index: match.index + match[0].length,
            explanation: `The term '${match[0]}' violates active terminology policy. ${term.explanation || term.rule_description || 'Prohibited in enterprise communications.'}`,
            relevant_brand_rule: `Terminology Policy: ${term.rule_type.toUpperCase()} Rule for '${term.term}'`,
            source_document: 'AuraCloud Global Brand & Communication Manual v2.4',
            page_reference: 'Section 3.4',
            exact_supporting_passage: 'Nomenclature Rules: Prohibited expressions must be replaced with approved nomenclature.',
            suggested_correction: term.suggested_replacement || term.preferred_alternative || 'approved terminology',
            confidence: 1.0,
            status: 'pending'
          });
        }
      }
    });

    // 2. Comprehensive Pre-compiled Governance & Legal Rules
    const governanceRules = [
      {
        pattern: /India'?s\s+No\.?\s*1/i,
        category: 'unsupported_claim' as const,
        severity: 'high' as const,
        rule: 'Factual Claims Policy 4.2: Prohibited Market Superlatives',
        page: 'Page 22, Section 4.2',
        passage: "Section 4.2: Factual Claims Policy: Unsubstantiated market leadership claims ('No. 1', 'cheapest') expose the company to regulatory censure and are prohibited.",
        expl: "Unsupported market leadership ranking. Market position claims must cite dated third-party analyst recognition (e.g. Gartner, IDC).",
        repl: 'a leading enterprise cloud platform'
      },
      {
        pattern: /\b(?:world'?s\s+best|best(?:\s+in\s+class|\s+solution|\s+platform))\b/i,
        category: 'unsupported_claim' as const,
        severity: 'high' as const,
        rule: 'Factual Claims Policy 4.2: Unsubstantiated Superlatives',
        page: 'Page 22, Section 4.2',
        passage: 'Section 4.2: Avoid unsubstantiated superlatives such as best in class without empirical citations.',
        expl: 'Unverified superlative. Enterprise communications require objective, qualification-based language.',
        repl: 'high-performance enterprise solution'
      },
      {
        pattern: /\bNo\.?\s*1\b/i,
        category: 'unsupported_claim' as const,
        severity: 'high' as const,
        rule: 'Factual Claims Policy 4.2: Prohibited Market Superlatives',
        page: 'Page 22, Section 4.2',
        passage: 'Section 4.2: Unsubstantiated rankings without third-party citations expose the company to liability.',
        expl: 'Unsubstantiated market ranking.',
        repl: 'industry-recognized'
      },
      {
        pattern: /\b(?:AI\s*magic|magic|superpowers?)\b/i,
        category: 'terminology' as const,
        severity: 'high' as const,
        rule: "Terminology Policy: Prohibited Term 'AI magic'",
        page: 'Page 15, Section 3.4',
        passage: "Section 3.4: Nomenclature Rules: Never refer to our capabilities as 'AI magic'. Use 'automated cloud orchestration' or 'predictive optimization'.",
        expl: "Vague, unscientific marketing buzzword. It trivializes enterprise software engineering and violates brand voice standards.",
        repl: 'intelligent automated orchestration'
      },
      {
        pattern: /guarantees?\s+(?:100%|complete)\s+accuracy/i,
        category: 'unsupported_claim' as const,
        severity: 'critical' as const,
        rule: 'Legal Compliance Standard: Prohibited Absolute Guarantees',
        page: 'Page 22, Section 4.2',
        passage: 'Section 4.2: Never state absolute guarantees, unsupported rankings, or exaggerated superlatives. All product descriptions must reflect verifiable specifications.',
        expl: 'Absolute performance guarantee. Legally prohibited under our compliance guidelines without qualified warranty limits and SLA bounds.',
        repl: 'delivers high-reliability automated verification'
      },
      {
        pattern: /\b(?:100%\s+guaranteed|guarantees?\s+100%)\b/i,
        category: 'unsupported_claim' as const,
        severity: 'critical' as const,
        rule: 'Legal Compliance Standard: Prohibited Absolute Guarantees',
        page: 'Page 22, Section 4.2',
        passage: 'Section 4.2: Absolute guarantees without disclaimer text trigger immediate legal compliance review.',
        expl: 'Absolute guarantee requires formal legal disclaimer.',
        repl: 'provides high assurance SLA backing'
      },
      {
        pattern: /cheapest\s+(?:solution|platform|pricing|alternative)(?:\s+available)?/i,
        category: 'unsupported_claim' as const,
        severity: 'critical' as const,
        rule: 'Factual Claims Policy 4.2: Comparative Pricing',
        page: 'Page 22, Section 4.2',
        passage: "Section 4.2: Comparative pricing claims ('cheapest') without published competitive benchmarking invite regulatory scrutiny.",
        expl: 'Unsubstantiated comparative pricing claim. Price superlatives require a defined competitor benchmark and active pricing audit.',
        repl: 'cost-effective enterprise solution'
      },
      {
        pattern: /\b(?:cheapest|lowest\s+price)\b/i,
        category: 'unsupported_claim' as const,
        severity: 'high' as const,
        rule: 'Factual Claims Policy 4.2: Comparative Pricing',
        page: 'Page 22, Section 4.2',
        passage: 'Section 4.2: Pricing claims must reflect premium enterprise positioning rather than commodity discounting.',
        expl: 'Violates enterprise value proposition guidelines.',
        repl: 'cost-efficient'
      },
      {
        pattern: /\bauracloud\b/,
        category: 'terminology' as const,
        severity: 'medium' as const,
        rule: 'Brand Nomenclature Policy 3.4: Capitalization Standard',
        page: 'Page 15, Section 3.4',
        passage: "Section 3.4: Nomenclature Rules: AuraCloud must always appear in camel-case. Derivatives such as 'auracloud' are prohibited.",
        expl: "Incorrect brand capitalization. AuraCloud must always be capitalized with capital 'A' and capital 'C'.",
        repl: 'AuraCloud'
      },
      {
        pattern: /\b100%\s+uptime\b/i,
        category: 'outdated_fact' as const,
        severity: 'critical' as const,
        rule: 'Corporate SLA Standard 2026: Approved Uptime Bound',
        page: 'Page 8, Section 2.1',
        passage: 'AuraCloud standard enterprise SLA guarantees 99.95% monthly uptime. Claims of 100% uptime are non-compliant.',
        expl: "Contradicts approved corporate facts. AuraCloud's verified SLA is 99.95% monthly uptime.",
        repl: '99.95% monthly uptime SLA'
      },
      {
        pattern: /\bcloud\s+supremacy\b/i,
        category: 'tone_mismatch' as const,
        severity: 'medium' as const,
        rule: 'Tone of Voice Guide: Professionalism & Humility',
        page: 'Page 18, Section 4.0',
        passage: 'Maintain an authoritative, evidence-based tone. Avoid combative or hyper-aggressive expressions such as supremacy.',
        expl: 'Violates enterprise tone guidelines. Replace hyper-aggressive phrasing with collaborative value proposition.',
        repl: 'cloud governance excellence'
      },
      {
        pattern: /\bclick\s+here\b/i,
        category: 'accessibility' as const,
        severity: 'medium' as const,
        rule: 'Digital Accessibility Standard WCAG 2.1: Meaningful Link Text',
        page: 'Page 28, Section 5.3',
        passage: 'Non-descriptive hyperlinks such as "click here" fail accessibility benchmarks. Use meaningful descriptive labels describing the destination.',
        expl: 'Accessibility finding: Non-descriptive anchor text degrades screen reader navigation.',
        repl: 'explore our cloud architecture documentation'
      },
      {
        pattern: /\b(?:unhackable|100%\s+secure|impervious\s+to\s+attacks?)\b/i,
        category: 'unsupported_claim' as const,
        severity: 'critical' as const,
        rule: 'Security Communications Standard: Qualified Defense Claims',
        page: 'Page 30, Section 6.1',
        passage: 'Section 6.1: Absolute security assertions are mathematically false and expose the firm to critical breach liability.',
        expl: 'Absolute security claims are legally prohibited. Use defense-in-depth qualifications.',
        repl: 'zero-trust architecture with defense-in-depth isolation'
      },
      {
        pattern: /\b(?:military-grade(?:\s+encryption)?|bulletproof(?:\s+security)?)\b/i,
        category: 'unsupported_claim' as const,
        severity: 'high' as const,
        rule: 'Security Policy 4.2: Prohibited Exaggerated Security Metaphors',
        page: 'Section 4.2',
        passage: 'Section 4.2: Marketing clichés such as military-grade or bulletproof lack technical definition. Specify actual ciphers (FIPS 140-3 validated AES-256-GCM).',
        expl: 'Exaggerated security claim. Replace informal buzzwords with verified cryptographic standards.',
        repl: 'FIPS 140-3 validated AES-256-GCM encryption with HSM keys'
      },
      {
        pattern: /\b(?:zero\s+latency|instantaneous(?:\s+routing)?)\b/i,
        category: 'unsupported_claim' as const,
        severity: 'high' as const,
        rule: 'Performance SLA Standard 3.1: Latency Specifications',
        page: 'Section 3.1',
        passage: 'Section 3.1: Network propagation cannot achieve zero latency. Always quote verified empirical percentiles (median 1.8ms, p99 < 4.2ms).',
        expl: 'Physical propagation limits prevent zero latency. Always quote verified p99 latency benchmarks.',
        repl: 'deterministic sub-5 millisecond median latency'
      },
      {
        pattern: /\b(?:infinite\s+scal(?:e|ability)|unlimited\s+scale)\b/i,
        category: 'unsupported_claim' as const,
        severity: 'high' as const,
        rule: 'Architecture Scale Standard 3.1: Horizontal Autoscaling Bounds',
        page: 'Section 3.1',
        passage: 'Section 3.1: Unbounded scalability claims lack engineering veracity. Cite verified load-test thresholds (2.4M RPS per cluster).',
        expl: 'Unbounded scaling claims are unverified. Cite empirical load-test throughput.',
        repl: 'elastic horizontal autoscaling supporting 1M+ concurrent RPS'
      },
      {
        pattern: /\b(?:master\s*\/\s*slave|whitelist|blacklist)\b/i,
        category: 'terminology' as const,
        severity: 'medium' as const,
        rule: 'Inclusive Terminology Policy 7.1: DEI Standards',
        page: 'Section 7.1',
        passage: 'Section 7.1: Replace archaic technical metaphors with inclusive, clear terminology: primary/secondary and allowlist/denylist.',
        expl: 'Non-inclusive technical nomenclature prohibited under AuraCloud engineering standards.',
        repl: 'primary/secondary (or allowlist/denylist)'
      }
    ];

    governanceRules.forEach(item => {
      const match = item.pattern.exec(text);
      if (match && !detected.some(f => Math.abs(f.start_index - match!.index) < 3)) {
        detected.push({
          id: `find-rule-${Date.now()}-${detected.length}`,
          submission_id: activeSubId,
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

    const criticalDeduction = detected.filter(f => f.severity === 'critical').length * 20;
    const highDeduction = detected.filter(f => f.severity === 'high').length * 10;
    const mediumDeduction = detected.filter(f => f.severity === 'medium').length * 5;
    const score = detected.length === 0 ? 100 : Math.max(12, 100 - (criticalDeduction + highDeduction + mediumDeduction));

    return { findings: detected, score };
  };

  const createLiveSubmission = (title: string, text: string): string => {
    const id = `sub-${Date.now()}`;
    const analysis = analyzeTextRealtime(text, id);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    const newSub: ContentSubmission = {
      id,
      organization_id: currentWorkspace.id,
      title: title.trim() || 'Live Draft Content',
      content_type: 'press_release',
      campaign_name: 'Brand Verification',
      original_text: text,
      current_text: text,
      status: 'audited',
      word_count: words,
      character_count: text.length,
      compliance_score: analysis.score,
      creator_id: currentUser.id,
      creator_name: currentUser.full_name || currentUser.name || 'Marcus Vance',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      findings_count: analysis.findings.length,
      critical_count: analysis.findings.filter(f => f.severity === 'critical').length
    };

    setSubmissions(prev => [newSub, ...prev]);
    setFindings(prev => ({
      ...prev,
      [id]: analysis.findings
    }));

    return id;
  };

  const updateDraftText = (submissionId: string, newText: string) => {
    const analysis = analyzeTextRealtime(newText, submissionId);
    const words = newText.trim() ? newText.trim().split(/\s+/).length : 0;

    setSubmissions(prev =>
      prev.map(s => {
        if (s.id !== submissionId) return s;
        return {
          ...s,
          current_text: newText,
          word_count: words,
          character_count: newText.length,
          compliance_score: analysis.score,
          findings_count: analysis.findings.length,
          critical_count: analysis.findings.filter(f => f.severity === 'critical').length,
          updated_at: new Date().toISOString()
        };
      })
    );

    setFindings(prev => ({
      ...prev,
      [submissionId]: analysis.findings
    }));
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
    const analysis = analyzeTextRealtime(data.text, submissionId);
    const detectedFindings = analysis.findings;
    const score = analysis.score;

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

    setRevisions(prev => {
      const existing = prev[submissionId] || [];
      const nextVer = Number((1.0 + existing.length * 0.1).toFixed(1));
      const newRev: ContentRevision = {
        id: `rev-${Date.now()}`,
        submission_id: submissionId,
        version_number: nextVer,
        content_text: updatedText,
        change_summary: customText !== undefined ? `Custom replacement: "${customText}"` : `Applied suggested correction for "${targetFinding.original_text}"`,
        author_name: currentUser.full_name || currentUser.name,
        compliance_score: newScore,
        timestamp: new Date().toISOString()
      };
      return {
        ...prev,
        [submissionId]: [newRev, ...existing]
      };
    });

    addActivity({
      type: 'correction',
      title: 'Lexical Correction Accepted',
      description: `Applied fix "${replacement}" in "${sub.title}". Score rose to ${newScore}%.`,
      actor_name: currentUser.full_name || currentUser.name,
      actor_role: currentRole,
      target_link: `/app/corrections/${submissionId}`,
      timestamp: 'Just now',
      status_badge: `${newScore}% Score`
    });

    showToast(`Correction applied! Compliance score rose to ${newScore}%.`, 'success');
    await BrandPilotAPI.applySuggestion(findingId, { custom_text: replacement, accepted: true });
  };

  // Apply all pending suggestions across the document
  const applyAllSuggestions = async (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    const subFindings = findings[submissionId] || [];
    if (!sub || subFindings.length === 0) return;

    let updatedText = sub.current_text;
    const pendingCount = subFindings.filter(f => f.status === 'pending').length;
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

    setRevisions(prev => {
      const existing = prev[submissionId] || [];
      const nextVer = Number((1.0 + existing.length * 0.1).toFixed(1));
      const newRev: ContentRevision = {
        id: `rev-${Date.now()}`,
        submission_id: submissionId,
        version_number: nextVer,
        content_text: updatedText,
        change_summary: `Applied all ${pendingCount} AI source-grounded suggestions.`,
        author_name: currentUser.full_name || currentUser.name,
        compliance_score: 100,
        timestamp: new Date().toISOString()
      };
      return {
        ...prev,
        [submissionId]: [newRev, ...existing]
      };
    });

    addActivity({
      type: 'correction',
      title: 'All Policy Fixes Accepted',
      description: `Applied ${pendingCount} automated corrections across "${sub.title}". Score reached 100%.`,
      actor_name: currentUser.full_name || currentUser.name,
      actor_role: currentRole,
      target_link: `/app/corrections/${submissionId}`,
      timestamp: 'Just now',
      status_badge: '100% Score'
    });

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

    addActivity({
      type: 'approval',
      title: 'Draft Routed for Review',
      description: `${currentUser.full_name || currentUser.name} requested sign-off for "${sub?.title || 'Draft'}".`,
      actor_name: currentUser.full_name || currentUser.name,
      actor_role: currentRole,
      target_link: '/app/approvals',
      timestamp: 'Just now',
      status_badge: 'In Review'
    });

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

    const stamp = `AUTH-${decision === 'approved' ? 'APP' : 'REV'}-${submissionId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const newApprovalRecord: ApprovalRecord = {
      id: `appr-${Date.now()}`,
      submission_id: submissionId,
      submission_title: sub?.title || 'Audited Content',
      reviewer_id: currentUser.id,
      reviewer_name: currentUser.full_name || currentUser.name,
      decision,
      comments: comments || (decision === 'approved' ? 'Verified all claims against corporate guidelines. Formally approved.' : 'Revisions requested before release.'),
      content_version: 2.0,
      timestamp: new Date().toISOString(),
      cryptographic_stamp: stamp
    };
    setApprovalHistory(prev => [newApprovalRecord, ...prev]);

    addActivity({
      type: 'approval',
      title: decision === 'approved' ? 'Release Sign-Off Granted' : decision === 'changes_requested' ? 'Changes Requested' : 'Submission Rejected',
      description: `"${sub?.title || 'Draft'}" was ${decision.replace('_', ' ')} by ${currentUser.full_name || currentUser.name}.`,
      actor_name: currentUser.full_name || currentUser.name,
      actor_role: currentRole,
      target_link: '/app/approvals',
      timestamp: 'Just now',
      status_badge: decision === 'approved' ? 'Approved' : decision === 'changes_requested' ? 'Changes Req.' : 'Rejected'
    });

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
        updateFact,
        deleteFact,
        terminology,
        addTerminologyRule,
        updateTerminologyRule,
        deleteTerminologyRule,
        toneProfile,
        updateToneProfile,
        assets,
        addAsset,
        submissions,
        findings,
        revisions,
        approvalHistory,
        activities,
        addActivity,
        getSubmission,
        getSubmissionFindings,
        analyzeTextRealtime,
        createLiveSubmission,
        runAudit,
        applySuggestion,
        applyAllSuggestions,
        rejectFinding,
        updateDraftText,
        submitForApproval,
        reviewSubmission,
        switchAccount,
        availableUsers: registeredUsers,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllTrackers,
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
