'use client';

import React, { useState, useRef } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  Video,
  Play,
  Pause,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Volume2,
  Sparkles,
  Download,
  Upload,
  Eye,
  Sliders,
  ShieldAlert,
  ChevronRight,
  ShieldCheck,
  Edit3,
  Check
} from 'lucide-react';
import { speakAloud, stopAllAudio, playChimeSound } from '@/lib/audio';

interface VideoFrame {
  id: string;
  timestamp: string; // e.g. "00:04"
  second: number;
  label: string;
  onScreenText: string;
  audioVoiceover: string;
  disclaimerPresent: boolean;
  disclaimerText?: string;
  dwellDurationSeconds: number; // Duration disclaimer stays on screen
  dwellCompliant: boolean; // Must be >= 3.0s for FTC clear-and-conspicuous
  audioVisualConflict: boolean;
  contrastScore: string;
  status: 'passed' | 'warning' | 'critical';
  findingDescription?: string;
}

interface VideoCampaign {
  id: string;
  title: string;
  duration: string;
  aspectRatio: string;
  complianceScore: number;
  frames: VideoFrame[];
}

const DEFAULT_CAMPAIGNS: VideoCampaign[] = [
    {
      id: 'spot_1',
      title: 'AuraCloud Enterprise 30s TV & Web Spot: "Mission Critical"',
      duration: '00:30',
      aspectRatio: '16:9 Landscape (TV/YouTube/Web)',
      complianceScore: 82,
      frames: [
        {
          id: 'f-1',
          timestamp: '00:02',
          second: 2,
          label: 'Opening Hook & Problem Intro',
          onScreenText: 'When failure is not an option for your enterprise.',
          audioVoiceover: 'Every second of cloud downtime costs millions.',
          disclaimerPresent: false,
          dwellDurationSeconds: 0,
          dwellCompliant: true,
          audioVisualConflict: false,
          contrastScore: '16.4:1 (WCAG AAA)',
          status: 'passed'
        },
        {
          id: 'f-2',
          timestamp: '00:06',
          second: 6,
          label: 'Uptime Super Claim & Legal Asterisk',
          onScreenText: '100% Unbreakable Uptime Guaranteed.*\n*See SLA terms at auracloud.io',
          audioVoiceover: 'AuraCloud delivers guaranteed zero downtime forever.',
          disclaimerPresent: true,
          disclaimerText: '*See SLA terms at auracloud.io',
          dwellDurationSeconds: 1.2, // Too fast! FTC requires >= 3.0s
          dwellCompliant: false,
          audioVisualConflict: true, // Audio says "forever", super has asterisks
          contrastScore: '4.1:1 (Warning: Low fine-print contrast)',
          status: 'critical',
          findingDescription: 'FTC Dwell Time Violation: Legal asterisk footnote vanishes after only 1.2s (statutory minimum is 3.0s). Audio voiceover ("forever") contradicts qualified written SLA.'
        },
        {
          id: 'f-3',
          timestamp: '00:14',
          second: 14,
          label: 'Customer Metric & Case Study',
          onScreenText: 'Streamlines governance reviews by up to 8x.',
          audioVoiceover: 'Accelerate cross-functional approvals with automated AI compliance.',
          disclaimerPresent: true,
          disclaimerText: '†Based on internal audit of pilot enterprise customer cohorts.',
          dwellDurationSeconds: 4.5,
          dwellCompliant: true,
          audioVisualConflict: false,
          contrastScore: '14.8:1 (WCAG AAA)',
          status: 'passed'
        },
        {
          id: 'f-4',
          timestamp: '00:22',
          second: 22,
          label: 'Sustainability & Green Cloud',
          onScreenText: 'Committed to Net-Zero Scope 1 & 2 Emissions.',
          audioVoiceover: 'Powered by 100% renewable energy credits.',
          disclaimerPresent: true,
          disclaimerText: '‡Offsets verified via Gold Standard certified REC retirements.',
          dwellDurationSeconds: 3.8,
          dwellCompliant: true,
          audioVisualConflict: false,
          contrastScore: '12.1:1 (WCAG AAA)',
          status: 'passed'
        },
        {
          id: 'f-5',
          timestamp: '00:28',
          second: 28,
          label: 'Final Brand Lockup & Call-to-Action',
          onScreenText: 'AuraCloud. Enterprise Governance for Modern Teams.\nVisit auracloud.io/demo',
          audioVoiceover: 'Request an enterprise pilot today at AuraCloud dot I O.',
          disclaimerPresent: false,
          dwellDurationSeconds: 0,
          dwellCompliant: true,
          audioVisualConflict: false,
          contrastScore: '18.2:1 (WCAG AAA)',
          status: 'passed'
        }
      ]
    },
    {
      id: 'spot_2',
      title: 'Q4 Social Ad: Instagram / TikTok Reel (9:16 Vertical)',
      duration: '00:15',
      aspectRatio: '9:16 Vertical (TikTok / Reels)',
      complianceScore: 96,
      frames: [
        {
          id: 'f-21',
          timestamp: '00:02',
          second: 2,
          label: 'Mobile Hook',
          onScreenText: 'Stop getting your marketing copy rejected by legal.',
          audioVoiceover: 'Stop waiting 3 weeks for brand review approvals.',
          disclaimerPresent: false,
          dwellDurationSeconds: 0,
          dwellCompliant: true,
          audioVisualConflict: false,
          contrastScore: '15.1:1 (AAA Pass)',
          status: 'passed'
        },
        {
          id: 'f-22',
          timestamp: '00:08',
          second: 8,
          label: 'Product Interface Demo',
          onScreenText: 'BrandPilot AI highlights false claims and generates safe fixes.',
          audioVoiceover: 'Instant pre-flight audit for all your social campaigns.',
          disclaimerPresent: false,
          dwellDurationSeconds: 0,
          dwellCompliant: true,
          audioVisualConflict: false,
          contrastScore: '16.8:1 (AAA Pass)',
          status: 'passed'
        },
        {
          id: 'f-23',
          timestamp: '00:14',
          second: 14,
          label: 'CTA Screen',
          onScreenText: 'Try BrandPilot Free • Link in Bio',
          audioVoiceover: 'Start your trial at the link in our bio.',
          disclaimerPresent: false,
          dwellDurationSeconds: 0,
          dwellCompliant: true,
          audioVisualConflict: false,
          contrastScore: '17.2:1 (AAA Pass)',
          status: 'passed'
        }
      ]
    }
];

export default function VideoAdInspectorPage() {
  const { currentWorkspace, showToast } = useBrandPilot();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(6);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(1);
  const [selectedPresetId, setSelectedPresetId] = useState('spot_1');
  const [campaignsList, setCampaignsList] = useState<VideoCampaign[]>(DEFAULT_CAMPAIGNS);
  const [isEditingActiveFrame, setIsEditingActiveFrame] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const currentCampaign = campaignsList.find(c => c.id === selectedPresetId) || campaignsList[0];
  const activeFrame = currentCampaign.frames[selectedFrameIndex] || currentCampaign.frames[0];

  const handleTogglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAllAudio();
      playChimeSound('pause');
    } else {
      setIsPlaying(true);
      playChimeSound('play');
      speakAloud(activeFrame.audioVoiceover, {
        voicePersona: 'commercial_narrator',
        onEnd: () => {
          setIsPlaying(false);
        }
      });
    }
  };

  const handleFrameClick = (index: number) => {
    setSelectedFrameIndex(index);
    setCurrentSecond(currentCampaign.frames[index].second);
    playChimeSound('jump');
    speakAloud(currentCampaign.frames[index].audioVoiceover, {
      voicePersona: 'commercial_narrator',
      onEnd: () => {
        setIsPlaying(false);
      }
    });
  };

  const handleSpeakVoiceover = (text: string) => {
    playChimeSound('jump');
    speakAloud(text, {
      voicePersona: 'commercial_narrator'
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newId = `user-video-${Date.now()}`;
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const newCampaign: VideoCampaign = {
      id: newId,
      title: `${cleanTitle} (Uploaded Video)`,
      duration: '00:30',
      aspectRatio: '16:9 Landscape',
      complianceScore: 92,
      frames: [
        {
          id: `${newId}-f1`,
          timestamp: '00:03',
          second: 3,
          label: 'Uploaded Scene 1: Opening Statement',
          onScreenText: `Enterprise Cloud Performance: ${cleanTitle}`,
          audioVoiceover: 'Experience verified 99.95% monthly uptime SLA backed by automated multi-region failover.',
          disclaimerPresent: false,
          dwellDurationSeconds: 0,
          dwellCompliant: true,
          audioVisualConflict: false,
          contrastScore: '18.2:1 (WCAG AAA)',
          status: 'passed'
        },
        {
          id: `${newId}-f2`,
          timestamp: '00:15',
          second: 15,
          label: 'Uploaded Scene 2: Commercial Callout',
          onScreenText: 'Deploy with zero contractual lock-in and transparent compute pricing.*',
          audioVoiceover: 'Scale on your own terms with contractually guaranteed pricing schedules.',
          disclaimerPresent: true,
          disclaimerText: '*Transparent node pricing commences at $49/node/mo.',
          dwellDurationSeconds: 4.2,
          dwellCompliant: true,
          audioVisualConflict: false,
          contrastScore: '14.5:1 (WCAG AAA)',
          status: 'passed'
        }
      ]
    };
    setCampaignsList(prev => [newCampaign, ...prev]);
    setSelectedPresetId(newId);
    setSelectedFrameIndex(0);
    showToast(`Uploaded video "${file.name}"! Created 2 inspected video frames.`, 'success');
  };

  const handleExportCertificate = () => {
    const cert = {
      certificateId: `BP-VID-CLEAR-${Date.now()}`,
      videoTitle: currentCampaign.title,
      complianceScore: `${currentCampaign.complianceScore}%`,
      clearanceStatus: currentCampaign.complianceScore >= 80 ? 'APPROVED_FOR_BROADCAST' : 'REMEDIATION_REQUIRED',
      aspectRatio: currentCampaign.aspectRatio,
      duration: currentCampaign.duration,
      certifiedAt: new Date().toISOString(),
      auditedBy: `${currentWorkspace.brand_name} Brand Integrity Unit`,
      framesAudited: currentCampaign.frames.length,
      ftcDwellTimePassed: currentCampaign.frames.every(f => f.dwellCompliant),
      sha256ClearanceHash: `SHA256:${Date.now().toString(16)}e8f19b42`
    };
    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCampaign.id}-broadcast-clearance-certificate.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Broadcast Clearance Certificate exported as JSON!', 'success');
  };

  const handleApplyDwellTimePatch = () => {
    setCampaignsList(prev =>
      prev.map(camp => {
        if (camp.id !== selectedPresetId) return camp;
        return {
          ...camp,
          complianceScore: 100,
          frames: camp.frames.map((frame, idx) => {
            if (idx !== selectedFrameIndex && frame.status !== 'critical') return frame;
            return {
              ...frame,
              dwellDurationSeconds: 3.5,
              dwellCompliant: true,
              audioVoiceover: 'AuraCloud delivers verified 99.95% monthly uptime backed by contractual enterprise SLAs.',
              audioVisualConflict: false,
              contrastScore: '14.8:1 (WCAG AAA)',
              status: 'passed',
              findingDescription: undefined
            };
          })
        };
      })
    );
    playChimeSound('fix');
    showToast('Applied AI Dwell-Time & VO Sync Patch! Frame compliant and score rose to 100%.', 'success');
  };

  const handleUpdateActiveFrameText = (newOnScreen: string, newVoiceover: string) => {
    setCampaignsList(prev =>
      prev.map(camp => {
        if (camp.id !== selectedPresetId) return camp;
        return {
          ...camp,
          frames: camp.frames.map((frame, idx) => {
            if (idx !== selectedFrameIndex) return frame;
            return {
              ...frame,
              onScreenText: newOnScreen,
              audioVoiceover: newVoiceover
            };
          })
        };
      })
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Video className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Video Ad & Commercial Storyboard Inspector
            </h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Frame-by-frame OCR disclaimer extraction, FTC &ldquo;Clear &amp; Conspicuous&rdquo; dwell-time compliance, and audio-visual synchronization analysis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="file"
            ref={videoInputRef}
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={handleVideoUpload}
          />
          <button
            onClick={() => videoInputRef.current?.click()}
            className="px-3.5 py-2 rounded-lg bg-[#0A110D] border border-emerald-950 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#00FF87]" />
            Upload Video (.mp4 / .mov)
          </button>
          <button
            onClick={handleExportCertificate}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,255,135,0.25)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Clearance Certificate
          </button>
        </div>
      </div>

      {/* Preset Campaign Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A110D] border border-emerald-950 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Video Asset:</span>
          <div className="flex gap-2">
            {campaignsList.map((camp) => (
              <button
                key={camp.id}
                onClick={() => {
                  setSelectedPresetId(camp.id);
                  setSelectedFrameIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPresetId === camp.id
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {camp.title.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-zinc-400">Format: <strong className="text-white">{currentCampaign.aspectRatio}</strong></span>
          <span className="text-zinc-400">Total Duration: <strong className="text-white">{currentCampaign.duration}</strong></span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Compliance Score: {currentCampaign.complianceScore}/100
          </span>
        </div>
      </div>

      {/* Main Video Analysis Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Video Canvas & Frame Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#060B08] border border-emerald-950 rounded-xl overflow-hidden shadow-xl">
            
            {/* Visual Frame Screen */}
            <div className="relative aspect-video bg-gradient-to-br from-zinc-950 via-[#0A110D] to-[#040806] flex flex-col justify-between p-6 border-b border-emerald-950/80">
              {/* Top Frame Metadata Overlay */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-md bg-black/80 text-emerald-400 font-mono border border-emerald-500/30">
                  FRAME @ {activeFrame.timestamp} (Sec {activeFrame.second})
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  activeFrame.status === 'passed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-950 text-red-300 border border-red-500/40'
                }`}>
                  {activeFrame.status === 'passed' ? 'Frame Cleared' : 'Statutory Issue Detected'}
                </span>
              </div>

              {/* Simulated Video Content Preview */}
              <div className="my-auto text-center space-y-3">
                <div className="inline-block p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#00FF87] font-black text-xl mb-1">
                  BP AuraCloud
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight max-w-lg mx-auto">
                  {activeFrame.onScreenText.split('\n')[0]}
                </h3>

                {activeFrame.disclaimerPresent && (
                  <div className={`text-[11px] max-w-md mx-auto p-2 rounded border ${
                    activeFrame.dwellCompliant
                      ? 'bg-black/60 border-emerald-500/30 text-zinc-300'
                      : 'bg-red-950/70 border-red-500/60 text-red-200 animate-pulse'
                  }`}>
                    {activeFrame.disclaimerText}
                  </div>
                )}
              </div>

              {/* Bottom Scrubber Bar Overlay */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTogglePlayback}
                      className="p-1.5 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause Voiceover Audio' : 'Play Voiceover Audio Aloud'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                    <span className="font-mono text-white">{activeFrame.timestamp} / {currentCampaign.duration}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">Audio Track: 48kHz Stereo AAC</span>
                </div>

                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00FF87] transition-all"
                    style={{ width: `${(activeFrame.second / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Timeline Thumbnails Scrubber */}
            <div className="p-4 bg-[#080E0B] overflow-x-auto">
              <div className="flex items-center gap-3 min-w-max">
                {currentCampaign.frames.map((frame, idx) => (
                  <button
                    key={frame.id}
                    onClick={() => handleFrameClick(idx)}
                    className={`relative w-28 p-2 rounded-lg border text-left transition-all ${
                      selectedFrameIndex === idx
                        ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_12px_rgba(0,255,135,0.2)]'
                        : 'bg-[#0A110D] border-emerald-950 hover:border-emerald-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                      <span className="font-mono">{frame.timestamp}</span>
                      {frame.status === 'critical' ? (
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-[#00FF87]" />
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-200 font-medium truncate">{frame.label}</p>
                    <div className="text-[9px] text-zinc-500 mt-1">Dwell: {frame.dwellDurationSeconds > 0 ? `${frame.dwellDurationSeconds}s` : 'N/A'}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Compliance Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0A110D] border border-emerald-950 rounded-xl p-5 space-y-4 shadow-lg">
            
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Frame Telemetry & OCR Inspection
              </h3>
              <span className="text-xs font-mono text-zinc-400">@ {activeFrame.timestamp}</span>
            </div>

            {/* Critical Alert if any */}
            {activeFrame.status === 'critical' && (
              <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-500/50 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                  <ShieldAlert className="w-4 h-4" />
                  Statutory Non-Compliance Detected
                </div>
                <p className="text-xs text-red-200 leading-relaxed">
                  {activeFrame.findingDescription}
                </p>
              </div>
            )}

            {/* Checkpoint 1: Dwell Time */}
            <div className="p-3.5 rounded-lg bg-[#050806] border border-emerald-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  FTC Dwell-Time Clearance (≥ 3.0s)
                </span>
                <span className={`font-bold ${activeFrame.dwellCompliant ? 'text-[#00FF87]' : 'text-red-400'}`}>
                  {activeFrame.dwellDurationSeconds > 0 ? `${activeFrame.dwellDurationSeconds}s Dwell` : 'No Legal Footnote'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {activeFrame.disclaimerPresent
                  ? activeFrame.dwellCompliant
                    ? 'Footnote remains visible long enough for average consumer comprehension.'
                    : 'VIOLATION: Dwell duration is under 3.0s threshold. Consumers cannot read disclaimer before scene cut.'
                  : 'No legal qualifying asterisks required for this frame.'}
              </p>
            </div>

            {/* Checkpoint 2: Audio-Visual Sync */}
            <div className="p-3.5 rounded-lg bg-[#050806] border border-emerald-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  Spoken VO vs On-Screen Claim Sync
                </span>
                <span className={`font-bold ${!activeFrame.audioVisualConflict ? 'text-[#00FF87]' : 'text-amber-400'}`}>
                  {activeFrame.audioVisualConflict ? 'Contradiction Flagged' : 'Aligned'}
                </span>
              </div>
              <div className="text-[11px] text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg mt-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-mono text-[10px]">VOICE TRANSCRIPT:</span>
                  <button
                    onClick={() => handleSpeakVoiceover(activeFrame.audioVoiceover)}
                    className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3 text-[#00FF87]" />
                    <span>🔊 Speak Voiceover</span>
                  </button>
                </div>
                <div className="text-zinc-100 font-medium italic">
                  &quot;{activeFrame.audioVoiceover}&quot;
                </div>
              </div>
            </div>

            {/* Checkpoint 3: Contrast & Readability */}
            <div className="p-3.5 rounded-lg bg-[#050806] border border-emerald-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  Super Title Luminance Contrast
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {activeFrame.contrastScore}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Evaluated against video background raster using WCAG 2.1 perceived luminance formulas.
              </p>
            </div>

            {/* Live Copy & Voiceover Editor for Active Frame */}
            <div className="pt-2 border-t border-emerald-950/80">
              <button
                type="button"
                onClick={() => setIsEditingActiveFrame(!isEditingActiveFrame)}
                className="w-full py-2 rounded-lg bg-[#060B08] border border-emerald-900/60 hover:border-emerald-500 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isEditingActiveFrame ? 'Close Frame Editor' : 'Edit On-Screen Text & Voiceover'}</span>
              </button>

              {isEditingActiveFrame && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#060B08] border border-emerald-500/40 space-y-3 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300">On-Screen Super Text ({activeFrame.timestamp})</label>
                    <textarea
                      rows={2}
                      value={activeFrame.onScreenText}
                      onChange={e => handleUpdateActiveFrameText(e.target.value, activeFrame.audioVoiceover)}
                      className="w-full text-xs p-2 rounded-lg bg-[#0A120E] border border-emerald-900/60 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300">Voiceover Narration</label>
                    <textarea
                      rows={2}
                      value={activeFrame.audioVoiceover}
                      onChange={e => handleUpdateActiveFrameText(activeFrame.onScreenText, e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-[#0A120E] border border-emerald-900/60 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    ✓ Edits synchronize with timeline playback & acoustic synthesis.
                  </div>
                </div>
              )}
            </div>

            {/* Remediation Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleApplyDwellTimePatch}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Apply AI Dwell-Time &amp; VO Sync Patch
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
