'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  CheckCheck,
  FilePlus,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function CorrectionStudioPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const {
    submissions,
    getSubmission,
    getSubmissionFindings,
    applySuggestion,
    applyAllSuggestions,
    rejectFinding,
    updateDraftText,
    submitForApproval,
    analyzeTextRealtime,
    createLiveSubmission,
    showToast,
    currentUser
  } = useBrandPilot();

  const submission = (submissionId && submissionId !== 'live' ? getSubmission(submissionId) : null) || (submissions && submissions[0]) || null;
  const findings = getSubmissionFindings(submission ? submission.id : '');

  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);
  const [editingFindingId, setEditingFindingId] = useState<string | null>(null);
  const [customReplacement, setCustomReplacement] = useState<string>('');
  const [viewMode, setViewMode] = useState<'annotated' | 'side_by_side' | 'editor' | 'diff'>('side_by_side');
  const [manualText, setManualText] = useState(submission?.current_text || '');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionNote, setSubmissionNote] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedExportFormat, setCopiedExportFormat] = useState<string | null>(null);
  const [isNewDraftModalOpen, setIsNewDraftModalOpen] = useState(false);
  const [newDraftTitle, setNewDraftTitle] = useState('');
  const [newDraftContent, setNewDraftContent] = useState('');

  const handleCreateCustomDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraftContent.trim()) {
      showToast('Please enter content to analyze.', 'error');
      return;
    }
    const title = newDraftTitle.trim() || 'Custom Draft Content';
    const newId = createLiveSubmission(title, newDraftContent);
    setIsNewDraftModalOpen(false);
    setNewDraftTitle('');
    setNewDraftContent('');
    setManualText(newDraftContent);
    showToast('Live content loaded! Real-time AI analysis active.', 'success');
    router.push(`/app/corrections/${newId}`);
  };

  const handleLiveTextChange = (text: string) => {
    setManualText(text);
    if (submission) {
      updateDraftText(submission.id, text);
    }
  };

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
    if (!submission) return null;
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
          ? 'bg-rose-950/80 text-rose-300 border-rose-600/70 ring-rose-400 hover:bg-rose-900/90'
          : severity === 'high'
          ? 'bg-amber-950/80 text-amber-300 border-amber-600/70 ring-amber-400 hover:bg-amber-900/90'
          : 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70 ring-emerald-400 hover:bg-emerald-900/90';

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

  if (!submission) {
    return (
      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6 text-zinc-100">
        <div className="bg-[#0A120E] rounded-2xl p-8 border border-emerald-900/60 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Edit3 className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-white">Correction Studio Ready</h1>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            All trackers are reset to zero. Start tracking by entering new text or auditing candidate content.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/app/corrections"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl shadow-[0_0_16px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
            >
              Enter Text to Analyze →
            </Link>
            <Link
              href="/app/audit"
              className="px-5 py-2.5 bg-[#060B08] hover:bg-emerald-950/60 border border-emerald-900/60 text-zinc-200 text-xs font-bold rounded-xl transition-all"
            >
              Upload Document →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Studio Header Bar */}
      <div className="bg-[#0A120E] rounded-2xl p-5 border border-emerald-900/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover-effect">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              {submission.content_type.replace('_', ' ')}
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                submission.status === 'approved'
                  ? 'bg-emerald-950 text-[#00FF87] border-emerald-700'
                  : submission.status === 'in_review' || submission.status === 'pending_review'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-rose-950 text-rose-300 border-rose-800'
              }`}
            >
              Status: {submission.status.replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white">{submission.title}</h1>
          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
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
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_18px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Accept All Fixes ({pendingFindings.length})</span>
            </button>
          )}

          <div className="bg-[#060B08] px-4 py-2 rounded-xl border border-emerald-950 text-center transition-all">
            <div className="text-xs text-zinc-400 font-medium">Compliance Score</div>
            <div
              className={`text-2xl font-black transition-all ${
                (submission.compliance_score ?? 0) >= 90
                  ? 'text-[#00FF87]'
                  : (submission.compliance_score ?? 0) >= 70
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {submission.compliance_score ?? 0}%
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNewDraftModalOpen(true)}
            className="px-3.5 py-2.5 bg-[#060B08] border border-emerald-900/60 hover:bg-emerald-950/60 text-emerald-400 text-xs font-semibold rounded-xl shadow-xs transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            title="Type or paste any custom text to analyze live"
          >
            <FilePlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Analyze Custom Text</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2.5 bg-[#060B08] border border-emerald-900/60 hover:bg-emerald-950/60 text-zinc-200 text-xs font-semibold rounded-xl shadow-xs transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            title="Export verified content or compliance audit report"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer shadow-[0_0_18px_rgba(16,185,129,0.35)]"
          >
            <span>Submit for Human Approval</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* 100% Compliance Celebration Banner */}
      {((submission.compliance_score ?? 0) === 100 || pendingFindings.length === 0) && (
        <div className="bg-gradient-to-r from-emerald-950 via-[#0A1A12] to-emerald-950 text-white rounded-2xl p-4 sm:p-5 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Award className="w-6 h-6 text-[#00FF87] animate-float" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                <span>100% Brand Compliance Achieved!</span>
                <span className="text-xs bg-emerald-900/60 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-mono font-normal">
                  All Citations Verified
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                Every guideline discrepancy has been corrected. This asset is ready for formal human publication sign-off.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 rounded-xl text-xs font-extrabold transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer transform hover:scale-105 active:scale-95 shadow-[0_0_14px_rgba(16,185,129,0.4)]"
          >
            <Send className="w-3.5 h-3.5 text-black" />
            <span>Submit for Sign-off Now</span>
          </button>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Draft Review Text Area */}
        <div className="lg:col-span-7 bg-[#0A120E] rounded-2xl border border-emerald-900/60 p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-950 gap-2 flex-wrap">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1.5 bg-[#050806] p-1 rounded-xl border border-emerald-950 flex-wrap">
              <button
                type="button"
                onClick={() => setViewMode('side_by_side')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'side_by_side'
                    ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Before / After Comparison
              </button>
              <button
                type="button"
                onClick={() => setViewMode('annotated')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'annotated'
                    ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
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
                    ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Edit3 className={`w-3.5 h-3.5 ${viewMode === 'editor' ? 'text-black' : 'text-emerald-400'}`} />
                <span>Live Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('diff')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'diff'
                    ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Changes Diff
              </button>
            </div>

            {viewMode === 'editor' && (
              <button
                type="button"
                onClick={() => setViewMode('annotated')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Done Editing (View Highlights)</span>
              </button>
            )}
          </div>

          {viewMode === 'side_by_side' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Before (Original Draft) */}
                <div className="p-4 bg-[#060B08] border border-rose-900/60 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-rose-950">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      Before (Pre-Audit Raw Copy)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      v1.0 Ingestion
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-1">
                    {submission.original_text}
                  </div>
                  <div className="pt-2 border-t border-emerald-950/60 text-[10px] text-zinc-500 flex items-center justify-between">
                    <span>{pendingFindings.length} unresolved issues</span>
                    <span className="text-rose-400 font-bold">Score: 34%</span>
                  </div>
                </div>

                {/* Right: After (Live Corrected Version) */}
                <div className="p-4 bg-[#060B08] border border-emerald-800/80 rounded-xl space-y-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      After (Live Corrected Draft)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-[#00FF87] border border-emerald-700">
                      Current Live
                    </span>
                  </div>
                  <div className="text-xs text-white font-sans leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-1">
                    {submission.current_text}
                  </div>
                  <div className="pt-2 border-t border-emerald-950/60 text-[10px] text-zinc-400 flex items-center justify-between">
                    <span>{acceptedFindings.length} corrections applied</span>
                    <span className="text-emerald-400 font-extrabold font-mono">Score: {submission.compliance_score}%</span>
                  </div>
                </div>
              </div>
            </div>
          ) : viewMode === 'editor' ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-medium px-1">
                <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse shadow-[0_0_6px_#00FF87]"></span>
                  Real-time AI Analysis Active
                </span>
                <span className="text-zinc-500 font-mono">
                  {manualText.trim() ? manualText.trim().split(/\s+/).filter(Boolean).length : 0} words • {manualText.length} chars
                </span>
              </div>
              <textarea
                rows={16}
                value={manualText}
                onChange={e => handleLiveTextChange(e.target.value)}
                placeholder="Type or paste any marketing copy, ad text, press release, or document here to test real-time AI compliance analysis..."
                className="w-full text-sm font-sans leading-relaxed p-4 border border-emerald-900/60 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white bg-[#050806] shadow-inner font-mono sm:font-sans"
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                <span>Findings and compliance score automatically recalculate on every keystroke.</span>
                <button
                  type="button"
                  onClick={() => handleLiveTextChange(submission.original_text)}
                  className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset to Original Text
                </button>
              </div>
            </div>
          ) : viewMode === 'diff' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-950/30 border border-rose-900/60 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Original Uploaded Draft</span>
                    <span className="text-[10px] font-normal lowercase">initial audit</span>
                  </div>
                  <div className="text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-1">
                    {submission.original_text}
                  </div>
                </div>

                <div className="p-4 bg-emerald-950/30 border border-emerald-900/60 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Current Compliant Version</span>
                    <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                      {submission.compliance_score}% score
                    </span>
                  </div>
                  <div className="text-xs text-white font-sans leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-1">
                    {submission.current_text}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div className="text-sm font-sans leading-relaxed text-zinc-200 p-2 min-h-[300px]">
                {renderAnnotatedText()}
              </div>

              {/* Hint legend */}
              <div className="pt-3 border-t border-emerald-950 flex items-center justify-between text-[11px] text-zinc-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.6)]"></span> Critical
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.6)]"></span> High
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.6)]"></span> Medium
                  </span>
                </div>
                <span className="text-zinc-500">Click any highlight to jump to citation card</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Explainable Findings Cards */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto pr-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400/80">
              Source-Backed Findings ({findings.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                {acceptedFindings.length} resolved
              </span>
              {pendingFindings.length > 0 && (
                <button
                  type="button"
                  onClick={() => applyAllSuggestions(submission.id)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
                >
                  Accept all fixes
                </button>
              )}
            </div>
          </div>

          {findings.length === 0 ? (
            <div className="bg-[#0A120E] border border-emerald-900/60 rounded-2xl p-6 text-center space-y-3 animate-fade-in shadow-md">
              <div className="w-12 h-12 bg-emerald-950 text-[#00FF87] border border-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-[0_0_12px_rgba(0,255,135,0.2)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="font-extrabold text-white text-sm">Zero Compliance Violations</div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                All phrasing in this draft fully aligns with your active brand terminology, tone rules, and verified guidelines.
              </p>
            </div>
          ) : (
            findings.map((finding, idx) => {
              const isSelected = activeFindingId === finding.id;
              const isResolved = finding.status === 'accepted';
              const isRejected = finding.status === 'rejected';

              return (
                <div
                  key={finding.id}
                  id={`card-${finding.id}`}
                  onClick={() => setActiveFindingId(finding.id)}
                  className={`bg-[#0A120E] rounded-2xl p-5 border transition-all duration-200 shadow-md card-hover-effect ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : isResolved
                      ? 'border-emerald-900/60 bg-emerald-950/20 opacity-80'
                      : isRejected
                      ? 'border-zinc-800 bg-zinc-950/40 opacity-60'
                      : 'border-emerald-900/50 hover:border-emerald-500/40'
                  }`}
                >
                  {/* Card Header: Severity & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          finding.severity === 'critical'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : finding.severity === 'high'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {finding.severity}
                      </span>
                      <span className="text-xs text-zinc-400 capitalize">
                        {finding.category.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500">
                      Issue #{idx + 1}
                    </span>
                  </div>

                  {/* Flagged phrase */}
                  <div className="text-xs text-zinc-300 mb-2">
                    <span className="text-zinc-500 font-medium">Flagged text: </span>
                    <span className="font-semibold text-white bg-[#050806] border border-emerald-950 px-1.5 py-0.5 rounded">
                      &quot;{finding.original_text}&quot;
                    </span>
                  </div>

                  {/* Explanation */}
                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    {finding.explanation}
                  </p>

                  {/* Official Brand Citation Box */}
                  <div className="p-3 rounded-xl bg-[#060B08] border border-emerald-950 text-xs text-zinc-300 space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{finding.relevant_brand_rule}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {finding.source_document} ({finding.page_reference})
                    </div>
                    <p className="italic text-zinc-400 text-[11px] pt-1 border-t border-emerald-950 leading-normal">
                      &quot;{finding.exact_supporting_passage}&quot;
                    </p>
                  </div>

                  {/* Suggested Replacement & Actions */}
                  {finding.status === 'pending' ? (
                    <div className="pt-2 border-t border-emerald-950 flex flex-col gap-2">
                      {editingFindingId === finding.id ? (
                        <div className="space-y-2 p-2.5 bg-emerald-950/30 rounded-lg border border-emerald-800/60">
                          <label className="text-[11px] font-semibold text-zinc-300 block">Custom Replacement</label>
                          <input
                            type="text"
                            value={customReplacement}
                            onChange={e => setCustomReplacement(e.target.value)}
                            className="w-full text-xs p-1.5 border border-emerald-900/60 rounded bg-[#050806] text-white"
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingFindingId(null)}
                              className="px-2 py-0.5 text-xs text-zinc-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                applySuggestion(submission.id, finding.id, customReplacement);
                                setEditingFindingId(null);
                              }}
                              className="px-2.5 py-1 bg-emerald-500 text-black text-xs font-extrabold rounded"
                            >
                              Apply Custom
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-xs flex items-center justify-between">
                            <span className="text-zinc-400 font-medium">Approved replacement:</span>
                            <span className="font-extrabold text-[#00FF87] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
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
                              className="px-2 py-1 text-zinc-400 hover:text-white text-xs font-medium rounded hover:bg-emerald-950/40 flex items-center gap-1 cursor-pointer"
                              title="Provide your own replacement phrasing"
                            >
                              <Edit3 className="w-3 h-3 text-emerald-400" />
                              <span>Custom</span>
                            </button>

                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                handleReject(finding.id);
                              }}
                              className="px-2.5 py-1 text-zinc-500 hover:text-zinc-200 text-xs font-medium rounded hover:bg-emerald-950/40 cursor-pointer"
                            >
                              Dismiss
                            </button>

                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                handleApply(finding.id);
                              }}
                              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept Suggestion</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-emerald-950 flex items-center justify-between text-xs">
                      <span className="text-[#00FF87] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correction Applied
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px]">Score +12%</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Custom Live Draft Input Modal */}
      {isNewDraftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-xl w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">Analyze Custom Text Live</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDraftModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer p-1"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateCustomDraft} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Type or paste any custom document, ad copy, press release, or email draft. The AI engine will scan it instantly against your active knowledge base guidelines and pinpoint any terminology or voice violations.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Document Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Q3 Cloud Campaign Launch"
                    value={newDraftTitle}
                    onChange={e => setNewDraftTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white bg-[#050806]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Draft Content <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={7}
                    required
                    placeholder="Type or paste any marketing copy here (e.g. We are India's No. 1 platform with 100% accuracy and unhackable security)..."
                    value={newDraftContent}
                    onChange={e => setNewDraftContent(e.target.value)}
                    className="w-full text-xs p-3 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white bg-[#050806] font-sans"
                  />
                </div>
              </div>

              <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewDraftModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer shadow-[0_0_14px_rgba(16,185,129,0.35)]"
                >
                  <Zap className="w-3.5 h-3.5 text-black" />
                  <span>Analyze Text Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Human Approval Request Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-md w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">Submit for Human Review</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                This draft will be sent to designated brand reviewer <strong>Sarah Lin</strong>. Final approval requires explicit human sign-off.
              </p>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Optional Note for Reviewer
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Addressed all superlative claims and aligned with Section 4.2 guidelines."
                  value={submissionNote}
                  onChange={e => setSubmissionNote(e.target.value)}
                  className="w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white bg-[#050806]"
                />
              </div>
            </div>

            <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-3.5 py-2 text-xs text-zinc-400 hover:text-white font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitForReview}
                className="px-4 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_14px_rgba(16,185,129,0.35)]"
              >
                <Send className="w-3.5 h-3.5 text-black" />
                <span>Request Sign-off</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Format Publishing & Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">Publish & Export Content</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              <p className="text-xs text-zinc-400">
                Export your verified, compliant draft into standard enterprise formats or export the complete audit trail.
              </p>

              <div className="space-y-3">
                {/* Option 1: Markdown (.md) */}
                <div className="p-3.5 rounded-xl border border-emerald-950 bg-[#060B08] hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center justify-center shrink-0">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Clean Markdown (.md)</div>
                      <div className="text-[11px] text-zinc-400">Includes frontmatter metadata, headers, and clean prose</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportMarkdown}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  >
                    {copiedExportFormat === 'md' ? <CheckCheck className="w-3.5 h-3.5 text-black" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{copiedExportFormat === 'md' ? 'Downloaded!' : 'Download .md'}</span>
                  </button>
                </div>

                {/* Option 2: Clean HTML for CMS */}
                <div className="p-3.5 rounded-xl border border-emerald-950 bg-[#060B08] hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-950 text-cyan-400 border border-emerald-800 flex items-center justify-center shrink-0">
                      <Copy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">CMS HTML Snippet</div>
                      <div className="text-[11px] text-zinc-400">Formatted semantic HTML ready for WordPress, Webflow, or Notion</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyHtml}
                    className="px-3 py-1.5 bg-[#0A120E] border border-emerald-900/60 hover:bg-emerald-950/60 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedExportFormat === 'html' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                    <span>{copiedExportFormat === 'html' ? 'Copied HTML!' : 'Copy HTML'}</span>
                  </button>
                </div>

                {/* Option 3: Compliance Audit JSON Trail */}
                <div className="p-3.5 rounded-xl border border-emerald-950 bg-[#060B08] hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-950 text-[#00FF87] border border-emerald-800 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Executive Audit Trail (.json)</div>
                      <div className="text-[11px] text-zinc-400">Full audit log of resolved findings, policy citations, and timestamps</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportAuditReport}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  >
                    {copiedExportFormat === 'json' ? <CheckCheck className="w-3.5 h-3.5 text-black" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{copiedExportFormat === 'json' ? 'Exported!' : 'Export JSON'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 bg-[#0A120E] border border-emerald-900/60 hover:bg-emerald-950/60 text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
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
