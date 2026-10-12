import type { Metadata } from 'next'

import { BookingLink, ContactChoiceProvider } from '@/components/ContactChoice'
import { ContactForm } from '@/components/ContactForm'
import { ArrowUpRight, Calendar, Mail } from '@/components/icons'
import { Block, Eyebrow } from '@/components/ui'
import { getOffers, getPayloadClient, getSettings } from '@/lib/payload'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Décrivez votre besoin en quelques lignes : réponse personnelle, avec une première idée de la solution et du budget.',
  alternates: { canonical: '/contact' },
}

type Props = { searchParams: Promise<{ offre?: string; formule?: string }> }

export default async function ContactPage({ searchParams }: Props) {
  const { offre, formule } = await searchParams
  const payload = await getPayloadClient()
  const [page, settings, offers] = await Promise.all([
    payload.findGlobal({ slug: 'contact-page' }),
    getSettings(),
    getOffers(),
  ])

  const live = offers.filter((o) => o.status === 'live')
  // Une option par couple offre / formule, ex. « Traiteurs — Complet »
  const offerFull = await Promise.all(
    live.map((o) =>
      payload.findByID({
        collection: 'offers',
        id: o.id,
        depth: 0,
        select: { name: true, pricing: true, bookingUrl: true },
      }),
    ),
  )
  const offerOptions = offerFull.flatMap((o) => {
    const plans = o.pricing?.plans ?? []
    return plans.length
      ? plans.map((p) => ({ label: `${o.name} — ${p.name}`, value: `${o.name} — ${p.name}` }))
      : [{ label: o.name, value: o.name }]
  })
  const selected = live.find((o) => o.slug === offre)
  const defaultOffer = selected
    ? formule
      ? `${selected.name} — ${formule}`
      : offerOptions.find((o) => o.value.startsWith(selected.name))?.value
    : undefined
  const delay = settings.responseTime ?? ''
  // Agenda dédié de chaque offre, indexé par valeur d'option du formulaire
  const bookingByOffer = Object.fromEntries(
    offerFull.flatMap((o) =>
      o.bookingUrl
        ? offerOptions
            .filter((opt) => opt.value.startsWith(o.name))
            .map((opt) => [opt.value, o.bookingUrl!])
        : [],
    ),
  )
  const hasBooking = Boolean(settings.bookingUrl) || Object.keys(bookingByOffer).length > 0

  return (
    <>
      <ContactChoiceProvider
        initial={{
          type: selected ? 'offer' : 'custom',
          offer: defaultOffer ?? offerOptions[0]?.value,
        }}
      >
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))] items-stretch gap-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-1 flex-col gap-5 rounded-block bg-accent p-[clamp(28px,4.5vw,56px)]">
              <Eyebrow className="text-ink">// Contact</Eyebrow>
              <h1 className="m-0 text-[clamp(44px,5.6vw,84px)] leading-[0.94] font-extrabold tracking-[-0.05em] text-balance">
                {page.title}
              </h1>
              {page.lead && (
                <p className="m-0 max-w-[460px] text-lg leading-normal">
                  {page.lead.replace('{delai}', delay)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3">
              {hasBooking && (
                <BookingLink
                  defaultHref={settings.bookingUrl}
                  byOffer={bookingByOffer}
                  className="flex flex-col gap-7 rounded-panel bg-ink p-6 text-white no-underline hover:bg-ink-soft"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-full bg-accent text-ink">
                      <Calendar />
                    </span>
                    <ArrowUpRight />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[19px] font-semibold">{page.bookingTitle}</span>
                    <span className="text-sm text-subtle">{page.bookingText}</span>
                  </span>
                </BookingLink>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex flex-col gap-7 rounded-panel bg-white p-6 text-ink no-underline hover:bg-surface-2"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-full border border-line bg-surface-2">
                      <Mail />
                    </span>
                    <ArrowUpRight />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[19px] font-semibold">{page.mailTitle}</span>
                    <span className="text-sm text-muted">{settings.email}</span>
                  </span>
                </a>
              )}
            </div>
          </div>

          <div className="relative flex flex-col gap-6 rounded-block bg-white p-[clamp(24px,4vw,48px)]">
            <ContactForm
              offers={offerOptions}
              budgets={page.budgets ?? []}
              defaultType={selected ? 'offer' : 'custom'}
              defaultOffer={defaultOffer}
              placeholder={page.messagePlaceholder}
              note={page.formNote}
              success={{
                title: page.success?.title,
                text: page.success?.text?.replace('{delai}', delay),
              }}
            />
          </div>
        </section>
      </ContactChoiceProvider>

      {page.steps && page.steps.length > 0 && (
        <Block className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-8 p-[clamp(28px,4vw,48px)]">
          <div className="flex flex-col gap-2.5">
            <Eyebrow>// Ensuite</Eyebrow>
            <h2 className="m-0 text-[28px] leading-[1.05] font-bold tracking-[-0.03em]">
              {page.stepsTitle}
            </h2>
          </div>
          {page.steps.map((step, i) => {
            const last = i === page.steps!.length - 1
            return (
              <div key={step.id} className="flex flex-col gap-2">
                <span
                  className={cn(
                    'self-start font-mono text-sm font-medium',
                    last && 'rounded-chip bg-accent px-1.5',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[17px] font-semibold">{step.title}</span>
                <span className="text-[15px] leading-normal text-body">{step.text}</span>
              </div>
            )
          })}
        </Block>
      )}
    </>
  )
}
