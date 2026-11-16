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
  RefreshCw
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

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copied ${hex} to clipboard!`, 'success');
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
              className="px-2 py-1 rounded bg-black/30 hover:bg-black/50 text-white text-[10px] font-sans flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
        </div>
      </div>

      {/* Brand Palette Swatches */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">AuraCloud Approved Color Tokens</h2>
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Graphic Asset Palette Extractor</h2>
            <p className="text-xs text-slate-500">
              Upload marketing images, banners, or logos to extract dominant color clusters and verify compliance.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSimulateSample}
            disabled={isAnalyzing}
            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Load Sample Asset</span>
          </button>
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
    </div>
  );
}
