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
  ExternalLink
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
    terminology
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
  const avgTurnaround = '4.2 hrs';

  // Issue distribution for Recharts
  const issueDistributionData = [
    { name: 'Unsupported Claims', count: 14, fill: '#DC5353' },
    { name: 'Terminology Rules', count: 18, fill: '#3978E8' },
    { name: 'Outdated Facts', count: 6, fill: '#E9A23B' },
    { name: 'Tone Mismatches', count: 9, fill: '#8B5CF6' },
    { name: 'Missing Disclaimers', count: 4, fill: '#10B981' }
  ];

  // Audit activity trend data
  const auditTrendData = [
    { week: 'W1', audits: 8, violations: 16 },
    { week: 'W2', audits: 12, violations: 22 },
    { week: 'W3', audits: 19, violations: 28 },
    { week: 'W4', audits: 24, violations: 18 },
    { week: 'W5', audits: 31, violations: 12 }
  ];

  // Pipeline distribution
  const pipelineData = [
    { stage: 'Drafts', count: submissions.filter(s => s.status === 'draft' || s.status === 'audited').length },
    { stage: 'In Review', count: pendingReviews },
    { stage: 'Changes Req.', count: submissions.filter(s => s.status === 'changes_requested').length },
    { stage: 'Approved', count: approvedCount }
  ];

  const COLORS = ['#3978E8', '#E9A23B', '#DC5353', '#16A36A', '#8B5CF6'];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header with Title & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Workspace Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentUser.full_name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time brand compliance intelligence and pending governance actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="bg-transparent border-none outline-hidden cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>All Time</option>
            </select>
          </div>

          <Link
            href="/app/audit"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3978E8] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Audit Content</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (Values computed directly from records) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Audits</span>
            <FileCheck2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalAudits}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +28% this month
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Pending Reviews</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{pendingReviews}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Requires human sign-off
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{approvedCount}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Ready for publishing
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Open Issues</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{openIssues}</div>
          <div className="text-[11px] text-rose-500 font-medium mt-1">
            Active compliance flags
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Issues Resolved</span>
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{resolvedIssues}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Corrections accepted
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Avg Turnaround</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgTurnaround}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            -45m vs last quarter
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Issue Distribution by Category */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Issue Distribution by Policy Category</h2>
              <p className="text-xs text-slate-500">Breakdown of brand violations detected across drafts</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Deterministic + RAG
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueDistributionData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#101827', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {issueDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approval Pipeline Status */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Approval Workflow Pipeline</h2>
              <Link href="/app/approvals" className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">
                View Queue <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-4">Stage distribution of active submissions</p>

            <div className="space-y-3">
              {pipelineData.map(item => (
                <div key={item.stage} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.stage === 'Approved'
                          ? 'bg-emerald-500'
                          : item.stage === 'In Review'
                          ? 'bg-amber-500'
                          : item.stage === 'Changes Req.'
                          ? 'bg-rose-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-800">{item.stage}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.count} items</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-950 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Human Gatekeeper Enforced:</span>
              AI recommendations guide the creator, but approvals are cryptographically stamped by assigned managers.
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Content Submissions */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Content Audits & Submissions</h2>
              <p className="text-xs text-slate-500">Live draft status and identified compliance findings</p>
            </div>
            <Link href="/app/audit" className="text-xs text-blue-600 hover:underline font-semibold">
              New Audit →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {submissions.map(sub => (
              <div key={sub.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 truncate">{sub.title}</span>
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                        sub.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : sub.status === 'in_review' || sub.status === 'pending_review'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {sub.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span>By {sub.creator_name}</span>
                    <span>•</span>
                    <span>{sub.word_count} words</span>
                    <span>•</span>
                    <span>{sub.findings_count} findings ({sub.critical_count} critical)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">{sub.compliance_score}%</div>
                    <div className="text-[10px] text-slate-400">Score</div>
                  </div>

                  <Link
                    href={`/app/corrections/${sub.id}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    Open Studio →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Governance Actions */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Governance Quick Actions</h2>
          <p className="text-xs text-slate-500 pb-2 border-b border-slate-100">
            Maintain your brand source of truth
          </p>

          <Link
            href="/app/knowledge?tab=facts"
            className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                +F
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Add Approved Fact</div>
                <div className="text-[11px] text-slate-500">{facts.length} active corporate facts</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </Link>

          <Link
            href="/app/knowledge?tab=terminology"
            className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                +T
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Configure Terminology</div>
                <div className="text-[11px] text-slate-500">{terminology.length} prohibited & preferred rules</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </Link>

          <Link
            href="/app/visual"
            className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                HEX
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Visual Palette Check</div>
                <div className="text-[11px] text-slate-500">Color swatch & logo validation</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </Link>

          <Link
            href="/app/analytics"
            className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">View Friction Heatmap</div>
                <div className="text-[11px] text-slate-500">Identify chronic team mistakes</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
