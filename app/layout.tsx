import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Seal - Secure File Encryption for Gmail | Send Files That Expire',
  description: 'Enterprise-grade file encryption your entire team can use. Send secure files with automatic expiration. No training required. Free for teams.',
  keywords: ['secure file sharing', 'encrypted email', 'file expiration', 'zero-knowledge encryption', 'GDPR compliant'],
  authors: [{ name: 'Seal' }],
  openGraph: {
    title: 'Seal - Send files securely, without the complexity',
    description: 'Enterprise-grade encryption your team can use. No training, no software, no headaches.',
    url: 'https://seal.email',
    siteName: 'Seal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seal - Secure File Encryption',
    description: 'Send files securely without the complexity',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
