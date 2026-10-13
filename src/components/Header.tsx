'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { tone } from '@/lib/tones'
import { cn } from '@/lib/utils'

import { Curso } from './Curso'
import { ArrowUpRight, Close, Menu } from './icons'
import { ButtonLink, Logo } from './ui'

type Section = 'home' | 'offers' | 'contact'
type NavItem = { label: string; href: string; section: Section | null; desktop: boolean }

type FeaturedOffer = { name: string; promise?: string | null; tone?: string | null; href: string }
type Social = { id?: string | null; label: string; url: string }

type Props = {
  offersHref: string
  offerPaths: string[]
  featuredOffer?: FeaturedOffer | null
  socials?: Social[] | null
}

export const Header = ({ offersHref, offerPaths, featuredOffer, socials }: Props) => {
  const pathname = usePathname()
  // Le menu mémorise la page où il a été ouvert : il se referme de lui-même à la navigation
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const close = useCallback(() => setOpenOn(null), [])

  const nav: NavItem[] = [
    { label: 'Accueil', href: '/', section: 'home', desktop: false },
    { label: 'Projets', href: '/#projets', section: 'home', desktop: true },
    { label: 'Offres métier', href: offersHref, section: 'offers', desktop: true },
    { label: 'Méthode', href: '/#methode', section: null, desktop: true },
    { label: 'Contact', href: '/contact', section: 'contact', desktop: true },
  ]

  const current: Section | null = pathname === '/' ? 'home' : pathname.startsWith('/contact') ? 'contact' : offerPaths.includes(pathname) ? 'offers' : null

  return (
    <header className="p-3 lg:py-4">
      <div className="mx-auto flex max-w-[1416px] items-center justify-between gap-2.5 rounded-full border border-line bg-white py-1.5 pr-1.5 pl-3 lg:gap-3 lg:py-2 lg:pr-2 lg:pl-[18px]">
        <Link href="/" aria-label="Gabriel Halus — accueil" className="group flex items-center gap-2 text-ink no-underline lg:gap-2.5">
          <span className="lg:hidden">
            <Logo size={32} glitchOnHover />
          </span>
          <span className="hidden lg:contents">
            <Logo glitchOnHover />
          </span>
          <span className="text-base font-bold tracking-[-0.02em] lg:text-[17px]">
            gabriel<span className="font-medium text-muted">halus</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 text-sm font-medium lg:flex">
          {nav
            .filter((item) => item.desktop)
            .map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={item.section && item.section === current ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3.5 py-2.5 text-ink no-underline transition-colors hover:bg-paper',
                  item.section && item.section === current && 'bg-paper',
                )}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <span className="hidden sm:contents lg:hidden">
            <ButtonLink href="/contact" variant="accent" size="sm">
              Réserver un appel
            </ButtonLink>
          </span>
          <span className="hidden lg:contents">
            <ButtonLink href="/contact" size="sm" arrow>
              Réserver un appel
            </ButtonLink>
          </span>
          <button
            type="button"
            onClick={() => setOpenOn(pathname)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label="Ouvrir le menu"
            className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-ink text-white lg:hidden"
          >
            <Menu />
          </button>
        </div>
      </div>

      {open && (
        <MobileMenu
          nav={nav}
          current={current}
          pathname={pathname}
          featuredOffer={featuredOffer}
          socials={socials}
          onClose={close}
        />
      )}
    </header>
  )
}

const MobileMenu = ({
  nav,
  current,
  pathname,
  featuredOffer,
  socials,
  onClose,
}: {
  nav: NavItem[]
  current: Section | null
  pathname: string
  featuredOffer?: FeaturedOffer | null
  socials?: Social[] | null
  onClose: () => void
}) => {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const t = tone(featuredOffer?.tone)
  // Pastille sur l'entrée de la page courante (« Projets » et « Méthode » sont des ancres de l'accueil)
  const isActive = (item: NavItem) => item.section !== null && item.section === current && (item.section !== 'home' || item.href === '/')

  return (
    <div
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 box-border flex flex-col gap-7 overflow-y-auto bg-ink p-3 text-white lg:hidden"
    >
      <div className="flex items-center justify-between py-1.5 pr-1.5 pl-3">
        <span className="flex items-center gap-2">
          <Curso size={32} tone="sombre" />
          <span className="text-base font-bold tracking-[-0.02em]">
            gabriel<span className="font-medium text-dim">halus</span>
          </span>
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer le menu"
          className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white text-ink"
        >
          <Close size={18} />
        </button>
      </div>

      <nav aria-label="Navigation mobile" className="flex flex-col px-2">
        {nav.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className="flex items-center justify-between border-b border-night-line px-1 py-4 text-[34px] leading-tight font-bold tracking-[-0.04em] text-white no-underline"
            >
              {item.label}
              {active && <span aria-hidden="true" className="size-2.5 rounded-[3px] bg-accent" />}
            </Link>
          )
        })}
      </nav>

      {featuredOffer && featuredOffer.href !== pathname && (
        <Link
          href={featuredOffer.href}
          onClick={onClose}
          className={cn('mx-2 flex items-center justify-between gap-3 rounded-tile py-4 pr-4 pl-[18px] no-underline', t.bg, t.ink)}
        >
          <span className="flex flex-col gap-0.5">
            <span className="text-[13px] font-medium">Offre métier · {featuredOffer.name}</span>
            {featuredOffer.promise && <span className="text-lg font-bold tracking-[-0.02em]">{featuredOffer.promise}</span>}
          </span>
          <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full', t.inkBg, t.onInk)}>
            <ArrowUpRight />
          </span>
        </Link>
      )}

      <div className="mt-auto flex flex-col gap-4 px-2 pb-2">
        <div className="flex items-end gap-3">
          <Curso size={64} tone="sombre" expression="curieux" />
          <span className="pb-1.5 text-[15px] leading-[1.4] text-on-dark">Un projet, une question&nbsp;? Je réponds moi-même.</span>
        </div>
        <ButtonLink href="/contact" onClick={onClose} variant="accent" size="xl" arrow wide>
          Réserver un appel
        </ButtonLink>
        {socials && socials.length > 0 && (
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.id ?? s.url}
                href={s.url}
                rel="me noopener"
                target="_blank"
                className="flex-1 rounded-full border border-night-line-2 py-3 text-center text-sm text-white no-underline"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
