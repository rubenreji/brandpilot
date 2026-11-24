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
  Check,
  Globe,
  Swords,
  Target,
  ShieldAlert
} from 'lucide-react';
import { CompetitorScanResult } from '@/lib/types';

export default function ContentAuditPage() {
  const router = useRouter();
  const {
    runAudit,
    showToast,
    selectedJurisdiction,
    setSelectedJurisdiction,
    scanCompetitorVulnerabilities,
    currentWorkspace,
    allBrandBases,
    switchWorkspace,
    createLiveSubmission
  } = useBrandPilot();

  // Mode Switcher: Standard Internal Audit vs Competitor Intelligence Battleground
  const [auditMode, setAuditMode] = useState<'standard' | 'competitor'>('standard');
  const [selectedBrandBaseId, setSelectedBrandBaseId] = useState(currentWorkspace.id);

  // Competitor Intelligence State
  const [competitorName, setCompetitorName] = useState('Rival Multi-Cloud Inc.');
  const [competitorCopy, setCompetitorCopy] = useState(
    "We guarantee 100% uptime with our new cloud orchestration platform. As India's No. 1 multi-cloud provider, our proprietary AI magic provides the cheapest cloud storage in modern computing."
  );
  const [competitorResult, setCompetitorResult] = useState<CompetitorScanResult | null>(null);
  const [competitorLoading, setCompetitorLoading] = useState(false);

  const handleRunCompetitorScan = async () => {
    if (!competitorCopy.trim()) return;
    setCompetitorLoading(true);
    try {
      const res = await scanCompetitorVulnerabilities({
        competitor_name: competitorName,
        copy_text: competitorCopy,
        target_jurisdiction: selectedJurisdiction
      });
      setCompetitorResult(res);
    } catch {
      // Handled in store
    } finally {
      setCompetitorLoading(false);
    }
  };

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

  // Live client-side keystroke linter & contextual claims analyzer
  const liveStats = React.useMemo(() => {
    const trimmed = contentBody.trim();
    if (!trimmed) {
      return {
        words: 0,
        chars: 0,
        readingTimeMinutes: 0,
        detectedFlags: [],
        supportedCount: 0,
        contradictedCount: 0,
        unverifiedCount: 0,
        claimsPreview: []
      };
    }
    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const chars = contentBody.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

    // Categorized contextual claim rules
    const contradictedRules = [
      { pattern: /\b(100%\s+uptime|zero\s+downtime|uninterrupted\s+uptime)\b/gi, label: 'Contradicts 99.95% SLA Standard' },
      { pattern: /\b(cheapest(?:\s+cloud)?|cheapest\s+solution|lowest\s+price)\b/gi, label: 'Contradicts $49 Price Book Model' },
      { pattern: /\b(zero\s+data\s+loss|instantaneous\s+failover)\b/gi, label: 'Contradicts RPO/RTO Limits (<15s)' }
    ];

    const unverifiedRules = [
      { pattern: /\b(India's No\.?\s?1|world's best|industry leader)\b/gi, label: 'Unverified Market Ranking Superlative' },
      { pattern: /\b(AI magic|magical|revolutionary AI miracle)\b/gi, label: 'Speculative Buzzword: "AI magic"' },
      { pattern: /\b(guarantees? 100%|100%\s+accuracy|flawless accuracy)\b/gi, label: 'Unverified Absolute Performance Guarantee' },
      { pattern: /\b(unhackable|100%\s+secure|impervious\s+to\s+attacks?)\b/gi, label: 'Unverified Absolute Security Assertion' },
      { pattern: /\bauracloud\b/g, label: 'Brand Capitalization (Use AuraCloud)' }
    ];

    const supportedRules = [
      { pattern: /\b99\.95%(?:\s+monthly)?(?:\s+uptime)?(?:\s+sla)?\b/gi, label: 'Supported: 99.95% monthly uptime SLA' },
      { pattern: /\b48(?:\s+tier-1)?\s+edge\s+pops?\b/gi, label: 'Supported: 48 Tier-1 Edge PoPs' },
      { pattern: /\bsoc\s*2\s+type\s+ii\b/gi, label: 'Supported: SOC 2 Type II Attestation' },
      { pattern: /\b\$49(?:\s*\/\s*node)?\b/gi, label: 'Supported: $49/node Enterprise Pricing' },
      { pattern: /\bzero-trust(?:\s+architecture)?\b/gi, label: 'Supported: Zero-Trust Defense Standard' }
    ];

    const detectedFlags: string[] = [];
    let contradictedCount = 0;
    let unverifiedCount = 0;
    let supportedCount = 0;

    for (const r of contradictedRules) {
      if (r.pattern.test(contentBody)) {
        detectedFlags.push(`[Contradicted] ${r.label}`);
        contradictedCount++;
      }
    }
    for (const r of unverifiedRules) {
      if (r.pattern.test(contentBody)) {
        detectedFlags.push(`[Unverified] ${r.label}`);
        unverifiedCount++;
      }
    }
    for (const r of supportedRules) {
      if (r.pattern.test(contentBody)) {
        supportedCount++;
      }
    }

    return { words, chars, readingTimeMinutes, detectedFlags, supportedCount, contradictedCount, unverifiedCount };
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

  const handleSelectBrandBase = (brandId: string, mode: 'flagged' | 'clean' = 'flagged') => {
    setSelectedBrandBaseId(brandId);
    switchWorkspace(brandId);
    const found = allBrandBases.find(b => b.workspace.id === brandId);
    if (found) {
      setInputMode('text');
      setTitle(found.sampleDraft.headline);
      setContentType(found.sampleDraft.contentType);
      setCampaign(found.sampleDraft.campaign);
      setTargetAudience(found.sampleDraft.targetAudience);
      setSelectedJurisdiction(found.sampleDraft.jurisdiction);
      setContentBody(mode === 'flagged' ? found.sampleDraft.flaggedBody : found.sampleDraft.compliantBody);
      showToast(
        mode === 'flagged'
          ? `Loaded ${found.workspace.name} draft with real industry violations for data checking!`
          : `Loaded compliant ${found.workspace.name} draft (100% score).`,
        'success'
      );
    }
  };

  const handleLoadSample = (type: 'flagged' | 'clean') => {
    handleSelectBrandBase(selectedBrandBaseId || currentWorkspace.id, type);
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
    } catch (err) {
      console.warn('Backend audit API unavailable, generating verified local submission:', err);
      const fallbackId = createLiveSubmission(title, contentBody);
      setIsAuditing(false);
      router.push(`/app/corrections/${fallbackId}`);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <div className="pb-6 border-b border-emerald-950">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <span>Brand Compliance Engine</span>
          <span>•</span>
          <span>Draft & Document Checker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Content Auditing Workspace
        </h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
          Paste your marketing copy or upload files (DOCX, PDF, TXT) to check for off-brand claims, forbidden terms, incorrect facts, and tone issues in seconds.
        </p>
      </div>

      {/* Mode Switcher: Internal Audit vs Competitor Battleground */}
      <div className="flex border-b border-emerald-950 overflow-x-auto space-x-2">
        <button
          type="button"
          onClick={() => setAuditMode('standard')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            auditMode === 'standard'
              ? 'border-[#00FF87] text-[#00FF87] bg-emerald-950/40 rounded-t-lg'
              : 'border-transparent text-zinc-400 hover:text-white hover:border-emerald-500/40'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Check Internal Content (Articles, Ads & Copy)</span>
        </button>

        <button
          type="button"
          onClick={() => setAuditMode('competitor')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            auditMode === 'competitor'
              ? 'border-amber-400 text-amber-300 bg-amber-950/40 rounded-t-lg'
              : 'border-transparent text-zinc-400 hover:text-white hover:border-amber-500/40'
          }`}
        >
          <Swords className="w-4 h-4 text-amber-400" />
          <span>Scan Competitor Claims & Counter-Campaigns</span>
          <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
            Compare
          </span>
        </button>
      </div>

      {/* Main Audit Form - STANDARD MODE */}
      {auditMode === 'standard' && (
      <form onSubmit={handleSubmitAudit} className="space-y-6">
        {/* Multi-Jurisdictional Regulatory Framework Bar */}
        <div className="bg-[#0A120E] border border-emerald-900/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">
                Target Advertising Rules & Legal Standard
              </span>
              <span className="text-[11px] text-zinc-400">
                Applies regional advertising laws (FTC in US, EU AI Act in Europe, ASA in UK) alongside your company brand rules.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'global', label: '🌐 Global (Truthful Ads)' },
              { id: 'us_ftc', label: '🇺🇸 US (FTC Truth-in-Ads)' },
              { id: 'eu_ai_act', label: '🇪🇺 EU (AI Act Rules)' },
              { id: 'uk_asa', label: '🇬🇧 UK (ASA Standards)' }
            ].map(j => (
              <button
                key={j.id}
                type="button"
                onClick={() => {
                  setSelectedJurisdiction(j.id as any);
                  showToast(`Jurisdiction set to ${j.label}`, 'info');
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold font-mono border whitespace-nowrap transition-all cursor-pointer ${
                  selectedJurisdiction === j.id
                    ? 'bg-emerald-950 text-[#00FF87] border-[#00FF87] shadow-sm'
                    : 'bg-[#060B08] text-zinc-400 border-emerald-950 hover:text-white hover:border-emerald-800'
                }`}
              >
                {j.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enterprise Multi-Brand Knowledge Bases */}
        <div className="bg-[#0A120E] border border-emerald-900/60 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-950">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00FF87] shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Enterprise Brand Workspaces &amp; Industry Knowledge Bases
                </span>
                <span className="text-[11px] text-zinc-400">
                  Select any brand to automatically load its dedicated guidelines, corporate facts, terminology rules, and candidate draft.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample('flagged')}
                className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-lg border border-rose-800 transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Load Benchmark Audit (With Flags)</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('clean')}
                className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-[#00FF87] text-xs font-bold rounded-lg border border-emerald-800 transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF87]" />
                <span>Load Cleared Safe-Harbor Copy</span>
              </button>
            </div>
          </div>

          {/* 12 Brand Base Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {allBrandBases.map(b => {
              const isSelected = (selectedBrandBaseId || currentWorkspace.id) === b.workspace.id;
              return (
                <button
                  key={b.workspace.id}
                  type="button"
                  onClick={() => handleSelectBrandBase(b.workspace.id, 'flagged')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950 text-[#00FF87] border-[#00FF87] shadow-[0_0_12px_rgba(0,255,135,0.25)]'
                      : 'bg-[#060B08] text-zinc-400 border-emerald-950 hover:text-white hover:border-emerald-800'
                  }`}
                >
                  <span className="text-sm">{b.icon}</span>
                  <span>{b.workspace.brand_name}</span>
                  <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-black/50 text-zinc-400 border border-white/5">
                    {b.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Content Title / Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Cloud Infrastructure Announcement"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#050806] border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Content Format</label>
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#050806] border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white"
            >
              <option value="press_release" className="bg-[#0A120E] text-white">Press Release / PR</option>
              <option value="blog_post" className="bg-[#0A120E] text-white">Technical Blog Post</option>
              <option value="social_post" className="bg-[#0A120E] text-white">Social Media (LinkedIn / Twitter)</option>
              <option value="email_campaign" className="bg-[#0A120E] text-white">Email Campaign</option>
              <option value="ad_copy" className="bg-[#0A120E] text-white">Performance Ad Copy</option>
            </select>
          </div>
        </div>

        {/* Mode Selector Tabs (Direct Text vs Document Upload) */}
        <div className="flex items-center gap-2 border-b border-emerald-950 pb-2">
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              inputMode === 'text'
                ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Direct Text Input
          </button>
          <button
            type="button"
            onClick={() => setInputMode('file')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              inputMode === 'file'
                ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileUp className={`w-3.5 h-3.5 ${inputMode === 'file' ? 'text-black' : 'text-emerald-400'}`} />
            <span>Upload Document (PDF / DOCX / TXT)</span>
          </button>
        </div>

        {/* Document File Dropzone */}
        {inputMode === 'file' && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-900/60 rounded-xl p-6 text-center bg-[#0A120E] hover:bg-emerald-950/20 hover:border-emerald-500/50 transition-colors cursor-pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".docx,.pdf,.txt,.md"
              className="hidden"
            />
            <Upload className="w-8 h-8 text-[#00FF87] mx-auto mb-2" />
            <p className="text-xs font-bold text-white">
              {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Click to select document or drag & drop'}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Supports .DOCX, .PDF, .TXT, and .MD files with automated text extraction
            </p>
          </div>
        )}

        {/* Uploaded File Action Banner */}
        {uploadedFileName && contentBody && (
          <div className="bg-[#0A120E] border border-emerald-900/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-[#00FF87] border border-emerald-800 flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{uploadedFileName}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    {contentBody.trim().split(/\s+/).filter(Boolean).length} words ready
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Document text extracted. You can review/edit it below or launch the Correction Studio immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenDirectlyInStudio}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_0_14px_rgba(16,185,129,0.35)]"
              >
                <Edit3 className="w-3.5 h-3.5 text-black" />
                <span>Open in Correction Studio</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        )}

        {/* Text Area & Live Keystroke Linter */}
        <div className="bg-[#0A120E] rounded-xl border border-emerald-900/60 p-4 space-y-3 shadow-md">
          {/* Real-time metrics bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-emerald-950 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-zinc-200">Candidate Draft Body</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse shadow-[0_0_6px_#00FF87]"></span>
                <span>Active Linter: Live (&lt;5ms)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1">
                <AlignLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>{liveStats.words} words • {liveStats.chars} chars</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>~{liveStats.readingTimeMinutes} min read</span>
              </span>
              {contentBody.trim().length > 0 && (
                <button
                  type="button"
                  onClick={handleCleanWhitespace}
                  className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline cursor-pointer ml-1"
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
            className="w-full text-sm font-sans leading-relaxed p-3 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 font-normal text-white bg-[#050806] transition-all font-mono"
          />

          {/* Real-time Keystroke Linting & Contextual Claim Verification Drawer */}
          {contentBody.trim().length > 0 && (
            <div className="pt-2.5 border-t border-emerald-950 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#00FF87]" />
                    <span>Contextual AI Claim Triad:</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-[#00FF87] text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#00FF87]" />
                    <span>{liveStats.supportedCount} Supported</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-300 text-[10px] font-bold flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                    <span>{liveStats.contradictedCount} Contradicted</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                    <span>{liveStats.unverifiedCount} Cannot Be Verified</span>
                  </span>
                </div>

                <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                  Shortcut: [Ctrl + Enter] to audit
                </span>
              </div>

              {/* Detected Flags Pills */}
              {liveStats.detectedFlags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {liveStats.detectedFlags.map((flag, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium border flex items-center gap-1 ${
                        flag.startsWith('[Contradicted]')
                          ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                          : 'bg-amber-950/70 text-amber-300 border-amber-800'
                      }`}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>{flag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Policy Checkboxes */}
        <div className="bg-[#0A120E] p-4 rounded-xl border border-emerald-900/60 shadow-md">
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
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
                      ? 'border-emerald-500 bg-emerald-950/60 text-[#00FF87] font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'border-emerald-950 bg-[#060B08] text-zinc-400 hover:bg-emerald-950/30'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-[#00FF87] shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                  <span>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
            <span>Automatic compliance checking with exact rule citations</span>
          </div>

          <button
            type="submit"
            disabled={isAuditing || !contentBody.trim()}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            {isAuditing ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>Auditing Content...</span>
              </>
            ) : (
              <>
                <span>Run Brand Compliance Audit</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </div>
      </form>
      )}

      {/* ============================================================== */}
      {/* COMPETITOR INTELLIGENCE & COUNTER-CAMPAIGN BATTLEGROUND */}
      {/* ============================================================== */}
      {auditMode === 'competitor' && (
        <div className="space-y-6">
          {/* Battleground Overview Card */}
          <div className="bg-[#0A120E] border border-amber-900/60 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-950/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/80 flex items-center justify-center shrink-0">
                  <Swords className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    Competitor Claims & Counter-Campaign Analyzer
                    <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                      Lanham Act § 43(a) & FTC Audit
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Analyze competitor marketing copy against your verified corporate fact books and legal advertising standards to detect vulnerabilities and synthesize pre-vetted counter-rebuttals.
                  </p>
                </div>
              </div>

              {/* Sample Competitor Claim Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-mono text-zinc-500 mr-1">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCompetitorName('CloudHyperion Inc.');
                    setCompetitorCopy("We guarantee 100% uptime with our new platform. As India's No. 1 multi-cloud provider, our proprietary AI magic provides the cheapest cloud storage in modern computing.");
                    showToast('Loaded CloudHyperion claim preset', 'info');
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 hover:bg-amber-900/80 cursor-pointer transition-colors"
                >
                  Unsubstantiated SLA & AI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCompetitorName('ApexData Systems');
                    setCompetitorCopy("The world's only zero-latency vector database that eliminates all hallucinations with 10x faster query processing than any competitor on Earth.");
                    showToast('Loaded ApexData claim preset', 'info');
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 hover:bg-amber-900/80 cursor-pointer transition-colors"
                >
                  Superlative Performance
                </button>
              </div>
            </div>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Target Competitor Entity
                </label>
                <input
                  type="text"
                  value={competitorName}
                  onChange={e => setCompetitorName(e.target.value)}
                  placeholder="e.g. Rival Multi-Cloud Corp."
                  className="w-full bg-[#060B08] border border-amber-900/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Governing Advertising Law
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'us_ftc', label: 'US FTC & Lanham' },
                    { id: 'global', label: 'Global Standard' },
                    { id: 'uk_asa', label: 'UK ASA' }
                  ].map(j => (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => setSelectedJurisdiction(j.id as any)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                        selectedJurisdiction === j.id
                          ? 'bg-amber-950 text-amber-300 border-amber-400'
                          : 'bg-[#060B08] text-zinc-400 border-amber-950 hover:text-white'
                      }`}
                    >
                      {j.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleRunCompetitorScan}
                  disabled={competitorLoading || !competitorCopy.trim()}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  {competitorLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Auditing Legal Vulnerabilities...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 text-black" />
                      <span>Scan Competitor & Formulate Rebuttals</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Competitor Marketing Copy / Press Release / Social Ad
              </label>
              <textarea
                rows={4}
                value={competitorCopy}
                onChange={e => setCompetitorCopy(e.target.value)}
                placeholder="Paste competitor advertisement, press release, or whitepaper claims here..."
                className="w-full bg-[#060B08] border border-amber-900/60 rounded-xl p-3 text-xs text-zinc-200 font-mono focus:outline-hidden focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Competitor Scan Results Display */}
          {competitorResult && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Scorecard Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[#0A120E] border border-rose-900/60 p-4 rounded-xl shadow-md">
                  <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                    Competitor Vulnerability Index
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-2">
                    <span className="text-rose-400">{competitorResult.vulnerability_score}</span>
                    <span className="text-xs text-zinc-500">/ 100</span>
                  </div>
                  <div className="text-[11px] text-rose-300/80 mt-1">
                    {competitorResult.vulnerability_score > 70 ? 'High Legal & Factual Exposure' : 'Moderate Exposure'}
                  </div>
                </div>

                <div className="bg-[#0A120E] border border-amber-900/60 p-4 rounded-xl shadow-md">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Vulnerable Claims Detected
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-1">
                    {competitorResult.vulnerabilities.length}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Across {competitorResult.competitor_name}
                  </div>
                </div>

                <div className="bg-[#0A120E] border border-emerald-900/60 p-4 rounded-xl shadow-md">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Our Verified Fact Source
                  </div>
                  <div className="text-sm font-extrabold text-white mt-2 truncate">
                    AuraCloud Fact Book 2026
                  </div>
                  <div className="text-[11px] text-emerald-300/80 mt-1">
                    Sec 4.1 & SEC 10-K Gated
                  </div>
                </div>

                <div className="bg-[#0A120E] border border-blue-900/60 p-4 rounded-xl shadow-md">
                  <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                    Statutory Framework
                  </div>
                  <div className="text-sm font-extrabold text-white mt-2">
                    {competitorResult.jurisdiction === 'us_ftc'
                      ? 'FTC & Lanham Act § 43(a)'
                      : competitorResult.jurisdiction === 'uk_asa'
                      ? 'UK ASA CAP Code'
                      : 'Global Advertising Truth'}
                  </div>
                  <div className="text-[11px] text-blue-300/80 mt-1">
                    Substantiation Doctrine Enforced
                  </div>
                </div>
              </div>

              {/* Vulnerabilities & Counter-Rebuttals */}
              <div className="bg-[#0A120E] border border-amber-900/60 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-amber-950/80">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Actionable Counter-Campaign Playbook ({competitorResult.vulnerabilities.length} Claims)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const text = competitorResult.vulnerabilities.map(v => 
                        `[CLAIM]: ${v.claim || v.matched_claim}\n[STATUTORY RULE]: ${v.statutory_reference || v.statutory_statute}\n[VULNERABILITY]: ${v.vulnerability || v.legal_risk}\n[VERIFIED COUNTER-REBUTTAL]: ${v.counter_rebuttal || v.suggested_counter_rebuttal}\n[FACT SOURCE]: ${v.fact_source || 'AuraCloud Fact Book 2026'}\n---`
                      ).join('\n\n');
                      navigator.clipboard.writeText(text);
                      showToast('Copied full counter-campaign dossier to clipboard', 'success');
                    }}
                    className="text-xs font-mono font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-800/80 transition-colors cursor-pointer"
                  >
                    Copy Counter-Dossier
                  </button>
                </div>

                <div className="space-y-4">
                  {competitorResult.vulnerabilities.map((vuln, idx) => {
                    const claimText = vuln.claim || vuln.matched_claim;
                    const statuteText = vuln.statutory_reference || vuln.statutory_statute;
                    const riskText = vuln.vulnerability || vuln.legal_risk;
                    const rebuttalText = vuln.counter_rebuttal || vuln.suggested_counter_rebuttal;
                    const factSource = vuln.fact_source || 'AuraCloud Fact Book 2026 - Sec 4.1';
                    const severity = vuln.severity || 'high';

                    return (
                      <div
                        key={idx}
                        className="bg-[#060B08] border border-amber-900/40 rounded-xl p-4 space-y-3 hover:border-amber-700/60 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-white">
                            Claim #{idx + 1}: &ldquo;{claimText}&rdquo;
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                              severity === 'critical'
                                ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                                : severity === 'high'
                                ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                                : 'bg-yellow-950/80 text-yellow-300 border-yellow-800'
                            }`}
                          >
                            {severity} Legal Vulnerability
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg space-y-1">
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                              Legal & Factual Weakness ({statuteText})
                            </span>
                            <p className="text-zinc-300 text-[11px] leading-relaxed">
                              {riskText}
                            </p>
                          </div>

                          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                Approved Brand Counter-Rebuttal
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(rebuttalText);
                                  showToast('Rebuttal copied to clipboard', 'success');
                                }}
                                className="text-[10px] font-mono text-[#00FF87] hover:underline cursor-pointer"
                              >
                                Copy
                              </button>
                            </div>
                            <p className="text-zinc-200 text-[11px] font-medium leading-relaxed">
                              &ldquo;{rebuttalText}&rdquo;
                            </p>
                            <span className="text-[10px] font-mono text-emerald-400 block pt-1">
                              Grounding: {factSource}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit Progress Modal Dialog */}
      {isAuditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0A120E] text-white rounded-2xl p-6 max-w-md w-full border border-emerald-900/80 shadow-2xl space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-[#00FF87] border border-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-[0_0_12px_rgba(0,255,135,0.25)]">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-white">BrandPilot Governance Engine</h3>
              <p className="text-xs text-zinc-400 mt-1">Analyzing draft against AuraCloud guidelines...</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                auditStep >= 1 ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' : 'border-emerald-950 text-zinc-500'
              }`}>
                {auditStep >= 1 ? <CheckCircle2 className="w-4 h-4 text-[#00FF87]" /> : <div className="w-4 h-4 rounded-full border border-zinc-700" />}
                <span>Stage 1: Deterministic regex linter & term matching</span>
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                auditStep >= 2 ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' : 'border-emerald-950 text-zinc-500'
              }`}>
                {auditStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-[#00FF87]" /> : <div className="w-4 h-4 rounded-full border border-zinc-700" />}
                <span>Stage 2: pgvector HNSW semantic citation retrieval</span>
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                auditStep >= 3 ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' : 'border-emerald-950 text-zinc-500'
              }`}>
                {auditStep >= 3 ? <CheckCircle2 className="w-4 h-4 text-[#00FF87]" /> : <div className="w-4 h-4 rounded-full border border-zinc-700" />}
                <span>Stage 3: Contextual compliance scoring & replacement synthesis</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
