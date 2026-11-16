'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBrandPilot } from '@/lib/store';
import {
  ShieldCheck,
  Sparkles,
  Check,
  X,
  Edit3,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  FileCheck2,
  Clock,
  CornerDownRight,
  Send,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function CorrectionStudioPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const {
    getSubmission,
    getSubmissionFindings,
    applySuggestion,
    rejectFinding,
    updateDraftText,
    submitForApproval,
    currentUser
  } = useBrandPilot();

  const submission = getSubmission(submissionId) || getSubmission('sub-demo-flagged');
  const findings = getSubmissionFindings(submission ? submission.id : 'sub-demo-flagged');

  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);
  const [editingFindingId, setEditingFindingId] = useState<string | null>(null);
  const [customReplacement, setCustomReplacement] = useState<string>('');
  const [isManualEditMode, setIsManualEditMode] = useState(false);
  const [manualText, setManualText] = useState(submission?.current_text || '');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionNote, setSubmissionNote] = useState('');

  if (!submission) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900">Submission Not Found</h2>
        <button
          onClick={() => router.push('/app/audit')}
          className="mt-4 px-4 py-2 bg-[#3978E8] text-white text-xs font-semibold rounded-lg"
        >
          Return to Audit Workspace
        </button>
      </div>
    );
  }

  // Count pending findings
  const pendingFindings = findings.filter(f => f.status === 'pending');
  const acceptedFindings = findings.filter(f => f.status === 'accepted');

  const handleApply = async (findingId: string) => {
    await applySuggestion(submission.id, findingId);
  };

  const handleReject = async (findingId: string) => {
    await rejectFinding(submission.id, findingId);
  };

  const handleSaveManualEdit = () => {
    updateDraftText(submission.id, manualText);
    setIsManualEditMode(false);
  };

  const handleSubmitForReview = async () => {
    await submitForApproval(submission.id, submissionNote);
    setIsSubmitModalOpen(false);
    router.push('/app/approvals');
  };

  // Render text with highlight spans
  const renderAnnotatedText = () => {
    const text = submission.current_text;
    // Find active pending findings present in the current text
    const activeMatches: {
      finding: (typeof findings)[0];
      startIndex: number;
      endIndex: number;
    }[] = [];

    findings.forEach(f => {
      if (f.status === 'pending') {
        const idx = text.indexOf(f.original_text);
        if (idx !== -1) {
          activeMatches.push({
            finding: f,
            startIndex: idx,
            endIndex: idx + f.original_text.length
          });
        }
      }
    });

    if (activeMatches.length === 0) {
      return <div className="whitespace-pre-wrap leading-relaxed">{text}</div>;
    }

    // Sort by start index
    activeMatches.sort((a, b) => a.startIndex - b.startIndex);

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    activeMatches.forEach((match, index) => {
      // Unhighlighted text before match
      if (match.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.startIndex)}</span>
        );
      }

      const isSelected = activeFindingId === match.finding.id;
      const severity = match.finding.severity;

      const badgeColor =
        severity === 'critical'
          ? 'bg-rose-100 text-rose-800 border-rose-300 ring-rose-400'
          : severity === 'high'
          ? 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-400'
          : 'bg-blue-100 text-blue-800 border-blue-300 ring-blue-400';

      elements.push(
        <mark
          key={`match-${match.finding.id}-${index}`}
          onClick={() => setActiveFindingId(match.finding.id)}
          className={`cursor-pointer px-1 py-0.5 rounded border transition-all inline-block font-medium ${badgeColor} ${
            isSelected ? 'ring-2' : ''
          }`}
          title={`Click to inspect finding: ${match.finding.relevant_brand_rule}`}
        >
          {text.substring(match.startIndex, match.endIndex)}
        </mark>
      );

      lastIndex = match.endIndex;
    });

    if (lastIndex < text.length) {
      elements.push(<span key={`text-end`}>{text.substring(lastIndex)}</span>);
    }

    return <div className="whitespace-pre-wrap leading-relaxed">{elements}</div>;
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Studio Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {submission.content_type.replace('_', ' ')}
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                submission.status === 'approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : submission.status === 'in_review' || submission.status === 'pending_review'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Status: {submission.status.replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">{submission.title}</h1>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span>Author: {submission.creator_name}</span>
            <span>•</span>
            <span>{submission.word_count} words</span>
            <span>•</span>
            <span>{pendingFindings.length} open issues remaining</span>
          </div>
        </div>

        {/* Live Compliance Score Meter & Submission CTA */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Compliance Score</div>
            <div
              className={`text-2xl font-black ${
                (submission.compliance_score ?? 0) >= 90
                  ? 'text-emerald-600'
                  : (submission.compliance_score ?? 0) >= 70
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {submission.compliance_score ?? 0}%
            </div>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-2.5 bg-[#101827] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Submit for Human Approval</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Draft Review Text Area */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">Interactive Draft Editor</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isManualEditMode) {
                    handleSaveManualEdit();
                  } else {
                    setManualText(submission.current_text);
                    setIsManualEditMode(true);
                  }
                }}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isManualEditMode ? 'Save Edits' : 'Edit Manually'}</span>
              </button>
            </div>
          </div>

          {isManualEditMode ? (
            <textarea
              rows={14}
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              className="w-full text-sm font-sans leading-relaxed p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          ) : (
            <div className="text-sm font-sans leading-relaxed text-slate-800 p-2 min-h-[300px]">
              {renderAnnotatedText()}
            </div>
          )}

          {/* Hint legend */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-200 border border-rose-400"></span> Critical
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-200 border border-amber-400"></span> High
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-blue-200 border border-blue-400"></span> Medium
              </span>
            </div>
            <span className="text-slate-400">Click any highlight to inspect citation</span>
          </div>
        </div>

        {/* Right Column (5 cols): Explainable Findings Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Source-Backed Findings ({findings.length})
            </h2>
            <span className="text-xs font-semibold text-emerald-600">
              {acceptedFindings.length} resolved
            </span>
          </div>

          {findings.map((finding, idx) => {
            const isSelected = activeFindingId === finding.id;
            const isResolved = finding.status === 'accepted';
            const isRejected = finding.status === 'rejected';

            return (
              <div
                key={finding.id}
                id={`card-${finding.id}`}
                onClick={() => setActiveFindingId(finding.id)}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-xs ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : isResolved
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-75'
                    : isRejected
                    ? 'border-slate-200 bg-slate-50 opacity-60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header: Severity & Category */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        finding.severity === 'critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : finding.severity === 'high'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {finding.severity}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">
                      {finding.category.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    Issue #{idx + 1}
                  </span>
                </div>

                {/* Flagged phrase */}
                <div className="text-xs text-slate-700 mb-2">
                  <span className="text-slate-400 font-medium">Flagged text: </span>
                  <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                    &quot;{finding.original_text}&quot;
                  </span>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {finding.explanation}
                </p>

                {/* Official Brand Citation Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
                    <BookOpen className="w-3.5 h-3.5 text-[#3978E8]" />
                    <span>{finding.relevant_brand_rule}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {finding.source_document} ({finding.page_reference})
                  </div>
                  <p className="italic text-slate-600 text-[11px] pt-1 border-t border-slate-200/60 leading-normal">
                    &quot;{finding.exact_supporting_passage}&quot;
                  </p>
                </div>

                {/* Suggested Replacement & Actions */}
                {finding.status === 'pending' ? (
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    {editingFindingId === finding.id ? (
                      <div className="space-y-2 p-2.5 bg-blue-50/50 rounded-lg border border-blue-200">
                        <label className="text-[11px] font-semibold text-slate-700 block">Custom Replacement</label>
                        <input
                          type="text"
                          value={customReplacement}
                          onChange={e => setCustomReplacement(e.target.value)}
                          className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                        />
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingFindingId(null)}
                            className="px-2 py-0.5 text-xs text-slate-500 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              applySuggestion(submission.id, finding.id, customReplacement);
                              setEditingFindingId(null);
                            }}
                            className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded"
                          >
                            Apply Custom
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Approved replacement:</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {finding.suggested_correction}
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-1">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setCustomReplacement(finding.suggested_correction);
                              setEditingFindingId(finding.id);
                            }}
                            className="px-2 py-1 text-slate-600 hover:text-slate-900 text-xs font-medium rounded hover:bg-slate-100 flex items-center gap-1"
                            title="Provide your own replacement phrasing"
                          >
                            <Edit3 className="w-3 h-3 text-slate-500" />
                            <span>Custom</span>
                          </button>

                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleReject(finding.id);
                            }}
                            className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-xs font-medium rounded hover:bg-slate-100"
                          >
                            Dismiss
                          </button>

                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleApply(finding.id);
                            }}
                            className="px-3.5 py-1.5 bg-[#3978E8] hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept Suggestion</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correction Applied
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">Score +12%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Human Approval Request Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Submit for Human Review</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This draft will be sent to designated brand reviewer <strong>Sarah Lin</strong>. Final approval requires explicit human sign-off.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Note for Reviewer
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Addressed all superlative claims and aligned with Section 4.2 guidelines."
                value={submissionNote}
                onChange={e => setSubmissionNote(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitForReview}
                className="px-4 py-2 bg-[#101827] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Sign-off</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
