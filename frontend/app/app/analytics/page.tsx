'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Download,
  Building2,
  Check,
  RotateCcw,
  Users,
  ShieldCheck,
  Radio,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export default function AnalyticsPage() {
  const { currentWorkspace, submissions, findings, resetAllTrackers } = useBrandPilot();
  const [telemetryMode, setTelemetryMode] = useState<'live' | 'benchmark'>(submissions.length > 0 ? 'live' : 'benchmark');

  const allFindings = Object.values(findings).flat();

  // Dynamically group violations from live findings
  const violatedRulesMap: Record<string, { count: number; impact: string; recommendation: string }> = {};
  allFindings.forEach(f => {
    const key = f.relevant_brand_rule || 'Brand Policy Violation';
    if (!violatedRulesMap[key]) {
      violatedRulesMap[key] = {
        count: 0,
        impact: f.severity === 'critical' ? 'Critical' : f.severity === 'high' ? 'High' : 'Medium',
        recommendation: `Follow ${f.source_document || 'brand standard'}: ${f.explanation || 'Replace with approved nomenclature.'}`
      };
    }
    violatedRulesMap[key].count += 1;
    if (f.severity === 'critical') violatedRulesMap[key].impact = 'Critical';
  });

  const liveViolatedRules = Object.entries(violatedRulesMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8)
    .map(([rule, data]) => ({
      rule,
      violations: data.count,
      impact: data.impact,
      recommendation: data.recommendation
    }));

  // Benchmark baseline rules for comparison when no audits exist or in benchmark mode
  const benchmarkRules = [
    {
      rule: 'Factual Claims Policy 4.2: Prohibited Market Superlatives',
      violations: 8,
      impact: 'Critical',
      recommendation: 'Market leadership claims require published analyst citations (Gartner, IDC).'
    },
    {
      rule: "Terminology Policy: Prohibited Term 'AI magic'",
      violations: 6,
      impact: 'High',
      recommendation: 'Replace unscientific buzzwords with "automated cloud orchestration".'
    },
    {
      rule: 'Legal Compliance Standard: Prohibited Absolute Guarantees',
      violations: 5,
      impact: 'Critical',
      recommendation: 'Remove absolute warranties without explicit legal SLA disclaimer clauses.'
    },
    {
      rule: 'Brand Nomenclature Policy 3.4: Capitalization Standard',
      violations: 4,
      impact: 'Medium',
      recommendation: 'Enforce camelCase "AuraCloud" across all external product collateral.'
    }
  ];

  const violatedRules = telemetryMode === 'live' && submissions.length > 0 ? liveViolatedRules : benchmarkRules;

  // Trajectory calculation
  const liveTrajectory = submissions.length === 0
    ? []
    : submissions.slice().reverse().map((sub, idx) => ({
        week: `Draft ${idx + 1}`,
        score: sub.compliance_score ?? 100
      }));

  const benchmarkTrajectory = [
    { week: 'Week 1', score: 48 },
    { week: 'Week 2', score: 62 },
    { week: 'Week 3', score: 79 },
    { week: 'Week 4', score: 94 }
  ];

  const scoreTrajectory = telemetryMode === 'live' && submissions.length > 0 ? liveTrajectory : benchmarkTrajectory;

  const avgComplianceScore = submissions.length > 0
    ? Math.round(submissions.reduce((acc, s) => acc + (s.compliance_score ?? 100), 0) / submissions.length)
    : 100;

  const [copiedCsv, setCopiedCsv] = React.useState(false);

  const handleExportCsv = () => {
    const headers = ['Rule Name', 'Violations Tracked', 'Severity Impact', 'Corrective Recommendation'];
    const rows = (violatedRules.length > 0 ? violatedRules : [
      { rule: 'All active brand guidelines clean', violations: 0, impact: 'Clean', recommendation: 'No policy violations detected' }
    ]).map(r => [
      `"${r.rule.replace(/"/g, '""')}"`,
      r.violations,
      `"${r.impact}"`,
      `"${r.recommendation.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brandpilot-governance-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  // Team performance metrics
  const teamMembers = [
    {
      name: 'Marcus Vance',
      role: 'Content Creator',
      auditsCount: submissions.filter(s => s.creator_name?.includes('Marcus') || s.creator_id?.includes('creator')).length || 1,
      avgScore: avgComplianceScore,
      resolvedIssues: allFindings.filter(f => f.status === 'accepted').length || 5,
      turnaround: '18 min'
    },
    {
      name: 'Sarah Lin',
      role: 'Brand Reviewer',
      auditsCount: submissions.filter(s => s.status === 'approved' || s.status === 'in_review').length || 2,
      avgScore: 98,
      resolvedIssues: 12,
      turnaround: '1.2 hrs'
    },
    {
      name: 'Ruben John Reji',
      role: 'Org Administrator',
      auditsCount: 4,
      avgScore: 100,
      resolvedIssues: 8,
      turnaround: 'Instant'
    }
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Governance Analytics & Violation Trends
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Identify recurring brand guideline friction, measure team compliance trajectory, and resolve root causes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Telemetry Mode Toggle (Distinct Live Telemetry vs Benchmark Insights) */}
          <div className="flex items-center gap-1.5 bg-[#0A120E] p-1 rounded-xl border border-emerald-950">
            <button
              type="button"
              onClick={() => setTelemetryMode('live')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                telemetryMode === 'live'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${submissions.length > 0 ? 'bg-black animate-pulse' : 'bg-zinc-500'}`}></span>
              <span>Live Telemetry</span>
            </button>
            <button
              type="button"
              onClick={() => setTelemetryMode('benchmark')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                telemetryMode === 'benchmark'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Industry Benchmark</span>
            </button>
          </div>

          <button
            type="button"
            onClick={resetAllTrackers}
            className="px-3 py-2 bg-[#060B08] border border-emerald-900/60 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset all trackers and start from zero"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset Trackers</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 bg-[#060B08] border border-emerald-900/60 hover:border-emerald-500 text-zinc-200 hover:text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            {copiedCsv ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-emerald-400" />}
            <span>{copiedCsv ? 'Exported CSV!' : 'Export Audit Log (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* Telemetry Status Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs ${
        telemetryMode === 'live' && submissions.length > 0
          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
          : 'bg-amber-950/30 border-amber-800/80 text-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
          <div>
            <strong className="block text-white font-bold">
              {telemetryMode === 'live' && submissions.length > 0
                ? '● Real-Time Production Telemetry Active'
                : 'Benchmark Sample Mode (Awaiting New Audits)'}
            </strong>
            <span className="text-[11px] opacity-90">
              {telemetryMode === 'live' && submissions.length > 0
                ? `Metrics and compliance scores are computed dynamically from ${submissions.length} active draft(s) and ${allFindings.length} detected findings.`
                : 'All trackers have been reset. Displaying industry baseline governance metrics and simulated policy friction until new drafts are audited.'}
            </span>
          </div>
        </div>
        <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-[#0A120E] border border-emerald-900/80 text-emerald-400 shrink-0">
          {telemetryMode === 'live' ? 'LIVE DATA' : 'SAMPLE BASELINE'}
        </span>
      </div>

      {/* Trajectory Velocity Banner */}
      <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Enterprise Compliance Velocity
          </span>
          <h2 className="text-3xl font-black text-white mt-1.5">
            {telemetryMode === 'live' && submissions.length > 0
              ? `${avgComplianceScore}% Brand Compliance Rate`
              : '94% Industry Target Score'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-md leading-relaxed">
            {telemetryMode === 'live' && submissions.length > 0
              ? `Calculated dynamically from ${submissions.length} audited draft(s). Score updates in real-time as corrections are accepted.`
              : 'Target baseline for Fortune 500 multi-cloud enterprises adhering to ISO 27001 and strict advertising governance.'}
          </p>
        </div>

        <div className="h-32 w-full md:w-80 shrink-0 bg-[#060B08]/80 p-2 rounded-xl border border-emerald-950 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreTrajectory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#16261B" />
              <XAxis dataKey="week" fontSize={11} stroke="#6B7280" tickLine={false} />
              <YAxis domain={[0, 100]} fontSize={11} stroke="#6B7280" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A120E',
                  borderColor: '#10B981',
                  borderRadius: '0.75rem',
                  color: '#F9FAFB',
                  fontSize: '12px'
                }}
              />
              <Line type="monotone" dataKey="score" stroke="#00FF87" strokeWidth={3} dot={{ r: 4, fill: '#00FF87' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Performance Breakdown (Medium Priority Improvement) */}
      <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Team Compliance Performance & Turnaround Velocity
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">3 Active Contributors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#060B08] border border-emerald-950 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{member.name}</h4>
                  <span className="text-[10px] text-zinc-400 font-mono">{member.role}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-[#00FF87] border border-emerald-700 text-xs font-bold font-mono">
                  {member.avgScore}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-emerald-950/80 pt-2 text-zinc-400">
                <div>
                  <span className="text-zinc-500 block text-[10px]">Audits Handled:</span>
                  <span className="font-bold text-white">{member.auditsCount}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">Turnaround:</span>
                  <span className="font-bold text-emerald-400">{member.turnaround}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Violated Guidelines & Policy Friction Table */}
      <div className="bg-[#0A120E] rounded-2xl border border-emerald-950/80 shadow-lg overflow-hidden">
        <div className="p-4 bg-[#060B08] border-b border-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Most Frequently Violated Guidelines & Terminology Rules
            </h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            {violatedRules.length} Tracked Policy Rule(s)
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-emerald-950/80 text-zinc-400 font-bold uppercase tracking-wider bg-[#060B08]/40">
              <tr>
                <th className="py-3 px-4">Brand Policy / Rule Name</th>
                <th className="py-3 px-4">Violations Tracked</th>
                <th className="py-3 px-4">Severity Impact</th>
                <th className="py-3 px-4">Corrective Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {violatedRules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500">
                    No policy violations recorded. All candidate drafts compliant.
                  </td>
                </tr>
              ) : (
                violatedRules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-[#060B08]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-zinc-200 max-w-xs truncate">
                      {rule.rule}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {rule.violations}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                          rule.impact === 'Critical'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : rule.impact === 'High'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {rule.impact}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px] max-w-sm truncate">
                      {rule.recommendation}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
