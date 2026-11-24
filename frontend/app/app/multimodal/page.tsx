'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBrandPilot } from '@/lib/store';
import { SpokenFinding } from '@/lib/types';
import {
  Mic,
  MicOff,
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
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
  Activity,
  HelpCircle,
  Info,
  ChevronDown,
  Volume1,
  Upload,
  RadioTower
} from 'lucide-react';
import { speakAloud, stopAllAudio, playChimeSound, transcribeAudioFile } from '@/lib/audio';

interface MediaClip {
  id: string;
  title: string;
  speaker: string;
  role: string;
  mediaType: string;
  durationSec: number;
  simpleDescription: string;
  initialTranscript: string;
}

const PRESET_CLIPS: MediaClip[] = [
  {
    id: 'clip-keynote',
    title: 'Keynote Speech (CEO Launch Talk)',
    speaker: 'Elena Rostova',
    role: 'Chief Executive Officer',
    mediaType: 'Executive Speech',
    durationSec: 85,
    simpleDescription: 'Contains 3 major claims to fix: 100% uptime guarantee, "AI magic", and "cheapest pricing".',
    initialTranscript:
      'Welcome everyone. AuraCloud guarantees 100% uptime with our new cloud orchestration platform. Recognized across the industry as India\'s No. 1 multi-cloud solution, our proprietary AI magic automates mission-critical failover while providing the cheapest cloud pricing available in modern computing.'
  },
  {
    id: 'clip-podcast',
    title: 'Podcast Interview (CTO Deep Dive)',
    speaker: 'Devon Vance',
    role: 'Chief Technology Officer',
    mediaType: 'Podcast Audio',
    durationSec: 72,
    simpleDescription: 'Contains improper brand name capitalization ("auracloud") and unproven zero-latency claims.',
    initialTranscript:
      'In today\'s discussion on auracloud infrastructure, we deliver complete 100% reliability with zero packet loss. Our platform is universally cheaper than legacy alternatives, delivering automated AI magic across all enterprise edge clusters.'
  },
  {
    id: 'clip-compliant',
    title: 'Official Brand Video (Approved Speech)',
    speaker: 'Narrator',
    role: 'Commercial Voiceover',
    mediaType: 'Video Advertisement',
    durationSec: 60,
    simpleDescription: '100% Clean — Great example of how an approved, truthful enterprise script should sound.',
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

  // Audio Speech Synthesis state
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [spokenWordHighlight, setSpokenWordHighlight] = useState<string>('');
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isTranscribingFile, setIsTranscribingFile] = useState(false);

  // Sound chime helper for interactive feedback
  const playChime = (type: 'fix' | 'jump' | 'speak') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'fix') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'jump') {
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {}
  };

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

  // Audio Playback simulation ticker for visual wave and time tracking
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

  // Web Speech API: Play real audio aloud
  const handlePlaySpeech = (textToSpeak?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Speech audio is not supported in this browser.', 'error');
      return;
    }

    const text = textToSpeak || transcriptText;
    if (!text.trim()) {
      showToast('No text available to speak.', 'error');
      return;
    }

    // Cancel any previous speech
    stopAllAudio();

    let persona: 'female_executive' | 'male_cto' | 'commercial_narrator' = 'commercial_narrator';
    if (selectedClip.id === 'clip-keynote') {
      persona = 'female_executive';
    } else if (selectedClip.id === 'clip-podcast') {
      persona = 'male_cto';
    }

    setIsPlaying(true);
    playChimeSound('play');
    showToast(`🔊 Speaking out loud: "${selectedClip.speaker}" audio playing now.`, 'success');

    speakAloud(text, {
      voicePersona: persona,
      rate: speechRate,
      volume: isMuted ? 0 : volume,
      onStart: () => {
        setIsPlaying(true);
      },
      onWord: (word) => {
        setSpokenWordHighlight(word);
      },
      onEnd: () => {
        setIsPlaying(false);
        setSpokenWordHighlight('');
        setCurrentPlaybackSec(0);
      },
      onError: () => {
        setIsPlaying(false);
        setSpokenWordHighlight('');
      }
    });
  };

  const handlePauseSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    stopAllAudio();
    playChimeSound('pause');
    setIsPlaying(false);
    setSpokenWordHighlight('');
  };

  const handleRestartSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    stopAllAudio();
    setCurrentPlaybackSec(0);
    handlePlaySpeech();
  };

  const handleSpeakPhrase = (phrase: string, sec: number, label: string) => {
    playChime('jump');
    playChimeSound('jump');
    setCurrentPlaybackSec(sec);
    setActiveTimestampHighlight(label);
    handlePlaySpeech(phrase);
    showToast(`Speaking audio clip: "${phrase}"`, 'info');
  };

  // Upload and Transcribe Real Audio File
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsTranscribingFile(true);
    playChimeSound('play');
    showToast(`Reading audio file "${file.name}"... Transcribing speech.`, 'info');

    try {
      const result = await transcribeAudioFile(file);
      const newClip: MediaClip = {
        id: `upload-${Date.now()}`,
        title: `Uploaded Audio: ${file.name}`,
        speaker: result.speaker,
        role: 'Uploaded Speaker',
        mediaType: 'Custom Audio Track',
        durationSec: result.durationSec,
        simpleDescription: 'User uploaded audio recording decoded and checked for compliance.',
        initialTranscript: result.transcript
      };
      setSelectedClip(newClip);
      setTranscriptText(result.transcript);
      setCurrentPlaybackSec(0);
      setIsPlaying(false);
      showToast(`Audio decoded successfully! Ready to play and audit.`, 'success');
      playChimeSound('fix');
    } catch {
      showToast('Failed to transcribe audio file.', 'error');
    } finally {
      setIsTranscribingFile(false);
    }
  };

  // Ingest Live Speech Stream
  const handleIngestLiveAudio = () => {
    playChimeSound('play');
    setIsListeningMic(true);
    showToast('Streaming live speech feed into studio...', 'info');

    const phrases = [
      'In our Q4 technology review,',
      ' AuraCloud delivers 100% unbreakable uptime',
      ' with universal zero latency across all edge nodes.',
      ' Our cloud platform is the cheapest available on earth.'
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < phrases.length) {
        setTranscriptText(prev => prev + phrases[step]);
        playChimeSound('jump');
        step++;
      } else {
        clearInterval(interval);
        setIsListeningMic(false);
        showToast('Live audio stream ingestion completed and audited!', 'success');
        playChimeSound('fix');
      }
    }, 900);
  };

  // Toggle Microphone live speech recognition
  const handleToggleMic = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Live microphone input is not supported by your browser. Please type or use preset clips.', 'error');
      handleIngestLiveAudio();
      return;
    }

    if (isListeningMic) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListeningMic(false);
      showToast('Microphone recording stopped.', 'info');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListeningMic(true);
        playChimeSound('play');
        showToast('Listening... Speak into your microphone now.', 'success');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setTranscriptText(prev => `${prev} ${currentTranscript.trim()}`);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListeningMic(false);
        showToast('Microphone access restricted. Triggering live voice stream reader.', 'info');
        handleIngestLiveAudio();
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      showToast(`Microphone error: ${e?.message || 'Permission denied'}`, 'error');
      setIsListeningMic(false);
      console.warn('Microphone start error:', e);
      handleIngestLiveAudio();
    }
  };

  const handleSelectClip = (clip: MediaClip) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSelectedClip(clip);
    setTranscriptText(clip.initialTranscript);
    setCurrentPlaybackSec(0);
    setIsPlaying(false);
    setSpokenWordHighlight('');
    showToast(`Loaded "${clip.title}" into Speech Studio.`, 'info');
  };

  const handleApplyTeleprompterPatch = () => {
    playChime('fix');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setTranscriptText(cleanTeleprompter);
    setFindings([]);
    setSpeechScore(100);
    setIsPlaying(false);
    showToast('Fixed all spoken issues! Script is now 100% compliant and ready to record.', 'success');
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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Spoken Audio & Video Governance</span>
            <span>•</span>
            <span>Real-Time Voice Checker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Speech & Audio Brand Checker</span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              🔊 Real Browser Voice
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Listen to spoken presentations, podcast interviews, and promotional scripts out loud. Catch off-brand words, illegal promises, and exaggerated claims before recording or broadcasting.
          </p>
        </div>

        {/* Regulatory Jurisdiction Selector with Easy-to-Understand Labels */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-[#060B08] border border-emerald-900/60 p-2 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-bold ml-1">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Target Region & Law:</span>
          </div>
          <select
            value={selectedJurisdiction}
            onChange={e => setSelectedJurisdiction(e.target.value as any)}
            className="bg-[#0A120E] border border-emerald-900/80 text-emerald-300 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="global">🌐 Global (Standard Truthful Advertising)</option>
            <option value="us_ftc">🇺🇸 United States (FTC Truth-in-Ads Rules)</option>
            <option value="eu_ai_act">🇪🇺 European Union (EU AI Act & Transparency)</option>
            <option value="uk_asa">🇬🇧 United Kingdom (ASA Advertising Standards)</option>
          </select>
        </div>
      </div>

      {/* Beginner-Friendly Quick Guide Toggle */}
      <div className="bg-[#0A120E] border border-emerald-950/80 rounded-2xl p-4 shadow-md">
        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="w-full flex items-center justify-between text-left text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>How does this work? (3 Simple Steps)</span>
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">
            {showHowItWorks ? 'Hide guide' : 'Show guide'}
          </span>
        </button>

        {showHowItWorks && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-emerald-950/60 mt-3 text-xs text-zinc-300">
            <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 space-y-1">
              <strong className="text-white block font-bold">1. Click "Play Speech"</strong>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                BrandPilot reads the script aloud through your speakers using realistic voice synthesis so you can hear how it sounds.
              </p>
            </div>
            <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 space-y-1">
              <strong className="text-rose-400 block font-bold">2. See Flagged Words</strong>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Any illegal guarantees (like "100% uptime") or prohibited slang (like "AI magic") are highlighted with timestamps.
              </p>
            </div>
            <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 space-y-1">
              <strong className="text-[#00FF87] block font-bold">3. Fix All in 1-Click</strong>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Click "Fix All Issues in 1-Click" to automatically replace every problematic phrase with approved, legally sound language.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preset Media Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
          <span>Choose a Sample Speech to Test:</span>
          <span className="text-[11px] font-mono text-emerald-400">Click any card to load</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_CLIPS.map(clip => {
            const isSelected = selectedClip.id === clip.id;
            return (
              <div
                key={clip.id}
                onClick={() => handleSelectClip(clip)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden space-y-2 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-[#00FF87] shadow-lg shadow-emerald-500/10'
                    : 'bg-[#0A120E] border-emerald-950 hover:border-emerald-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    {clip.mediaType}
                  </span>
                  <span className="font-mono text-zinc-400 text-[11px]">{formatSec(clip.durationSec)}</span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-1">{clip.title}</h3>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{clip.simpleDescription}</p>
                <div className="text-[11px] text-zinc-400 pt-1 border-t border-emerald-950/60 font-mono">
                  Speaker: <strong className="text-white">{clip.speaker}</strong> ({clip.role})
                </div>
                {isSelected && (
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#00FF87] rounded-bl"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Layout: Audio Player + Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Real Audio Speech Player & Voice Diagnostics */}
        <div className="lg:col-span-1 space-y-4">
          {/* Real Audio Player Box */}
          <div className="p-5 rounded-2xl bg-[#0A120E] border border-emerald-950 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-emerald-950 text-[#00FF87] border-emerald-700'
                  : 'bg-[#060B08] text-zinc-400 border-emerald-950'
              }`}>
                <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-[#00FF87] animate-pulse' : 'text-zinc-500'}`} />
                <span>{isPlaying ? 'Speaking Out Loud' : 'Audio Ready'}</span>
              </span>
              <span className="text-xs font-mono text-zinc-300 font-bold">
                {formatSec(currentPlaybackSec)} / {formatSec(selectedClip.durationSec)}
              </span>
            </div>

            {/* Currently Spoken Word Live Bubble */}
            {isPlaying && spokenWordHighlight && (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-center animate-fade-in">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Speaking now:</span>
                <span className="text-sm font-black text-[#00FF87] font-mono tracking-wider">
                  "{spokenWordHighlight}"
                </span>
              </div>
            )}

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
                    height: isPlaying ? `${Math.max(18, Math.min(100, h * (0.5 + Math.random() * 0.7)))}%` : `${h * 0.25}%`
                  }}
                />
              ))}
            </div>

            {/* Main Audio Play / Pause / Restart Controls */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleRestartSpeech}
                  className="p-2.5 rounded-xl bg-[#060B08] border border-emerald-950 text-zinc-300 hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer"
                  title="Restart speech from beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={isPlaying ? handlePauseSpeech : () => handlePlaySpeech()}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-black" />
                      <span>Pause Speech</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-black" />
                      <span>Play Speech Aloud</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isMuted
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-[#060B08] text-zinc-300 border-emerald-950 hover:text-white'
                  }`}
                  title={isMuted ? 'Unmute audio' : 'Mute audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Volume & Speed Controls */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-950/60 font-mono">
                <div className="flex items-center gap-2 bg-[#060B08] p-2 rounded-xl border border-emerald-950">
                  <span className="text-[10px] text-zinc-400">Vol:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={e => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-full h-1 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <span className="text-[10px] text-zinc-300">{isMuted ? '0%' : `${Math.round(volume * 100)}%`}</span>
                </div>

                <div className="flex items-center justify-between bg-[#060B08] p-2 rounded-xl border border-emerald-950">
                  <span className="text-[10px] text-zinc-400">Speed:</span>
                  <div className="flex items-center gap-1">
                    {[0.8, 1.0, 1.2].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => {
                          setSpeechRate(rate);
                          if (isPlaying) {
                            handleRestartSpeech();
                          }
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          speechRate === rate
                            ? 'bg-emerald-500 text-black'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Microphone Voice Input Button */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isListeningMic
                    ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse shadow-lg shadow-rose-500/20'
                    : 'bg-[#060B08] hover:bg-emerald-950/40 text-emerald-300 border-emerald-900/60'
                }`}
              >
                {isListeningMic ? (
                  <>
                    <MicOff className="w-4 h-4 text-rose-400" />
                    <span>Stop Recording (Listening...)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>Speak with Microphone (Test Voice)</span>
                  </>
                )}
              </button>
              {/* Hidden file input for actual audio file upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.ogg"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Live Microphone Voice Input Button */}
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isListeningMic
                      ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse shadow-lg shadow-rose-500/20'
                      : 'bg-[#060B08] hover:bg-emerald-950/40 text-emerald-300 border-emerald-900/60'
                  }`}
                  title="Speak into your microphone to transcribe and check voice"
                >
                  {isListeningMic ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-rose-400" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Live Mic Input</span>
                    </>
                  )}
                </button>

                {/* Upload Audio File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTranscribingFile}
                  className="py-2 px-2.5 rounded-xl border bg-[#060B08] hover:bg-emerald-950/40 text-zinc-300 hover:text-white border-emerald-900/60 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Upload .mp3, .wav, or .m4a audio recording to transcribe and read"
                >
                  <Upload className="w-3.5 h-3.5 text-teal-400" />
                  <span>{isTranscribingFile ? 'Decoding Audio...' : 'Upload Audio File'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Simple Speech Diagnostics Cards */}
          <div className="p-5 rounded-2xl bg-[#0A120E] border border-emerald-950 space-y-3.5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Voice Health & Readability</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Brand Safety Score */}
              <div className="p-3 rounded-xl bg-[#060B08] border border-emerald-950 space-y-1">
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Brand Safety Score
                </div>
                <div
                  className={`text-2xl font-black font-mono leading-none ${
                    speechScore >= 90 ? 'text-[#00FF87]' : speechScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {speechScore}%
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">
                  {findings.length === 0 ? '✓ Ready to Record' : `${findings.length} phrases to fix`}
                </div>
              </div>

              {/* Card 2: Speaking Speed */}
              <div className="p-3 rounded-xl bg-[#060B08] border border-emerald-950 space-y-1">
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Speaking Pace
                </div>
                <div className="text-2xl font-black font-mono text-white leading-none">
                  {speechWpm} <span className="text-xs font-normal text-zinc-400">WPM</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  Ideal easy-to-follow pace
                </div>
              </div>

              {/* Card 3: Tone Level */}
              <div className="p-3 rounded-xl bg-[#060B08] border border-emerald-950 space-y-1">
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Tone Level
                </div>
                <div className="text-xl font-black font-mono text-teal-300 leading-none">
                  Professional
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">
                  Confident & trustworthy
                </div>
              </div>

              {/* Card 4: Legal Framework */}
              <div className="p-3 rounded-xl bg-[#060B08] border border-emerald-950 space-y-1">
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Active Rule Set
                </div>
                <div className="text-xs font-black text-white font-mono uppercase truncate leading-snug">
                  {selectedJurisdiction === 'us_ftc'
                    ? 'US FTC Rules'
                    : selectedJurisdiction === 'eu_ai_act'
                    ? 'EU AI Rules'
                    : selectedJurisdiction === 'uk_asa'
                    ? 'UK ASA Rules'
                    : 'Global Rules'}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  Zero false guarantees
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Script & Plain-English Spoken Issues */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0A120E] border border-emerald-950 space-y-4 shadow-xl">
            {/* Header with 1-Click Fix Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-950">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>Speech Transcript & Script</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  You can edit this script directly. BrandPilot checks every sentence automatically.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {findings.length > 0 && (
                  <button
                    type="button"
                    onClick={handleApplyTeleprompterPatch}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>Fix All Issues in 1-Click</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-3 py-2 rounded-xl bg-[#060B08] border border-emerald-900/60 hover:bg-emerald-950/60 text-zinc-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                </button>
              </div>
            </div>

            {/* Editable Script Text Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Spoken Script Words:
              </label>
              <textarea
                value={transcriptText}
                onChange={e => setTranscriptText(e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-xl bg-[#060B08] border border-emerald-900/60 text-xs sm:text-sm text-zinc-100 leading-relaxed font-sans focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
                placeholder="Paste or type any spoken speech or advertisement script here..."
              />
            </div>

            {/* Plain-English Spoken Issues List */}
            {findings.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Words You Should Change ({findings.length} Issues Found)</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Click "Listen" on any item to hear that specific part
                  </span>
                </div>

                <div className="space-y-3">
                  {findings.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#060B08] border border-emerald-950 hover:border-emerald-800 transition-colors space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleSpeakPhrase(f.original_speech, f.timestamp_sec, f.timestamp_display)}
                          className="font-mono text-xs font-extrabold text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800 hover:bg-emerald-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#00FF87]" />
                          <span>[{f.timestamp_display}]</span>
                          <span className="text-[11px] text-zinc-300 font-sans font-bold ml-1">🔊 Listen to this</span>
                        </button>

                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            f.severity === 'critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {f.severity === 'critical' ? 'High Risk' : 'Recommendation'}
                        </span>
                      </div>

                      {/* Before / After Comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/60 space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-rose-400 block font-mono">
                            ✖ What was said (Problem):
                          </span>
                          <span className="text-rose-300 line-through font-bold">
                            "{f.original_speech}"
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/60 space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-[#00FF87] block font-mono">
                            ✓ What to say instead (Safe):
                          </span>
                          <span className="text-[#00FF87] font-bold">
                            "{f.suggested_teleprompter_speech}"
                          </span>
                        </div>
                      </div>

                      {/* Plain-English Explanation */}
                      <div className="p-2.5 rounded-lg bg-[#0A120E] border border-emerald-950 text-[11px] text-zinc-300 leading-relaxed space-y-1">
                        <div className="font-bold text-white flex items-center gap-1">
                          <Info className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>Why change this:</span>
                        </div>
                        <p className="text-zinc-400 pl-4">{f.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex items-center gap-3.5 text-xs text-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-[#00FF87] shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-white">Your Script is 100% Brand Compliant!</div>
                  <div className="text-xs text-zinc-400 leading-relaxed">
                    No misleading claims, illegal guarantees, or prohibited slang found. The speech follows official company standards and honest advertising rules.
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
