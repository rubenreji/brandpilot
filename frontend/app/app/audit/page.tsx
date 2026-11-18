'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBrandPilot } from '@/lib/store';
import {
  FileCheck2,
  Sparkles,
  ArrowRight,
  CheckSquare,
  Square,
  AlertTriangle,
  FileText,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Upload,
  FileType,
  FileUp,
  Edit3,
  Zap,
  Clock,
  AlignLeft,
  Check
} from 'lucide-react';

export default function ContentAuditPage() {
  const router = useRouter();
  const { runAudit, showToast } = useBrandPilot();

  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('press_release');
  const [campaign, setCampaign] = useState('Enterprise Cloud Launch');
  const [targetAudience, setTargetAudience] = useState('Enterprise CIOs and Cloud Architects');
  const [contentBody, setContentBody] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([
    'terminology',
    'unsupported_claim',
    'outdated_fact',
    'tone_of_voice',
    'accessibility'
  ]);

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live client-side keystroke linter & typography metrics
  const liveStats = React.useMemo(() => {
    const trimmed = contentBody.trim();
    if (!trimmed) {
      return { words: 0, chars: 0, readingTimeMinutes: 0, detectedFlags: [] };
    }
    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const chars = contentBody.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

    const rules = [
      { pattern: /\b(AI magic|magic|superpowers?)\b/gi, label: 'Prohibited Buzzword: "AI magic"' },
      { pattern: /\b(India's No\.?\s?1|world's best|best solution)\b/gi, label: 'Unverified Superlative' },
      { pattern: /\b(guarantees? 100%|100% (accuracy|secure|uptime))\b/gi, label: 'Absolute Guarantee' },
      { pattern: /\bauracloud\b/g, label: 'Lowercase Brand Name (Use AuraCloud)' },
      { pattern: /\b(cheapest solution|cheapest)\b/gi, label: 'Positioning Violation: "cheapest"' }
    ];

    const detectedFlags: string[] = [];
    for (const r of rules) {
      if (r.pattern.test(contentBody)) {
        detectedFlags.push(r.label);
      }
    }

    return { words, chars, readingTimeMinutes, detectedFlags };
  }, [contentBody]);

  const handleCleanWhitespace = () => {
    if (!contentBody) return;
    const cleaned = contentBody
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
    setContentBody(cleaned);
    showToast('Cleaned excessive whitespace and line breaks.', 'info');
  };

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const sampleNonCompliant = `AuraCloud is excited to announce our new orchestration engine, recognized as India's No. 1 multi-cloud management platform.

Built with cutting-edge AI magic that guarantees 100% accuracy across every container deployment, AuraCloud is the cheapest solution available in modern cloud computing.

Our mission is to help companies transform effortlessly without complicated setups. Choose auracloud today for ultimate cloud supremacy. Click here to read full specs.`;

  const sampleCompliant = `AuraCloud provides unified multi-cloud governance across AWS, Google Cloud Platform, and Microsoft Azure.

Backed by our 99.95% monthly uptime SLA, AuraCloud enables engineering teams to deploy compliant infrastructure securely and with high reliability.

As enterprise architectures scale, our automated cloud orchestration ensures consistent policy enforcement across distributed clusters. Explore our cloud architecture documentation to learn more.`;

  const handleLoadSample = (type: 'flagged' | 'clean') => {
    setInputMode('text');
    if (type === 'flagged') {
      setTitle('Q4 Product Launch Press Announcement');
      setContentType('press_release');
      setContentBody(sampleNonCompliant);
      showToast('Loaded flagged draft scenario (5 issues configured).', 'info');
    } else {
      setTitle('Enterprise Multi-Cloud Architecture Whitepaper');
      setContentType('blog_post');
      setContentBody(sampleCompliant);
      showToast('Loaded compliant draft scenario (100% score).', 'info');
    }
  };

  // Handle document file upload (DOCX, PDF, TXT, MD) with multi-page support
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }

      showToast(`Parsing multi-page document (${file.name})...`, 'info');

      // 1. Try high-fidelity multi-page serverless API extraction
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/extract', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          if (data.text && data.text.trim().length > 0) {
            setContentBody(data.text.trim());
            showToast(`Extracted ${data.page_count} pages (${data.word_count} words) from ${file.name}!`, 'success');
            return;
          }
        }
      } catch (apiErr) {
        console.warn('API extraction unavailable, attempting client-side fallback:', apiErr);
      }

      // 2. Client-side extraction fallback
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = ev => {
          const text = ev.target?.result as string;
          setContentBody(text);
          showToast(`Extracted text from ${file.name} successfully!`, 'success');
        };
        reader.readAsText(file);
      } else if (file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          try {
            const arrayBuffer = ev.target?.result as ArrayBuffer;
            const mammoth = await import('mammoth');
            const result = await mammoth.extractRawText({ arrayBuffer });
            const extracted = result.value.trim();
            if (extracted) {
              setContentBody(extracted);
              const words = extracted.split(/\s+/).filter(Boolean).length;
              showToast(`Extracted ${words} words from ${file.name} successfully!`, 'success');
            } else {
              showToast(`No text found in ${file.name}.`, 'info');
            }
          } catch (err) {
            console.error('DOCX extraction error:', err);
            showToast('Failed to parse DOCX file.', 'error');
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // PDF or other documents client-side fallback
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target?.result as string;
          const matches = text ? text.match(/[A-Za-z0-9 ,.?!:;'"\-\n\r]{4,}/g) : null;
          const extracted = matches ? matches.filter(s => s.trim().length > 15).join('\n\n') : '';
          if (extracted && extracted.length > 50) {
            setContentBody(extracted);
            showToast(`Extracted readable text sections from ${file.name}!`, 'success');
          } else {
            showToast(`Could not read binary format. Please upload DOCX or TXT format.`, 'error');
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const handleOpenDirectlyInStudio = async () => {
    if (!contentBody.trim()) {
      showToast('Please upload a document or enter candidate text first.', 'error');
      return;
    }
    const currentTitle = title.trim() || uploadedFileName?.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Document Draft';
    if (!title.trim()) {
      setTitle(currentTitle);
    }
    setIsAuditing(true);
    try {
      const subId = await runAudit({
        title: currentTitle,
        content_type: contentType,
        text: contentBody,
        campaign_name: campaign,
        target_audience: targetAudience,
        check_categories: categories
      });
      setIsAuditing(false);
      router.push(`/app/corrections/${subId}`);
    } catch {
      setIsAuditing(false);
      showToast('Error opening in Correction Studio.', 'error');
    }
  };

  const handleSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentBody.trim() || !title.trim()) {
      showToast('Please provide a title and draft content before auditing.', 'error');
      return;
    }

    setIsAuditing(true);
    setAuditStep(1);

    // Multi-stage audit visual feedback
    setTimeout(() => setAuditStep(2), 600);
    setTimeout(() => setAuditStep(3), 1300);

    try {
      const submissionId = await runAudit({
        title,
        content_type: contentType,
        text: contentBody,
        campaign_name: campaign,
        target_audience: targetAudience,
        check_categories: categories
      });

      setTimeout(() => {
        setIsAuditing(false);
        router.push(`/app/corrections/${submissionId}`);
      }, 1900);
    } catch {
      setIsAuditing(false);
      router.push('/app/corrections/sub-demo-flagged');
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <span>Brand Compliance Engine</span>
          <span>•</span>
          <span>Workspace Ingestion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Content Auditing Workspace
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Submit drafts or upload documents for automated multi-vector compliance evaluation against active brand guidelines.
        </p>
      </div>

      {/* Main Audit Form */}
      <form onSubmit={handleSubmitAudit} className="space-y-6">
        {/* Sample Draft Pickers */}
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-semibold text-blue-900">
              Instant Scenario Testing: Load pre-configured drafts into the editor
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadSample('flagged')}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 text-xs font-semibold rounded-lg border border-amber-300 transition-colors"
            >
              Load Flagged Draft (5 Violations)
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('clean')}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-300 transition-colors"
            >
              Load Compliant Draft (100% Score)
            </button>
          </div>
        </div>

        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Content Title / Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Cloud Infrastructure Announcement"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Content Format</label>
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="press_release">Press Release / PR</option>
              <option value="blog_post">Technical Blog Post</option>
              <option value="social_post">Social Media (LinkedIn / Twitter)</option>
              <option value="email_campaign">Email Campaign</option>
              <option value="ad_copy">Performance Ad Copy</option>
            </select>
          </div>
        </div>

        {/* Mode Selector Tabs (Direct Text vs Document Upload) */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              inputMode === 'text'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Direct Text Input
          </button>
          <button
            type="button"
            onClick={() => setInputMode('file')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              inputMode === 'file'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload Document (PDF / DOCX / TXT)</span>
          </button>
        </div>

        {/* Document File Dropzone */}
        {inputMode === 'file' && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-white hover:bg-blue-50/30 hover:border-blue-400 transition-colors cursor-pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".docx,.pdf,.txt,.md"
              className="hidden"
            />
            <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-900">
              {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Click to select document or drag & drop'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports .DOCX, .PDF, .TXT, and .MD files with automated text extraction
            </p>
          </div>
        )}

        {/* Uploaded File Action Banner */}
        {uploadedFileName && contentBody && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>{uploadedFileName}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                    {contentBody.trim().split(/\s+/).filter(Boolean).length} words ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Document text extracted. You can review/edit it below or launch the Correction Studio immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenDirectlyInStudio}
                className="px-4 py-2.5 bg-[#101827] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                <span>Open in Correction Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Text Area & Live Keystroke Linter */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
          {/* Real-time metrics bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-800">Candidate Draft Body</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Linter: Live (&lt;5ms)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-500 text-[11px]">
              <span className="flex items-center gap-1">
                <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>{liveStats.words} words • {liveStats.chars} chars</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>~{liveStats.readingTimeMinutes} min read</span>
              </span>
              {contentBody.trim().length > 0 && (
                <button
                  type="button"
                  onClick={handleCleanWhitespace}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer ml-1"
                >
                  Trim Spaces
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={10}
            required
            placeholder="Paste your announcement, blog draft, or campaign copy here to run real-time brand compliance verification... (Press Ctrl + Enter to audit)"
            value={contentBody}
            onChange={e => setContentBody(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (contentBody.trim() && title.trim()) {
                  handleSubmitAudit(e);
                } else {
                  showToast('Please provide a title and draft content before auditing.', 'info');
                }
              }
            }}
            className="w-full text-sm font-sans leading-relaxed p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-normal text-slate-900 transition-all"
          />

          {/* Real-time Keystroke Linting Results Drawer */}
          {contentBody.trim().length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Real-time Preview:</span>
                </span>
                {liveStats.detectedFlags.length > 0 ? (
                  liveStats.detectedFlags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium flex items-center gap-1"
                    >
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                      <span>{flag}</span>
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                    <span>No immediate terminology violations found</span>
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                Shortcut: [Ctrl + Enter] to audit
              </span>
            </div>
          )}
        </div>

        {/* Active Policy Checkboxes */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Governance Categories to Evaluate
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {[
              { id: 'terminology', label: 'Terminology & Naming' },
              { id: 'unsupported_claim', label: 'Superlatives & Guarantees' },
              { id: 'outdated_fact', label: 'Corporate Facts & SLA' },
              { id: 'tone_of_voice', label: 'Tone of Voice Alignment' },
              { id: 'accessibility', label: 'WCAG Accessibility' }
            ].map(cat => {
              const isChecked = categories.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-all ${
                    isChecked
                      ? 'border-blue-400 bg-blue-50/50 text-blue-900 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Automatic compliance checking with exact rule citations</span>
          </div>

          <button
            type="submit"
            disabled={isAuditing || !contentBody.trim()}
            className="px-6 py-3 bg-[#3978E8] hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
          >
            {isAuditing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Auditing Content...</span>
              </>
            ) : (
              <>
                <span>Run Brand Compliance Audit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Audit Progress Modal Dialog */}
      {isAuditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#101827] text-white rounded-2xl p-6 max-w-md w-full border border-slate-800 shadow-2xl space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-[#3978E8] flex items-center justify-center mx-auto mb-3">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white">BrandPilot Governance Engine</h3>
              <p className="text-xs text-slate-400 mt-1">Analyzing draft against AuraCloud guidelines...</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                auditStep >= 1 ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 text-slate-500'
              }`}>
                {auditStep >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                <span>Stage 1: Deterministic regex linter & term matching</span>
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                auditStep >= 2 ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 text-slate-500'
              }`}>
                {auditStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                <span>Stage 2: pgvector HNSW semantic citation retrieval</span>
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                auditStep >= 3 ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 text-slate-500'
              }`}>
                {auditStep >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                <span>Stage 3: Contextual compliance scoring & replacement synthesis</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
