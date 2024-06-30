import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { dir } from 'i18next';
import type { Metadata } from 'next';
import { Anek_Telugu } from 'next/font/google';
import i18nConfig from '../../i18nConfig';
import { cn } from '../../lib/utils';
import '../globals.css';

const AnekTelugu = Anek_Telugu({
  subsets: ['latin'],
  variable: '--font-caption',
});

export const metadata: Metadata = {
  title: 'Gabriel Halus',
  description: 'Passionate French Software Developer crafting digital experiences with code!',
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default function RootLayout({ children, params: { locale } }: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className='h-full'
    >
      <body className={cn(GeistSans.variable, GeistMono.variable, AnekTelugu.variable, 'font-sans h-full bg-background text-foreground')}>
        {children}
      </body>
    </html>
  );
}
