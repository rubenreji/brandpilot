'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBrandPilot } from '@/lib/store';
import {
  Building2,
  Palette,
  FileText,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  ShieldCheck
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding, currentWorkspace } = useBrandPilot();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    orgName: currentWorkspace.name || 'AuraCloud Technologies',
    industry: currentWorkspace.industry || 'Enterprise Cloud & Cybersecurity',
    website: currentWorkspace.website_url || 'https://auracloud.io',
    brandName: currentWorkspace.brand_name || 'AuraCloud',
    primaryColor: currentWorkspace.primary_color || '#050806',
    secondaryColor: currentWorkspace.secondary_color || '#0A120E',
    accentColor: currentWorkspace.accent_color || '#10B981',
    guidelineDocName: 'Master_Brand_Manual_v2.4.pdf',
    inviteEmails: 'sarah.lin@auracloud.io, marcus.vance@auracloud.io'
  });

  const nextStep = () => setStep(prev => Math.min(4, prev + 1));
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  const handleFinish = () => {
    completeOnboarding({
      brandName: formData.brandName || formData.orgName,
      industry: formData.industry,
      website: formData.website,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      accentColor: formData.accentColor,
      guidelineDocName: formData.guidelineDocName,
      inviteEmails: formData.inviteEmails
    });
    router.push('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050806] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-black font-black flex items-center justify-center text-sm shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              BP
            </div>
            <span className="font-black text-lg text-white">BrandPilot Workspace Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {step === 1 && 'Organization Profile'}
            {step === 2 && 'Brand Identity & Color Tokens'}
            {step === 3 && 'Initial Guidelines & Governance Rules'}
            {step === 4 && 'Invite Content & Review Team'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Step {step} of 4</p>

          {/* Stepper bar */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-12 bg-emerald-400 shadow-[0_0_10px_rgba(0,255,135,0.7)]' : s < step ? 'w-8 bg-emerald-700' : 'w-8 bg-[#0A120E] border border-emerald-950'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-[#0A120E] rounded-2xl p-6 sm:p-8 shadow-2xl border border-emerald-950/80">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Organization Legal Name</label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={e => setFormData({ ...formData, orgName: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-emerald-900/60 bg-[#060B08] text-zinc-100 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Industry / Sector</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-emerald-900/60 bg-[#060B08] text-zinc-100 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Company Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-emerald-900/60 bg-[#060B08] text-zinc-100 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Public Brand Name</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-emerald-900/60 bg-[#060B08] text-zinc-100 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Primary Base</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-emerald-900/60 bg-[#060B08] cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      readOnly
                      className="text-xs font-mono w-full px-2 py-1.5 border border-emerald-950 bg-[#060B08] text-zinc-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Elevated Card</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-emerald-900/60 bg-[#060B08] cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      readOnly
                      className="text-xs font-mono w-full px-2 py-1.5 border border-emerald-950 bg-[#060B08] text-zinc-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Neon Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-emerald-900/60 bg-[#060B08] cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={formData.accentColor}
                      readOnly
                      className="text-xs font-mono w-full px-2 py-1.5 border border-emerald-950 bg-[#060B08] text-zinc-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Upload Master Brand Guideline (PDF, DOCX)
              </label>
              <div className="border-2 border-dashed border-emerald-900/60 rounded-2xl p-6 text-center hover:border-emerald-500 bg-[#060B08] transition-colors">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">{formData.guidelineDocName}</p>
                <p className="text-xs text-zinc-400 mt-1">Pre-loaded demo file ready for vector indexing</p>
                <span className="inline-block mt-3 px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-xs font-bold rounded-full">
                  ✓ 18 policy chunks extracted
                </span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Invite Team Members (Comma-separated emails)
                </label>
                <textarea
                  rows={3}
                  value={formData.inviteEmails}
                  onChange={e => setFormData({ ...formData, inviteEmails: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-emerald-900/60 bg-[#060B08] text-zinc-100 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#060B08] border border-emerald-950 text-xs text-zinc-300 leading-relaxed">
                <span className="font-bold text-emerald-400 block mb-1">Pre-configured Role Assignments:</span>
                • Sarah Lin (Reviewer) — Brand Governance Manager
                <br />
                • Marcus Vance (Creator) — Content & Product Marketing
              </div>
            </div>
          )}

          {/* Stepper controls */}
          <div className="mt-8 pt-4 border-t border-emerald-950 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
              >
                <span>Launch BrandPilot Workspace</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
