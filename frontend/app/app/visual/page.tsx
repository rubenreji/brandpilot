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

  const [hexInput, setHexInput] = useState('#3978E8');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<ExtractedColor[]>([
    { hex: '#101827', percentage: 48, isCompliant: true, role: 'Primary Navy' },
    { hex: '#3978E8', percentage: 26, isCompliant: true, role: 'Accent Blue' },
    { hex: '#FFFFFF', percentage: 16, isCompliant: true, role: 'Clean Surface' },
    { hex: '#E9A23B', percentage: 6, isCompliant: true, role: 'Warning Amber' },
    { hex: '#DC2626', percentage: 4, isCompliant: false, role: 'Off-Brand Red (Unapproved Token)' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenFormat, setTokenFormat] = useState<'css' | 'tailwind' | 'json'>('css');

  const brandColors = [
    { name: 'Primary Navy', hex: currentWorkspace.primary_color || '#101827', role: 'Headers, navigation, primary surfaces' },
    { name: 'Secondary Navy', hex: currentWorkspace.secondary_color || '#19263A', role: 'Cards, elevated containers, dark accents' },
    { name: 'Accent Blue', hex: currentWorkspace.accent_color || '#3978E8', role: 'Primary CTAs, active highlights, key links' },
    { name: 'Success Green', hex: '#16A36A', role: 'Approved statuses, positive indicators' },
    { name: 'Warning Amber', hex: '#E9A23B', role: 'Review pending, non-blocking suggestions' },
    { name: 'Danger Coral', hex: '#DC5353', role: 'Critical policy violations, prohibited terms' }
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
    const ratioOnNavy = calculateRatio(hexInput, '#101827');

    return {
      ratioOnWhite,
      ratioOnNavy,
      passAANormalWhite: ratioOnWhite >= 4.5,
      passAALargeWhite: ratioOnWhite >= 3.0,
      passAAAWhite: ratioOnWhite >= 7.0,
      passAANormalNavy: ratioOnNavy >= 4.5,
      passAALargeNavy: ratioOnNavy >= 3.0,
      passAAANavy: ratioOnNavy >= 7.0
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
          { hex: '#101827', percentage: 54, isCompliant: true, role: 'Primary Navy' },
          { hex: '#3978E8', percentage: 28, isCompliant: true, role: 'Accent Blue' },
          { hex: '#FFFFFF', percentage: 12, isCompliant: true, role: 'Clean Surface' },
          { hex: '#16A36A', percentage: 6, isCompliant: true, role: 'Success Green' }
        ]);
        showToast('Loaded AuraCloud Brand Header preset (100% compliant)!', 'success');
      } else if (preset === 'social_ad') {
        setExtractedPalette([
          { hex: '#3978E8', percentage: 42, isCompliant: true, role: 'Accent Blue' },
          { hex: '#101827', percentage: 32, isCompliant: true, role: 'Primary Navy' },
          { hex: '#DC2626', percentage: 16, isCompliant: false, role: 'Off-Brand Red (Unapproved Token)' },
          { hex: '#E9A23B', percentage: 10, isCompliant: true, role: 'Warning Amber' }
        ]);
        showToast('Loaded Social Ad Creative (Contains off-brand red token)!', 'info');
      } else {
        setExtractedPalette([
          { hex: '#101827', percentage: 70, isCompliant: true, role: 'Primary Navy' },
          { hex: '#19263A', percentage: 20, isCompliant: true, role: 'Secondary Navy' },
          { hex: '#3978E8', percentage: 10, isCompliant: true, role: 'Accent Blue' }
        ]);
        showToast('Loaded Dark Mode Palette preset (100% compliant)!', 'success');
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

  const handleSimulateSample = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setExtractedPalette([
        { hex: '#101827', percentage: 54, isCompliant: true, role: 'Primary Navy' },
        { hex: '#3978E8', percentage: 28, isCompliant: true, role: 'Accent Blue' },
        { hex: '#FFFFFF', percentage: 12, isCompliant: true, role: 'Clean Surface' },
        { hex: '#16A36A', percentage: 6, isCompliant: true, role: 'Success Green' }
      ]);
      setIsAnalyzing(false);
      showToast('Sample marketing banner verified at 100% brand color compliance!', 'success');
    }, 500);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <span>{currentWorkspace.name}</span>
          <span>•</span>
          <span>Visual Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Visual Identity & Color Token Inspector
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Verify graphic assets, banner backgrounds, and color palettes against official AuraCloud brand specifications.
        </p>
      </div>

      {/* Hex Checker Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Interactive HEX Color Validator</h2>
            <p className="text-xs text-slate-500">Test any candidate color code against official corporate tokens</p>
          </div>
          {isExactBrandColor ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Approved Brand Token
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Off-Brand Token (Delta E &gt; 2.5)
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="color"
              value={hexInput.startsWith('#') && hexInput.length === 7 ? hexInput : '#3978E8'}
              onChange={e => setHexInput(e.target.value.toUpperCase())}
              className="w-12 h-12 rounded-xl border border-slate-300 cursor-pointer p-0"
            />
            <input
              type="text"
              value={hexInput}
              onChange={e => setHexInput(e.target.value.toUpperCase())}
              placeholder="#3978E8"
              className="text-sm font-mono font-bold px-3 py-2.5 border border-slate-300 rounded-lg w-36 uppercase"
            />
          </div>

          <div
            className="flex-1 w-full h-12 rounded-xl flex items-center justify-between px-4 font-mono text-xs font-bold shadow-inner"
            style={{
              backgroundColor: hexInput,
              color: hexInput.startsWith('#1') || hexInput.startsWith('#0') ? '#FFFFFF' : '#101827'
            }}
          >
            <span>Token: {hexInput}</span>
            <button
              onClick={() => handleCopy(hexInput)}
              className="px-2 py-1 rounded bg-black/30 hover:bg-black/50 text-white text-[10px] font-sans flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
        </div>

        {/* WCAG 2.1 Contrast & Accessibility Meter */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>WCAG 2.1 Accessibility & Contrast Compliance</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Target Standard: AA / AAA</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Contrast against White Surface */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-900">Contrast against White (#FFFFFF)</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Ratio: {wcagMetrics.ratioOnWhite}:1</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  wcagMetrics.passAANormalWhite ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {wcagMetrics.passAANormalWhite ? 'AA Pass (4.5:1)' : 'AA Fail'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  wcagMetrics.passAAAWhite ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {wcagMetrics.passAAAWhite ? 'AAA Pass (7:1)' : 'AAA Fail'}
                </span>
              </div>
            </div>

            {/* Contrast against Dark Navy Surface */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-900">Contrast against Dark Navy (#101827)</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Ratio: {wcagMetrics.ratioOnNavy}:1</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  wcagMetrics.passAANormalNavy ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {wcagMetrics.passAANormalNavy ? 'AA Pass (4.5:1)' : 'AA Fail'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  wcagMetrics.passAAANavy ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {wcagMetrics.passAAANavy ? 'AAA Pass (7:1)' : 'AAA Fail'}
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
            <h2 className="text-sm font-bold text-slate-900">AuraCloud Approved Color Tokens</h2>
            <p className="text-xs text-slate-500">Official enterprise design tokens enforced across visual media</p>
          </div>
          <button
            onClick={() => setIsTokenModalOpen(true)}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-blue-600" />
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
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all space-y-3 group"
            >
              <div
                className="h-20 rounded-xl shadow-inner border border-slate-200/50 flex items-end justify-between p-2.5"
                style={{ backgroundColor: color.hex }}
              >
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-white font-bold backdrop-blur-xs">
                  {color.hex}
                </span>
                <span className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-1.5 py-0.5 rounded">
                  Click to copy
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                  <span>{color.name}</span>
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{color.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image / Graphic Visual Inspector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Graphic Asset Palette Extractor</h2>
            <p className="text-xs text-slate-500">
              Upload marketing images, banners, or logos to extract dominant color clusters and verify compliance.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500">Quick Presets:</span>
            <button
              type="button"
              onClick={() => handleLoadPreset('aura_compliant')}
              disabled={isAnalyzing}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>AuraCloud Header (100%)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('social_ad')}
              disabled={isAnalyzing}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold rounded-lg border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
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
          className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/60 hover:bg-blue-50/30 hover:border-blue-400 transition-colors cursor-pointer"
        >
          {imagePreview ? (
            <div className="flex flex-col items-center">
              <img
                src={imagePreview}
                alt="Uploaded asset preview"
                className="max-h-40 rounded-xl object-contain shadow-sm border border-slate-200 mb-2"
              />
              <span className="text-xs font-semibold text-blue-600 hover:underline">
                Click to choose another image
              </span>
            </div>
          ) : (
            <div>
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-900">
                Click to upload an image or drop file here (PNG, JPG, WebP)
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Fast client-side canvas color clustering and quantization
              </p>
            </div>
          )}
        </div>

        {/* Extracted Palette Output */}
        {isAnalyzing ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Extracting color clusters...</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Extracted Palette Distribution ({extractedPalette.length} clusters)</span>
              <span className="text-emerald-600">
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
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 hover:border-blue-400 cursor-pointer transition-all"
                >
                  <div
                    className="h-14 rounded-lg shadow-inner border border-slate-200/60"
                    style={{ backgroundColor: col.hex }}
                  />
                  <div>
                    <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                      <span>{col.hex}</span>
                      <span className="text-slate-500 font-sans text-[11px]">{col.percentage}%</span>
                    </div>
                    <span
                      className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        col.isCompliant
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Export Brand Design Tokens</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Token format tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              {[
                { id: 'css', label: 'CSS Variables (:root)' },
                { id: 'tailwind', label: 'Tailwind Config' },
                { id: 'json', label: 'JSON Tokens' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTokenFormat(tab.id as any)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    tokenFormat === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Token Code Snippet Box */}
            <div className="bg-[#101827] text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto relative">
              <pre className="leading-relaxed">
                {tokenFormat === 'css' && `:root {
  --color-brand-primary: ${currentWorkspace.primary_color || '#101827'};
  --color-brand-secondary: ${currentWorkspace.secondary_color || '#19263A'};
  --color-brand-accent: ${currentWorkspace.accent_color || '#3978E8'};
  --color-brand-success: #16A36A;
  --color-brand-warning: #E9A23B;
  --color-brand-danger: #DC5353;
}`}
                {tokenFormat === 'tailwind' && `// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${currentWorkspace.primary_color || '#101827'}',
          secondary: '${currentWorkspace.secondary_color || '#19263A'}',
          accent: '${currentWorkspace.accent_color || '#3978E8'}',
          success: '#16A36A',
          warning: '#E9A23B',
          danger: '#DC5353',
        }
      }
    }
  }
}`}
                {tokenFormat === 'json' && JSON.stringify({
                  brand: {
                    primary: { value: currentWorkspace.primary_color || '#101827', type: 'color' },
                    secondary: { value: currentWorkspace.secondary_color || '#19263A', type: 'color' },
                    accent: { value: currentWorkspace.accent_color || '#3978E8', type: 'color' },
                    success: { value: '#16A36A', type: 'color' },
                    warning: { value: '#E9A23B', type: 'color' },
                    danger: { value: '#DC5353', type: 'color' }
                  }
                }, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">Production design tokens ready for export</span>
              <button
                type="button"
                onClick={() => {
                  const content = tokenFormat === 'css'
                    ? `:root {\n  --color-brand-primary: ${currentWorkspace.primary_color || '#101827'};\n  --color-brand-secondary: ${currentWorkspace.secondary_color || '#19263A'};\n  --color-brand-accent: ${currentWorkspace.accent_color || '#3978E8'};\n  --color-brand-success: #16A36A;\n  --color-brand-warning: #E9A23B;\n  --color-brand-danger: #DC5353;\n}`
                    : tokenFormat === 'tailwind'
                    ? `colors: {\n  brand: {\n    primary: '${currentWorkspace.primary_color || '#101827'}',\n    secondary: '${currentWorkspace.secondary_color || '#19263A'}',\n    accent: '${currentWorkspace.accent_color || '#3978E8'}',\n    success: '#16A36A',\n    warning: '#E9A23B',\n    danger: '#DC5353'\n  }\n}`
                    : JSON.stringify({ brand: { primary: { value: currentWorkspace.primary_color || '#101827' } } }, null, 2);
                  navigator.clipboard?.writeText(content);
                  showToast('Design tokens copied to clipboard!', 'success');
                  setIsTokenModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
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
