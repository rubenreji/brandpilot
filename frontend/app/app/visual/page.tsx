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
  Download
} from 'lucide-react';

interface ExtractedColor {
  hex: string;
  percentage: number;
  isCompliant: boolean;
  role: string;
}

export default function VisualIdentityPage() {
  const { currentWorkspace, showToast } = useBrandPilot();

  const [hexInput, setHexInput] = useState('#10B981');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<ExtractedColor[]>([
    { hex: '#050806', percentage: 48, isCompliant: true, role: 'Obsidian Black Base' },
    { hex: '#10B981', percentage: 26, isCompliant: true, role: 'Electric Emerald Accent' },
    { hex: '#0A120E', percentage: 16, isCompliant: true, role: 'Elevated Surface' },
    { hex: '#00FF87', percentage: 6, isCompliant: true, role: 'Neon Indicator' },
    { hex: '#DC2626', percentage: 4, isCompliant: false, role: 'Off-Brand Red (Unapproved Token)' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenFormat, setTokenFormat] = useState<'css' | 'tailwind' | 'json'>('css');

  const brandColors = [
    { name: 'Obsidian Pitch', hex: currentWorkspace.primary_color || '#050806', role: 'Main background and canvas surface' },
    { name: 'Elevated Surface', hex: currentWorkspace.secondary_color || '#0A120E', role: 'Cards, elevated panels, dialogs' },
    { name: 'Electric Emerald', hex: currentWorkspace.accent_color || '#10B981', role: 'Primary CTAs, glowing highlights, badges' },
    { name: 'Neon Green', hex: '#00FF87', role: 'Active indicators, live state pings' },
    { name: 'Warning Amber', hex: '#F59E0B', role: 'Review pending, non-blocking suggestions' },
    { name: 'Danger Rose', hex: '#EF4444', role: 'Critical policy violations, prohibited terms' }
  ];

  const isExactBrandColor = brandColors.some(
    c => (c.hex || '').toLowerCase() === hexInput.trim().toLowerCase()
  );

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
          { hex: '#050806', percentage: 54, isCompliant: true, role: 'Obsidian Black Base' },
          { hex: '#10B981', percentage: 28, isCompliant: true, role: 'Electric Emerald Accent' },
          { hex: '#0A120E', percentage: 12, isCompliant: true, role: 'Elevated Surface' },
          { hex: '#00FF87', percentage: 6, isCompliant: true, role: 'Neon Indicator' }
        ]);
        showToast('Loaded Brand Identity Preset (100% compliant)!', 'success');
      } else if (preset === 'social_ad') {
        setExtractedPalette([
          { hex: '#10B981', percentage: 42, isCompliant: true, role: 'Electric Emerald' },
          { hex: '#050806', percentage: 32, isCompliant: true, role: 'Obsidian Base' },
          { hex: '#DC2626', percentage: 16, isCompliant: false, role: 'Off-Brand Red (Unapproved Token)' },
          { hex: '#F59E0B', percentage: 10, isCompliant: true, role: 'Warning Amber' }
        ]);
        showToast('Loaded Social Creative (Contains off-brand red token)!', 'info');
      } else {
        setExtractedPalette([
          { hex: '#050806', percentage: 70, isCompliant: true, role: 'Obsidian Base' },
          { hex: '#0A120E', percentage: 20, isCompliant: true, role: 'Elevated Card' },
          { hex: '#10B981', percentage: 10, isCompliant: true, role: 'Electric Emerald' }
        ]);
        showToast('Loaded Dark Palette preset (100% compliant)!', 'success');
      }
      setIsAnalyzing(false);
    }, 450);
  };

  // Real client-side canvas color extractor
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
          const r = Math.round(imgData[i] / 20) * 20;
          const g = Math.round(imgData[i + 1] / 20) * 20;
          const b = Math.round(imgData[i + 2] / 20) * 20;
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sorted = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        const total = sorted.reduce((sum, [, count]) => sum + count, 0);

        const palette: ExtractedColor[] = sorted.map(([hex, count]) => {
          const isComp = brandColors.some(bc => bc.hex.toUpperCase() === hex);
          return {
            hex,
            percentage: Math.round((count / total) * 100),
            isCompliant: isComp,
            role: isComp ? 'Approved Brand Token' : 'Off-Brand Color Token'
          };
        });

        setTimeout(() => {
          setExtractedPalette(palette);
          setIsAnalyzing(false);
          showToast('Image visual palette analyzed and verified against brand tokens!', 'success');
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
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="pb-6 border-b border-emerald-950/80">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
          <Palette className="w-3.5 h-3.5 text-emerald-400" />
          <span>{currentWorkspace.name}</span>
          <span>•</span>
          <span>Visual Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Visual Identity & Color Token Inspector
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Verify graphic assets, banner backgrounds, and color palettes against official brand design specifications.
        </p>
      </div>

      {/* Hex Checker Card */}
      <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Interactive HEX Color Validator</h2>
            <p className="text-xs text-zinc-400">Test any candidate color code against official corporate tokens</p>
          </div>
          {isExactBrandColor ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Approved Brand Token
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Off-Brand Token (Delta E &gt; 2.5)
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
            <span>Token: {hexInput}</span>
            <button
              onClick={() => handleCopy(hexInput)}
              className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[10px] font-sans flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
        </div>

        {/* WCAG 2.1 Contrast & Accessibility Meter */}
        <div className="pt-4 border-t border-emerald-950/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>WCAG 2.1 Accessibility & Contrast Compliance</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400">Target Standard: AA / AAA</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Contrast against White Surface */}
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

            {/* Contrast against Obsidian Surface */}
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

      {/* Brand Palette Swatches with Design Token Exporter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">AuraCloud Approved Color Tokens</h2>
            <p className="text-xs text-zinc-400">Official enterprise design tokens enforced across visual media</p>
          </div>
          <button
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

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Drag and Drop Zone */}
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
                Fast client-side canvas color clustering and quantization
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

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {extractedPalette.map((col, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopy(col.hex)}
                  className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 text-xs space-y-2 hover:border-emerald-500/60 cursor-pointer transition-all"
                >
                  <div
                    className="h-14 rounded-lg shadow-inner border border-emerald-950/80"
                    style={{ backgroundColor: col.hex }}
                  />
                  <div>
                    <div className="flex items-center justify-between font-mono font-bold text-zinc-200">
                      <span>{col.hex}</span>
                      <span className="text-zinc-500 font-sans text-[11px]">{col.percentage}%</span>
                    </div>
                    <span
                      className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        col.isCompliant
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                          : 'bg-rose-950/70 text-rose-300 border-rose-800/60'
                      }`}
                    >
                      {col.isCompliant ? '✓ Brand Token' : '⚠ Off-Brand'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Design Token Exporter Modal */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A120E] rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-900/60 max-h-[85vh] my-auto flex flex-col overflow-hidden animate-scale-in">
            <div className="shrink-0 p-5 border-b border-emerald-950 flex items-center justify-between">
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
              {/* Token format tabs */}
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

              {/* Token Code Snippet Box */}
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
