'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  Crosshair,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Download,
  Eye,
  TrendingUp,
  FileText,
  Target,
  ArrowRight
} from 'lucide-react';

interface CompetitorTarget {
  id: string;
  name: string;
  tickerOrSlug: string;
  marketShare: string;
  vulnerabilityScore: number;
  unsubstantiatedClaim: string;
  claimSourceUrl: string;
  ftcLegalExposure: string;
  counterStrikeAngle: string;
  recommendedAdCopy: string;
  safeHarborDisclosure: string;
}

const DEFAULT_COMPETITORS: CompetitorTarget[] = [
  {
    id: 'comp-1',
    name: 'Legacy Cloud Corp',
    tickerOrSlug: 'NYSE: LCC',
    marketShare: '34% Enterprise Segment',
    vulnerabilityScore: 92,
    unsubstantiatedClaim: '"The world\'s only 100% unbreakable cloud with zero minutes of downtime in company history."',
    claimSourceUrl: 'https://legacycloudcorp.com/pricing',
    ftcLegalExposure: 'FTC Act § 5 False Advertising Violation. Third-party Downdetector logs record 4 documented multi-region outages in 2025. Absolute claim is legally indefensible.',
    counterStrikeAngle: 'Transparent Engineering vs. False Absolutes',
    recommendedAdCopy: `Tired of fairy tales about "unbreakable" clouds?

While legacy providers promise zero downtime and secretly suffer outages, AuraCloud is built on transparent reality: 99.99% high-availability multi-region redundancy backed by contractually enforced SLAs.

Don't settle for marketing hype. Choose verified infrastructure.`,
    safeHarborDisclosure: '*Availability comparisons based on public incident reports published across Q1-Q3 2025.'
  },
  {
    id: 'comp-2',
    name: 'HyperScale X',
    tickerOrSlug: 'NASDAQ: HYPX',
    marketShare: '22% Enterprise Segment',
    vulnerabilityScore: 84,
    unsubstantiatedClaim: '"Guaranteed to reduce your annual cloud compute bill by a minimum of 75% overnight."',
    claimSourceUrl: 'https://hyperscalex.io/enterprise',
    ftcLegalExposure: 'FTC Guides Concerning Deceptive Pricing & Endorsements. Fails to disclose that 75% savings requires 3-year upfront reserved capacity contracts.',
    counterStrikeAngle: 'No Lock-In Pay-As-You-Go vs. Predatory Multi-Year Traps',
    recommendedAdCopy: `The 75% discount that ends up costing you double.

Ever read the fine print on HyperScale X's "instant" savings? You're locked into a 3-year upfront commitment with zero flexibility. 

AuraCloud provides honest, transparent pay-per-compute pricing with zero contractual lock-in. Scale on your own terms.`,
    safeHarborDisclosure: '†Cost modeling based on standard on-demand benchmark workloads.'
  },
  {
    id: 'comp-3',
    name: 'DataVantage Systems',
    tickerOrSlug: 'Private Equity Backed',
    marketShare: '14% Mid-Market Segment',
    vulnerabilityScore: 78,
    unsubstantiatedClaim: '"100% Zero-Carbon Neutral Datacenters worldwide."',
    claimSourceUrl: 'https://datavantage.tech/sustainability',
    ftcLegalExposure: 'EU Green Claims Directive (COM/2023/166) Violation. Relies on uncertified third-party deforestation offsets without ISO 14064 lifecycle verification.',
    counterStrikeAngle: 'Certified Renewable Energy vs. Unverified Greenwashing',
    recommendedAdCopy: `True Net-Zero Isn't Bought With Cheap Offsets.

Don't let greenwashed marketing cloud your corporate ESG commitments. AuraCloud powers your infrastructure with 100% certified Gold Standard renewable energy credits.

Real sustainability. Real third-party audits.`,
    safeHarborDisclosure: '‡Emissions calculations verified via Gold Standard registry serial allocations.'
  }
];

export default function CounterStrikePage() {
  const { currentWorkspace, showToast } = useBrandPilot();
  const [competitors, setCompetitors] = useState<CompetitorTarget[]>(DEFAULT_COMPETITORS);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('comp-1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadingDossier, setDownloadingDossier] = useState(false);

  // Live Competitor Analyzer Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customClaim, setCustomClaim] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const activeTarget = competitors.find(c => c.id === selectedTargetId) || competitors[0];

  const handleAnalyzeCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customClaim.trim()) {
      showToast('Please enter both competitor name and their marketing claim.', 'error');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/counterstrike/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitor_name: customName.trim(),
          claim: customClaim.trim()
        })
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();

      const newId = `comp-live-${Date.now()}`;
      const newCompetitor: CompetitorTarget = {
        id: newId,
        name: data.competitor || customName.trim(),
        tickerOrSlug: 'LIVE AUDITED',
        marketShare: 'Direct Industry Rival',
        vulnerabilityScore: data.vulnerability_score || 88,
        unsubstantiatedClaim: `"${customClaim.trim()}"`,
        claimSourceUrl: customUrl.trim() || 'https://competitor.com/landing',
        ftcLegalExposure: data.legal_exposure || 'FTC Act Section 5 Violation: Unsubstantiated performance claim.',
        counterStrikeAngle: data.counter_angle || 'Verified Reliability vs Marketing Hype',
        recommendedAdCopy: data.counter_ad_copy || `Looking for verified enterprise performance? AuraCloud delivers transparent, SLA-backed infrastructure.`,
        safeHarborDisclosure: data.mandatory_disclaimer || '*Based on publicly available product documentation.'
      };

      setCompetitors(prev => [newCompetitor, ...prev]);
      setSelectedTargetId(newId);
      setIsFormOpen(false);
      setCustomName('');
      setCustomUrl('');
      setCustomClaim('');
      showToast(`Analyzed ${newCompetitor.name}: ${newCompetitor.vulnerabilityScore}% exposure detected!`, 'success');
    } catch {
      showToast('Error analyzing competitor claim. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadDossier = () => {
    setDownloadingDossier(true);
    const dossier = {
      title: `${activeTarget.name} Competitive Vulnerability Dossier`,
      preparedBy: `${currentWorkspace.brand_name} Brand Intelligence Unit`,
      generatedAt: new Date().toISOString(),
      competitor: activeTarget.name,
      vulnerabilityScore: `${activeTarget.vulnerabilityScore}/100`,
      unsubstantiatedClaim: activeTarget.unsubstantiatedClaim,
      legalAnalysis: activeTarget.ftcLegalExposure,
      counterCampaign: {
        adCopy: activeTarget.recommendedAdCopy,
        safeHarborDisclosure: activeTarget.safeHarborDisclosure
      }
    };
    const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTarget.id}-counter-strike-dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadingDossier(false), 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-[#00FF87]">
              <Crosshair className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Competitor Claim Counter-Strike &amp; Ad Spy Intelligence
            </h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Autonomous reconnaissance on competitor marketing claims. Detects FTC/EU vulnerabilities and generates legally compliant counter-campaign ad copy to outmaneuver rivals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#00FF87]" />
            {isFormOpen ? 'Close Live Scanner' : 'Analyze New Competitor'}
          </button>

          <button
            onClick={handleDownloadDossier}
            disabled={downloadingDossier}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,255,135,0.25)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {downloadingDossier ? 'Generating Dossier...' : 'Export Legal Intelligence Dossier'}
          </button>
        </div>
      </div>

      {/* Live Competitor Claim Ingestion Form */}
      {isFormOpen && (
        <form onSubmit={handleAnalyzeCompetitor} className="p-5 rounded-2xl bg-[#080E0B] border-2 border-emerald-500/50 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#00FF87]" />
              <h3 className="text-sm font-bold text-white">Live Competitor Claim Reconnaissance Engine</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              FTC Act § 5 Automated Analyzer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Competitor Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Cloud Corp, RivalStack, HyperScale"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-[#050806] border border-emerald-950 text-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Target Landing Page URL or Source (Optional)</label>
              <input
                type="text"
                placeholder="https://competitor.com/pricing"
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-[#050806] border border-emerald-950 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">
              Public Marketing Claim / Slogan / Superlative Ad Copy to Audit
            </label>
            <textarea
              rows={3}
              placeholder="e.g. 'The world's only 100% unbreakable cloud guaranteed with 0% packet loss and 75% cheaper rates.'"
              value={customClaim}
              onChange={e => setCustomClaim(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg bg-[#050806] border border-emerald-950 text-white focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-xs font-black flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,135,0.3)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isAnalyzing ? 'Analyzing Claim via FTC Rules...' : 'Audit Claim & Synthesize Counter-Ad'}
            </button>
          </div>
        </form>
      )}

      {/* Competitor Target Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {competitors.map((comp) => (
          <div
            key={comp.id}
            onClick={() => setSelectedTargetId(comp.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedTargetId === comp.id
                ? 'bg-[#0E1510] border-emerald-500/80 shadow-[0_0_20px_rgba(0,255,135,0.15)]'
                : 'bg-[#080E0B] border-emerald-950/80 hover:border-emerald-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                {comp.tickerOrSlug}
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {comp.vulnerabilityScore}% EXPOSURE
              </span>
            </div>

            <h3 className="text-sm font-bold text-white leading-snug">{comp.name}</h3>
            <p className="text-xs text-zinc-400 mt-1">{comp.marketShare}</p>

            <div className="mt-3 pt-2.5 border-t border-emerald-950 text-[11px] text-amber-300 truncate">
              Vulnerability: {comp.unsubstantiatedClaim}
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis & Ad Brief Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Competitor Vulnerability Analysis (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0A110D] border border-emerald-950 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Targeted Competitor Claim
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">
                Source: {activeTarget.claimSourceUrl.replace('https://', '')}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-sm font-medium leading-relaxed">
              {activeTarget.unsubstantiatedClaim}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                Statutory Vulnerability &amp; Exposure Analysis
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-[#050806] border border-emerald-950 p-3.5 rounded-xl">
                {activeTarget.ftcLegalExposure}
              </p>
            </div>

            <div className="pt-2 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Class-Action Risk Rating: <strong className="text-red-400">High (15 U.S.C. § 45)</strong></span>
              <span className="text-emerald-400 font-bold">● VULNERABILITY CONFIRMED</span>
            </div>
          </div>
        </div>

        {/* Right: Automated Counter-Strike Campaign Ad (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0A110D] border border-emerald-950 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00FF87]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Legally Compliant Counter-Ad Brief
                </h3>
              </div>
              <button
                onClick={() => handleCopy('ad', activeTarget.recommendedAdCopy)}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1 transition-colors"
              >
                {copiedKey === 'ad' ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'ad' ? 'Copied' : 'Copy Ad Copy'}
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                STRATEGIC ANGLE: {activeTarget.counterStrikeAngle}
              </span>
              <div className="bg-[#050806] border border-emerald-500/30 rounded-xl p-4 text-xs text-zinc-100 leading-relaxed whitespace-pre-wrap font-sans">
                {activeTarget.recommendedAdCopy}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 italic">
              <strong>Mandatory Safe-Harbor Footnote:</strong> {activeTarget.safeHarborDisclosure}
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleCopy('ad-full', `${activeTarget.recommendedAdCopy}\n\n${activeTarget.safeHarborDisclosure}`)}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,255,135,0.2)]"
              >
                <ArrowRight className="w-4 h-4" />
                Deploy Counter-Strike Campaign (LinkedIn / Google Ads)
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
