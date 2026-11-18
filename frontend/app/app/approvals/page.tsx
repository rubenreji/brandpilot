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
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>Governance Workflows</span>
            <span>•</span>
            <span>Human In The Loop</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Human Approval Centre
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Authorized brand reviewers evaluate AI audit findings and grant final publication sign-off.
          </p>
        </div>

        {/* Role permission status banner */}
        {currentRole === 'creator' ? (
          <div className="bg-amber-950/60 border border-amber-800 rounded-xl p-3 flex items-center gap-3 text-xs text-amber-300">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span>Creators cannot sign off on approvals.</span>
              <button
                onClick={() => setCurrentRole('reviewer')}
                className="ml-2 font-bold underline text-white hover:text-emerald-400 cursor-pointer"
              >
                Switch to Reviewer (Sarah Lin)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs text-emerald-300 font-semibold shadow-sm">
            <UserCheck className="w-4 h-4 text-[#00FF87]" />
            <span>Authorized Reviewer: {currentUser.full_name} ({currentRole})</span>
          </div>
        )}
      </div>

      {/* Governance Banner */}
      <div className="bg-[#0A120E] text-white p-4 rounded-xl flex items-center justify-between gap-4 text-xs border border-emerald-900/60 shadow-md">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#00FF87] shrink-0" />
          <div>
            <span className="font-bold text-white block">Strict Governance Enforcement</span>
            <span className="text-zinc-400">
              AI recommendations guide evaluation, but only authenticated brand managers can issue release authorization.
            </span>
          </div>
        </div>
        <span className="hidden sm:inline font-mono text-[10px] text-emerald-400 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800">
          SOC-2 & ISO 27001 Stamped
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-950 pb-2 text-xs font-semibold">
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
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              filter === tab.id
                ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`font-mono text-[10px] ${filter === tab.id ? 'text-black' : 'text-zinc-500'}`}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Submissions Review Queue Table */}
      <div className="bg-[#0A120E] rounded-2xl border border-emerald-900/60 shadow-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#060B08] border-b border-emerald-950 text-zinc-400 uppercase font-semibold">
            <tr>
              <th className="py-3.5 px-4">Content Draft & Author</th>
              <th className="py-3.5 px-4">Format</th>
              <th className="py-3.5 px-4">Compliance Score</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-950/60">
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400/50 mb-1" />
                    <p className="text-sm font-bold text-zinc-200">No submissions in this review queue</p>
                    <p className="text-xs text-zinc-500 max-w-sm">
                      Trackers are reset. When drafts are audited and submitted for human review, they will appear here in real time.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubs.map(sub => (
              <tr key={sub.id} className="hover:bg-emerald-950/20 transition-colors">
                <td className="py-4 px-4 max-w-sm">
                  <Link
                    href={`/app/corrections/${sub.id}`}
                    className="font-bold text-white hover:text-[#00FF87] flex items-center gap-1"
                  >
                    <span>{sub.title}</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </Link>
                  <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
                    <span>By {sub.creator_name}</span>
                    <span>•</span>
                    <span>{sub.word_count} words</span>
                    <span>•</span>
                    <span>Submitted {new Date(sub.updated_at).toLocaleDateString()}</span>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span className="capitalize px-2 py-0.5 rounded bg-[#060B08] border border-emerald-950 text-emerald-400 font-mono text-[11px]">
                    {sub.content_type.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        (sub.compliance_score ?? 0) >= 90
                          ? 'text-[#00FF87]'
                          : (sub.compliance_score ?? 0) >= 70
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {sub.compliance_score ?? 0}%
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      ({sub.findings_count} findings)
                    </span>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[10px] uppercase border ${
                      sub.status === 'approved'
                        ? 'bg-emerald-950 text-[#00FF87] border-emerald-800'
                        : sub.status === 'in_review' || sub.status === 'pending_review'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : sub.status === 'changes_requested'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {sub.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-[#00FF87]" />}
                    {(sub.status === 'in_review' || sub.status === 'pending_review') && <Clock className="w-3 h-3 text-amber-400" />}
                    {sub.status === 'changes_requested' && <AlertCircle className="w-3 h-3 text-rose-400" />}
                    {sub.status.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {sub.status === 'approved' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#00FF87] bg-emerald-950 border border-emerald-800 px-2 py-1 rounded">
                          ✓ Signed Off
                        </span>
                        <button
                          onClick={() => handleOpenCertificate(sub)}
                          className="px-2.5 py-1 bg-emerald-950 border border-emerald-700 hover:bg-emerald-900/80 text-[#00FF87] rounded font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shadow-[0_0_10px_rgba(0,255,135,0.2)]"
                          title="View Official Compliance Certificate"
                        >
                          <Award className="w-3.5 h-3.5 text-[#00FF87]" />
                          <span>View Certificate</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          disabled={currentRole === 'creator'}
                          onClick={() => handleOpenDecision(sub, 'changes_requested')}
                          className="px-2.5 py-1 text-zinc-300 hover:text-white hover:bg-emerald-950/40 rounded border border-emerald-900/60 disabled:opacity-40 transition-colors font-semibold cursor-pointer"
                        >
                          Request Changes
                        </button>
                        <button
                          disabled={currentRole === 'creator'}
                          onClick={() => handleOpenDecision(sub, 'approved')}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black rounded font-extrabold disabled:opacity-40 shadow-sm transition-colors cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                        >
                          Approve Draft
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Review Decision Dialog */}
      {decisionModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-900/80 flex flex-col max-h-[85vh] my-auto overflow-hidden animate-scale-in text-zinc-100">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-emerald-950 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">
                  {reviewAction === 'approved'
                    ? 'Sign Off & Approve for Publication'
                    : reviewAction === 'changes_requested'
                    ? 'Request Changes from Content Author'
                    : 'Reject Submission'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDecisionModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0 space-y-3.5">
              <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 text-xs space-y-1">
                <div className="font-bold text-white">{selectedSub.title}</div>
                <div className="text-zinc-400">
                  Author: {selectedSub.creator_name} • Current Compliance Score: {selectedSub.compliance_score}%
                </div>
              </div>

              {reviewAction === 'approved' && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 space-y-1">
                  <span className="font-bold block text-white">Cryptographic Audit Signature:</span>
                  <span>Reviewer: {currentUser.full_name} ({currentRole})</span>
                  <div className="font-mono text-[10px] text-[#00FF87] mt-1">
                    Hash: SHA256:{stampHash} • Verified: {stampTime}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Review Comments & Audit Note
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  className="w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[#050806] text-white"
                />
              </div>
            </div>

            {/* Pinned Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-emerald-950 bg-[#060B08] shrink-0 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDecisionModalOpen(false)}
                className="px-3.5 py-2 text-xs text-zinc-400 hover:text-white font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className={`px-4 py-2 text-black text-xs font-extrabold rounded-lg shadow-md cursor-pointer transition-all ${
                  reviewAction === 'approved' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]' : 'bg-rose-500 hover:bg-rose-400 text-white'
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-2xl w-full shadow-2xl border border-emerald-900/80 overflow-hidden flex flex-col max-h-[85vh] my-auto animate-scale-in text-zinc-100">
            {/* Modal Header */}
            <div className="p-4 bg-[#060B08] border-b border-emerald-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#00FF87]" />
                <span className="font-bold text-sm tracking-wide">Brand Governance Verification Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="px-2.5 py-1 text-xs bg-[#0A120E] hover:bg-emerald-950/60 text-zinc-200 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-900/60"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Print / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Printable Certificate Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4 bg-[#050806]">
              <div className="border-2 border-emerald-500/50 rounded-xl p-5 sm:p-6 relative bg-[#070D09] shadow-xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                {/* Watermark badge */}
                <div className="text-center space-y-2 pb-5 border-b border-emerald-950">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-950 text-[#00FF87] border border-emerald-500/40 shadow-lg mx-auto mb-1 shadow-[0_0_15px_rgba(0,255,135,0.3)]">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div className="text-[10px] tracking-widest uppercase font-mono font-bold text-[#00FF87]">
                    Official Certification of Compliance
                  </div>
                  <h2 className="text-lg sm:text-xl font-serif font-extrabold text-white tracking-tight">
                    BRANDPILOT GOVERNANCE AUTHORIZATION
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    This certifies that the undermentioned content asset has been audited, evaluated against brand knowledge standards, and approved for public distribution.
                  </p>
                </div>

                {/* Content Asset Info */}
                <div className="py-5 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0A120E] p-3.5 rounded-xl border border-emerald-950">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Asset Title</div>
                      <div className="font-bold text-white text-sm mt-0.5">{certSub.title}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Content Format</div>
                      <div className="font-semibold text-zinc-200 capitalize mt-0.5">{certSub.content_type.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Creator / Author</div>
                      <div className="font-semibold text-zinc-200 mt-0.5">{certSub.creator_name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Workspace</div>
                      <div className="font-semibold text-zinc-200 mt-0.5">{currentWorkspace?.name ?? 'Enterprise Workspace'}</div>
                    </div>
                  </div>

                  {/* Policy Audit Checklist */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400">
                      Standard Policy Verifications:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                        <span className="font-medium text-[11px]">Tone & Voice Guidelines (100%)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                        <span className="font-medium text-[11px]">Regulatory Disclaimers Enforced</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                        <span className="font-medium text-[11px]">Product SLA & Fact Specifications</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                        <span className="font-medium text-[11px]">Competitor Non-Disparagement</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sign-off Seal & Cryptographic Stamp */}
                <div className="pt-5 border-t border-emerald-950 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Cryptographic Token ID</div>
                    <div className="font-mono text-[11px] font-bold text-[#00FF87] bg-emerald-950 border border-emerald-800 px-2 py-1 rounded inline-block">
                      AUTH-APP-{certSub.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}-9481-VERIFIED
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Audit Score: <span className="font-bold text-[#00FF87]">{certSub.compliance_score}%</span> • Authorized by Governance Policy v2.4
                    </div>
                  </div>

                  <div className="text-right sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="font-serif italic text-base text-white font-bold tracking-wide">
                      Sarah Lin
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 uppercase">
                      Director of Brand Communications
                    </div>
                    <div className="text-[9px] text-zinc-500">
                      Authorized Reviewer Signature
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-emerald-950 bg-[#060B08] shrink-0 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyCertLink}
                className="px-3 py-1.5 rounded-lg border border-emerald-900/60 text-zinc-200 hover:bg-emerald-950/40 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCert ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{copiedCert ? 'ID Copied!' : 'Copy Verification ID'}</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                >
                  <Printer className="w-3.5 h-3.5 text-black" />
                  <span>Print Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-3.5 py-2 bg-[#0A120E] border border-emerald-900/60 hover:bg-emerald-950/60 text-zinc-300 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
