'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import { Settings, Shield, Sliders, Key, Database, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { currentWorkspace, currentRole, updateWorkspaceSettings, isSupabaseActive, checkSupabase, showToast } = useBrandPilot();

  const [orgName, setOrgName] = useState(currentWorkspace.name);
  const [minComplianceScore, setMinComplianceScore] = useState(85);
  const [allowSelfApproval, setAllowSelfApproval] = useState(false);
  const [ragSimilarityThreshold, setRagSimilarityThreshold] = useState(0.75);
  const [testingDb, setTestingDb] = useState(false);

  const handleTestDatabase = async () => {
    setTestingDb(true);
    await checkSupabase();
    setTestingDb(false);
  };

  const handleSave = () => {
    updateWorkspaceSettings({ name: orgName });
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="pb-6 border-b border-emerald-950/80">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
          <Settings className="w-3.5 h-3.5 text-emerald-400" />
          <span>{currentWorkspace.name}</span>
          <span>•</span>
          <span>Workspace Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Organization Settings
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure multi-tenant boundaries, audit sensitivity thresholds, and governance policies.
        </p>
      </div>

      <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-6">
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-wider">General Workspace Identity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Workspace Display Name
              </label>
              <input
                type="text"
                disabled={currentRole !== 'admin'}
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="w-full text-xs p-2.5 border border-emerald-900/60 bg-[#060B08] text-zinc-100 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Unique Tenant Slug
              </label>
              <input
                type="text"
                disabled
                value={currentWorkspace.slug}
                className="w-full text-xs p-2.5 border border-emerald-950 bg-[#050806] font-mono text-zinc-500 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-950">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Governance & Approval Guardrails</h2>
          <p className="text-xs text-zinc-400 mt-0.5 mb-4">
            Enforce quality gates before drafts can transition to the review queue.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-200 mb-1">
                <span>Minimum Compliance Score Required for Human Review</span>
                <span className="font-mono text-emerald-400 font-bold">{minComplianceScore}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                disabled={currentRole !== 'admin'}
                value={minComplianceScore}
                onChange={e => setMinComplianceScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="text-[11px] text-zinc-500 mt-1">
                Drafts scoring under {minComplianceScore}% must have critical findings resolved before submitting to brand reviewers.
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#060B08] rounded-xl border border-emerald-950">
              <div>
                <span className="text-xs font-bold text-zinc-200 block">Strict Human Separation Policy</span>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Prohibit content creators from self-approving their own submissions.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[11px] font-bold">
                Always Enforced
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-950">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Vector Search & AI Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs">
            <div className="p-3.5 bg-[#060B08] rounded-xl border border-emerald-950">
              <span className="font-bold text-zinc-300 block">Active Embedding Model</span>
              <span className="font-mono text-emerald-400 font-bold block mt-1">text-embedding-3-small</span>
              <span className="text-[11px] text-zinc-500">1536-dimensional HNSW index in pgvector</span>
            </div>

            <div className="p-3.5 bg-[#060B08] rounded-xl border border-emerald-950">
              <span className="font-bold text-zinc-300 block">RAG Cosine Similarity Cutoff</span>
              <span className="font-mono text-emerald-400 font-bold block mt-1">0.75 threshold</span>
              <span className="text-[11px] text-zinc-500">Suppresses irrelevant policy retrieval</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-950">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Cloud Database Integration</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Multi-tenant PostgreSQL database with pgvector embeddings and Row Level Security (RLS).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isSupabaseActive
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                  : 'bg-emerald-950/50 text-emerald-400 border-emerald-900/60'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'}`} />
                {isSupabaseActive ? 'Supabase Cloud Connected' : 'Auto Local Engine Active'}
              </span>

              <button
                type="button"
                onClick={handleTestDatabase}
                disabled={testingDb}
                className="px-3 py-1 bg-[#060B08] hover:bg-emerald-950/50 text-zinc-300 hover:text-white text-xs font-bold rounded-lg transition-colors border border-emerald-900/60 cursor-pointer"
              >
                {testingDb ? 'Checking...' : 'Test Connection'}
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#060B08] rounded-xl border border-emerald-950 text-xs space-y-2">
            <div className="font-bold text-zinc-200">
              {isSupabaseActive
                ? 'Your deployment is actively synced with Supabase PostgreSQL.'
                : 'BrandPilot is running seamlessly with its self-contained persistence engine.'}
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              To connect your live Supabase project at any time: In the Vercel Dashboard, go to <strong>Project Settings → Environment Variables</strong>, add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then redeploy!
            </p>
          </div>
        </div>

        {currentRole === 'admin' && (
          <div className="pt-4 border-t border-emerald-950 flex justify-end">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              Save Organization Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
