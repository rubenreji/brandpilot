import type { Metadata } from 'next';
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F6F8FC] text-slate-900">
        <BrandPilotProvider>
          {children}
        </BrandPilotProvider>
      </body>
    </html>
  );
}
