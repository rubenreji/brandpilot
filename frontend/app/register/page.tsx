'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBrandPilot } from '@/lib/store';
import { ShieldCheck, Mail, Lock, Building2, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useBrandPilot();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    orgName: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.workEmail || !formData.orgName) return;
    setLoading(true);
    await registerUser({
      fullName: formData.fullName,
      email: formData.workEmail,
      orgName: formData.orgName,
      password: formData.password
    });
    setLoading(false);
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#050806] text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#040705] flex items-center justify-center text-white font-bold text-xl shadow-md border border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,135,0.2)]">
            <span className="text-[#00FF87] font-black mr-0.5">B</span>P
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">BrandPilot</span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
          Create an enterprise workspace
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0A120E] py-8 px-6 shadow-2xl border border-emerald-900/60 rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-zinc-300">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400/70">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-[#050806] border border-emerald-900/60 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300">Work Email</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400/70">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.workEmail}
                  onChange={e => setFormData({ ...formData, workEmail: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-[#050806] border border-emerald-900/60 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300">Organization Name</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400/70">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Global Technologies"
                  value={formData.orgName}
                  onChange={e => setFormData({ ...formData, orgName: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-[#050806] border border-emerald-900/60 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300">Create Password</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400/70">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-[#050806] border border-emerald-900/60 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-lg text-sm font-extrabold text-black bg-emerald-500 hover:bg-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all cursor-pointer shadow-[0_0_16px_rgba(16,185,129,0.35)]"
            >
              <span>{loading ? 'Setting up...' : 'Continue to Workspace Onboarding'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
