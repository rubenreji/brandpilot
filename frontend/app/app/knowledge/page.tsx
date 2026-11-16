'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandPilot } from '@/lib/store';
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
  FileText
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
    deleteFact,
    terminology,
    addTerminologyRule,
    deleteTerminologyRule,
    toneProfile,
    updateToneProfile,
    assets,
    addAsset,
    showToast
  } = useBrandPilot();

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
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Single Source of Truth</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Brand Knowledge Base
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage guidelines, verified facts, terminology rules, tone dimensions, and brand design tokens.
          </p>
        </div>

        {currentRole === 'creator' && (
          <div className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Read-only as Content Creator. Switch persona to Admin or Reviewer in header to edit.</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2">
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
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-[#3978E8] text-[#3978E8] bg-blue-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: GUIDELINES & POLICY DOCUMENTS */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ingested Policy Documents</h2>
              <p className="text-xs text-slate-500">
                Segmented into vector chunks with pgvector embeddings for semantic compliance retrieval.
              </p>
            </div>
            {currentRole !== 'creator' && (
              <button
                onClick={() => setIsGuidelineModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#101827] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New Manual</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.map(doc => (
              <div key={doc.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                      PDF
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{doc.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono">v{doc.version}</span>
                        <span>•</span>
                        <span>{doc.total_chunks || doc.chunks_count || 4} vector chunks</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">Active Policy</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    HNSW Indexed
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
                  <div className="font-semibold text-slate-800">Sample Indexed Chunk (#3 - Claims Policy):</div>
                  <p className="italic text-slate-700 font-sans leading-relaxed">
                    &quot;Section 4.2: Factual Claims Policy: Unsubstantiated market leadership claims (&apos;No. 1&apos;, &apos;cheapest&apos;) expose the company to regulatory censure and are strictly prohibited. Absolute guarantees regarding software reliability must not be made.&quot;
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">Embedding: [0.042, -0.198, 0.812, ... 1536 dim]</div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                  <span>Last synced: {new Date(doc.updated_at || doc.uploaded_at || Date.now()).toLocaleDateString()}</span>
                  <button
                    onClick={() => setInspectingDoc(doc)}
                    className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    Inspect Vector Chunks <ExternalLink className="w-3 h-3" />
                  </button>
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
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3978E8] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Approved Fact</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Approved Fact & Claim Statement</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Source Citation</th>
                  <th className="py-3 px-4">Status</th>
                  {currentRole !== 'creator' && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facts
                  .filter(f => factCategoryFilter === 'all' || f.category === factCategoryFilter)
                  .filter(f => (f.claim_text || f.approved_statement || '').toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(fact => (
                    <tr key={fact.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-md">
                        {fact.claim_text || fact.approved_statement}
                        {fact.notes && <div className="text-[10px] text-slate-500 mt-0.5">{fact.notes}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                          {fact.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{fact.source_citation || fact.supporting_evidence || 'Internal SLA Manual'}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified Fact
                        </span>
                      </td>
                      {currentRole !== 'creator' && (
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => deleteFact(fact.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                            title="Delete Fact"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
              <h2 className="text-base font-bold text-slate-900">Brand Vocabulary & Terminology Rules</h2>
              <p className="text-xs text-slate-500">
                Deterministic regex rules enforced automatically during content ingestion.
              </p>
            </div>
            {currentRole !== 'creator' && (
              <button
                onClick={() => setIsTermModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3978E8] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Term Rule</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {terminology.map(term => (
              <div
                key={term.id}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        term.rule_type === 'prohibited'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : term.rule_type === 'preferred'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {term.rule_type}
                    </span>
                    {(term.is_case_sensitive || term.case_sensitive) && (
                      <span className="text-[10px] font-mono text-slate-400">Case-sensitive</span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 font-mono">&quot;{term.term}&quot;</h3>

                  {(term.suggested_replacement || term.preferred_alternative) && (
                    <div className="mt-2 text-xs">
                      <span className="text-slate-400 font-medium">Use instead: </span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                        {term.suggested_replacement || term.preferred_alternative}
                      </span>
                    </div>
                  )}

                  {(term.explanation || term.rule_description) && (
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {term.explanation || term.rule_description}
                    </p>
                  )}
                </div>

                {currentRole !== 'creator' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => deleteTerminologyRule(term.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium"
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
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tone of Voice Dimensions</h2>
            <p className="text-xs text-slate-500">
              Configured sliders define our target brand persona evaluated during AI auditing.
            </p>
          </div>

          <div className="space-y-6">
            {/* Formality */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Formality</span>
                <span className="font-mono text-blue-600">{localTone.formality || localTone.formality_level || 85}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={currentRole === 'creator'}
                value={localTone.formality || localTone.formality_level || 85}
                onChange={e => setLocalTone({ ...localTone, formality: Number(e.target.value), formality_level: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Conversational & Casual</span>
                <span>Authoritative & Enterprise</span>
              </div>
            </div>

            {/* Technicality */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Technical Depth</span>
                <span className="font-mono text-blue-600">{localTone.technicality || localTone.technical_complexity || 78}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={currentRole === 'creator'}
                value={localTone.technicality || localTone.technical_complexity || 78}
                onChange={e => setLocalTone({ ...localTone, technicality: Number(e.target.value), technical_complexity: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Plain Language for General Audience</span>
                <span>Engineering & Developer Precision</span>
              </div>
            </div>

            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Confidence & Directness</span>
                <span className="font-mono text-blue-600">{localTone.confidence || localTone.confidence_level || 90}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={currentRole === 'creator'}
                value={localTone.confidence || localTone.confidence_level || 90}
                onChange={e => setLocalTone({ ...localTone, confidence: Number(e.target.value), confidence_level: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Cautious & Hesitant</span>
                <span>Decisive & Evidence-Driven</span>
              </div>
            </div>

            {/* Target Perspective */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Approved Brand Perspective
              </label>
              <select
                disabled={currentRole === 'creator'}
                value={localTone.perspective || 'first_person_plural'}
                onChange={e => setLocalTone({ ...localTone, perspective: e.target.value })}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="first_person_plural">First Person Plural (&quot;We&quot;, &quot;Our team&quot;)</option>
                <option value="third_person">Third Person (&quot;AuraCloud&quot;, &quot;The platform&quot;)</option>
                <option value="second_person">Direct Address (&quot;You&quot;, &quot;Your infrastructure&quot;)</option>
              </select>
            </div>
          </div>

          {currentRole !== 'creator' && (
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={handleSaveTone}
                className="px-4 py-2 bg-[#101827] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
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
              <h2 className="text-base font-bold text-slate-900">Design Tokens & Visual Identity</h2>
              <p className="text-xs text-slate-500">
                Verified corporate color palette swatches and brand marks.
              </p>
            </div>
            {currentRole !== 'creator' && (
              <button
                onClick={() => setIsAssetModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3978E8] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Brand Token</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {assets.map(asset => (
              <div key={asset.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div
                  className="h-28 rounded-xl border border-slate-200/60 shadow-inner flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: asset.color_hex || asset.value || '#101827' }}
                >
                  {asset.asset_type === 'color' || asset.color_hex ? (asset.color_hex || asset.value) : 'Logo Asset'}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{asset.title || asset.name}</h3>
                    <p className="text-xs text-slate-500 capitalize">{asset.category || asset.asset_type}</p>
                  </div>
                  {(asset.color_hex || asset.value) && (
                    <button
                      onClick={() => {
                        const val = asset.color_hex || asset.value || '';
                        navigator.clipboard.writeText(val);
                        showToast(`Copied ${val} to clipboard!`, 'success');
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                      title="Copy HEX Code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {(asset.color_hex || asset.value) && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-600">{asset.color_hex || asset.value}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Upload Brand Guideline Manual</h3>
              <button onClick={() => setIsGuidelineModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateGuideline} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Manual Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Global Brand Guidelines v3.0"
                  value={newGuideline.title}
                  onChange={e => setNewGuideline({ ...newGuideline, title: e.target.value })}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={newGuideline.category}
                  onChange={e => setNewGuideline({ ...newGuideline, category: e.target.value })}
                  className="mt-1 w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option>Corporate Brand Standards</option>
                  <option>Product & Technical Messaging</option>
                  <option>PR & Regulatory Disclaimers</option>
                  <option>Social Media Guidelines</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Mandatory naming conventions and SLA citations for cloud products."
                  value={newGuideline.description}
                  onChange={e => setNewGuideline({ ...newGuideline, description: e.target.value })}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Guideline Policy Text (or paste contents)</label>
                <textarea
                  rows={4}
                  placeholder="Paste manual rules or policy clauses for automatic chunking..."
                  value={newGuideline.text}
                  onChange={e => setNewGuideline({ ...newGuideline, text: e.target.value })}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsGuidelineModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#101827] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 shadow-xs flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{inspectingDoc.title}</h3>
                  <p className="text-xs text-slate-500">Vector Chunk Inspection (pgvector HNSW index)</p>
                </div>
              </div>
              <button onClick={() => setInspectingDoc(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {[
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
              ].map(chunk => (
                <div key={chunk.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{chunk.section}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{chunk.page}</span>
                  </div>
                  <p className="text-slate-700 italic font-sans leading-relaxed">&quot;{chunk.passage}&quot;</p>
                  <div className="text-[10px] text-slate-400 font-mono pt-1">pgvector embedding: {chunk.vector}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-2 bg-[#101827] text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Approved Fact */}
      {isFactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Approved Fact</h3>
            <form onSubmit={handleCreateFact} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Verified Claim Text</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. AuraCloud guarantees 99.95% monthly uptime under our standard SLA."
                  value={newFact.claim_text}
                  onChange={e => setNewFact({ ...newFact, claim_text: e.target.value })}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={newFact.category}
                    onChange={e => setNewFact({ ...newFact, category: e.target.value as any })}
                    className="mt-1 w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="company">Company</option>
                    <option value="product">Product</option>
                    <option value="pricing">Pricing</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Source Document / Citation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SLA Terms 2026, Section 2"
                    value={newFact.source_citation}
                    onChange={e => setNewFact({ ...newFact, source_citation: e.target.value })}
                    className="mt-1 w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFactModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3978E8] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Terminology Rule</h3>
            <form onSubmit={handleCreateTerm} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Term or Phrase</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI magic"
                  value={newTerm.term}
                  onChange={e => setNewTerm({ ...newTerm, term: e.target.value })}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Rule Type</label>
                  <select
                    value={newTerm.rule_type}
                    onChange={e => setNewTerm({ ...newTerm, rule_type: e.target.value as any })}
                    className="mt-1 w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="prohibited">Prohibited</option>
                    <option value="preferred">Preferred</option>
                    <option value="required">Required</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Suggested Replacement</label>
                  <input
                    type="text"
                    placeholder="e.g. automated orchestration"
                    value={newTerm.suggested_replacement}
                    onChange={e => setNewTerm({ ...newTerm, suggested_replacement: e.target.value })}
                    className="mt-1 w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Explanation & Reason</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Unprofessional terminology. Trivializes technical engineering capabilities."
                  value={newTerm.explanation}
                  onChange={e => setNewTerm({ ...newTerm, explanation: e.target.value })}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="caseSensitive"
                  checked={newTerm.is_case_sensitive}
                  onChange={e => setNewTerm({ ...newTerm, is_case_sensitive: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="caseSensitive" className="text-xs text-slate-700">
                  Case-sensitive matching
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsTermModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3978E8] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Brand Design Token</h3>
            <form onSubmit={handleCreateAsset} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Token Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dark Indigo Accent"
                  value={newAsset.title}
                  onChange={e => setNewAsset({ ...newAsset, title: e.target.value })}
                  className="mt-1 w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Token HEX Code</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={newAsset.color_hex}
                    onChange={e => setNewAsset({ ...newAsset, color_hex: e.target.value.toUpperCase() })}
                    className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={newAsset.color_hex}
                    onChange={e => setNewAsset({ ...newAsset, color_hex: e.target.value.toUpperCase() })}
                    className="text-xs font-mono font-bold w-full p-2 border border-slate-300 rounded uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={newAsset.category}
                  onChange={e => setNewAsset({ ...newAsset, category: e.target.value })}
                  className="mt-1 w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="primary">Primary Surface</option>
                  <option value="secondary">Secondary Accent</option>
                  <option value="accent">Action CTA</option>
                  <option value="status">Status Token</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3978E8] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 shadow-xs"
                >
                  Save Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
