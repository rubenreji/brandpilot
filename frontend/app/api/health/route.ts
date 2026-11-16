import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    platform: 'BrandPilot Serverless Next.js on Vercel',
    version: '2.0.0',
    mode: 'standalone-fullstack',
    timestamp: new Date().toISOString()
  });
}
