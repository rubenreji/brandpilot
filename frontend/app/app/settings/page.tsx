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
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <span>{currentWorkspace.name}</span>
          <span>•</span>
          <span>Workspace Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Organization Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure multi-tenant boundaries, audit sensitivity thresholds, and governance policies.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">General Workspace Identity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workspace Display Name
              </label>
              <input
                type="text"
                disabled={currentRole !== 'admin'}
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unique Tenant Slug
              </label>
              <input
                type="text"
                disabled
                value={currentWorkspace.slug}
                className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 font-mono text-slate-500 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Governance & Approval Guardrails</h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Enforce quality gates before drafts can transition to the review queue.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Minimum Compliance Score Required for Human Review</span>
                <span className="font-mono text-blue-600">{minComplianceScore}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                disabled={currentRole !== 'admin'}
                value={minComplianceScore}
                onChange={e => setMinComplianceScore(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="text-[11px] text-slate-400 mt-1">
                Drafts scoring under {minComplianceScore}% must have critical findings resolved before submitting to brand reviewers.
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Strict Human Separation Policy</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Prohibit content creators from self-approving their own submissions.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Always Enforced
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Vector Search & AI Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-700 block">Active Embedding Model</span>
              <span className="font-mono text-slate-900 font-bold block mt-1">text-embedding-3-small</span>
              <span className="text-[11px] text-slate-500">1536-dimensional HNSW index in pgvector</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-700 block">RAG Cosine Similarity Cutoff</span>
              <span className="font-mono text-slate-900 font-bold block mt-1">0.75 threshold</span>
              <span className="text-[11px] text-slate-500">Suppresses irrelevant policy retrieval</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Supabase Cloud Database Integration</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-tenant PostgreSQL database with pgvector embeddings and Row Level Security (RLS).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isSupabaseActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                {isSupabaseActive ? 'Supabase Cloud Connected' : 'Auto Local Engine Active'}
              </span>

              <button
                type="button"
                onClick={handleTestDatabase}
                disabled={testingDb}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
              >
                {testingDb ? 'Checking...' : 'Test Connection'}
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="font-semibold text-slate-800">
              {isSupabaseActive
                ? 'Your Vercel deployment is actively synced with Supabase PostgreSQL.'
                : 'BrandPilot is running seamlessly on Vercel with its self-contained persistence engine.'}
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              To connect your live Supabase project to Vercel at any time: In the Vercel Dashboard, go to <strong>Project Settings → Environment Variables</strong>, add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then redeploy!
            </p>
          </div>
        </div>

        {currentRole === 'admin' && (
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#101827] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              Save Organization Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
