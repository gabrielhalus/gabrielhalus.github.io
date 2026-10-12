import Link from 'next/link'

import { ClientsMarquee } from '@/components/ClientsMarquee'
import { ArrowRight, ArrowUpRight } from '@/components/icons'
import { Media } from '@/components/Media'
import { ProjectCard } from '@/components/ProjectCard'
import { ArrowDot, AvailabilityBadge, Block, ButtonLink, Eyebrow, SectionHeading, Tag } from '@/components/ui'
import { PROJECT_TYPES } from '@/collections/Projects'
import { getOffers, getPayloadClient, getSettings } from '@/lib/payload'
import { tone } from '@/lib/tones'
import { cn, offerPath } from '@/lib/utils'
import type { Offer } from '@/payload-types'

const typeLabel = (value: string) => PROJECT_TYPES.find((t) => t.value === value)?.label ?? value

const serviceVariants = {
  accent: { card: 'bg-accent', glyph: 'text-accent-glyph', text: '' },
  light: { card: 'border border-line bg-surface-2', glyph: 'text-glyph', text: 'text-body' },
  dark: { card: 'bg-ink text-white', glyph: 'text-night-glyph', text: 'text-on-dark' },
} as const

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [home, settings, offers, projects] = await Promise.all([
    payload.findGlobal({ slug: 'home', depth: 1 }),
    getSettings(),
    getOffers(),
    payload.find({ collection: 'projects', where: { _status: { equals: 'published' } }, sort: 'order', limit: 12, depth: 1 }),
  ])

  const { hero, clients, services, method } = home
  const featuredOffer = (typeof hero?.featuredOffer === 'object' ? hero.featuredOffer : null) as Offer | null
  const featuredProjects = projects.docs.filter((p) => p.featured).slice(0, 3)

  return (
    <>
      {/* Héros */}
      <section className="grid grid-cols-[repeat(auto-fit,minmax(min(560px,100%),1fr))] gap-3">
        <div className="pad-block box-border flex flex-col justify-between gap-12 rounded-block bg-white lg:min-h-[620px]">
          {settings.availability?.show && settings.availability.text ? <AvailabilityBadge text={settings.availability.text} /> : <span />}
          <div className="flex flex-col gap-6">
            <h1 className="m-0 text-[clamp(44px,6.4vw,92px)] leading-[0.94] font-extrabold tracking-[-0.05em] text-balance">
              {hero?.title}{' '}
              {hero?.highlight && (
                <span className="rounded-2xl bg-accent px-[0.12em] [box-decoration-break:clone]">{hero.highlight}</span>
              )}
            </h1>
            {hero?.lead && <p className="m-0 max-w-[540px] text-[19px] leading-normal text-body">{hero.lead}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact" arrow>
              {hero?.primaryLabel}
            </ButtonLink>
            <ButtonLink href="#projets" variant="outline" className="font-medium">
              {hero?.secondaryLabel}
            </ButtonLink>
          </div>
        </div>

        <div className="relative box-border flex min-h-[620px] flex-col justify-between gap-6 overflow-hidden rounded-block bg-ink p-6 text-white">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3 rounded-[18px] bg-white px-3.5 py-3 text-ink shadow-[0_12px_32px_-8px_#00000055]">
              <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-xl bg-slate font-mono text-[11px] text-slate-ink">
                {settings.portrait ? <Media resource={settings.portrait} sizes="44px" /> : '[photo]'}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{settings.siteName}</span>
                <span className="text-xs text-muted">{[settings.role, settings.city ?? '[Ville]'].join(' · ')}</span>
              </div>
            </div>
            {hero?.terminalPath && <span className="pt-2 font-mono text-xs text-subtle">{hero.terminalPath}</span>}
          </div>

          <div className="overflow-x-auto rounded-[18px] border border-night-line bg-night px-[22px] py-5 font-mono text-sm leading-[1.9] text-on-dark">
            <div>
              <span className="text-dim">$</span> git push production main
            </div>
            {hero?.terminal?.map((line) => (
              <div key={line.id} className="flex gap-2 whitespace-nowrap">
                <span className="text-dim">›</span>
                <span className="min-w-0 flex-1 overflow-hidden after:content-['_.................................................']">{line.text}</span>
                {line.status && <span className="text-accent">{line.status}</span>}
              </div>
            ))}
            {hero?.terminalDone && (
              <div>
                <span className="text-accent">✓</span> {hero.terminalDone}
              </div>
            )}
          </div>

          {hero?.chips && hero.chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hero.chips.map((chip) => (
                <span key={chip} className="inline-flex items-center gap-2 rounded-full border border-night-line-2 px-3.5 py-2 text-[13px]">
                  <span className="size-1.5 rounded-full bg-accent" />
                  {chip}
                </span>
              ))}
            </div>
          )}

          {featuredOffer && (
            <Link
              href={offerPath(featuredOffer.slug)}
              className="flex items-center justify-between gap-4 rounded-[18px] bg-accent py-4 pr-4 pl-5 text-ink no-underline hover:bg-accent-deep"
            >
              <span className="flex flex-col gap-0.5">
                <span className="font-mono text-[11px] tracking-[0.08em] uppercase">Offre métier</span>
                <span className="text-[17px] font-semibold">
                  {featuredOffer.name}
                  {featuredOffer.promise && ` : ${featuredOffer.promise}`}
                </span>
              </span>
              <ArrowDot up className="size-10 bg-ink text-accent" />
            </Link>
          )}
        </div>
      </section>

      {/* Clients */}
      <ClientsMarquee title={clients?.title} items={clients?.items ?? []} />

      {/* Services */}
      {services?.items && services.items.length > 0 && (
        <Block className="pad-block flex flex-col gap-10">
          <SectionHeading
            eyebrow="// 01 — Ce que je fais"
            title={
              <>
                {services.title} {services.titleMuted && <span className="text-muted">{services.titleMuted}</span>}
              </>
            }
            aside={services.intro}
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-3">
            {services.items.map((item) => {
              const v = serviceVariants[item.variant ?? 'light']
              return (
                <article key={item.id} className={cn('relative box-border flex min-h-[340px] flex-col justify-between overflow-hidden rounded-tile p-6', v.card)}>
                  {item.glyph && (
                    <span aria-hidden="true" className={cn('absolute -right-1 -bottom-10 font-mono text-[200px] leading-none select-none', v.glyph)}>
                      {item.glyph}
                    </span>
                  )}
                  <h3 className="relative m-0 text-[22px] leading-[1.15] font-semibold tracking-[-0.02em]">{item.title}</h3>
                  <p className={cn('relative m-0 max-w-[280px] text-[15px] leading-normal', v.text)}>{item.description}</p>
                </article>
              )
            })}
          </div>
        </Block>
      )}

      {/* Projets */}
      <Block id="projets" className="pad-block flex flex-col gap-8">
        <SectionHeading eyebrow="// 02 — Projets" title={home.projects?.title} aside={home.projects?.intro} />
        {projects.docs.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="flex min-w-[680px] flex-col">
              <div className="grid grid-cols-[2fr_2fr_1fr_56px] gap-4 border-b border-line-strong pb-3.5 text-[13px] text-muted">
                <span>Projet</span>
                <span>Type</span>
                <span>Année</span>
                <span />
              </div>
              {projects.docs.map((project) => (
                <Link
                  key={project.id}
                  href={`/projets/${project.slug}`}
                  className="group grid grid-cols-[2fr_2fr_1fr_56px] items-center gap-4 border-b border-line py-[22px] text-ink no-underline"
                >
                  <span className="text-2xl font-semibold tracking-[-0.02em]">{project.title}</span>
                  <span className="flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-line-strong px-3 py-[5px] text-xs">{typeLabel(project.projectType)}</span>
                    {project.sector && (
                      <span className={cn('rounded-full px-3 py-[5px] text-xs', project.highlightSector ? 'bg-accent' : 'border border-line-strong')}>{project.sector}</span>
                    )}
                  </span>
                  <span className="font-mono text-[15px]">{project.year}</span>
                  <span className="flex size-11 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-accent">
                    <ArrowRight />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="m-0 text-muted">Les premiers projets arrivent bientôt.</p>
        )}
        {featuredProjects.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Block>

      {/* Méthode */}
      {method?.steps && method.steps.length > 0 && (
        <Block id="methode" variant="dark" className="pad-block flex flex-col gap-10">
          <SectionHeading
            dark
            eyebrow="// 03 — Méthode"
            title={
              <>
                {method.title} {method.highlight && <span className="text-accent">{method.highlight}</span>}
              </>
            }
          />
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-3 p-0">
            {method.steps.map((step, i) => {
              const last = i === method.steps!.length - 1
              return (
                <li key={step.id} className={cn('flex flex-col gap-10 rounded-tile p-6', last ? 'bg-accent text-ink' : 'border border-night-line bg-night')}>
                  <span className={cn('font-mono text-sm', !last && 'text-accent')}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="m-0 text-[21px] font-semibold tracking-[-0.02em]">{step.title}</h3>
                    <p className={cn('m-0 text-[15px] leading-normal', !last && 'text-on-dark')}>{step.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </Block>
      )}

      {/* Offres métier */}
      {offers.length > 0 && (
        <section id="offres" className="grid grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))] gap-3">
          <div className="flex flex-col justify-between gap-8 rounded-block bg-white p-[clamp(28px,5vw,56px)]">
            <div className="flex flex-col gap-3.5">
              <Eyebrow>// 04 — Offres métier</Eyebrow>
              <h2 className="m-0 text-[clamp(30px,3.4vw,46px)] leading-[1.02] font-bold tracking-[-0.035em] text-balance">{home.offers?.title}</h2>
              {home.offers?.intro && <p className="m-0 max-w-[460px] text-base leading-[1.55] text-muted">{home.offers.intro}</p>}
            </div>
            {home.offers?.tags && (
              <div className="flex flex-wrap gap-2">
                {home.offers.tags.map((t, i) => (
                  <Tag key={t} accent={i === 0}>
                    {t}
                  </Tag>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {offers.map((offer) => {
              const t = tone(offer.tone)
              return offer.status === 'live' ? (
                <Link
                  key={offer.id}
                  href={offerPath(offer.slug)}
                  className={cn('box-border flex min-h-[220px] items-end justify-between gap-6 rounded-block p-8 no-underline', t.bg, t.ink)}
                >
                  <span className="flex flex-col gap-2.5">
                    <span className="eyebrow">/{offer.slug}</span>
                    <span className="text-[clamp(28px,3vw,40px)] leading-[1.02] font-bold tracking-[-0.035em]">{offer.name}</span>
                    {offer.cardText && <span className="max-w-[360px] text-base leading-[1.45]">{offer.cardText}</span>}
                  </span>
                  <span className={cn('flex size-14 shrink-0 items-center justify-center rounded-full', t.inkBg)}>
                    <ArrowUpRight size={20} className={t.onInk} />
                  </span>
                </Link>
              ) : (
                <div key={offer.id} className="box-border flex items-center justify-between gap-6 rounded-block border-2 border-dashed border-line-dashed p-8">
                  <span className="flex flex-col gap-1.5">
                    <span className="eyebrow text-muted">/{offer.slug}</span>
                    <span className="text-[22px] font-semibold tracking-[-0.02em]">{offer.name} — bientôt</span>
                  </span>
                  {offer.cardText && <span className="text-sm text-muted">{offer.cardText}</span>}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Outils */}
      {home.tools?.items && home.tools.items.length > 0 && (
        <Block className="flex flex-wrap items-center justify-between gap-6 p-[clamp(28px,4vw,48px)]">
          <Eyebrow>// {home.tools.title}</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {home.tools.items.map((tool) => (
              <Tag key={tool} mono className="px-4 py-[9px]">
                {tool}
              </Tag>
            ))}
          </div>
        </Block>
      )}
    </>
  )
}
