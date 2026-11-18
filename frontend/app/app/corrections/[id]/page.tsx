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
  ExternalLink,
  Download,
  Copy,
  FileCode,
  FileText,
  Award,
  CheckCheck
} from 'lucide-react';

export default function CorrectionStudioPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const {
    getSubmission,
    getSubmissionFindings,
    applySuggestion,
    applyAllSuggestions,
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
  const [viewMode, setViewMode] = useState<'annotated' | 'editor' | 'diff'>('annotated');
  const [manualText, setManualText] = useState(submission?.current_text || '');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionNote, setSubmissionNote] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedExportFormat, setCopiedExportFormat] = useState<string | null>(null);

  const handleApply = async (findingId: string) => {
    if (!submission) return;
    await applySuggestion(submission.id, findingId);
  };

  const handleReject = async (findingId: string) => {
    if (!submission) return;
    await rejectFinding(submission.id, findingId);
  };

  const handleHighlightClick = (findingId: string) => {
    setActiveFindingId(findingId);
    if (typeof document !== 'undefined') {
      const cardEl = document.getElementById(`card-${findingId}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cardEl.classList.add('ring-4', 'ring-blue-500/30');
        setTimeout(() => cardEl.classList.remove('ring-4', 'ring-blue-500/30'), 1500);
      }
    }
  };

  // Keyboard ergonomics for power users: J/K to navigate, A to apply
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const pending = findings.filter(f => f.status === 'pending');
      if (pending.length === 0) return;

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIdx = pending.findIndex(f => f.id === activeFindingId);
        const nextIdx = currentIdx < pending.length - 1 ? currentIdx + 1 : 0;
        handleHighlightClick(pending[nextIdx].id);
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIdx = pending.findIndex(f => f.id === activeFindingId);
        const prevIdx = currentIdx > 0 ? currentIdx - 1 : pending.length - 1;
        handleHighlightClick(pending[prevIdx].id);
      } else if (e.key === 'a' || e.key === 'A') {
        if (activeFindingId) {
          e.preventDefault();
          handleApply(activeFindingId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFindingId, findings, submission]);

  // Export helpers
  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!submission) return;
    const mdContent = `---
title: "${submission.title}"
content_type: "${submission.content_type}"
compliance_score: ${submission.compliance_score}%
author: "${submission.creator_name}"
exported_at: "${new Date().toISOString()}"
governance_engine: "BrandPilot Enterprise"
---

# ${submission.title}

${submission.current_text}
`;
    const cleanFilename = submission.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    handleDownloadFile(mdContent, `${cleanFilename || 'draft'}-verified.md`, 'text/markdown');
    setCopiedExportFormat('md');
    setTimeout(() => setCopiedExportFormat(null), 2500);
  };

  const handleCopyHtml = () => {
    if (!submission) return;
    const paragraphs = submission.current_text
      .split(/\n\n+/)
      .map(p => `  <p>${p.trim()}</p>`)
      .join('\n');
    const htmlSnippet = `<article class="brandpilot-verified-content">\n  <h1>${submission.title}</h1>\n${paragraphs}\n</article>`;
    navigator.clipboard?.writeText(htmlSnippet);
    setCopiedExportFormat('html');
    setTimeout(() => setCopiedExportFormat(null), 2500);
  };

  const handleExportAuditReport = () => {
    if (!submission) return;
    const auditReport = {
      report_title: "BrandPilot Compliance Audit Executive Summary",
      document_title: submission.title,
      content_type: submission.content_type,
      author: submission.creator_name,
      compliance_score: submission.compliance_score,
      status: submission.status,
      timestamp: new Date().toISOString(),
      findings_resolved: findings.map(f => ({
        original_flagged: f.original_text,
        applied_correction: f.suggested_correction,
        category: f.category,
        severity: f.severity,
        rule_reference: f.relevant_brand_rule,
        citation: `${f.source_document} (${f.page_reference})`,
        status: f.status
      }))
    };
    handleDownloadFile(
      JSON.stringify(auditReport, null, 2),
      `audit-report-${submission.id.replace(/[^a-zA-Z0-9]/g, '')}.json`,
      'application/json'
    );
    setCopiedExportFormat('json');
    setTimeout(() => setCopiedExportFormat(null), 2500);
  };

  // Keep manual text in sync when automated suggestions are accepted or updated
  React.useEffect(() => {
    if (submission?.current_text) {
      setManualText(submission.current_text);
    }
  }, [submission?.current_text]);

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

  const handleSaveManualEdit = () => {
    updateDraftText(submission.id, manualText);
    setViewMode('annotated');
  };

  const handleSubmitForReview = async () => {
    await submitForApproval(submission.id, submissionNote);
    setIsSubmitModalOpen(false);
    router.push('/app/approvals');
  };

  // Render text with highlight spans (supporting case-insensitivity & overlap protection)
  const renderAnnotatedText = () => {
    const text = submission.current_text;
    const lowerText = text.toLowerCase();
    const activeMatches: {
      finding: (typeof findings)[0];
      startIndex: number;
      endIndex: number;
    }[] = [];

    findings.forEach(f => {
      if (f.status === 'pending') {
        const targetLower = f.original_text.toLowerCase();
        let pos = 0;
        while (pos < lowerText.length) {
          const idx = lowerText.indexOf(targetLower, pos);
          if (idx === -1) break;
          activeMatches.push({
            finding: f,
            startIndex: idx,
            endIndex: idx + targetLower.length
          });
          pos = idx + targetLower.length;
        }
      }
    });

    if (activeMatches.length === 0) {
      return (
        <div className="whitespace-pre-wrap leading-relaxed text-slate-800">
          {text}
        </div>
      );
    }

    // Sort by start index
    activeMatches.sort((a, b) => a.startIndex - b.startIndex || (b.endIndex - a.endIndex));

    // Filter out overlapping matches
    const nonOverlapping: typeof activeMatches = [];
    let curEnd = 0;
    activeMatches.forEach(m => {
      if (m.startIndex >= curEnd) {
        nonOverlapping.push(m);
        curEnd = m.endIndex;
      }
    });

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    nonOverlapping.forEach((match, index) => {
      if (match.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.startIndex)}</span>
        );
      }

      const isSelected = activeFindingId === match.finding.id;
      const severity = match.finding.severity;

      const badgeColor =
        severity === 'critical'
          ? 'bg-rose-100 text-rose-800 border-rose-300 ring-rose-400 hover:bg-rose-200'
          : severity === 'high'
          ? 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-400 hover:bg-amber-200'
          : 'bg-blue-100 text-blue-800 border-blue-300 ring-blue-400 hover:bg-blue-200';

      elements.push(
        <mark
          key={`match-${match.finding.id}-${index}`}
          onClick={() => handleHighlightClick(match.finding.id)}
          className={`cursor-pointer px-1.5 py-0.5 rounded-md border transition-all duration-200 inline-block font-semibold shadow-xs ${badgeColor} ${
            isSelected ? 'ring-2 ring-offset-1 scale-[1.03]' : ''
          }`}
          title={`Click to inspect rule: ${match.finding.relevant_brand_rule}`}
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
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Studio Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover-effect">
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
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {pendingFindings.length > 0 && (
            <button
              type="button"
              onClick={() => applyAllSuggestions(submission.id)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Accept All Fixes ({pendingFindings.length})</span>
            </button>
          )}

          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-center transition-all">
            <div className="text-xs text-slate-500 font-medium">Compliance Score</div>
            <div
              className={`text-2xl font-black transition-all ${
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
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl shadow-xs transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            title="Export verified content or compliance audit report"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-2.5 bg-[#101827] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
          >
            <span>Submit for Human Approval</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>

      {/* 100% Compliance Celebration Banner */}
      {((submission.compliance_score ?? 0) === 100 || pendingFindings.length === 0) && (
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-white animate-float" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                <span>100% Brand Compliance Achieved!</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono font-normal">
                  All Citations Verified
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Every guideline discrepancy has been corrected. This asset is ready for formal human publication sign-off.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>Submit for Sign-off Now</span>
          </button>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Draft Review Text Area */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 gap-2 flex-wrap">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('annotated')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'annotated'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annotated Review
              </button>
              <button
                type="button"
                onClick={() => {
                  setManualText(submission.current_text);
                  setViewMode('editor');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'editor'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Live Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('diff')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'diff'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Changes Diff
              </button>
            </div>

            {viewMode === 'editor' && (
              <button
                type="button"
                onClick={handleSaveManualEdit}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Apply Changes</span>
              </button>
            )}
          </div>

          {viewMode === 'editor' ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                <span>Direct Document Editor (Edits reflect live across audit findings)</span>
                <span>{manualText.trim() ? manualText.trim().split(/\s+/).filter(Boolean).length : 0} words • {manualText.length} chars</span>
              </div>
              <textarea
                rows={16}
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                placeholder="Type or edit your draft text here..."
                className="w-full text-sm font-sans leading-relaxed p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Tip: Click &quot;Save & Apply Changes&quot; above to re-index all findings against active brand rules.</span>
                <button
                  type="button"
                  onClick={() => setManualText(submission.original_text)}
                  className="text-slate-400 hover:text-slate-700 underline"
                >
                  Reset to Original Text
                </button>
              </div>
            </div>
          ) : viewMode === 'diff' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Original Uploaded Draft</span>
                    <span className="text-[10px] font-normal lowercase">initial audit</span>
                  </div>
                  <div className="text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-1">
                    {submission.original_text}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Current Compliant Version</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {submission.compliance_score}% score
                    </span>
                  </div>
                  <div className="text-xs text-slate-900 font-sans leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-1">
                    {submission.current_text}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div className="text-sm font-sans leading-relaxed text-slate-800 p-2 min-h-[300px]">
                {renderAnnotatedText()}
              </div>

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
                <span className="text-slate-400">Click any highlight to jump to citation card</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Explainable Findings Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Source-Backed Findings ({findings.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {acceptedFindings.length} resolved
              </span>
              {pendingFindings.length > 0 && (
                <button
                  type="button"
                  onClick={() => applyAllSuggestions(submission.id)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Accept all fixes
                </button>
              )}
            </div>
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
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs card-hover-effect ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : isResolved
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
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

      {/* Multi-Format Publishing & Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Publish & Export Content</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Export your verified, compliant draft into standard enterprise formats or export the complete audit trail.
            </p>

            <div className="space-y-3">
              {/* Option 1: Markdown (.md) */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Clean Markdown (.md)</div>
                    <div className="text-[11px] text-slate-500">Includes frontmatter metadata, headers, and clean prose</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedExportFormat === 'md' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{copiedExportFormat === 'md' ? 'Downloaded!' : 'Download .md'}</span>
                </button>
              </div>

              {/* Option 2: Clean HTML for CMS */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Copy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">CMS HTML Snippet</div>
                    <div className="text-[11px] text-slate-500">Formatted semantic HTML ready for WordPress, Webflow, or Notion</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedExportFormat === 'html' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedExportFormat === 'html' ? 'Copied HTML!' : 'Copy HTML'}</span>
                </button>
              </div>

              {/* Option 3: Compliance Audit JSON Trail */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Executive Audit Trail (.json)</div>
                    <div className="text-[11px] text-slate-500">Full audit log of resolved findings, policy citations, and timestamps</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportAuditReport}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedExportFormat === 'json' ? <CheckCheck className="w-3.5 h-3.5 text-white" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{copiedExportFormat === 'json' ? 'Exported!' : 'Export JSON'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
