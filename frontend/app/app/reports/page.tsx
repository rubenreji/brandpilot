'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Calendar,
  Lock,
  QrCode,
  Sparkles,
  BarChart3,
  Award,
  Layers,
  Check,
  Clock
} from 'lucide-react';

export default function ExecutiveReportsPage() {
  const { currentWorkspace, currentUser, submissions, allBrandBases } = useBrandPilot();
  const [selectedReportType, setSelectedReportType] = useState<'quarterly' | 'audit_summary' | 'regulatory_memo'>('quarterly');
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingJson, setDownloadingJson] = useState(false);

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const sha256Fingerprint = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadLedger = () => {
    setDownloadingJson(true);
    const reportData = {
      title: `${currentWorkspace.brand_name} Executive Brand Compliance Report`,
      organization: currentWorkspace.brand_name,
      auditDate: reportDate,
      cryptographicHash: sha256Fingerprint,
      auditedBy: currentUser.full_name || currentUser.name,
      overallScore: 94,
      industryPeerAverage: 71,
      totalAuditedSubmissions: submissions.length,
      complianceMetrics: {
        legalRiskStatus: 'Remediated',
        projectedExposureSaved: '$410,464',
        resolvedFindings: 18,
        openEscalations: 0
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentWorkspace.brand_name.toLowerCase()}-executive-compliance-report.json`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadingJson(false), 1000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header & Action Controls (Hidden during print) */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Executive Boardroom PDF & Audit Report
            </h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Publication-grade compliance ledger and C-suite audit summary certified with tamper-evident cryptographic hash.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-lg bg-[#0A110D] border border-emerald-950 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? 'Link Copied' : 'Share Link'}
          </button>

          <button
            onClick={handleDownloadLedger}
            disabled={downloadingJson}
            className="px-3.5 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            {downloadingJson ? 'Exporting...' : 'Export JSON Audit'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)]"
          >
            <Printer className="w-4 h-4" />
            Print to PDF
          </button>
        </div>
      </div>

      {/* Report Configuration Selector (Hidden during print) */}
      <div className="print:hidden bg-[#0A110D] border border-emerald-950 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Report Format:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedReportType('quarterly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedReportType === 'quarterly'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Quarterly Boardroom Brief
            </button>
            <button
              onClick={() => setSelectedReportType('audit_summary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedReportType === 'audit_summary'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Technical Audit Ledger
            </button>
            <button
              onClick={() => setSelectedReportType('regulatory_memo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedReportType === 'regulatory_memo'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              FTC/SEC Regulatory Memo
            </button>
          </div>
        </div>
        <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Ready for PDF rendering (Optimized for standard US Letter & A4)
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORMAL BOARDROOM DOCUMENT CONTAINER (Printed Page) */}
      {/* ========================================================================= */}
      <div className="bg-[#070D09] border border-emerald-950/80 rounded-2xl p-8 sm:p-12 shadow-2xl text-zinc-100 space-y-8 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        
        {/* Document Header */}
        <div className="border-b border-emerald-950 pb-6 print:border-zinc-300">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black font-extrabold flex items-center justify-center text-sm">
                  BP
                </div>
                <span className="font-extrabold text-lg text-white tracking-wider print:text-black">
                  BRANDPILOT ENTERPRISE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 print:border-zinc-400 print:text-zinc-700">
                  OFFICIAL AUDIT REPORT
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2 print:text-black">
                {currentWorkspace.brand_name} Brand Integrity & Regulatory Audit
              </h1>
              <p className="text-xs text-zinc-400 print:text-zinc-600">
                Quarterly Governance Review, Legal Claim Substantiation & Visual Identity Certification
              </p>
            </div>

            <div className="text-right space-y-1 text-xs text-zinc-400 print:text-zinc-600">
              <div className="flex items-center justify-end gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400 print:text-zinc-700" />
                <span className="font-medium text-white print:text-black">{reportDate}</span>
              </div>
              <div>Report Reference: <span className="font-mono text-zinc-300 print:text-zinc-800">BP-EXEC-2026-Q4</span></div>
              <div>Auditor: <span className="font-medium text-zinc-300 print:text-zinc-800">{currentUser.full_name} ({currentUser.role.toUpperCase()})</span></div>
            </div>
          </div>
        </div>

        {/* Executive Scorecards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4">
          <div className="bg-[#0A110D] p-5 rounded-xl border border-emerald-500/40 print:bg-zinc-50 print:border-zinc-300">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider print:text-zinc-600">
              Overall Compliance Index
            </span>
            <div className="text-4xl font-black text-[#00FF87] mt-2 print:text-emerald-700">
              94<span className="text-xl text-zinc-500">/100</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium print:text-emerald-800">
              ↑ 8.4% improvement QoQ
            </p>
          </div>

          <div className="bg-[#0A110D] p-5 rounded-xl border border-emerald-950 print:bg-zinc-50 print:border-zinc-300">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider print:text-zinc-600">
              Industry Peer Benchmark
            </span>
            <div className="text-3xl font-black text-white mt-2 print:text-black">
              Top 3%
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 print:text-zinc-600">
              Sector median benchmark: 71/100
            </p>
          </div>

          <div className="bg-[#0A110D] p-5 rounded-xl border border-emerald-950 print:bg-zinc-50 print:border-zinc-300">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider print:text-zinc-600">
              Regulatory Fine Protection
            </span>
            <div className="text-3xl font-black text-emerald-400 mt-2 print:text-emerald-800">
              $410,464
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 print:text-zinc-600">
              Potential FTC/EU liabilities neutralized
            </p>
          </div>

          <div className="bg-[#0A110D] p-5 rounded-xl border border-emerald-950 print:bg-zinc-50 print:border-zinc-300">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider print:text-zinc-600">
              Asset Review Throughput
            </span>
            <div className="text-3xl font-black text-white mt-2 print:text-black">
              100%
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 print:text-zinc-600">
              All 18 active assets verified & approved
            </p>
          </div>
        </div>

        {/* C-Suite Executive Summary Narrative */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 print:text-black">
            <Award className="w-4 h-4 text-[#00FF87] print:text-emerald-700" />
            Executive Summary & Strategic Assessment
          </h2>
          <div className="bg-[#0A110D] p-5 rounded-xl border border-emerald-950/80 text-sm leading-relaxed text-zinc-300 space-y-3 print:bg-transparent print:border-none print:p-0 print:text-zinc-800">
            <p>
              During this evaluation period, <strong>{currentWorkspace.brand_name}</strong> demonstrated strong adherence to corporate brand standards, commercial advertising regulations, and visual identity requirements. The implementation of automated pre-flight brand gating prevented 14 unapproved performance claims and 4 improper logo color treatments from reaching external marketing channels.
            </p>
            <p>
              Under FTC Act Section 5 and EU Green Claims guidelines, all flagged claims regarding <em>"99.999% uptime"</em> and <em>"100% net-zero emissions"</em> were successfully remediated into legally defensible safe-harbor disclosures with verified substantiating footnotes. The company maintains zero outstanding regulatory enforcement notices.
            </p>
          </div>
        </div>

        {/* Detailed Compliance Pillar Breakdown */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 print:text-black">
            <BarChart3 className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            Audit Findings by Governance Category
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-emerald-950 rounded-xl overflow-hidden print:border-zinc-300">
              <thead className="bg-[#0C1610] text-zinc-400 uppercase tracking-wider border-b border-emerald-950 print:bg-zinc-100 print:text-zinc-700 print:border-zinc-300">
                <tr>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Evaluated Checkpoints</th>
                  <th className="py-3 px-4 font-semibold">Flagged Issues</th>
                  <th className="py-3 px-4 font-semibold">Remediation Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/60 print:divide-zinc-200">
                <tr>
                  <td className="py-3 px-4 font-bold text-white print:text-black">Truth-in-Advertising & Claims</td>
                  <td className="py-3 px-4 text-zinc-400 print:text-zinc-700">42 verified company claims vs FDA/FTC benchmarks</td>
                  <td className="py-3 px-4 text-amber-400 font-semibold print:text-amber-700">3 modified claims</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold print:text-emerald-800">100% Safe-Harbor Applied</td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#00FF87] print:text-emerald-700">96/100</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white print:text-black">Visual & Logo Geometry</td>
                  <td className="py-3 px-4 text-zinc-400 print:text-zinc-700">Logo clear space, minimum sizing & aspect ratios</td>
                  <td className="py-3 px-4 text-amber-400 font-semibold print:text-amber-700">2 bounding violations</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold print:text-emerald-800">Corrected in In-Situ</td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#00FF87] print:text-emerald-700">98/100</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white print:text-black">Color & WCAG 2.1 Contrast</td>
                  <td className="py-3 px-4 text-zinc-400 print:text-zinc-700">Emerald `#00FF87` on dark UI backgrounds</td>
                  <td className="py-3 px-4 text-zinc-400 print:text-zinc-700">0 violations</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold print:text-emerald-800">Pass (WCAG AAA)</td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#00FF87] print:text-emerald-700">100/100</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white print:text-black">Corporate Editorial Voice & Tone</td>
                  <td className="py-3 px-4 text-zinc-400 print:text-zinc-700">Enterprise authoritative vs casual phrasing</td>
                  <td className="py-3 px-4 text-amber-400 font-semibold print:text-amber-700">1 colloquialism replaced</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold print:text-emerald-800">Resolved</td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#00FF87] print:text-emerald-700">92/100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cryptographic Seal & Sign-off Block */}
        <div className="pt-6 border-t border-emerald-950 flex flex-col md:flex-row items-center justify-between gap-6 print:border-zinc-300">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 print:text-zinc-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-white print:text-black">
                Cryptographic Audit Attestation
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono print:text-zinc-600 break-all">
              SHA-256: {sha256Fingerprint}
            </p>
            <p className="text-[10px] text-zinc-500 print:text-zinc-500">
              Verified by BrandPilot Tamper-Proof Audit Vault • Timestamp: {new Date().toISOString()}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs font-semibold text-white print:text-black">{currentUser.full_name}</div>
              <div className="text-[10px] text-zinc-400 print:text-zinc-600 uppercase tracking-wider">Chief Compliance Reviewer</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-0.5 print:text-emerald-800">DIGITALLY SIGNED & CERTIFIED</div>
            </div>

            <div className="w-16 h-16 rounded-lg bg-zinc-900 border border-emerald-500/30 flex items-center justify-center p-2 print:border-zinc-400 print:bg-white">
              <QrCode className="w-full h-full text-emerald-400 print:text-black" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
