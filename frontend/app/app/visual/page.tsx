'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  VisualFinding,
  VisualInspectionReport,
  ColorClusterInfo,
  ContrastCheckZone
} from '@/lib/types';
import {
  Palette,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Code,
  FileCode,
  Sliders,
  Download,
  Type,
  Maximize2,
  Minimize2,
  Layers,
  Eye,
  EyeOff,
  AlertCircle,
  Zap,
  Lock,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ExtractedColor {
  hex: string;
  percentage: number;
  isCompliant: boolean;
  role: string;
}

export default function VisualIdentityPage() {
  const {
    currentWorkspace,
    showToast,
    activeVisualReport,
    setActiveVisualReport,
    inspectVisualGraphic,
    inspectVisualPreset,
    visualPresets
  } = useBrandPilot();

  // Navigation tab
  const [activeVisualTab, setActiveVisualTab] = useState<'inspector' | 'colors' | 'logo' | 'typography'>('inspector');

  // Inspection Studio State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-aura-compliant');
  const [isInspecting, setIsInspecting] = useState(false);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [findingCategoryFilter, setFindingCategoryFilter] = useState<string>('all');
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);

  // Overlay layer visibility toggles
  const [showColorOverlays, setShowColorOverlays] = useState(true);
  const [showLogoOverlays, setShowLogoOverlays] = useState(true);
  const [showTextOverlays, setShowTextOverlays] = useState(true);
  const [showContrastOverlays, setShowContrastOverlays] = useState(true);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const studioFileInputRef = useRef<HTMLInputElement>(null);

  // Initial load: trigger default preset inspection if no report active
  useEffect(() => {
    if (!activeVisualReport) {
      inspectVisualPreset('preset-aura-compliant');
    }
  }, []);

  // --- TAB 1 (Colors) State & Logic ---
  const [hexInput, setHexInput] = useState('#10B981');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<ExtractedColor[]>([
    { hex: '#050806', percentage: 48, isCompliant: true, role: 'Approved Brand Token (Obsidian Pitch)' },
    { hex: '#10B981', percentage: 26, isCompliant: true, role: 'Approved Brand Token (Electric Emerald)' },
    { hex: '#0A120E', percentage: 16, isCompliant: true, role: 'Approved Brand Token (Elevated Surface)' },
    { hex: '#00FF87', percentage: 6, isCompliant: true, role: 'Approved Brand Token (Neon Green)' },
    { hex: '#DC2626', percentage: 4, isCompliant: false, role: 'Off-Brand Color Token (Delta E > 2.5)' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenFormat, setTokenFormat] = useState<'css' | 'tailwind' | 'json'>('css');

  // Typography test string state
  const [typographySample, setTypographySample] = useState(
    'AuraCloud delivers unified multi-cloud governance and automated infrastructure management for Fortune 500 enterprises.'
  );

  const brandColors = [
    { name: 'Obsidian Pitch', hex: currentWorkspace.primary_color || '#050806', role: 'Main background and canvas surface' },
    { name: 'Elevated Surface', hex: currentWorkspace.secondary_color || '#0A120E', role: 'Cards, elevated panels, dialogs' },
    { name: 'Electric Emerald', hex: currentWorkspace.accent_color || '#10B981', role: 'Primary CTAs, glowing highlights, badges' },
    { name: 'Neon Green', hex: '#00FF87', role: 'Active indicators, live state pings' },
    { name: 'Warning Amber', hex: '#F59E0B', role: 'Review pending, non-blocking suggestions' },
    { name: 'Danger Rose', hex: '#EF4444', role: 'Critical policy violations, prohibited terms' }
  ];

  // Perceptual color classifier using Euclidean RGB distance
  const classifyColorToken = (hex: string) => {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return { isCompliant: false, role: 'Invalid Token', nearest: brandColors[0], distance: 999 };
    const cr = parseInt(clean.slice(0, 2), 16);
    const cg = parseInt(clean.slice(2, 4), 16);
    const cb = parseInt(clean.slice(4, 6), 16);

    let nearest = brandColors[0];
    let minDistance = Infinity;

    brandColors.forEach(bc => {
      const bClean = bc.hex.replace('#', '');
      const br = parseInt(bClean.slice(0, 2), 16);
      const bg = parseInt(bClean.slice(2, 4), 16);
      const bb = parseInt(bClean.slice(4, 6), 16);
      const dist = Math.sqrt(Math.pow(cr - br, 2) + Math.pow(cg - bg, 2) + Math.pow(cb - bb, 2));
      if (dist < minDistance) {
        minDistance = dist;
        nearest = bc;
      }
    });

    const isCompliant = minDistance <= 38;
    return {
      isCompliant,
      role: isCompliant ? `Approved Brand Token (${nearest.name})` : `Off-Brand Color Token (Nearest: ${nearest.name})`,
      nearest,
      distance: Math.round(minDistance)
    };
  };

  const currentClassification = classifyColorToken(hexInput);
  const isExactBrandColor = currentClassification.isCompliant;

  // WCAG 2.1 Contrast Ratio Calculator
  const wcagMetrics = useMemo(() => {
    const calculateLuminance = (hex: string) => {
      const clean = hex.replace('#', '');
      if (clean.length !== 6) return 0.5;
      const r = parseInt(clean.slice(0, 2), 16) / 255;
      const g = parseInt(clean.slice(2, 4), 16) / 255;
      const b = parseInt(clean.slice(4, 6), 16) / 255;
      const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };

    const calculateRatio = (hex1: string, hex2: string) => {
      const lum1 = calculateLuminance(hex1);
      const lum2 = calculateLuminance(hex2);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
    };

    const ratioOnWhite = calculateRatio(hexInput, '#FFFFFF');
    const ratioOnObsidian = calculateRatio(hexInput, '#050806');

    return {
      ratioOnWhite,
      ratioOnObsidian,
      passAANormalWhite: ratioOnWhite >= 4.5,
      passAALargeWhite: ratioOnWhite >= 3.0,
      passAAAWhite: ratioOnWhite >= 7.0,
      passAANormalObsidian: ratioOnObsidian >= 4.5,
      passAALargeObsidian: ratioOnObsidian >= 3.0,
      passAAAObsidian: ratioOnObsidian >= 7.0
    };
  }, [hexInput]);

  const handleCopy = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    showToast(`Copied ${hex} to clipboard!`, 'success');
  };

  // Studio: Handle switching presets
  const handleSelectPreset = async (presetId: string) => {
    setSelectedPresetId(presetId);
    setCustomImagePreview(null);
    setSelectedFindingId(null);
    setIsInspecting(true);
    await inspectVisualPreset(presetId);
    setIsInspecting(false);
  };

  // Studio: Handle custom upload
  const handleStudioGraphicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setCustomImagePreview(previewUrl);
      setSelectedPresetId('custom');
      setSelectedFindingId(null);
      setIsInspecting(true);
      await inspectVisualGraphic(file);
      setIsInspecting(false);
    }
  };

  // Filtered findings list
  const filteredFindings = useMemo(() => {
    if (!activeVisualReport?.findings) return [];
    if (findingCategoryFilter === 'all') return activeVisualReport.findings;
    return activeVisualReport.findings.filter(f => f.category === findingCategoryFilter);
  }, [activeVisualReport, findingCategoryFilter]);

  // Selected finding details
  const activeSelectedFinding = useMemo(() => {
    if (!selectedFindingId || !activeVisualReport?.findings) return null;
    return activeVisualReport.findings.find(f => f.id === selectedFindingId) || null;
  }, [selectedFindingId, activeVisualReport]);

  // Export inspection audit
  const handleExportAudit = () => {
    if (!activeVisualReport) return;
    const jsonStr = JSON.stringify(activeVisualReport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brandpilot-visual-inspection-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Visual compliance inspection report exported as JSON!', 'success');
  };

  // Quick fix simulator
  const handleApplyRemediation = (finding: VisualFinding) => {
    showToast(`Applied design fix: ${finding.remediation_action || 'Remediated element'}`, 'success');
    setSelectedFindingId(null);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Visual Design & Marketing Graphics Checker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Visual Brand Compliance & Design Inspection</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Visual Scanner
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Automatically check your ads, banners, and social posts. Catches off-brand colors, distorted or crowded logos, and hard-to-read text before publishing.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#0A120E] p-1 rounded-xl border border-emerald-950 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveVisualTab('inspector')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeVisualTab === 'inspector'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inspection Studio</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveVisualTab('colors')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeVisualTab === 'colors'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Brand Colors</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveVisualTab('logo')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeVisualTab === 'logo'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Logo Spacing</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveVisualTab('typography')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeVisualTab === 'typography'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Font Sizing</span>
          </button>
        </div>
      </div>

      {/* Beginner's 3-Step Guide (Easy for Anyone) */}
      <div className="bg-[#0A120E] rounded-2xl p-4 sm:p-5 border border-emerald-950/80 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>How Visual Inspection Works (3 Simple Steps)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950">
            <div className="font-bold text-white mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-mono flex items-center justify-center font-bold">1</span>
              <span>Pick or Upload Graphic</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Click a demo ad below, or click <strong>Upload Custom Graphic</strong> to test your own PNG or JPG design.
            </p>
          </div>
          <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950">
            <div className="font-bold text-white mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-mono flex items-center justify-center font-bold">2</span>
              <span>Automatic Brand Check</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              We check your colors against official brand tokens, make sure your logo has clean breathing room, and read the text to catch forbidden words.
            </p>
          </div>
          <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950">
            <div className="font-bold text-white mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-mono flex items-center justify-center font-bold">3</span>
              <span>Click Any Box to Fix</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Click on any colored box on the design image to see the problem in plain English and apply the recommended fix.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB: DESIGN INSPECTION STUDIO (CORE FEATURE) */}
      {/* ========================================================================= */}
      {activeVisualTab === 'inspector' && (
        <div className="space-y-6 animate-fade-in">
          {/* Action & Preset Bar */}
          <div className="bg-[#0A120E] rounded-2xl p-4 sm:p-5 border border-emerald-950/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mr-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Demo Creatives:</span>
              </span>

              {visualPresets.map(preset => {
                const isSelected = selectedPresetId === preset.id && !customImagePreview;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    disabled={isInspecting}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? preset.status === 'compliant'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                        : 'bg-[#060B08] text-zinc-400 border-emerald-950 hover:border-emerald-800 hover:text-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${preset.status === 'compliant' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span>{preset.title.split('(')[0].trim()}</span>
                    <span className="text-[10px] font-mono opacity-80">({preset.expected_score}%)</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={studioFileInputRef}
                onChange={handleStudioGraphicUpload}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => studioFileInputRef.current?.click()}
                disabled={isInspecting}
                className="px-3.5 py-1.5 bg-[#060B08] border border-emerald-900/60 hover:border-emerald-500 text-zinc-200 hover:text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Custom Graphic</span>
              </button>

              <button
                type="button"
                onClick={handleExportAudit}
                disabled={!activeVisualReport}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit JSON</span>
              </button>
            </div>
          </div>

          {/* Health & Score Overview Banner */}
          {activeVisualReport && (
            <div className="bg-[#0A120E] rounded-2xl p-5 border border-emerald-950/80 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Composite Score Card */}
                <div className="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-emerald-950/80 pb-4 lg:pb-0 lg:pr-5">
                  <div className="relative shrink-0 flex items-center justify-center">
                    <div className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center p-2 text-center shadow-inner ${
                      activeVisualReport.score.composite_score >= 90
                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : activeVisualReport.score.composite_score >= 70
                        ? 'bg-amber-950/60 border-amber-800 text-amber-400'
                        : 'bg-rose-950/60 border-rose-800 text-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    }`}>
                      <span className="text-2xl font-black font-mono leading-none">
                        {activeVisualReport.score.composite_score}%
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider mt-1 opacity-80">
                        Health Score
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      {activeVisualReport.score.composite_score >= 90 ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Compliant & Approved</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-bold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-rose-400" />
                          <span>Publishing Blocked</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {activeVisualReport.score.compliance_grade}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Dimensions: {activeVisualReport.asset_dimensions} • {activeVisualReport.findings.length} findings
                    </p>
                  </div>
                </div>

                {/* 4 Vector Sub-Scores */}
                <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Vector 1: Color */}
                  <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 flex items-center gap-1 font-semibold">
                        <Palette className="w-3 h-3 text-emerald-400" />
                        <span>Color Match</span>
                      </span>
                      <span className="font-mono font-bold text-white">
                        {activeVisualReport.score.color_palette_score}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#0A120E] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          activeVisualReport.score.color_palette_score >= 80 ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${activeVisualReport.score.color_palette_score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate">Official brand colors</span>
                  </div>

                  {/* Vector 2: Logo */}
                  <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 flex items-center gap-1 font-semibold">
                        <Maximize2 className="w-3 h-3 text-emerald-400" />
                        <span>Logo & Margins</span>
                      </span>
                      <span className="font-mono font-bold text-white">
                        {activeVisualReport.score.logo_integrity_score}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#0A120E] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          activeVisualReport.score.logo_integrity_score >= 80 ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${activeVisualReport.score.logo_integrity_score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate">Clean breathing room</span>
                  </div>

                  {/* Vector 3: OCR Copy */}
                  <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 flex items-center gap-1 font-semibold">
                        <Type className="w-3 h-3 text-emerald-400" />
                        <span>Text in Graphic</span>
                      </span>
                      <span className="font-mono font-bold text-white">
                        {activeVisualReport.score.embedded_copy_score}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#0A120E] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          activeVisualReport.score.embedded_copy_score >= 80 ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${activeVisualReport.score.embedded_copy_score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate">No forbidden claims</span>
                  </div>

                  {/* Vector 4: Accessibility */}
                  <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 flex items-center gap-1 font-semibold">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Readability</span>
                      </span>
                      <span className="font-mono font-bold text-white">
                        {activeVisualReport.score.wcag_contrast_score}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#0A120E] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          activeVisualReport.score.wcag_contrast_score >= 80 ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${activeVisualReport.score.wcag_contrast_score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate">Sharp contrast</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Inspection Grid: Graphic Canvas + Findings Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT / CENTER (Col 8): Interactive Graphic Canvas & Bounding Box Overlays */}
            <div className="lg:col-span-7 xl:col-span-8 bg-[#0A120E] rounded-2xl p-5 border border-emerald-950/80 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-950/80">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-white uppercase tracking-wider">
                    Design Canvas & Scanner
                  </h2>
                  {isInspecting && <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />}
                </div>

                {/* Layer Toggles */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  <span className="text-zinc-400 mr-1 font-bold">Show boxes:</span>
                  <button
                    type="button"
                    onClick={() => setShowColorOverlays(!showColorOverlays)}
                    className={`px-2 py-0.5 rounded-lg border font-mono transition-all cursor-pointer ${
                      showColorOverlays
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                        : 'bg-[#060B08] text-zinc-400 border-emerald-950 line-through opacity-50'
                    }`}
                  >
                    🎨 Palette
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLogoOverlays(!showLogoOverlays)}
                    className={`px-2 py-0.5 rounded-lg border font-mono transition-all cursor-pointer ${
                      showLogoOverlays
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                        : 'bg-[#060B08] text-zinc-400 border-emerald-950 line-through opacity-50'
                    }`}
                  >
                    🏷️ Logo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTextOverlays(!showTextOverlays)}
                    className={`px-2 py-0.5 rounded-lg border font-mono transition-all cursor-pointer ${
                      showTextOverlays
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                        : 'bg-[#060B08] text-zinc-400 border-emerald-950 line-through opacity-50'
                    }`}
                  >
                    📝 Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContrastOverlays(!showContrastOverlays)}
                    className={`px-2 py-0.5 rounded-lg border font-mono transition-all cursor-pointer ${
                      showContrastOverlays
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                        : 'bg-[#060B08] text-zinc-400 border-emerald-950 line-through opacity-50'
                    }`}
                  >
                    👁️ WCAG
                  </button>
                </div>
              </div>

              {/* Graphic Canvas Display Container */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-950 bg-[#050806] select-none shadow-2xl min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
                {/* 1. Custom Upload Image rendering */}
                {customImagePreview ? (
                  <img
                    src={customImagePreview}
                    alt="Uploaded marketing asset"
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                ) : selectedPresetId === 'preset-aura-compliant' ? (
                  /* 2. Preset: Compliant Banner Mock */
                  <div className="w-full h-full p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-[#050806] via-[#0A120E] to-[#07130C] min-h-[420px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-black text-base shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                          AC
                        </div>
                        <span className="text-xl font-black tracking-tight text-white font-sans">
                          AuraCloud<span className="text-emerald-400">.</span>
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold font-mono">
                        Enterprise Cloud Platform
                      </span>
                    </div>

                    <div className="space-y-3 my-8">
                      <div className="inline-block px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-[#00FF87] text-xs font-mono font-bold">
                        Q4 2026 INFRASTRUCTURE RELEASE
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight max-w-xl">
                        Verifiable Continuous Compliance for Multi-Cloud Architectures
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
                        Automated deterministic brand governance, zero-trust cryptographic ledger seals, and real-time enterprise telemetry.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-emerald-950/60">
                      <button type="button" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs shadow-lg hover:bg-emerald-400 transition-colors">
                        Deploy Enterprise Cloud
                      </button>
                      <span className="text-[11px] font-mono text-zinc-500">
                        MSA SLA Credit 99.99% • FIPS-140-3 Validated
                      </span>
                    </div>
                  </div>
                ) : selectedPresetId === 'preset-ad-superlatives-red' ? (
                  /* 3. Preset: Social Ad with Off-Brand Red and Superlatives */
                  <div className="w-full h-full flex flex-col justify-between bg-[#050806] min-h-[440px]">
                    <div className="p-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-black text-base">
                            AC
                          </div>
                          <span className="text-lg font-black tracking-tight text-white font-sans">
                            AuraCloud
                          </span>
                        </div>
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          Promo Spotlight
                        </span>
                      </div>

                      <div className="space-y-2 pt-4">
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                          The <span className="underline decoration-rose-500 decoration-2 text-rose-300">cheapest</span> cloud platform with <span className="underline decoration-rose-500 decoration-2 text-rose-300">guaranteed 100% uptime</span> and <span className="underline decoration-rose-500 decoration-2 text-rose-300">AI magic</span>!
                        </h2>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Automate all IT workloads without thinking. India's No. 1 provider.
                        </p>
                      </div>
                    </div>

                    {/* Off-Brand Red Fill Banner at Bottom */}
                    <div className="p-6 bg-[#DC2626] flex items-center justify-between text-zinc-400 shadow-inner">
                      <div>
                        <div className="text-sm font-black text-white">GET STARTED TODAY</div>
                        <div className="text-[11px] text-zinc-300">Promotional terms apply. Free trial.</div>
                      </div>
                      <button type="button" className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold">
                        Claim Discount
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 4. Preset: Distorted Logo & Clear-Space Encroachment */
                  <div className="w-full h-full p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-b from-[#050806] to-[#0A120E] min-h-[420px]">
                    <div className="space-y-1">
                      {/* Distorted horizontally stretched logo */}
                      <div className="w-44 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-black text-lg scale-x-125 origin-left shadow-lg">
                        AuraCloud
                      </div>
                      {/* Tagline encroaching into 0.5H margin */}
                      <div className="text-sm font-extrabold text-emerald-400 pt-1 tracking-tight">
                        ANNUAL ENTERPRISE SUMMIT 2026
                      </div>
                    </div>

                    <div className="my-8 space-y-2">
                      <h2 className="text-3xl font-black text-white tracking-tight">
                        Unstoppable Multi-Cloud Architecture
                      </h2>
                      <p className="text-xs text-zinc-400 max-w-lg">
                        Global keynote demonstrations on serverless data orchestration and verifiable compliance.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-emerald-950 text-[10px] text-zinc-600 font-mono">
                      * AuraCloud is a registered trademark. All rights reserved. Confidential preliminary collateral.
                    </div>
                  </div>
                )}

                {/* OVERLAY BOUNDING BOXES */}
                {activeVisualReport?.findings?.map(finding => {
                  const bbox = finding.bounding_box;
                  if (!bbox) return null;

                  // Visibility checks based on layer toggles
                  if (finding.category === 'color_divergence' && !showColorOverlays) return null;
                  if ((finding.category === 'logo_distortion' || finding.category === 'logo_clearance') && !showLogoOverlays) return null;
                  if (finding.category === 'embedded_text_violation' && !showTextOverlays) return null;
                  if (finding.category === 'contrast_accessibility' && !showContrastOverlays) return null;

                  const isSelected = selectedFindingId === finding.id;

                  // Border & Badge styling based on category
                  let borderClass = 'border-amber-400 bg-amber-500/10';
                  let badgeText = 'Issue';
                  let badgeBg = 'bg-amber-500 text-black';

                  if (finding.category === 'color_divergence') {
                    borderClass = 'border-rose-500 bg-rose-500/15 border-dashed';
                    badgeText = `Off-Brand: ${finding.detected_value}`;
                    badgeBg = 'bg-rose-500 text-white';
                  } else if (finding.category === 'logo_distortion') {
                    borderClass = 'border-purple-500 bg-purple-500/15 border-dashed';
                    badgeText = `Distortion: ${finding.detected_value}`;
                    badgeBg = 'bg-purple-600 text-white';
                  } else if (finding.category === 'logo_clearance') {
                    borderClass = 'border-amber-500 bg-amber-500/15 border-dotted';
                    badgeText = `Clearance Breach (< 0.5H)`;
                    badgeBg = 'bg-amber-500 text-black';
                  } else if (finding.category === 'embedded_text_violation') {
                    borderClass = 'border-rose-500 bg-rose-500/20';
                    badgeText = `Prohibited Copy: "${finding.detected_value}"`;
                    badgeBg = 'bg-rose-600 text-white';
                  } else if (finding.category === 'contrast_accessibility') {
                    borderClass = 'border-cyan-400 bg-cyan-500/15 border-dashed';
                    badgeText = `WCAG Fail: ${finding.detected_value}`;
                    badgeBg = 'bg-cyan-500 text-black';
                  }

                  return (
                    <div
                      key={finding.id}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedFindingId(isSelected ? null : finding.id);
                      }}
                      style={{
                        position: 'absolute',
                        left: `${bbox.x_pct}%`,
                        top: `${bbox.y_pct}%`,
                        width: `${bbox.w_pct}%`,
                        height: `${bbox.h_pct}%`
                      }}
                      className={`border-2 rounded-lg cursor-pointer transition-all z-20 flex flex-col justify-start p-1 ${borderClass} ${
                        isSelected
                          ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-black shadow-2xl scale-[1.01]'
                          : 'hover:border-white'
                      }`}
                      title={finding.title}
                    >
                      {/* Floating Indicator Badge */}
                      <span className={`self-start text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow-md truncate max-w-full ${badgeBg}`}>
                        {badgeText}
                      </span>
                    </div>
                  );
                })}

                {/* Logo Exclusion Safe Zone Overlay (when Logo toggled) */}
                {showLogoOverlays && activeVisualReport?.logo_inspection?.exclusion_zone_box && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${activeVisualReport.logo_inspection.exclusion_zone_box.x_pct}%`,
                      top: `${activeVisualReport.logo_inspection.exclusion_zone_box.y_pct}%`,
                      width: `${activeVisualReport.logo_inspection.exclusion_zone_box.w_pct}%`,
                      height: `${activeVisualReport.logo_inspection.exclusion_zone_box.h_pct}%`
                    }}
                    className={`border border-dashed rounded-xl pointer-events-none z-10 transition-all ${
                      activeVisualReport.logo_inspection.clear_space_passed
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-amber-500/70 bg-amber-500/10'
                    }`}
                  >
                    <span className="absolute top-1 left-1.5 text-[8px] font-mono uppercase font-bold text-emerald-400/80">
                      0.5H Safe Margin Guide
                    </span>
                  </div>
                )}
              </div>

              {/* Interactive Help Bar */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Click any highlighted box on the design above to inspect the issue and fix it.</span>
                </span>
                {selectedFindingId && (
                  <button
                    type="button"
                    onClick={() => setSelectedFindingId(null)}
                    className="text-xs text-emerald-400 hover:underline font-bold cursor-pointer"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT (Col 5): Findings & Remediation Sidebar */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4">
              {/* Category Filter Pills */}
              <div className="bg-[#0A120E] rounded-2xl p-4 border border-emerald-950/80 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Found Issues & Fixes
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {filteredFindings.length} of {activeVisualReport?.findings?.length || 0} issues
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  {[
                    { id: 'all', label: 'All Issues' },
                    { id: 'color_divergence', label: '🎨 Color' },
                    { id: 'logo_distortion', label: '🏷️ Logo' },
                    { id: 'embedded_text_violation', label: '📝 Copy' },
                    { id: 'contrast_accessibility', label: '👁️ WCAG' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFindingCategoryFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        findingCategoryFilter === tab.id
                          ? 'bg-emerald-500 text-black shadow-sm'
                          : 'bg-[#060B08] text-zinc-400 hover:text-white border border-emerald-950'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Finding Detail Card (if any selected) */}
              {activeSelectedFinding && (
                <div className="bg-gradient-to-b from-[#0F1C14] to-[#0A120E] rounded-2xl p-4 border-2 border-emerald-500 shadow-xl space-y-3 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                      Focused Issue
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedFindingId(null)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <h4 className="text-sm font-black text-white leading-snug">
                    {activeSelectedFinding.title}
                  </h4>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {activeSelectedFinding.description}
                  </p>

                  <div className="p-2.5 bg-[#060B08] rounded-xl border border-emerald-950 text-xs space-y-1 font-mono">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Detected:</span>
                      <strong className="text-rose-400">{activeSelectedFinding.detected_value || 'N/A'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Brand Rule:</span>
                      <strong className="text-emerald-400">{activeSelectedFinding.recommended_value || 'Approved Token'}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyRemediation(activeSelectedFinding)}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Apply Recommended Fix</span>
                  </button>
                </div>
              )}

              {/* Scrollable Findings Cards */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredFindings.length === 0 ? (
                  <div className="bg-[#0A120E] rounded-2xl p-8 border border-emerald-950 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">No Visual Violations Found</h4>
                    <p className="text-xs text-zinc-400">
                      This design asset strictly conforms to corporate brand tokens and layout guidelines.
                    </p>
                  </div>
                ) : (
                  filteredFindings.map(finding => {
                    const isSelected = selectedFindingId === finding.id;
                    const isCritical = finding.severity === 'critical' || finding.severity === 'high';

                    return (
                      <div
                        key={finding.id}
                        onClick={() => setSelectedFindingId(isSelected ? null : finding.id)}
                        className={`bg-[#0A120E] rounded-xl p-4 border transition-all cursor-pointer space-y-2.5 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/20 shadow-lg'
                            : 'border-emerald-950/80 hover:border-emerald-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {isCritical ? (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            )}
                            <span className="text-xs font-bold text-white line-clamp-1">
                              {finding.title}
                            </span>
                          </div>
                          <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                            finding.severity === 'critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : finding.severity === 'high'
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-900'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {finding.severity}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                          {finding.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-950/60">
                          <span className="text-zinc-500 font-mono truncate max-w-[180px]">
                            {finding.recommended_value ? `Recommended: ${finding.recommended_value}` : 'Needs Adjustment'}
                          </span>
                          <span className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
                            <span>Fix This</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Extracted Dominant Color Clusters & WCAG Matrix Section */}
          {activeVisualReport && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Dominant Palette Clusters */}
              <div className="bg-[#0A120E] rounded-2xl p-5 border border-emerald-950/80 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Quantized Color Clusters ({activeVisualReport.dominant_colors.length})
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {activeVisualReport.score.color_palette_score}% Compliant
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeVisualReport.dominant_colors.map((cluster, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg border border-emerald-950 shadow-sm shrink-0"
                          style={{ backgroundColor: cluster.hex }}
                        />
                        <div>
                          <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                            <span>{cluster.hex}</span>
                            <span className="text-zinc-500 font-normal">({cluster.percentage}% coverage)</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate max-w-[200px]">
                            {cluster.role || (cluster.is_compliant ? 'Approved Brand Token' : `Diverges (Nearest: ${cluster.nearest_token})`)}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        cluster.is_compliant
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-rose-950/80 text-rose-300 border-rose-800'
                      }`}>
                        {cluster.is_compliant ? 'Approved' : 'Off-Brand'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WCAG 2.1 Contrast Matrix */}
              <div className="bg-[#0A120E] rounded-2xl p-5 border border-emerald-950/80 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      WCAG 2.1 Contrast Matrix
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Target: 4.5:1 (AA)
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeVisualReport.wcag_contrast_checks.map((check, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white">
                          {check.zone_name}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                          <span>Ratio: <strong className="text-white">{check.contrast_ratio}:1</strong></span>
                          <span>•</span>
                          <span>FG: {check.foreground_hex}</span>
                          <span>•</span>
                          <span>BG: {check.background_hex}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          check.wcag_aa_pass
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                            : 'bg-rose-950/70 text-rose-300 border-rose-800/60'
                        }`}>
                          {check.wcag_aa_pass ? 'AA Pass' : 'AA Fail'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          check.wcag_aaa_pass
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                            : 'bg-[#0A120E] text-zinc-500 border-emerald-950'
                        }`}>
                          {check.wcag_aaa_pass ? 'AAA Pass' : 'AAA Fail'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: COLOR TOKENS & PALETTE */}
      {/* ========================================================================= */}
      {activeVisualTab === 'colors' && (
        <div className="space-y-6 animate-fade-in">
          {/* Hex Checker Card */}
          <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Perceptual HEX Color Validator</h2>
                <p className="text-xs text-zinc-400">Classifies candidate color codes using perceptual Euclidean distance against official design tokens</p>
              </div>
              {isExactBrandColor ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {currentClassification.role}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Off-Brand Token (Distance: {currentClassification.distance})
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="color"
                  value={hexInput.startsWith('#') && hexInput.length === 7 ? hexInput : '#10B981'}
                  onChange={e => setHexInput(e.target.value.toUpperCase())}
                  className="w-12 h-12 rounded-xl border border-emerald-900/60 bg-[#060B08] cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={hexInput}
                  onChange={e => setHexInput(e.target.value.toUpperCase())}
                  placeholder="#10B981"
                  className="text-sm font-mono font-bold px-3 py-2.5 border border-emerald-900/60 rounded-xl w-36 uppercase bg-[#060B08] text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div
                className="flex-1 w-full h-12 rounded-xl flex items-center justify-between px-4 font-mono text-xs font-bold shadow-inner"
                style={{
                  backgroundColor: hexInput,
                  color: hexInput.startsWith('#0') || hexInput.startsWith('#1') ? '#FFFFFF' : '#050806'
                }}
              >
                <span>Token: {hexInput} ({currentClassification.role})</span>
                <button
                  type="button"
                  onClick={() => handleCopy(hexInput)}
                  className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[10px] font-sans flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
            </div>

            {/* WCAG Contrast */}
            <div className="pt-4 border-t border-emerald-950/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>WCAG 2.1 Accessibility & Contrast Compliance</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400">Target Standard: AA / AAA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#060B08] border border-emerald-950 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-zinc-200">Contrast against White (#FFFFFF)</div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Ratio: {wcagMetrics.ratioOnWhite}:1</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      wcagMetrics.passAANormalWhite ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60' : 'bg-rose-950/70 text-rose-300 border-rose-800/60'
                    }`}>
                      {wcagMetrics.passAANormalWhite ? 'AA Pass (4.5:1)' : 'AA Fail'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      wcagMetrics.passAAAWhite ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60' : 'bg-[#0A120E] text-zinc-500 border-emerald-950'
                    }`}>
                      {wcagMetrics.passAAAWhite ? 'AAA Pass (7:1)' : 'AAA Fail'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#060B08] border border-emerald-950 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-zinc-200">Contrast against Obsidian (#050806)</div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Ratio: {wcagMetrics.ratioOnObsidian}:1</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      wcagMetrics.passAANormalObsidian ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60' : 'bg-rose-950/70 text-rose-300 border-rose-800/60'
                    }`}>
                      {wcagMetrics.passAANormalObsidian ? 'AA Pass (4.5:1)' : 'AA Fail'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      wcagMetrics.passAAAObsidian ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60' : 'bg-[#0A120E] text-zinc-500 border-emerald-950'
                    }`}>
                      {wcagMetrics.passAAAObsidian ? 'AAA Pass (7:1)' : 'AAA Fail'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Palette Swatches */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">AuraCloud Approved Color Tokens</h2>
                <p className="text-xs text-zinc-400">Official enterprise design tokens enforced across visual media</p>
              </div>
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(true)}
                className="px-3 py-1.5 bg-[#060B08] border border-emerald-900/60 hover:border-emerald-500 text-zinc-200 hover:text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Design Tokens</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {brandColors.map(color => (
                <div
                  key={color.hex}
                  onClick={() => {
                    if (color.hex) {
                      setHexInput(color.hex);
                      handleCopy(color.hex);
                    }
                  }}
                  className="bg-[#0A120E] rounded-2xl p-4 border border-emerald-950/80 shadow-md hover:border-emerald-500/60 cursor-pointer transition-all space-y-3 group"
                >
                  <div
                    className="h-20 rounded-xl shadow-inner border border-emerald-950/60 flex items-end justify-between p-2.5"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white font-bold backdrop-blur-xs">
                      {color.hex}
                    </span>
                    <span className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 px-1.5 py-0.5 rounded font-medium">
                      Click to copy
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-emerald-400 flex items-center justify-between">
                      <span>{color.name}</span>
                      <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-normal">{color.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: LOGO CLEAR SPACE VALIDATOR */}
      {/* ========================================================================= */}
      {activeVisualTab === 'logo' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-6">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Logo Geometry & Exclusion Zone Validator</h2>
              <p className="text-xs text-zinc-400 mt-1">
                AuraCloud corporate standards mandate a minimum clear space of 0.5x (where X is the height of the logomark) around all perimeter edges.
              </p>
            </div>

            {/* Clear Space Visual Simulator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dark Surface Check */}
              <div className="p-6 bg-[#050806] rounded-xl border border-emerald-950 space-y-4">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-950">
                  <span className="font-bold text-emerald-400">Primary Dark Surface (#050806)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-[#00FF87] border border-emerald-700">
                    Contrast: 18.2:1 (AAA Pass)
                  </span>
                </div>

                <div className="relative border-2 border-dashed border-emerald-500/40 p-8 rounded-xl flex items-center justify-center bg-[#070D09]">
                  <span className="absolute top-2 left-2 text-[9px] font-mono text-emerald-400/80">0.5X Exclusion Boundary</span>
                  <div className="p-4 bg-[#0A120E] rounded-lg border border-emerald-800/80 text-center shadow-lg flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-black text-sm">
                      AC
                    </div>
                    <span className="text-lg font-black tracking-tight text-white font-sans">
                      AuraCloud<span className="text-emerald-400">.</span>
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Aspect Ratio:</span>
                    <strong className="text-white font-mono">1.0 : 1 Emblem / 4.2:1 Lockup (Compliant)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Minimum Digital Print:</span>
                    <strong className="text-emerald-400 font-mono">96px width (Pass)</strong>
                  </div>
                </div>
              </div>

              {/* White Surface Check */}
              <div className="p-6 bg-[#050806] rounded-xl border border-emerald-950 space-y-4">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-950">
                  <span className="font-bold text-zinc-200">Light Surface Variant (#FFFFFF)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-[#00FF87] border border-emerald-700">
                    Contrast: 14.8:1 (AAA Pass)
                  </span>
                </div>

                <div className="relative border-2 border-dashed border-emerald-500/40 p-8 rounded-xl flex items-center justify-center bg-white">
                  <span className="absolute top-2 left-2 text-[9px] font-mono text-zinc-600 font-bold">0.5X Exclusion Boundary</span>
                  <div className="p-4 bg-slate-100 rounded-lg border border-slate-300 text-center shadow-sm flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center font-black text-white text-sm">
                      AC
                    </div>
                    <span className="text-lg font-black tracking-tight text-[#0F172A] font-sans">
                      AuraCloud<span className="text-blue-600">.</span>
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Monochrome Requirement:</span>
                    <strong className="text-emerald-400 font-mono">Enforce Dark Mark on White (Pass)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gradient Overlay:</span>
                    <strong className="text-rose-400 font-mono">Prohibited under Sec 2.1</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Prohibited Logo Modifications Warning */}
            <div className="p-4 rounded-xl bg-[#060B08] border border-emerald-950 text-xs space-y-2">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Prohibited Logo Modifications (Communication Manual Section 2.3)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-zinc-400 text-[11px] pt-1">
                <div className="p-2.5 rounded bg-[#0A120E] border border-emerald-950">
                  <strong className="text-rose-400 block mb-0.5">✖ No Distortion:</strong> Never stretch, skew, or alter uniform scaling.
                </div>
                <div className="p-2.5 rounded bg-[#0A120E] border border-emerald-950">
                  <strong className="text-rose-400 block mb-0.5">✖ No Color Tinting:</strong> Never render in non-approved brand tokens (e.g. red, yellow).
                </div>
                <div className="p-2.5 rounded bg-[#0A120E] border border-emerald-950">
                  <strong className="text-rose-400 block mb-0.5">✖ No Drop Shadows:</strong> Avoid artificial 3D glows or heavy drop shadows in print media.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: TYPOGRAPHY HIERARCHY VALIDATOR */}
      {/* ========================================================================= */}
      {activeVisualTab === 'typography' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">AuraCloud Typographic Scale & Hierarchy</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Enforces Inter and Plus Jakarta Sans type scale ratios across documentation, press releases, and marketing.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Typeface: Inter / Plus Jakarta Sans
              </span>
            </div>

            {/* Interactive Type Tester */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Interactive Typography Tester
              </label>
              <input
                type="text"
                value={typographySample}
                onChange={e => setTypographySample(e.target.value)}
                className="w-full text-xs p-3 bg-[#060B08] border border-emerald-900/60 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {/* Scale Hierarchy Ladder */}
            <div className="space-y-4 divide-y divide-emerald-950/60">
              <div className="pt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Display Hero (48px / 1.15)</span>
                  <span className="text-emerald-400 font-bold">Weight: 900 Black</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {typographySample}
                </h1>
              </div>

              <div className="pt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Heading 1 (32px / 1.25)</span>
                  <span className="text-emerald-400 font-bold">Weight: 800 ExtraBold</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {typographySample}
                </h2>
              </div>

              <div className="pt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Heading 2 (24px / 1.3)</span>
                  <span className="text-emerald-400 font-bold">Weight: 700 Bold</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-100 leading-snug">
                  {typographySample}
                </h3>
              </div>

              <div className="pt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Body Copy (14px / 1.6)</span>
                  <span className="text-emerald-400 font-bold">Weight: 400 Regular</span>
                </div>
                <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                  {typographySample}
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Technical Monospace / SLA Bounds (12px / 1.5)</span>
                  <span className="text-[#00FF87] font-bold">Font: JetBrains Mono</span>
                </div>
                <p className="text-xs font-mono text-[#00FF87] bg-[#060B08] p-3 rounded-xl border border-emerald-950 leading-relaxed">
                  UPTIME_SLA = 99.95% | RPO &lt; 15s | FIPS_CIPHER = AES-256-GCM
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Design Token Exporter */}
      {/* ========================================================================= */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-xl w-full shadow-2xl border border-emerald-900/80 overflow-hidden flex flex-col max-h-[85vh] my-auto animate-scale-in text-zinc-100">
            <div className="p-5 border-b border-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Export Brand Design Tokens</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-emerald-950 pb-2">
                {[
                  { id: 'css', label: 'CSS Variables (:root)' },
                  { id: 'tailwind', label: 'Tailwind Config' },
                  { id: 'json', label: 'JSON Tokens' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setTokenFormat(tab.id as any)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      tokenFormat === tab.id
                        ? 'bg-emerald-500 text-black shadow-lg'
                        : 'text-zinc-400 hover:bg-[#060B08]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-[#050806] text-zinc-200 rounded-xl p-4 font-mono text-xs overflow-x-auto relative border border-emerald-950">
                <pre className="leading-relaxed">
                  {tokenFormat === 'css' && `:root {
  --color-brand-primary: ${currentWorkspace.primary_color || '#050806'};
  --color-brand-secondary: ${currentWorkspace.secondary_color || '#0A120E'};
  --color-brand-accent: ${currentWorkspace.accent_color || '#10B981'};
  --color-brand-neon: #00FF87;
  --color-brand-warning: #F59E0B;
  --color-brand-danger: #EF4444;
}`}
                  {tokenFormat === 'tailwind' && `// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${currentWorkspace.primary_color || '#050806'}',
          secondary: '${currentWorkspace.secondary_color || '#0A120E'}',
          accent: '${currentWorkspace.accent_color || '#10B981'}',
          neon: '#00FF87',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      }
    }
  }
}`}
                  {tokenFormat === 'json' && JSON.stringify({
                    brand: {
                      primary: { value: currentWorkspace.primary_color || '#050806', type: 'color' },
                      secondary: { value: currentWorkspace.secondary_color || '#0A120E', type: 'color' },
                      accent: { value: currentWorkspace.accent_color || '#10B981', type: 'color' },
                      neon: { value: '#00FF87', type: 'color' },
                      warning: { value: '#F59E0B', type: 'color' },
                      danger: { value: '#EF4444', type: 'color' }
                    }
                  }, null, 2)}
                </pre>
              </div>
            </div>

            <div className="shrink-0 p-4 border-t border-emerald-950 bg-[#060B08] flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">Production design tokens ready for export</span>
              <button
                type="button"
                onClick={() => {
                  const content = tokenFormat === 'css'
                    ? `:root {\n  --color-brand-primary: ${currentWorkspace.primary_color || '#050806'};\n  --color-brand-secondary: ${currentWorkspace.secondary_color || '#0A120E'};\n  --color-brand-accent: ${currentWorkspace.accent_color || '#10B981'};\n  --color-brand-neon: #00FF87;\n  --color-brand-warning: #F59E0B;\n  --color-brand-danger: #EF4444;\n}`
                    : tokenFormat === 'tailwind'
                    ? `colors: {\n  brand: {\n    primary: '${currentWorkspace.primary_color || '#050806'}',\n    secondary: '${currentWorkspace.secondary_color || '#0A120E'}',\n    accent: '${currentWorkspace.accent_color || '#10B981'}',\n    neon: '#00FF87',\n    warning: '#F59E0B',\n    danger: '#EF4444'\n  }\n}`
                    : JSON.stringify({ brand: { primary: { value: currentWorkspace.primary_color || '#050806' } } }, null, 2);
                  navigator.clipboard?.writeText(content);
                  showToast('Design tokens copied to clipboard!', 'success');
                  setIsTokenModalOpen(false);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Token Snippet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
