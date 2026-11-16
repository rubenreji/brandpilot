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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Team & Role Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage organization members, reviewers, content creators, and governance permissions.
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3978E8] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Colleague</span>
          </button>
        )}
      </div>

      {/* Role Definitions Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Organisation Administrator</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Full governance authority. Ingests guidelines, manages approved facts and terminology, invites team members, and reviews analytics.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Brand Manager / Reviewer</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Human approval gatekeeper. Reviews submitted drafts, inspects AI citations, requests revisions, and issues publication sign-off.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Content Creator</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Drafts and audits content. Evaluates automated findings, accepts suggested brand corrections, and submits revisions for approval.
          </p>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3.5 px-4">Member Name</th>
              <th className="py-3.5 px-4">Work Email</th>
              <th className="py-3.5 px-4">Title / Department</th>
              <th className="py-3.5 px-4">Assigned Role</th>
              <th className="py-3.5 px-4 text-right">Quick Switch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map(m => (
              <tr key={m.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4 font-bold text-slate-900">{m.name}</td>
                <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{m.email}</td>
                <td className="py-3.5 px-4 text-slate-500">{m.title}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                      m.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : m.role === 'reviewer'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
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
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-colors"
                  >
                    Simulate As →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newInvite.name}
                  onChange={e => setNewInvite({ ...newInvite, name: e.target.value })}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@auracloud.io"
                  value={newInvite.email}
                  onChange={e => setNewInvite({ ...newInvite, email: e.target.value })}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Role</label>
                <select
                  value={newInvite.role}
                  onChange={e => setNewInvite({ ...newInvite, role: e.target.value as any })}
                  className="mt-1 w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="creator">Content Creator</option>
                  <option value="reviewer">Brand Reviewer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3978E8] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 shadow-xs"
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
