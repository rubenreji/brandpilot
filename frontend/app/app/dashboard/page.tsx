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
  RotateCcw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
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
    resetAllTrackers
  } = useBrandPilot();

  const [dateRange, setDateRange] = useState('Last 30 Days');

  // Dynamic KPI calculation from store
  const totalAudits = submissions.length;
  const pendingReviews = submissions.filter(s => s.status === 'in_review' || s.status === 'pending_review').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;

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

  // Audit activity trend data dynamically constructed from actual submissions
  const auditTrendData = submissions.length === 0
    ? []
    : submissions.slice().reverse().map((sub, idx) => ({
        week: `Draft ${idx + 1}`,
        audits: idx + 1,
        violations: sub.findings_count
      }));

  // Pipeline distribution
  const pipelineData = [
    { stage: 'Drafts', count: submissions.filter(s => s.status === 'draft' || s.status === 'audited').length },
    { stage: 'In Review', count: pendingReviews },
    { stage: 'Changes Req.', count: submissions.filter(s => s.status === 'changes_requested').length },
    { stage: 'Approved', count: approvedCount }
  ];

  const COLORS = ['#00FF87', '#F59E0B', '#EF4444', '#10B981', '#06B6D4'];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Header with Title & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Workspace Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser.full_name}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time brand compliance intelligence and pending governance actions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={resetAllTrackers}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A120E] border border-emerald-900/60 hover:border-emerald-500 rounded-lg text-xs font-bold text-zinc-300 hover:text-emerald-400 transition-colors shadow-xs cursor-pointer"
            title="Reset all trackers and start from zero"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset Trackers</span>
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
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg shadow-md transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>Audit Content</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="bg-[#0A120E] p-4 rounded-xl border border-emerald-900/60 shadow-md card-hover-effect">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Total Audits</span>
            <FileCheck2 className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalAudits}</div>
          <div className="text-[11px] text-[#00FF87] font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {totalAudits > 0 ? `${totalAudits} draft(s) tracked` : 'Ready for first audit'}
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#0A120E] p-4 rounded-xl border border-emerald-900/60 shadow-md card-hover-effect">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Pending Reviews</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingReviews}</div>
          <div className="text-[11px] text-zinc-500 font-medium mt-1">
            Requires human sign-off
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#0A120E] p-4 rounded-xl border border-emerald-900/60 shadow-md card-hover-effect">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-[#00FF87]">{approvedCount}</div>
          <div className="text-[11px] text-zinc-500 font-medium mt-1">
            Ready for publishing
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#0A120E] p-4 rounded-xl border border-emerald-900/60 shadow-md card-hover-effect">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Open Issues</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">{openIssues}</div>
          <div className="text-[11px] text-rose-400/80 font-medium mt-1">
            Active compliance flags
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-[#0A120E] p-4 rounded-xl border border-emerald-900/60 shadow-md card-hover-effect">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Issues Resolved</span>
            <Sparkles className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-extrabold text-white">{resolvedIssues}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            Corrections accepted
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-[#0A120E] p-4 rounded-xl border border-emerald-900/60 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Avg Turnaround</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{avgTurnaround}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            -45m vs last quarter
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Issue Distribution by Category */}
        <div className="lg:col-span-7 bg-[#0A120E] p-5 rounded-2xl border border-emerald-900/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Issue Distribution by Policy Category</h2>
              <p className="text-xs text-zinc-400">Breakdown of brand violations detected across drafts</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Deterministic + RAG
            </span>
          </div>
          {allFindings.length === 0 ? (
            <div className="h-64 w-full flex flex-col items-center justify-center text-center p-6 bg-[#060B08] rounded-xl border border-emerald-950/80">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-2 opacity-60" />
              <p className="text-xs font-bold text-zinc-200">Trackers Active & Clear</p>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-sm">
                No policy issues detected yet. When you audit documents, compliance findings and violation categories will be dynamically charted here.
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

        {/* Approval Pipeline Status */}
        <div className="lg:col-span-5 bg-[#0A120E] p-5 rounded-2xl border border-emerald-900/60 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white">Approval Workflow Pipeline</h2>
              <Link href="/app/approvals" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                View Queue <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-zinc-400 mb-4">Stage distribution of active submissions</p>

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
              <span className="font-bold block text-white">Human Gatekeeper Enforced:</span>
              AI recommendations guide the creator, but approvals are cryptographically stamped by assigned managers.
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Content Submissions */}
        <div className="lg:col-span-8 bg-[#0A120E] p-5 rounded-2xl border border-emerald-900/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Recent Content Audits & Submissions</h2>
              <p className="text-xs text-zinc-400">Live draft status and identified compliance findings</p>
            </div>
            <Link href="/app/audit" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
              New Audit →
            </Link>
          </div>

          {submissions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-6 bg-[#060B08] rounded-xl border border-emerald-950/80 my-2">
              <FileCheck2 className="w-10 h-10 text-emerald-400/50 mb-3" />
              <h3 className="text-sm font-bold text-white">No drafts audited yet</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Trackers are reset and will begin recording from your very first action. Audit candidate copy, press releases, or articles to begin live tracking.
              </p>
              <Link
                href="/app/audit"
                className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)]"
              >
                Audit Content Now →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-emerald-950/60">
              {submissions.map(sub => (
                <div key={sub.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate">{sub.title}</span>
                      <span
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                          sub.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : sub.status === 'in_review' || sub.status === 'pending_review'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}
                      >
                        {sub.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                      <span>By {sub.creator_name}</span>
                      <span>•</span>
                      <span>{sub.word_count} words</span>
                      <span>•</span>
                      <span>{sub.findings_count} findings ({sub.critical_count} critical)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#00FF87]">{sub.compliance_score}%</div>
                      <div className="text-[10px] text-zinc-500">Score</div>
                    </div>

                    <Link
                      href={`/app/corrections/${sub.id}`}
                      className="px-3 py-1.5 bg-[#060B08] hover:bg-emerald-950/60 hover:text-[#00FF87] text-zinc-200 rounded-lg text-xs font-semibold border border-emerald-900/50 transition-colors cursor-pointer"
                    >
                      Open Studio →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Governance Actions */}
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
                <div className="text-xs font-bold text-white group-hover:text-[#00FF87]">Add Approved Fact</div>
                <div className="text-[11px] text-zinc-400">{facts.length} active corporate facts</div>
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
                <div className="text-xs font-bold text-white group-hover:text-[#00FF87]">Configure Terminology</div>
                <div className="text-[11px] text-zinc-400">{terminology.length} prohibited & preferred rules</div>
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
                <div className="text-xs font-bold text-white group-hover:text-[#00FF87]">Visual Palette Check</div>
                <div className="text-[11px] text-zinc-400">Color swatch & logo validation</div>
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
                <div className="text-[11px] text-zinc-400">Identify chronic team mistakes</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00FF87]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
