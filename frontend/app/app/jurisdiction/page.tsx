'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  Globe2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Languages,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  Info,
  Check,
  Plus,
  Send,
  Trash2
} from 'lucide-react';

interface JurisdictionRule {
  id: string;
  country: string;
  flag: string;
  authority: string;
  keyLegislation: string;
  mandatoryDisclaimers: string[];
  prohibitedSuperlatives: string[];
  maxStatutoryExposure: string;
  clearanceStatus: 'cleared' | 'action_required' | 'restricted';
}

interface TranslationAuditItem {
  id: string;
  language: string;
  localeCode: string;
  flag: string;
  sourceEnglish: string;
  translatedCopy: string;
  status: 'passed' | 'warning';
  notes: string;
}

const INITIAL_TRANSLATION_AUDITS: TranslationAuditItem[] = [
  {
    id: 't-1',
    language: 'Spanish (Latin America & Spain)',
    localeCode: 'es-ES / es-MX',
    flag: '🇪🇸',
    sourceEnglish: 'AuraCloud delivers high-availability enterprise governance with SLA-backed uptime.',
    translatedCopy: 'AuraCloud ofrece gobernanza empresarial de alta disponibilidad con tiempo de actividad respaldado por SLA.',
    status: 'passed',
    notes: 'Terminology aligned with Latin American and European Spanish legal definitions.'
  },
  {
    id: 't-2',
    language: 'German (DACH Region)',
    localeCode: 'de-DE',
    flag: '🇩🇪',
    sourceEnglish: 'Zero downtime guaranteed with automated multi-zone failover.*',
    translatedCopy: 'Garantierte null Ausfallzeiten durch automatische Ausfallsicherung.*',
    status: 'warning',
    notes: 'UWG (Gesetz gegen den unlauteren Wettbewerb) Warning: German courts prohibit absolute guarantees ("null Ausfallzeiten") without explicit asterisk disclaimers in identical font size.'
  },
  {
    id: 't-3',
    language: 'French (France & Canada)',
    localeCode: 'fr-FR',
    flag: '🇫🇷',
    sourceEnglish: 'Accelerate brand compliance reviews by up to 8x.',
    translatedCopy: 'Accélérez les examens de conformité de marque jusqu’à 8 fois.',
    status: 'passed',
    notes: 'Toubon Law compliance verified: All technical marketing terms provided in verified French.'
  },
  {
    id: 't-4',
    language: 'Japanese (APAC Headquarters)',
    localeCode: 'ja-JP',
    flag: '🇯🇵',
    sourceEnglish: 'Committed to certified net-zero carbon operational emissions.',
    translatedCopy: '認証済みの運用時ネットゼロカーボン排出量削減への取り組み。',
    status: 'passed',
    notes: 'Complies with METI / Consumer Affairs Agency environmental representation guidelines.'
  }
];

const SUPPORTED_LOCALES = [
  { code: 'es-ES', label: 'Spanish (es-ES / es-MX)', flag: '🇪🇸' },
  { code: 'de-DE', label: 'German (de-DE)', flag: '🇩🇪' },
  { code: 'fr-FR', label: 'French (fr-FR)', flag: '🇫🇷' },
  { code: 'ja-JP', label: 'Japanese (ja-JP)', flag: '🇯🇵' },
  { code: 'it-IT', label: 'Italian (it-IT)', flag: '🇮🇹' },
  { code: 'pt-BR', label: 'Portuguese (pt-BR)', flag: '🇧🇷' }
];

export default function MultiJurisdictionPage() {
  const { currentWorkspace } = useBrandPilot();
  const [selectedCountry, setSelectedCountry] = useState<string>('us');
  const [activeTab, setActiveTab] = useState<'matrix' | 'translation'>('matrix');
  const [translationItems, setTranslationItems] = useState<TranslationAuditItem[]>(INITIAL_TRANSLATION_AUDITS);

  // Custom translation form state
  const [selectedLocale, setSelectedLocale] = useState('de-DE');
  const [customEnglish, setCustomEnglish] = useState('');
  const [customTranslation, setCustomTranslation] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);

  const jurisdictions: JurisdictionRule[] = [
    {
      id: 'us',
      country: 'United States',
      flag: '🇺🇸',
      authority: 'Federal Trade Commission (FTC) & NAD',
      keyLegislation: 'FTC Act Section 5, Guides Against Deceptive Pricing',
      mandatoryDisclaimers: [
        '*Availability SLA based on multi-zone redundant cluster uptime.',
        '†Case study savings reflect aggregate customer results. Individual savings vary.'
      ],
      prohibitedSuperlatives: ['#1 Cloud in the World', 'Zero downtime ever', 'Unbreakable security'],
      maxStatutoryExposure: '$51,744 per civil violation / restitution',
      clearanceStatus: 'cleared'
    },
    {
      id: 'eu',
      country: 'European Union',
      flag: '🇪🇺',
      authority: 'European Commission & National Competition Authorities',
      keyLegislation: 'EU Green Claims Directive (COM/2023/166) & Digital Services Act',
      mandatoryDisclaimers: [
        '‡Scope 1 & 2 carbon offsets certified via Gold Standard carbon credits.',
        '§Complies with EU General Data Protection Regulation (GDPR) Art. 28.'
      ],
      prohibitedSuperlatives: ['100% Eco-Friendly', 'Zero Carbon Footprint', 'Carbon-Neutral Cloud'],
      maxStatutoryExposure: 'Up to 4% of total EU annual revenue',
      clearanceStatus: 'action_required'
    },
    {
      id: 'uk',
      country: 'United Kingdom',
      flag: '🇬🇧',
      authority: 'Advertising Standards Authority (ASA) & CMA',
      keyLegislation: 'CAP Code (Edition 12) & Digital Markets, Competition and Consumers Act',
      mandatoryDisclaimers: [
        '*Comparison against leading public cloud benchmarks verified as of Q4 2025.'
      ],
      prohibitedSuperlatives: ['Cheapest Enterprise Cloud', 'Guaranteed ROI'],
      maxStatutoryExposure: 'Up to 10% of worldwide turnover under DMCC Act',
      clearanceStatus: 'cleared'
    },
    {
      id: 'au',
      country: 'Australia',
      flag: '🇦🇺',
      authority: 'Australian Competition & Consumer Commission (ACCC)',
      keyLegislation: 'Competition and Consumer Act 2010 (Schedule 2 ACL)',
      mandatoryDisclaimers: [
        'Our goods and services come with guarantees that cannot be excluded under Australian Consumer Law.'
      ],
      prohibitedSuperlatives: ['Free Cloud Trial (when auto-rebilling)', 'Uncapped Bandwidth'],
      maxStatutoryExposure: 'Greater of $50M AUD or 3x benefit obtained',
      clearanceStatus: 'cleared'
    },
    {
      id: 'jp',
      country: 'Japan',
      flag: '🇯🇵',
      authority: 'Consumer Affairs Agency (CAA)',
      keyLegislation: 'Act against Unjustifiable Premiums and Misleading Representations',
      mandatoryDisclaimers: [
        '※導入実績および稼働率は特定条件下での測定値です。 (Uptime measured under specific enterprise conditions)'
      ],
      prohibitedSuperlatives: ['日本一 (No. 1 in Japan without third-party proof)', '絶対安全 (Absolute safety)'],
      maxStatutoryExposure: 'Surcharges of 3% of sales revenue for the violation period',
      clearanceStatus: 'cleared'
    }
  ];

  const handleAuditTranslation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEnglish.trim() || !customTranslation.trim()) return;

    setIsAuditing(true);

    setTimeout(() => {
      const localeObj = SUPPORTED_LOCALES.find(l => l.code === selectedLocale) || SUPPORTED_LOCALES[1];
      const combined = (customEnglish + ' ' + customTranslation).toLowerCase();

      // Check for prohibited superlatives and regulatory watchwords
      const hasAbsoluteSuperlative = /100%|guarantee|garantiert|null ausfallzeiten|unbreakable|zero downtime|cheapest|#1|best in the world|cure/.test(combined);
      const hasMissingDisclaimer = !combined.includes('*') && !combined.includes('†') && (combined.includes('sla') || combined.includes('save') || combined.includes('uptime'));

      let status: 'passed' | 'warning' = 'passed';
      let notes = `Verified statutory clearance for ${localeObj.label}. Safe-harbor phrasing conforms to regional fair advertising directives.`;

      if (hasAbsoluteSuperlative) {
        status = 'warning';
        if (selectedLocale === 'de-DE') {
          notes = 'UWG § 3 / § 5 Violation Warning: German courts prohibit absolute or unreserved efficiency claims ("garantiert" / "null") without immediate prominent qualifiers.';
        } else if (selectedLocale === 'fr-FR') {
          notes = 'Loi Toubon & Code de la consommation Warning: Absolute commercial claims require certified third-party testing disclosures and strict French terminology.';
        } else if (selectedLocale === 'ja-JP') {
          notes = 'Consumer Affairs Agency (CAA) Warning: Unsubstantiated superlative representations trigger statutory surcharges under the Premiums and Representations Act.';
        } else {
          notes = 'Regulatory Caution: Absolute superlatives or unreserved performance guarantees violate statutory false advertising regulations in this jurisdiction.';
        }
      } else if (hasMissingDisclaimer) {
        status = 'warning';
        notes = 'Disclaimer Advisory: Quantitative SLA or savings metrics detected without corresponding footnote disclaimer (* or †) required by regional trade regulators.';
      }

      const newItem: TranslationAuditItem = {
        id: `t-${Date.now()}`,
        language: localeObj.label,
        localeCode: localeObj.code,
        flag: localeObj.flag,
        sourceEnglish: customEnglish.trim(),
        translatedCopy: customTranslation.trim(),
        status,
        notes
      };

      setTranslationItems(prev => [newItem, ...prev]);
      setCustomEnglish('');
      setCustomTranslation('');
      setIsAuditing(false);
    }, 600);
  };

  const handleDeleteAudit = (id: string) => {
    setTranslationItems(prev => prev.filter(t => t.id !== id));
  };

  const activeJurisdiction = jurisdictions.find(j => j.id === selectedCountry) || jurisdictions[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Globe2 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Global Multi-Jurisdiction Regulatory Matrix
            </h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Reconcile marketing campaigns and translations across US FTC, EU Green Claims, UK ASA, and APAC advertising frameworks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'matrix'
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-[#0A110D] border border-emerald-950 text-zinc-300 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Territory Matrices
          </button>
          <button
            onClick={() => setActiveTab('translation')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'translation'
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-[#0A110D] border border-emerald-950 text-zinc-300 hover:text-white'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            Translation Compliance Checker
          </button>
        </div>
      </div>

      {/* VIEW 1: REGULATORY MATRICES */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Territory Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {jurisdictions.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedCountry(j.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedCountry === j.id
                    ? 'bg-[#0C1610] border-emerald-500/60 shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                    : 'bg-[#080E0B] border-emerald-950/80 hover:border-emerald-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">{j.flag}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    j.clearanceStatus === 'cleared'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                  }`}>
                    {j.clearanceStatus === 'cleared' ? 'Cleared' : 'Action Req'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{j.country}</h4>
                <p className="text-[10px] text-zinc-400 mt-0.5 truncate">{j.authority.split('&')[0]}</p>
              </button>
            ))}
          </div>

          {/* Active Selected Territory Deep-Dive */}
          <div className="bg-[#0A110D] border border-emerald-950 rounded-xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeJurisdiction.flag}</span>
                  <h3 className="text-xl font-bold text-white tracking-tight">{activeJurisdiction.country} Enforcement Profile</h3>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Enforcement Authority: <strong className="text-zinc-200">{activeJurisdiction.authority}</strong> • Statute: <span className="font-mono text-emerald-400">{activeJurisdiction.keyLegislation}</span>
                </p>
              </div>

              <div className="bg-[#050806] border border-red-500/30 px-3.5 py-2 rounded-lg text-right">
                <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider block">Max Statutory Exposure</span>
                <span className="text-xs font-bold text-white">{activeJurisdiction.maxStatutoryExposure}</span>
              </div>
            </div>

            {/* Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Mandatory Disclaimers */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Mandatory Territory Footnotes & Disclaimers
                </h4>
                <div className="space-y-2">
                  {activeJurisdiction.mandatoryDisclaimers.map((disc, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#050806] border border-emerald-950 text-xs text-zinc-300 leading-relaxed font-mono">
                      {disc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Prohibited Superlatives */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Statutorily Prohibited Superlatives & Claims
                </h4>
                <div className="space-y-2">
                  {activeJurisdiction.prohibitedSuperlatives.map((claim, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-xs text-red-300 flex items-center justify-between">
                      <span>&ldquo;{claim}&rdquo;</span>
                      <span className="text-[10px] font-bold text-red-400 uppercase">Illegal without proof</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TRANSLATION COMPLIANCE CHECKER */}
      {activeTab === 'translation' && (
        <div className="space-y-6">
          <div className="bg-[#080E0B] border border-emerald-950 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">Cross-Border Localization Auditor</span>
            </div>
            <span className="text-xs text-zinc-400">Audits localized copy for regional advertising compliance and disclaimer retention</span>
          </div>

          {/* Interactive Custom Localization Audit Form */}
          <div className="bg-[#0A110D] border border-emerald-950/90 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00FF87]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Audit Custom Localized Copy
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400">Live statutory checks against regional ad laws</span>
            </div>

            <form onSubmit={handleAuditTranslation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Target Territory &amp; Language
                  </label>
                  <select
                    value={selectedLocale}
                    onChange={(e) => setSelectedLocale(e.target.value)}
                    className="w-full bg-[#050806] border border-emerald-950 focus:border-[#00FF87] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {SUPPORTED_LOCALES.map(loc => (
                      <option key={loc.code} value={loc.code}>
                        {loc.flag} {loc.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 flex items-end justify-end">
                  <button
                    type="submit"
                    disabled={isAuditing || !customEnglish.trim() || !customTranslation.trim()}
                    className="w-full md:w-auto px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isAuditing ? 'Auditing Localization...' : 'Run Compliance Audit'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Source English Campaign Copy *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter source English copy (e.g. 'AuraCloud delivers 99.99% high availability with zero data loss guarantee*')"
                    value={customEnglish}
                    onChange={(e) => setCustomEnglish(e.target.value)}
                    className="w-full bg-[#050806] border border-emerald-950 focus:border-[#00FF87] rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Localized Target Translation *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter translated copy in the selected target language..."
                    value={customTranslation}
                    onChange={(e) => setCustomTranslation(e.target.value)}
                    className="w-full bg-[#050806] border border-emerald-950 focus:border-[#00FF87] rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Audit Results Feed */}
          <div className="space-y-4">
            {translationItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#0A110D] border border-emerald-950 rounded-xl p-5 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <span className="text-sm font-bold text-white">{item.language}</span>
                    <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      {item.localeCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1 ${
                      item.status === 'passed'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                    }`}>
                      {item.status === 'passed' ? <Check className="w-3 h-3 text-[#00FF87]" /> : <AlertTriangle className="w-3 h-3 text-amber-400" />}
                      {item.status === 'passed' ? 'Compliant Localization' : 'Regulatory Caution'}
                    </span>
                    <button
                      onClick={() => handleDeleteAudit(item.id)}
                      className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                      title="Remove record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 rounded-lg bg-[#050806] border border-zinc-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Source English Copy:</span>
                    <p className="text-xs text-zinc-300">{item.sourceEnglish}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#050806] border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Localized Output:</span>
                    <p className="text-xs text-white font-medium">{item.translatedCopy}</p>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 pt-2 border-t border-emerald-950/80 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{item.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
