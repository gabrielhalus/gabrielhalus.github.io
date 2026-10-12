import type { MetadataRoute } from 'next'

import { getSettings } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings()
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/q/'] },
    sitemap: `${settings.siteUrl ?? ''}/sitemap.xml`,
  }
}
