'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  Scale,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  FileCheck2,
  Copy,
  Check,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface RegulatoryFramework {
  id: string;
  name: string;
  authority: string;
  region: string;
  maxStatutoryFine: string;
  triggerCondition: string;
  enforcementTrend: 'Aggressive' | 'High' | 'Moderate';
  activeViolationsCount: number;
}

interface RiskFinding {
  id: string;
  claim: string;
  statute: string;
  frameworkId: string;
  potentialFineLow: number;
  potentialFineHigh: number;
  severity: 'Critical' | 'High' | 'Medium';
  substantiationGap: string;
  safeHarborRecommendation: string;
  mandatoryDisclaimer: string;
}

export default function RegulatoryRiskPage() {
  const { currentWorkspace, submissions } = useBrandPilot();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [companyAnnualRevenue, setCompanyAnnualRevenue] = useState<number>(50000000); // $50M default
  const [estimatedImpressionCount, setEstimatedImpressionCount] = useState<number>(2500000); // 2.5M impressions

  const frameworks: RegulatoryFramework[] = [
    {
      id: 'ftc_deception',
      name: 'FTC Truth-in-Advertising & Substantiation',
      authority: 'U.S. Federal Trade Commission',
      region: 'United States',
      maxStatutoryFine: '$51,744 per day/violation (15 U.S.C. § 45)',
      triggerCondition: 'Unsubstantiated objective performance, uptime, or benchmark claims',
      enforcementTrend: 'Aggressive',
      activeViolationsCount: 3
    },
    {
      id: 'eu_green_claims',
      name: 'EU Green Claims & Eco-Directive',
      authority: 'European Commission DG Justice',
      region: 'European Union',
      maxStatutoryFine: 'Up to 4% of total EU annual revenue',
      triggerCondition: 'Generic environmental claims without certified lifecycle audit (LCA)',
      enforcementTrend: 'Aggressive',
      activeViolationsCount: 1
    },
    {
      id: 'sec_reg_fd',
      name: 'SEC Reg FD & Forward-Looking Disclosures',
      authority: 'U.S. Securities & Exchange Commission',
      region: 'United States',
      maxStatutoryFine: '$100,000 - $1,000,000+ per misleading forecast',
      triggerCondition: 'Unverified future ROI projections or revenue-acceleration guarantees',
      enforcementTrend: 'High',
      activeViolationsCount: 2
    },
    {
      id: 'gdpr_privacy',
      name: 'GDPR / AI Act Deceptive Practices',
      authority: 'European Data Protection Board',
      region: 'European Union',
      maxStatutoryFine: '€20M or 4% global turnover',
      triggerCondition: 'Misrepresenting automated AI profiling or zero-data-retention security',
      enforcementTrend: 'Aggressive',
      activeViolationsCount: 1
    }
  ];

  const riskFindings: RiskFinding[] = [
    {
      id: 'rf-1',
      claim: '"Guaranteed 99.999% high-availability uptime with zero downtime ever recorded"',
      statute: 'FTC Act Section 5 (Unfair or Deceptive Practices)',
      frameworkId: 'ftc_deception',
      potentialFineLow: 51744,
      potentialFineHigh: 258720,
      severity: 'Critical',
      substantiationGap: 'Historical SLA logs demonstrate 99.95% actual uptime during Q3 maintenance window. Absolute claim of "zero downtime ever" is legally indefensible.',
      safeHarborRecommendation: 'Qualify with contractual SLA terms: "Designed to deliver 99.99% core infrastructure availability under standard SLA conditions."',
      mandatoryDisclaimer: '*SLA availability is measured across redundant multi-region clusters excluding scheduled maintenance windows.'
    },
    {
      id: 'rf-2',
      claim: '"100% Carbon-Neutral Cloud Infrastructure powered by net-zero renewable energy"',
      statute: 'EU Green Claims Directive (COM/2023/166)',
      frameworkId: 'eu_green_claims',
      potentialFineLow: (companyAnnualRevenue * 0.01),
      potentialFineHigh: (companyAnnualRevenue * 0.04),
      severity: 'Critical',
      substantiationGap: 'Third-party offsets are utilized for Scope 3 emissions without ISO 14064 third-party audit verification.',
      safeHarborRecommendation: 'Specify exact carbon offset scope: "Committed to net-zero Scope 1 & 2 operational emissions through certified renewable energy credits."',
      mandatoryDisclaimer: '†Scope 1 and 2 emissions offset via Gold Standard certified renewable energy attributes.'
    },
    {
      id: 'rf-3',
      claim: '"Eliminates 100% of brand compliance legal risk and cuts approval turnaround by 10x"',
      statute: 'FTC Guides Concerning the Use of Endorsements & Claims § 255.2',
      frameworkId: 'ftc_deception',
      potentialFineLow: 51744,
      potentialFineHigh: 155232,
      severity: 'High',
      substantiationGap: 'Absolute guarantee of risk elimination cannot be substantiated. 10x speedup is based on an internal uncontrolled survey of 8 pilot users.',
      safeHarborRecommendation: 'State typical customer outcomes: "Helps streamline brand reviews with up to an 8x reduction in review turnaround based on pilot customer case studies."',
      mandatoryDisclaimer: '‡Results may vary depending on team size and baseline approval workflow complexity.'
    },
    {
      id: 'rf-4',
      claim: '"Guarantees a minimum 350% ARR ROI within 90 days of enterprise deployment"',
      statute: 'SEC Rule 10b-5 / FTC Deceptive Pricing & Earnings',
      frameworkId: 'sec_reg_fd',
      potentialFineLow: 100000,
      potentialFineHigh: 500000,
      severity: 'High',
      substantiationGap: 'Promissory financial return guarantees violate commercial truth-in-advertising guidelines without historical actuarial verification.',
      safeHarborRecommendation: 'Reframe as customer-reported range: "Enterprise customers report an average 3.2x ROI over 12 months based on internal productivity audits."',
      mandatoryDisclaimer: '§Return on investment estimates based on aggregate customer case studies. Actual savings vary by organization.'
    }
  ];

  const filteredFindings = selectedFramework === 'all'
    ? riskFindings
    : riskFindings.filter(f => f.frameworkId === selectedFramework);

  const totalMinExposure = filteredFindings.reduce((acc, curr) => acc + curr.potentialFineLow, 0);
  const totalMaxExposure = filteredFindings.reduce((acc, curr) => acc + curr.potentialFineHigh, 0);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400">
              <Scale className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Regulatory Risk & Fine Exposure Engine
            </h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Quantify financial liability, statutory FTC / EU penalty exposure, and generate legally enforceable safe-harbor disclaimers before public distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/reports"
            className="px-3.5 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/40 flex items-center gap-1.5 transition-all"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            Export Legal Memo
          </Link>
          <Link
            href="/app/audit"
            className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,255,135,0.25)]"
          >
            <Sparkles className="w-4 h-4" />
            Audit New Content
          </Link>
        </div>
      </div>

      {/* Exposure Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-950/40 via-[#0A110D] to-[#0A110D] border border-red-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-300 uppercase tracking-wider">Projected Maximum Exposure</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 tracking-tight">
            ${(totalMaxExposure).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-red-300/80 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-red-400" /> Across {filteredFindings.length} flagged high-risk commercial claims
          </p>
        </div>

        <div className="bg-[#0A110D] border border-amber-500/30 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-300 uppercase tracking-wider">Baseline Statutory Floor</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 tracking-tight">
            ${(totalMinExposure).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-zinc-400 mt-1">Minimum per-violation civil penalty threshold</p>
        </div>

        <div className="bg-[#0A110D] border border-emerald-950 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Regulatory Jurisdiction</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            US & EU Dual-Zone
          </div>
          <p className="text-xs text-emerald-400 mt-1">FTC §5 + EU Green Claims active</p>
        </div>

        <div className="bg-[#0A110D] border border-emerald-950 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Remediation Status</span>
            <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            Safe-Harbor Available
          </div>
          <p className="text-xs text-zinc-400 mt-1">100% of claims have verified fixes</p>
        </div>
      </div>

      {/* Enterprise Revenue & Reach Adjuster */}
      <div className="bg-[#080E0B] border border-emerald-950 rounded-xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Enterprise Regulatory Exposure Calibrator</h3>
          </div>
          <span className="text-xs text-zinc-400">Updates EU turnover & FTC circulation multipliers</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-zinc-300 font-medium">Annual Enterprise Revenue ($)</span>
              <span className="text-emerald-400 font-bold">${(companyAnnualRevenue / 1000000).toFixed(1)}M</span>
            </div>
            <input
              type="range"
              min="5000000"
              max="250000000"
              step="5000000"
              value={companyAnnualRevenue}
              onChange={(e) => setCompanyAnnualRevenue(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00FF87]"
            />
            <p className="text-[11px] text-zinc-500 mt-1">Used for EU Directive max penalty caps (up to 4% global turnover)</p>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-zinc-300 font-medium">Estimated Audience Circulation / Impressions</span>
              <span className="text-emerald-400 font-bold">{(estimatedImpressionCount / 1000000).toFixed(1)}M Views</span>
            </div>
            <input
              type="range"
              min="100000"
              max="10000000"
              step="200000"
              value={estimatedImpressionCount}
              onChange={(e) => setEstimatedImpressionCount(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00FF87]"
            />
            <p className="text-[11px] text-zinc-500 mt-1">Used by FTC civil restitution and class-action risk models</p>
          </div>
        </div>
      </div>

      {/* Framework Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-emerald-950/80 pb-3">
        <button
          onClick={() => setSelectedFramework('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedFramework === 'all'
              ? 'bg-emerald-500 text-black shadow-sm font-bold'
              : 'bg-[#0A110D] text-zinc-400 hover:text-white border border-emerald-950'
          }`}
        >
          All Regulatory Frameworks ({riskFindings.length})
        </button>
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            onClick={() => setSelectedFramework(fw.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFramework === fw.id
                ? 'bg-emerald-500 text-black shadow-sm font-bold'
                : 'bg-[#0A110D] text-zinc-400 hover:text-white border border-emerald-950'
            }`}
          >
            {fw.name.split('&')[0]} ({riskFindings.filter(f => f.frameworkId === fw.id).length})
          </button>
        ))}
      </div>

      {/* Regulatory Framework Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {frameworks.map((fw) => (
          <div
            key={fw.id}
            className={`p-4 rounded-xl border transition-all ${
              selectedFramework === fw.id
                ? 'bg-[#0C1610] border-emerald-500/60 shadow-[0_0_15px_rgba(0,255,135,0.1)]'
                : 'bg-[#080E0B] border-emerald-950/80 hover:border-emerald-800/40'
            }`}
            onClick={() => setSelectedFramework(fw.id)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                {fw.region}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                fw.enforcementTrend === 'Aggressive' ? 'bg-red-950/80 text-red-300 border border-red-500/40' : 'bg-amber-950/80 text-amber-300'
              }`}>
                {fw.enforcementTrend}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">{fw.name}</h4>
            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{fw.triggerCondition}</p>
            <div className="mt-3 pt-2.5 border-t border-emerald-950/80 text-[11px] font-medium text-emerald-400">
              Statutory cap: {fw.maxStatutoryFine}
            </div>
          </div>
        ))}
      </div>

      {/* Flagged Claims & Safe-Harbor Disclaimers Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Active Claim Vulnerabilities & Safe-Harbor Remediations
          </h2>
          <span className="text-xs text-zinc-400">
            Showing {filteredFindings.length} evaluated commercial claims
          </span>
        </div>

        <div className="space-y-4">
          {filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className="bg-[#0A110D] border border-emerald-950 rounded-xl p-5 hover:border-emerald-800/50 transition-all shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left: Claim & Statutory Gap */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      finding.severity === 'Critical'
                        ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                    }`}>
                      {finding.severity} Risk
                    </span>
                    <span className="text-xs font-medium text-zinc-400">
                      {finding.statute}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-zinc-400 font-medium">Flagged Commercial Claim:</span>
                    <p className="text-sm font-semibold text-red-300 bg-red-950/20 border-l-2 border-red-500 p-2.5 rounded-r mt-1">
                      {finding.claim}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-zinc-400 font-medium">Legal Substantiation Gap:</span>
                    <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                      {finding.substantiationGap}
                    </p>
                  </div>
                </div>

                {/* Right: Projected Exposure Badge */}
                <div className="lg:w-72 bg-[#060B08] border border-red-500/30 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-medium text-red-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Fine Exposure Range</span>
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xl font-extrabold text-white mt-1">
                      ${finding.potentialFineLow.toLocaleString(undefined, { maximumFractionDigits: 0 })} – ${finding.potentialFineHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Based on FTC 15 U.S.C. § 45 statutory multipliers and current audience reach.
                    </p>
                  </div>

                  <Link
                    href={`/app/audit`}
                    className="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    Open in Audit Engine <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Remediation & Safe Harbor Block */}
              <div className="mt-4 pt-4 border-t border-emerald-950/80 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#050806] border border-emerald-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Approved Safe-Harbor Copy
                    </span>
                    <button
                      onClick={() => handleCopy(`${finding.id}-copy`, finding.safeHarborRecommendation)}
                      className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                      title="Copy safe-harbor copy"
                    >
                      {copiedId === `${finding.id}-copy` ? (
                        <>
                          <Check className="w-3 h-3 text-[#00FF87]" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-200 font-medium">
                    {finding.safeHarborRecommendation}
                  </p>
                </div>

                <div className="bg-[#050806] border border-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Mandatory Footnote Disclaimer
                    </span>
                    <button
                      onClick={() => handleCopy(`${finding.id}-disc`, finding.mandatoryDisclaimer)}
                      className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                      title="Copy disclaimer"
                    >
                      {copiedId === `${finding.id}-disc` ? (
                        <>
                          <Check className="w-3 h-3 text-[#00FF87]" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400 italic">
                    {finding.mandatoryDisclaimer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
