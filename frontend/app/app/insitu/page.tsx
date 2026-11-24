'use client';

import React, { useState, useEffect } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Laptop,
  Globe,
  Code2,
  Palette,
  Maximize2,
  Check,
  RotateCcw,
  Sliders,
  Eye,
  Zap,
  ArrowRight,
  GitPullRequest,
  GitBranch,
  GitCommit,
  FileCode,
  Terminal,
  XCircle
} from 'lucide-react';

export default function InSituStudioPage() {
  const { currentWorkspace, inSituLint, showToast } = useBrandPilot();

  const [activeTab, setActiveTab] = useState<'figma' | 'extension' | 'api' | 'github'>('figma');

  // --- GITHUB CI/CD LINTER SIMULATOR STATE ---
  const [gitPrFixed, setGitPrFixed] = useState(false);
  const [gitPrChecking, setGitPrChecking] = useState(false);

  // --- FIGMA SIMULATOR STATE ---
  const [showExclusionZone, setShowExclusionZone] = useState(true);
  const [showContrastCheck, setShowContrastCheck] = useState(true);
  const [showTypoScale, setShowTypoScale] = useState(true);
  const [canvasBgColor, setCanvasBgColor] = useState('#0F172A');
  const [canvasTextColor, setCanvasTextColor] = useState('#FFFFFF');
  const [canvasHeadline, setCanvasHeadline] = useState('Enterprise Cloud Governance');
  const [canvasSubhead, setCanvasSubhead] = useState('High-reliability automated verification for multi-cloud deployments');
  const [figmaAuditScore, setFigmaAuditScore] = useState(100);

  // --- EXTENSION SIMULATOR STATE ---
  const sampleNonCompliant =
    'AuraCloud guarantees 100% uptime with our new platform. Recognized as India\'s No. 1 multi-cloud provider, we deliver AI magic and the cheapest cloud pricing available.';

  const sampleCompliant =
    'AuraCloud guarantees 99.95% monthly service availability backed by financial SLA credit commitments. An industry-recognized enterprise platform, we deliver intelligent automated orchestration.';

  const [editorText, setEditorText] = useState(sampleNonCompliant);
  const [detectedIssues, setDetectedIssues] = useState<any[]>([]);
  const [linterLatency, setLinterLatency] = useState<number>(3.2);
  const [lintScore, setLintScore] = useState<number>(45);

  // Live REST API Sandbox State
  const [apiTestText, setApiTestText] = useState('AuraCloud guarantees 100% uptime with our proprietary AI magic and cheapest pricing.');
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [apiTestLoading, setApiTestLoading] = useState(false);

  const handleExecuteApiTest = async () => {
    setApiTestLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/insitu/lint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: apiTestText })
      });
      const data = await res.json();
      const latency = Number((performance.now() - start).toFixed(1));
      setApiTestResult({ ...data, roundtrip_latency_ms: latency });
      showToast(`REST API returned ${data.issues?.length || 0} issues in ${latency}ms!`, 'success');
    } catch {
      showToast('Error calling REST endpoint', 'error');
    } finally {
      setApiTestLoading(false);
    }
  };

  // Run in-situ lint on typing
  useEffect(() => {
    let isMounted = true;
    const runLint = async () => {
      const res = await inSituLint(editorText, [canvasTextColor, canvasBgColor]);
      if (isMounted) {
        setDetectedIssues(res.issues);
        setLinterLatency(res.latency_ms);
        setLintScore(res.compliance_score);
      }
    };
    runLint();
    return () => {
      isMounted = false;
    };
  }, [editorText, canvasTextColor, canvasBgColor]);

  // 1-Click Replacement in extension
  const handleApplyQuickFix = (original: string, replacement: string) => {
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    const updated = editorText.replace(regex, replacement);
    setEditorText(updated);
    showToast(`Replaced "${original}" with "${replacement}"`, 'success');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>In-Situ Ecosystem</span>
            <span>•</span>
            <span>Zero Context Switching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            In-Situ Workflow Studio
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Enterprise In-Situ Suite
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Embed brand intelligence directly where creators and designers work: Figma canvas overlays & browser inline linting.
          </p>
        </div>

        {/* Engine Performance Pill */}
        <div className="flex items-center gap-2 bg-[#060B08] border border-emerald-900/60 px-3.5 py-2 rounded-xl">
          <Zap className="w-4 h-4 text-emerald-400" />
          <div className="text-xs">
            <span className="text-zinc-400">API Execution Speed:</span>{' '}
            <span className="font-mono font-bold text-[#00FF87]">{linterLatency}ms</span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex border-b border-emerald-950 overflow-x-auto space-x-2">
        <button
          onClick={() => setActiveTab('figma')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'figma'
              ? 'border-[#00FF87] text-[#00FF87] bg-emerald-950/40 rounded-t-lg'
              : 'border-transparent text-zinc-400 hover:text-white hover:border-emerald-500/40'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Figma & Canva Canvas Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('extension')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'extension'
              ? 'border-[#00FF87] text-[#00FF87] bg-emerald-950/40 rounded-t-lg'
              : 'border-transparent text-zinc-400 hover:text-white hover:border-emerald-500/40'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Chrome Extension & Live Composer</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'api'
              ? 'border-[#00FF87] text-[#00FF87] bg-emerald-950/40 rounded-t-lg'
              : 'border-transparent text-zinc-400 hover:text-white hover:border-emerald-500/40'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Sub-10ms REST & Webhook Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'github'
              ? 'border-[#00FF87] text-[#00FF87] bg-emerald-950/40 rounded-t-lg'
              : 'border-transparent text-zinc-400 hover:text-white hover:border-emerald-500/40'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>GitHub Actions CI/CD Linter</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#00FF87] border border-emerald-500/40">
            PR Gate
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: FIGMA & CANVA CANVAS INSPECTOR SIMULATOR */}
      {/* ============================================================== */}
      {activeTab === 'figma' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Side Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0A120E] border border-emerald-950 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span>Canvas Inspector Controls</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Figma Plugin v1.2
                </span>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#060B08] border border-emerald-950 cursor-pointer">
                  <div className="text-xs">
                    <div className="font-semibold text-white">0.5x Logo Exclusion Zone</div>
                    <div className="text-[10px] text-zinc-400">Clear boundary overlay around logomark</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showExclusionZone}
                    onChange={e => setShowExclusionZone(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#060B08] border border-emerald-950 cursor-pointer">
                  <div className="text-xs">
                    <div className="font-semibold text-white">WCAG AAA Contrast Heatmap</div>
                    <div className="text-[10px] text-zinc-400">Checks 7:1 ratio between text & canvas</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showContrastCheck}
                    onChange={e => setShowContrastCheck(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#060B08] border border-emerald-950 cursor-pointer">
                  <div className="text-xs">
                    <div className="font-semibold text-white">Typography Hierarchy Scale</div>
                    <div className="text-[10px] text-zinc-400">Verifies Display 32px vs Body 14px</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showTypoScale}
                    onChange={e => setShowTypoScale(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Background Color Picker */}
              <div className="pt-2 border-t border-emerald-950 space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">Canvas Surface Color</label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Brand Slate', hex: '#0F172A' },
                    { label: 'Brand Navy', hex: '#1E293B' },
                    { label: 'Off-Brand Red', hex: '#881337' },
                    { label: 'Off-Brand Gray', hex: '#71717A' }
                  ].map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setCanvasBgColor(c.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        canvasBgColor === c.hex ? 'scale-110 border-[#00FF87]' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={`${c.label} (${c.hex})`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Diagnostic Card */}
            <div className="p-4 rounded-xl bg-[#060B08] border border-emerald-900/60 space-y-2.5">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Canvas Compliance Score</span>
                <span className="font-mono text-emerald-400 font-extrabold text-sm">
                  {canvasBgColor === '#881337' ? '68%' : '100%'}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 leading-relaxed">
                {canvasBgColor === '#881337' ? (
                  <span className="text-rose-400">
                    ⚠ Warning: Surface color #881337 is outside approved brand token registry (Euclidean Distance D &gt; 38).
                  </span>
                ) : (
                  <span className="text-[#00FF87]">
                    ✓ Perfect: Surface matches brand token #0F172A. Logo clearance bounds and WCAG 7.8:1 AAA contrast satisfied.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Simulated Figma Canvas */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-emerald-950 bg-[#060B08] p-6 shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col justify-between">
              {/* Figma Canvas Toolbar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="ml-2 font-semibold text-zinc-300">Figma Frame • Marketing Hero Banner (1200x630)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400">Scale: 100%</span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-400 font-semibold">BrandPilot Plugin Active</span>
                </div>
              </div>

              {/* The Visual Design Frame */}
              <div
                className="my-auto rounded-xl p-8 border transition-all duration-300 relative shadow-2xl"
                style={{
                  backgroundColor: canvasBgColor,
                  color: canvasTextColor,
                  borderColor: canvasBgColor === '#881337' ? '#E11D48' : '#00FF87'
                }}
              >
                {/* Logo with 0.5x Exclusion Zone Overlay */}
                <div className="relative inline-block mb-6">
                  {showExclusionZone && (
                    <div className="absolute -inset-3.5 border-2 border-dashed border-[#00FF87] rounded bg-emerald-500/10 pointer-events-none animate-pulse">
                      <span className="absolute -top-5 left-0 text-[9px] font-mono font-bold text-[#00FF87] bg-black/90 px-1.5 py-0.2 rounded border border-emerald-500/40">
                        0.5x Clear-Space Bounding Box
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FF87] to-teal-500 flex items-center justify-center font-black text-black text-lg">
                      A
                    </div>
                    <span className="font-bold text-lg tracking-tight font-sans">AuraCloud</span>
                  </div>
                </div>

                {/* Headline with Typo Scale Badge */}
                <div className="space-y-2 relative">
                  {showTypoScale && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-1.5 py-0.5 rounded inline-block mb-1">
                      Display H1 • 32px / 1.2 Leading • Bold
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                    {canvasHeadline}
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed mt-2">
                    {canvasSubhead}
                  </p>
                </div>

                {/* WCAG Contrast Floating Pill */}
                {showContrastCheck && (
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00FF87]"></span>
                      <span>Contrast Ratio: 7.8:1</span>
                      <span className="text-[#00FF87] font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                        WCAG AAA PASS
                      </span>
                    </div>
                    <span className="text-zinc-400 text-[11px]">ISO/IEC 40500 Accessibility Verified</span>
                  </div>
                )}
              </div>

              {/* Footer status */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Frame ID: #figma-hero-01 • Synced to Brand Standards v3.0</span>
                <span className="text-emerald-400 font-mono">Real-time live inspector</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CHROME EXTENSION & LIVE INLINE COMPOSER SIMULATOR */}
      {/* ============================================================== */}
      {activeTab === 'extension' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Extension Side Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0A120E] border border-emerald-950 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Browser Extension Inspector</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Active
                </span>
              </div>

              <p className="text-xs text-zinc-400">
                Real-time inline linter active on web input fields. Scans copy as you type with sub-10ms response times.
              </p>

              {/* Sample Presets */}
              <div className="space-y-2 pt-2 border-t border-emerald-950">
                <div className="text-[10px] uppercase font-mono text-zinc-500 font-bold">Preset Demos</div>
                <button
                  type="button"
                  onClick={() => setEditorText(sampleNonCompliant)}
                  className="w-full text-left p-2.5 rounded-lg bg-[#060B08] hover:bg-emerald-950/40 border border-emerald-950 text-xs text-zinc-300 font-medium transition-colors cursor-pointer"
                >
                  <div className="text-rose-400 font-bold mb-0.5">Load Non-Compliant Draft</div>
                  <div className="text-[10px] text-zinc-500 truncate">100% uptime, India's No. 1, AI magic, cheapest</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorText(sampleCompliant)}
                  className="w-full text-left p-2.5 rounded-lg bg-[#060B08] hover:bg-emerald-950/40 border border-emerald-950 text-xs text-zinc-300 font-medium transition-colors cursor-pointer"
                >
                  <div className="text-[#00FF87] font-bold mb-0.5">Load 100% Compliant Copy</div>
                  <div className="text-[10px] text-zinc-500 truncate">99.95% monthly SLA, industry-recognized, orchestration</div>
                </button>
              </div>

              {/* Score and Findings summary */}
              <div className="p-3.5 rounded-xl bg-[#060B08] border border-emerald-900/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Real-Time Score</span>
                  <span
                    className={`font-mono font-black text-sm ${
                      lintScore >= 90 ? 'text-[#00FF87]' : lintScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {lintScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Violations Flagged</span>
                  <span className="font-mono text-white font-bold">{detectedIssues.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Execution Latency</span>
                  <span className="font-mono text-[#00FF87] font-bold">{linterLatency}ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulated Web Composer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-emerald-950 bg-[#060B08] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-950 text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Laptop className="w-4 h-4 text-emerald-400" />
                  <span>Live Interactive Web Composer (LinkedIn / Webflow / Email)</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Auto-Linting Active</span>
              </div>

              {/* Interactive Text Area */}
              <div className="space-y-2">
                <textarea
                  rows={5}
                  value={editorText}
                  onChange={e => setEditorText(e.target.value)}
                  className="w-full text-xs sm:text-sm p-4 bg-[#0A120E] border border-emerald-900/60 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
                  placeholder="Type or paste any marketing or PR draft to see real-time in-situ squiggly underlines..."
                />
              </div>

              {/* Real-time Findings Bar & 1-Click Fix Floating Pills */}
              {detectedIssues.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Real-Time Inline Suggestions ({detectedIssues.length})</span>
                  </div>

                  <div className="space-y-2">
                    {detectedIssues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0A120E] border border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="line-through text-rose-400 font-mono font-bold bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-900">
                              {issue.original_text}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-[#00FF87] font-mono font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                              {issue.suggested_replacement}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400">{issue.rule_name}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyQuickFix(issue.original_text, issue.suggested_replacement)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                        >
                          <Check className="w-3.5 h-3.5 text-black" />
                          <span>Apply Quick Fix</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF87] shrink-0" />
                  <div>
                    <div className="font-bold text-white">All Active Brand Rules Satisfied!</div>
                    <div className="text-[11px] text-zinc-400">
                      Copy adheres to verified SLA bounds, proper brand capitalization, and avoids prohibited superlatives.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: SUB-10MS REST & WEBHOOK SANDBOX */}
      {/* ============================================================== */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* In-Situ Lint API */}
            <div className="p-5 rounded-2xl bg-[#0A120E] border border-emerald-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                  POST /api/insitu/lint
                </span>
                <span className="text-xs font-mono text-[#00FF87] font-bold">Latency: &lt; 5ms</span>
              </div>
              <h3 className="text-sm font-bold text-white">Ultra-Fast In-Situ Linter Endpoint</h3>
              <p className="text-xs text-zinc-400">
                Lightweight REST API engineered for browser extensions, Figma plugins, and CLI hooks to scan text in real-time.
              </p>

              <div className="bg-[#050806] p-3 rounded-xl border border-emerald-950 font-mono text-[11px] text-zinc-300 space-y-1">
                <div className="text-zinc-500">// cURL Request</div>
                <div className="text-emerald-400">curl -X POST https://api.brandpilot.ai/insitu/lint \</div>
                <div className="text-zinc-300 pl-4">-H "Content-Type: application/json" \</div>
                <div className="text-zinc-300 pl-4">-d '{`{"text": "AuraCloud guarantees 100% uptime with AI magic"}`}'</div>
              </div>
            </div>

            {/* Publishing Gateway API */}
            <div className="p-5 rounded-2xl bg-[#0A120E] border border-emerald-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
                  POST /api/publishing/dispatch
                </span>
                <span className="text-xs font-mono text-teal-300 font-bold">Gatekeeper Gated</span>
              </div>
              <h3 className="text-sm font-bold text-white">Closed-Loop Publishing Gateway</h3>
              <p className="text-xs text-zinc-400">
                Cryptographically verifies the SHA-256 clearance stamp before permitting dispatches to Webflow, WordPress, or Ghost.
              </p>

              <div className="bg-[#050806] p-3 rounded-xl border border-emerald-950 font-mono text-[11px] text-zinc-300 space-y-1">
                <div className="text-zinc-500">// cURL Request</div>
                <div className="text-teal-400">curl -X POST https://api.brandpilot.ai/publishing/dispatch \</div>
                <div className="text-zinc-300 pl-4">-H "Content-Type: application/json" \</div>
                <div className="text-zinc-300 pl-4">-d '{`{"submission_id": "sub-101", "platform": "Webflow CMS"}`}'</div>
              </div>
            </div>
          </div>

          {/* Interactive Live API Console */}
          <div className="p-6 rounded-2xl bg-[#080E0B] border border-emerald-500/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Live Endpoint Execution Console</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Interactive POST /api/insitu/lint
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">Payload String (`text` parameter)</label>
              <textarea
                rows={2}
                value={apiTestText}
                onChange={e => setApiTestText(e.target.value)}
                className="w-full text-xs p-3 bg-[#0A120E] border border-emerald-900/60 rounded-xl text-white font-mono focus:border-emerald-500 focus:outline-none"
                placeholder="Enter any candidate text to lint..."
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-zinc-400">
                Executes directly against your live Next.js serverless route in real time.
              </span>
              <button
                type="button"
                onClick={handleExecuteApiTest}
                disabled={apiTestLoading || !apiTestText.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-xs font-black rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,135,0.3)]"
              >
                <Zap className="w-3.5 h-3.5" />
                {apiTestLoading ? 'Executing Request...' : 'Send Live API Request'}
              </button>
            </div>

            {apiTestResult && (
              <div className="mt-4 p-4 rounded-xl bg-[#050806] border border-emerald-900/80 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-emerald-950">
                  <span className="text-emerald-400 font-bold">● HTTP 200 OK • JSON Response</span>
                  <span className="text-[#00FF87] font-bold">Latency: {apiTestResult.roundtrip_latency_ms}ms</span>
                </div>
                <pre className="text-zinc-300 text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {JSON.stringify(apiTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: GITHUB ACTIONS CI/CD & GIT LINTER SIMULATOR */}
      {/* ============================================================== */}
      {activeTab === 'github' && (
        <div className="space-y-6">
          {/* PR Header Container */}
          <div className="bg-[#0A120E] border border-emerald-950 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-950">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-zinc-400">auracloud-enterprise / marketing-site</span>
                  <span className="text-xs text-zinc-600">#142</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <span>docs(release): publish AuraCloud 2026 Enterprise platform announcement</span>
                </h2>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border flex items-center gap-1 ${
                    gitPrFixed 
                      ? 'bg-emerald-950 text-[#00FF87] border-[#00FF87]' 
                      : 'bg-rose-950 text-rose-300 border-rose-800'
                  }`}>
                    <GitPullRequest className="w-3 h-3" />
                    {gitPrFixed ? 'Checks Passed' : 'Checks Failing'}
                  </span>
                  <span>
                    <strong className="text-white">dev-content-lead</strong> wants to merge 1 commit into <code className="bg-[#050806] px-1.5 py-0.5 rounded text-zinc-300 text-[11px]">main</code> from <code className="bg-[#050806] px-1.5 py-0.5 rounded text-zinc-300 text-[11px]">feature/q4-announcement</code>
                  </span>
                </div>
              </div>

              {/* Action: Simulate Auto-Fix Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGitPrChecking(true);
                    setTimeout(() => {
                      setGitPrFixed(!gitPrFixed);
                      setGitPrChecking(false);
                      showToast(
                        gitPrFixed 
                          ? 'Reverted PR to non-compliant draft state' 
                          : 'Applied BrandPilot Bot suggested edits & re-ran CI pipeline',
                        'success'
                      );
                    }, 400);
                  }}
                  disabled={gitPrChecking}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs cursor-pointer shadow-[0_0_15px_rgba(0,255,135,0.3)]"
                >
                  {gitPrChecking ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Running CI Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-black" />
                      <span>{gitPrFixed ? 'Reset to Uncompliant PR' : 'Apply Bot Fix & Re-run CI'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Branch Protection Gate Status Banner */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              gitPrFixed 
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                : 'bg-rose-950/40 border-rose-900/60 text-rose-200'
            }`}>
              <div className="flex items-start gap-3">
                {gitPrFixed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#00FF87] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>brandpilot-compliance / governance-gate (pull_request)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 border border-white/10">
                      GitHub Action
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-0.5">
                    {gitPrFixed
                      ? 'All brand guidelines and statutory advertising policies passed (Score: 98/100). Merge allowed.'
                      : 'Branch protection rule: Required BrandPilot check failed (Score: 58/100, Min: 85/100). Merging is blocked.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs font-mono font-bold text-zinc-400">
                  {gitPrFixed ? 'Duration: 1.8s' : 'Duration: 2.1s'}
                </span>
              </div>
            </div>

            {/* Simulated Diff Viewer */}
            <div className="border border-emerald-950 rounded-xl overflow-hidden bg-[#050806]">
              {/* Diff Header */}
              <div className="bg-[#0A120E] px-4 py-2.5 border-b border-emerald-950 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-zinc-300">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>content/announcements/enterprise-cloud-launch.md</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="text-emerald-400">+4 additions</span>
                  <span className="text-rose-400">-2 deletions</span>
                </div>
              </div>

              {/* Code Diff Lines */}
              <div className="p-3 font-mono text-xs space-y-1 overflow-x-auto">
                <div className="text-zinc-500 text-[11px]">@@ -12,6 +12,8 @@ # Enterprise Announcement</div>
                <div className="text-zinc-400 px-2 py-0.5"> 12 | ## Next-Generation Distributed Multi-Cloud</div>
                <div className="text-zinc-400 px-2 py-0.5"> 13 | </div>

                {!gitPrFixed ? (
                  <>
                    <div className="bg-rose-950/40 text-rose-200 px-2 py-1 rounded border-l-2 border-rose-500 flex items-start gap-2">
                      <span className="text-zinc-500 select-none">14 | -</span>
                      <span>AuraCloud guarantees 100% uptime with our new platform. Recognized as India&apos;s No. 1 multi-cloud provider, our proprietary AI magic provides the cheapest cloud storage.</span>
                    </div>

                    {/* BrandPilot Inline Bot Comment */}
                    <div className="my-2 ml-6 p-4 rounded-xl bg-[#0A140F] border border-emerald-800/80 shadow-lg space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-[#00FF87] text-black font-extrabold flex items-center justify-center text-[10px]">
                            BP
                          </div>
                          <span className="font-bold text-white">brandpilot-bot</span>
                          <span className="text-[10px] text-zinc-400 font-mono">reviewed line 14</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            Failing Check
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">v2.4 CI Engine</span>
                      </div>

                      <div className="space-y-1.5 text-zinc-300 text-[11px]">
                        <p className="text-rose-300 font-medium">
                          ❌ <strong>Statutory & Brand Violation:</strong> Absolute SLA guarantee (&ldquo;100% uptime&rdquo;), unverified superlative (&ldquo;India&apos;s No. 1&rdquo;), and prohibited jargon (&ldquo;AI magic&rdquo;).
                        </p>
                        <p className="text-zinc-400">
                          Per AuraCloud Fact Book 2026 & FTC Endorsement Guidelines: All SLA commitments must specify financial credit tiers; market leadership claims require analyst citations.
                        </p>
                      </div>

                      <div className="bg-[#050806] p-2.5 rounded-lg border border-emerald-950 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                          Suggested change:
                        </span>
                        <div className="text-emerald-300 font-mono text-[11px]">
                          + AuraCloud guarantees 99.95% monthly service availability backed by financial SLA credit commitments. An industry-recognized enterprise platform, we deliver intelligent automated orchestration.
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-emerald-950/40 text-emerald-200 px-2 py-1 rounded border-l-2 border-[#00FF87] flex items-start gap-2">
                      <span className="text-zinc-500 select-none">14 | +</span>
                      <span>AuraCloud guarantees 99.95% monthly service availability backed by financial SLA credit commitments. An industry-recognized enterprise platform, we deliver intelligent automated orchestration.</span>
                    </div>

                    {/* Bot Approval Comment */}
                    <div className="my-2 ml-6 p-3 rounded-xl bg-[#0A140F] border border-emerald-800/80 shadow-md flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00FF87]" />
                        <span className="font-bold text-white">brandpilot-bot</span>
                        <span className="text-zinc-400 text-[11px]">verified compliance with AuraCloud 2026 Standards</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#00FF87] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        Score: 98/100 • Approved
                      </span>
                    </div>
                  </>
                )}

                <div className="text-zinc-400 px-2 py-0.5"> 15 | </div>
                <div className="text-zinc-400 px-2 py-0.5"> 16 | Contact enterprise sales for customized hybrid cloud topologies.</div>
              </div>
            </div>

            {/* Merge Box */}
            <div className="p-4 rounded-xl bg-[#060B08] border border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <GitCommit className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300">
                  {gitPrFixed 
                    ? 'All requirements satisfied. Changes are ready to be merged into main.' 
                    : '1 check has failed. Branch protection requires all checks to pass before merging.'}
                </span>
              </div>

              <button
                type="button"
                disabled={!gitPrFixed}
                onClick={() => showToast('Pull request #142 successfully merged to main!', 'success')}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold rounded-xl shadow transition-all text-xs cursor-pointer"
              >
                Merge pull request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
