'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  BookOpen,
  Copy,
  Check,
  Download,
  Palette,
  Type,
  Maximize2,
  CheckCircle2,
  XCircle,
  FileCode,
  Sparkles,
  ExternalLink,
  Layers,
  ShieldCheck,
  Eye
} from 'lucide-react';

interface ColorToken {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  hsl: string;
  contrastOnDark: string;
  variable: string;
}

export default function LivingStyleguidePage() {
  const { currentWorkspace } = useBrandPilot();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'logos' | 'voice'>('colors');
  const [customTextPreview, setCustomTextPreview] = useState('Enterprise Cloud Governance Engineered for Mission-Critical Reliability.');
  const [downloadingAssets, setDownloadingAssets] = useState(false);

  const colors: ColorToken[] = [
    {
      name: 'Electric Neon Mint',
      role: 'Primary Brand Key & High-Priority Actions',
      hex: '#00FF87',
      rgb: 'rgb(0, 255, 135)',
      hsl: 'hsl(152, 100%, 50%)',
      contrastOnDark: '14.2:1 (AAA Pass)',
      variable: '--color-brand-primary'
    },
    {
      name: 'Cyber Emerald',
      role: 'Secondary Accent & Status Highlights',
      hex: '#10B981',
      rgb: 'rgb(16, 185, 129)',
      hsl: 'hsl(160, 84%, 39%)',
      contrastOnDark: '9.8:1 (AAA Pass)',
      variable: '--color-brand-secondary'
    },
    {
      name: 'Deep Obsidian Void',
      role: 'Primary Canvas Background',
      hex: '#050806',
      rgb: 'rgb(5, 8, 6)',
      hsl: 'hsl(140, 25%, 3%)',
      contrastOnDark: 'N/A (Base)',
      variable: '--color-bg-base'
    },
    {
      name: 'Elevated Forest Surface',
      role: 'Cards, Modals & Navigation Containers',
      hex: '#0A110D',
      rgb: 'rgb(10, 17, 13)',
      hsl: 'hsl(146, 26%, 5%)',
      contrastOnDark: '1.2:1 (Structural)',
      variable: '--color-bg-surface'
    },
    {
      name: 'Compliance Warning Gold',
      role: 'Medium Severity Warnings & In-Review States',
      hex: '#F59E0B',
      rgb: 'rgb(245, 158, 11)',
      hsl: 'hsl(38, 92%, 50%)',
      contrastOnDark: '8.4:1 (AAA Pass)',
      variable: '--color-status-warning'
    },
    {
      name: 'Statutory Critical Crimson',
      role: 'FTC/SEC Severe Violations & Blocking Errors',
      hex: '#EF4444',
      rgb: 'rgb(239, 68, 68)',
      hsl: 'hsl(0, 84%, 60%)',
      contrastOnDark: '5.6:1 (AA Pass)',
      variable: '--color-status-critical'
    }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleExportTokens = (format: 'css' | 'tailwind') => {
    let content = '';
    if (format === 'css') {
      content = `:root {\n${colors.map(c => `  ${c.variable}: ${c.hex}; /* ${c.name} */`).join('\n')}\n}`;
    } else {
      content = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors.map(c => `        '${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}': '${c.hex}',`).join('\n')}\n      }\n    }\n  }\n};`;
    }

    navigator.clipboard.writeText(content);
    setCopiedToken(format);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleDownloadAssetPack = () => {
    setDownloadingAssets(true);
    const manifest = {
      brand: currentWorkspace.brand_name,
      version: '3.4.0',
      generatedAt: new Date().toISOString(),
      assets: [
        'logos/auracloud-primary-lockup.svg',
        'logos/auracloud-monochrome-white.svg',
        'logos/auracloud-mark-only.svg',
        'palettes/brand-tokens.json',
        'guidelines/brand-voice-principles.pdf'
      ]
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentWorkspace.brand_name.toLowerCase()}-brand-assets-manifest.json`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadingAssets(false), 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Interactive Living Brand Styleguide
            </h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time single source of truth for {currentWorkspace.brand_name}&apos;s visual design tokens, logo rules, and editorial voice standards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExportTokens('css')}
            className="px-3.5 py-2 rounded-lg bg-[#0A110D] border border-emerald-950 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            {copiedToken === 'css' ? 'CSS Copied!' : 'Copy CSS Tokens'}
          </button>

          <button
            onClick={() => handleExportTokens('tailwind')}
            className="px-3.5 py-2 rounded-lg bg-[#0A110D] border border-emerald-950 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FileCode className="w-3.5 h-3.5 text-[#00FF87]" />
            {copiedToken === 'tailwind' ? 'Tailwind Copied!' : 'Tailwind Config'}
          </button>

          <button
            onClick={handleDownloadAssetPack}
            disabled={downloadingAssets}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,255,135,0.25)]"
          >
            <Download className="w-4 h-4" />
            {downloadingAssets ? 'Preparing Bundle...' : 'Download Asset Pack'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-emerald-950/80 pb-3">
        <button
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'colors'
              ? 'bg-emerald-500 text-black font-bold shadow-sm'
              : 'bg-[#0A110D] text-zinc-400 hover:text-white border border-emerald-950'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Color System & Contrast Tokens ({colors.length})
        </button>

        <button
          onClick={() => setActiveTab('typography')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'typography'
              ? 'bg-emerald-500 text-black font-bold shadow-sm'
              : 'bg-[#0A110D] text-zinc-400 hover:text-white border border-emerald-950'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Typography Scale & Live Tester
        </button>

        <button
          onClick={() => setActiveTab('logos')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'logos'
              ? 'bg-emerald-500 text-black font-bold shadow-sm'
              : 'bg-[#0A110D] text-zinc-400 hover:text-white border border-emerald-950'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Logo Lockups & Clear Space Rules
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'voice'
              ? 'bg-emerald-500 text-black font-bold shadow-sm'
              : 'bg-[#0A110D] text-zinc-400 hover:text-white border border-emerald-950'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Editorial Voice: Do&apos;s & Don&apos;ts
        </button>
      </div>

      {/* TAB 1: COLOR SYSTEM */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colors.map((c) => (
              <div
                key={c.name}
                className="bg-[#0A110D] border border-emerald-950 rounded-xl overflow-hidden shadow-lg group hover:border-emerald-700/50 transition-all"
              >
                {/* Color Swatch Block */}
                <div
                  className="h-28 w-full p-4 flex flex-col justify-between relative transition-transform"
                  style={{ backgroundColor: c.hex }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                      {c.role.split('&')[0]}
                    </span>
                    <button
                      onClick={() => handleCopy(c.name, c.hex)}
                      className="p-1.5 rounded bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-colors text-xs flex items-center gap-1 font-mono"
                      title="Copy HEX"
                    >
                      {copiedToken === c.name ? <Check className="w-3 h-3 text-[#00FF87]" /> : <Copy className="w-3 h-3" />}
                      {c.hex}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-white">{c.name}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{c.role}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-emerald-950/80 text-xs">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>RGB:</span>
                      <span className="font-mono text-zinc-300">{c.rgb}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>WCAG Contrast:</span>
                      <span className="font-semibold text-emerald-400">{c.contrastOnDark}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>CSS Token:</span>
                      <span className="font-mono text-[10px] text-zinc-400">{c.variable}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TYPOGRAPHY SCALE & LIVE TESTER */}
      {activeTab === 'typography' && (
        <div className="space-y-6">
          {/* Interactive Tester Box */}
          <div className="bg-[#080E0B] border border-emerald-950 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-400" />
                Live Type Scale Playground
              </label>
              <span className="text-xs text-zinc-500">Edit text to inspect all typographic levels simultaneously</span>
            </div>
            <input
              type="text"
              value={customTextPreview}
              onChange={(e) => setCustomTextPreview(e.target.value)}
              className="w-full bg-[#050806] border border-emerald-950 focus:border-emerald-500 rounded-lg p-3 text-sm text-white focus:outline-none transition-colors"
              placeholder="Type any phrase to preview in typography hierarchy..."
            />
          </div>

          {/* Type Scale Hierarchy Display */}
          <div className="bg-[#0A110D] border border-emerald-950 rounded-xl divide-y divide-emerald-950/80 shadow-lg">
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-emerald-400 font-bold">Display 01 • Inter Tight 48px / Semibold</span>
                <span>Marketing Hero & Billboards</span>
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                {customTextPreview}
              </div>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-emerald-400 font-bold">Heading 01 • Inter 32px / Bold</span>
                <span>Page Titles & Major Feature Headers</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {customTextPreview}
              </div>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-emerald-400 font-bold">Heading 02 • Inter 24px / SemiBold</span>
                <span>Section Subheaders & Card Titles</span>
              </div>
              <div className="text-xl font-semibold text-zinc-200">
                {customTextPreview}
              </div>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-emerald-400 font-bold">Body Normal • Inter 15px / Regular</span>
                <span>Documentation, Copy & Product Narratives</span>
              </div>
              <div className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
                {customTextPreview} The AuraCloud governance architecture continuously reconciles marketing assertions against verified enterprise performance specifications.
              </div>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-emerald-400 font-bold">Monospace Code • JetBrains Mono 13px</span>
                <span>API Keys, Ledger Signatures & Regulatory Statutes</span>
              </div>
              <div className="font-mono text-xs text-emerald-300 bg-[#050806] p-3 rounded border border-emerald-950">
                const auditResult = await brandpilot.verifyClaim(&quot;{customTextPreview}&quot;);
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOGO RULES & CLEAR SPACE */}
      {activeTab === 'logos' && (
        <div className="space-y-6">
          {/* Logo Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0A110D] border border-emerald-950 rounded-xl p-6 flex flex-col items-center justify-center space-y-4 text-center">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Primary Neon Lockup</span>
              <div className="h-28 w-full bg-[#050806] border border-emerald-500/30 rounded-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,135,0.1)]">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black font-black flex items-center justify-center text-xl">
                  BP
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  AuraCloud
                </span>
              </div>
              <p className="text-xs text-zinc-400">Standard for digital web, mobile app bars, and high-impact hero displays.</p>
            </div>

            <div className="bg-[#0A110D] border border-emerald-950 rounded-xl p-6 flex flex-col items-center justify-center space-y-4 text-center">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Monochrome White Lockup</span>
              <div className="h-28 w-full bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-black font-black flex items-center justify-center text-xl">
                  BP
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  AuraCloud
                </span>
              </div>
              <p className="text-xs text-zinc-400">For secondary partnerships, investor decks, and grayscale publications.</p>
            </div>

            <div className="bg-[#0A110D] border border-emerald-950 rounded-xl p-6 flex flex-col items-center justify-center space-y-4 text-center">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Minimum Clear Space (1.5x)</span>
              <div className="h-28 w-full bg-[#050806] border border-dashed border-emerald-500/50 rounded-xl flex items-center justify-center relative">
                <div className="border border-emerald-400/40 p-3 rounded-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black font-black flex items-center justify-center text-sm">
                    BP
                  </div>
                  <span className="text-lg font-black text-white">AuraCloud</span>
                </div>
                <span className="absolute top-1 text-[10px] font-mono text-emerald-400">1.5x 'X' Height</span>
              </div>
              <p className="text-xs text-zinc-400">Maintain at least 1.5x icon height padding around all logo edges.</p>
            </div>
          </div>

          {/* Visual Do's & Don'ts */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Logo Usage Do&apos;s & Don&apos;ts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0A110D] border border-emerald-500/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  DO: Authorized Guidelines
                </div>
                <ul className="text-xs text-zinc-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span> Use official SVG vector assets directly from the Brand Asset Pack.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span> Place on designated dark void backgrounds (`#050806` or `#0A110D`).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span> Ensure minimum display height of 28px in digital and 0.5 in (12.7mm) in print.
                  </li>
                </ul>
              </div>

              <div className="bg-[#0A110D] border border-red-500/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <XCircle className="w-4 h-4" />
                  DON&apos;T: Prohibited Treatments
                </div>
                <ul className="text-xs text-zinc-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span> Never stretch, skew, or distort the logo aspect ratio.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span> Never apply unauthorized gradients, drop shadows, or bevel effects.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span> Never overlay the logo on busy photographic textures without a dark scrim.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EDITORIAL VOICE DO'S & DON'TS */}
      {activeTab === 'voice' && (
        <div className="space-y-4">
          <div className="bg-[#0A110D] border border-emerald-950 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Brand Tone & Voice Principles
            </h3>
            <p className="text-xs text-zinc-400">
              {currentWorkspace.brand_name}&apos;s voice is <strong>Authoritative, Precise, Transparent, and Future-Focused</strong>. We never make unsubstantiated superlative claims or use colloquial fluff.
            </p>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved Phrasing
                  </div>
                  <p className="text-xs font-medium text-white">
                    &quot;Engineered for high availability with multi-region failover and SLA-backed uptime.&quot;
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Grounds performance in technical engineering rather than hype.</p>
                </div>

                <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/30">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> Prohibited Phrasing
                  </div>
                  <p className="text-xs font-medium text-red-300">
                    &quot;The absolute best cloud ever made with 100% unbreakable servers.&quot;
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Superlatives without third-party proof violate FTC advertising substantiation.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved Phrasing
                  </div>
                  <p className="text-xs font-medium text-white">
                    &quot;Helps enterprise teams accelerate content review workflows by up to 8x based on pilot customer case studies.&quot;
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Uses verifiable qualified metrics with clear reference context.</p>
                </div>

                <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/30">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> Prohibited Phrasing
                  </div>
                  <p className="text-xs font-medium text-red-300">
                    &quot;Guaranteed to 10x your business overnight without any effort.&quot;
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Deceptive earnings and speed guarantees trigger statutory regulatory penalties.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
