'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBrandPilot } from '@/lib/store';
import { UserRole } from '@/lib/types';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  History,
  BarChart3,
  Palette,
  Users,
  Settings,
  Bell,
  CheckCircle2,
  ChevronDown,
  Building2,
  ExternalLink,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    currentWorkspace,
    notifications,
    markNotificationRead,
    submissions,
    logoutUser,
    showToast
  } = useBrandPilot();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Review queue badge count
  const pendingApprovalsCount = submissions.filter(s => s.status === 'in_review' || s.status === 'pending_review').length;

  // Latest active submission or fallback to demo
  const latestSubmissionId = submissions && submissions.length > 0 ? submissions[0].id : 'sub-demo-flagged';

  const navItems = [
    { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Brand Knowledge Base', href: '/app/knowledge', icon: BookOpen },
    { label: 'Content Auditing', href: '/app/audit', icon: FileCheck2 },
    {
      label: 'Correction Studio',
      href: `/app/corrections/${latestSubmissionId}`,
      icon: Sparkles,
      badge: latestSubmissionId === 'sub-demo-flagged' ? 'Demo' : 'Active'
    },
    {
      label: 'Approval Centre',
      href: '/app/approvals',
      icon: ShieldCheck,
      badgeCount: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined
    },
    { label: 'Revisions & History', href: '/app/history', icon: History },
    { label: 'Governance Analytics', href: '/app/analytics', icon: BarChart3 },
    { label: 'Visual Identity', href: '/app/visual', icon: Palette },
    { label: 'Team & Roles', href: '/app/team', icon: Users },
    { label: 'Settings', href: '/app/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col antialiased">
      {/* Top Banner: Strict Human Governance Principle */}
      <div className="bg-[#101827] text-xs text-slate-300 px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-200">BrandPilot Governance Engine</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            Deterministic Rule Checking + Semantic Vector RAG + Human-in-the-Loop Sign-off
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-medium hidden md:inline">
            Strict Policy: AI cannot independently publish content
          </span>
          <Link
            href="/"
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            Landing Page <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Brand */}
          <Link href="/app/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#101827] to-[#19263A] flex items-center justify-center text-white font-bold text-lg shadow-sm border border-slate-700/50 group-hover:scale-105 transition-transform">
              <span className="text-[#3978E8] font-black mr-0.5">B</span>P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-base tracking-tight">BrandPilot</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">AI-Assisted Brand Governance</p>
            </div>
          </Link>

          {/* Workspace Pill */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 ml-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentWorkspace.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </div>

        {/* Right Controls: Persona Switcher & User Profile */}
        <div className="flex items-center gap-3">
          {/* Interactive Persona Switcher (CRITICAL REQUIREMENT) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-[11px] text-slate-500 px-2 font-medium hidden sm:inline">Persona:</span>
            {(['admin', 'reviewer', 'creator'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                  currentRole === role
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/70 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={`Switch to ${role} view with appropriate permissions`}
              >
                {role === 'admin' ? 'Admin' : role === 'reviewer' ? 'Reviewer' : 'Creator'}
              </button>
            ))}
          </div>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800">Notifications ({notifications.length})</span>
                  <span className="text-[11px] text-slate-500">Real-time governance alerts</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                        !n.is_read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">{n.title}</span>
                        {!n.is_read && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1"></span>}
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400">
                        <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {n.link && (
                          <Link href={n.link} className="text-blue-600 hover:underline font-medium">
                            View details →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Interactive Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                {(currentUser.full_name || currentUser.name || 'User')
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.full_name || currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">{currentRole}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1.5 text-xs">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">{currentUser.full_name || currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {currentRole}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate">
                      {currentWorkspace.name}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/app/team"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Team & Members</span>
                  </Link>
                  <Link
                    href="/app/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Workspace Settings</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <Link
                    href="/login"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logoutUser();
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-[#101827] text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-transform lg:translate-x-0 ${
            mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 translate-x-0' : 'hidden lg:flex'
          }`}
        >
          {/* Top of Sidebar */}
          <div className="py-4">
            <div className="px-4 pb-3 mb-2 border-b border-slate-800/80">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Workspace Navigation
              </span>
            </div>

            <nav className="space-y-1 px-2.5">
              {navItems.map(item => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/app/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#3978E8] text-white shadow-xs font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/40">
                        {item.badge}
                      </span>
                    )}

                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-900">
                        {item.badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom of Sidebar: Brand Info & Status */}
          <div className="p-3 m-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-300">AuraCloud Guidelines</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono">
                v2.4 Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enforcing 18 terminology rules, 8 approved corporate facts, and 4 brand voice dimensions.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>Security: RLS & pgvector</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified
              </span>
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#F6F8FC]">
          {children}
        </main>
      </div>
    </div>
  );
}
