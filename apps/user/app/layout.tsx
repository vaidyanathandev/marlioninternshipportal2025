import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from './ConvexClientProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marlion Winter Internship 2025 | Build the Future with AI & XR',
  description:
    'Join Marlion Technologies Winter Internship 2025. Hands-on experience in Assistive Tech & IEP for Neurodiverse Children. Master AI, XR, and Full Stack development.',
  keywords: [
    'marlion',
    'internship',
    '2025',
    'AI',
    'XR',
    'VR',
    'AR',
    'assistive technology',
    'neurodiverse',
    'full stack',
  ],
  authors: [{ name: 'Marlion Technologies' }],
  openGraph: {
    title: 'Marlion Winter Internship 2025',
    description: 'Build the Future with Assistive Tech & AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.className}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
