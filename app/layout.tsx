import { cn } from '@/lib/utils';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { Anek_Telugu } from 'next/font/google';
import './globals.css';

const AnekTelugu = Anek_Telugu({
  subsets: ['latin'],
  variable: '--font-caption',
});

export const metadata: Metadata = {
  title: 'Gabriel Halus · Software Engineer',
  description: 'Fullstack Developer Working with React, Tailwind, Next.js and TypeScript',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full'>
      <body className={cn(GeistSans.variable, GeistMono.variable, AnekTelugu.variable, 'font-sans h-full bg-background text-foreground')}>
        {children}
      </body>
    </html>
  );
}
