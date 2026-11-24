'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  Radar,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  ExternalLink,
  ShieldCheck,
  Send,
  Zap,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Filter,
  Check,
  Share2,
  Trash2,
  AlertOctagon,
  X
} from 'lucide-react';
import { SentinelMonitoredTarget, SentinelDriftIssue } from '@/lib/types';

export default function BrandSentinelPage() {
  const {
    currentWorkspace,
    sentinelTargets,
    sentinelDriftIssues,
    addSentinelTarget,
    runSentinelCrawl,
    resolveDriftIssue,
    dispatchSlackAlert,
    showToast
  } = useBrandPilot();

  const [filterCategory, setFilterCategory] = useState<'all' | 'website' | 'blog' | 'social'>('all');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<'website' | 'blog' | 'docs' | 'social'>('website');
  const [newFrequency, setNewFrequency] = useState<'1h' | '6h' | '24h' | 'weekly'>('6h');
  const [crawlingId, setCrawlingId] = useState<string | null>(null);

  // Filter targets
  const filteredTargets = sentinelTargets.filter(t => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  // Filter issues
  const relevantIssues = sentinelDriftIssues.filter(i => {
    if (!selectedTargetId) return true;
    return i.target_id === selectedTargetId;
  });

  const activeIssues = relevantIssues.filter(i => i.status === 'active');
  const resolvedIssues = relevantIssues.filter(i => i.status === 'resolved');

  // Overall Sentinel Health
  const totalDrift = sentinelDriftIssues.filter(i => i.status === 'active').length;
  const avgScore = Math.round(
    sentinelTargets.reduce((acc, t) => acc + t.compliance_score, 0) / (sentinelTargets.length || 1)
  );

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newLabel.trim()) {
      showToast('Please provide a valid URL and descriptive label.', 'error');
      return;
    }
    addSentinelTarget({
      url: newUrl.trim(),
      label: newLabel.trim(),
      category: newCategory,
      frequency: newFrequency
    });
    setNewUrl('');
    setNewLabel('');
    setIsAddModalOpen(false);
  };

  const handleCrawl = async (targetId: string) => {
    setCrawlingId(targetId);
    await runSentinelCrawl(targetId);
    setCrawlingId(null);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Radar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Continuous Public Brand Surveillance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Brand Sentinel 24/7 Monitor</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Live Crawler
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Automatically crawls your public website, landing pages, documentation, and social feeds 24/7. Catches outdated pricing, broken SLAs, and off-brand promises before customers or regulators notice.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl shadow-lg flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Monitored URL</span>
        </button>
      </div>

      {/* KPI Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Overall Public Brand Health */}
        <div className="bg-[#0A120E] rounded-2xl p-4 border border-emerald-950/80 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Public Brand Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{avgScore}%</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{sentinelTargets.length} public channels active</span>
          </div>
        </div>

        {/* KPI 2: Active Brand Drift Issues */}
        <div className="bg-[#0A120E] rounded-2xl p-4 border border-emerald-950/80 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Active Brand Drift</span>
            <AlertTriangle className={`w-4 h-4 ${totalDrift > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
          </div>
          <div className={`text-2xl font-black font-mono ${totalDrift > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {totalDrift}
          </div>
          <div className="text-[11px] text-zinc-400">
            {totalDrift > 0 ? 'Requires marketing remediation' : 'Zero public violations'}
          </div>
        </div>

        {/* KPI 3: Automated Cadence */}
        <div className="bg-[#0A120E] rounded-2xl p-4 border border-emerald-950/80 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Crawl Engine Cadence</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">Continuous</div>
          <div className="text-[11px] text-zinc-400 font-mono">
            Every 1h / 6h / 24h intervals
          </div>
        </div>

        {/* KPI 4: Slack & Incident Alerts */}
        <div className="bg-[#0A120E] rounded-2xl p-4 border border-emerald-950/80 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Escalation Channel</span>
            <Share2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-black text-white font-mono truncate">#brand-safety</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
            <span>Webhook active</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Monitored Targets) & Right (Drift Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (Col 7): Monitored Targets Roster */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-4">
          <div className="bg-[#0A120E] rounded-2xl p-4 border border-emerald-950/80 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Monitored Digital Channels ({filteredTargets.length})
                </h3>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 text-[10px]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'website', label: 'Website' },
                  { id: 'blog', label: 'Blog' },
                  { id: 'social', label: 'Social' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilterCategory(cat.id as any)}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                      filterCategory === cat.id
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'bg-[#060B08] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target List */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredTargets.map(target => {
                const isSelected = selectedTargetId === target.id;
                const isCrawling = crawlingId === target.id;

                return (
                  <div
                    key={target.id}
                    onClick={() => setSelectedTargetId(isSelected ? null : target.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500 shadow-lg'
                        : 'bg-[#060B08] border-emerald-950 hover:border-emerald-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{target.label}</h4>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            target.status === 'clean'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {target.status === 'clean' ? '100% On-Brand' : `${target.drift_count} Drift Detected`}
                          </span>
                        </div>
                        <a
                          href={target.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-[11px] text-zinc-400 hover:text-emerald-300 font-mono truncate flex items-center gap-1 mt-0.5"
                        >
                          <span>{target.url}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                        </a>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-white">
                            {target.compliance_score}%
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            Checked {target.last_checked}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleCrawl(target.id);
                          }}
                          disabled={isCrawling}
                          className="p-1.5 rounded-lg bg-[#0A120E] border border-emerald-900/60 hover:border-emerald-500 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          title="Run immediate live crawl"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isCrawling ? 'animate-spin text-emerald-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-emerald-950/60">
                      <span>Cadence: Every {target.check_frequency}</span>
                      <span className="text-emerald-400 font-semibold">
                        {isSelected ? 'Showing target issues below →' : 'Click to inspect issues'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT (Col 5): Detected Brand Drift Incident Feed */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-4">
          <div className="bg-[#0A120E] rounded-2xl p-4 border border-emerald-950/80 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Brand Drift Incident Feed ({activeIssues.length} active)
                </h3>
              </div>
              {selectedTargetId && (
                <button
                  type="button"
                  onClick={() => setSelectedTargetId(null)}
                  className="text-[11px] text-emerald-400 hover:underline font-bold"
                >
                  Show All Targets
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {activeIssues.length === 0 ? (
                <div className="p-8 text-center space-y-2 bg-[#060B08] rounded-xl border border-emerald-950">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-xs font-bold text-white">No Active Brand Drift</h4>
                  <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                    All monitored public channels conform to active corporate guidelines and legal standards.
                  </p>
                </div>
              ) : (
                activeIssues.map(issue => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-xl bg-[#060B08] border border-amber-950/80 space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        {issue.severity} Drift
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {new Date(issue.first_detected_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        Offending Public Copy:
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0A120E] border border-rose-950 text-xs font-mono text-rose-300 line-through">
                        "{issue.offending_text}"
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>Recommended Approved Fix:</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs font-mono text-emerald-200">
                        "{issue.suggested_fix}"
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-400">
                      <strong>Rule Violated:</strong> {issue.rule_violated}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-emerald-950/60">
                      <button
                        type="button"
                        onClick={() => dispatchSlackAlert(issue.id, '#brand-safety-escalations')}
                        className="px-2.5 py-1 rounded-lg bg-[#0A120E] border border-emerald-900/60 hover:border-emerald-500 text-zinc-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3 h-3 text-emerald-400" />
                        <span>Alert Slack</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => resolveDriftIssue(issue.id)}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-black rounded-lg shadow-sm flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark Resolved</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Monitored URL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0A120E] rounded-2xl border border-emerald-800 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Add Monitored Channel</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTarget} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Channel Label</label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  placeholder="e.g. Q4 Landing Page or Product Docs"
                  className="w-full text-xs p-2.5 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Public Target URL</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://auracloud.io/features"
                  className="w-full text-xs p-2.5 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="website">Website</option>
                    <option value="blog">Blog</option>
                    <option value="docs">Documentation</option>
                    <option value="social">Social Media</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Check Frequency</label>
                  <select
                    value={newFrequency}
                    onChange={e => setNewFrequency(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="1h">Every 1 hour</option>
                    <option value="6h">Every 6 hours</option>
                    <option value="24h">Daily (24h)</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-950">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black"
                >
                  Start Monitoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
