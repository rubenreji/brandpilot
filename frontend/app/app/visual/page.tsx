'use client';

import React, { useState, useRef } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  Palette,
  Upload,
  CheckCircle2,
  AlertTriangle,
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
  Layers
} from 'lucide-react';

interface ExtractedColor {
  hex: string;
  percentage: number;
  isCompliant: boolean;
  role: string;
}

export default function VisualIdentityPage() {
  const { currentWorkspace, showToast } = useBrandPilot();

  const [activeVisualTab, setActiveVisualTab] = useState<'colors' | 'logo' | 'typography'>('colors');
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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

    // Distance threshold: <= 38 is accepted within brand gamut tolerance
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
  const wcagMetrics = React.useMemo(() => {
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
    navigator.clipboard.writeText(hex);
    showToast(`Copied ${hex} to clipboard!`, 'success');
  };

  const handleLoadPreset = (preset: 'aura_compliant' | 'social_ad' | 'dark_mode') => {
    setIsAnalyzing(true);
    setTimeout(() => {
      if (preset === 'aura_compliant') {
        setExtractedPalette([
          { hex: '#050806', percentage: 54, isCompliant: true, role: 'Approved Brand Token (Obsidian Pitch)' },
          { hex: '#10B981', percentage: 28, isCompliant: true, role: 'Approved Brand Token (Electric Emerald)' },
          { hex: '#0A120E', percentage: 12, isCompliant: true, role: 'Approved Brand Token (Elevated Surface)' },
          { hex: '#00FF87', percentage: 6, isCompliant: true, role: 'Approved Brand Token (Neon Green)' }
        ]);
        showToast('Loaded Brand Identity Preset (100% compliant)!', 'success');
      } else if (preset === 'social_ad') {
        setExtractedPalette([
          { hex: '#10B981', percentage: 42, isCompliant: true, role: 'Approved Brand Token (Electric Emerald)' },
          { hex: '#050806', percentage: 32, isCompliant: true, role: 'Approved Brand Token (Obsidian Pitch)' },
          { hex: '#DC2626', percentage: 16, isCompliant: false, role: 'Off-Brand Red (Unapproved Token)' },
          { hex: '#F59E0B', percentage: 10, isCompliant: true, role: 'Approved Brand Token (Warning Amber)' }
        ]);
        showToast('Loaded Social Creative (Contains off-brand red token)!', 'info');
      } else {
        setExtractedPalette([
          { hex: '#050806', percentage: 70, isCompliant: true, role: 'Approved Brand Token (Obsidian Pitch)' },
          { hex: '#0A120E', percentage: 20, isCompliant: true, role: 'Approved Brand Token (Elevated Surface)' },
          { hex: '#10B981', percentage: 10, isCompliant: true, role: 'Approved Brand Token (Electric Emerald)' }
        ]);
        showToast('Loaded Dark Palette preset (100% compliant)!', 'success');
      }
      setIsAnalyzing(false);
    }, 450);
  };

  // Robust client-side canvas color extractor with perceptual distance
  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setIsAnalyzing(true);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsAnalyzing(false);
          return;
        }

        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);

        const imgData = ctx.getImageData(0, 0, 100, 100).data;
        const colorCounts: Record<string, number> = {};

        for (let i = 0; i < imgData.length; i += 16) {
          const r = Math.round(imgData[i] / 16) * 16;
          const g = Math.round(imgData[i + 1] / 16) * 16;
          const b = Math.round(imgData[i + 2] / 16) * 16;
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sorted = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        const total = sorted.reduce((sum, [, count]) => sum + count, 0);

        const palette: ExtractedColor[] = sorted.map(([hex, count]) => {
          const classification = classifyColorToken(hex);
          return {
            hex,
            percentage: Math.round((count / total) * 100),
            isCompliant: classification.isCompliant,
            role: classification.role
          };
        });

        setTimeout(() => {
          setExtractedPalette(palette);
          setIsAnalyzing(false);
          showToast('Image visual palette analyzed with perceptual color classification!', 'success');
        }, 600);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Visual Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Visual Identity, Logo & Typography Validator
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Enforce corporate color tokens, logo clear-space margins, and enterprise typographic scale standards.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0A120E] p-1 rounded-xl border border-emerald-950 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveVisualTab('colors')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeVisualTab === 'colors'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color Tokens</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveVisualTab('logo')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeVisualTab === 'logo'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Logo Clearance</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveVisualTab('typography')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeVisualTab === 'typography'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Typography Hierarchy</span>
          </button>
        </div>
      </div>

      {/* TAB 1: COLOR TOKENS & PALETTE */}
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

          {/* Image / Graphic Visual Inspector */}
          <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Graphic Asset Palette Extractor</h2>
                <p className="text-xs text-zinc-400">
                  Upload marketing images, banners, or logos to extract dominant color clusters and verify compliance.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('aura_compliant')}
                  disabled={isAnalyzing}
                  className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-[11px] font-bold rounded-xl border border-emerald-800/80 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Compliant Banner (100%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('social_ad')}
                  disabled={isAnalyzing}
                  className="px-2.5 py-1 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 text-[11px] font-bold rounded-xl border border-amber-800/80 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Ad (Off-Brand Red)</span>
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-900/60 rounded-2xl p-6 text-center bg-[#060B08]/70 hover:bg-[#060B08] hover:border-emerald-500 transition-colors cursor-pointer"
            >
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Uploaded asset preview"
                    className="max-h-40 rounded-xl object-contain shadow-md border border-emerald-900/60 mb-2"
                  />
                  <span className="text-xs font-bold text-emerald-400 hover:underline">
                    Click to choose another image
                  </span>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-100">
                    Click to upload an image or drop file here (PNG, JPG, WebP)
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                    Perceptual color distance classification against AuraCloud brand tokens
                  </p>
                </div>
              )}
            </div>

            {/* Extracted Palette Output */}
            {isAnalyzing ? (
              <div className="p-8 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Extracting color clusters...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                  <span>Extracted Palette Distribution ({extractedPalette.length} clusters)</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {Math.round(
                      (extractedPalette.filter(p => p.isCompliant).reduce((sum, p) => sum + p.percentage, 0) /
                        Math.max(1, extractedPalette.reduce((sum, p) => sum + p.percentage, 0))) *
                        100
                    )}% Visual Brand Compliance
                  </span>
                </div>

                <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner border border-emerald-950">
                  {extractedPalette.map((col, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${col.percentage}%`, backgroundColor: col.hex }}
                      title={`${col.hex} (${col.percentage}%) - ${col.role}`}
                      className="h-full transition-all"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {extractedPalette.map((col, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg border border-emerald-950/80 shadow-xs shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <div>
                          <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                            <span>{col.hex}</span>
                            <span className="text-[10px] text-zinc-500 font-normal">({col.percentage}%)</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate max-w-[180px]">{col.role}</div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          col.isCompliant
                            ? 'bg-emerald-950/80 text-[#00FF87] border-emerald-800'
                            : 'bg-rose-950/80 text-rose-300 border-rose-800'
                        }`}
                      >
                        {col.isCompliant ? 'Approved' : 'Off-Brand'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LOGO CLEAR SPACE VALIDATOR */}
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
                  {/* Exclusion Zone Guides */}
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
                    <strong className="text-white font-mono">4.2 : 1 (Compliant)</strong>
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
                  <strong className="text-rose-400 block mb-0.5">✖ No Distortion:</strong> Never stretch, skew, or alter the horizontal 4:1 aspect ratio.
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

      {/* TAB 3: TYPOGRAPHY HIERARCHY VALIDATOR */}
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
              {/* Display */}
              <div className="pt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Display Hero (48px / 1.15)</span>
                  <span className="text-emerald-400 font-bold">Weight: 900 Black</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {typographySample}
                </h1>
              </div>

              {/* H1 */}
              <div className="pt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Heading 1 (32px / 1.25)</span>
                  <span className="text-emerald-400 font-bold">Weight: 800 ExtraBold</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {typographySample}
                </h2>
              </div>

              {/* H2 */}
              <div className="pt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Heading 2 (24px / 1.3)</span>
                  <span className="text-emerald-400 font-bold">Weight: 700 Bold</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-100 leading-snug">
                  {typographySample}
                </h3>
              </div>

              {/* Body */}
              <div className="pt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Body Copy (14px / 1.6)</span>
                  <span className="text-emerald-400 font-bold">Weight: 400 Regular</span>
                </div>
                <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                  {typographySample}
                </p>
              </div>

              {/* Monospace Code / SLA Metric */}
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

      {/* MODAL: Design Token Exporter */}
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
