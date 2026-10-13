'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { ArrowUpRight } from './icons'

type Item = { href: string; label: string; short: string }

const pill =
  'flex h-10 shrink-0 items-center rounded-full px-3.5 text-sm font-medium no-underline lg:h-auto lg:rounded-xl lg:px-3 lg:py-2.5 lg:text-[15px] lg:font-normal'

/** Sommaire des mentions légales : pilules collées en haut sur mobile, colonne collante sur bureau. */
export const LegalNav = ({ items }: { items: Item[] }) => {
  const nav = useRef<HTMLElement>(null)
  const [active, setActive] = useState(items[0]?.href)

  useEffect(() => {
    const targets = items.map((i) => document.querySelector<HTMLElement>(i.href)).filter((el): el is HTMLElement => Boolean(el))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(`#${visible[0].target.id}`)
      },
      { rootMargin: '-80px 0px -60% 0px' },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [items])

  // Garde la pilule active visible dans la rangée défilante
  useEffect(() => {
    const el = nav.current?.querySelector<HTMLElement>('[aria-current]')
    const row = nav.current
    if (el && row && row.scrollWidth > row.clientWidth) row.scrollTo({ left: el.offsetLeft - 6, behavior: 'smooth' })
  }, [active])

  return (
    <nav
      ref={nav}
      aria-label="Sommaire"
      className="sticky top-2 z-10 box-border flex gap-1.5 rounded-full border border-line bg-white/90 p-1.5 backdrop-blur-[10px] max-lg:snap-row lg:top-6 lg:w-[280px] lg:shrink-0 lg:flex-col lg:gap-1 lg:rounded-block lg:border-0 lg:bg-white lg:p-6"
    >
      <span className="eyebrow px-3 pb-2.5 text-[11px] text-muted max-lg:hidden">Sommaire</span>
      {items.map((item) => {
        const on = item.href === active
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={on ? 'location' : undefined}
            className={cn(pill, on ? 'bg-ink text-white lg:bg-accent-soft lg:font-semibold lg:text-ink' : 'text-ink hover:bg-accent-soft')}
          >
            <span className="lg:hidden">{item.short}</span>
            <span className="max-lg:hidden">{item.label}</span>
          </a>
        )
      })}
      <Link href="/cookies" className={cn(pill, 'justify-between text-ink hover:bg-accent-soft')}>
        <span className="lg:hidden">Cookies</span>
        <span className="max-lg:hidden">5. Cookies</span>
        <ArrowUpRight size={14} className="max-lg:hidden" />
      </Link>
    </nav>
  )
}
