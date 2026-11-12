import type { MetadataRoute } from 'next'

import { getPayloadClient, getSettings } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [payload, settings] = await Promise.all([getPayloadClient(), getSettings()])
  const base = settings.siteUrl ?? ''
  const published = { _status: { equals: 'published' } } as const
  const [home, offers, guides, projects] = await Promise.all([
    payload.findGlobal({ slug: 'home', depth: 0, select: { updatedAt: true } }),
    payload.find({ collection: 'offers', where: { ...published, status: { equals: 'live' } }, limit: 100, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'guides', where: published, limit: 1000, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'projects', where: published, limit: 1000, select: { slug: true, updatedAt: true } }),
  ])

  const latest = (docs: { updatedAt: string }[]) => docs.map((d) => d.updatedAt).sort().at(-1)

  return [
    { url: `${base}/`, lastModified: home.updatedAt ?? undefined, priority: 1 },
    { url: `${base}/contact`, priority: 0.8 },
    { url: `${base}/projets`, lastModified: latest(projects.docs), priority: 0.7 },
    { url: `${base}/methode`, priority: 0.6 },
    { url: `${base}/guides`, lastModified: latest(guides.docs), priority: 0.6 },
    ...offers.docs.map((d) => ({ url: `${base}/${d.slug}`, lastModified: d.updatedAt, priority: 0.9 })),
    ...guides.docs.map((d) => ({ url: `${base}/guides/${d.slug}`, lastModified: d.updatedAt, priority: 0.7 })),
    ...projects.docs.map((d) => ({ url: `${base}/projets/${d.slug}`, lastModified: d.updatedAt, priority: 0.5 })),
    { url: `${base}/mentions-legales`, priority: 0.1 },
    { url: `${base}/cookies`, priority: 0.1 },
  ]
}
