import { getPayloadClient, getSettings } from '@/lib/payload'
import { domainOf, renderOgImage } from '@/og/image'

/** Image de partage par défaut (accueil et pages sans image propre). */
export async function GET() {
  const [settings, payload] = await Promise.all([getSettings(), getPayloadClient()])
  const home = await payload.findGlobal({ slug: 'home', depth: 0 })
  const title = [home.hero?.title, home.hero?.highlight].filter(Boolean).join(' ') || settings.defaultDescription || settings.siteName || ''

  return renderOgImage({
    title,
    badges: [settings.role ? `${settings.role} freelance` : null, settings.city],
    tint: 'accent',
    domain: domainOf(settings.siteUrl),
  })
}
