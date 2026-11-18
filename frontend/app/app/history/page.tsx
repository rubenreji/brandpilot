'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBrandPilot } from '@/lib/store';
import { History, GitCommit, ArrowRight, CheckCircle2, Clock, FileText, ShieldCheck } from 'lucide-react';

export default function HistoryPage() {
  const { submissions } = useBrandPilot();
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');

  const selectedSub = submissions.find(s => s.id === selectedSubId) || submissions[0];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="pb-6 border-b border-emerald-950/80">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
          <History className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audit Trail & Governance Log</span>
          <span>•</span>
          <span>Version Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Revision History & Diff Viewer
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Trace every AI audit recommendation, accepted lexical fix, and human sign-off milestone across time.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-[#0A120E] rounded-2xl p-12 border border-emerald-950/80 shadow-lg text-center space-y-4">
          <History className="w-12 h-12 text-emerald-400/50 mx-auto" />
          <h2 className="text-base font-bold text-white">No Revision History Yet</h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            All trackers have been reset to zero. When you audit a draft and accept source-grounded suggestions, the governance milestone timeline and side-by-side version diff viewer will track changes here.
          </p>
          <div className="pt-2">
            <Link
              href="/app/audit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)]"
            >
              <span>Audit Your First Document</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Select Document:</label>
            <select
              value={selectedSub?.id || ''}
              onChange={e => setSelectedSubId(e.target.value)}
              className="text-xs py-2 px-3 border border-emerald-900/60 rounded-xl bg-[#060B08] text-zinc-200 font-medium max-w-md focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            >
              {submissions.map(s => (
                <option key={s.id} value={s.id} className="bg-[#0A120E] text-zinc-200">
                  {s.title} ({s.status})
                </option>
              ))}
            </select>
          </div>

          {/* Revision Timeline & Side-by-Side Diff */}
          {selectedSub && (
            <div className="space-y-6">
              {/* Milestone timeline */}
              <div className="bg-[#0A120E] rounded-2xl p-5 border border-emerald-950/80 shadow-lg">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Governance Milestones
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-xl border border-emerald-950 bg-[#060B08]/90">
                    <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs mb-1">
                      <GitCommit className="w-4 h-4 text-emerald-400" />
                      <span>v1.0 Ingestion</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Initial candidate submitted by {selectedSub.creator_name}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-2.5 font-mono">
                      {new Date(selectedSub.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-900/40 bg-amber-950/20">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>v1.1 AI Audit</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {selectedSub.findings_count} compliance findings identified
                    </div>
                    <div className="text-[10px] text-amber-400 mt-2.5 font-mono">
                      Initial Score: {selectedSub.compliance_score}%
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-purple-900/40 bg-purple-950/20">
                    <div className="flex items-center gap-2 text-purple-300 font-bold text-xs mb-1">
                      <GitCommit className="w-4 h-4 text-purple-400" />
                      <span>v1.2 Studio Corrections</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Superlative and terminology replacements applied
                    </div>
                    <div className="text-[10px] text-purple-400 mt-2.5 font-mono">
                      Corrected Realtime
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-800/60 bg-emerald-950/30">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>v2.0 Publication Ready</span>
                    </div>
                    <div className="text-[11px] text-zinc-300">
                      {selectedSub.status === 'approved' ? 'Signed off by Legal Review' : 'Ready for sign-off'}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-2.5 font-mono font-bold">
                      {selectedSub.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Side-by-side diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Draft */}
                <div className="bg-[#0A120E] rounded-2xl border border-rose-950/80 p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-rose-950/60">
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-rose-400" /> Original Candidate Draft (Pre-Audit)
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/50">
                      v1.0
                    </span>
                  </div>
                  <p className="text-sm font-sans leading-relaxed text-zinc-300 whitespace-pre-wrap bg-[#050806]/80 p-4 rounded-xl border border-emerald-950/60">
                    {selectedSub.original_text}
                  </p>
                </div>

                {/* Revised Current Draft */}
                <div className="bg-[#0A120E] rounded-2xl border border-emerald-900/60 p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-950/80">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-400" /> Revised & Corrected Draft (Current)
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                      Current Version ({selectedSub.status})
                    </span>
                  </div>
                  <p className="text-sm font-sans leading-relaxed text-zinc-100 whitespace-pre-wrap bg-[#050806]/80 p-4 rounded-xl border border-emerald-900/40">
                    {selectedSub.current_text}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
