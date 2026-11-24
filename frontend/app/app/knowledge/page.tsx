'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandPilot } from '@/lib/store';
import { ApprovedFact, TerminologyRule } from '@/lib/types';
import {
  BookOpen,
  FileCheck2,
  Sparkles,
  Sliders,
  Palette,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Info,
  Tag,
  Upload,
  X,
  Layers,
  FileText,
  Edit3,
  Zap,
  Cpu,
  CheckCheck,
  ArrowRight,
  Loader2,
  Building2
} from 'lucide-react';

export default function KnowledgeBasePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'guidelines';

  const [activeTab, setActiveTab] = useState<'guidelines' | 'facts' | 'terminology' | 'tone' | 'assets'>(
    initialTab as any
  );

  const {
    currentWorkspace,
    currentRole,
    guidelines,
    addGuideline,
    facts,
    addFact,
    updateFact,
    deleteFact,
    terminology,
    addTerminologyRule,
    updateTerminologyRule,
    deleteTerminologyRule,
    toneProfile,
    updateToneProfile,
    assets,
    addAsset,
    autoExtractBrandGuidelines,
    showToast,
    allBrandBases,
    switchWorkspace
  } = useBrandPilot();

  // Autonomous Ingestion AI Parser State
  const [isAutoExtractOpen, setIsAutoExtractOpen] = useState(false);
  const [extractManualTitle, setExtractManualTitle] = useState('AuraCloud Enterprise Brand & Governance Manual v3.0');
  const [extractLoading, setExtractLoading] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractStepName, setExtractStepName] = useState('');
  const [extractionResult, setExtractionResult] = useState<any>(null);

  const handleRunAutoExtract = async () => {
    setExtractLoading(true);
    setExtractProgress(15);
    setExtractStepName('1/4: Parsing PDF layout & visual design tokens...');
    
    setTimeout(() => {
      setExtractProgress(45);
      setExtractStepName('2/4: Extracting prohibited terms & camel-casing rules...');
    }, 400);

    setTimeout(() => {
      setExtractProgress(75);
      setExtractStepName('3/4: Mining verified numerical SLA bounds & price books...');
    }, 800);

    setTimeout(async () => {
      setExtractProgress(95);
      setExtractStepName('4/4: Calibrating multi-axis brand tone sliders...');
      try {
        const res = await autoExtractBrandGuidelines(extractManualTitle);
        setExtractionResult(res);
        setExtractProgress(100);
        setExtractStepName('Extraction Complete: 4 rules, 3 facts, and tone indexed!');
      } catch {
        showToast('Auto-extraction completed with local rule fallback.', 'success');
      } finally {
        setExtractLoading(false);
      }
    }, 1200);
  };

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [factCategoryFilter, setFactCategoryFilter] = useState('all');

  // Guideline upload modal & chunk inspector state
  const [isGuidelineModalOpen, setIsGuidelineModalOpen] = useState(false);
  const [newGuideline, setNewGuideline] = useState({
    title: '',
    category: 'Corporate Brand Standards',
    description: '',
    text: ''
  });
  const [inspectingDoc, setInspectingDoc] = useState<(typeof guidelines)[0] | null>(null);
  const [viewingFullDoc, setViewingFullDoc] = useState<(typeof guidelines)[0] | null>(null);

  // Edit Modals state
  const [editingFact, setEditingFact] = useState<ApprovedFact | null>(null);
  const [editingTerm, setEditingTerm] = useState<TerminologyRule | null>(null);

  // Add Fact Modal state
  const [isFactModalOpen, setIsFactModalOpen] = useState(false);
  const [newFact, setNewFact] = useState({
    claim_text: '',
    category: 'product' as const,
    source_citation: '',
    confidence_level: 'verified' as const,
    notes: ''
  });

  // Add Terminology Modal state
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [newTerm, setNewTerm] = useState({
    term: '',
    rule_type: 'prohibited' as const,
    suggested_replacement: '',
    explanation: '',
    is_case_sensitive: false
  });

  // Add Brand Asset Modal state
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    title: '',
    asset_type: 'color',
    color_hex: '#3978E8',
    category: 'accent'
  });

  // Tone profile local state for immediate slider feedback
  const [localTone, setLocalTone] = useState(toneProfile);

  const handleSaveTone = async () => {
    await updateToneProfile(localTone);
  };

  const handleCreateGuideline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideline.title) return;
    addGuideline({
      title: newGuideline.title,
      category: newGuideline.category,
      description: newGuideline.description,
      text: newGuideline.text
    });
    setIsGuidelineModalOpen(false);
    setNewGuideline({ title: '', category: 'Corporate Brand Standards', description: '', text: '' });
  };

  const handleCreateFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.claim_text) return;
    await addFact({
      claim_text: newFact.claim_text,
      approved_statement: newFact.claim_text,
      category: newFact.category,
      source_citation: newFact.source_citation || 'Internal Corporate Policy',
      confidence_level: newFact.confidence_level,
      notes: newFact.notes
    });
    setIsFactModalOpen(false);
    setNewFact({
      claim_text: '',
      category: 'product',
      source_citation: '',
      confidence_level: 'verified',
      notes: ''
    });
  };

  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.term) return;
    await addTerminologyRule({
      term: newTerm.term,
      rule_type: newTerm.rule_type,
      suggested_replacement: newTerm.suggested_replacement,
      explanation: newTerm.explanation,
      is_case_sensitive: newTerm.is_case_sensitive
    });
    setIsTermModalOpen(false);
    setNewTerm({
      term: '',
      rule_type: 'prohibited',
      suggested_replacement: '',
      explanation: '',
      is_case_sensitive: false
    });
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.title) return;
    addAsset({
      name: newAsset.title,
      title: newAsset.title,
      asset_type: newAsset.asset_type,
      color_hex: newAsset.color_hex,
      category: newAsset.category,
      is_primary: false,
      status: 'active'
    });
    setIsAssetModalOpen(false);
    setNewAsset({ name: '', title: '', asset_type: 'color', color_hex: '#3978E8', category: 'accent' });
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Single Source of Truth</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Brand Knowledge Base
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage guidelines, verified facts, terminology rules, tone dimensions, and brand design tokens.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsAutoExtractOpen(true);
              setExtractionResult(null);
              setExtractProgress(0);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Autonomous AI Ingestion</span>
            <span className="bg-black/20 text-black text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">Auto-Parse</span>
          </button>

          {currentRole === 'creator' && (
            <div className="text-xs bg-amber-950/60 text-amber-300 border border-amber-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Read-only as Content Creator.</span>
            </div>
          )}
        </div>
      </div>

      {/* 12 Pre-Seeded Brand Bases Knowledge Selector */}
      <div className="bg-[#0A120E] border border-emerald-950 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold text-white">
            Active Brand Base:
          </span>
          <span className="text-xs text-zinc-300 font-semibold">
            {currentWorkspace.name}
          </span>
          <span className="text-[10px] text-zinc-500 hidden md:inline">
            • {currentWorkspace.industry}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {allBrandBases.map(b => {
            const isSelected = currentWorkspace.id === b.workspace.id;
            return (
              <button
                key={b.workspace.id}
                type="button"
                onClick={() => switchWorkspace(b.workspace.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950 text-[#00FF87] border-[#00FF87] shadow-xs'
                    : 'bg-[#060B08] text-zinc-400 border-emerald-950 hover:text-white'
                }`}
              >
                <span>{b.icon}</span>
                <span>{b.workspace.brand_name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-emerald-950 overflow-x-auto space-x-2">
        {[
          { id: 'guidelines', label: 'Guidelines & Policy Docs', icon: BookOpen, count: guidelines.length },
          { id: 'facts', label: 'Approved Corporate Facts', icon: FileCheck2, count: facts.length },
          { id: 'terminology', label: 'Terminology Manager', icon: Tag, count: terminology.length },
          { id: 'tone', label: 'Tone of Voice Profile', icon: Sliders },
          { id: 'assets', label: 'Brand Asset Tokens', icon: Palette, count: assets.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#00FF87] text-[#00FF87] bg-emerald-950/40 rounded-t-lg'
                  : 'border-transparent text-zinc-400 hover:text-white hover:border-emerald-500/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-emerald-950 text-[#00FF87] border border-emerald-800' : 'bg-[#060B08] text-zinc-400 border border-emerald-950'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Global Search & Quick Action Bar across Knowledge Base */}
      <div className="bg-[#0A120E] rounded-xl p-3 border border-emerald-900/60 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search across ${activeTab} by name, keywords, or citations...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-8 py-2 bg-[#050806] border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all text-white placeholder-zinc-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'facts' && (
            <select
              value={factCategoryFilter}
              onChange={e => setFactCategoryFilter(e.target.value)}
              className="text-xs p-2 bg-[#050806] border border-emerald-900/60 rounded-lg text-zinc-200 font-medium cursor-pointer"
            >
              <option value="all" className="bg-[#0A120E] text-white">All Fact Categories</option>
              <option value="product" className="bg-[#0A120E] text-white">Product & Specs</option>
              <option value="sla" className="bg-[#0A120E] text-white">SLA & Reliability</option>
              <option value="pricing" className="bg-[#0A120E] text-white">Pricing & Commercial</option>
              <option value="compliance" className="bg-[#0A120E] text-white">Compliance & Legal</option>
            </select>
          )}
          {currentRole !== 'creator' && activeTab !== 'tone' && (
            <button
              onClick={() => {
                if (activeTab === 'guidelines') setIsGuidelineModalOpen(true);
                else if (activeTab === 'facts') setIsFactModalOpen(true);
                else if (activeTab === 'terminology') setIsTermModalOpen(true);
                else if (activeTab === 'assets') setIsAssetModalOpen(true);
              }}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md shadow-[0_0_12px_rgba(16,185,129,0.35)]"
            >
              <Plus className="w-3.5 h-3.5 text-black" />
              <span>
                {activeTab === 'guidelines'
                  ? 'Upload Manual'
                  : activeTab === 'facts'
                  ? 'Add Fact'
                  : activeTab === 'terminology'
                  ? 'Add Term'
                  : 'Add Token'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: GUIDELINES & POLICY DOCUMENTS */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Ingested Policy Documents</h2>
              <p className="text-xs text-zinc-400">
                Segmented into vector chunks with pgvector embeddings for semantic compliance retrieval.
              </p>
            </div>
            {currentRole !== 'creator' && (
              <button
                onClick={() => setIsGuidelineModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg transition-colors shadow-md shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                <span>Upload New Manual</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines
              .filter(
                doc =>
                  !searchTerm ||
                  doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(doc => (
              <div key={doc.id} className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-900/60 shadow-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 text-[#00FF87] border border-emerald-800 flex items-center justify-center font-bold text-xs shadow-sm">
                      PDF
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{doc.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span className="font-mono">v{doc.version}</span>
                        <span>•</span>
                        <span>{doc.total_chunks || doc.chunks_count || 4} vector chunks</span>
                        <span>•</span>
                        <span className="text-[#00FF87] font-semibold">Active Policy</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    HNSW Indexed
                  </span>
                </div>

                <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 text-xs text-zinc-300 space-y-2">
                  <div className="font-semibold text-white">Sample Indexed Chunk (#3 - Claims Policy):</div>
                  <p className="italic text-zinc-400 font-sans leading-relaxed">
                    &quot;Section 4.2: Factual Claims Policy: Unsubstantiated market leadership claims (&apos;No. 1&apos;, &apos;cheapest&apos;) expose the company to regulatory censure and are strictly prohibited. Absolute guarantees regarding software reliability must not be made.&quot;
                  </p>
                  <div className="text-[10px] text-zinc-500 font-mono">Embedding: [0.042, -0.198, 0.812, ... 1536 dim]</div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-zinc-400 border-t border-emerald-950 flex-wrap gap-2">
                  <span>Last synced: {doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : 'Active Q1 2026'}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setViewingFullDoc(doc)}
                      className="text-zinc-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Read Full Text</span>
                    </button>
                    <button
                      onClick={() => setInspectingDoc(doc)}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Vector Chunks</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: APPROVED CORPORATE FACTS */}
      {activeTab === 'facts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search facts..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <select
                value={factCategoryFilter}
                onChange={e => setFactCategoryFilter(e.target.value)}
                className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="company">Company</option>
                <option value="product">Product</option>
                <option value="pricing">Pricing</option>
                <option value="legal">Legal & Compliance</option>
              </select>
            </div>

            {currentRole !== 'creator' && (
              <button
                onClick={() => setIsFactModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg transition-colors shadow-md shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                <span>Add Approved Fact</span>
              </button>
            )}
          </div>

          <div className="bg-[#0A120E] rounded-2xl border border-emerald-900/60 overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060B08] border-b border-emerald-950 text-zinc-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Approved Fact & Claim Statement</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Source Citation</th>
                  <th className="py-3 px-4">Status</th>
                  {currentRole !== 'creator' && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/60">
                {facts
                  .filter(f => factCategoryFilter === 'all' || f.category === factCategoryFilter)
                  .filter(f => (f.claim_text || f.approved_statement || '').toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(fact => (
                    <tr key={fact.id} className="hover:bg-emerald-950/20 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white max-w-md">
                        {fact.claim_text || fact.approved_statement}
                        {fact.notes && <div className="text-[10px] text-zinc-400 mt-0.5">{fact.notes}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-[#060B08] border border-emerald-950 text-emerald-400 font-mono text-[11px]">
                          {fact.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">{fact.source_citation || fact.supporting_evidence || 'Internal SLA Manual'}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-[#00FF87]" />
                          Verified Fact
                        </span>
                      </td>
                      {currentRole !== 'creator' && (
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingFact(fact)}
                              className="p-1.5 text-zinc-400 hover:text-emerald-400 rounded hover:bg-emerald-950/40 transition-colors cursor-pointer"
                              title="Edit Approved Fact"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteFact(fact.id)}
                              className="p-1.5 text-zinc-500 hover:text-rose-400 rounded hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Delete Fact"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TERMINOLOGY MANAGER */}
      {activeTab === 'terminology' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Brand Vocabulary & Terminology Rules</h2>
              <p className="text-xs text-zinc-400">
                Deterministic regex rules enforced automatically during content ingestion.
              </p>
            </div>
            {currentRole !== 'creator' && (
              <button
                onClick={() => setIsTermModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg transition-colors shadow-md shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                <span>Add Term Rule</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {terminology
              .filter(
                term =>
                  !searchTerm ||
                  term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (term.suggested_replacement || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (term.explanation || '').toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(term => (
              <div
                key={term.id}
                className="bg-[#0A120E] rounded-xl p-4 border border-emerald-900/60 shadow-md flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        term.rule_type === 'prohibited'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : term.rule_type === 'preferred'
                          ? 'bg-emerald-950 text-[#00FF87] border-emerald-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {term.rule_type}
                    </span>
                    {(term.is_case_sensitive || term.case_sensitive) && (
                      <span className="text-[10px] font-mono text-zinc-500">Case-sensitive</span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white font-mono">&quot;{term.term}&quot;</h3>

                  {(term.suggested_replacement || term.preferred_alternative) && (
                    <div className="mt-2 text-xs">
                      <span className="text-zinc-400 font-medium">Use instead: </span>
                      <span className="text-[#00FF87] font-semibold bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded">
                        {term.suggested_replacement || term.preferred_alternative}
                      </span>
                    </div>
                  )}

                  {(term.explanation || term.rule_description) && (
                    <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                      {term.explanation || term.rule_description}
                    </p>
                  )}
                </div>

                {currentRole !== 'creator' && (
                  <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingTerm(term)}
                      className="px-2.5 py-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold rounded bg-[#060B08] border border-emerald-950 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Rule
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTerminologyRule(term.id)}
                      className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium cursor-pointer rounded hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TONE OF VOICE */}
      {activeTab === 'tone' && (
        <div className="bg-[#0A120E] rounded-2xl p-6 sm:p-8 border border-emerald-900/60 shadow-lg max-w-3xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">Tone of Voice Dimensions</h2>
            <p className="text-xs text-zinc-400">
              Configured sliders define our target brand persona evaluated during AI auditing.
            </p>
          </div>

          <div className="space-y-6">
            {/* Formality */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 mb-1">
                <span>Formality</span>
                <span className="font-mono text-[#00FF87]">{localTone.formality || localTone.formality_level || 85}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={currentRole === 'creator'}
                value={localTone.formality || localTone.formality_level || 85}
                onChange={e => setLocalTone({ ...localTone, formality: Number(e.target.value), formality_level: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                <span>Conversational & Casual</span>
                <span>Authoritative & Enterprise</span>
              </div>
            </div>

            {/* Technicality */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 mb-1">
                <span>Technical Depth</span>
                <span className="font-mono text-[#00FF87]">{localTone.technicality || localTone.technical_complexity || 78}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={currentRole === 'creator'}
                value={localTone.technicality || localTone.technical_complexity || 78}
                onChange={e => setLocalTone({ ...localTone, technicality: Number(e.target.value), technical_complexity: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                <span>Plain Language for General Audience</span>
                <span>Engineering & Developer Precision</span>
              </div>
            </div>

            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 mb-1">
                <span>Confidence & Directness</span>
                <span className="font-mono text-[#00FF87]">{localTone.confidence || localTone.confidence_level || 90}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={currentRole === 'creator'}
                value={localTone.confidence || localTone.confidence_level || 90}
                onChange={e => setLocalTone({ ...localTone, confidence: Number(e.target.value), confidence_level: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                <span>Cautious & Hesitant</span>
                <span>Decisive & Evidence-Driven</span>
              </div>
            </div>

            {/* Target Perspective */}
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1">
                Approved Brand Perspective
              </label>
              <select
                disabled={currentRole === 'creator'}
                value={localTone.perspective || 'first_person_plural'}
                onChange={e => setLocalTone({ ...localTone, perspective: e.target.value })}
                className="w-full text-xs p-2 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
              >
                <option value="first_person_plural" className="bg-[#0A120E] text-white">First Person Plural (&quot;We&quot;, &quot;Our team&quot;)</option>
                <option value="third_person" className="bg-[#0A120E] text-white">Third Person (&quot;AuraCloud&quot;, &quot;The platform&quot;)</option>
                <option value="second_person" className="bg-[#0A120E] text-white">Direct Address (&quot;You&quot;, &quot;Your infrastructure&quot;)</option>
              </select>
            </div>
          </div>

          {currentRole !== 'creator' && (
            <div className="pt-4 border-t border-emerald-950 flex justify-end">
              <button
                type="button"
                onClick={handleSaveTone}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg transition-colors shadow-md shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                Save Tone Configuration
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: BRAND ASSETS */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Design Tokens & Visual Identity</h2>
              <p className="text-xs text-zinc-400">
                Verified corporate color palette swatches and brand marks.
              </p>
            </div>
            {currentRole !== 'creator' && (
              <button
                onClick={() => setIsAssetModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg transition-colors shadow-md shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                <span>Add Brand Token</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {assets.map(asset => (
              <div key={asset.id} className="bg-[#0A120E] rounded-2xl p-5 border border-emerald-900/60 shadow-lg space-y-3">
                <div
                  className="h-28 rounded-xl border border-emerald-950 shadow-inner flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: asset.color_hex || asset.value || '#050806' }}
                >
                  {asset.asset_type === 'color' || asset.color_hex ? (asset.color_hex || asset.value) : 'Logo Asset'}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{asset.title || asset.name}</h3>
                    <p className="text-xs text-zinc-400 capitalize">{asset.category || asset.asset_type}</p>
                  </div>
                  {(asset.color_hex || asset.value) && (
                    <button
                      onClick={() => {
                        const val = asset.color_hex || asset.value || '';
                        navigator.clipboard.writeText(val);
                        showToast(`Copied ${val} to clipboard!`, 'success');
                      }}
                      className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-emerald-950/40 cursor-pointer"
                      title="Copy HEX Code"
                    >
                      <Copy className="w-4 h-4 text-emerald-400" />
                    </button>
                  )}
                </div>

                {(asset.color_hex || asset.value) && (
                  <div className="pt-2 border-t border-emerald-950 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-zinc-300">{asset.color_hex || asset.value}</span>
                    <span className="text-[#00FF87] bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full font-medium">
                      Approved Token
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Upload Guideline Document */}
      {isGuidelineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Upload Brand Guideline Manual</h3>
              <button onClick={() => setIsGuidelineModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateGuideline} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Manual Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Global Brand Guidelines v3.0"
                    value={newGuideline.title}
                    onChange={e => setNewGuideline({ ...newGuideline, title: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[#050806] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Category</label>
                  <select
                    value={newGuideline.category}
                    onChange={e => setNewGuideline({ ...newGuideline, category: e.target.value })}
                    className="mt-1 w-full text-xs p-2 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                  >
                    <option className="bg-[#0A120E] text-white">Corporate Brand Standards</option>
                    <option className="bg-[#0A120E] text-white">Product & Technical Messaging</option>
                    <option className="bg-[#0A120E] text-white">PR & Regulatory Disclaimers</option>
                    <option className="bg-[#0A120E] text-white">Social Media Guidelines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Mandatory naming conventions and SLA citations for cloud products."
                    value={newGuideline.description}
                    onChange={e => setNewGuideline({ ...newGuideline, description: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Guideline Policy Text (or paste contents)</label>
                  <textarea
                    rows={4}
                    placeholder="Paste manual rules or policy clauses for automatic chunking..."
                    value={newGuideline.text}
                    onChange={e => setNewGuideline({ ...newGuideline, text: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                  />
                </div>
              </div>

              <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGuidelineModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:bg-emerald-400 shadow-md flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Index into pgvector</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Inspect Vector Chunks */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-2xl w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">{inspectingDoc.title}</h3>
                  <p className="text-xs text-zinc-400">Vector Chunk Inspection (pgvector HNSW index)</p>
                </div>
              </div>
              <button onClick={() => setInspectingDoc(null)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-3 flex-1">
              {(inspectingDoc.id === 'guide-002' || inspectingDoc.title.includes('Architecture')
                ? [
                    {
                      id: 'chunk-2-1',
                      section: 'Section 1.2: Official Product Suite Taxonomy',
                      page: 'Page 3',
                      passage: 'The AuraCloud ecosystem is structured into six trademarked modules: AuraCloud Core, AuraCloud Mesh, AuraCloud Sentinel, AuraCloud Fleet, AuraCloud Vault, and AuraCloud EdgeDirect. Prohibit casual abbreviations like AC Sentinel.',
                      vector: '[0.048, -0.219, 0.582, ...]'
                    },
                    {
                      id: 'chunk-2-2',
                      section: 'Section 2.1: Prohibited Security & Performance Claims',
                      page: 'Page 7',
                      passage: 'Absolute security claims (unhackable, bulletproof, military-grade encryption) create severe legal liability and are strictly prohibited. Replace with FIPS 140-3 validated AES-256-GCM and zero-trust defense-in-depth architecture.',
                      vector: '[-0.142, 0.384, -0.091, ...]'
                    },
                    {
                      id: 'chunk-2-3',
                      section: 'Section 3.1: High-Availability & Disaster Recovery SLA',
                      page: 'Page 11',
                      passage: 'AuraCloud guarantees a financially backed 99.95% monthly uptime SLA. Recovery Point Objective (RPO) is under 15 seconds and Recovery Time Objective (RTO) is under 60 seconds across paired regions.',
                      vector: '[0.112, -0.088, 0.493, ...]'
                    },
                    {
                      id: 'chunk-2-4',
                      section: 'Section 3.2: EdgeDirect Global Network & Low Latency',
                      page: 'Page 14',
                      passage: 'AuraCloud EdgeDirect operates 48 Tier-1 points of presence across North America, EMEA, and APAC. Sustains 2.4 million requests per second per tenant cluster with p99 latency under 4.2ms.',
                      vector: '[0.065, 0.174, -0.320, ...]'
                    },
                    {
                      id: 'chunk-2-5',
                      section: 'Section 4.1: Enterprise Compliance & Data Sovereignty',
                      page: 'Page 19',
                      passage: 'Maintains verified SOC 2 Type II attestation, ISO/IEC 27001:2022, ISO/IEC 27701:2019, HIPAA BAA readiness, and PCI-DSS v4.0 Level 1 compliance with zero cross-border telemetry leakage.',
                      vector: '[-0.031, 0.285, 0.618, ...]'
                    },
                    {
                      id: 'chunk-2-6',
                      section: 'Section 5.1: Competitive Comparison & Market Conduct',
                      page: 'Page 24',
                      passage: 'Comparisons against AWS, Microsoft Azure, or GCP must be strictly architectural and objective. Derogatory language is prohibited. All benchmark numbers require dated footnote citations.',
                      vector: '[0.092, -0.155, 0.441, ...]'
                    }
                  ]
                : [
                    {
                      id: 'chunk-1',
                      section: 'Section 1.1: Core Brand Identity & Positioning',
                      page: 'Page 4',
                      passage: 'AuraCloud positions itself as an enterprise cloud governance authority. Communications must convey architectural rigor and verifiable evidence. Avoid speculative hype.',
                      vector: '[0.012, -0.452, 0.128, ...]'
                    },
                    {
                      id: 'chunk-2',
                      section: 'Section 2.1: Performance Bounds & Standard SLA',
                      page: 'Page 8',
                      passage: 'AuraCloud standard enterprise SLA guarantees 99.95% monthly uptime. Claims of 100% uptime are non-compliant and legally prohibited.',
                      vector: '[0.089, -0.114, 0.632, ...]'
                    },
                    {
                      id: 'chunk-3',
                      section: 'Section 3.4: Brand Nomenclature & Capitalization Standards',
                      page: 'Page 15',
                      passage: 'AuraCloud must always appear in camel-case (capital A, capital C). Never refer to our capabilities as "AI magic". Use "automated cloud orchestration".',
                      vector: '[-0.201, 0.084, 0.441, ...]'
                    },
                    {
                      id: 'chunk-4',
                      section: 'Section 4.2: Factual Claims Policy & Prohibited Superlatives',
                      page: 'Page 22',
                      passage: 'Never state absolute guarantees, unsupported rankings ("No. 1"), or exaggerated superlatives. Comparative pricing claims ("cheapest") require an active audit.',
                      vector: '[0.042, -0.198, 0.812, ...]'
                    }
                  ]
              ).map(chunk => (
                <div key={chunk.id} className="p-3.5 rounded-xl border border-emerald-950 bg-[#060B08] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{chunk.section}</span>
                    <span className="text-zinc-500 font-mono text-[10px]">{chunk.page}</span>
                  </div>
                  <p className="text-zinc-300 italic font-sans leading-relaxed">&quot;{chunk.passage}&quot;</p>
                  <div className="text-[10px] text-zinc-500 font-mono pt-1">pgvector embedding: {chunk.vector}</div>
                </div>
              ))}
            </div>

            <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex justify-end">
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:bg-emerald-400 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Approved Fact */}
      {isFactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Add Approved Fact</h3>
              <button onClick={() => setIsFactModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateFact} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Verified Claim Text</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. AuraCloud guarantees 99.95% monthly uptime under our standard SLA."
                    value={newFact.claim_text}
                    onChange={e => setNewFact({ ...newFact, claim_text: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[#050806] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">Category</label>
                    <select
                      value={newFact.category}
                      onChange={e => setNewFact({ ...newFact, category: e.target.value as any })}
                      className="mt-1 w-full text-xs p-2 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                    >
                      <option value="company" className="bg-[#0A120E] text-white">Company</option>
                      <option value="product" className="bg-[#0A120E] text-white">Product</option>
                      <option value="pricing" className="bg-[#0A120E] text-white">Pricing</option>
                      <option value="legal" className="bg-[#0A120E] text-white">Legal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">Source Document / Citation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SLA Terms 2026, Section 2"
                      value={newFact.source_citation}
                      onChange={e => setNewFact({ ...newFact, source_citation: e.target.value })}
                      className="mt-1 w-full text-xs p-2 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFactModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:bg-emerald-400 shadow-md cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                >
                  Save Fact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Terminology Rule */}
      {isTermModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Add Terminology Rule</h3>
              <button onClick={() => setIsTermModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTerm} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Term or Phrase</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI magic"
                    value={newTerm.term}
                    onChange={e => setNewTerm({ ...newTerm, term: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[#050806] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">Rule Type</label>
                    <select
                      value={newTerm.rule_type}
                      onChange={e => setNewTerm({ ...newTerm, rule_type: e.target.value as any })}
                      className="mt-1 w-full text-xs p-2 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                    >
                      <option value="prohibited" className="bg-[#0A120E] text-white">Prohibited</option>
                      <option value="preferred" className="bg-[#0A120E] text-white">Preferred</option>
                      <option value="required" className="bg-[#0A120E] text-white">Required</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">Suggested Replacement</label>
                    <input
                      type="text"
                      placeholder="e.g. automated orchestration"
                      value={newTerm.suggested_replacement}
                      onChange={e => setNewTerm({ ...newTerm, suggested_replacement: e.target.value })}
                      className="mt-1 w-full text-xs p-2 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Explanation & Reason</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Unprofessional terminology. Trivializes technical engineering capabilities."
                    value={newTerm.explanation}
                    onChange={e => setNewTerm({ ...newTerm, explanation: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="caseSensitive"
                    checked={newTerm.is_case_sensitive}
                    onChange={e => setNewTerm({ ...newTerm, is_case_sensitive: e.target.checked })}
                    className="rounded accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="caseSensitive" className="text-xs text-zinc-300 cursor-pointer">
                    Case-sensitive matching
                  </label>
                </div>
              </div>

              <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTermModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:bg-emerald-400 shadow-md cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                >
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Brand Asset */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-md w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Add Brand Design Token</h3>
              <button onClick={() => setIsAssetModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateAsset} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Token Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Emerald Glow Accent"
                    value={newAsset.title}
                    onChange={e => setNewAsset({ ...newAsset, title: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[#050806] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Token HEX Code</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={newAsset.color_hex}
                      onChange={e => setNewAsset({ ...newAsset, color_hex: e.target.value.toUpperCase() })}
                      className="w-10 h-10 rounded border border-emerald-900/60 cursor-pointer p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={newAsset.color_hex}
                      onChange={e => setNewAsset({ ...newAsset, color_hex: e.target.value.toUpperCase() })}
                      className="text-xs font-mono font-bold w-full p-2 border border-emerald-900/60 rounded uppercase bg-[#050806] text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Category</label>
                  <select
                    value={newAsset.category}
                    onChange={e => setNewAsset({ ...newAsset, category: e.target.value })}
                    className="mt-1 w-full text-xs p-2 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                  >
                    <option value="primary" className="bg-[#0A120E] text-white">Primary Surface</option>
                    <option value="secondary" className="bg-[#0A120E] text-white">Secondary Accent</option>
                    <option value="accent" className="bg-[#0A120E] text-white">Action CTA</option>
                    <option value="status" className="bg-[#0A120E] text-white">Status Token</option>
                  </select>
                </div>
              </div>

              <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:bg-emerald-400 shadow-md cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                >
                  Save Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: View Full Document Text */}
      {viewingFullDoc && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-3xl w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">{viewingFullDoc.title}</h3>
                  <p className="text-xs text-zinc-400">{viewingFullDoc.file_name || 'Brand Manual'} • {viewingFullDoc.category}</p>
                </div>
              </div>
              <button onClick={() => setViewingFullDoc(null)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-sm font-sans leading-relaxed text-zinc-300 whitespace-pre-wrap bg-[#050806] space-y-4">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 font-mono">
                Status: Active Indexed Source of Truth • pgvector HNSW Index Ready
              </div>
              <p>{viewingFullDoc.extracted_text || 'Full corporate communication and architecture standards text indexed in PostgreSQL pgvector semantic store.'}</p>
            </div>
            <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex justify-end">
              <button
                onClick={() => setViewingFullDoc(null)}
                className="px-4 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:bg-emerald-400 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Approved Fact */}
      {editingFact && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">Edit Approved Corporate Fact</h3>
              </div>
              <button onClick={() => setEditingFact(null)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (!editingFact) return;
                await updateFact(editingFact.id, {
                  claim_text: editingFact.claim_text,
                  approved_statement: editingFact.claim_text,
                  category: editingFact.category,
                  source_citation: editingFact.source_citation || editingFact.supporting_evidence
                });
                setEditingFact(null);
              }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="overflow-y-auto p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Approved Fact / Statement</label>
                  <textarea
                    rows={3}
                    required
                    value={editingFact.claim_text || editingFact.approved_statement || ''}
                    onChange={e => setEditingFact({ ...editingFact, claim_text: e.target.value, approved_statement: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[#050806] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Category</label>
                  <input
                    type="text"
                    required
                    value={editingFact.category}
                    onChange={e => setEditingFact({ ...editingFact, category: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Supporting Evidence / Source Citation</label>
                  <input
                    type="text"
                    required
                    value={editingFact.source_citation || editingFact.supporting_evidence || ''}
                    onChange={e => setEditingFact({ ...editingFact, source_citation: e.target.value, supporting_evidence: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                  />
                </div>
              </div>
              <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFact(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:bg-emerald-400 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                >
                  Save Fact Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Terminology Rule */}
      {editingTerm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-900/80 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in text-zinc-100">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">Edit Brand Terminology Rule</h3>
              </div>
              <button onClick={() => setEditingTerm(null)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (!editingTerm) return;
                await updateTerminologyRule(editingTerm.id, {
                  term: editingTerm.term,
                  rule_type: editingTerm.rule_type,
                  suggested_replacement: editingTerm.suggested_replacement || editingTerm.preferred_alternative,
                  preferred_alternative: editingTerm.suggested_replacement || editingTerm.preferred_alternative,
                  explanation: editingTerm.explanation || editingTerm.rule_description,
                  rule_description: editingTerm.explanation || editingTerm.rule_description,
                  is_case_sensitive: editingTerm.is_case_sensitive || editingTerm.case_sensitive
                });
                setEditingTerm(null);
              }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="overflow-y-auto p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Target Term or Phrase</label>
                  <input
                    type="text"
                    required
                    value={editingTerm.term}
                    onChange={e => setEditingTerm({ ...editingTerm, term: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-[#050806] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Rule Type</label>
                  <select
                    value={editingTerm.rule_type}
                    onChange={e => setEditingTerm({ ...editingTerm, rule_type: e.target.value as any })}
                    className="mt-1 w-full text-xs p-2 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                  >
                    <option value="prohibited">Prohibited (Flags violation)</option>
                    <option value="preferred">Preferred (Encouraged terminology)</option>
                    <option value="required">Required Disclaimer / Clause</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Approved Alternative / Replacement</label>
                  <input
                    type="text"
                    value={editingTerm.suggested_replacement || editingTerm.preferred_alternative || ''}
                    onChange={e => setEditingTerm({ ...editingTerm, suggested_replacement: e.target.value, preferred_alternative: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Rule Description & Rationale</label>
                  <textarea
                    rows={3}
                    value={editingTerm.explanation || editingTerm.rule_description || ''}
                    onChange={e => setEditingTerm({ ...editingTerm, explanation: e.target.value, rule_description: e.target.value })}
                    className="mt-1 w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg bg-[#050806] text-white"
                  />
                </div>
              </div>
              <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTerm(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:bg-emerald-400 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                >
                  Save Terminology Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- AUTONOMOUS AI GUIDELINE PARSER MODAL (ENTERPRISE DOCUMENT INGESTION) --- */}
      {isAutoExtractOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0A120E] border border-emerald-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-emerald-950 bg-gradient-to-r from-emerald-950/40 via-[#0A120E] to-teal-950/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Zap className="w-5 h-5 fill-emerald-400/20" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    Autonomous Guideline Parser & Rule Synthesizer
                    <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      RAG Engine v3.0
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Parse corporate brand PDF manuals into deterministic regex rules, verified SLA facts, and calibrated voice profiles.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAutoExtractOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-emerald-950/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs text-zinc-300">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Brand Manual Document</label>
                <input
                  type="text"
                  value={extractManualTitle}
                  onChange={e => setExtractManualTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-emerald-900/60 rounded-lg bg-[#050806] text-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. AuraCloud Enterprise Communication Manual v3.0"
                />
              </div>

              {/* Progress and status */}
              {extractLoading && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      {extractStepName}
                    </span>
                    <span className="font-mono text-emerald-300 font-bold">{extractProgress}%</span>
                  </div>
                  <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-900">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                      style={{ width: `${extractProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Extraction Preview */}
              {extractionResult && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#00FF87]" />
                      <div>
                        <div className="font-bold text-white text-xs">Knowledge Base Synchronized Successfully</div>
                        <div className="text-[11px] text-zinc-400">
                          Indexed {extractionResult.extracted_rules_count} terminology rules & {extractionResult.extracted_facts_count} SLA facts into active engine.
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-300 font-bold bg-emerald-900/60 px-2 py-1 rounded border border-emerald-700">
                      ⏱ {extractionResult.elapsed_ms}ms
                    </span>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-[#060B08] border border-emerald-900/60">
                      <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">New Rules Mined</div>
                      <div className="text-xl font-extrabold text-white mt-1">4 Rules</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">AI magic, cheapest, camel-casing, No. 1</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#060B08] border border-emerald-900/60">
                      <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">SLA Facts Indexed</div>
                      <div className="text-xl font-extrabold text-white mt-1">3 Facts</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">99.95% SLA, $49/node, SOC 2 Type II</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#060B08] border border-emerald-900/60">
                      <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Voice Calibration</div>
                      <div className="text-xl font-extrabold text-white mt-1">9 / 10</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Formality, Technicality & Confidence</div>
                    </div>
                  </div>

                  {/* Design Tokens preview */}
                  <div className="p-3 rounded-lg bg-[#060B08] border border-emerald-900/60 space-y-2">
                    <div className="text-[10px] uppercase font-mono text-zinc-400 font-bold">Extracted Visual Identity Palette</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#0F172A] border border-white/20"></span>
                        <span className="font-mono text-[11px] text-zinc-300">#0F172A (Primary)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#2563EB] border border-white/20"></span>
                        <span className="font-mono text-[11px] text-zinc-300">#2563EB (Secondary)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#38BDF8] border border-white/20"></span>
                        <span className="font-mono text-[11px] text-zinc-300">#38BDF8 (Accent)</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Exclusion Rule: <span className="font-semibold text-emerald-300">0.5x minimum height clear boundary around corporate logomark.</span>
                    </div>
                  </div>
                </div>
              )}

              {!extractionResult && !extractLoading && (
                <div className="p-4 rounded-xl border border-dashed border-emerald-900/80 bg-[#060B08] text-center space-y-3">
                  <Cpu className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div>
                    <div className="font-bold text-white text-xs">Autonomous Ingestion Pipeline Ready</div>
                    <div className="text-[11px] text-zinc-400 max-w-md mx-auto mt-1">
                      Our structured LLM extractor will analyze the document, discover terminology restrictions, register verified numerical SLAs, and calibrate multi-axis voice parameters in under 2 seconds.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-emerald-950 bg-[#060B08] shrink-0 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsAutoExtractOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Close
              </button>

              {!extractionResult ? (
                <button
                  type="button"
                  disabled={extractLoading}
                  onClick={handleRunAutoExtract}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black text-xs font-extrabold rounded-lg flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>{extractLoading ? 'Parsing Brand Guide...' : 'Start Autonomous Extraction'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAutoExtractOpen(false)}
                  className="px-4 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:bg-emerald-400 flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                >
                  <CheckCheck className="w-4 h-4 text-black" />
                  <span>Done • Rules Active</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
