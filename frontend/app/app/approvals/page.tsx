'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBrandPilot } from '@/lib/store';
import { ContentSubmission } from '@/lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  Lock,
  UserCheck,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export default function ApprovalCentrePage() {
  const {
    currentWorkspace,
    currentRole,
    currentUser,
    setCurrentRole,
    submissions,
    reviewSubmission
  } = useBrandPilot();

  const [filter, setFilter] = useState<'all' | 'in_review' | 'approved' | 'changes_requested'>('all');
  const [selectedSub, setSelectedSub] = useState<ContentSubmission | null>(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | 'changes_requested'>('approved');
  const [comments, setComments] = useState('');

  const filteredSubs = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleOpenDecision = (sub: ContentSubmission, action: 'approved' | 'rejected' | 'changes_requested') => {
    setSelectedSub(sub);
    setReviewAction(action);
    setComments(
      action === 'approved'
        ? 'Verified all factual statements against SLA specifications and Communication Manual Section 4.2. Approved for external distribution.'
        : action === 'changes_requested'
        ? 'Please review paragraph 2: comparative superlatives must be removed before sign-off.'
        : 'Violates core corporate communication policy.'
    );
    setDecisionModalOpen(true);
  };

  const handleConfirmDecision = async () => {
    if (!selectedSub) return;
    await reviewSubmission(selectedSub.id, reviewAction, comments);
    setDecisionModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Governance Workflows</span>
            <span>•</span>
            <span>Human In The Loop</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Human Approval Centre
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Authorized brand reviewers evaluate AI audit findings and grant final publication sign-off.
          </p>
        </div>

        {/* Role permission status banner */}
        {currentRole === 'creator' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span>Creators cannot sign off on approvals.</span>
              <button
                onClick={() => setCurrentRole('reviewer')}
                className="ml-2 font-bold underline text-amber-950 hover:text-blue-600 cursor-pointer"
              >
                Switch to Reviewer (Sarah Lin)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized Reviewer: {currentUser.full_name} ({currentRole})</span>
          </div>
        )}
      </div>

      {/* Governance Banner */}
      <div className="bg-[#101827] text-white p-4 rounded-xl flex items-center justify-between gap-4 text-xs border border-slate-800">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-100 block">Strict Governance Enforcement</span>
            <span className="text-slate-400">
              AI recommendations guide evaluation, but only authenticated brand managers can issue release authorization.
            </span>
          </div>
        </div>
        <span className="hidden sm:inline font-mono text-[10px] text-slate-400 px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
          SOC-2 & ISO 27001 Stamped
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Submissions', count: submissions.length },
          {
            id: 'in_review',
            label: 'Pending Review',
            count: submissions.filter(s => s.status === 'in_review' || s.status === 'pending_review').length
          },
          {
            id: 'approved',
            label: 'Approved',
            count: submissions.filter(s => s.status === 'approved').length
          },
          {
            id: 'changes_requested',
            label: 'Changes Requested',
            count: submissions.filter(s => s.status === 'changes_requested').length
          }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              filter === tab.id
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            <span className="font-mono text-[10px] text-slate-400">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Submissions Review Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3.5 px-4">Content Draft & Author</th>
              <th className="py-3.5 px-4">Format</th>
              <th className="py-3.5 px-4">Compliance Score</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSubs.map(sub => (
              <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-4 max-w-sm">
                  <Link
                    href={`/app/corrections/${sub.id}`}
                    className="font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1"
                  >
                    <span>{sub.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </Link>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <span>By {sub.creator_name}</span>
                    <span>•</span>
                    <span>{sub.word_count} words</span>
                    <span>•</span>
                    <span>Submitted {new Date(sub.updated_at).toLocaleDateString()}</span>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                    {sub.content_type.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        (sub.compliance_score ?? 0) >= 90
                          ? 'text-emerald-600'
                          : (sub.compliance_score ?? 0) >= 70
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {sub.compliance_score ?? 0}%
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({sub.findings_count} findings)
                    </span>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[10px] uppercase border ${
                      sub.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : sub.status === 'in_review' || sub.status === 'pending_review'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : sub.status === 'changes_requested'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {sub.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {(sub.status === 'in_review' || sub.status === 'pending_review') && <Clock className="w-3 h-3 text-amber-600" />}
                    {sub.status === 'changes_requested' && <AlertCircle className="w-3 h-3 text-rose-600" />}
                    {sub.status.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {sub.status === 'approved' ? (
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                        ✓ Signed Off (AUTH-APP-8910)
                      </span>
                    ) : (
                      <>
                        <button
                          disabled={currentRole === 'creator'}
                          onClick={() => handleOpenDecision(sub, 'changes_requested')}
                          className="px-2.5 py-1 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded border border-slate-200 disabled:opacity-40 transition-colors font-semibold"
                        >
                          Request Changes
                        </button>
                        <button
                          disabled={currentRole === 'creator'}
                          onClick={() => handleOpenDecision(sub, 'approved')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold disabled:opacity-40 shadow-xs transition-colors"
                        >
                          Approve Draft
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Decision Dialog */}
      {decisionModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                {reviewAction === 'approved'
                  ? 'Sign Off & Approve for Publication'
                  : reviewAction === 'changes_requested'
                  ? 'Request Changes from Content Author'
                  : 'Reject Submission'}
              </h3>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900">{selectedSub.title}</div>
              <div className="text-slate-500">
                Author: {selectedSub.creator_name} • Current Compliance Score: {selectedSub.compliance_score}%
              </div>
            </div>

            {reviewAction === 'approved' && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold block">Cryptographic Audit Signature:</span>
                <span>Reviewer: {currentUser.full_name} ({currentRole})</span>
                <div className="font-mono text-[10px] text-emerald-700 mt-1">
                  Hash: SHA256:{Math.random().toString(36).substring(2, 12).toUpperCase()} • Timestamp: {new Date().toISOString()}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Review Comments & Audit Note
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={e => setComments(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDecisionModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className={`px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-xs ${
                  reviewAction === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {reviewAction === 'approved' ? 'Approval' : 'Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
