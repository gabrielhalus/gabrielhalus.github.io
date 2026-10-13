import Link from 'next/link'
import { Fragment } from 'react'

import { ClientsMarquee } from '@/components/ClientsMarquee'
import { Curso } from '@/components/Curso'
import { ArrowRight, ArrowUpRight, Bell, Calendar, Check, Document, Mail } from '@/components/icons'
import { Media } from '@/components/Media'
import { ProjectCard } from '@/components/ProjectCard'
import { SnapCarousel } from '@/components/SnapCarousel'
import { ArrowDot, AvailabilityBadge, Block, ButtonLink, Eyebrow, SectionHeading, Tag } from '@/components/ui'
import { PROJECT_TYPES } from '@/collections/Projects'
import { getOffers, getPayloadClient, getSettings } from '@/lib/payload'
import { tone } from '@/lib/tones'
import { cn, offerPath } from '@/lib/utils'
import type { Offer, Project } from '@/payload-types'

const typeLabel = (value: string) => PROJECT_TYPES.find((t) => t.value === value)?.label ?? value
const projectMeta = (p: Project) => [typeLabel(p.projectType), p.sector, p.year].filter(Boolean).join(' · ')

const serviceVariants = {
  accent: { card: 'bg-accent', glyph: 'text-accent-glyph', text: '', num: '' },
  light: { card: 'border border-line bg-surface-2', glyph: 'text-glyph', text: 'text-body', num: 'text-muted' },
  dark: { card: 'bg-ink text-white', glyph: 'text-night-glyph', text: 'text-on-dark', num: 'text-subtle' },
} as const

const TASK_ICONS = { document: Document, bell: Bell, calendar: Calendar }

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
      <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div className="box-border grid gap-5 rounded-block bg-white px-5 py-6 sm:grid-cols-[1.2fr_1fr] sm:gap-6 sm:p-10 xl:flex xl:min-h-[620px] xl:flex-col xl:gap-0 xl:p-[clamp(28px,5vw,64px)]">
          {settings.availability?.show && settings.availability.text ? (
            <AvailabilityBadge text={settings.availability.text} className="sm:col-span-2" />
          ) : (
            <span className="hidden xl:block" />
          )}
          <h1 className="m-0 text-[42px] leading-[0.96] font-extrabold tracking-[-0.05em] text-balance sm:col-span-2 sm:max-w-[680px] sm:text-[68px] sm:leading-[0.94] xl:mt-auto xl:max-w-none xl:text-[clamp(44px,6.4vw,92px)]">
            {hero?.title}{' '}
            {hero?.highlight && (
              <span className="rounded-[10px] bg-accent px-[0.1em] [box-decoration-break:clone] sm:rounded-[14px] xl:rounded-2xl xl:px-[0.12em]">{hero.highlight}</span>
            )}
          </h1>
          {hero?.lead && <p className="m-0 text-[17px] leading-normal text-body sm:self-end sm:text-lg xl:mt-6 xl:self-start xl:max-w-[540px] xl:text-[19px]">{hero.lead}</p>}
          <div className="flex flex-col gap-2 sm:self-end xl:mt-auto xl:self-start xl:flex-row xl:flex-wrap xl:items-center xl:gap-3 xl:pt-12">
            <ButtonLink href="/contact" size="xl" arrow wide className="xl:h-[52px] xl:w-auto xl:justify-center xl:pr-1.5 xl:pl-[22px] xl:text-base">
              {hero?.primaryLabel}
            </ButtonLink>
            <ButtonLink href="#projets" variant="outline" size="lg" className="font-medium">
              {hero?.secondaryLabel}
            </ButtonLink>
          </div>
        </div>

        <div className="hero-scene relative box-border overflow-hidden rounded-block bg-accent p-4 sm:p-6 xl:min-h-[620px] xl:p-5">
          <div data-area="profile" className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 rounded-full bg-white py-1.5 pr-4 pl-1.5 xl:gap-3 xl:pr-[18px] xl:shadow-pop">
              <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate text-center font-mono text-[8px] leading-[1.15] text-slate-ink shadow-[0_0_0_2px_var(--color-ink)] sm:size-11 xl:size-12 xl:text-[9px] xl:leading-[1.2]">
                {settings.portrait ? <Media resource={settings.portrait} sizes="48px" /> : <span aria-hidden="true">[ta<br />photo]</span>}
              </span>
              <span className="flex flex-col xl:gap-0.5">
                <span className="text-sm font-semibold xl:text-[15px]">{settings.siteName}</span>
                <span className="text-xs text-muted xl:text-[13px]">{[`${settings.role ?? 'Développeur'} indépendant`, settings.city ?? '[Ville]'].join(' · ')}</span>
              </span>
            </div>
            {hero?.tagline && <span className="hidden rounded-full bg-white/50 px-3.5 py-2.5 text-[13px] font-medium xl:inline">{hero.tagline}</span>}
          </div>

          <div data-area="curso" className="flex flex-col items-center gap-1 sm:self-center">
            <Curso size={220} effect="transparence" animated className="h-auto w-[110px] sm:w-[200px] xl:w-[220px]" />
            <span aria-hidden="true" className="hidden h-[9px] w-[110px] rounded-full bg-ink/15 sm:block xl:h-2.5 xl:w-[120px]" />
          </div>

          {hero?.tasksTitle && <p data-area="title" className="m-0 mb-3 text-base leading-[1.3] font-semibold sm:mb-0 sm:ml-1 xl:mb-3.5 xl:text-[15px]">{hero.tasksTitle}</p>}

          {hero?.tasks && hero.tasks.length > 0 && (
            <ul data-area="tasks" className="m-0 flex list-none flex-col gap-2 p-0 sm:gap-2.5">
              {hero.tasks.map((task) => {
                const TaskIcon = TASK_ICONS[task.icon ?? 'document']
                const done = task.badgeTone !== 'pending'
                return (
                  <li key={task.id} className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 sm:gap-3 sm:rounded-[18px] sm:px-3.5 sm:py-3 xl:shadow-pop">
                    <span aria-hidden="true" className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 xl:flex">
                      <TaskIcon />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col xl:gap-0.5">
                      <span className="text-[15px] font-semibold">{task.title}</span>
                      {task.detail && <span className="text-[13px] text-muted">{task.detail}</span>}
                    </span>
                    {task.badge && (
                      <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-lg px-[9px] py-1.5 text-xs font-semibold', done ? 'bg-mint text-mint-ink' : 'bg-slate text-slate-ink')}>
                        {done && <Check size={14} className="hidden xl:block" />}
                        {task.badge}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          {featuredOffer && (
            <Link
              data-area="offer"
              href={offerPath(featuredOffer.slug)}
              className="flex items-center justify-between gap-3 rounded-[18px] bg-ink py-3.5 pr-3 pl-4 text-white no-underline hover:bg-ink-soft xl:gap-4 xl:rounded-tile xl:py-4 xl:pr-4 xl:pl-5"
            >
              <span className="flex flex-col xl:gap-0.5">
                <span className="text-xs text-subtle xl:text-[13px] xl:font-medium">Offre métier · {featuredOffer.name}</span>
                {featuredOffer.promise && <span className="text-base font-bold sm:text-[17px] xl:text-lg xl:tracking-[-0.02em]">{featuredOffer.promise}</span>}
              </span>
              <ArrowDot up className="size-10 bg-accent text-ink" />
            </Link>
          )}
        </div>
      </section>

      {/* Clients */}
      <ClientsMarquee title={clients?.title} subtitle={clients?.subtitle} items={clients?.items ?? []} />

      {/* Services : carrousel sur mobile, 2 × 2 sur tablette */}
      {services?.items && services.items.length > 0 && (
        <Block className="flex flex-col gap-[18px] py-6 sm:gap-6 sm:px-8 sm:py-9 lg:gap-10 lg:p-[clamp(28px,5vw,64px)]">
          <SectionHeading
            className="px-5 sm:px-0"
            eyebrow="// 01 — Ce que je fais"
            title={
              <>
                {services.title} {services.titleMuted && <span className="text-muted">{services.titleMuted}</span>}
              </>
            }
            aside={services.intro}
          />
          <SnapCarousel className="sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:px-0 lg:grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))]">
            {services.items.map((item, i) => {
              const v = serviceVariants[item.variant ?? 'light']
              return (
                <article
                  key={item.id}
                  className={cn('relative box-border flex min-h-[260px] flex-[0_0_260px] flex-col justify-between overflow-hidden rounded-tile p-5 sm:min-h-[230px] sm:p-[22px] lg:min-h-[340px] lg:p-6', v.card)}
                >
                  {item.glyph && (
                    <span aria-hidden="true" className={cn('absolute -right-1 -bottom-10 hidden font-mono text-[200px] leading-none select-none lg:block', v.glyph)}>
                      {item.glyph}
                    </span>
                  )}
                  <span className={cn('font-mono text-xs lg:hidden', v.num)}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex flex-col gap-2 lg:contents">
                    <h3 className="relative m-0 text-[21px] leading-[1.12] font-semibold tracking-[-0.02em] sm:text-[22px] lg:leading-[1.15]">{item.title}</h3>
                    <p className={cn('relative m-0 text-[15px] leading-[1.45] lg:max-w-[280px] lg:leading-normal', v.text)}>{item.description}</p>
                  </div>
                </article>
              )
            })}
          </SnapCarousel>
        </Block>
      )}

      {/* Projets */}
      <Block id="projets" className="pad-block flex flex-col gap-4 sm:gap-5 lg:gap-8">
        <SectionHeading eyebrow="// 02 — Projets" title={home.projects?.title} aside={home.projects?.intro} />
        {projects.docs.length > 0 ? (
          <>
            {/* Mobile : une carte puis une liste ; tablette : cartes 2 × 2 */}
            <div className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-3 lg:hidden">
              {projects.docs.map((project, i) => (
                <Fragment key={project.id}>
                  <CompactProjectCard project={project} className={i > 0 ? 'hidden sm:flex' : 'mb-1 flex sm:mb-0'} />
                  {i > 0 && (
                    <Link
                      href={`/projets/${project.slug}`}
                      className={cn('flex items-center justify-between gap-2.5 px-1 py-3.5 text-ink no-underline sm:hidden', i < projects.docs.length - 1 && 'border-b border-line')}
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[17px] font-semibold">{project.title}</span>
                        <span className="text-[13px] text-muted">{projectMeta(project)}</span>
                      </span>
                      <ArrowRight />
                    </Link>
                  )}
                </Fragment>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
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
          </>
        ) : (
          <p className="m-0 text-muted">Les premiers projets arrivent bientôt.</p>
        )}
        {featuredProjects.length > 0 && (
          <div className="hidden grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-3 lg:grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Block>

      {/* Méthode : frise sur mobile, cartes au-delà */}
      {method?.steps && method.steps.length > 0 && (
        <Block id="methode" variant="dark" className="pad-block flex flex-col gap-5 sm:gap-6 lg:gap-10">
          <SectionHeading
            dark
            eyebrow="// 03 — Méthode"
            title={
              <>
                {method.title} {method.highlight && <span className="text-accent">{method.highlight}</span>}
              </>
            }
          />
          <ol className="m-0 flex list-none flex-col p-0 sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))]">
            {method.steps.map((step, i) => {
              const last = i === method.steps!.length - 1
              return (
                <li
                  key={step.id}
                  className={cn(
                    'flex gap-3.5 sm:flex-col sm:gap-7 sm:rounded-tile sm:p-[22px] lg:gap-10 lg:p-6',
                    !last && 'pb-[18px]',
                    last ? 'sm:bg-accent sm:text-ink' : 'sm:border sm:border-night-line sm:bg-night',
                  )}
                >
                  <span aria-hidden="true" className="flex flex-col items-center sm:hidden">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[13px] font-medium text-ink">{i + 1}</span>
                    {!last && <span className="mt-1.5 w-0.5 flex-1 bg-night-line" />}
                  </span>
                  <span className={cn('hidden font-mono text-sm sm:block', !last && 'text-accent')}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex flex-col gap-1 pt-1 sm:gap-1.5 sm:pt-0 lg:gap-2">
                    <h3 className="m-0 text-lg font-semibold tracking-[-0.02em] sm:text-xl lg:text-[21px]">{step.title}</h3>
                    <p className={cn('m-0 text-[15px] leading-[1.45] text-on-dark lg:leading-normal', last && 'sm:text-ink')}>{step.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </Block>
      )}

      {/* Offres métier */}
      {offers.length > 0 && (
        <section id="offres" className="grid grid-cols-1 gap-3 lg:grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))]">
          <div className="hidden flex-col justify-between gap-8 rounded-block bg-white p-[clamp(28px,5vw,56px)] lg:flex">
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.4fr_1fr] lg:grid-cols-1">
            {offers.map((offer) => {
              const t = tone(offer.tone)
              return offer.status === 'live' ? (
                <Link
                  key={offer.id}
                  href={offerPath(offer.slug)}
                  className={cn(
                    'box-border flex flex-col gap-2.5 rounded-block px-5 py-[22px] no-underline sm:min-h-[220px] sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:p-8',
                    t.bg,
                    t.ink,
                  )}
                >
                  <span className="flex flex-col gap-2.5 sm:flex-1 sm:justify-between lg:flex-none lg:justify-start">
                    <span className="eyebrow">
                      <span className="lg:hidden">// 04 — Offre métier</span>
                      <span className="hidden lg:inline">/{offer.slug}</span>
                    </span>
                    <span className="flex flex-col gap-2.5">
                      <span className="text-[30px] leading-none font-bold tracking-[-0.04em] sm:text-4xl lg:text-[clamp(28px,3vw,40px)] lg:leading-[1.02] lg:tracking-[-0.035em]">{offer.name}</span>
                      {offer.cardText && <span className="max-w-[360px] text-base leading-[1.45]">{offer.cardText}</span>}
                    </span>
                  </span>
                  <span className={cn('mt-1 inline-flex h-11 items-center gap-2 self-start rounded-full pr-1.5 pl-4 text-[15px] font-semibold sm:hidden', t.inkBg, t.onInk)}>
                    Voir l’offre
                    <span className={cn('flex size-8 items-center justify-center rounded-full', t.bg, t.ink)}>
                      <ArrowRight size={14} />
                    </span>
                  </span>
                  <span className={cn('hidden size-14 shrink-0 items-center justify-center rounded-full lg:flex', t.inkBg)}>
                    <ArrowUpRight size={20} className={t.onInk} />
                  </span>
                </Link>
              ) : (
                <div
                  key={offer.id}
                  className="box-border flex items-center justify-between gap-3 rounded-block border-2 border-dashed border-line-dashed px-5 py-[18px] sm:flex-col sm:items-start sm:p-7 lg:flex-row lg:items-center lg:gap-6 lg:p-8"
                >
                  <span className="flex flex-col gap-1.5">
                    <span className="eyebrow hidden text-muted sm:inline">/{offer.slug}</span>
                    <span className="text-[17px] font-semibold tracking-[-0.02em] sm:text-xl lg:text-[22px]">
                      {offer.name}
                      <span className="hidden sm:inline"> — bientôt</span>
                    </span>
                  </span>
                  <span className="text-[13px] text-muted sm:hidden">Bientôt</span>
                  {offer.cardText && <span className="hidden text-sm text-muted lg:inline">{offer.cardText}</span>}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Outils */}
      {home.tools?.items && home.tools.items.length > 0 && (
        <Block className="flex flex-wrap items-center justify-between gap-6 px-5 py-6 sm:p-8 lg:p-[clamp(28px,4vw,48px)]">
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

      {/* Barre d’action collante (mobile) */}
      <div className="sticky bottom-3 z-10 flex gap-2 rounded-full border border-line bg-white/90 p-2 shadow-pop backdrop-blur-[10px] sm:hidden">
        <Link href="/contact" className="flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-base font-semibold text-white no-underline">
          {hero?.primaryLabel}
        </Link>
        {settings.email && (
          <a href={`mailto:${settings.email}`} aria-label="Écrire un e-mail" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
            <Mail />
          </a>
        )}
      </div>
    </>
  )
}

/** Carte projet des écrans étroits : capture, nom, type · secteur · année. */
const CompactProjectCard = ({ project, className }: { project: Project; className?: string }) => {
  const t = tone(project.tone)
  return (
    <Link
      href={`/projets/${project.slug}`}
      className={cn('flex-col gap-2.5 rounded-tile border border-line bg-surface-2 p-2 pb-3.5 text-ink no-underline', className ?? 'flex')}
    >
      <span className={cn('relative flex h-[170px] items-center justify-center overflow-hidden rounded-card font-mono text-xs sm:h-[190px]', t.bg, t.ink)}>
        {project.cover ? <Media resource={project.cover} size="card" sizes="(min-width: 640px) 50vw, 100vw" /> : `[Capture ${project.title}]`}
      </span>
      <span className="flex items-center justify-between gap-2.5 px-1.5">
        <span className="flex flex-col gap-0.5">
          <span className="text-[17px] font-semibold">{project.title}</span>
          <span className="text-[13px] text-muted">{projectMeta(project)}</span>
        </span>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-white sm:hidden">
          <ArrowUpRight size={14} />
        </span>
      </span>
    </Link>
  )
}
