'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import { History, GitCommit, ArrowRight, CheckCircle2, Clock, FileText } from 'lucide-react';

export default function HistoryPage() {
  const { submissions } = useBrandPilot();
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || 'sub-demo-flagged');

  const selectedSub = submissions.find(s => s.id === selectedSubId) || submissions[0];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <span>Audit Trail & Governance Log</span>
          <span>•</span>
          <span>Version Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Revision History & Diff Viewer
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Trace every AI recommendation, accepted suggestion, and human sign-off milestone.
        </p>
      </div>

      {/* Selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-slate-700">Select Document:</label>
        <select
          value={selectedSubId}
          onChange={e => setSelectedSubId(e.target.value)}
          className="text-xs p-2 border border-slate-300 rounded-lg bg-white font-medium max-w-md"
        >
          {submissions.map(s => (
            <option key={s.id} value={s.id}>
              {s.title} ({s.status})
            </option>
          ))}
        </select>
      </div>

      {/* Revision Timeline & Side-by-Side Diff */}
      {selectedSub && (
        <div className="space-y-6">
          {/* Milestone timeline */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Governance Milestones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs mb-1">
                  <GitCommit className="w-4 h-4 text-blue-600" />
                  <span>v1.0 Ingestion</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Initial draft submitted by {selectedSub.creator_name}
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  {new Date(selectedSub.created_at).toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs mb-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>v1.1 AI Audit</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {selectedSub.findings_count} compliance findings identified
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  Score: {selectedSub.compliance_score}%
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs mb-1">
                  <GitCommit className="w-4 h-4 text-purple-600" />
                  <span>v1.2 Studio Corrections</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Superlative and terminology replacements applied
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  Score improved
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-emerald-50/40">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>v2.0 Publication Ready</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  {selectedSub.status === 'approved' ? 'Approved by Sarah Lin' : 'Ready for sign-off'}
                </div>
                <div className="text-[10px] text-emerald-700 mt-2 font-mono">
                  {selectedSub.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-side diff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Draft */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-rose-500" /> Original Candidate Draft (Pre-Audit)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  v1.0 (Flagged)
                </span>
              </div>
              <p className="text-sm font-sans leading-relaxed text-slate-700 whitespace-pre-wrap">
                {selectedSub.original_text}
              </p>
            </div>

            {/* Revised Current Draft */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-500" /> Revised & Corrected Draft (Current)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Current Version ({selectedSub.status})
                </span>
              </div>
              <p className="text-sm font-sans leading-relaxed text-slate-800 whitespace-pre-wrap">
                {selectedSub.current_text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
