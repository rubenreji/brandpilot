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
  Upload
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
    primaryColor: currentWorkspace.primary_color || '#101827',
    secondaryColor: currentWorkspace.secondary_color || '#19263A',
    accentColor: currentWorkspace.accent_color || '#3978E8',
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
    <div className="min-h-screen bg-[#F6F8FC] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#101827] text-white font-bold flex items-center justify-center text-sm">
              BP
            </div>
            <span className="font-bold text-lg text-slate-900">BrandPilot Onboarding</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {step === 1 && 'Organization Profile'}
            {step === 2 && 'Brand Identity & Color Tokens'}
            {step === 3 && 'Initial Guidelines & Governance Rules'}
            {step === 4 && 'Invite Content & Review Team'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step {step} of 4</p>

          {/* Stepper bar */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-12 bg-[#3978E8]' : s < step ? 'w-8 bg-emerald-500' : 'w-8 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Organization Legal Name</label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={e => setFormData({ ...formData, orgName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Industry / Sector</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Company Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Public Brand Name</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Primary Navy</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      readOnly
                      className="text-xs font-mono w-full px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Secondary</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      readOnly
                      className="text-xs font-mono w-full px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Accent Blue</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={formData.accentColor}
                      readOnly
                      className="text-xs font-mono w-full px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700">
                Upload Master Brand Guideline (PDF, DOCX)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 bg-slate-50 transition-colors">
                <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-900">{formData.guidelineDocName}</p>
                <p className="text-xs text-slate-500 mt-1">Pre-loaded demo file ready for vector indexing</p>
                <span className="inline-block mt-3 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                  ✓ 18 policy chunks extracted
                </span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Invite Team Members (Comma-separated emails)
                </label>
                <textarea
                  rows={3}
                  value={formData.inviteEmails}
                  onChange={e => setFormData({ ...formData, inviteEmails: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80 text-xs text-blue-900 leading-relaxed">
                <span className="font-semibold block mb-1">Pre-configured Role Assignments:</span>
                • Sarah Lin (Reviewer) — Brand Governance Manager
                <br />
                • Marcus Vance (Creator) — Content & Product Marketing
              </div>
            </div>
          )}

          {/* Stepper controls */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
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
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#101827] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-[#3978E8] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 shadow-sm"
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
