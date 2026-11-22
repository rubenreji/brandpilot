'use client';

import React, { useState, useEffect } from 'react';
import { useBrandPilot } from '@/lib/store';
import { SpokenFinding } from '@/lib/types';
import {
  Mic,
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Sliders,
  Globe,
  Radio,
  FileText,
  ArrowRight,
  Zap,
  Activity
} from 'lucide-react';

interface MediaClip {
  id: string;
  title: string;
  speaker: string;
  role: string;
  mediaType: string;
  durationSec: number;
  initialTranscript: string;
}

const PRESET_CLIPS: MediaClip[] = [
  {
    id: 'clip-keynote',
    title: 'Q4 Enterprise Keynote Address (CEO Product Reveal)',
    speaker: 'Elena Rostova',
    role: 'Chief Executive Officer',
    mediaType: 'Executive Keynote Video',
    durationSec: 85,
    initialTranscript:
      'Welcome everyone. AuraCloud guarantees 100% uptime with our new cloud orchestration platform. Recognized across the industry as India\'s No. 1 multi-cloud solution, our proprietary AI magic automates mission-critical failover while providing the cheapest cloud pricing available in modern computing.'
  },
  {
    id: 'clip-podcast',
    title: 'Cloud Leadership Podcast Interview (CTO Deep Dive)',
    speaker: 'Devon Vance',
    role: 'Chief Technology Officer',
    mediaType: 'Podcast Audio Recording',
    durationSec: 72,
    initialTranscript:
      'In today\'s discussion on auracloud infrastructure, we deliver complete 100% reliability with zero packet loss. Our platform is universally cheaper than legacy alternatives, delivering automated AI magic across all enterprise edge clusters.'
  },
  {
    id: 'clip-compliant',
    title: 'Official Enterprise Brand Video Ad (Global Launch)',
    speaker: 'Narrator',
    role: 'Brand Commercial Voiceover',
    mediaType: 'Digital Video Advertisement',
    durationSec: 60,
    initialTranscript:
      'AuraCloud delivers high-assurance multi-cloud governance backed by a verified 99.95% monthly uptime SLA. As an industry-recognized enterprise leader, we provide intelligent automated orchestration and cost-effective cloud efficiency.'
  }
];

export default function MultimodalStudioPage() {
  const {
    currentWorkspace,
    selectedJurisdiction,
    setSelectedJurisdiction,
    auditMultimodalSpeech,
    showToast
  } = useBrandPilot();

  const [selectedClip, setSelectedClip] = useState<MediaClip>(PRESET_CLIPS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackSec, setCurrentPlaybackSec] = useState(0);
  const [transcriptText, setTranscriptText] = useState(selectedClip.initialTranscript);
  const [findings, setFindings] = useState<SpokenFinding[]>([]);
  const [speechScore, setSpeechScore] = useState(55);
  const [speechWpm, setSpeechWpm] = useState(142);
  const [cleanTeleprompter, setCleanTeleprompter] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTimestampHighlight, setActiveTimestampHighlight] = useState<string | null>(null);

  // Re-run speech audit when clip, text, or jurisdiction changes
  useEffect(() => {
    let isMounted = true;
    const runAudit = async () => {
      const res = await auditMultimodalSpeech({
        title: selectedClip.title,
        transcript: transcriptText,
        speaker_role: selectedClip.role,
        media_type: selectedClip.mediaType,
        jurisdiction: selectedJurisdiction
      });
      if (isMounted) {
        setFindings(res.spoken_findings);
        setSpeechScore(res.compliance_score);
        setSpeechWpm(res.speech_pacing_wpm);
        setCleanTeleprompter(res.teleprompter_clean_script);
      }
    };
    runAudit();
    return () => {
      isMounted = false;
    };
  }, [selectedClip, transcriptText, selectedJurisdiction]);

  // Audio Playback simulation ticker
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentPlaybackSec(prev => {
          if (prev >= selectedClip.durationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedClip.durationSec]);

  const handleSelectClip = (clip: MediaClip) => {
    setSelectedClip(clip);
    setTranscriptText(clip.initialTranscript);
    setCurrentPlaybackSec(0);
    setIsPlaying(false);
    showToast(`Loaded "${clip.title}" into Multimodal Studio.`, 'info');
  };

  const handleJumpToTimestamp = (sec: number, label: string) => {
    setCurrentPlaybackSec(sec);
    setIsPlaying(true);
    setActiveTimestampHighlight(label);
    showToast(`Jumped audio player to timestamp ${label}.`, 'info');
  };

  const handleApplyTeleprompterPatch = () => {
    setTranscriptText(cleanTeleprompter);
    setFindings([]);
    setSpeechScore(100);
    showToast('Applied teleprompter patch! Spoken violations remediated and score elevated to 100%.', 'success');
  };

  const handleCopyScript = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(cleanTeleprompter || transcriptText);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
      showToast('Teleprompter script copied to clipboard.', 'success');
    }
  };

  const formatSec = (sec: number) => {
    const mm = String(Math.floor(sec / 60)).padStart(2, '0');
    const ss = String(sec % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>Multimodal Governance</span>
            <span>•</span>
            <span>Speech & Video Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Audio & Video Compliance Studio
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Whisper ASR + Teleprompter
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Detect verbal brand violations in executive keynotes, podcast spots, and video ads with timestamped teleprompter remediation.
          </p>
        </div>

        {/* Regulatory Jurisdiction Selector */}
        <div className="flex items-center gap-2 bg-[#060B08] border border-emerald-900/60 p-1.5 rounded-xl text-xs">
          <Globe className="w-4 h-4 text-emerald-400 ml-1.5" />
          <span className="text-zinc-400 text-[11px] font-semibold hidden sm:inline">Jurisdiction:</span>
          <select
            value={selectedJurisdiction}
            onChange={e => setSelectedJurisdiction(e.target.value as any)}
            className="bg-[#0A120E] border border-emerald-900/80 text-emerald-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold focus:ring-1 focus:ring-emerald-500"
          >
            <option value="global">🌐 Global Standard</option>
            <option value="us_ftc">🇺🇸 US (FTC & Lanham Act)</option>
            <option value="eu_ai_act">🇪🇺 EU (AI Act Art. 50)</option>
            <option value="uk_asa">🇬🇧 UK (ASA / CAP Code)</option>
          </select>
        </div>
      </div>

      {/* Preset Media Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESET_CLIPS.map(clip => {
          const isSelected = selectedClip.id === clip.id;
          return (
            <div
              key={clip.id}
              onClick={() => handleSelectClip(clip)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-emerald-950/40 border-[#00FF87] shadow-lg shadow-emerald-500/10'
                  : 'bg-[#0A120E] border-emerald-950 hover:border-emerald-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-mono text-emerald-400 text-[10px] uppercase font-bold">{clip.mediaType}</span>
                <span className="font-mono text-zinc-500 text-[11px]">{formatSec(clip.durationSec)}</span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1">{clip.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">Speaker: {clip.speaker} ({clip.role})</p>
              {isSelected && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#00FF87] rounded-bl"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Workspace Layout: Audio Player + Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Simulated Audio/Video Waveform Player & Telemetry */}
        <div className="lg:col-span-1 space-y-4">
          {/* Simulated Media Player Box */}
          <div className="p-5 rounded-2xl bg-[#0A120E] border border-emerald-950 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#00FF87] animate-pulse" />
                <span>Audio Stream Active</span>
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {formatSec(currentPlaybackSec)} / {formatSec(selectedClip.durationSec)}
              </span>
            </div>

            {/* Animated Waveform Visualization */}
            <div className="h-20 bg-[#060B08] rounded-xl border border-emerald-950 flex items-center justify-center px-4 gap-1 overflow-hidden relative">
              {[40, 65, 30, 85, 95, 45, 70, 90, 60, 35, 75, 100, 50, 80, 65, 45, 90, 70, 55, 85, 40, 60, 75, 50, 30, 80, 60].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isPlaying
                      ? 'bg-gradient-to-t from-emerald-500 to-[#00FF87]'
                      : 'bg-emerald-950/60'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (0.6 + Math.random() * 0.5)))}%` : `${h * 0.3}%`
                  }}
                />
              ))}
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setCurrentPlaybackSec(0)}
                className="p-2 rounded-lg bg-[#060B08] border border-emerald-950 text-zinc-400 hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer"
                title="Restart playback"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                <span>{isPlaying ? 'Pause Speech' : 'Play Speech'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Speech Telemetry Dashboard */}
          <div className="p-5 rounded-2xl bg-[#0A120E] border border-emerald-950 space-y-3.5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Spoken Speech Diagnostics</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#060B08] border border-emerald-950">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Spoken Compliance</div>
                <div
                  className={`text-2xl font-black font-mono mt-0.5 ${
                    speechScore >= 90 ? 'text-[#00FF87]' : speechScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {speechScore}%
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{findings.length} verbal flags</div>
              </div>

              <div className="p-3 rounded-xl bg-[#060B08] border border-emerald-950">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Speech Cadence</div>
                <div className="text-2xl font-black font-mono text-white mt-0.5">{speechWpm} <span className="text-xs font-normal text-zinc-400">WPM</span></div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Optimal Executive Pace</div>
              </div>

              <div className="p-3 rounded-xl bg-[#060B08] border border-emerald-950">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Spoken Formality</div>
                <div className="text-2xl font-black font-mono text-teal-300 mt-0.5">88%</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Enterprise Executive</div>
              </div>

              <div className="p-3 rounded-xl bg-[#060B08] border border-emerald-950">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Regulatory Framework</div>
                <div className="text-xs font-extrabold text-white mt-1 font-mono uppercase">{selectedJurisdiction}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Statutory Rules Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Timestamped Transcript & Spoken Findings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0A120E] border border-emerald-950 space-y-4 shadow-xl">
            {/* Header with 1-Click Teleprompter Remediation Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-950">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>Timestamped Speech Transcript</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Click any timestamp to jump to that moment in the audio stream.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {findings.length > 0 && (
                  <button
                    type="button"
                    onClick={handleApplyTeleprompterPatch}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-black" />
                    <span>Apply Teleprompter Patch</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-3 py-1.5 rounded-xl bg-[#060B08] border border-emerald-900/60 hover:bg-emerald-950/60 text-zinc-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copiedScript ? 'Copied!' : 'Export Script'}</span>
                </button>
              </div>
            </div>

            {/* Transcript Text Box */}
            <div className="p-4 rounded-xl bg-[#060B08] border border-emerald-900/60 text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans space-y-2">
              <p>{transcriptText}</p>
            </div>

            {/* Timestamped Spoken Findings List */}
            {findings.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Spoken Policy Violations Detected ({findings.length})</span>
                </div>

                <div className="space-y-2.5">
                  {findings.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#060B08] border border-emerald-950 hover:border-emerald-800 transition-colors space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleJumpToTimestamp(f.timestamp_sec, f.timestamp_display)}
                          className="font-mono text-xs font-extrabold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 hover:bg-emerald-900 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Clock className="w-3 h-3 text-[#00FF87]" />
                          <span>[{f.timestamp_display}]</span>
                          <span className="text-[10px] text-zinc-400 font-normal ml-1">Jump</span>
                        </button>

                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            f.severity === 'critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {f.severity}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                        <span className="line-through text-rose-400 font-mono font-bold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900">
                          {f.original_speech}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="text-[#00FF87] font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          {f.suggested_teleprompter_speech}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400 leading-relaxed">
                        <span className="font-semibold text-zinc-300">{f.rule_name}:</span> {f.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-[#00FF87] shrink-0" />
                <div>
                  <div className="font-bold text-white">Spoken Dialogue 100% Compliant</div>
                  <div className="text-[11px] text-zinc-400">
                    Speech adheres to verified SLA bounds, proper brand naming, and avoids prohibited superlatives under active {selectedJurisdiction.toUpperCase()} regulatory rules.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
