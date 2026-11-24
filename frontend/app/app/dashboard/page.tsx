'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBrandPilot } from '@/lib/store';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Plus,
  BookOpen,
  ShieldCheck,
  Calendar,
  Layers,
  BarChart3,
  ExternalLink,
  RotateCcw,
  Activity,
  Filter,
  Check,
  FileText,
  Shield,
  Tag
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function DashboardPage() {
  const {
    currentWorkspace,
    currentUser,
    currentRole,
    submissions,
    findings,
    facts,
    terminology,
    activities,
    resetAllTrackers
  } = useBrandPilot();

  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [activityFilter, setActivityFilter] = useState<'all' | 'audit' | 'approval' | 'policy' | 'correction'>('all');

  // Dynamic KPI calculation from store
  const totalAudits = submissions.length;
  const pendingReviews = submissions.filter(s => s.status === 'in_review' || s.status === 'pending_review').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;

  // Average score
  const avgScore = totalAudits > 0
    ? Math.round(submissions.reduce((acc, s) => acc + (s.compliance_score || 0), 0) / totalAudits)
    : 100;

  // Flatten findings
  const allFindings = Object.values(findings).flat();
  const openIssues = allFindings.filter(f => f.status === 'pending').length;
  const resolvedIssues = allFindings.filter(f => f.status === 'accepted').length;
  const avgTurnaround = submissions.length > 0 ? (submissions.some(s => s.status === 'approved') ? '1.4 hrs' : 'Active') : '—';

  // Issue distribution dynamically counted from live findings
  const claimsCount = allFindings.filter(f => f.category === 'unsupported_claim').length;
  const termsCount = allFindings.filter(f => f.category === 'terminology').length;
  const factsCount = allFindings.filter(f => f.category === 'outdated_fact').length;
  const toneCount = allFindings.filter(f => f.category === 'tone_mismatch').length;
  const disclaimersCount = allFindings.filter(f => f.category === 'missing_disclaimer').length;

  const issueDistributionData = [
    { name: 'Unsupported Claims', count: claimsCount, fill: '#EF4444' },
    { name: 'Terminology Rules', count: termsCount, fill: '#00FF87' },
    { name: 'Outdated Facts', count: factsCount, fill: '#F59E0B' },
    { name: 'Tone Mismatches', count: toneCount, fill: '#A855F7' },
    { name: 'Missing Disclaimers', count: disclaimersCount, fill: '#06B6D4' }
  ];

  // Pipeline distribution
  const pipelineData = [
    { stage: 'Drafts', count: submissions.filter(s => s.status === 'draft' || s.status === 'audited').length },
    { stage: 'In Review', count: pendingReviews },
    { stage: 'Changes Req.', count: submissions.filter(s => s.status === 'changes_requested').length },
    { stage: 'Approved', count: approvedCount }
  ];

  // Filtered activity items
  const filteredActivities = activities.filter(act => {
    if (activityFilter === 'all') return true;
    return act.type === activityFilter;
  });

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Header with Title, Persona Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Enterprise SaaS Governance</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-[#00FF87] border border-emerald-800">
              Active Role: {currentRole.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {currentUser.full_name}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Central telemetry for brand compliance scanning, correction studio, and cryptographic approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={resetAllTrackers}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A120E] border border-emerald-900/60 hover:border-emerald-500 rounded-lg text-xs font-bold text-zinc-300 hover:text-emerald-400 transition-colors shadow-xs cursor-pointer"
            title="Reset local metrics and telemetry counters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset Metrics</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A120E] border border-emerald-900/60 rounded-lg text-xs font-medium text-zinc-300 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="bg-transparent border-none outline-hidden cursor-pointer text-zinc-200"
            >
              <option className="bg-[#0A120E] text-white">Last 7 Days</option>
              <option className="bg-[#0A120E] text-white">Last 30 Days</option>
              <option className="bg-[#0A120E] text-white">This Quarter</option>
              <option className="bg-[#0A120E] text-white">All Time</option>
            </select>
          </div>

          <Link
            href="/app/audit"
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg shadow-md transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>Audit Content</span>
          </Link>
        </div>
      </div>

      {/* Prominent Primary KPI Hierarchy (NexusDash Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Primary Card 1: Compliance Health Score */}
        <div className="bg-[#0A120E] p-5 rounded-2xl border-2 border-emerald-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
            <span className="font-bold uppercase tracking-wider text-emerald-400">Brand Health Score</span>
            <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">{avgScore}%</span>
            <span className="text-xs font-bold text-[#00FF87] flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <div className="w-full bg-[#060B08] h-2 rounded-full overflow-hidden mt-3 border border-emerald-950">
            <div
              className="bg-linear-to-r from-emerald-500 to-[#00FF87] h-full rounded-full transition-all duration-500"
              style={{ width: `${avgScore}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">
            {totalAudits > 0 ? `Computed across ${totalAudits} live audited documents` : 'Awaiting initial draft audit'}
          </p>
        </div>

        {/* Primary Card 2: Total Content Audits */}
        <div className="bg-[#0A120E] p-5 rounded-2xl border border-emerald-900/60 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
            <span className="font-bold uppercase tracking-wider text-zinc-300">Total Audited Drafts</span>
            <FileCheck2 className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">{totalAudits}</span>
            <span className="text-xs text-zinc-400 font-mono">documents</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-3 flex items-center justify-between pt-2 border-t border-emerald-950/80">
            <span>Approved: <strong className="text-[#00FF87]">{approvedCount}</strong></span>
            <span>In Review: <strong className="text-amber-400">{pendingReviews}</strong></span>
          </div>
        </div>

        {/* Primary Card 3: Pending Approvals */}
        <div className="bg-[#0A120E] p-5 rounded-2xl border border-emerald-900/60 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
            <span className="font-bold uppercase tracking-wider text-amber-400">Pending Gatekeeper Sign-off</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-400">{pendingReviews}</span>
            <span className="text-xs text-zinc-400">in review queue</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-3 flex items-center justify-between pt-2 border-t border-emerald-950/80">
            <span>Avg Turnaround: <strong className="text-white">{avgTurnaround}</strong></span>
            <Link href="/app/approvals" className="text-emerald-400 hover:underline font-bold text-[11px]">
              Review Queue →
            </Link>
          </div>
        </div>

        {/* Primary Card 4: Issues Resolved & Corrections */}
        <div className="bg-[#0A120E] p-5 rounded-2xl border border-emerald-900/60 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
            <span className="font-bold uppercase tracking-wider text-[#00FF87]">Corrections Resolved</span>
            <Sparkles className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">{resolvedIssues}</span>
            <span className="text-xs text-rose-400">({openIssues} pending)</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-3 flex items-center justify-between pt-2 border-t border-emerald-950/80">
            <span>Knowledge Rules: <strong className="text-white">{facts.length + terminology.length} active</strong></span>
            <Link href="/app/corrections" className="text-emerald-400 hover:underline font-bold text-[11px]">
              Open Studio →
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Issue Distribution by Category */}
        <div className="lg:col-span-7 bg-[#0A120E] p-5 rounded-2xl border border-emerald-900/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Brand Violation Distribution by Category</h2>
              <p className="text-xs text-zinc-400">Deterministic terminology rules + pgvector semantic audit breakdown</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-[#00FF87] border border-emerald-800">
              Deterministic + RAG
            </span>
          </div>
          {allFindings.length === 0 ? (
            <div className="h-64 w-full flex flex-col items-center justify-center text-center p-6 bg-[#060B08] rounded-xl border border-emerald-950/80">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-2 opacity-60" />
              <p className="text-xs font-bold text-zinc-200">Trackers Active & Clear</p>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-sm">
                No policy issues detected yet. Audit candidate text to dynamically populate live category distributions.
              </p>
              <Link href="/app/audit" className="mt-3 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                Audit First Draft →
              </Link>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={issueDistributionData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#132418" />
                  <XAxis type="number" stroke="#6E7D72" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={11} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050806', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {issueDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Approval Workflow Pipeline */}
        <div className="lg:col-span-5 bg-[#0A120E] p-5 rounded-2xl border border-emerald-900/60 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white">Governance Approval Pipeline</h2>
              <Link href="/app/approvals" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                View Queue <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-zinc-400 mb-4">Stage distribution of active candidate content</p>

            <div className="space-y-3">
              {pipelineData.map(item => (
                <div key={item.stage} className="p-3 rounded-lg border border-emerald-950 bg-[#060B08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.stage === 'Approved'
                          ? 'bg-[#00FF87] shadow-[0_0_6px_#00FF87]'
                          : item.stage === 'In Review'
                          ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                          : item.stage === 'Changes Req.'
                          ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="text-xs font-semibold text-zinc-200">{item.stage}</span>
                  </div>
                  <span className="text-sm font-extrabold text-white">{item.count} items</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00FF87] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white">Cryptographic Human Gatekeeper:</span>
              AI recommendations guide the creator, but public release requires authenticated reviewer sign-off.
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Source Activity Feed & Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Feed Section */}
        <div className="lg:col-span-8 bg-[#0A120E] p-5 rounded-2xl border border-emerald-900/60 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-950">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00FF87]" />
                <span>Multi-Source Real-Time Activity Feed</span>
              </h2>
              <p className="text-xs text-zinc-400">Live timeline of audits, policy revisions, corrections, and approvals</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#060B08] p-1 rounded-xl border border-emerald-950 text-xs overflow-x-auto">
              <button
                onClick={() => setActivityFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activityFilter === 'all'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({activities.length})
              </button>
              <button
                onClick={() => setActivityFilter('audit')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activityFilter === 'audit'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Audits
              </button>
              <button
                onClick={() => setActivityFilter('approval')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activityFilter === 'approval'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Approvals
              </button>
              <button
                onClick={() => setActivityFilter('correction')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activityFilter === 'correction'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Corrections
              </button>
              <button
                onClick={() => setActivityFilter('policy')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activityFilter === 'policy'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Policy
              </button>
            </div>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-6 bg-[#060B08] rounded-xl border border-emerald-950/80">
              <Activity className="w-8 h-8 text-emerald-400/40 mb-2" />
              <p className="text-xs font-bold text-zinc-300">No activity logged for this filter</p>
              <p className="text-[11px] text-zinc-500 mt-1 max-w-sm">
                Activity records are generated automatically upon content audits, corrections, policy edits, and approvals.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-emerald-950 bg-[#060B08] hover:border-emerald-900 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/80 flex items-center justify-center shrink-0">
                      {item.type === 'audit' && <FileCheck2 className="w-3.5 h-3.5 text-[#00FF87]" />}
                      {item.type === 'approval' && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                      {item.type === 'correction' && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                      {item.type === 'policy' && <BookOpen className="w-3.5 h-3.5 text-amber-400" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-white">{item.title}</span>
                        {item.status_badge && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                            {item.status_badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-1.5">
                        <span>{item.actor_name} ({item.actor_role})</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {item.target_link && (
                    <Link
                      href={item.target_link}
                      className="px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:text-[#00FF87] hover:bg-emerald-950/60 rounded-md border border-emerald-900/40 shrink-0 transition-colors"
                    >
                      View →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Governance Quick Actions & Shortcuts */}
        <div className="lg:col-span-4 bg-[#0A120E] p-5 rounded-2xl border border-emerald-900/60 shadow-lg space-y-3">
          <h2 className="text-sm font-bold text-white">Governance Quick Actions</h2>
          <p className="text-xs text-zinc-400 pb-2 border-b border-emerald-950">
            Maintain your brand source of truth
          </p>

          <Link
            href="/app/knowledge?tab=facts"
            className="w-full p-3 rounded-xl border border-emerald-950 bg-[#060B08] hover:border-emerald-500/40 hover:bg-emerald-950/40 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-[#00FF87] border border-emerald-800/60 flex items-center justify-center font-bold text-xs">
                +F
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-[#00FF87]">Manage Corporate Facts</div>
                <div className="text-[11px] text-zinc-400">{facts.length} active verified facts</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00FF87]" />
          </Link>

          <Link
            href="/app/knowledge?tab=terminology"
            className="w-full p-3 rounded-xl border border-emerald-950 bg-[#060B08] hover:border-emerald-500/40 hover:bg-emerald-950/40 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-bold text-xs">
                +T
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-[#00FF87]">Configure Terminology Rules</div>
                <div className="text-[11px] text-zinc-400">{terminology.length} prohibited & preferred terms</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00FF87]" />
          </Link>

          <Link
            href="/app/visual"
            className="w-full p-3 rounded-xl border border-emerald-950 bg-[#060B08] hover:border-emerald-500/40 hover:bg-emerald-950/40 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-cyan-400 border border-emerald-800/60 flex items-center justify-center font-bold text-xs">
                HEX
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-[#00FF87]">Visual Identity Tokens</div>
                <div className="text-[11px] text-zinc-400">Color tokens, logo exclusion & typography</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00FF87]" />
          </Link>

          <Link
            href="/app/analytics"
            className="w-full p-3 rounded-xl border border-emerald-950 bg-[#060B08] hover:border-emerald-500/40 hover:bg-emerald-950/40 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center justify-center font-bold text-xs">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-[#00FF87]">View Friction Heatmap</div>
                <div className="text-[11px] text-zinc-400">Identify chronic compliance violations</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00FF87]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
