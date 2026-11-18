'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  BookOpen,
  FileCheck2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Lock,
  Layers,
  Search,
  Scale,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  const steps = [
    {
      num: '01',
      title: 'Create Workspace',
      desc: 'Set up your multi-tenant organization boundary with secure role-based access control.'
    },
    {
      num: '02',
      title: 'Upload Guidelines',
      desc: 'Ingest brand books, style guides, and PR policies with automatic chunking and vector indexing.'
    },
    {
      num: '03',
      title: 'Configure Facts & Terms',
      desc: 'Define approved corporate data, product metrics, and prohibited/preferred terminology rules.'
    },
    {
      num: '04',
      title: 'Submit Content',
      desc: 'Draft or paste announcements, articles, social posts, or campaigns into the audit workspace.'
    },
    {
      num: '05',
      title: 'AI-Assisted Audit',
      desc: 'Run deterministic checks, BM25 semantic retrieval, and contextual LLM evaluation in seconds.'
    },
    {
      num: '06',
      title: 'Interactive Corrections',
      desc: 'Inspect source-backed citations and accept 1-click replacements that update the draft in real time.'
    },
    {
      num: '07',
      title: 'Human-in-the-Loop Approval',
      desc: 'Brand managers review verified drafts. AI advises; authorized humans give final publication sign-off.'
    },
    {
      num: '08',
      title: 'Track Analytics',
      desc: 'Identify recurring guideline friction, audit turnaround time, and team compliance trends.'
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Brand Knowledge Base',
      desc: 'Centralized repository for style guides, corporate facts, product specs, and brand voice matrices.'
    },
    {
      icon: Search,
      title: 'Source-Backed Citations',
      desc: 'Every single flagged violation cites the exact manual, section, page, and supporting policy clause.'
    },
    {
      icon: Sparkles,
      title: 'Intelligent Corrections',
      desc: 'Inline span highlighting with 1-click replacements that preserve brand context and tone.'
    },
    {
      icon: UserCheck,
      title: 'Human Approval Centre',
      desc: 'Strict governance: AI assists and flags, but only verified human brand managers can approve for release.'
    },
    {
      icon: Scale,
      title: 'Terminology & Claims Engine',
      desc: 'Catches prohibited superlatives, absolute guarantees, unverified rankings, and competitor comparisons.'
    },
    {
      icon: BarChart3,
      title: 'Governance Analytics',
      desc: 'Heatmaps and recurring issue metrics revealing which policies cause the highest friction across teams.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050806] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Banner */}
      <div className="bg-[#020403] text-zinc-300 text-xs px-4 py-2 border-b border-emerald-950/80 text-center flex items-center justify-center gap-2">
        <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Enterprise Governance
        </span>
        <span className="text-zinc-400">
          Experience real-time AI brand governance with pre-configured AuraCloud enterprise guidelines.
        </span>
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 ml-2">
          Open Platform <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Navigation */}
      <header className="bg-[#070D09]/90 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#040705] flex items-center justify-center text-white font-bold text-lg shadow-sm border border-emerald-500/40 shadow-[0_0_12px_rgba(0,255,135,0.2)]">
              <span className="text-[#00FF87] mr-0.5 font-black">B</span>P
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">BrandPilot</span>
              <span className="text-xs text-emerald-400/80 block -mt-1 font-medium">Enterprise Governance</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#workflow" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#technology" className="hover:text-emerald-400 transition-colors">Architecture</a>
            <a href="#security" className="hover:text-emerald-400 transition-colors">Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-emerald-950/50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-sm font-extrabold bg-emerald-500 text-black hover:bg-emerald-400 px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1.5 shadow-[0_0_16px_rgba(16,185,129,0.35)]"
            >
              <span>Explore Now</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Ambient Morphing Background */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Ambient Morphing Glow Orbs in Emerald Neon */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-blob -z-10"></div>
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-blob -z-10" style={{ animationDelay: '4s' }}></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#00FF87] animate-pulse" />
          <span>AI-Assisted Brand Governance for Everyday Content Teams</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Keep Every Piece of Content <span className="animate-gradient-text">True to Your Brand.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          BrandPilot brings your guidelines, approved facts, and brand voice into one intelligent workspace — helping your team detect inconsistencies, correct content, and maintain control before publication.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold shadow-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 text-base hover-lift btn-press shadow-[0_0_24px_rgba(16,185,129,0.4)]"
          >
            <span>Explore Now</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>
          <Link
            href="/app/corrections"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0A120E] border border-emerald-900/60 text-zinc-200 font-semibold hover:bg-emerald-950/50 hover:border-emerald-500/40 transition-all flex items-center justify-center gap-2 text-base shadow-xs hover-lift btn-press"
          >
            <span>Live Interactive Studio</span>
            <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse shadow-[0_0_6px_#00FF87]"></span>
          </Link>
        </div>

        {/* Product UI Composition Preview */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-emerald-500/30 via-emerald-900/20 to-[#0A120E] shadow-2xl border border-emerald-900/50">
          <div className="rounded-xl overflow-hidden bg-[#060B08] border border-emerald-950 text-left shadow-inner">
            {/* Mock Window Header */}
            <div className="px-4 py-3 bg-[#0A120E] border-b border-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-[0_0_6px_rgba(244,63,94,0.6)]"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-[0_0_6px_rgba(245,158,11,0.6)]"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_rgba(16,185,129,0.6)]"></span>
                <span className="ml-3 text-xs font-mono text-zinc-400">
                  BrandPilot / Auditing Studio / Q4-Product-Announcement.md
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50 font-medium">
                  Compliance: 48% (Issues Detected)
                </span>
                <span className="text-zinc-400">Strict Review Pending</span>
              </div>
            </div>

            {/* Split Screen Composition Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 p-6 gap-6 bg-[#060B08]">
              {/* Left Column: Draft with highlights */}
              <div className="md:col-span-7 bg-[#0A120E] rounded-xl p-5 border border-emerald-950">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-950 text-xs font-medium text-zinc-400">
                  <span>Draft Review (Interactive Spans)</span>
                  <span className="text-emerald-400">5 Citations Available</span>
                </div>
                <div className="mt-4 text-sm text-zinc-200 leading-relaxed font-sans space-y-3">
                  <p>
                    AuraCloud is excited to introduce our new hybrid orchestration engine, recognized as{' '}
                    <span className="bg-amber-950/80 text-amber-300 px-1 py-0.5 rounded border border-amber-600/60 font-medium">
                      India&apos;s No. 1
                    </span>{' '}
                    multi-cloud control plane. Built with proprietary{' '}
                    <span className="bg-rose-950/80 text-rose-300 px-1 py-0.5 rounded border border-rose-600/60 font-medium">
                      AI magic
                    </span>{' '}
                    that{' '}
                    <span className="bg-rose-950/80 text-rose-300 px-1 py-0.5 rounded border border-rose-600/60 font-medium">
                      guarantees 100% accuracy
                    </span>{' '}
                    across distributed nodes...
                  </p>
                </div>
              </div>

              {/* Right Column: Source-Backed Finding Card */}
              <div className="md:col-span-5 bg-[#0D1712] rounded-xl p-5 border border-emerald-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-semibold border border-rose-700/60 uppercase tracking-wider text-[10px]">
                      Critical Finding
                    </span>
                    <span className="text-zinc-500 font-mono text-[11px]">Match #3</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Absolute Guarantee Prohibited</h4>
                  <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                    &quot;guarantees 100% accuracy&quot; violates Section 4.2 of the AuraCloud Communication Manual.
                  </p>
                  <div className="mt-3 p-2.5 rounded-lg bg-[#060B08] border border-emerald-950 text-[11px] text-zinc-300">
                    <div className="font-semibold text-emerald-400 mb-1">Source Citation:</div>
                    <p className="italic text-zinc-400">
                      &quot;Never state absolute guarantees or exaggerated superlatives. Specifications must be verifiable.&quot;
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center justify-between">
                  <div className="text-[11px] text-[#00FF87] font-medium">
                    Suggested: &quot;high-reliability automated verification&quot;
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500 text-black text-xs font-extrabold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    1-Click Apply
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-[#070D09] border-y border-emerald-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#00FF87]">The Problem</h2>
            <p className="mt-2 text-3xl font-extrabold text-white">
              Why Everyday Content Violates Enterprise Brand Standards
            </p>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed">
              When content teams scale, brand books end up buried in static 80-page PDFs. Marketing, PR, and product teams unintentionally introduce risks that damage brand equity and invite legal liability.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-emerald-950 bg-[#0A120E] hover:border-emerald-500/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/40 flex items-center justify-center font-bold text-lg mb-4">
                !
              </div>
              <h3 className="text-base font-bold text-white">Unsubstantiated Claims</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Writers inadvertently claim &quot;No. 1 in the industry&quot; or &quot;100% guarantee&quot; without third-party citations, exposing the firm to regulatory censure.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-emerald-950 bg-[#0A120E] hover:border-emerald-500/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center justify-center font-bold text-lg mb-4">
                ~
              </div>
              <h3 className="text-base font-bold text-white">Outdated Facts & Metrics</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Legacy uptime numbers, old pricing tiers, or retired executive quotes persist across presentations and whitepapers without a single source of truth.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-emerald-950 bg-[#0A120E] hover:border-emerald-500/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 text-[#00FF87] border border-emerald-800/40 flex items-center justify-center font-bold text-lg mb-4">
                #
              </div>
              <h3 className="text-base font-bold text-white">Off-Brand Buzzwords</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Casual jargon like &quot;AI magic&quot; and lowercase spelling of trademarked names degrade enterprise credibility in formal stakeholder communications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Step Workflow */}
      <section id="workflow" className="py-20 bg-[#050806]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#00FF87]">How BrandPilot Works</h2>
            <p className="mt-2 text-3xl font-extrabold text-white">
              End-to-End Brand Governance Workflow
            </p>
            <p className="mt-4 text-base text-zinc-400">
              A structured, human-in-the-loop lifecycle ensuring brand guidelines are active guardrails rather than shelfware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(step => (
              <div
                key={step.num}
                className="bg-[#0A120E] rounded-xl p-5 border border-emerald-950 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-[#00FF87]">{step.num}</span>
                  <h3 className="mt-2 text-base font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-950/80 flex items-center text-xs font-semibold text-emerald-400/80">
                  <span>Step {step.num}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-[#070D09] border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#00FF87]">Platform Capabilities</h2>
            <p className="mt-2 text-3xl font-extrabold text-white">
              Engineered for Enterprise Compliance
            </p>
            <p className="mt-4 text-base text-zinc-400">
              Designed specifically to resolve the nuances of trademark law, corporate messaging, and editorial reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-xl border border-emerald-950 bg-[#0A120E] hover:border-emerald-500/40 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950 text-[#00FF87] border border-emerald-800/50 flex items-center justify-center mb-4 shadow-[0_0_10px_rgba(0,255,135,0.15)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{feat.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology & Architecture Section */}
      <section id="technology" className="py-20 bg-[#040705] text-white border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#00FF87]">Technical Architecture</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Triple-Layer Governance Engine
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              BrandPilot rejects hallucination-prone zero-shot prompts in favor of an orchestrated deterministic and semantic audit pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0A120E] p-6 rounded-xl border border-emerald-950">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40 flex items-center justify-center font-bold">1</div>
                <h3 className="text-base font-bold text-white">Deterministic Linter</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Instant regex and exact term matching against active prohibited phrases, mandatory naming conventions, and superlative claim patterns. Runs with sub-5ms latency.
              </p>
            </div>

            <div className="bg-[#0A120E] p-6 rounded-xl border border-emerald-950">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-[#00FF87] border border-emerald-800/40 flex items-center justify-center font-bold">2</div>
                <h3 className="text-base font-bold text-white">Semantic RAG Index</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Chunked guideline PDFs and verified facts indexed in PostgreSQL with pgvector embeddings and BM25 token matching, delivering pinpoint page and section citations.
              </p>
            </div>

            <div className="bg-[#0A120E] p-6 rounded-xl border border-emerald-950">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/40 flex items-center justify-center font-bold">3</div>
                <h3 className="text-base font-bold text-white">Contextual LLM Auditor</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Synthesizes retrieved rules with candidate text to evaluate nuanced tone mismatches, generating source-backed explanations and verified 1-click replacements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Multi-tenancy */}
      <section id="security" className="py-20 bg-[#070D09] border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A120E] rounded-2xl p-8 sm:p-12 border border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full mb-4 border border-emerald-800">
                <Lock className="w-3.5 h-3.5 text-[#00FF87]" />
                <span>Enterprise Isolation & Zero Leakage</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Rigorous Multi-Tenant Isolation
              </h2>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Every organization workspace is strictly isolated via PostgreSQL Row Level Security (RLS) policies. Brand guidelines, confidential PR drafts, and approved corporate facts are cryptographically segregated and never used to train global LLM models.
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-3">
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-extrabold hover:bg-emerald-400 transition-all text-sm text-center shadow-lg shadow-[0_0_18px_rgba(16,185,129,0.35)]"
              >
                Explore Platform
              </Link>
              <span className="text-xs text-zinc-500 text-center">No credit card or setup required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020403] text-zinc-500 text-xs py-12 border-t border-emerald-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black font-extrabold text-sm flex items-center justify-center">
              BP
            </div>
            <span className="font-bold text-white text-sm">BrandPilot</span>
            <span className="text-emerald-900">|</span>
            <span>AI-Assisted Brand Governance</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <Link href="/app/dashboard" className="hover:text-emerald-400 transition-colors">Workspace</Link>
            <Link href="/app/knowledge" className="hover:text-emerald-400 transition-colors">Guidelines</Link>
            <Link href="/app/audit" className="hover:text-emerald-400 transition-colors">Audit Studio</Link>
            <Link href="/app/approvals" className="hover:text-emerald-400 transition-colors">Approvals</Link>
          </div>

          <div className="text-zinc-600">
            &copy; 2026 BrandPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
