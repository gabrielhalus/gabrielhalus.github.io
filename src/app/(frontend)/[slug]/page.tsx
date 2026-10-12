import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Check, Clock, Quote } from '@/components/icons'
import { Media } from '@/components/Media'
import { RoiCalculator } from '@/components/RoiCalculator'
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

  return (
    <>
      {/* Héros */}
      <section className={cn('relative grid grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))] items-center gap-10 overflow-hidden rounded-block p-[clamp(24px,4.5vw,64px)]', t.bg)}>
        <div className="relative flex flex-col gap-7">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3.5 py-2 text-[13px] font-medium">
            <span className={cn('font-mono', t.ink)}>/{offer.slug}</span>
            {hero.badge}
          </span>
          <h1 className="m-0 text-[clamp(42px,5.8vw,84px)] leading-[0.95] font-extrabold tracking-[-0.05em] text-balance">{hero.title}</h1>
          {hero.lead && <p className="m-0 max-w-[520px] text-[19px] leading-normal text-ink-soft">{hero.lead}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href={roi?.enabled ? '#roi' : contactHref} arrow>
              {hero.primaryLabel}
            </ButtonLink>
            <ButtonLink {...booking} variant="white" className="font-medium">
              {hero.secondaryLabel}
            </ButtonLink>
          </div>
          {hero.trustPoints && hero.trustPoints.length > 0 && (
            <ul className="m-0 flex list-none flex-wrap gap-5 p-0 text-sm text-ink-soft">
              {hero.trustPoints.map((p) => (
                <li key={p.id} className="inline-flex items-center gap-2">
                  <Check className="text-ink" />
                  {p.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative box-border min-h-[460px] py-10 pl-6 sm:min-h-[560px] sm:pl-12">
          <div className="absolute inset-y-0 right-0 left-6 flex items-center justify-center overflow-hidden rounded-panel bg-white p-6 text-center font-mono text-[13px] text-muted sm:left-12">
            {hero.image ? <Media resource={hero.image} priority sizes="(min-width: 1024px) 50vw, 100vw" /> : `[${hero.imagePlaceholder ?? 'Photo'}]`}
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
            <div className="absolute top-[72px] right-10 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-medium shadow-pop sm:flex">
              <span className="size-2 rounded-full bg-signal" />
              {hero.floatingCards.notification}
            </div>
          )}
        </div>
      </section>

      {/* Le constat */}
      {problem?.title && (
        <Block className="pad-block grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] items-start gap-12">
          <div className="flex flex-col gap-4">
            <Eyebrow>// {nextNum()} — Le constat</Eyebrow>
            <h2 className="h-section text-[clamp(34px,4vw,54px)]">{problem.title}</h2>
            {problem.text && <p className="m-0 max-w-[460px] text-[17px] leading-[1.55] text-body">{problem.text}</p>}
          </div>
          {problem.breakdown && problem.breakdown.length > 0 && (
            <div className="flex flex-col gap-[18px]">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-semibold">{problem.breakdownTitle}</span>
                <span className="font-mono text-xs text-muted">total {formatMinutes(totalMinutes)}</span>
              </div>
              {problem.breakdown.map((b) => (
                <div key={b.id} className="flex flex-col gap-2">
                  <div className="flex justify-between gap-4 text-sm">
                    <span>{b.label}</span>
                    <span className="font-mono">{formatMinutes(b.minutes)}</span>
                  </div>
                  <div className="h-3.5 rounded-full bg-surface-2">
                    <div className="h-3.5 rounded-full bg-ink" style={{ width: `${(b.minutes / maxMinutes) * 100}%` }} />
                  </div>
                </div>
              ))}
              {problem.footnote && <p className="mt-1 mb-0 text-[13px] leading-normal text-muted">{problem.footnote}</p>}
            </div>
          )}
        </Block>
      )}

      {/* Modules */}
      {modules?.items && modules.items.length > 0 && (
        <Block className="pad-block flex flex-col gap-10">
          <SectionHeading eyebrow={`// ${nextNum()} — Ce que vous obtenez`} title={modules.title} aside={modules.intro} />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-3">
            {modules.items.map((m, i) => {
              const v = moduleVariants[m.variant ?? 'light']
              const dark = m.variant === 'dark'
              return (
                <article key={m.id} className={cn('relative box-border flex min-h-[360px] flex-col justify-between gap-6 overflow-hidden rounded-tile p-6', v.card, m.variant === 'tone' && t.bg)}>
                  {m.visual === 'glyph' && m.glyph && (
                    <span aria-hidden="true" className={cn('absolute -right-1.5 -bottom-12 text-[220px] leading-none font-extrabold tracking-[-0.06em] select-none', v.glyph)}>
                      {m.glyph}
                    </span>
                  )}
                  <div className="relative flex flex-col gap-2.5">
                    <span className={cn('font-mono text-xs', v.num)}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="m-0 text-[23px] leading-[1.12] font-semibold tracking-[-0.02em]">{m.title}</h3>
                  </div>

                  {m.visual === 'rows' && m.visualItems && (
                    <div className="relative flex flex-col gap-1.5 text-[13px]">
                      {m.visualItems.map((it) => (
                        <div key={it.id} className="flex justify-between rounded-field border border-line bg-white px-2.5 py-2 text-ink">
                          <span>{it.label}</span>
                          {it.value && <span className="font-mono">{it.value}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {m.visual === 'chips' && m.visualItems && (
                    <div className="relative flex flex-wrap gap-1.5">
                      {m.visualItems.map((it) => (
                        <span key={it.id} className="rounded-full bg-white px-2.5 py-[5px] text-xs text-ink">
                          {it.label}
                        </span>
                      ))}
                    </div>
                  )}
                  {m.visual === 'terminal' && m.visualItems && (
                    <div className={cn('relative rounded-xl border px-3 py-2.5 font-mono text-xs leading-[1.8]', dark ? 'border-night-line bg-night text-on-dark' : 'border-line bg-white text-body')}>
                      {m.visualItems.map((it) => (
                        <div key={it.id}>
                          {it.label} {it.value && <span className={dark ? 'text-accent' : 'font-medium text-ink'}>{it.value}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className={cn('relative m-0 max-w-[260px] text-[15px] leading-normal', v.text)}>{m.description}</p>
                </article>
              )
            })}
          </div>
        </Block>
      )}

      {/* Formules */}
      {pricing?.plans && pricing.plans.length > 0 && (
        <Block className="pad-block flex flex-col gap-10">
          <div className="flex flex-col items-center gap-3.5 text-center">
            <Eyebrow>// {nextNum()} — Formules</Eyebrow>
            <h2 className="h-section max-w-[760px] text-[clamp(34px,4vw,54px)]">{pricing.title}</h2>
            {pricing.intro && <p className="m-0 max-w-[560px] text-base leading-[1.55] text-muted">{pricing.intro}</p>}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-stretch gap-3">
            {pricing.plans.map((plan) => {
              const hi = Boolean(plan.highlighted)
              return (
                <article key={plan.id} className={cn('flex flex-col gap-6 rounded-panel p-7', hi ? 'bg-ink text-white' : 'border border-line bg-surface-2')}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="m-0 text-[22px] font-semibold">{plan.name}</h3>
                      {plan.subtitle && <span className={cn('text-sm', hi ? 'text-subtle' : 'text-muted')}>{plan.subtitle}</span>}
                    </div>
                    {hi && plan.badge && <Badge className="bg-accent text-ink">{plan.badge}</Badge>}
                  </div>
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-[44px] font-extrabold tracking-[-0.045em]">{plan.price ?? '[PRIX] €'}</span>
                    {plan.priceNote && <span className={cn('text-sm', hi ? 'text-subtle' : 'text-muted')}>{plan.priceNote}</span>}
                  </div>
                  <ul className={cn('m-0 flex flex-1 list-none flex-col gap-2.5 p-0 text-[15px]', hi ? 'text-on-dark' : 'text-body')}>
                    {plan.features?.map((f) => (
                      <li key={f.id} className="flex gap-2">
                        <Check className={cn('mt-0.5 shrink-0', hi ? 'text-accent' : 'text-ink')} />
                        {f.text}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href={`${contactHref}&formule=${encodeURIComponent(plan.name)}`}
                    variant={hi ? 'accent' : 'outline'}
                    size="md"
                    className="w-full"
                  >
                    {plan.ctaLabel ?? `Choisir ${plan.name}`}
                  </ButtonLink>
                </article>
              )
            })}
          </div>
          {pricing.footnote && <p className="m-0 text-center text-sm text-muted">{pricing.footnote}</p>}
        </Block>
      )}

      {/* Calculateur */}
      {roi?.enabled && (
        <Block id="roi" variant="dark" className="pad-block grid grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] gap-10">
          <RoiCalculator
            ctaHref={contactHref}
            ctaLabel={roi.ctaLabel ?? 'Vérifier ces chiffres'}
            offerPrice={roi.offerPrice}
            minutesPerQuoteAfter={roi.minutesPerQuoteAfter ?? 5}
            automationRate={roi.automationRate ?? 60}
            weeksPerYear={roi.weeksPerYear ?? 46}
          >
            <div className="flex flex-col gap-3.5">
              <Eyebrow className="text-subtle">// {nextNum()} — Votre retour sur investissement</Eyebrow>
              <h2 className="h-section text-[clamp(34px,4vw,54px)]">{roi.title}</h2>
              {roi.intro && <p className="m-0 max-w-[460px] text-base leading-[1.55] text-on-dark">{roi.intro}</p>}
            </div>
          </RoiCalculator>
        </Block>
      )}

      {/* Déroulé */}
      {process?.steps && process.steps.length > 0 && (
        <Block className="pad-block flex flex-col gap-10">
          <SectionHeading eyebrow={`// ${nextNum()} — Comment ça se passe`} title={process.title} />
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] border-t-2 border-ink p-0">
            {process.steps.map((step, i) => {
              const last = i === process.steps!.length - 1
              return (
                <li key={step.id} className="flex flex-col gap-2.5 pt-6 pr-6">
                  <span className={cn('self-start font-mono text-[13px]', last ? 'rounded-chip bg-accent px-2 py-0.5' : 'text-muted')}>{step.when}</span>
                  <h3 className="m-0 text-[21px] font-semibold tracking-[-0.02em]">{step.title}</h3>
                  <p className="m-0 text-[15px] leading-normal text-body">{step.text}</p>
                </li>
              )
            })}
          </ol>
        </Block>
      )}

      {/* Preuve + FAQ */}
      {(testimonial?.quote || (faq && faq.length > 0)) && (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-3">
          {testimonial?.quote && (
            <figure className={cn('m-0 flex flex-col justify-between gap-10 rounded-block p-[clamp(28px,4vw,48px)]', t.bg)}>
              <Quote className="text-ink" />
              <blockquote className="m-0 text-[clamp(24px,2.6vw,34px)] leading-[1.2] font-semibold tracking-[-0.025em]">{testimonial.quote}</blockquote>
              <figcaption className="flex items-center gap-3">
                <span aria-hidden="true" className="relative flex size-12 items-center justify-center overflow-hidden rounded-full bg-white font-mono text-[11px]">
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
            <div className="flex flex-col gap-5 rounded-block bg-white p-[clamp(28px,4vw,48px)]">
              <Eyebrow>// {nextNum()} — Questions fréquentes</Eyebrow>
              <FaqList items={faq} />
            </div>
          )}
        </section>
      )}

      {/* CTA final */}
      {finalCta?.title && (
        <Block variant="accent" className="flex flex-col items-center gap-6 p-[clamp(32px,6vw,80px)] text-center">
          <h2 className="m-0 max-w-[900px] text-[clamp(36px,5vw,72px)] leading-[0.98] font-extrabold tracking-[-0.05em] text-balance">{finalCta.title}</h2>
          {finalCta.text && <p className="m-0 max-w-[520px] text-lg leading-normal">{finalCta.text}</p>}
          <ButtonLink {...booking} size="xl" arrow>
            {finalCta.label}
          </ButtonLink>
        </Block>
      )}
    </>
  )
}
