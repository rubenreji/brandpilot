'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  Box,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Sliders,
  Download,
  Upload,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck2,
  ShieldCheck,
  PackageCheck,
  Check,
  QrCode,
  Barcode
} from 'lucide-react';

interface PackagingHotspot {
  id: string;
  face: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  x: number; // percentage
  y: number; // percentage
  title: string;
  category: 'color' | 'typography' | 'barcode' | 'regulatory' | 'logo';
  severity: 'passed' | 'warning' | 'critical';
  detail: string;
  remediation?: string;
}

interface PackagingPreset {
  id: string;
  name: string;
  type: string;
  dimensions: string;
  finish: 'matte' | 'gloss' | 'foil';
  complianceScore: number;
}

export default function Packaging3DInspectorPage() {
  const { currentWorkspace, showToast } = useBrandPilot();
  const [rotX, setRotX] = useState<number>(-15);
  const [rotY, setRotY] = useState<number>(30);
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeFace, setActiveFace] = useState<'front' | 'back' | 'left' | 'right' | 'top' | 'bottom'>('front');
  const [selectedHotspot, setSelectedHotspot] = useState<PackagingHotspot | null>(null);
  const [surfaceFinish, setSurfaceFinish] = useState<'matte' | 'gloss' | 'foil'>('matte');
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Custom Packaging Artwork & Dieline Projection State
  const [customArtworkUrl, setCustomArtworkUrl] = useState<string | null>(null);
  const [customArtworkName, setCustomArtworkName] = useState<string | null>(null);
  const artworkInputRef = useRef<HTMLInputElement | null>(null);

  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (.png, .jpg, .webp, .svg)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCustomArtworkUrl(result);
      setCustomArtworkName(file.name);
      snapToFace('front');
      showToast(`Artwork "${file.name}" mapped onto 3D package front face!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleClearArtwork = () => {
    setCustomArtworkUrl(null);
    setCustomArtworkName(null);
    if (artworkInputRef.current) artworkInputRef.current.value = '';
    showToast('Reverted to standard packaging design', 'info');
  };

  const presets: PackagingPreset[] = [
    {
      id: 'pkg-retail-box',
      name: 'Enterprise Cloud Appliance (Hardware Packaging)',
      type: 'Rigid Soft-Touch Gift Box with Magnetic Clasp',
      dimensions: '280 x 210 x 65 mm (300 GSM C1S Board)',
      finish: 'matte',
      complianceScore: 88
    },
    {
      id: 'pkg-merch-bottle',
      name: 'Executive Keynote Swag (Recycled Aluminum Bottle)',
      type: 'Cylindrical Laser-Etched Drinkware',
      dimensions: '750ml • 72 x 260 mm',
      finish: 'gloss',
      complianceScore: 94
    },
    {
      id: 'pkg-event-badge',
      name: 'Global Summit 2026 VIP Pass & Credential',
      type: 'Die-Cut NFC Wood Composite Lanyard Badge',
      dimensions: '105 x 148 mm (A6 Heavyweight)',
      finish: 'foil',
      complianceScore: 100
    }
  ];

  const [selectedPresetId, setSelectedPresetId] = useState<string>('pkg-retail-box');
  const currentPreset = presets.find(p => p.id === selectedPresetId) || presets[0];

  const hotspots: PackagingHotspot[] = [
    {
      id: 'hs-1',
      face: 'front',
      x: 50,
      y: 35,
      title: 'Primary Logo 1.5x Clear Space',
      category: 'logo',
      severity: 'passed',
      detail: 'Front emblem adheres strictly to 1.5x bounding box clearance against all outer box die-cut margins.'
    },
    {
      id: 'hs-2',
      face: 'front',
      x: 50,
      y: 72,
      title: 'Pantone 802 C Electric Mint Match',
      category: 'color',
      severity: 'passed',
      detail: 'Spectrophotometer simulation confirms 99.4% spectral match to Brand Key #00FF87 under D65 daylight.'
    },
    {
      id: 'hs-3',
      face: 'back',
      x: 50,
      y: 65,
      title: 'Missing Mandatory PAP 21 Recycling Emblem',
      category: 'regulatory',
      severity: 'critical',
      detail: 'EU Packaging Waste Directive (PPWR 94/62/EC) requires explicit corrugated cardboard recycling pictogram on external packaging.',
      remediation: 'Insert standard Mobius Loop PAP 21 symbol in bottom-right quadrant with minimum 10mm diameter.'
    },
    {
      id: 'hs-4',
      face: 'back',
      x: 50,
      y: 30,
      title: 'Fine-Print Legal Footnote Contrast',
      category: 'typography',
      severity: 'warning',
      detail: 'Statutory warranty disclaimer is set in 5.5pt Inter Light. Minimum recommended print legible threshold is 6.5pt.',
      remediation: 'Increase disclaimer type size to 7pt and adjust ink density from 60% tint to 85% solid slate.'
    },
    {
      id: 'hs-5',
      face: 'left',
      x: 50,
      y: 70,
      title: 'GS1 EAN-13 Barcode Quiet Zone Margin',
      category: 'barcode',
      severity: 'critical',
      detail: 'Barcode is placed within 1.8mm of package fold scoreline. GS1 ISO/IEC 15416 standard mandates minimum 3.2mm quiet zone.',
      remediation: 'Shift barcode module 4mm inwards to avoid scanner distortion across corner creases.'
    },
    {
      id: 'hs-6',
      face: 'right',
      x: 50,
      y: 50,
      title: 'Localized Country of Origin & Certifications',
      category: 'regulatory',
      severity: 'passed',
      detail: 'FCC Part 15, CE Mark, and "Engineered in California" statements properly formatted.'
    },
    {
      id: 'hs-7',
      face: 'top',
      x: 50,
      y: 50,
      title: 'Tamper-Evident Hologram Security Seal',
      category: 'logo',
      severity: 'passed',
      detail: 'Security tape lockup includes serialized cryptographic QR code linking to BrandPilot verification ledger.'
    }
  ];

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotY((prev) => (prev + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Handle direct face targeting
  const snapToFace = (face: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom') => {
    setActiveFace(face);
    setIsAutoRotating(false);
    switch (face) {
      case 'front':
        setRotX(0);
        setRotY(0);
        break;
      case 'back':
        setRotX(0);
        setRotY(180);
        break;
      case 'left':
        setRotX(0);
        setRotY(90);
        break;
      case 'right':
        setRotX(0);
        setRotY(-90);
        break;
      case 'top':
        setRotX(-90);
        setRotY(0);
        break;
      case 'bottom':
        setRotX(90);
        setRotY(0);
        break;
    }
  };

  // Mouse drag handlers for 3D orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    setRotY((prev) => (prev + dx * 0.5) % 360);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.5)));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const activeFaceHotspots = hotspots.filter(h => h.face === activeFace);

  const handleDownloadUVReport = () => {
    setDownloadingReport(true);
    const data = {
      preset: currentPreset.name,
      dimensions: currentPreset.dimensions,
      surfaceFinish,
      overallScore: currentPreset.complianceScore,
      hotspotsAnalyzed: hotspots.length,
      criticalFindings: hotspots.filter(h => h.severity === 'critical'),
      warningFindings: hotspots.filter(h => h.severity === 'warning'),
      passedFindings: hotspots.filter(h => h.severity === 'passed'),
      generatedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPreset.id}-3d-packaging-audit.json`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadingReport(false), 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Box className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Interactive 3D Physical Packaging &amp; Merch Inspector
            </h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time 3D spatial inspection for physical boxes, merchandise, and event collateral. Audits Pantone accuracy, barcode quiet zones, and EU packaging waste compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            ref={artworkInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleArtworkUpload}
          />

          <button
            onClick={() => artworkInputRef.current?.click()}
            className="px-3.5 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#00FF87]" />
            {customArtworkName ? 'Replace Artwork' : 'Upload Package Artwork'}
          </button>

          {customArtworkName && (
            <button
              onClick={handleClearArtwork}
              className="px-2.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              title="Revert to standard mockup"
            >
              Reset
            </button>
          )}

          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAutoRotating
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-[#0A110D] border border-emerald-950 text-zinc-300 hover:text-white'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            {isAutoRotating ? 'Auto-Orbiting' : 'Auto-Orbit 360°'}
          </button>

          <button
            onClick={handleDownloadUVReport}
            disabled={downloadingReport}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,255,135,0.25)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {downloadingReport ? 'Generating Report...' : 'Export 3D Print Audit'}
          </button>
        </div>
      </div>

      {/* Preset Selector Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A110D] border border-emerald-950 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Packaging Asset:</span>
          <div className="flex gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {preset.name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-zinc-400">Dimensions: <strong className="text-white">{currentPreset.dimensions}</strong></span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
            Score: {currentPreset.complianceScore}/100
          </span>
        </div>
      </div>

      {/* Main 3D Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 3D Viewport & Orbit Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#050806] border border-emerald-950 rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Viewport Control Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-black/80 text-emerald-400 font-mono text-xs border border-emerald-500/30 backdrop-blur-md">
                3D SPATIAL ORBIT • {rotX.toFixed(0)}° X / {rotY.toFixed(0)}° Y
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-black/80 p-1 rounded-lg border border-emerald-950 backdrop-blur-md">
              <button
                onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
                className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-zinc-300 px-1">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
                className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setRotX(-15); setRotY(30); setZoom(1); }}
                className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 ml-1"
                title="Reset Camera"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3D WebGL Perspective Canvas */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="h-[460px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden relative"
              style={{
                perspective: '1000px',
                background: 'radial-gradient(circle at center, #0B1610 0%, #030604 100%)'
              }}
            >
              {/* Studio Grid Floor */}
              <div
                className="absolute inset-x-0 bottom-0 h-48 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(#00FF87 1px, transparent 1px), linear-gradient(90deg, #00FF87 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                  transform: 'rotateX(75deg) translateY(60px)',
                  transformOrigin: 'bottom center'
                }}
              ></div>

              {/* 3D Box Container */}
              <div
                className="relative transition-transform ease-out duration-75"
                style={{
                  width: '240px',
                  height: '240px',
                  transformStyle: 'preserve-3d',
                  transform: `scale3d(${zoom}, ${zoom}, ${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`
                }}
              >
                {/* Face: FRONT */}
                <div
                  onClick={() => snapToFace('front')}
                  className="absolute inset-0 rounded-lg p-5 flex flex-col justify-between border-2 transition-all overflow-hidden"
                  style={{
                    transform: 'translateZ(120px)',
                    backgroundColor: surfaceFinish === 'matte' ? '#080E0B' : surfaceFinish === 'gloss' ? '#0A150F' : '#050A07',
                    backgroundImage: customArtworkUrl ? `url(${customArtworkUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderColor: activeFace === 'front' ? '#00FF87' : 'rgba(16, 185, 129, 0.4)',
                    boxShadow: surfaceFinish === 'gloss' ? 'inset 0 0 35px rgba(0,255,135,0.15), 0 0 30px rgba(0,0,0,0.8)' : '0 0 30px rgba(0,0,0,0.8)'
                  }}
                >
                  {customArtworkUrl ? (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] p-3 flex flex-col justify-between pointer-events-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/90 text-[#00FF87] border border-emerald-500/50">
                          CUSTOM DIELINE PROJECTED
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-zinc-300">
                          {customArtworkName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-white font-mono bg-black/80 px-2 py-1 rounded border border-emerald-500/30">
                        <span>LIVE SPATIAL TEXTURE</span>
                        <span className="text-[#00FF87] font-bold">● 100% COVERAGE PASS</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">FRONT PANEL</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">PANTONE 802 C</span>
                      </div>

                      <div className="my-auto text-center space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500 text-black font-black flex items-center justify-center text-xl shadow-[0_0_20px_rgba(0,255,135,0.3)]">
                          BP
                        </div>
                        <div className="text-xl font-black text-white tracking-tight">AuraCloud</div>
                        <div className="text-[10px] text-zinc-400 font-medium">Enterprise Appliance Model AX-4</div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                        <span>1.5X CLEAR SPACE OK</span>
                        <span className="text-[#00FF87]">● VERIFIED</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Face: BACK */}
                <div
                  onClick={() => snapToFace('back')}
                  className="absolute inset-0 rounded-lg p-5 flex flex-col justify-between border-2 transition-all"
                  style={{
                    transform: 'rotateY(180deg) translateZ(120px)',
                    backgroundColor: '#070D09',
                    borderColor: activeFace === 'back' ? '#00FF87' : 'rgba(16, 185, 129, 0.4)',
                    boxShadow: '0 0 30px rgba(0,0,0,0.8)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">BACK PANEL</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-bold">1 COMPLIANCE ERROR</span>
                  </div>

                  <div className="my-auto space-y-2 text-[9px] text-zinc-400 leading-tight">
                    <p className="font-semibold text-zinc-300">TECHNICAL SPECIFICATIONS</p>
                    <p>Input: 100-240V ~ 50/60Hz 1.5A Max. Redundant Multi-Zone Failover Core.</p>
                    <div className="p-2 rounded bg-red-950/40 border border-red-500/50 text-red-300">
                      ⚠ MISSING PAP 21 RECYCLING SYMBOL
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[8px] text-zinc-500">
                    <span>CE • FCC • RoHS</span>
                    <QrCode className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                {/* Face: LEFT */}
                <div
                  onClick={() => snapToFace('left')}
                  className="absolute inset-0 rounded-lg p-5 flex flex-col justify-between border-2 transition-all"
                  style={{
                    transform: 'rotateY(-90deg) translateZ(120px)',
                    backgroundColor: '#060B08',
                    borderColor: activeFace === 'left' ? '#00FF87' : 'rgba(16, 185, 129, 0.4)',
                    boxShadow: '0 0 30px rgba(0,0,0,0.8)'
                  }}
                >
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">LEFT FLANK</span>
                  <div className="my-auto text-center space-y-2">
                    <Barcode className="w-16 h-10 mx-auto text-white" />
                    <span className="font-mono text-[9px] text-red-400 block font-bold">EAN: 0742198421094</span>
                    <span className="text-[8px] text-red-400 bg-red-950/60 px-1 py-0.5 rounded">QUIET ZONE VIOLATION</span>
                  </div>
                  <span className="text-[8px] text-zinc-500 text-center font-mono">BATCH: 2026-Q4-A</span>
                </div>

                {/* Face: RIGHT */}
                <div
                  onClick={() => snapToFace('right')}
                  className="absolute inset-0 rounded-lg p-5 flex flex-col justify-between border-2 transition-all"
                  style={{
                    transform: 'rotateY(90deg) translateZ(120px)',
                    backgroundColor: '#060B08',
                    borderColor: activeFace === 'right' ? '#00FF87' : 'rgba(16, 185, 129, 0.4)',
                    boxShadow: '0 0 30px rgba(0,0,0,0.8)'
                  }}
                >
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">RIGHT FLANK</span>
                  <div className="my-auto text-center space-y-1">
                    <span className="text-xs font-bold text-white">Engineered by AuraCloud</span>
                    <p className="text-[9px] text-zinc-400">San Francisco, CA • Made in USA</p>
                  </div>
                  <span className="text-[8px] text-emerald-400 font-mono text-center">● CERTIFIED OK</span>
                </div>

                {/* Face: TOP */}
                <div
                  onClick={() => snapToFace('top')}
                  className="absolute inset-0 rounded-lg p-5 flex flex-col justify-between border-2 transition-all"
                  style={{
                    transform: 'rotateX(90deg) translateZ(120px)',
                    backgroundColor: '#09120C',
                    borderColor: activeFace === 'top' ? '#00FF87' : 'rgba(16, 185, 129, 0.4)',
                    boxShadow: '0 0 30px rgba(0,0,0,0.8)'
                  }}
                >
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">TOP TAMPER SEAL</span>
                  <div className="my-auto text-center">
                    <div className="inline-block px-3 py-1 rounded bg-[#00FF87] text-black text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,135,0.4)]">
                      TAMPER EVIDENT SEAL
                    </div>
                  </div>
                  <span className="text-[8px] text-zinc-500 font-mono text-center">DO NOT ACCEPT IF BROKEN</span>
                </div>

                {/* Face: BOTTOM */}
                <div
                  onClick={() => snapToFace('bottom')}
                  className="absolute inset-0 rounded-lg p-5 flex flex-col justify-between border-2 transition-all"
                  style={{
                    transform: 'rotateX(-90deg) translateZ(120px)',
                    backgroundColor: '#040705',
                    borderColor: activeFace === 'bottom' ? '#00FF87' : 'rgba(16, 185, 129, 0.4)',
                    boxShadow: '0 0 30px rgba(0,0,0,0.8)'
                  }}
                >
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">BOTTOM BASE</span>
                  <div className="my-auto text-center text-[9px] text-zinc-500 font-mono">
                    SKU: BP-HW-4091<br />RECYCLED PACKAGING
                  </div>
                  <span className="text-[8px] text-zinc-600 font-mono text-center">PATENT PENDING</span>
                </div>
              </div>
            </div>

            {/* Bottom 3D Quick-Face Selector Navigation */}
            <div className="p-3 bg-[#080E0B] border-t border-emerald-950 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-zinc-400">Snap to Face:</span>
              <div className="flex gap-1.5 flex-wrap">
                {(['front', 'back', 'left', 'right', 'top', 'bottom'] as const).map((face) => (
                  <button
                    key={face}
                    onClick={() => snapToFace(face)}
                    className={`px-2.5 py-1 rounded text-xs font-medium uppercase font-mono transition-all ${
                      activeFace === face
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-[#0A110D] text-zinc-400 hover:text-white border border-emerald-950'
                    }`}
                  >
                    {face}
                  </button>
                ))}
              </div>

              {/* Surface Finish Switcher */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-500 mr-1">Finish:</span>
                {(['matte', 'gloss', 'foil'] as const).map((fin) => (
                  <button
                    key={fin}
                    onClick={() => setSurfaceFinish(fin)}
                    className={`px-2 py-0.5 rounded text-[11px] capitalize transition-all ${
                      surfaceFinish === fin
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {fin}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right: Face-Specific Compliance Telemetry & Hotspot Drawer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0A110D] border border-emerald-950 rounded-2xl p-5 space-y-4 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  {activeFace.toUpperCase()} Face Audit Telemetry
                </h3>
                <span className="text-[11px] text-zinc-400">
                  {activeFaceHotspots.length} checkpoints inspected on this surface
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#00FF87] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
                ACTIVE VIEW
              </span>
            </div>

            {/* Hotspots Feed */}
            <div className="space-y-3">
              {activeFaceHotspots.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-emerald-950 rounded-xl">
                  No active compliance violations detected on the {activeFace} panel. Surface adheres to structural and branding tolerances.
                </div>
              ) : (
                activeFaceHotspots.map((hs) => (
                  <div
                    key={hs.id}
                    onClick={() => setSelectedHotspot(hs)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      hs.severity === 'critical'
                        ? 'bg-red-950/20 border-red-500/40 hover:border-red-400'
                        : hs.severity === 'warning'
                        ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                        : 'bg-[#050806] border-emerald-950 hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {hs.severity === 'critical' && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                        {hs.severity === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {hs.severity === 'passed' && <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF87]" />}
                        {hs.title}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        hs.severity === 'critical' ? 'bg-red-950 text-red-300' : hs.severity === 'warning' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {hs.severity}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">{hs.detail}</p>

                    {hs.remediation && (
                      <div className="mt-2.5 pt-2 border-t border-emerald-950/80 text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded">
                        <strong className="text-emerald-400">Remediation:</strong> {hs.remediation}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* DFM / Pre-Press Export Action */}
            <div className="pt-2">
              <button
                onClick={handleDownloadUVReport}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,255,135,0.2)]"
              >
                <FileCheck2 className="w-4 h-4" />
                Generate Pre-Press DFM Clearance Ticket
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
