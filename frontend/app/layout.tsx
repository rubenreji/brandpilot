import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { BrandPilotProvider } from '@/lib/store';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#050806'
};

export const metadata: Metadata = {
  title: 'BrandPilot — AI-Assisted Brand Governance and Content Intelligence Platform',
  description: 'Your brand guidelines, enforced intelligently. Centralized guidelines, approved facts, terminology management, and AI-assisted content auditing with human-controlled approval.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark w-full`}>
      <body className="min-h-full w-full max-w-full overflow-x-hidden flex flex-col font-sans bg-[#050806] text-zinc-100 selection:bg-emerald-500 selection:text-black">
        <BrandPilotProvider>
          {children}
        </BrandPilotProvider>
      </body>
    </html>
  );
}
