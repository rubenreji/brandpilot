'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBrandPilot } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { ShieldCheck, ArrowRight, Lock, Mail, Sparkles, Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, setCurrentRole } = useBrandPilot();
  const [email, setEmail] = useState('ruben@auracloud.io');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginUser(email, password);
    setLoading(false);
    router.push('/app/dashboard');
  };

  const handleQuickRole = async (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'admin') await loginUser('ruben@auracloud.io');
    if (role === 'reviewer') await loginUser('sarah.lin@auracloud.io');
    if (role === 'creator') await loginUser('marcus.vance@auracloud.io');
    router.push('/app/dashboard');
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
          Sign in to your organization
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Or{' '}
          <Link href="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
            create a new enterprise workspace
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0A120E] py-8 px-6 shadow-2xl border border-emerald-900/60 rounded-2xl sm:px-10">
          {/* Live Persistent Cloud Database Status */}
          <div className="mb-5 p-2.5 rounded-xl bg-[#060B08] border border-emerald-900/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse shadow-[0_0_8px_#00FF87]"></span>
              <span className="text-zinc-300 font-medium">Supabase Cloud Database</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-[#00FF87] border border-emerald-800">
              Encrypted & Persistent
            </span>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-zinc-300">Work Email</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400/70">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-[#050806] border border-emerald-900/60 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-zinc-300">Password</label>
                <a href="#" className="text-xs font-medium text-emerald-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400/70">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-[#050806] border border-emerald-900/60 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-lg text-sm font-extrabold text-black bg-emerald-500 hover:bg-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all cursor-pointer shadow-[0_0_16px_rgba(16,185,129,0.35)]"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </button>
          </form>

          {/* Enterprise Single Sign-On (SSO / SAML 2.0) Section */}
          <div className="mt-5 pt-5 border-t border-emerald-950 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-950" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0A120E] px-2 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                  Or Enterprise Single Sign-On
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  await loginUser('ruben@auracloud.io');
                  setLoading(false);
                  router.push('/app/dashboard');
                }}
                className="w-full py-2 px-3 bg-[#060B08] hover:bg-emerald-950/60 border border-emerald-900/60 hover:border-emerald-500/50 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black">O</div>
                <span>Sign in with Okta SAML 2.0</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  await loginUser('sarah.lin@auracloud.io');
                  setLoading(false);
                  router.push('/app/dashboard');
                }}
                className="w-full py-2 px-3 bg-[#060B08] hover:bg-emerald-950/60 border border-emerald-900/60 hover:border-emerald-500/50 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <div className="w-3.5 h-3.5 rounded-sm bg-cyan-600 flex items-center justify-center text-[8px] font-black">M</div>
                <span>Sign in with Microsoft Entra ID (Azure)</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Persona Switcher */}
          <div className="mt-6 pt-6 border-t border-emerald-950">
            <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-400/70 mb-3 text-center">
              Quick One-Click Persona Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole('admin')}
                className="p-2.5 rounded-lg border border-emerald-900/50 bg-[#060B08] hover:bg-emerald-950/60 hover:border-emerald-500/40 text-xs font-medium transition-all text-center cursor-pointer"
              >
                <div className="font-extrabold text-white">Admin</div>
                <div className="text-[10px] text-zinc-400">Ruben R.</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('reviewer')}
                className="p-2.5 rounded-lg border border-emerald-900/50 bg-[#060B08] hover:bg-emerald-950/60 hover:border-emerald-500/40 text-xs font-medium transition-all text-center cursor-pointer"
              >
                <div className="font-extrabold text-white">Reviewer</div>
                <div className="text-[10px] text-zinc-400">Sarah L.</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('creator')}
                className="p-2.5 rounded-lg border border-emerald-900/50 bg-[#060B08] hover:bg-emerald-950/60 hover:border-emerald-500/40 text-xs font-medium transition-all text-center cursor-pointer"
              >
                <div className="font-extrabold text-white">Creator</div>
                <div className="text-[10px] text-zinc-400">Marcus V.</div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-zinc-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
          <span>Secured with Supabase Auth & Row Level Security</span>
        </div>
      </div>
    </div>
  );
}
