'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { Users, UserPlus, Shield, CheckCircle2, Mail, Lock } from 'lucide-react';

export default function TeamPage() {
  const { currentWorkspace, currentRole, setCurrentRole, showToast } = useBrandPilot();

  const [members, setMembers] = useState([
    {
      id: 'm1',
      name: 'Elena Rostova',
      email: 'elena.rostova@auracloud.io',
      role: 'admin' as UserRole,
      title: 'VP of Brand & Corporate Governance'
    },
    {
      id: 'm2',
      name: 'Sarah Lin',
      email: 'sarah.lin@auracloud.io',
      role: 'reviewer' as UserRole,
      title: 'Senior Brand Manager'
    },
    {
      id: 'm3',
      name: 'Marcus Vance',
      email: 'marcus.vance@auracloud.io',
      role: 'creator' as UserRole,
      title: 'Content & Technical Marketing Lead'
    }
  ]);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({ name: '', email: '', role: 'creator' as UserRole });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvite.email) return;
    setMembers([
      ...members,
      {
        id: `m-${Date.now()}`,
        name: newInvite.name || newInvite.email.split('@')[0],
        email: newInvite.email,
        role: newInvite.role,
        title: 'Team Member'
      }
    ]);
    showToast(`Invited ${newInvite.email} as ${newInvite.role}!`, 'success');
    setIsInviteOpen(false);
    setNewInvite({ name: '', email: '', role: 'creator' });
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Access Control & Personas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Team & Role Permissions
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage organization members, reviewers, content creators, and governance permissions.
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)] cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Colleague</span>
          </button>
        )}
      </div>

      {/* Role Definitions Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A120E] rounded-2xl p-5 border border-purple-900/40 shadow-lg">
          <div className="flex items-center gap-2 font-black text-xs text-purple-300 uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Organisation Administrator</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Full governance authority. Ingests guidelines, manages approved facts and terminology, invites team members, and reviews analytics.
          </p>
        </div>

        <div className="bg-[#0A120E] rounded-2xl p-5 border border-cyan-900/40 shadow-lg">
          <div className="flex items-center gap-2 font-black text-xs text-cyan-300 uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Brand Manager / Reviewer</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Human approval gatekeeper. Reviews submitted drafts, inspects AI citations, requests revisions, and issues publication sign-off.
          </p>
        </div>

        <div className="bg-[#0A120E] rounded-2xl p-5 border border-emerald-900/40 shadow-lg">
          <div className="flex items-center gap-2 font-black text-xs text-emerald-300 uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Content Creator</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Drafts and audits content. Evaluates automated findings, accepts suggested brand corrections, and submits revisions for approval.
          </p>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-[#0A120E] rounded-2xl border border-emerald-950/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#060B08] border-b border-emerald-950 text-zinc-400 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Work Email</th>
                <th className="py-3.5 px-4">Title / Department</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4 text-right">Quick Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-[#060B08]/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-100">{m.name}</td>
                  <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">{m.email}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{m.title}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        m.role === 'admin'
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                          : m.role === 'reviewer'
                          ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setCurrentRole(m.role);
                        showToast(`Switched active persona to ${m.name} (${m.role})`, 'info');
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#060B08] hover:bg-emerald-950/50 hover:text-emerald-400 text-zinc-300 border border-emerald-900/60 transition-colors cursor-pointer"
                    >
                      Simulate As →
                    </button>
                  </td>
                </tr>
              ))}
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
                    className="w-full text-xs p-2.5 border border-emerald-900/60 rounded-xl bg-[#060B08] text-zinc-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="creator">Content Creator</option>
                    <option value="reviewer">Brand Reviewer</option>
                    <option value="admin">Administrator</option>
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
