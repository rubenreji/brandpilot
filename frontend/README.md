# 🛡️ BrandPilot — Enterprise Web Application Frontend

The official Next.js 16 frontend interface for **BrandPilot**, the enterprise brand governance and content intelligence platform.

## Architecture

- **Framework**: Next.js 16.4.6 with Turbopack & React 19
- **Styling**: Tailwind CSS v4 featuring the enterprise Black & Green palette (`#000000`, `#050806`, `#0A120E`, `#10B981`, `#00FF87`)
- **State Store**: Universal Context Store with persistent local cache, real-time activity stream, and multi-persona RBAC simulation
- **Analytics & Visuals**: Recharts for telemetry, vector canvas for visual identity tokens & logo exclusion verification

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the local development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

To run type checking and produce an optimized production build:
```bash
npm run build
npm run start
```
