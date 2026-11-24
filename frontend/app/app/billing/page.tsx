'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Download,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
  Sliders,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Check,
  Lock
} from 'lucide-react';
import { BillingPlanTier, CommercialInvoice } from '@/lib/types';

export default function BillingPage() {
  const {
    currentWorkspace,
    billingPlan,
    updateBillingPlan,
    downloadInvoicePdf,
    showToast
  } = useBrandPilot();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isUpdateCardModalOpen, setIsUpdateCardModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [taxId, setTaxId] = useState('US-EIN 84-2910394');
  const [billingEmail, setBillingEmail] = useState('finance@auracloud.io');

  const plans: BillingPlanTier[] = [
    {
      id: 'starter',
      name: 'Starter Tier',
      price_monthly: 49,
      price_annual: 39,
      description: 'Essential automated brand governance for agile marketing & content teams.',
      features: [
        'Up to 250 monthly audits',
        '50 visual computer vision scans',
        '3 team member seats',
        '2 Brand Sentinel target URLs',
        'Standard deterministic rule checking',
        'Email incident notifications'
      ],
      audits_limit: 250,
      visual_scans_limit: 50,
      seats_limit: 3,
      sentinel_targets_limit: 2
    },
    {
      id: 'professional',
      name: 'Professional Scale',
      price_monthly: 199,
      price_annual: 159,
      description: 'Comprehensive multi-vector governance with multimodal audio and Slack dispatch.',
      features: [
        '1,000 monthly audits (overage $0.15/audit)',
        '250 visual design & logo checks',
        '10 team seats (Admin, Reviewer, Creator)',
        '10 Brand Sentinel monitored channels',
        'Speech & Audio Web Speech studio',
        'Real-time Slack & Teams Webhook bots',
        'Closed-loop CMS publishing gatekeeper'
      ],
      audits_limit: 1000,
      visual_scans_limit: 250,
      seats_limit: 10,
      sentinel_targets_limit: 10,
      is_popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Dedicated',
      price_monthly: 999,
      price_annual: 799,
      description: 'Full-stack enterprise compliance with SAML/SCIM SSO, DAM connectors, and SIEM streaming.',
      features: [
        'Unlimited monthly content audits',
        'Unlimited visual design checks',
        'Unlimited seats & custom role permissions',
        'SAML 2.0 & SCIM (Okta / Azure AD / Google)',
        'Direct AWS S3 & Google Drive DAM sync',
        'Tamper-evident SIEM export (Datadog/Splunk)',
        'Customer-Managed Keys (CMEK / BYOK)',
        '99.95% uptime SLA with dedicated TAM'
      ],
      audits_limit: 999999,
      visual_scans_limit: 999999,
      seats_limit: 999999,
      sentinel_targets_limit: 999999
    }
  ];

  const invoices: CommercialInvoice[] = [
    {
      id: 'INV-2026-011',
      invoice_number: 'BP-INV-2026-011',
      date: 'Nov 01, 2026',
      amount: billingCycle === 'annual' ? '$1,908.00' : '$199.00',
      status: 'Paid',
      plan_name: 'Professional Scale',
      pdf_url: '#'
    },
    {
      id: 'INV-2026-010',
      invoice_number: 'BP-INV-2026-010',
      date: 'Oct 01, 2026',
      amount: '$199.00',
      status: 'Paid',
      plan_name: 'Professional Scale',
      pdf_url: '#'
    },
    {
      id: 'INV-2026-009',
      invoice_number: 'BP-INV-2026-009',
      date: 'Sep 01, 2026',
      amount: '$199.00',
      status: 'Paid',
      plan_name: 'Professional Scale',
      pdf_url: '#'
    }
  ];

  const handleSaveBillingDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdateCardModalOpen(false);
    showToast('Payment method & corporate billing details updated in Stripe!', 'success');
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Commercial Subscription Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Billing, Quota & Enterprise Tiers</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Stripe Customer Portal
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Manage your organization's subscription tier, real-time audit quotas, payment methods, and downloadable VAT tax invoices.
          </p>
        </div>

        {/* Annual / Monthly Toggle */}
        <div className="flex items-center gap-2 bg-[#0A120E] p-1.5 rounded-xl border border-emerald-950 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-emerald-500 text-black shadow-sm font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-emerald-500 text-black shadow-sm font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Annual</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isCurrent = billingPlan === plan.id;
          const price = billingCycle === 'annual' ? plan.price_annual : plan.price_monthly;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-6 ${
                isCurrent
                  ? 'bg-gradient-to-b from-[#0F1E14] to-[#0A120E] border-emerald-500 shadow-xl shadow-emerald-950/40 relative'
                  : 'bg-[#0A120E] border-emerald-950/80 hover:border-emerald-800'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                  Most Popular for SaaS Teams
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white">{plan.name}</h3>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                      Current Plan
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 min-h-[36px]">{plan.description}</p>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white font-mono">${price}</span>
                    <span className="text-xs text-zinc-400">/ month</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    {billingCycle === 'annual' ? 'Billed annually ($' + price * 12 + '/yr)' : 'Billed monthly'}
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-emerald-950/60">
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Included Capabilities:
                  </div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {isCurrent ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-700 text-xs font-bold cursor-default flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Active Subscription</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateBillingPlan(plan.id)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Switch to {plan.name}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-Time Consumption & Quota Meters */}
      <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Enterprise Usage Meters</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Billing cycle resets in 14 days (December 01, 2026)</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            Active Tier: Professional
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Meter 1: Content Audits */}
          <div className="p-4 bg-[#060B08] rounded-xl border border-emerald-950 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Monthly Audits</span>
              <span className="font-mono text-zinc-400">342 / 1,000</span>
            </div>
            <div className="h-2 bg-[#0A120E] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '34.2%' }} />
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">34.2% consumed • 658 remaining</div>
          </div>

          {/* Meter 2: Visual Inspections */}
          <div className="p-4 bg-[#060B08] rounded-xl border border-emerald-950 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Visual Design Scans</span>
              <span className="font-mono text-zinc-400">89 / 250</span>
            </div>
            <div className="h-2 bg-[#0A120E] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '35.6%' }} />
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">35.6% consumed • 161 remaining</div>
          </div>

          {/* Meter 3: Team Seats */}
          <div className="p-4 bg-[#060B08] rounded-xl border border-emerald-950 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Active Team Seats</span>
              <span className="font-mono text-zinc-400">3 / 10</span>
            </div>
            <div className="h-2 bg-[#0A120E] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '30%' }} />
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">3 assigned • 7 available seats</div>
          </div>

          {/* Meter 4: Sentinel Targets */}
          <div className="p-4 bg-[#060B08] rounded-xl border border-emerald-950 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Brand Sentinel URLs</span>
              <span className="font-mono text-zinc-400">4 / 10</span>
            </div>
            <div className="h-2 bg-[#0A120E] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '40%' }} />
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">4 monitored • 6 slots left</div>
          </div>
        </div>
      </div>

      {/* Payment Method & Invoices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Payment Method Card */}
        <div className="lg:col-span-5 bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Payment Method & Corporate Tax ID
            </h3>
            <button
              type="button"
              onClick={() => setIsUpdateCardModalOpen(true)}
              className="text-xs text-emerald-400 hover:underline font-bold"
            >
              Update
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#060B08] border border-emerald-950 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded bg-blue-950 border border-blue-800 flex items-center justify-center text-xs font-bold text-blue-300">
                  VISA
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-mono">{cardNumber}</div>
                  <div className="text-[10px] text-zinc-400">Expires {cardExp}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-[#00FF87] border border-emerald-800">
                Primary
              </span>
            </div>

            <div className="pt-2 border-t border-emerald-950/60 text-xs text-zinc-400 space-y-1">
              <div className="flex justify-between">
                <span>Billing Contact:</span>
                <strong className="text-white font-mono">{billingEmail}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tax ID / VAT:</span>
                <strong className="text-white font-mono">{taxId}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice History Table */}
        <div className="lg:col-span-7 bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Tax Invoices & Receipts</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">{invoices.length} invoices</span>
          </div>

          <div className="divide-y divide-emerald-950/60">
            {invoices.map(inv => (
              <div key={inv.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white font-mono">{inv.invoice_number}</div>
                  <div className="text-[11px] text-zinc-400">{inv.date} • {inv.plan_name}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono font-bold text-white">{inv.amount}</div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                      {inv.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadInvoicePdf(inv.id)}
                    className="p-1.5 rounded-lg bg-[#060B08] border border-emerald-900/60 hover:border-emerald-500 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Download PDF invoice"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Update Payment Card */}
      {isUpdateCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0A120E] rounded-2xl border border-emerald-800 shadow-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-emerald-950">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Update Corporate Payment Method</span>
            </h3>

            <form onSubmit={handleSaveBillingDetails} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Card Number</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full p-2.5 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Expiration</label>
                  <input
                    type="text"
                    required
                    value={cardExp}
                    onChange={e => setCardExp(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full p-2.5 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">CVC</label>
                  <input
                    type="password"
                    required
                    defaultValue="842"
                    className="w-full p-2.5 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Billing Email (Invoices)</label>
                <input
                  type="email"
                  required
                  value={billingEmail}
                  onChange={e => setBillingEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Tax ID / VAT Registration</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={e => setTaxId(e.target.value)}
                  className="w-full p-2.5 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-950">
                <button
                  type="button"
                  onClick={() => setIsUpdateCardModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black"
                >
                  Save in Stripe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
