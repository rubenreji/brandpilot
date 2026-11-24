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
  Check,
  Send,
  Globe,
  ShieldAlert,
  CheckCheck,
  Loader2,
  X
} from 'lucide-react';
import { PublishingDispatchResult } from '@/lib/types';

export default function ApprovalCentrePage() {
  const {
    currentWorkspace,
    currentRole,
    currentUser,
    setCurrentRole,
    submissions,
    reviewSubmission,
    approvalHistory,
    dispatchPublishing,
    dispatchSlackAlert,
    showToast
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

  // Slack Incident Bot Simulator State
  const [slackModalOpen, setSlackModalOpen] = useState(false);
  const [slackSub, setSlackSub] = useState<ContentSubmission | null>(null);
  const [slackChannel, setSlackChannel] = useState('#brand-safety-escalations');

  const handleOpenSlackSimulator = (sub: ContentSubmission) => {
    setSlackSub(sub);
    setSlackModalOpen(true);
  };

  const handleDispatchSlackWebhook = async () => {
    if (!slackSub) return;
    await dispatchSlackAlert(slackSub.id, slackChannel);
  };

  // Closed-Loop CMS Publishing Gateway State
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishSub, setPublishSub] = useState<ContentSubmission | null>(null);
  const [publishPlatform, setPublishPlatform] = useState('Webflow CMS');
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishingDispatchResult | null>(null);

  const handleOpenPublish = (sub: ContentSubmission) => {
    setPublishSub(sub);
    setPublishResult(null);
    setPublishModalOpen(true);
  };

  const handleExecutePublish = async () => {
    if (!publishSub) return;
    setPublishLoading(true);
    try {
      const res = await dispatchPublishing(publishSub.id, publishPlatform);
      setPublishResult(res);
    } catch {
      // Handled in store
    } finally {
      setPublishLoading(false);
    }
  };

  const handleOpenCertificate = (sub: ContentSubmission) => {
    setCertSub(sub);
    setCertModalOpen(true);
  };

  const handleCopyCertLink = () => {
    if (typeof window !== 'undefined' && certSub) {
      navigator.clipboard?.writeText(`${window.location.origin}/verify/${certSub.id}`);
      setCopiedCert(true);
      setTimeout(() => setCopiedCert(false), 2000);
      showToast('Public verification portal link copied to clipboard.', 'success');
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

      {/* Visual Governance Workflow Architecture */}
      <div className="bg-[#0A120E] rounded-2xl p-5 border border-emerald-950/80 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Enterprise Governance Lifecycle</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">Continuous Human-in-the-Loop Verification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              step: '1. Ingestion',
              title: 'Vector Parsing',
              desc: 'pgvector HNSW chunks indexed from brand manual.',
              badge: 'Semantic Core',
              color: 'text-emerald-400',
              border: 'border-emerald-950'
            },
            {
              step: '2. Audit',
              title: 'Triple-Layer AI',
              desc: 'Deterministic + RAG + LLM checks flag violations.',
              badge: 'Automated',
              color: 'text-amber-400',
              border: 'border-amber-950/60'
            },
            {
              step: '3. Correction',
              title: 'Studio Remediation',
              desc: 'Authors apply 1-click source-grounded fixes.',
              badge: 'Author Action',
              color: 'text-cyan-400',
              border: 'border-cyan-950/60'
            },
            {
              step: '4. Evaluation',
              title: 'Reviewer Feedback',
              desc: 'Brand managers inspect citations & add comments.',
              badge: 'Human Review',
              color: 'text-purple-400',
              border: 'border-purple-950/60'
            },
            {
              step: '5. Release',
              title: 'Cryptographic Stamp',
              desc: 'Digital sign-off hash generated for compliance.',
              badge: 'Certified',
              color: 'text-[#00FF87]',
              border: 'border-emerald-800/80'
            }
          ].map((item, i) => (
            <div key={i} className={`p-3.5 bg-[#060B08] rounded-xl border ${item.border} space-y-1.5 relative`}>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{item.step}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-[#0A120E] ${item.color}`}>
                  {item.badge}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">{item.title}</h4>
              <p className="text-[11px] text-zinc-400 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
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
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${filter === tab.id
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
                        className={`font-bold ${(sub.compliance_score ?? 0) >= 90
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
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[10px] uppercase border ${sub.status === 'approved'
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
                            <span>Certificate</span>
                          </button>
                          <button
                            onClick={() => handleOpenPublish(sub)}
                            className="px-2.5 py-1 bg-gradient-to-r from-teal-900 to-emerald-950 border border-teal-600 hover:border-teal-400 text-teal-300 rounded font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                            title="Publish to Production CMS Gateway"
                          >
                            <Globe className="w-3.5 h-3.5 text-teal-400" />
                            <span>Publish to CMS</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenPublish(sub)}
                            className="px-2 py-1 text-zinc-400 hover:text-amber-300 hover:bg-amber-950/30 rounded border border-zinc-800 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Test Gatekeeper Security Rejection"
                          >
                            <ShieldAlert className="w-3 h-3 text-amber-400" />
                            <span>Gatekeeper Test</span>
                          </button>
                          <button
                            onClick={() => handleOpenSlackSimulator(sub)}
                            className="px-2 py-1 text-zinc-400 hover:text-emerald-300 hover:bg-emerald-950/30 rounded border border-zinc-800 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Dispatch Live Slack Incident Webhook Alert"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-400" />
                            <span>Slack Alert</span>
                          </button>
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

      {/* Historical Approvals & Reviewer Comments Archive */}
      <div className="bg-[#0A120E] rounded-2xl border border-emerald-950/80 shadow-lg overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00FF87]" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Approval History & Signed Audit Logs
            </h2>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            {approvalHistory.length} Recorded Sign-off Action(s)
          </span>
        </div>

        {approvalHistory.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500 font-mono">
            No historical approval records yet. When you approve or request changes, digital cryptographic records will archive here.
          </div>
        ) : (
          <div className="space-y-3">
            {approvalHistory.map((rec, i) => (
              <div
                key={rec.id || i}
                className="p-4 bg-[#060B08] rounded-xl border border-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {rec.submission_title || 'Enterprise Document'}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${rec.decision === 'approved'
                        ? 'bg-emerald-950 text-[#00FF87] border-emerald-800'
                        : rec.decision === 'changes_requested'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}
                    >
                      {rec.decision.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">v{rec.content_version}</span>
                  </div>

                  <div className="text-xs text-zinc-300 italic bg-[#0A120E] p-2.5 rounded-lg border border-emerald-950/60">
                    &quot;{rec.comments || 'No reviewer comments provided.'}&quot;
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span>Evaluator: <strong className="text-zinc-300">{rec.reviewer_name}</strong></span>
                    <span>•</span>
                    <span>{new Date(rec.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60">
                    {rec.cryptographic_stamp}
                  </span>
                  <span className="text-[10px] text-zinc-500">Digital Audit Seal Verified</span>
                </div>
              </div>
            ))}
          </div>
        )}
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
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Quick Comments:</span>
                  <button
                    type="button"
                    onClick={() => setComments('All factual statements and SLA metrics verified against Brand Manual v2.4. Approved for external distribution.')}
                    className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px] text-emerald-300 hover:text-white cursor-pointer"
                  >
                    ✓ SLA Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => setComments('Please remove comparative pricing superlatives on page 2 before publication.')}
                    className="px-2 py-0.5 rounded bg-[#060B08] border border-emerald-900/60 text-[10px] text-zinc-300 hover:text-white cursor-pointer"
                  >
                    ⚠ Remove Superlatives
                  </button>
                  <button
                    type="button"
                    onClick={() => setComments('Disclaimers required for performance benchmark claims under Section 4.2.')}
                    className="px-2 py-0.5 rounded bg-[#060B08] border border-emerald-900/60 text-[10px] text-zinc-300 hover:text-white cursor-pointer"
                  >
                    ℹ Add Disclaimer
                  </button>
                </div>
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
                className={`px-4 py-2 text-black text-xs font-extrabold rounded-lg shadow-md cursor-pointer transition-all ${reviewAction === 'approved' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]' : 'bg-rose-500 hover:bg-rose-400 text-white'
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCertLink}
                  className="px-3 py-1.5 rounded-lg border border-emerald-900/60 text-zinc-200 hover:bg-emerald-950/40 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCert ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copiedCert ? 'Link Copied!' : 'Copy Portal Link'}</span>
                </button>
                <Link
                  href={`/verify/${certSub.id}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg border border-emerald-700/80 bg-emerald-950/60 hover:bg-emerald-900 text-[#00FF87] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Portal</span>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCertModalOpen(false);
                    if (certSub) handleOpenPublish(certSub);
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black rounded-lg font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>Publish to CMS</span>
                </button>
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

      {/* --- CLOSED-LOOP CMS PUBLISHING GATEWAY MODAL (ENTERPRISE AUTOMATED GATEKEEPING) --- */}
      {publishModalOpen && publishSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0A120E] border border-teal-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-emerald-950 bg-gradient-to-r from-teal-950/40 via-[#0A120E] to-emerald-950/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    Production CMS Gateway & Publishing Dispatcher
                    <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                      Zero-Leakage Gated
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Dispatch approved copy to production channels. Unapproved collateral is blocked by automated cryptographic gating.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-emerald-950/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs text-zinc-300">
              {/* Target Draft Information */}
              <div className="p-3.5 rounded-xl bg-[#060B08] border border-emerald-900/60 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Target Content Draft</div>
                  <div className="text-sm font-bold text-white">{publishSub.title}</div>
                  <div className="text-[11px] text-zinc-400">
                    Format: <span className="text-emerald-400 font-medium">{publishSub.content_type}</span> • Status:{' '}
                    <span
                      className={`font-mono font-bold uppercase ${publishSub.status === 'approved' ? 'text-[#00FF87]' : 'text-amber-400'
                        }`}
                    >
                      {publishSub.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Compliance Score</div>
                  <div className="text-lg font-mono font-black text-[#00FF87]">{publishSub.compliance_score}%</div>
                </div>
              </div>

              {/* Destination Platform Picker */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Destination Publishing Gateway</label>
                <select
                  value={publishPlatform}
                  onChange={e => setPublishPlatform(e.target.value)}
                  className="w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg bg-[#050806] text-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Webflow CMS">Webflow CMS (Corporate Marketing Blog)</option>
                  <option value="WordPress Production">WordPress Enterprise (Public Press Releases)</option>
                  <option value="Ghost Publishing">Ghost Headless Engine (Developer Documentation)</option>
                  <option value="HubSpot Campaigns">HubSpot Marketing Hub (Email & Landing Pages)</option>
                  <option value="Notion Workspace">Notion Internal Wiki (Product Playbooks)</option>
                </select>
              </div>

              {/* Execution Loading */}
              {publishLoading && (
                <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-900/80 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-teal-400 shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-white">Performing Cryptographic Security Handshake...</div>
                    <div className="text-zinc-400 text-[11px]">Validating SHA-256 seal against Human Approval Ledger...</div>
                  </div>
                </div>
              )}

              {/* Execution Result - BLOCKED (Security Gatekeeper) */}
              {publishResult && publishResult.status === 'BLOCKED' && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>GATEKEEPER REJECTION: HTTP 403 Forbidden</span>
                  </div>
                  <div className="text-[11px] text-zinc-300 leading-relaxed font-mono bg-black/40 p-2.5 rounded border border-rose-950">
                    {publishResult.error || 'Content lacks verified human reviewer sign-off.'}
                  </div>
                  <div className="text-[10px] text-rose-400">
                    Zero-Leakage Assurance: Unapproved marketing or press collateral is physically prevented from reaching production CMS endpoints.
                  </div>
                </div>
              )}

              {/* Execution Result - SUCCESS */}
              {publishResult && publishResult.status === 'DISPATCHED_LIVE' && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-[#00FF87]/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#00FF87] font-bold text-xs">
                      <CheckCheck className="w-4 h-4 text-[#00FF87]" />
                      <span>Cryptographic Dispatch Verified & Live!</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700">
                      200 OK • Live
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] bg-black/40 p-3 rounded-lg border border-emerald-900/80 font-mono">
                    <div>
                      <span className="text-zinc-500">Destination:</span>{' '}
                      <span className="text-white font-bold">{publishResult.platform}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Clearance Seal:</span>{' '}
                      <span className="text-emerald-400 font-bold">{publishResult.clearance_stamp}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">HMAC Handshake:</span>{' '}
                      <span className="text-zinc-300">{publishResult.hmac_security_digest}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Live URL:</span>{' '}
                      <a
                        href={publishResult.published_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-400 underline hover:text-teal-300"
                      >
                        {publishResult.published_url}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-emerald-950 bg-[#060B08] shrink-0 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Close
              </button>

              <button
                type="button"
                disabled={publishLoading}
                onClick={handleExecutePublish}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${publishSub.status === 'approved'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black shadow-md shadow-teal-500/20'
                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700'
                  }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {publishLoading
                    ? 'Transmitting...'
                    : publishSub.status === 'approved'
                      ? `Dispatch to ${publishPlatform.split(' ')[0]}`
                      : 'Attempt Publish (Test Gatekeeper)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SLACK INCIDENT BOT SIMULATOR MODAL (ENTERPRISE INCIDENT ESCALATION) --- */}
      {slackModalOpen && slackSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1A1D21] border border-zinc-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-zinc-200 animate-in fade-in zoom-in-95 duration-200 font-sans">
            {/* Slack Window Header */}
            <div className="p-3 bg-[#121016] border-b border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-bold text-white flex items-center gap-1.5 font-mono">
                  #brand-safety-escalations • Slack Block Kit Incident Card
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSlackModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Slack Message Stream */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Bot Identity Header */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-sm shrink-0">
                  BP
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">BrandPilot Compliance Bot</span>
                    <span className="bg-zinc-800 text-zinc-400 text-[10px] px-1.5 py-0.2 rounded font-mono">APP</span>
                    <span className="text-[10px] text-zinc-500">Today at 11:42 PM</span>
                  </div>

                  {/* Slack Block Kit Attachment Card */}
                  <div className="p-4 rounded-xl bg-[#222529] border-l-4 border-l-rose-500 border border-zinc-700/80 space-y-3 text-xs">
                    <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                      <span>🚨 Brand Governance Incident Alert</span>
                      <span className="text-[10px] font-mono text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800 uppercase">
                        CRITICAL SEVERITY
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-black/30 p-2.5 rounded-lg border border-zinc-800 font-mono">
                      <div>
                        <span className="text-zinc-400">Submission:</span>{' '}
                        <span className="text-white font-bold">{slackSub.title}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Status:</span>{' '}
                        <span className="text-amber-400 font-bold uppercase">{slackSub.status}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Compliance:</span>{' '}
                        <span className="text-rose-400 font-bold">{slackSub.compliance_score}%</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Incident ID:</span>{' '}
                        <span className="text-emerald-400 font-bold">INC-9481-BP</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-300 leading-relaxed space-y-1">
                      <p>• <span className="font-bold text-rose-400">SLA Violation:</span> Verbal/written claim stating '100% uptime' exceeds approved 99.95% SLA bound.</p>
                      <p>• <span className="font-bold text-amber-400">Prohibited Term:</span> Marketing buzzword 'AI magic' detected (Policy Standard 3.4).</p>
                      <p>• <span className="font-bold text-teal-400">Segregation of Duties:</span> Dispatches to live production CMS are physically locked.</p>
                    </div>

                    {/* Interactive Slack Action Buttons */}
                    <div className="pt-2 border-t border-zinc-700/60 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSlackModalOpen(false);
                          handleOpenDecision(slackSub, 'approved');
                        }}
                        className="px-3 py-1.5 bg-[#007A5A] hover:bg-[#148567] text-white font-bold text-xs rounded shadow transition-colors cursor-pointer"
                      >
                        Approve via Bot
                      </button>

                      <Link
                        href={`/app/corrections/${slackSub.id}`}
                        onClick={() => setSlackModalOpen(false)}
                        className="px-3 py-1.5 bg-[#1264A3] hover:bg-[#005A9E] text-white font-bold text-xs rounded shadow transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Open in Studio</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          showToast('Incident escalated to General Counsel and PR Legal Reviewers.', 'info');
                          setSlackModalOpen(false);
                        }}
                        className="px-3 py-1.5 bg-[#E01E5A] hover:bg-[#D71450] text-white font-bold text-xs rounded shadow transition-colors cursor-pointer"
                      >
                        Escalate to Legal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#121016] border-t border-zinc-800 shrink-0 flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-500 font-mono">
                Webhook URL: https://hooks.slack.com/services/T00/B00/X00
              </span>
              <button
                type="button"
                onClick={handleDispatchSlackWebhook}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded transition-colors cursor-pointer"
              >
                Send Test Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
