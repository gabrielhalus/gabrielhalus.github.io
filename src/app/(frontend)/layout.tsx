import type { Metadata } from 'next'
import { JetBrains_Mono, Schibsted_Grotesk } from 'next/font/google'
import React from 'react'

import { CookieBanner } from '@/components/CookieBanner'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getOffers, getPayloadClient, getSettings } from '@/lib/payload'
import { ogImages } from '@/lib/og'
import { offerPath } from '@/lib/utils'

import './styles.css'

// Rendu à la demande : la base n'est pas joignable pendant le build Docker,
// et le contenu change depuis l'admin.
export const dynamic = 'force-dynamic'

const schibsted = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-schibsted' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains' })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    metadataBase: new URL(settings.siteUrl || 'http://localhost:3000'),
    title: { default: `${settings.siteName} — ${settings.role} freelance`, template: `%s — ${settings.siteName}` },
    description: settings.defaultDescription ?? undefined,
    openGraph: { locale: 'fr_FR', type: 'website', siteName: settings.siteName ?? undefined, images: ogImages(settings.ogImage, '/og', settings.updatedAt) },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [offers, payload] = await Promise.all([getOffers(), getPayloadClient()])
  const cookies = await payload.findGlobal({ slug: 'cookies', depth: 0 })
  const live = offers.filter((o) => o.status === 'live')

  return (
    <html lang="fr" className={`${schibsted.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Aller au contenu
        </a>
        <Header offersHref={live[0] ? offerPath(live[0].slug) : '/#offres'} offerPaths={live.map((o) => offerPath(o.slug))} />
        <main id="contenu" className="mx-auto flex max-w-[1416px] flex-col gap-3 px-3">
          {children}
        </main>
        <Footer />
        <CookieBanner title={cookies.banner?.title ?? 'Un petit réglage'} text={cookies.banner?.text ?? ''} />
      </body>
    </html>
  )
}
