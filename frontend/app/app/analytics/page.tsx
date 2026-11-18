'use client';

import React from 'react';
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
  LineChart,
  Line
} from 'recharts';

export default function AnalyticsPage() {
  const { currentWorkspace, submissions, findings, resetAllTrackers } = useBrandPilot();

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

  const violatedRules = Object.entries(violatedRulesMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8)
    .map(([rule, data]) => ({
      rule,
      violations: data.count,
      impact: data.impact,
      recommendation: data.recommendation
    }));

  // Weekly compliance score trajectory dynamically computed from actual submissions
  const scoreTrajectory = submissions.length === 0
    ? []
    : submissions.slice().reverse().map((sub, idx) => ({
        week: `Audit ${idx + 1}`,
        score: sub.compliance_score
      }));

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

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
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
            Governance Analytics & Policy Friction
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Identify recurring brand guideline friction, measure team compliance trajectory, and resolve root causes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
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

      {/* Trajectory Banner */}
      <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Enterprise Compliance Velocity
          </span>
          <h2 className="text-3xl font-black text-white mt-1.5">
            {submissions.length > 0 ? `${avgComplianceScore}% Brand Compliance Rate` : 'Trackers Reset (0 Audits Tracked)'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-md leading-relaxed">
            {submissions.length > 0
              ? `Calculated dynamically from ${submissions.length} audited draft(s). Score trajectory updates in real-time as corrections are accepted.`
              : 'All historical trackers have been reset. Compliance trajectory will chart in real-time starting from your very first audit.'}
          </p>
        </div>

        <div className="h-32 w-full md:w-80 shrink-0 bg-[#060B08]/80 p-2 rounded-xl border border-emerald-950 flex items-center justify-center">
          {scoreTrajectory.length === 0 ? (
            <div className="text-center text-xs text-zinc-500 font-mono">
              Awaiting first audit to plot trajectory
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Department Breakdown & Review Velocity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { dept: 'Technical Documentation', score: submissions.length > 0 ? avgComplianceScore : 100, change: submissions.length > 0 ? `${submissions.length} audits` : 'Awaiting audits', status: 'Highest Compliance' },
          { dept: 'Marketing Communications', score: submissions.length > 0 ? avgComplianceScore : 100, change: submissions.length > 0 ? `${submissions.length} audits` : 'Awaiting audits', status: 'Strong Adherence' },
          { dept: 'Corporate PR & Press', score: submissions.length > 0 ? avgComplianceScore : 100, change: submissions.length > 0 ? `${submissions.length} audits` : 'Awaiting audits', status: 'Real-time Tracking' },
          { dept: 'Sales Enablement', score: submissions.length > 0 ? avgComplianceScore : 100, change: submissions.length > 0 ? `${submissions.length} audits` : 'Awaiting audits', status: 'Active Governance' }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#0A120E] rounded-xl p-4 border border-emerald-950/80 shadow-md card-hover-effect space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-bold text-zinc-200 truncate">{item.dept}</span>
              <Building2 className="w-3.5 h-3.5 text-emerald-400/70 shrink-0" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{submissions.length > 0 ? `${item.score}%` : '—'}</span>
              <span className="text-[10px] font-bold text-emerald-400 font-mono">{item.change}</span>
            </div>
            <div className="w-full bg-[#060B08] rounded-full h-1.5 overflow-hidden border border-emerald-950">
              <div
                className="h-full rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                style={{ width: `${submissions.length > 0 ? item.score : 0}%` }}
              />
            </div>
            <div className="text-[10px] font-semibold text-zinc-400">{item.status}</div>
          </div>
        ))}
      </div>

      {/* Actionable Policy Insights */}
      <div className="bg-[#060B08] rounded-2xl p-6 border border-emerald-900/50 text-xs text-zinc-300 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">AI-Synthesized Governance Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0A120E] p-4 rounded-xl border border-emerald-950 shadow-md">
            <span className="font-bold text-emerald-300 block mb-1.5">Section 4.2 Training Gap</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Superlatives & unverified guarantees trigger the majority of automated findings. Enforce empirical citations across marketing copy.
            </p>
          </div>

          <div className="bg-[#0A120E] p-4 rounded-xl border border-emerald-950 shadow-md">
            <span className="font-bold text-emerald-300 block mb-1.5">Approved Nomenclature</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Prohibited terms such as &quot;AI magic&quot; are automatically intercepted and mapped to &quot;automated orchestration&quot;.
            </p>
          </div>

          <div className="bg-[#0A120E] p-4 rounded-xl border border-emerald-950 shadow-md">
            <span className="font-bold text-emerald-300 block mb-1.5">Turnaround Velocity</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Drafts verified above 85% compliance score clear brand review cycles significantly faster than flagged copy.
            </p>
          </div>
        </div>
      </div>

      {/* Top Violated Guidelines Table */}
      <div className="bg-[#0A120E] rounded-2xl border border-emerald-950/80 shadow-lg overflow-hidden">
        <div className="p-4 bg-[#060B08] border-b border-emerald-950 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Most Frequently Violated Guidelines & Terminology Rules
          </h2>
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
                  <td colSpan={4} className="py-8 text-center text-zinc-500 font-mono text-xs">
                    0 policy violations recorded. Audits you run will automatically populate this friction analysis.
                  </td>
                </tr>
              ) : (
                violatedRules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-[#060B08]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-zinc-100">{rule.rule}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{rule.violations} times</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                          rule.impact === 'Critical'
                            ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                            : rule.impact === 'High'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        }`}
                      >
                        {rule.impact}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{rule.recommendation}</td>
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
