'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import { UserRole } from '@/lib/types';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  XCircle,
  Lock,
  Sparkles,
  FileCheck2,
  Sliders,
  Scale,
  Award,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface PermissionRow {
  category: string;
  action: string;
  description: string;
  admin: boolean;
  reviewer: boolean;
  creator: boolean;
}

const PERMISSION_MATRIX: PermissionRow[] = [
  {
    category: 'Knowledge Base',
    action: 'Ingest Guidelines & Specs',
    description: 'Upload PDF and markdown brand documents into pgvector embeddings',
    admin: true,
    reviewer: false,
    creator: false
  },
  {
    category: 'Knowledge Base',
    action: 'Edit Terminology & Facts',
    description: 'Define prohibited words, preferred phrases, and verified technical claims',
    admin: true,
    reviewer: false,
    creator: false
  },
  {
    category: 'Content Auditing',
    action: 'Run Automated AI Audits',
    description: 'Submit raw draft copy for deterministic + RAG compliance scanning',
    admin: true,
    reviewer: true,
    creator: true
  },
  {
    category: 'Correction Studio',
    action: 'Accept / Reject AI Suggestions',
    description: 'Apply high-confidence automated rewrites and generate clean revisions',
    admin: true,
    reviewer: false,
    creator: true
  },
  {
    category: 'Governance & Approval',
    action: 'Review Approval Queue',
    description: 'Evaluate submitted drafts against guidelines and cite policy violations',
    admin: true,
    reviewer: true,
    creator: false
  },
  {
    category: 'Governance & Approval',
    action: 'Issue Publication Sign-off',
    description: 'Cryptographically stamp final compliance approval for public release',
    admin: true,
    reviewer: true,
    creator: false
  },
  {
    category: 'Analytics & Telemetry',
    action: 'View Team Friction Heatmap',
    description: 'Inspect violation trends, turnaround velocity, and team compliance metrics',
    admin: true,
    reviewer: true,
    creator: true
  },
  {
    category: 'Administration',
    action: 'Manage Team & Permissions',
    description: 'Invite members, assign governance roles, and configure workspace settings',
    admin: true,
    reviewer: false,
    creator: false
  }
];

export default function TeamPage() {
  const {
    currentWorkspace,
    currentRole,
    setCurrentRole,
    currentUser,
    switchAccount,
    teamMembers,
    inviteTeamMember,
    updateMemberRole,
    showToast,
    isSupabaseActive,
    dbSyncStatus
  } = useBrandPilot();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({ name: '', email: '', role: 'creator' as UserRole });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvite.email) return;
    await inviteTeamMember({
      name: newInvite.name || newInvite.email.split('@')[0],
      email: newInvite.email,
      role: newInvite.role
    });
    setIsInviteOpen(false);
    setNewInvite({ name: '', email: '', role: 'creator' });
  };

  const roleCapabilities = {
    admin: {
      badge: 'Organisation Administrator',
      badgeColor: 'bg-emerald-950 border-emerald-500/50 text-[#00FF87]',
      summary: 'You currently have unrestricted global governance authority across all 8 modules.',
      allowed: ['Full Rule Editing', 'Guideline Ingestion', 'Audit & Corrections', 'Gatekeeper Approval', 'User Management']
    },
    reviewer: {
      badge: 'Brand Reviewer / Gatekeeper',
      badgeColor: 'bg-cyan-950 border-cyan-500/50 text-cyan-300',
      summary: 'You are responsible for reviewing submitted copy, auditing claims, and cryptographically signing off releases.',
      allowed: ['Audit Submissions', 'Request Changes', 'Review AI Citations', 'Issue Final Sign-off', 'View Analytics']
    },
    creator: {
      badge: 'Content Creator',
      badgeColor: 'bg-emerald-950 border-emerald-800 text-emerald-400',
      summary: 'You draft, audit, and refine candidate copy. Submissions require Reviewer or Admin sign-off before release.',
      allowed: ['Run Content Audits', 'Accept AI Suggestions', 'Submit to Review Queue', 'Inspect Diff Revisions']
    }
  }[currentRole];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Access Control & Personas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Team & Role-Based Access Control
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Enforce segregation of duties between content authors, compliance reviewers, and workspace administrators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#060B08] border border-emerald-900/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse shadow-[0_0_8px_#00FF87]"></span>
            <span className="text-zinc-400 font-medium">Supabase Cloud:</span>
            <span className="font-bold text-[#00FF87]">Persistent RBAC ({dbSyncStatus.toUpperCase()})</span>
          </div>

          {currentRole === 'admin' && (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-black" />
              <span>Invite Colleague</span>
            </button>
          )}
        </div>
      </div>

      {/* Active RBAC Persona Switcher */}
      <div className="bg-[#0A120E] border-2 border-emerald-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#00FF87]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Active Governance Persona:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${roleCapabilities.badgeColor}`}>
                  {roleCapabilities.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1">
                {roleCapabilities.summary}
              </p>
            </div>
          </div>

          {/* Quick Persona Switcher */}
          <div className="flex items-center gap-1.5 bg-[#060B08] p-1.5 rounded-xl border border-emerald-950 shrink-0">
            <span className="text-[10px] font-bold text-zinc-400 px-2 uppercase tracking-wider">Switch Persona:</span>
            <button
              onClick={() => {
                setCurrentRole('admin');
                showToast('Switched to Administrator Persona', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => {
                setCurrentRole('reviewer');
                showToast('Switched to Reviewer Persona', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'reviewer'
                  ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-cyan-950/40'
              }`}
            >
              Reviewer
            </button>
            <button
              onClick={() => {
                setCurrentRole('creator');
                showToast('Switched to Creator Persona', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'creator'
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              Creator
            </button>
          </div>
        </div>

        {/* Enabled Capabilities Pills */}
        <div className="pt-3 border-t border-emerald-950/80 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Your Active Capabilities:</span>
          {roleCapabilities.allowed.map(cap => (
            <span
              key={cap}
              className="px-2.5 py-1 rounded-md bg-[#060B08] border border-emerald-900/60 text-zinc-200 text-[11px] font-medium flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3 h-3 text-[#00FF87]" />
              <span>{cap}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Role-Based Access Control Permission Matrix */}
      <div className="bg-[#0A120E] rounded-2xl border border-emerald-900/60 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00FF87]" />
              <span>Role-Based Access Control (RBAC) Permission Matrix</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Auditable operational permissions mapped to compliance governance tiers
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF87]" /> Authorized
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Lock className="w-3.5 h-3.5 text-zinc-600" /> Restricted
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#060B08] border-b border-emerald-950 text-zinc-400 uppercase font-black tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Permission Module & Action</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Governance Description</th>
                <th className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-white">Admin</span>
                    <span className="text-[10px] text-emerald-400 font-normal">Governance Lead</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-white">Reviewer</span>
                    <span className="text-[10px] text-cyan-400 font-normal">Gatekeeper</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-white">Creator</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Content Author</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60 font-sans">
              {PERMISSION_MATRIX.map((perm, idx) => (
                <tr key={idx} className="hover:bg-[#060B08]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{perm.category}</div>
                    <div className="font-bold text-zinc-100 mt-0.5">{perm.action}</div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 text-xs hidden md:table-cell max-w-sm">
                    {perm.description}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {perm.admin ? (
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800 text-[#00FF87]">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-black/40 border border-zinc-900 text-zinc-700">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {perm.reviewer ? (
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-black/40 border border-zinc-900 text-zinc-700">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {perm.creator ? (
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800 text-[#00FF87]">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-black/40 border border-zinc-900 text-zinc-700">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-[#0A120E] rounded-2xl border border-emerald-950/80 shadow-lg overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-emerald-950 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-white">Active Organization Roster</h2>
            <p className="text-xs text-zinc-400">Team members provisioned with persistent access in {currentWorkspace.name}</p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#060B08] border border-emerald-950 text-emerald-400">
            {teamMembers.length} Members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#060B08] border-b border-emerald-950 text-zinc-400 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Work Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4 text-right">Switch Active Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {teamMembers.map(m => {
                const isActive = currentUser.id === m.id || currentUser.email.toLowerCase() === m.email.toLowerCase();
                return (
                  <tr key={m.id} className="hover:bg-[#060B08]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-zinc-100 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-800 text-[11px] font-black text-[#00FF87] flex items-center justify-center">
                        {(m.full_name || m.name || 'U').charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <div>{m.full_name || m.name}</div>
                        {isActive && (
                          <span className="text-[10px] text-[#00FF87] font-semibold">Active Session</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">{m.email}</td>
                    <td className="py-3.5 px-4">
                      {currentRole === 'admin' ? (
                        <select
                          value={m.role}
                          onChange={e => updateMemberRole(m.id, e.target.value as UserRole)}
                          className="bg-[#060B08] border border-emerald-900/60 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="admin">Admin</option>
                          <option value="reviewer">Reviewer</option>
                          <option value="creator">Creator</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                            m.role === 'admin'
                              ? 'bg-emerald-950 text-[#00FF87] border-emerald-600'
                              : m.role === 'reviewer'
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                          }`}
                        >
                          {m.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => switchAccount(m.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : 'bg-[#060B08] hover:bg-emerald-950/50 hover:text-emerald-400 text-zinc-300 border-emerald-900/60'
                        }`}
                      >
                        {isActive ? '✓ Active Persona' : 'Switch Persona →'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-md w-full shadow-2xl border border-emerald-900/60 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <h3 className="text-base font-black text-white">Invite Team Member</h3>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer p-1"
              >
                ✕ Close
              </button>
            </div>
            <form onSubmit={handleInvite} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Miller"
                    value={newInvite.name}
                    onChange={e => setNewInvite({ ...newInvite, name: e.target.value })}
                    className="w-full text-xs p-2.5 border border-emerald-900/60 bg-[#060B08] text-zinc-100 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@auracloud.io"
                    value={newInvite.email}
                    onChange={e => setNewInvite({ ...newInvite, email: e.target.value })}
                    className="w-full text-xs p-2.5 border border-emerald-900/60 bg-[#060B08] text-zinc-100 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Role</label>
                  <select
                    value={newInvite.role}
                    onChange={e => setNewInvite({ ...newInvite, role: e.target.value as any })}
                    className="w-full text-xs p-2.5 border border-emerald-900/60 rounded-xl bg-[#060B08] text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="creator">Content Creator (Audits & Edits)</option>
                    <option value="reviewer">Brand Reviewer (Gatekeeper Sign-off)</option>
                    <option value="admin">Administrator (Global Governance)</option>
                  </select>
                </div>
              </div>

              <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl shadow-lg cursor-pointer transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
