'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBrandPilot } from '@/lib/store';
import { Sparkles, Edit3, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function CorrectionsIndexPage() {
  const router = useRouter();
  const { submissions, createLiveSubmission, showToast } = useBrandPilot();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (submissions && submissions.length > 0) {
      router.replace(`/app/corrections/${submissions[0].id}`);
    }
  }, [submissions, router]);

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Please enter some text to analyze.', 'error');
      return;
    }
    const finalTitle = title.trim() || 'Live Audited Content';
    const newId = createLiveSubmission(finalTitle, content.trim());
    showToast(`Draft created and real-time audit started!`, 'success');
    router.push(`/app/corrections/${newId}`);
  };

  const handleLoadSample = () => {
    setTitle('AuraCloud Enterprise Scaling Announcement');
    setContent(
      `We are thrilled to announce that AuraCloud is India's No. 1 AI cloud company. Our revolutionary AI magic guarantees 100% accuracy and is the cheapest solution available on the market today. Join thousands of developers who trust auracloud without hesitation.`
    );
  };

  const handleLoadDemoDraft = () => {
    const demoTitle = "Q4 Enterprise Cloud Infrastructure Announcement";
    const demoText = "We are thrilled to announce that AuraCloud is India's No. 1 AI cloud company. Our revolutionary AI magic guarantees 100% accuracy and is the cheapest solution available on the market today. Join thousands of developers who trust auracloud without hesitation.";
    const id = createLiveSubmission(demoTitle, demoText);
    showToast('Loaded demo audited document into studio!', 'success');
    router.push(`/app/corrections/${id}`);
  };

  if (submissions && submissions.length > 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8 bg-[#050806]">
        <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h2 className="text-base font-black text-white">Opening Live Correction Studio</h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">Routing to latest audited content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6 text-zinc-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Correction Studio</span>
            <span>•</span>
            <span>Live AI Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Correction Studio Workspace
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Analyze candidate drafts against your brand manual and apply 1-click verified corrections.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadDemoDraft}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl shadow-[0_0_16px_rgba(16,185,129,0.35)] flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto shrink-0"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Load Demo Audited Draft →</span>
        </button>
      </div>

      <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-2xl space-y-5">
        <form onSubmit={handleStartAnalysis} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Draft Title / Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Q4 Cloud Product Announcement"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs p-3 bg-[#060B08] border border-emerald-900/60 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Content Body to Audit
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Load Sample Text with Policy Violations</span>
              </button>
            </div>
            <textarea
              rows={8}
              required
              placeholder="Type or paste your candidate marketing copy, press release, or documentation here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full text-xs p-3.5 bg-[#060B08] border border-emerald-900/60 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-zinc-500 font-mono">
              Deterministic + RAG + Contextual LLM verification will start upon submission.
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_18px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Analyze in Studio & Begin Tracking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
