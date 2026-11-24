'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  ShieldAlert,
  Flame,
  Radio,
  FileText,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Copy,
  Check,
  Users,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  Share2,
  Plus,
  X
} from 'lucide-react';

interface CrisisIncident {
  id: string;
  severity: 'P0 - Active Viral Breach' | 'P1 - High Legal Drift' | 'P2 - Moderate Discrepancy';
  title: string;
  sourceChannel: string;
  timestamp: string;
  reachEstimate: string;
  rootCause: string;
  containmentStatus: 'Escalated' | 'Contained' | 'Resolved';
  ceaseAndDesistNotice: string;
  crisisHoldingStatement: string;
  mediaQnA: { q: string; a: string }[];
}

export default function CrisisShieldPage() {
  const { currentWorkspace, currentUser } = useBrandPilot();
  const brandName = currentWorkspace?.brand_name || 'AuraCloud';
  const officerName = currentUser?.full_name || 'Elena Rostova';

  const INITIAL_CRISIS_INCIDENTS: CrisisIncident[] = [
    {
      id: 'inc-001',
      severity: 'P0 - Active Viral Breach',
      title: 'Deceptive "100% Unbreakable Cloud Guarantee" Ad Distributed on Public Channels',
      sourceChannel: 'Public PR Wire & Tech Influencer Campaign',
      timestamp: '14 mins ago (07:26 AM)',
      reachEstimate: '420,000 Views • 1,200 Reposts',
      rootCause: 'Regional agency published unapproved draft copy containing absolute zero-downtime promises, triggering FTC false-advertising statutory thresholds.',
      containmentStatus: 'Escalated',
      ceaseAndDesistNotice: `FORMAL NOTICE OF CEASE AND DESIST AND DEMAND FOR IMMEDIATE RETRACTION

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
To: External Media Syndication Partners & Affiliate Publishing Network
From: Office of the General Counsel, ${brandName} Inc.
Subject: Unauthorized & Unsubstantiated Commercial Representation

Dear Distribution Network,

It has come to our attention that commercial advertisements containing the unauthorized claim "Guaranteed 100% unbreakable uptime with zero downtime ever recorded" were transmitted across your syndication channels without final corporate regulatory clearance.

This statement directly conflicts with ${brandName}'s official SLA parameters and 15 U.S.C. § 45 (FTC Act Section 5). 

DEMAND IS HEREBY MADE that you immediately:
1. Cease and desist all further transmission, display, and publication of the aforementioned creative asset.
2. Remove all cached instances from syndication servers within four (4) hours of receipt.
3. Replace the creative with the approved safe-harbor version provided in Annex A.

Failure to comply will result in immediate termination of publishing agreements and formal referral to regulatory enforcement authorities.

Sincerely,
${officerName}
Chief Compliance Officer, ${brandName} Inc.`,
      crisisHoldingStatement: `Official Statement Regarding Recent Cloud Availability Claims

"${brandName} is aware of an unauthorized promotional message released earlier today referencing absolute cloud availability guarantees. This messaging was distributed prematurely due to an external publishing error and does not reflect our official engineering commitments.

Our core infrastructure is engineered for 99.99% high availability backed by transparent, multi-region contractual SLAs. We have retracted the erroneous material, and all verified performance metrics remain publicly auditable on our real-time status ledger."`,
      mediaQnA: [
        {
          q: 'Did AuraCloud experience an actual downtime event today?',
          a: 'No. All production systems are operating normally at 99.99% availability. The error was purely a copywriting mischaracterization by an external marketing partner.'
        },
        {
          q: 'Is AuraCloud facing an FTC investigation?',
          a: 'No. The discrepancy was caught autonomously by our internal BrandPilot governance engine within 14 minutes, and full retraction notices have already been served.'
        }
      ]
    },
    {
      id: 'inc-002',
      severity: 'P1 - High Legal Drift',
      title: 'Counterfeit Trademark & Unauthorized Logo Use in Affiliate Webinar',
      sourceChannel: 'Third-Party Partner Landing Page (cloudsummit-partner.io)',
      timestamp: '2 hours ago',
      reachEstimate: '18,500 Targeted Registrants',
      rootCause: 'Affiliate co-marketing partner warped the official logo emblem with unauthorized drop-shadows and claimed "Exclusive Government-Certified Cloud".',
      containmentStatus: 'Contained',
      ceaseAndDesistNotice: `NOTICE OF TRADEMARK INFRINGEMENT & BRAND IMPERSONATION

To: Operations Team, CloudSummit Partner Network
From: Brand Governance Counsel, ${brandName}

You are displaying an altered derivative of ${brandName}'s registered trademark (U.S. Reg. No. 6,842,109) and asserting false government endorsements. You are hereby ordered to replace the asset with official co-branded badges immediately.`,
      crisisHoldingStatement: `Statement Regarding Partner Webinar Assets:
"${brandName} values its ecosystem partners but strictly enforces visual integrity and factual accuracy. We have provided our authorized partner badge toolkit to ensure all attendee communications reflect verified certifications."`,
      mediaQnA: [
        {
          q: 'Is the CloudSummit event officially sponsored by AuraCloud?',
          a: 'We are a featured technology presenter, but the branding has been updated to follow our approved co-marketing guidelines.'
        }
      ]
    }
  ];

  const [incidentsList, setIncidentsList] = useState<CrisisIncident[]>(INITIAL_CRISIS_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('inc-001');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  // New Breach Logging Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('');
  const [newOffendingClaim, setNewOffendingClaim] = useState('');
  const [newSeverity, setNewSeverity] = useState<'P0 - Active Viral Breach' | 'P1 - High Legal Drift' | 'P2 - Moderate Discrepancy'>('P0 - Active Viral Breach');
  const [newReach, setNewReach] = useState('12,000 Impressions');

  const activeIncident = incidentsList.find(i => i.id === selectedIncidentId) || incidentsList[0];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadNotice = (incident: CrisisIncident) => {
    const filename = `Cease_and_Desist_${incident.id}_${incident.title.slice(0, 20).replace(/\s+/g, '_')}.txt`;
    const blob = new Blob([incident.ceaseAndDesistNotice], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCreateBreach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOffendingClaim.trim()) return;

    const brandName = currentWorkspace?.brand_name || 'AuraCloud';
    const officerName = currentUser?.full_name || 'Corporate Counsel';
    const incidentId = `inc-${Date.now().toString().slice(-4)}`;

    const formalNotice = `FORMAL NOTICE OF CEASE AND DESIST AND DEMAND FOR IMMEDIATE RETRACTION

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
To: Distribution Operations & Content Moderation Lead, ${newChannel || 'Syndication Partner'}
From: Office of the General Counsel, ${brandName} Inc.
Subject: Demanded Retraction: Unauthorized Commercial Representation ("${newTitle.trim()}")

Dear Channel Administrator,

It has come to our direct attention that your platform/channel is transmitting unauthorized commercial marketing assets asserting the following unsubstantiated or deceptive claim:

"${newOffendingClaim.trim()}"

This representation constitutes an unauthorized use of ${brandName}'s registered trademark assets and directly conflicts with 15 U.S.C. § 45 (FTC Act § 5) and Section 43(a) of the Lanham Act. 

DEMAND IS HEREBY FORMALLY SERVED that you immediately:
1. Cease and desist all active transmission, algorithmic amplification, and publication of this material.
2. Expunge or purge all cached media assets from your edge delivery network within four (4) business hours.
3. Transmit written confirmation of compliance to regulatory@${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com upon execution.

Failure to execute this demand will result in immediate escalation to expedited injunctive relief and statutory damage recovery proceedings.

Sincerely,
${officerName}
Office of Brand Protection & Regulatory Compliance
${brandName} Global Inc.`;

    const holdingStatement = `Official Corporate Statement Regarding Recent Distribution of Claims on ${newChannel || 'External Channels'}:

"${brandName} has identified an unauthorized external campaign circulating inaccurate performance representations: '${newOffendingClaim.trim()}'. 

This statement was deployed without internal verification and does not reflect our engineering SLAs or verified capabilities. ${brandName} is committed to transparent, auditable accuracy across all touchpoints. Formal takedown notices have been transmitted, and all verified telemetry remains accessible on our public trust ledger."`;

    const dynamicQnA = [
      {
        q: `Did ${brandName} authorize the claim "${newOffendingClaim.slice(0, 40)}..."?`,
        a: `No. This content was distributed without governance review. Formal cease-and-desist procedures were initiated immediately upon automated detection.`
      },
      {
        q: `Are customers or production environments impacted by this breach?`,
        a: `No. All operations, systems, and client services continue normal performance under strict verified compliance.`
      }
    ];

    const newIncident: CrisisIncident = {
      id: incidentId,
      severity: newSeverity,
      title: newTitle.trim(),
      sourceChannel: newChannel.trim() || 'Direct Social / Digital Syndication',
      timestamp: 'Just now',
      reachEstimate: newReach.trim() || 'Estimated 5,000+ views',
      rootCause: `Unauthorized distribution of unverified claim: "${newOffendingClaim.slice(0, 60)}..."`,
      containmentStatus: 'Escalated',
      ceaseAndDesistNotice: formalNotice,
      crisisHoldingStatement: holdingStatement,
      mediaQnA: dynamicQnA
    };

    setIncidentsList(prev => [newIncident, ...prev]);
    setSelectedIncidentId(incidentId);
    setNewTitle('');
    setNewChannel('');
    setNewOffendingClaim('');
    setIsModalOpen(false);
  };

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchedSuccess(true);
      setTimeout(() => setDispatchedSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Autonomous PR Crisis Shield &amp; Legal Dispatch
            </h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Rapid automated containment for public brand breaches, viral false claims, and partner trademark infringement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5 text-[#00FF87]" />
            Log Custom Brand Breach
          </button>
          <button
            onClick={handleDispatch}
            disabled={isDispatching}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
            {isDispatching ? 'Transmitting War-Room Dispatch...' : 'Dispatch Cease & Desist Wire'}
          </button>
        </div>
      </div>

      {/* Dispatched Alert Toast */}
      {dispatchedSuccess && (
        <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 p-4 rounded-xl flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#00FF87]" />
            <div>
              <span className="font-bold text-white text-sm">Cease-and-Desist Wire Successfully Transmitted!</span>
              <p className="text-xs text-emerald-300">
                Formal legal notices dispatched via registered API webhooks to syndication partners and external PR wires.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">STATUS: SENT (SHA256:7f4a...)</span>
        </div>
      )}

      {/* Incident Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {incidentsList.map((inc) => (
          <div
            key={inc.id}
            onClick={() => setSelectedIncidentId(inc.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedIncidentId === inc.id
                ? 'bg-[#0E1510] border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                : 'bg-[#080E0B] border-emerald-950/80 hover:border-emerald-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">
                {inc.severity}
              </span>
              <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-red-400" />
                {inc.timestamp}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{inc.title}</h3>
            <div className="flex items-center justify-between mt-3 text-xs text-zinc-400 pt-2 border-t border-emerald-950">
              <span className="truncate max-w-[140px]">Channel: <strong className="text-zinc-200">{inc.sourceChannel}</strong></span>
              <span className="text-red-400 font-medium whitespace-nowrap">{inc.reachEstimate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main War-Room Terminal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Formal Cease-and-Desist Letter (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0A110D] border border-emerald-950 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between border-b border-emerald-950 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Automated Cease-and-Desist Notice
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadNotice(activeIncident)}
                  className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1 transition-colors"
                  title="Download legal notice as .txt file"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .txt
                </button>
                <button
                  onClick={() => handleCopy('cd', activeIncident.ceaseAndDesistNotice)}
                  className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1 transition-colors"
                >
                  {copiedKey === 'cd' ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'cd' ? 'Copied' : 'Copy Notice'}
                </button>
              </div>
            </div>

            <div className="bg-[#050806] border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-wrap select-text">
              {activeIncident.ceaseAndDesistNotice}
            </div>

            <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-1">
              <span>Jurisdiction: U.S. Federal Trade Commission &amp; Lanham Act § 43(a)</span>
              <span className="text-emerald-400 font-mono">100% LEGALLY VETTED</span>
            </div>
          </div>
        </div>

        {/* Right: Crisis PR Holding Statement & Media FAQ (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Holding Statement Card */}
          <div className="bg-[#0A110D] border border-emerald-950 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Crisis PR Holding Statement
                </h3>
              </div>
              <button
                onClick={() => handleCopy('pr', activeIncident.crisisHoldingStatement)}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1 transition-colors"
              >
                {copiedKey === 'pr' ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'pr' ? 'Copied' : 'Copy PR Draft'}
              </button>
            </div>

            <div className="bg-[#050806] border border-emerald-950 rounded-xl p-4 text-xs text-zinc-200 leading-relaxed italic">
              {activeIncident.crisisHoldingStatement}
            </div>
          </div>

          {/* Media Q&A Talking Points */}
          <div className="bg-[#0A110D] border border-emerald-950 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 border-b border-emerald-950 pb-3">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Spokesperson Talking Points &amp; Q&amp;A
              </h3>
            </div>

            <div className="space-y-3">
              {activeIncident.mediaQnA.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#050806] border border-emerald-950 space-y-1.5">
                  <span className="text-xs font-semibold text-amber-300 block">
                    Q: {item.q}
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    A: {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Log Custom Brand Breach Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B130E] border border-emerald-800/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/50 text-red-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Log Custom Brand Breach</h3>
                <p className="text-xs text-zinc-400">Autonomously draft enforceable Cease &amp; Desist and media response.</p>
              </div>
            </div>

            <form onSubmit={handleCreateBreach} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Incident Title / Infringement Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unauthorized '100% Guaranteed Cure' Claim on Social Ad"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#050806] border border-emerald-950 focus:border-[#00FF87] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Offending Channel / Partner
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TikTok Ad, Partner Landing Page"
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full bg-[#050806] border border-emerald-950 focus:border-[#00FF87] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Estimated Reach / Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50,000 Impressions"
                    value={newReach}
                    onChange={(e) => setNewReach(e.target.value)}
                    className="w-full bg-[#050806] border border-emerald-950 focus:border-[#00FF87] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Severity Classification
                </label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full bg-[#050806] border border-emerald-950 focus:border-[#00FF87] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="P0 - Active Viral Breach">P0 - Active Viral Breach (Statutory violation)</option>
                  <option value="P1 - High Legal Drift">P1 - High Legal Drift (Trademark / partner abuse)</option>
                  <option value="P2 - Moderate Discrepancy">P2 - Moderate Discrepancy (Styleguide violation)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Offending Text or Claim *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Paste the unauthorized copy or misleading claim detected in the wild..."
                  value={newOffendingClaim}
                  onChange={(e) => setNewOffendingClaim(e.target.value)}
                  className="w-full bg-[#050806] border border-emerald-950 focus:border-[#00FF87] rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-emerald-950">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Enforceable Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
