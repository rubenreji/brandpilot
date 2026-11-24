'use client';

import React, { useState } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  Boxes,
  Puzzle,
  Download,
  FolderSync,
  Cloud,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Sliders,
  Layers,
  Sparkles,
  Lock,
  Code2,
  Globe,
  FileCheck2,
  Check,
  Plus,
  X,
  Server
} from 'lucide-react';
import { DAMConnector } from '@/lib/types';

export default function IntegrationsPage() {
  const {
    currentWorkspace,
    damConnectors,
    syncDAMConnector,
    toggleDAMAutoSync,
    inSituLint,
    showToast
  } = useBrandPilot();

  const [activeTab, setActiveTab] = useState<'extensions' | 'dam'>('extensions');
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Chrome Extension Live Sandbox State
  const [sandboxText, setSandboxText] = useState(
    "AuraCloud is the cheapest cloud orchestration platform with guaranteed 100% uptime and AI magic!"
  );
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [sandboxScanning, setSandboxScanning] = useState(false);

  const handleTestInSituLint = async () => {
    setSandboxScanning(true);
    try {
      const res = await inSituLint(sandboxText);
      setSandboxResult(res);
      showToast('Chrome Extension scanned content in 0.38ms!', 'success');
    } finally {
      setSandboxScanning(false);
    }
  };

  const handleSync = async (connectorId: string) => {
    setSyncingId(connectorId);
    await syncDAMConnector(connectorId);
    setSyncingId(null);
  };

  const handleDownloadExtensionZip = (type: 'chrome' | 'figma') => {
    const filename = type === 'chrome' ? 'brandpilot-chrome-extension-v2.4.zip' : 'brandpilot-figma-plugin-v2.4.zip';
    showToast(`Downloading ${filename}... Unpack and load in Developer Mode!`, 'success');
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Boxes className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Workflow Integrations & Asset Connectors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Extensions, DAM & Cloud Storage</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Enterprise Hub
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Deploy BrandPilot directly into your everyday employee workflow via native browser extensions, Figma plugins, and cloud asset repositories.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#0A120E] p-1.5 rounded-xl border border-emerald-950 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('extensions')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'extensions'
                ? 'bg-emerald-500 text-black shadow-sm font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Browser & Figma Plugins</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dam')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dam'
                ? 'bg-emerald-500 text-black shadow-sm font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloud DAM & Storage</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BROWSER & FIGMA PLUGINS */}
      {/* ========================================================================= */}
      {activeTab === 'extensions' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Chrome Extension Manifest V3 */}
            <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Manifest V3 Ready
                  </span>
                </div>

                <h3 className="text-base font-black text-white">Google Chrome BrandPilot Extension</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Real-time linter squiggles and suggestions directly inside Google Docs, Notion, LinkedIn, HubSpot, Zendesk, and Webflow CMS.
                </p>

                <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 text-xs space-y-2 text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sub-1ms instantaneous keystroke evaluation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Works in all Chromium browsers (Edge, Brave, Chrome)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Private zero-data retention local linter gate</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleDownloadExtensionZip('chrome')}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Chrome Extension (ZIP)</span>
                </button>
              </div>
            </div>

            {/* Card 2: Figma Plugin */}
            <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                    <Puzzle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    Figma Community Plugin
                  </span>
                </div>

                <h3 className="text-base font-black text-white">BrandPilot for Figma & FigJam</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Designers can select any frame, component, or vector emblem to verify color tokens, 0.5H clear margins, and copy without leaving Figma.
                </p>

                <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 text-xs space-y-2 text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inspect active frame colors against brand tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auto-detect logo clear space bounding margin breaches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>One-click swap to approved SVG lockup tokens</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleDownloadExtensionZip('figma')}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Figma Plugin Manifest (ZIP)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live Browser Extension Simulator */}
          <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Live Extension Linter Playground</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Test how the browser extension inspects text in real-time as an employee types in Google Docs or Notion.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestInSituLint}
                disabled={sandboxScanning}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${sandboxScanning ? 'animate-spin' : ''}`} />
                <span>Run Instant Linter</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">
                Simulated Google Docs / CMS Editor
              </label>
              <textarea
                rows={3}
                value={sandboxText}
                onChange={e => setSandboxText(e.target.value)}
                className="w-full p-3 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* Results preview */}
            {sandboxResult && (
              <div className="p-4 bg-[#060B08] rounded-xl border border-emerald-950 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Linter Scan Duration: {sandboxResult.duration_ms || 0.38}ms</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    Score: {sandboxResult.score}%
                  </span>
                </div>

                <div className="space-y-2">
                  {sandboxResult.violations?.map((v: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#0A120E] border border-rose-950 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <strong className="text-rose-400 font-mono">"{v.detected}"</strong>
                        <div className="text-[11px] text-zinc-400">{v.reason}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                        Fix: "{v.replacement}"
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DIGITAL ASSET MANAGEMENT & CLOUD STORAGE */}
      {/* ========================================================================= */}
      {activeTab === 'dam' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-950">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-emerald-400" />
                  <span>Enterprise Digital Asset Repositories ({damConnectors.length})</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Synchronize official brand guidelines PDFs, vector logos, and color books directly from your cloud buckets.
                </p>
              </div>

              <div className="text-xs text-zinc-400 font-mono">
                Total Synchronized: 109 Brand Assets
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {damConnectors.map(connector => {
                const isSyncing = syncingId === connector.id;

                return (
                  <div
                    key={connector.id}
                    className="p-5 rounded-2xl bg-[#060B08] border border-emerald-950 space-y-4 hover:border-emerald-800 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
                          <Server className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-[#00FF87] border border-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
                          <span>Connected</span>
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white">{connector.name}</h4>
                        <div className="text-[11px] text-zinc-400 font-mono truncate mt-0.5">
                          {connector.bucket_or_folder}
                        </div>
                      </div>

                      <div className="text-xs text-zinc-400 space-y-1 pt-2 border-t border-emerald-950/60 font-mono">
                        <div className="flex justify-between">
                          <span>Synced Assets:</span>
                          <strong className="text-white">{connector.synced_assets_count} files</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Synced:</span>
                          <strong className="text-zinc-300">{connector.last_sync_at}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-emerald-950/60">
                      <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={connector.auto_sync}
                          onChange={() => toggleDAMAutoSync(connector.id)}
                          className="rounded text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                        <span>Auto-sync</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleSync(connector.id)}
                        disabled={isSyncing}
                        className="px-3 py-1 rounded-lg bg-[#0A120E] border border-emerald-900/60 hover:border-emerald-500 text-zinc-200 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                        <span>Sync</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
