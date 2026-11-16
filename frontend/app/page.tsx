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
    <div className="min-h-screen bg-[#F6F8FC] text-slate-900 flex flex-col font-sans">
      {/* Top Banner */}
      <div className="bg-[#101827] text-white text-xs px-4 py-2 border-b border-slate-800 text-center flex items-center justify-center gap-2">
        <span className="bg-[#3978E8] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Enterprise Demo
        </span>
        <span className="text-slate-300">
          Experience real-time AI brand governance with pre-configured AuraCloud enterprise guidelines.
        </span>
        <Link href="/app/dashboard" className="text-[#3978E8] hover:text-blue-300 font-semibold flex items-center gap-1 ml-2">
          Open Demo Platform <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#101827] flex items-center justify-center text-white font-bold text-lg shadow-sm border border-slate-800">
              <span className="text-[#3978E8] mr-0.5 font-black">B</span>P
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">BrandPilot</span>
              <span className="text-xs text-slate-500 block -mt-1 font-medium">Enterprise Governance</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#workflow" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#technology" className="hover:text-slate-900 transition-colors">Architecture</a>
            <a href="#security" className="hover:text-slate-900 transition-colors">Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/app/dashboard"
              className="text-sm font-semibold bg-[#101827] text-white hover:bg-slate-800 px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AI-Assisted Brand Governance for Everyday Content Teams</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#101827] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Keep Every Piece of Content True to Your Brand.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#758195] max-w-2xl mx-auto leading-relaxed">
          BrandPilot brings your guidelines, approved facts, and brand voice into one intelligent workspace — helping your team detect inconsistencies, correct content, and maintain control before publication.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/app/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#3978E8] text-white font-semibold shadow-md hover:bg-blue-600 transition-all flex items-center justify-center gap-2 text-base"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/app/corrections/sub-demo-flagged"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-base shadow-xs"
          >
            <span>Live Interactive Demo</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </Link>
        </div>

        {/* Product UI Composition Preview */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-slate-200 to-slate-300 shadow-2xl border border-slate-300/60">
          <div className="rounded-xl overflow-hidden bg-[#101827] border border-slate-800 text-left shadow-inner">
            {/* Mock Window Header */}
            <div className="px-4 py-3 bg-[#19263A] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="ml-3 text-xs font-mono text-slate-400">
                  BrandPilot / Auditing Studio / Q4-Product-Announcement.md
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                  Compliance: 48% (Issues Detected)
                </span>
                <span className="text-slate-400">Strict Review Pending</span>
              </div>
            </div>

            {/* Split Screen Composition Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 p-6 gap-6 bg-[#0f172a]">
              {/* Left Column: Draft with highlights */}
              <div className="md:col-span-7 bg-[#1e293b]/70 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-xs font-medium text-slate-400">
                  <span>Draft Review (Interactive Spans)</span>
                  <span className="text-blue-400">5 Citations Available</span>
                </div>
                <div className="mt-4 text-sm text-slate-200 leading-relaxed font-sans space-y-3">
                  <p>
                    AuraCloud is excited to introduce our new hybrid orchestration engine, recognized as{' '}
                    <span className="bg-amber-500/30 text-amber-300 px-1 py-0.5 rounded border border-amber-500/50 font-medium">
                      India&apos;s No. 1
                    </span>{' '}
                    multi-cloud control plane. Built with proprietary{' '}
                    <span className="bg-rose-500/30 text-rose-300 px-1 py-0.5 rounded border border-rose-500/50 font-medium">
                      AI magic
                    </span>{' '}
                    that{' '}
                    <span className="bg-rose-500/30 text-rose-300 px-1 py-0.5 rounded border border-rose-500/50 font-medium">
                      guarantees 100% accuracy
                    </span>{' '}
                    across distributed nodes...
                  </p>
                </div>
              </div>

              {/* Right Column: Source-Backed Finding Card */}
              <div className="md:col-span-5 bg-[#19263A] rounded-xl p-5 border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/40 uppercase tracking-wider text-[10px]">
                      Critical Finding
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">Match #3</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Absolute Guarantee Prohibited</h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    &quot;guarantees 100% accuracy&quot; violates Section 4.2 of the AuraCloud Communication Manual.
                  </p>
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-[11px] text-slate-300">
                    <div className="font-semibold text-blue-400 mb-1">Source Citation:</div>
                    <p className="italic text-slate-400">
                      &quot;Never state absolute guarantees or exaggerated superlatives. Specifications must be verifiable.&quot;
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
                  <div className="text-[11px] text-emerald-400 font-medium">
                    Suggested: &quot;high-reliability automated verification&quot;
                  </div>
                  <span className="px-2 py-1 rounded bg-[#3978E8] text-white text-xs font-semibold">
                    1-Click Apply
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs uppercase font-bold tracking-widest text-blue-600">The Problem</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              Why Everyday Content Violates Enterprise Brand Standards
            </p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              When content teams scale, brand books end up buried in static 80-page PDFs. Marketing, PR, and product teams unintentionally introduce risks that damage brand equity and invite legal liability.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg mb-4">
                !
              </div>
              <h3 className="text-base font-bold text-slate-900">Unsubstantiated Claims</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Writers inadvertently claim &quot;No. 1 in the industry&quot; or &quot;100% guarantee&quot; without third-party citations, exposing the firm to regulatory censure.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
                ~
              </div>
              <h3 className="text-base font-bold text-slate-900">Outdated Facts & Metrics</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Legacy uptime numbers, old pricing tiers, or retired executive quotes persist across presentations and whitepapers without a single source of truth.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">
                #
              </div>
              <h3 className="text-base font-bold text-slate-900">Off-Brand Buzzwords</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Casual jargon like &quot;AI magic&quot; and lowercase spelling of trademarked names degrade enterprise credibility in formal stakeholder communications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Step Workflow */}
      <section id="workflow" className="py-20 bg-[#F6F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-[#3978E8]">How BrandPilot Works</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              End-to-End Brand Governance Workflow
            </p>
            <p className="mt-4 text-base text-slate-600">
              A structured, human-in-the-loop lifecycle ensuring brand guidelines are active guardrails rather than shelfware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(step => (
              <div
                key={step.num}
                className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-[#3978E8]">{step.num}</span>
                  <h3 className="mt-2 text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500">
                  <span>Step {step.num}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-[#3978E8]">Platform Capabilities</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              Engineered for Enterprise Compliance
            </p>
            <p className="mt-4 text-base text-slate-600">
              Designed specifically to resolve the nuances of trademark law, corporate messaging, and editorial reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-lg bg-blue-100/70 text-[#3978E8] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology & Architecture Section */}
      <section id="technology" className="py-20 bg-[#101827] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#3978E8]">Technical Architecture</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Triple-Layer Governance Engine
            </h2>
            <p className="mt-4 text-base text-slate-400">
              BrandPilot rejects hallucination-prone zero-shot prompts in favor of an orchestrated deterministic and semantic audit pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#19263A] p-6 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-[#3978E8] flex items-center justify-center font-bold">1</div>
                <h3 className="text-base font-bold text-white">Deterministic Linter</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Instant regex and exact term matching against active prohibited phrases, mandatory naming conventions, and superlative claim patterns. Runs with sub-5ms latency.
              </p>
            </div>

            <div className="bg-[#19263A] p-6 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">2</div>
                <h3 className="text-base font-bold text-white">Semantic RAG Index</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Chunked guideline PDFs and verified facts indexed in PostgreSQL with pgvector embeddings and BM25 token matching, delivering pinpoint page and section citations.
              </p>
            </div>

            <div className="bg-[#19263A] p-6 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">3</div>
                <h3 className="text-base font-bold text-white">Contextual LLM Auditor</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Synthesizes retrieved rules with candidate text to evaluate nuanced tone mismatches, generating source-backed explanations and verified 1-click replacements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Multi-tenancy */}
      <section id="security" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-2xl p-8 sm:p-12 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-4">
                <Lock className="w-3.5 h-3.5" />
                <span>Enterprise Isolation & Zero Leakage</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Rigorous Multi-Tenant Isolation
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Every organization workspace is strictly isolated via PostgreSQL Row Level Security (RLS) policies. Brand guidelines, confidential PR drafts, and approved corporate facts are cryptographically segregated and never used to train global LLM models.
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-3">
              <Link
                href="/app/dashboard"
                className="px-6 py-3 rounded-xl bg-[#101827] text-white font-semibold hover:bg-slate-800 transition-all text-sm text-center shadow-sm"
              >
                Launch Live Demo
              </Link>
              <span className="text-xs text-slate-500 text-center">No credit card or setup required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101827] text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#3978E8] text-white font-bold text-sm flex items-center justify-center">
              BP
            </div>
            <span className="font-bold text-white text-sm">BrandPilot</span>
            <span className="text-slate-500">|</span>
            <span>AI-Assisted Brand Governance</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/app/dashboard" className="hover:text-white transition-colors">Workspace</Link>
            <Link href="/app/knowledge" className="hover:text-white transition-colors">Guidelines</Link>
            <Link href="/app/audit" className="hover:text-white transition-colors">Audit Studio</Link>
            <Link href="/app/approvals" className="hover:text-white transition-colors">Approvals</Link>
          </div>

          <div className="text-slate-500">
            &copy; 2026 BrandPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
