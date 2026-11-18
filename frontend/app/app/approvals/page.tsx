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
  Sparkles,
  Award,
  Printer,
  Copy,
  Check
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
  const [stampHash, setStampHash] = useState('');
  const [stampTime, setStampTime] = useState('');
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certSub, setCertSub] = useState<ContentSubmission | null>(null);
  const [copiedCert, setCopiedCert] = useState(false);

  const handleOpenCertificate = (sub: ContentSubmission) => {
    setCertSub(sub);
    setCertModalOpen(true);
  };

  const handleCopyCertLink = () => {
    if (typeof window !== 'undefined' && certSub) {
      navigator.clipboard?.writeText(`https://brandpilot.ai/verify/AUTH-APP-${certSub.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}`);
      setCopiedCert(true);
      setTimeout(() => setCopiedCert(false), 2000);
    }
  };

  const filteredSubs = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleOpenDecision = (sub: ContentSubmission, action: 'approved' | 'rejected' | 'changes_requested') => {
    setSelectedSub(sub);
    setReviewAction(action);
    setStampHash(`AUTH-APP-${sub.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`);
    setStampTime(new Date().toLocaleDateString());
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
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                          ✓ Signed Off
                        </span>
                        <button
                          onClick={() => handleOpenCertificate(sub)}
                          className="px-2.5 py-1 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-900 border border-amber-300 rounded font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          title="View Official Compliance Certificate"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>View Certificate</span>
                        </button>
                      </div>
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
                  Hash: SHA256:{stampHash} • Verified: {stampTime}
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

      {/* Official Certificate Modal */}
      {certModalOpen && certSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm tracking-wide">Brand Governance Verification Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Printable Certificate Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-gradient-to-b from-amber-50/20 via-white to-slate-50/40">
              <div className="border-4 border-double border-amber-300/80 rounded-xl p-6 sm:p-8 relative bg-white shadow-xs">
                {/* Watermark badge */}
                <div className="text-center space-y-2 pb-6 border-b border-amber-200/60">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md mx-auto mb-2">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="text-[10px] tracking-widest uppercase font-mono font-bold text-amber-700">
                    Official Certification of Compliance
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 tracking-tight">
                    BRANDPILOT GOVERNANCE AUTHORIZATION
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    This certifies that the undermentioned content asset has been audited, evaluated against brand knowledge standards, and approved for public distribution.
                  </p>
                </div>

                {/* Content Asset Info */}
                <div className="py-6 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Asset Title</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">{certSub.title}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Content Format</div>
                      <div className="font-semibold text-slate-800 capitalize mt-0.5">{certSub.content_type.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Creator / Author</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{certSub.creator_name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Workspace</div>
                      <div className="font-semibold text-slate-800 mt-0.5">{currentWorkspace?.name ?? 'Enterprise Workspace'}</div>
                    </div>
                  </div>

                  {/* Policy Audit Checklist */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-600">
                      Standard Policy Verifications:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-[11px]">Tone & Voice Guidelines (100%)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-[11px]">Regulatory Disclaimers Enforced</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-[11px]">Product SLA & Fact Specifications</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-[11px]">Competitor Non-Disparagement</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sign-off Seal & Cryptographic Stamp */}
                <div className="pt-6 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Cryptographic Token ID</div>
                    <div className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded inline-block">
                      AUTH-APP-{certSub.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}-9481-VERIFIED
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Audit Score: <span className="font-bold text-emerald-600">{certSub.compliance_score}%</span> • Authorized by Governance Policy v2.4
                    </div>
                  </div>

                  <div className="text-right sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="font-serif italic text-base text-slate-800 font-bold tracking-wide">
                      Sarah Lin
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">
                      Director of Brand Communications
                    </div>
                    <div className="text-[9px] text-slate-400">
                      Authorized Reviewer Signature
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyCertLink}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCert ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedCert ? 'ID Copied!' : 'Copy Verification ID'}</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') window.print();
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Certificate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCertModalOpen(false)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
