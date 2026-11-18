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
  Check
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
  const { currentWorkspace } = useBrandPilot();

  // Top violated rules data
  const violatedRules = [
    {
      rule: 'Factual Claims Policy 4.2 (Superlatives)',
      violations: 24,
      impact: 'Critical',
      recommendation: 'Train copywriting team on third-party citation requirements.'
    },
    {
      rule: 'Terminology: Prohibited "AI magic"',
      violations: 19,
      impact: 'High',
      recommendation: 'Update CMS autocomplete snippet with "automated orchestration".'
    },
    {
      rule: 'Absolute Reliability Guarantees',
      violations: 14,
      impact: 'Critical',
      recommendation: 'Mandate SLA link insertion for all uptime mentions.'
    },
    {
      rule: 'Brand Capitalization (auracloud vs AuraCloud)',
      violations: 11,
      impact: 'Medium',
      recommendation: 'Enforce pre-commit linter for markdown repos.'
    },
    {
      rule: 'Comparative Pricing Claims',
      violations: 8,
      impact: 'High',
      recommendation: 'Require competitive benchmark audit prior to publication.'
    }
  ];

  // Weekly compliance score trajectory
  const scoreTrajectory = [
    { week: 'Week 1', score: 62 },
    { week: 'Week 2', score: 68 },
    { week: 'Week 3', score: 74 },
    { week: 'Week 4', score: 82 },
    { week: 'Week 5', score: 89 },
    { week: 'Week 6', score: 94 }
  ];

  const [copiedCsv, setCopiedCsv] = React.useState(false);

  const handleExportCsv = () => {
    const headers = ['Rule Name', 'Violations (30d)', 'Severity Impact', 'Corrective Recommendation'];
    const rows = violatedRules.map(r => [
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Governance Analytics & Policy Friction
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Identify recurring brand guideline friction, measure team compliance trajectory, and resolve root causes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer hover:border-slate-300 self-start sm:self-auto"
        >
          {copiedCsv ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-slate-600" />}
          <span>{copiedCsv ? 'Exported CSV!' : 'Export Audit Log (CSV)'}</span>
        </button>
      </div>

      {/* Trajectory Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Enterprise Compliance Velocity
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">94% Brand Compliance Rate</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Average first-pass compliance score has risen from 62% to 94% across content teams over the last 6 weeks.
          </p>
        </div>

        <div className="h-28 w-full md:w-80 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreTrajectory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="week" fontSize={10} stroke="#94A3B8" />
              <YAxis domain={[50, 100]} fontSize={10} stroke="#94A3B8" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#16A36A" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Breakdown & Review Velocity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { dept: 'Technical Documentation', score: 98, change: '+14% this month', status: 'Highest Compliance', color: 'emerald' },
          { dept: 'Marketing Communications', score: 92, change: '+18% this month', status: 'Strong Adherence', color: 'blue' },
          { dept: 'Corporate PR & Press', score: 88, change: '+9% this month', status: 'Moderate Friction', color: 'amber' },
          { dept: 'Sales Enablement', score: 86, change: '+12% this month', status: 'Needs Alignment', color: 'indigo' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs card-hover-effect space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700 truncate">{item.dept}</span>
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{item.score}%</span>
              <span className="text-[10px] font-semibold text-emerald-600 font-mono">{item.change}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  item.score >= 95 ? 'bg-emerald-500' : item.score >= 90 ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${item.score}%` }}
              />
            </div>
            <div className="text-[10px] font-medium text-slate-400">{item.status}</div>
          </div>
        ))}
      </div>

      {/* Actionable Policy Insights */}
      <div className="bg-blue-50/80 rounded-2xl p-6 border border-blue-200 text-xs text-blue-950 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">AI-Synthesized Governance Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-blue-200/60 shadow-xs">
            <span className="font-bold text-slate-900 block mb-1">Section 4.2 Training Gap</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              42% of all flagged findings this month stemmed from Section 4.2 (&quot;Superlatives & Guarantees&quot;). Recommend a 15-minute editorial workshop for the content team.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200/60 shadow-xs">
            <span className="font-bold text-slate-900 block mb-1">Autocomplete Terminology Rule</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              &quot;AI magic&quot; was detected in 19 separate draft audits. Add our approved synonym &quot;automated orchestration&quot; to internal CMS snippet guidelines.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200/60 shadow-xs">
            <span className="font-bold text-slate-900 block mb-1">Fast-Track Turnaround</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Submissions with pre-audit compliance scores &gt; 85% were approved 3.8x faster, cutting average editorial review cycle to under 2 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Top Violated Guidelines Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Most Frequently Violated Guidelines & Terminology Rules
          </h2>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 text-slate-500 font-semibold">
            <tr>
              <th className="py-3 px-4">Brand Policy / Rule Name</th>
              <th className="py-3 px-4">Violations (30d)</th>
              <th className="py-3 px-4">Severity Impact</th>
              <th className="py-3 px-4">Corrective Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {violatedRules.map((rule, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4 font-bold text-slate-900">{rule.rule}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{rule.violations} times</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                      rule.impact === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : rule.impact === 'High'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {rule.impact}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">{rule.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
