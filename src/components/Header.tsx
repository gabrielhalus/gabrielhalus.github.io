'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Close, Menu } from './icons'
import { ButtonLink, Logo } from './ui'

type NavItem = { label: string; href: string; section: 'home' | 'offers' | 'contact' | null }

export const Header = ({ offersHref, offerPaths }: { offersHref: string; offerPaths: string[] }) => {
  const pathname = usePathname()
  // Le menu mémorise la page où il a été ouvert : il se referme de lui-même à la navigation
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname

  const nav: NavItem[] = [
    { label: 'Projets', href: '/#projets', section: 'home' },
    { label: 'Offres métier', href: offersHref, section: 'offers' },
    { label: 'Méthode', href: '/#methode', section: null },
    { label: 'Contact', href: '/contact', section: 'contact' },
  ]

  const current = pathname === '/' ? 'home' : pathname.startsWith('/contact') ? 'contact' : offerPaths.includes(pathname) ? 'offers' : null

  return (
    <header className="px-3 py-4 sm:px-6">
      <div className="mx-auto max-w-[1360px] rounded-[28px] border border-line bg-white py-2 pr-2 pl-[18px] md:rounded-full">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="Gabriel Halus — accueil" className="group flex items-center gap-2.5 text-ink no-underline">
            <Logo glitchOnHover />
            <span className="text-[17px] font-bold tracking-[-0.02em]">
              gabriel<span className="font-medium text-muted">halus</span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 text-sm font-medium md:flex">
            {nav.map((item) => (
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

          <div className="flex items-center gap-2">
            <span className="hidden sm:contents">
              <ButtonLink href="/contact" size="sm" arrow>
                Réserver un appel
              </ButtonLink>
            </span>
            <button
              type="button"
              onClick={() => setOpenOn(open ? null : pathname)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="flex size-11 items-center justify-center rounded-full border border-line-strong bg-white text-ink md:hidden"
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>

        {open && (
          <nav id="menu-mobile" aria-label="Navigation mobile" className="flex flex-col gap-1 px-0 pt-3 pb-2 pr-2.5 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpenOn(null)}
                className={cn('rounded-2xl px-3.5 py-3 text-base font-medium text-ink no-underline', item.section === current && 'bg-paper')}
              >
                {item.label}
              </Link>
            ))}
            <span className="mt-2 flex flex-col sm:hidden">
              <ButtonLink href="/contact" size="md" arrow className="justify-between">
                Réserver un appel
              </ButtonLink>
            </span>
          </nav>
        )}
      </div>
    </header>
  )
}
