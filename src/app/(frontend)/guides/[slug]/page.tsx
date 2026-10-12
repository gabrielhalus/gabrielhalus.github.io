import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GuideCard } from '@/components/GuideCard'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Toc } from '@/components/Toc'
import { Block, ButtonLink, FaqList } from '@/components/ui'
import { extractHeadings, readingTime } from '@/lib/lexical'
import { getPayloadClient, getSettings } from '@/lib/payload'
import { tone } from '@/lib/tones'
import { ogImages } from '@/lib/og'
import { cn, formatDate, isMedia, offerPath } from '@/lib/utils'
import type { Guide, Offer } from '@/payload-types'

type Params = { params: Promise<{ slug: string }> }

const getGuide = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'guides',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  return docs[0] as Guide | undefined
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const guide = await getGuide((await params).slug)
  if (!guide) return {}
  return {
    title: guide.meta?.title ?? guide.title,
    description: guide.meta?.description ?? guide.lead ?? undefined,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: 'article',
      publishedTime: guide.publishedAt ?? undefined,
      modifiedTime: guide.updatedAt,
      images: ogImages(guide.meta?.image, `/og/guides/${guide.slug}`, guide.updatedAt),
    },
  }
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params
  const guide = await getGuide(slug)
  if (!guide) notFound()

  const settings = await getSettings()
  const t = tone(guide.tone)
  const offer = typeof guide.offer === 'object' ? (guide.offer as Offer | null) : null
  const related = (guide.related ?? []).filter((g): g is Guide => typeof g === 'object' && g._status === 'published')
  const minutes = guide.readingTime ?? readingTime(guide.content, guide.intro ?? '')
  const toc = [...extractHeadings(guide.content), ...(guide.faq?.length ? [{ id: 'faq', label: 'Questions fréquentes' }] : [])]
  const initials = (settings.siteName ?? '')
    .split(' ')
    .map((w) => w[0])
    .join('')
  const base = settings.siteUrl ?? ''

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.lead,
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt,
      author: { '@type': 'Person', name: settings.siteName, url: base },
      mainEntityOfPage: `${base}/guides/${guide.slug}`,
      image: isMedia(guide.cover) ? `${base}${guide.cover.url}` : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: base || '/' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${base}/guides` },
        { '@type': 'ListItem', position: 3, name: guide.title },
      ],
    },
    ...(guide.faq?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: guide.faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
          },
        ]
      : []),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      {/* En-tête */}
      <header className={cn('flex flex-col gap-7 rounded-block p-[clamp(24px,5vw,72px)]', t.bg)}>
        <nav aria-label="Fil d’Ariane" className="text-sm">
          <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
            <li>
              <Link href="/" className="text-ink-soft no-underline hover:text-ink">Accueil</Link>
            </li>
            <li aria-hidden="true" className="text-muted">/</li>
            <li>
              <Link href="/guides" className="text-ink-soft no-underline hover:text-ink">Guides</Link>
            </li>
            {offer && (
              <>
                <li aria-hidden="true" className="text-muted">/</li>
                <li>
                  <Link href={offerPath(offer.slug)} className="text-ink-soft no-underline hover:text-ink">{offer.name}</Link>
                </li>
              </>
            )}
            <li aria-hidden="true" className="text-muted">/</li>
            <li aria-current="page" className="font-medium">{guide.title}</li>
          </ol>
        </nav>
        <div className="flex max-w-[980px] flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            {guide.category && <span className="rounded-full bg-white px-3.5 py-[7px] text-[13px] font-medium">{guide.category}</span>}
            {guide.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-white/50 px-3.5 py-[7px] text-[13px]">{tag}</span>
            ))}
          </div>
          <h1 className="m-0 text-[clamp(40px,5.6vw,80px)] leading-[0.96] font-extrabold tracking-[-0.05em] text-balance">{guide.title}</h1>
          {guide.lead && <p className="m-0 max-w-[720px] text-[clamp(18px,1.6vw,21px)] leading-normal text-ink-soft">{guide.lead}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm text-ink-soft">
          <span className="flex items-center gap-2.5">
            <span aria-hidden="true" className="relative flex size-10 items-center justify-center overflow-hidden rounded-full bg-ink text-sm font-bold text-accent">
              {settings.portrait ? <Media resource={settings.portrait} sizes="40px" /> : initials}
            </span>
            <span className="flex flex-col">
              <span className="font-semibold text-ink">{settings.siteName}</span>
              <span>{settings.role}{offer ? `, outils pour ${offer.name.toLowerCase()}` : ''}</span>
            </span>
          </span>
          <span aria-hidden="true" className="h-7 w-px bg-ink/15" />
          <span>
            Mis à jour le <time dateTime={guide.updatedAt}>{formatDate(guide.updatedAt)}</time>
          </span>
          <span aria-hidden="true" className="h-7 w-px bg-ink/15" />
          <span className="font-mono text-[13px]">{minutes} min de lecture</span>
        </div>
      </header>

      {/* Corps */}
      <div className="flex flex-wrap items-start gap-3">
        {guide.showToc && toc.length > 0 && (
          <aside className="box-border flex max-w-full flex-[1_1_280px] flex-col gap-3 lg:sticky lg:top-6">
            <Toc items={toc} />
            {offer && (
              <div className="flex flex-col gap-4 rounded-block bg-ink p-6 text-white">
                <span className="text-lg leading-tight font-semibold">{offer.promise ? `${offer.name} : ${offer.promise}.` : `Découvrir l’offre ${offer.name.toLowerCase()}.`}</span>
                <ButtonLink href={offerPath(offer.slug)} variant="accent" size="md" arrow className="justify-between">
                  Voir l’offre {offer.name.toLowerCase()}
                </ButtonLink>
              </div>
            )}
          </aside>
        )}

        <article className="box-border flex min-w-0 flex-[999_1_640px] flex-col gap-7 rounded-block bg-white px-[clamp(20px,5vw,96px)] py-[clamp(24px,5vw,80px)]">
          {guide.tldr && guide.tldr.length > 0 && (
            <section aria-label="En bref" className="flex max-w-[760px] flex-col gap-3 rounded-tile bg-accent-soft px-7 py-6">
              <span className="eyebrow text-accent-ink">En bref</span>
              <ul className="m-0 flex flex-col gap-2 pl-5 text-[17px] leading-[1.55] text-ink">
                {guide.tldr.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex max-w-[760px] flex-col gap-[22px]">
            {guide.intro && <p className="m-0 text-xl leading-relaxed text-ink">{guide.intro}</p>}
            <RichText data={guide.content} />

            {guide.faq && guide.faq.length > 0 && (
              <>
                <h2 id="faq" className="mt-6 mb-0 text-[clamp(28px,2.6vw,38px)] leading-[1.1] font-bold tracking-[-0.03em] text-ink">
                  Questions fréquentes
                </h2>
                <FaqList items={guide.faq} size="lg" className="border-t border-line" />
              </>
            )}
          </div>

          {/* Auteur */}
          <section aria-label="À propos de l’auteur" className="mt-4 flex max-w-[760px] flex-wrap items-start gap-5 rounded-tile bg-surface-2 p-6">
            <span aria-hidden="true" className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink text-xl font-bold text-accent">
              {settings.portrait ? <Media resource={settings.portrait} sizes="64px" /> : initials}
            </span>
            <div className="flex flex-[1_1_280px] flex-col gap-1.5 text-base leading-[1.55] text-body">
              <span className="text-lg font-semibold text-ink">{settings.siteName}</span>
              {settings.authorBio && <span>{settings.authorBio}</span>}
              <Link href="/" className="self-start text-[15px] font-medium text-ink">Voir mon parcours</Link>
            </div>
          </section>
        </article>
      </div>

      {/* Maillage interne */}
      {related.length > 0 && (
        <Block aria-labelledby="lies" className="flex flex-col gap-7 p-[clamp(28px,4vw,56px)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="lies" className="m-0 text-[clamp(28px,3vw,44px)] leading-none font-bold tracking-[-0.035em]">À lire ensuite</h2>
            <Link href="/guides" className="text-[15px] font-medium text-ink">Tous les guides</Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-3">
            {related.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
        </Block>
      )}

      {/* CTA final */}
      <Block variant="accent" className="flex flex-wrap items-center justify-between gap-7 p-[clamp(32px,5vw,72px)]">
        <div className="flex flex-[1_1_420px] flex-col gap-3">
          <h2 className="m-0 text-[clamp(32px,4vw,56px)] leading-none font-extrabold tracking-[-0.045em] text-balance">
            {offer?.finalCta?.title ?? 'Un process qui vous coûte des heures ?'}
          </h2>
          {offer?.finalCta?.text && <p className="m-0 text-lg leading-normal">{offer.finalCta.text}</p>}
        </div>
        <ButtonLink href={offer ? `/contact?offre=${offer.slug}` : '/contact'} size="xl" arrow>
          {offer?.finalCta?.label ?? 'Parlons-en'}
        </ButtonLink>
      </Block>
    </>
  )
}
