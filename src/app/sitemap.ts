import type { MetadataRoute } from 'next'

import { getPayloadClient, getSettings } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [payload, settings] = await Promise.all([getPayloadClient(), getSettings()])
  const base = settings.siteUrl ?? ''
  const published = { _status: { equals: 'published' } } as const
  const [offers, guides, projects] = await Promise.all([
    payload.find({ collection: 'offers', where: { ...published, status: { equals: 'live' } }, limit: 100, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'guides', where: published, limit: 1000, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'projects', where: published, limit: 1000, select: { slug: true, updatedAt: true } }),
  ])

  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/contact`, priority: 0.8 },
    { url: `${base}/guides`, priority: 0.6 },
    ...offers.docs.map((d) => ({ url: `${base}/${d.slug}`, lastModified: d.updatedAt, priority: 0.9 })),
    ...guides.docs.map((d) => ({ url: `${base}/guides/${d.slug}`, lastModified: d.updatedAt, priority: 0.7 })),
    ...projects.docs.map((d) => ({ url: `${base}/projets/${d.slug}`, lastModified: d.updatedAt, priority: 0.5 })),
    { url: `${base}/mentions-legales`, priority: 0.1 },
    { url: `${base}/cookies`, priority: 0.1 },
  ]
}
