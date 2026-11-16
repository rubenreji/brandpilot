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
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#101827] flex items-center justify-center text-white font-bold text-xl shadow-md border border-slate-700">
            <span className="text-[#3978E8] font-black mr-0.5">B</span>P
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">BrandPilot</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your organization
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Or{' '}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
            create a new enterprise workspace
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Work Email</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#101827] hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </button>
          </form>

          {/* Quick Demo Persona Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Quick One-Click Demo Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole('admin')}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs font-medium text-slate-800 transition-all text-center"
              >
                <div className="font-bold text-slate-900">Admin</div>
                <div className="text-[10px] text-slate-500">Ruben R.</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('reviewer')}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs font-medium text-slate-800 transition-all text-center"
              >
                <div className="font-bold text-slate-900">Reviewer</div>
                <div className="text-[10px] text-slate-500">Sarah L.</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('creator')}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs font-medium text-slate-800 transition-all text-center"
              >
                <div className="font-bold text-slate-900">Creator</div>
                <div className="text-[10px] text-slate-500">Marcus V.</div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secured with Supabase Auth & Row Level Security</span>
        </div>
      </div>
    </div>
  );
}
