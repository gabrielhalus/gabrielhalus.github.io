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
        <section className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="flex flex-1 flex-col gap-3.5 rounded-block bg-accent px-5 py-6 sm:gap-5 sm:p-10 lg:p-[clamp(28px,4.5vw,56px)]">
              <Eyebrow className="text-ink max-sm:hidden">// Contact</Eyebrow>
              <h1 className="m-0 text-[42px] leading-[0.96] font-extrabold tracking-[-0.05em] text-balance sm:text-[64px] sm:leading-[0.94] lg:text-[clamp(44px,5.6vw,84px)]">
                {page.title}
              </h1>
              {page.lead && (
                <p className="m-0 max-w-[460px] text-base leading-normal sm:text-lg">
                  {page.lead.replace('{delai}', delay)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {hasBooking && (
                <BookingLink
                  defaultHref={settings.bookingUrl}
                  byOffer={bookingByOffer}
                  className="box-border flex min-h-[120px] flex-col gap-[18px] rounded-tile bg-ink p-4 text-white no-underline hover:bg-ink-soft sm:gap-7 sm:rounded-panel sm:p-6"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full bg-accent text-ink sm:size-11">
                      <Calendar size={18} />
                    </span>
                    <ArrowUpRight className="max-sm:hidden" />
                  </span>
                  <span className="flex flex-col sm:gap-1">
                    <span className="text-base font-semibold sm:text-[19px]">{page.bookingTitle}</span>
                    <span className="text-xs text-subtle sm:text-sm">{page.bookingText}</span>
                  </span>
                </BookingLink>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="box-border flex min-h-[120px] min-w-0 flex-col gap-[18px] rounded-tile bg-white p-4 text-ink no-underline hover:bg-surface-2 sm:gap-7 sm:rounded-panel sm:p-6"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full border border-line bg-surface-2 sm:size-11">
                      <Mail size={18} />
                    </span>
                    <ArrowUpRight className="max-sm:hidden" />
                  </span>
                  <span className="flex min-w-0 flex-col sm:gap-1">
                    <span className="text-base font-semibold sm:text-[19px]">{page.mailTitle}</span>
                    <span className="truncate text-xs text-muted sm:text-sm">{settings.email}</span>
                  </span>
                </a>
              )}
            </div>
          </div>

          <div className="relative flex flex-col gap-6 rounded-block bg-white px-[18px] py-[22px] sm:p-10 lg:p-[clamp(24px,4vw,48px)]">
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
        <Block className="grid grid-cols-1 gap-3.5 px-5 py-[22px] sm:grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] sm:gap-8 sm:p-10 lg:p-[clamp(28px,4vw,48px)]">
          <div className="flex flex-col gap-2.5">
            <Eyebrow className="text-muted max-sm:hidden">// Ensuite</Eyebrow>
            <h2 className="m-0 text-xl leading-[1.05] font-bold tracking-[-0.03em] sm:text-[28px]">
              {page.stepsTitle}
            </h2>
          </div>
          {page.steps.map((step, i) => {
            const last = i === page.steps!.length - 1
            return (
              <div key={step.id} className="flex gap-3 sm:flex-col sm:gap-2">
                <span
                  className={cn(
                    'shrink-0 self-start font-mono text-[13px] font-medium max-sm:pt-0.5 sm:text-sm',
                    last && 'rounded-chip bg-accent px-1.5',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex flex-col gap-0.5 sm:gap-2">
                  <span className="text-[15px] font-semibold sm:text-[17px]">{step.title}</span>
                  <span className="text-[15px] leading-[1.45] text-body sm:leading-normal">{step.text}</span>
                </span>
              </div>
            )
          })}
        </Block>
      )}
    </>
  )
}
