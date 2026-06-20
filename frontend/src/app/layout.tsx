import type { Metadata } from 'next';
import { AuthProvider } from '@/context/auth/AuthProvider';
import './globals.css';

// / A helper type from Next.js to configure search engine optimization (SEO) details.
export const metadata: Metadata = { 
  title: 'MERS-AI — Malaysia 999 Unified Op-Center',
  description:
    'AI-powered 999 emergency dispatch assistant built for Malaysia. Professional real-time tactical dashboard and simulator.',
};

export default function RootLayout({
  children, // 1. Take the nested page content...
}: Readonly<{ // 2. Promise TypeScript we will not modify this input object...
  children: React.ReactNode; // 3. And expect the nested content to be renderable React elements.
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0D0F14] text-[#F0F2F8] font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
