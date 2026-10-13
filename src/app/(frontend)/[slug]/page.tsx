import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Curso } from '@/components/Curso'
import { Check, Clock, Quote } from '@/components/icons'
import { Media } from '@/components/Media'
import { PlanTabs } from '@/components/PlanTabs'
import { RoiCalculator } from '@/components/RoiCalculator'
import { SnapCarousel } from '@/components/SnapCarousel'
import { Badge, Block, ButtonLink, Eyebrow, FaqList, SectionHeading } from '@/components/ui'
import { getPayloadClient } from '@/lib/payload'
import { tone } from '@/lib/tones'
import { ogImages } from '@/lib/og'
import { cn, formatMinutes } from '@/lib/utils'
import type { Offer } from '@/payload-types'

type Params = { params: Promise<{ slug: string }> }

const getOffer = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'offers',
    where: { slug: { equals: slug }, status: { equals: 'live' }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  return docs[0] as Offer | undefined
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const offer = await getOffer((await params).slug)
  if (!offer) return {}
  return {
    title: offer.meta?.title ?? `Offre ${offer.name.toLowerCase()} — ${offer.promise ?? ''}`,
    description: offer.meta?.description ?? offer.hero?.lead ?? undefined,
    openGraph: { images: ogImages(offer.meta?.image, `/og/offers/${offer.slug}`, offer.updatedAt) },
    alternates: { canonical: `/${offer.slug}` },
  }
}

const moduleVariants = {
  accent: { card: 'bg-accent', num: '', text: '', glyph: 'text-accent-glyph' },
  light: { card: 'border border-line bg-surface-2', num: 'text-muted', text: 'text-body', glyph: 'text-glyph' },
  tone: { card: '', num: '', text: '', glyph: 'text-white/50' },
  dark: { card: 'bg-ink text-white', num: 'text-subtle', text: 'text-on-dark', glyph: 'text-night-glyph' },
} as const

export default async function OfferPage({ params }: Params) {
  const { slug } = await params
  const offer = await getOffer(slug)
  if (!offer) notFound()

  const t = tone(offer.tone)
  const { hero, problem, modules, pricing, roi, process, testimonial, faq, finalCta } = offer
  const contactHref = `/contact?offre=${offer.slug}`
  // Démo / audit : agenda propre à l'offre s'il est renseigné, sinon le formulaire de contact
  const booking = offer.bookingUrl ? { href: offer.bookingUrl, target: '_blank', rel: 'noopener' } : { href: contactHref }
  const maxMinutes = Math.max(1, ...(problem?.breakdown ?? []).map((b) => b.minutes))
  const totalMinutes = (problem?.breakdown ?? []).reduce((sum, b) => sum + b.minutes, 0)
  let n = 0
  const nextNum = () => String(++n).padStart(2, '0')

  type Plan = NonNullable<NonNullable<typeof pricing>['plans']>[number]
  const plans = pricing?.plans ?? []
  const highlighted = Math.max(0, plans.findIndex((p) => p.highlighted))
  const planHref = (plan: Plan) => `${contactHref}&formule=${encodeURIComponent(plan.name)}`

  return (
    <>
      {/* Héros */}
      <section
        className={cn(
          'relative grid grid-cols-1 items-center gap-[18px] overflow-hidden rounded-block px-5 py-6 sm:grid-cols-[1.25fr_1fr] sm:gap-7 sm:p-9 lg:grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))] lg:gap-10 lg:p-[clamp(24px,4.5vw,64px)]',
          t.bg,
        )}
      >
        <div className="relative flex flex-col gap-[18px] sm:gap-5 lg:gap-7">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3 py-[7px] text-[13px] font-medium sm:px-3.5 sm:py-2">
            <span className={cn('font-mono', t.ink)}>/{offer.slug}</span>
            {hero.badge}
          </span>
          <h1 className="m-0 text-[38px] leading-[0.98] font-extrabold tracking-[-0.05em] text-balance sm:text-[50px] sm:leading-[0.96] lg:text-[clamp(42px,5.8vw,84px)] lg:leading-[0.95]">{hero.title}</h1>
          {hero.lead && <p className="m-0 text-[17px] leading-normal text-ink-soft lg:max-w-[520px] lg:text-[19px]">{hero.lead}</p>}
          <HeroCards hero={hero} compact className="sm:hidden" />
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 lg:gap-3">
            <ButtonLink href={roi?.enabled ? '#roi' : contactHref} size="xl" arrow wide className="sm:h-[52px] sm:w-auto sm:justify-center sm:pr-1.5 sm:pl-5 sm:text-base">
              {hero.primaryLabel}
            </ButtonLink>
            <ButtonLink {...booking} variant="white" className="font-medium">
              {hero.secondaryLabel}
            </ButtonLink>
          </div>
          {hero.trustPoints && hero.trustPoints.length > 0 && (
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-sm text-ink-soft sm:flex-row sm:flex-wrap sm:gap-x-5">
              {hero.trustPoints.map((p) => (
                <li key={p.id} className="inline-flex items-center gap-2">
                  <Check className="text-ink" />
                  {p.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tablette : cartes empilées, sans photo */}
        <HeroCards hero={hero} className="max-sm:hidden lg:hidden" />

        {/* Bureau : photo et cartes flottantes */}
        <div className="relative box-border min-h-[560px] py-10 pl-12 max-lg:hidden">
          <div className="absolute inset-y-0 right-0 left-12 flex items-center justify-center overflow-hidden rounded-panel bg-white p-6 text-center font-mono text-[13px] text-muted">
            {hero.image ? <Media resource={hero.image} priority sizes="50vw" /> : `[${hero.imagePlaceholder ?? 'Photo'}]`}
          </div>
          {hero.floatingCards?.docTitle && (
            <div className="absolute top-14 left-0 flex w-[min(280px,80%)] flex-col gap-2.5 rounded-[18px] bg-white px-[18px] py-4 shadow-pop">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted">{hero.floatingCards.docLabel}</span>
                <Badge className="bg-mint text-mint-ink">
                  <span className="size-1.5 rounded-full bg-success-deep" />
                  Envoyé
                </Badge>
              </div>
              <span className="text-[17px] font-semibold">{hero.floatingCards.docTitle}</span>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[26px] font-medium tracking-[-0.03em]">{hero.floatingCards.docAmount}</span>
                <span className="text-xs text-muted">{hero.floatingCards.docTime}</span>
              </div>
            </div>
          )}
          {hero.floatingCards?.timeValue && (
            <div className="absolute right-6 bottom-8 flex items-center gap-3.5 rounded-[18px] bg-ink px-[18px] py-4 text-white shadow-[0_12px_32px_-8px_#10101040]">
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-ink">
                <Clock />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-xs text-subtle">{hero.floatingCards.timeLabel}</span>
                <span className="font-mono text-[22px] font-medium">{hero.floatingCards.timeValue}</span>
              </span>
            </div>
          )}
          {hero.floatingCards?.notification && (
            <div className="absolute top-[72px] right-10 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-medium shadow-pop">
              <span className="size-2 rounded-full bg-signal" />
              {hero.floatingCards.notification}
            </div>
          )}
        </div>
      </section>

      {/* Le constat */}
      {problem?.title && (
        <Block className="pad-block grid grid-cols-1 items-start gap-4 [--h-section-lg:clamp(34px,4vw,54px)] [--h-section-sm:38px] sm:grid-cols-2 sm:gap-8 lg:grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] lg:gap-12">
          <div className="flex flex-col gap-4 sm:gap-3.5 lg:gap-4">
            <Eyebrow>// {nextNum()} — Le constat</Eyebrow>
            <h2 className="h-section">{problem.title}</h2>
            {problem.text && <p className="m-0 max-w-[460px] text-base leading-normal text-body lg:text-[17px] lg:leading-[1.55]">{problem.text}</p>}
          </div>
          {problem.breakdown && problem.breakdown.length > 0 && (
            <div className="flex flex-col gap-3 sm:gap-3.5 lg:gap-[18px]">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-semibold">{problem.breakdownTitle}</span>
                <span className="font-mono text-xs text-muted">total {formatMinutes(totalMinutes)}</span>
              </div>
              {problem.breakdown.map((b) => (
                <div key={b.id} className="flex flex-col gap-1.5 lg:gap-2">
                  <div className="flex justify-between gap-4 text-sm">
                    <span>{b.label}</span>
                    <span className="font-mono">{formatMinutes(b.minutes)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-surface-2 lg:h-3.5">
                    <div className="h-full rounded-full bg-ink" style={{ width: `${(b.minutes / maxMinutes) * 100}%` }} />
                  </div>
                </div>
              ))}
              {problem.footnote && <p className="mt-1 mb-0 text-[13px] leading-normal text-muted">{problem.footnote}</p>}
            </div>
          )}
        </Block>
      )}

      {/* Modules : carrousel sur mobile, 2 × 2 sur tablette */}
      {modules?.items && modules.items.length > 0 && (
        <Block className="flex flex-col gap-4 py-6 [--h-section-lg:clamp(34px,4vw,56px)] [--h-section-sm:38px] sm:gap-6 sm:px-8 sm:py-9 lg:gap-10 lg:p-[clamp(28px,5vw,64px)]">
          <SectionHeading className="px-5 sm:px-0" eyebrow={`// ${nextNum()} — Ce que vous obtenez`} title={modules.title} aside={modules.intro} />
          <SnapCarousel className="sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:px-0 lg:grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))]">
            {modules.items.map((m, i) => {
              const v = moduleVariants[m.variant ?? 'light']
              const dark = m.variant === 'dark'
              return (
                <article
                  key={m.id}
                  className={cn(
                    'relative box-border flex min-h-[240px] flex-[0_0_270px] flex-col overflow-hidden rounded-tile p-5 sm:min-h-[210px] sm:p-[22px] lg:min-h-[360px] lg:justify-between lg:gap-6 lg:p-6',
                    v.card,
                    m.variant === 'tone' && t.bg,
                  )}
                >
                  {m.visual === 'glyph' && m.glyph && (
                    <span aria-hidden="true" className={cn('absolute -right-1.5 -bottom-12 text-[220px] leading-none font-extrabold tracking-[-0.06em] select-none max-lg:hidden', v.glyph)}>
                      {m.glyph}
                    </span>
                  )}
                  <div className="relative flex flex-col gap-2.5 max-lg:contents">
                    <span className={cn('font-mono text-xs', v.num)}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="m-0 text-[21px] leading-[1.12] font-semibold tracking-[-0.02em] max-lg:mt-auto max-lg:mb-2 lg:text-[23px]">{m.title}</h3>
                  </div>

                  {m.visual === 'rows' && m.visualItems && (
                    <div className="relative flex flex-col gap-1.5 text-[13px] max-lg:hidden">
                      {m.visualItems.map((it) => (
                        <div key={it.id} className="flex justify-between rounded-field border border-line bg-white px-2.5 py-2 text-ink">
                          <span>{it.label}</span>
                          {it.value && <span className="font-mono">{it.value}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {m.visual === 'chips' && m.visualItems && (
                    <div className="relative flex flex-wrap gap-1.5 max-lg:hidden">
                      {m.visualItems.map((it) => (
                        <span key={it.id} className="rounded-full bg-white px-2.5 py-[5px] text-xs text-ink">
                          {it.label}
                        </span>
                      ))}
                    </div>
                  )}
                  {m.visual === 'terminal' && m.visualItems && (
                    <div className={cn('relative rounded-xl border px-3 py-2.5 font-mono text-xs leading-[1.8] max-lg:hidden', dark ? 'border-night-line bg-night text-on-dark' : 'border-line bg-white text-body')}>
                      {m.visualItems.map((it) => (
                        <div key={it.id}>
                          {it.label} {it.value && <span className={dark ? 'text-accent' : 'font-medium text-ink'}>{it.value}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className={cn('relative m-0 text-[15px] leading-[1.45] lg:max-w-[260px] lg:leading-normal', v.text)}>{m.description}</p>
                </article>
              )
            })}
          </SnapCarousel>
        </Block>
      )}

      {/* Formules : onglets sur mobile, formule mise en avant pleine largeur sur tablette */}
      {plans.length > 0 && (
        <Block className="pad-block flex flex-col gap-4 [--h-section-lg:clamp(34px,4vw,54px)] [--h-section-sm:38px] sm:gap-5 lg:gap-10">
          <div className="flex flex-col gap-3.5 lg:items-center lg:text-center">
            <Eyebrow>// {nextNum()} — Formules</Eyebrow>
            <h2 className="h-section max-w-[760px]">{pricing?.title}</h2>
            {pricing?.intro && <p className="m-0 max-w-[560px] text-base leading-[1.55] text-muted max-lg:hidden">{pricing.intro}</p>}
          </div>

          <PlanTabs className="sm:hidden" labels={plans.map((p) => p.name)} initial={highlighted}>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} href={planHref(plan)} tab />
            ))}
          </PlanTabs>

          <div className="grid items-stretch gap-3 max-sm:hidden sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))]">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} href={planHref(plan)} />
            ))}
          </div>
          {pricing?.footnote && <p className="m-0 text-[13px] leading-[1.45] text-muted lg:text-center lg:text-sm">{pricing.footnote}</p>}
        </Block>
      )}

      {/* Calculateur */}
      {roi?.enabled && (
        <Block
          id="roi"
          variant="dark"
          className="pad-block grid grid-cols-1 gap-[18px] [--h-section-lg:clamp(34px,4vw,54px)] [--h-section-sm:34px] max-sm:px-4 sm:grid-cols-[1.1fr_1fr] sm:gap-7 lg:grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] lg:gap-10"
        >
          <RoiCalculator
            ctaHref={contactHref}
            ctaLabel={roi.ctaLabel ?? 'Vérifier ces chiffres'}
            offerPrice={roi.offerPrice}
            minutesPerQuoteAfter={roi.minutesPerQuoteAfter ?? 5}
            automationRate={roi.automationRate ?? 60}
            weeksPerYear={roi.weeksPerYear ?? 46}
          >
            <div className="flex flex-col gap-2 max-sm:px-1 sm:gap-2.5 lg:gap-3.5">
              <Eyebrow className="text-subtle">// {nextNum()} — Votre retour sur investissement</Eyebrow>
              <h2 className="h-section">{roi.title}</h2>
              {roi.intro && <p className="m-0 max-w-[460px] text-base leading-[1.55] text-on-dark max-lg:hidden">{roi.intro}</p>}
            </div>
          </RoiCalculator>
        </Block>
      )}

      {/* Déroulé */}
      {process?.steps && process.steps.length > 0 && (
        <Block className="pad-block flex flex-col gap-[18px] [--h-section-sm:38px] sm:gap-5 lg:gap-10">
          <SectionHeading eyebrow={`// ${nextNum()} — Comment ça se passe`} title={process.title} />
          <ol className="m-0 flex list-none flex-col gap-4 p-0 sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] lg:gap-0 lg:border-t-2 lg:border-ink">
            {process.steps.map((step, i) => {
              const last = i === process.steps!.length - 1
              return (
                <li
                  key={step.id}
                  className={cn(
                    'flex gap-3.5 sm:flex-col sm:gap-1.5 sm:rounded-[18px] sm:p-[18px] lg:gap-2.5 lg:rounded-none lg:bg-transparent lg:pt-6 lg:pr-6 lg:pb-0 lg:pl-0',
                    last ? 'sm:bg-accent' : 'sm:bg-surface-2',
                  )}
                >
                  <span className={cn('w-[76px] shrink-0 pt-[3px] font-mono text-xs sm:w-auto sm:pt-0 lg:text-[13px]', !last && 'text-muted')}>
                    <span className={cn(last && 'rounded-chip bg-accent px-1.5 py-0.5 sm:max-lg:bg-transparent sm:max-lg:p-0 lg:px-2')}>{step.when}</span>
                  </span>
                  <span className="flex flex-col gap-0.5 sm:gap-1.5 lg:gap-2.5">
                    <h3 className="m-0 text-[17px] font-semibold tracking-[-0.02em] sm:text-lg lg:text-[21px]">{step.title}</h3>
                    <p className={cn('m-0 text-[15px] leading-[1.45] sm:text-sm lg:text-[15px] lg:leading-normal', last ? 'text-body sm:max-lg:text-ink' : 'text-body')}>{step.text}</p>
                  </span>
                </li>
              )
            })}
          </ol>
        </Block>
      )}

      {/* Preuve + FAQ */}
      {(testimonial?.quote || (faq && faq.length > 0)) && (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.2fr] lg:grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))]">
          {testimonial?.quote && (
            <figure className={cn('m-0 flex flex-col justify-between gap-[18px] rounded-block px-5 py-6 sm:gap-5 sm:p-7 lg:gap-10 lg:p-[clamp(28px,4vw,48px)]', t.bg)}>
              <Quote className="text-ink max-lg:hidden" />
              <blockquote className="m-0 text-[22px] leading-[1.25] font-semibold tracking-[-0.02em] lg:text-[clamp(24px,2.6vw,34px)] lg:leading-[1.2] lg:tracking-[-0.025em]">{testimonial.quote}</blockquote>
              <figcaption className="flex items-center gap-3">
                <span aria-hidden="true" className="relative flex size-10 items-center justify-center overflow-hidden rounded-full bg-white font-mono text-[11px] lg:size-12">
                  {testimonial.photo ? <Media resource={testimonial.photo} sizes="48px" /> : '[ph]'}
                </span>
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold">{testimonial.author}</span>
                  <span className="text-sm">{testimonial.company}</span>
                </span>
              </figcaption>
            </figure>
          )}
          {faq && faq.length > 0 && (
            <div className="flex flex-col gap-2 rounded-block bg-white px-5 py-6 sm:gap-3 sm:px-7 lg:gap-5 lg:p-[clamp(28px,4vw,48px)]">
              <Eyebrow>// {nextNum()} — Questions fréquentes</Eyebrow>
              <FaqList items={faq} />
            </div>
          )}
        </section>
      )}

      {/* CTA final (la barre collante le remplace sur mobile) */}
      {finalCta?.title && (
        <Block variant="accent" className="flex flex-col items-center gap-[18px] px-8 py-10 text-center max-sm:hidden lg:gap-6 lg:p-[clamp(32px,6vw,80px)]">
          <h2 className="m-0 max-w-[900px] text-[44px] leading-[0.98] font-extrabold tracking-[-0.05em] text-balance lg:text-[clamp(36px,5vw,72px)]">{finalCta.title}</h2>
          {finalCta.text && <p className="m-0 max-w-[520px] text-[17px] leading-normal lg:text-lg">{finalCta.text}</p>}
          <ButtonLink {...booking} size="xl" arrow>
            {finalCta.label}
          </ButtonLink>
        </Block>
      )}

      {/* Barre d’action collante (mobile) */}
      <div className="sticky bottom-3 z-10 flex gap-2 rounded-full border border-line bg-white/90 p-2 shadow-pop backdrop-blur-[10px] sm:hidden">
        {roi?.enabled && (
          <Link href="#roi" className="flex h-12 flex-1 items-center justify-center rounded-full bg-accent px-3 text-[15px] font-semibold text-ink no-underline">
            Mon gain
          </Link>
        )}
        <Link {...booking} className="flex h-12 flex-[1.4] items-center justify-center rounded-full bg-ink px-3 text-center text-[15px] font-semibold text-white no-underline">
          {finalCta?.label ?? hero.secondaryLabel}
        </Link>
      </div>
    </>
  )
}

type Hero = Offer['hero']

/** Cartes du héros sans photo : superposées sur mobile (`compact`), empilées sur tablette. */
const HeroCards = ({ hero, compact = false, className }: { hero: Hero; compact?: boolean; className?: string }) => {
  const cards = hero.floatingCards
  if (!cards?.docTitle && !cards?.timeValue) return null
  return (
    <div className={cn(compact ? 'relative h-[210px]' : 'flex flex-col gap-3', className)}>
      {cards.docTitle && (
        <div className={cn('flex flex-col gap-2 bg-white shadow-pop', compact ? 'absolute top-0 left-0 w-60 rounded-[18px] px-4 py-3.5' : 'rounded-tile px-[18px] py-4')}>
          <div className="flex items-center justify-between">
            <span className={cn('text-muted', compact ? 'text-xs' : 'text-[13px]')}>{cards.docLabel}</span>
            <Badge className="bg-mint text-mint-ink">Envoyé</Badge>
          </div>
          <span className={cn('font-semibold', compact ? 'text-base' : 'text-[17px]')}>{cards.docTitle}</span>
          <span className={cn('font-mono font-medium tracking-[-0.03em]', compact ? 'text-[22px]' : 'text-[26px]')}>{cards.docAmount}</span>
        </div>
      )}
      {cards.timeValue && (
        <div className={cn('flex items-center bg-ink text-white', compact ? 'absolute right-0 bottom-0 gap-2.5 rounded-[18px] px-3.5 py-3 shadow-[0_12px_32px_-8px_#10101040]' : 'gap-3.5 rounded-tile px-[18px] py-4')}>
          <Curso size={compact ? 44 : 56} tone="sombre" expression="content" />
          <span className="flex flex-col">
            <span className={cn('text-subtle', compact ? 'text-[11px]' : 'text-xs')}>{cards.timeLabel}</span>
            <span className={cn('font-mono font-medium', compact ? 'text-xl' : 'text-2xl')}>{cards.timeValue}</span>
          </span>
        </div>
      )}
      {!compact && cards.notification && (
        <div className="flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 text-sm font-medium">
          <span className="size-2 rounded-full bg-signal" />
          {cards.notification}
        </div>
      )}
    </div>
  )
}

type PlanItem = NonNullable<NonNullable<Offer['pricing']>['plans']>[number]

/**
 * Carte de formule. `tab` : panneau des onglets mobiles (le nom est dans l'onglet).
 * Sur tablette, la formule mise en avant prend toute la largeur, prix à gauche et liste à droite,
 * et les autres se réduisent à l'essentiel.
 */
const PlanCard = ({ plan, href, tab = false }: { plan: PlanItem; href: string; tab?: boolean }) => {
  const hi = Boolean(plan.highlighted)
  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-tile p-[22px] lg:gap-6 lg:rounded-panel lg:p-7',
        hi ? 'bg-ink text-white' : 'border border-line bg-surface-2',
        !tab && hi && 'sm:col-span-2 sm:order-first sm:grid sm:grid-cols-2 sm:items-end sm:gap-x-6 sm:p-[26px] lg:order-none lg:col-span-1 lg:flex',
        !tab && !hi && 'sm:gap-3.5',
      )}
    >
      <div className={cn('flex items-start justify-between gap-3', tab && !hi && 'hidden')}>
        <div className="flex flex-col gap-1.5">
          {!tab && <h3 className="m-0 text-xl font-semibold sm:max-lg:text-2xl lg:text-[22px]">{plan.name}</h3>}
          {plan.subtitle && <span className={cn(tab ? 'text-[15px]' : 'text-sm', hi ? 'text-subtle' : 'text-muted')}>{plan.subtitle}</span>}
        </div>
        {hi && plan.badge && <Badge className="shrink-0 bg-accent text-ink">{plan.badge}</Badge>}
      </div>
      {tab && !hi && plan.subtitle && <span className="text-[15px] text-muted">{plan.subtitle}</span>}
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span className={cn('font-extrabold tracking-[-0.045em]', !tab && !hi ? 'text-[32px] lg:text-[44px]' : 'text-[40px] sm:text-[44px]')}>{plan.price ?? '[PRIX] €'}</span>
        {plan.priceNote && <span className={cn('text-sm', hi ? 'text-subtle' : 'text-muted', !tab && !hi && 'sm:max-lg:hidden')}>{plan.priceNote}</span>}
      </div>
      <ul
        className={cn(
          'm-0 flex flex-1 list-none flex-col gap-2.5 p-0 text-[15px]',
          hi ? 'text-on-dark' : 'text-body',
          !tab && hi && 'sm:max-lg:col-start-2 sm:max-lg:row-span-3 sm:max-lg:row-start-1 sm:max-lg:self-center',
          !tab && !hi && 'sm:max-lg:hidden',
        )}
      >
        {plan.features?.map((f) => (
          <li key={f.id} className="flex gap-2">
            <Check className={cn('mt-0.5 shrink-0', hi ? 'text-accent' : 'text-ink')} />
            {f.text}
          </li>
        ))}
      </ul>
      <ButtonLink href={href} variant={hi ? 'accent' : 'outline'} size="md" className={cn('w-full', !tab && hi && 'sm:max-lg:w-auto sm:max-lg:self-start')}>
        {plan.ctaLabel ?? `Choisir ${plan.name}`}
      </ButtonLink>
    </article>
  )
}
