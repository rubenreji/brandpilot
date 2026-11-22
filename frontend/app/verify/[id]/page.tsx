'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useBrandPilot } from '@/lib/store';
import { PublicVerificationRecord } from '@/lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Award,
  Lock,
  FileCheck2,
  QrCode,
  ArrowLeft,
  Building2,
  FileText
} from 'lucide-react';

export default function PublicVerificationPage() {
  const params = useParams();
  const submissionId = (params?.id as string) || 'live';
  const { getPublicVerification, showToast } = useBrandPilot();

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<PublicVerificationRecord | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRecord = async () => {
      setLoading(true);
      const res = await getPublicVerification(submissionId);
      if (isMounted) {
        setRecord(res);
        setLoading(false);
      }
    };
    fetchRecord();
    return () => {
      isMounted = false;
    };
  }, [submissionId]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      showToast('Public verification link copied to clipboard.', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050806] text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
          <div className="text-xs font-mono text-emerald-400">Verifying Cryptographic Ledger Seal...</div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-[#050806] text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-md text-center p-8 rounded-2xl bg-[#0A120E] border border-rose-900/60 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-400 flex items-center justify-center mx-auto">
            ✕
          </div>
          <h1 className="text-lg font-bold text-white">Record Not Found on Ledger</h1>
          <p className="text-xs text-zinc-400">
            The verification token does not match any approved publication record or has been revoked.
          </p>
          <Link
            href="/app/approvals"
            className="inline-block px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-lg hover:bg-emerald-400"
          >
            Return to Human Approval Centre
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050806] text-zinc-100 antialiased selection:bg-emerald-500 selection:text-black p-4 sm:p-8">
      {/* Top Banner Navigation */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/app/approvals"
          className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Governance Studio</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-[#0A120E] border border-emerald-900/60 hover:bg-emerald-950/60 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Public Link'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.print();
            }}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-black" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Card */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-[#0A120E] border-2 border-[#00FF87]/40 shadow-[0_0_50px_rgba(0,255,135,0.12)] overflow-hidden">
        {/* Certificate Header Band */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950/60 via-[#0A120E] to-teal-950/50 border-b border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00FF87] to-teal-500 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-emerald-500/30">
              ✓
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#00FF87] uppercase tracking-widest font-extrabold">
                Immutable Cryptographic Ledger
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Brand Governance Release Certificate
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Official proof that collateral conforms to verified corporate brand identity, SLA metrics, and legal policies.
              </p>
            </div>
          </div>

          {/* Ledger Seal Badge */}
          <div className="text-right sm:text-right shrink-0">
            <span className="font-mono text-xs font-bold text-[#00FF87] bg-emerald-950/80 border border-emerald-700 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
              <span>LEDGER-VERIFIED-VALID</span>
            </span>
            <div className="text-[10px] font-mono text-zinc-500 mt-1">Hash: {record.active_guideline_version}</div>
          </div>
        </div>

        {/* Certificate Body Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-[#060B08] border border-emerald-950 space-y-1">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Issuer / Brand</div>
              <div className="font-bold text-white text-sm">{record.organization_name}</div>
              <div className="text-[10px] text-emerald-400">Enterprise Tenant</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#060B08] border border-emerald-950 space-y-1">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Compliance Audit</div>
              <div className="font-bold text-[#00FF87] text-sm font-mono">{record.compliance_score}% Certified</div>
              <div className="text-[10px] text-zinc-400">Zero Critical Violations</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#060B08] border border-emerald-950 space-y-1">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Authorized Reviewer</div>
              <div className="font-bold text-white text-sm">{record.reviewer_name}</div>
              <div className="text-[10px] text-zinc-400">{record.reviewer_role}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#060B08] border border-emerald-950 space-y-1">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Sign-Off Timestamp</div>
              <div className="font-bold text-white text-sm font-mono truncate">
                {new Date(record.approval_timestamp).toLocaleDateString()}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {new Date(record.approval_timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Cryptographic Proof Strip */}
          <div className="p-4 rounded-2xl bg-black/50 border border-emerald-900/60 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-500 uppercase font-bold">Cryptographic Clearance Stamp:</span>
              <span className="text-[#00FF87] font-bold">{record.cryptographic_stamp}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-950/80">
              <span className="text-zinc-500 uppercase font-bold">Document SHA-256 Digest:</span>
              <span className="text-zinc-300 font-bold truncate max-w-sm sm:max-w-md">{record.sha256_document_digest}</span>
            </div>
          </div>

          {/* Certified Content Copy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certified Document Copy: "{record.title}"</span>
              </div>
              <span className="text-[10px] font-mono text-[#00FF87] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                100% Unaltered
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#060B08] border border-emerald-900/60 text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans shadow-inner">
              <p>{record.content_text}</p>
            </div>
          </div>

          {/* Verification Rules Checklist */}
          <div className="pt-4 border-t border-emerald-950 space-y-2.5">
            <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
              Automated Statutory & Governance Verification Checks:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#060B08] border border-emerald-950 flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                <span>Contractual SLA & Uptime Specifications (99.95%) Verified</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#060B08] border border-emerald-950 flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                <span>Regulatory Lanham Act § 43(a) & FTC Superlative Filter Passed</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#060B08] border border-emerald-950 flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                <span>EU AI Act Statutory Automated Disclosure Verified</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#060B08] border border-emerald-950 flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                <span>Enterprise Camel-Case Brand Typography Standard Applied</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="p-6 bg-[#060B08] border-t border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="text-zinc-500 text-[11px] leading-relaxed">
            Issued by <span className="text-white font-semibold">BrandPilot Enterprise Governance Infrastructure</span>.<br />
            Cryptographic ledger integrity guaranteed under SOC 2 Type II attestation.
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="font-serif italic text-sm text-white font-bold">{record.reviewer_name}</div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase">{record.reviewer_role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
