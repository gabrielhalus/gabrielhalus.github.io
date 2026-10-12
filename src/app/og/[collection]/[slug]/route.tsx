import { getPayloadClient, getSettings } from '@/lib/payload'
import { domainOf, type OgImageProps, renderOgImage } from '@/og/image'

type Ctx = { params: Promise<{ collection: string; slug: string }> }

const published = (slug: string) => ({ slug: { equals: slug }, _status: { equals: 'published' as const } })

/** Image de partage générée pour une offre, un guide ou un projet publié. */
export async function GET(_req: Request, { params }: Ctx) {
  const { collection, slug } = await params
  const [settings, payload] = await Promise.all([getSettings(), getPayloadClient()])
  let props: OgImageProps | undefined

  if (collection === 'offers') {
    const offer = (await payload.find({ collection, where: published(slug), limit: 1, depth: 0 })).docs[0]
    if (offer) props = { title: offer.hero?.title || offer.promise || offer.name, badges: ['Offre métier', offer.name], tint: offer.tone }
  } else if (collection === 'guides') {
    const guide = (await payload.find({ collection, where: published(slug), limit: 1, depth: 1 })).docs[0]
    const offerName = guide?.offer && typeof guide.offer === 'object' ? guide.offer.name : null
    if (guide) props = { title: guide.title, badges: ['Guide pratique', offerName ?? guide.category], tint: guide.tone, expression: 'curieux' }
  } else if (collection === 'projects') {
    const project = (await payload.find({ collection, where: published(slug), limit: 1, depth: 0 })).docs[0]
    if (project) props = { title: project.title, badges: ['Étude de cas', project.sector], tint: project.tone }
  }

  if (!props) return new Response('Not found', { status: 404 })
  return renderOgImage({ ...props, domain: domainOf(settings.siteUrl) })
}
