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
  X,
  Check,
  RotateCcw,
  Layers,
  Mic
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const {
    currentRole,
    currentUser,
    currentWorkspace,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    switchAccount,
    submissions,
    logoutUser,
    resetAllTrackers,
    allBrandBases,
    switchWorkspace,
    dbSyncStatus,
    isSupabaseActive
  } = useBrandPilot();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  // Account-specific notifications strictly scoped to active user
  const userNotifications = notifications.filter(n => n.user_id === currentUser.id);
  const unreadCount = userNotifications.filter(n => !n.is_read).length;

  // Review queue badge count
  const pendingApprovalsCount = submissions.filter(s => s.status === 'in_review' || s.status === 'pending_review').length;

  // Latest active submission
  const latestSubmissionId = submissions && submissions.length > 0 ? submissions[0].id : 'live';

  const navItems = [
    { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Brand Knowledge Base', href: '/app/knowledge', icon: BookOpen },
    { label: 'Content Auditing', href: '/app/audit', icon: FileCheck2 },
    {
      label: 'Correction Studio',
      href: `/app/corrections/${latestSubmissionId}`,
      icon: Sparkles,
      badge: 'Live'
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
    { label: 'In-Situ Studio (Figma/Web)', href: '/app/insitu', icon: Layers, badge: 'New' },
    { label: 'Multimodal Audio/Video', href: '/app/multimodal', icon: Mic, badge: 'New' },
    { label: 'Team & Roles', href: '/app/team', icon: Users },
    { label: 'Settings', href: '/app/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#050806] text-zinc-100 flex flex-col antialiased">
      {/* Top Banner: Strict Human Governance Principle */}
      <div className="bg-[#020403] text-xs text-zinc-400 px-4 py-1.5 flex items-center justify-between border-b border-emerald-950/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF87]"></span>
          </span>
          <span className="font-semibold text-emerald-400">BrandPilot Governance Engine</span>
          <span className="text-emerald-900 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline">
            Deterministic Rule Checking + Semantic Vector RAG + Human-in-the-Loop Sign-off
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 hidden sm:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse"></span>
            <span className="font-semibold">Supabase DB: Persistent ({dbSyncStatus.toUpperCase()})</span>
          </div>
          <span className="text-amber-400 font-medium hidden md:inline">
            Strict Policy: AI cannot independently publish content
          </span>
          <Link
            href="/"
            className="text-zinc-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            Landing Page <ExternalLink className="w-3 h-3 text-emerald-400" />
          </Link>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="h-16 bg-[#0A110D]/95 backdrop-blur-md border-b border-emerald-950 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-emerald-950/50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Brand */}
          <Link href="/app/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#050806] flex items-center justify-center text-white font-bold text-lg shadow-sm border border-emerald-500/40 group-hover:scale-105 group-hover:border-emerald-400 transition-all shadow-[0_0_12px_rgba(0,255,135,0.15)]">
              <span className="text-[#00FF87] font-black mr-0.5">B</span>P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight">BrandPilot</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">AI-Assisted Brand Governance</p>
            </div>
          </Link>

          {/* Interactive Brand Base Workspace Switcher */}
          <div className="relative hidden md:block pl-4 border-l border-emerald-950 ml-2">
            <button
              type="button"
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1712] hover:bg-emerald-950/60 border border-emerald-900/50 hover:border-emerald-500/50 text-xs font-medium text-emerald-200 transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-white max-w-[130px] truncate">{currentWorkspace.name}</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-950 text-[#00FF87] border border-emerald-800">
                12 Bases
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {workspaceMenuOpen && (
              <div className="absolute left-4 mt-2 w-80 rounded-2xl bg-[#0A120E] border border-emerald-800 shadow-2xl z-50 p-2 space-y-1 max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-emerald-950 flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-emerald-400 text-[10px]">
                    Switch Brand Base
                  </span>
                  <span className="text-zinc-500 text-[10px] font-mono">12 Pre-Seeded Brands</span>
                </div>
                {allBrandBases.map(b => (
                  <button
                    key={b.workspace.id}
                    type="button"
                    onClick={() => {
                      switchWorkspace(b.workspace.id);
                      setWorkspaceMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer text-xs ${
                      currentWorkspace.id === b.workspace.id
                        ? 'bg-emerald-950/80 border border-emerald-500/50 text-white'
                        : 'hover:bg-[#060B08] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{b.icon}</span>
                      <div>
                        <div className="font-bold text-white text-xs">{b.workspace.name}</div>
                        <div className="text-[10px] text-zinc-400">{b.badge}</div>
                      </div>
                    </div>
                    {currentWorkspace.id === b.workspace.id && (
                      <Check className="w-4 h-4 text-[#00FF87] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Controls: Account Switcher, Notifications & User Profile */}
        <div className="flex items-center gap-3">
          {/* Account Manager Switcher */}
          <div className="flex items-center bg-[#050806] p-0.5 rounded-xl border border-emerald-900/50 text-xs">
            <span className="text-[11px] text-emerald-400/80 px-2 font-medium hidden sm:inline flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>Account:</span>
            </span>
            {[
              { id: 'user-admin-1', role: 'admin', label: 'Admin (Ruben)' },
              { id: 'user-reviewer-1', role: 'reviewer', label: 'Reviewer (Sarah)' },
              { id: 'user-creator-1', role: 'creator', label: 'Creator (Marcus)' }
            ].map(acc => {
              const isActive = currentUser.id === acc.id || currentRole === acc.role;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => switchAccount(acc.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-xs ${
                    isActive
                      ? 'bg-emerald-500 text-black font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'text-zinc-400 hover:text-white hover:bg-emerald-950/50'
                  }`}
                  title={`Switch active account to ${acc.label}`}
                >
                  {acc.label}
                </button>
              );
            })}
          </div>

          {/* Notification Bell with Account-Specific Filtered Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-zinc-400 hover:text-emerald-300 rounded-lg hover:bg-emerald-950/50 transition-colors cursor-pointer"
              title={`Notifications for ${currentUser.name} (${unreadCount} unread)`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0A120E] rounded-2xl shadow-2xl border border-emerald-900/60 z-50 overflow-hidden animate-scale-in">
                <div className="p-3.5 bg-[#060B08] border-b border-emerald-900/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span>Notifications</span>
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {unreadCount} unread
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      Inbox for {currentUser.full_name || currentUser.name} ({currentRole})
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllNotificationsRead(currentUser.id)}
                      className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-emerald-950/40">
                  {userNotifications.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-950/60 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-900/40">
                        <Bell className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-xs font-semibold text-zinc-200">No alerts for this account</div>
                      <p className="text-[11px] text-zinc-500 max-w-[200px] mx-auto">
                        All notifications addressed to {currentUser.name} have been read.
                      </p>
                    </div>
                  ) : (
                    userNotifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 text-xs cursor-pointer hover:bg-emerald-950/40 transition-colors ${
                          !n.is_read ? 'bg-emerald-950/20 border-l-2 border-emerald-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-semibold ${!n.is_read ? 'text-white' : 'text-zinc-300'}`}>
                            {n.title}
                          </span>
                          {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#00FF87] mt-1 shrink-0 shadow-[0_0_6px_#00FF87]"></span>}
                        </div>
                        <p className="text-zinc-400 mt-1 leading-relaxed text-[11px]">{n.message}</p>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-emerald-950/40 text-[10px] text-zinc-500">
                          <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {n.link && (
                            <Link href={n.link} className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold">
                              Open link →
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Account Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 pl-2 border-l border-emerald-950 hover:opacity-80 transition-opacity cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                {(currentUser.full_name || currentUser.name || 'User')
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-zinc-200 leading-tight">
                  {currentUser.full_name || currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-400/80 capitalize">{currentRole}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-500 hidden lg:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0A120E] rounded-2xl shadow-2xl border border-emerald-900/60 z-50 overflow-hidden py-1.5 text-xs animate-scale-in">
                <div className="px-3.5 py-2.5 border-b border-emerald-950">
                  <div className="font-bold text-white">{currentUser.full_name || currentUser.name}</div>
                  <div className="text-[11px] text-zinc-400 truncate">{currentUser.email}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {currentRole}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium truncate">
                      {currentWorkspace.name}
                    </span>
                  </div>
                </div>

                {/* Account Manager: Persona Switcher */}
                <div className="p-2 border-b border-emerald-950 bg-[#060B08]">
                  <div className="text-[10px] uppercase font-bold text-emerald-400/70 px-2 py-1 tracking-wider">
                    Switch Account Persona
                  </div>
                  {[
                    { id: 'user-admin-1', name: 'Ruben John Reji', role: 'admin', desc: 'Admin & System Owner' },
                    { id: 'user-reviewer-1', name: 'Sarah Lin', role: 'reviewer', desc: 'Brand Reviewer & Sign-off' },
                    { id: 'user-creator-1', name: 'Marcus Vance', role: 'creator', desc: 'Content Creator & Drafts' }
                  ].map(acc => {
                    const isSelected = currentUser.id === acc.id || currentRole === acc.role;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          switchAccount(acc.id);
                          setUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected ? 'bg-emerald-950/70 text-emerald-300 font-semibold border border-emerald-500/40' : 'hover:bg-emerald-950/30 text-zinc-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{acc.name}</div>
                          <div className="text-[10px] text-zinc-400 capitalize">{acc.desc}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="py-1">
                  <Link
                    href="/app/team"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:bg-emerald-950/40 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Team & Members</span>
                  </Link>
                  <Link
                    href="/app/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:bg-emerald-950/40 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Workspace Settings</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      resetAllTrackers();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-emerald-400 hover:bg-emerald-950/40 transition-colors font-medium cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reset Trackers to Zero</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-emerald-950">
                  <Link
                    href="/login"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logoutUser();
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 text-rose-400 hover:bg-rose-950/40 transition-colors font-medium"
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
      <div className="flex-1 flex overflow-hidden relative w-full">
        {/* Mobile menu backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`w-64 bg-[#070D09] text-zinc-300 border-r border-emerald-950/80 flex flex-col justify-between shrink-0 transition-transform lg:translate-x-0 ${
            mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 translate-x-0' : 'hidden lg:flex'
          }`}
        >
          {/* Top of Sidebar */}
          <div className="py-4">
            <div className="px-4 pb-3 mb-2 border-b border-emerald-950/80">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400/80">
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
                        ? 'bg-emerald-500 text-black shadow-md font-extrabold shadow-[0_0_14px_rgba(16,185,129,0.35)]'
                        : 'text-zinc-300 hover:text-white hover:bg-emerald-950/40 hover:border-emerald-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-black font-extrabold' : 'text-emerald-400/70'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        {item.badge}
                      </span>
                    )}

                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-400 text-black shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                        {item.badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom of Sidebar: Brand Info & Status */}
          <div className="p-3 m-3 rounded-xl bg-[#040705] border border-emerald-900/40 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-zinc-300">AuraCloud Guidelines</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded font-mono">
                v2.4 Active
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Enforcing 18 terminology rules, 8 approved corporate facts, and 4 brand voice dimensions.
            </p>
            <div className="mt-2.5 pt-2 border-t border-emerald-950 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Security: RLS & pgvector</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] shadow-[0_0_6px_#00FF87]"></span> Verified
              </span>
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 w-full bg-[#050806] text-zinc-100">
          {children}
        </main>
      </div>
    </div>
  );
}
