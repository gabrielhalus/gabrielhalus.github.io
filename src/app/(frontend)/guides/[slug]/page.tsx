import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GuideCard } from '@/components/GuideCard'
import { ArrowRight } from '@/components/icons'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { SnapCarousel } from '@/components/SnapCarousel'
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
      <header className={cn('flex flex-col gap-4 rounded-block px-5 pt-5 pb-6 sm:gap-7 sm:p-[clamp(24px,5vw,72px)]', t.bg)}>
        <Link href={offer ? offerPath(offer.slug) : '/guides'} className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-ink-soft no-underline sm:hidden">
          <ArrowRight size={14} className="rotate-180" />
          Guides{offer && ` · ${offer.name}`}
        </Link>
        <nav aria-label="Fil d’Ariane" className="text-sm max-sm:hidden">
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
        <div className="flex max-w-[980px] flex-col gap-4 sm:gap-5">
          <div className="flex flex-wrap gap-2 max-sm:hidden">
            {guide.category && <span className="rounded-full bg-white px-3.5 py-[7px] text-[13px] font-medium">{guide.category}</span>}
            {guide.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-white/50 px-3.5 py-[7px] text-[13px]">{tag}</span>
            ))}
          </div>
          <h1 className="m-0 text-[34px] leading-none font-extrabold tracking-[-0.05em] text-balance sm:text-[clamp(40px,5.6vw,80px)] sm:leading-[0.96]">{guide.title}</h1>
          {guide.lead && <p className="m-0 max-w-[720px] text-[17px] leading-normal text-ink-soft sm:text-[clamp(18px,1.6vw,21px)]">{guide.lead}</p>}
        </div>
        <div className="flex items-center gap-2.5 text-[13px] text-ink-soft sm:hidden">
          <span aria-hidden="true" className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink text-xs font-bold text-accent shadow-[0_0_0_2px_#fff]">
            {settings.portrait ? <Media resource={settings.portrait} sizes="36px" /> : initials}
          </span>
          <span className="flex flex-col">
            <span className="font-semibold text-ink">{settings.siteName}</span>
            <span>
              <time dateTime={guide.updatedAt}>{formatDate(guide.updatedAt)}</time> · {minutes} min
            </span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm text-ink-soft max-sm:hidden">
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
              <div className="flex flex-col gap-4 rounded-block bg-ink p-6 text-white max-sm:hidden">
                <span className="text-lg leading-tight font-semibold">{offer.promise ? `${offer.name} : ${offer.promise}.` : `Découvrir l’offre ${offer.name.toLowerCase()}.`}</span>
                <ButtonLink href={offerPath(offer.slug)} variant="accent" size="md" arrow wide>
                  Voir l’offre {offer.name.toLowerCase()}
                </ButtonLink>
              </div>
            )}
          </aside>
        )}

        <article className="box-border flex min-w-0 flex-[999_1_640px] flex-col gap-[18px] rounded-block bg-white px-5 pt-[22px] pb-7 sm:gap-7 sm:px-[clamp(20px,5vw,96px)] sm:py-[clamp(24px,5vw,80px)]">
          {guide.tldr && guide.tldr.length > 0 && (
            <section aria-label="En bref" className="flex max-w-[760px] flex-col gap-2 rounded-2xl bg-accent-soft px-[18px] py-4 sm:gap-3 sm:rounded-tile sm:px-7 sm:py-6">
              <span className="eyebrow text-accent-ink">En bref</span>
              <ul className="m-0 flex flex-col gap-1.5 pl-[18px] text-[15px] leading-normal text-ink sm:gap-2 sm:pl-5 sm:text-[17px] sm:leading-[1.55]">
                {guide.tldr.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex max-w-[760px] flex-col gap-[18px] sm:gap-[22px]">
            {guide.intro && <p className="m-0 text-lg leading-[1.6] text-ink sm:text-xl sm:leading-relaxed">{guide.intro}</p>}
            <RichText data={guide.content} />

            {guide.faq && guide.faq.length > 0 && (
              <>
                <h2 id="faq" className="mt-2.5 mb-0 text-[26px] leading-[1.1] font-bold tracking-[-0.03em] text-ink sm:mt-6 sm:text-[clamp(28px,2.6vw,38px)]">
                  Questions fréquentes
                </h2>
                <FaqList items={guide.faq} size="lg" className="border-t border-line" />
              </>
            )}
          </div>

          {/* Auteur */}
          <section aria-label="À propos de l’auteur" className="mt-1.5 flex max-w-[760px] items-start gap-3.5 rounded-2xl bg-surface-2 p-4 sm:mt-4 sm:flex-wrap sm:gap-5 sm:rounded-tile sm:p-6">
            <span aria-hidden="true" className="relative flex size-12 shrink-0 sm:size-16 items-center justify-center overflow-hidden rounded-full bg-ink text-xl font-bold text-accent">
              {settings.portrait ? <Media resource={settings.portrait} sizes="64px" /> : initials}
            </span>
            <div className="flex flex-col gap-1 text-sm leading-normal text-body sm:flex-[1_1_280px] sm:gap-1.5 sm:text-base sm:leading-[1.55]">
              <span className="text-base font-semibold text-ink sm:text-lg">{settings.siteName}</span>
              {settings.authorBio && <span>{settings.authorBio}</span>}
              <Link href="/" className="self-start text-[15px] font-medium text-ink">Voir mon parcours</Link>
            </div>
          </section>
        </article>
      </div>

      {/* Maillage interne */}
      {related.length > 0 && (
        <Block aria-labelledby="lies" className="flex flex-col gap-3.5 py-[22px] sm:gap-7 sm:p-[clamp(28px,4vw,56px)]">
          <div className="flex flex-wrap items-end justify-between gap-4 px-5 sm:px-0">
            <h2 id="lies" className="m-0 text-[22px] leading-none font-bold tracking-[-0.02em] sm:text-[clamp(28px,3vw,44px)] sm:tracking-[-0.035em]">À lire ensuite</h2>
            <Link href="/guides" className="text-[15px] font-medium text-ink max-sm:hidden">Tous les guides</Link>
          </div>
          <SnapCarousel className="sm:grid sm:grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] sm:gap-3 sm:overflow-visible sm:px-0">
            {related.map((g) => (
              <GuideCard key={g.id} guide={g} inCarousel />
            ))}
          </SnapCarousel>
        </Block>
      )}

      {/* CTA final */}
      <Block variant="accent" className="flex flex-wrap items-center justify-between gap-7 p-[clamp(32px,5vw,72px)] max-sm:hidden">
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

      {/* Barre d’action collante (mobile) */}
      <div className="sticky bottom-3 z-10 flex items-center gap-2.5 rounded-full bg-ink py-2 pr-2 pl-4 shadow-[0_12px_32px_-8px_#10101050] sm:hidden">
        <span className="flex-1 text-sm leading-[1.3] text-white">{offer?.promise ? `${offer.name} : ${offer.promise}` : 'Un process qui vous coûte des heures ?'}</span>
        <Link href={offer ? `/contact?offre=${offer.slug}` : '/contact'} className="flex h-11 shrink-0 items-center rounded-full bg-accent px-4 text-[15px] font-semibold text-ink no-underline">
          {offer?.finalCta?.label ?? 'Parlons-en'}
        </Link>
      </div>
    </>
  )
}
