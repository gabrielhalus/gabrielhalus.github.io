'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

/** Sommaire avec suivi de la section visible. */
export const Toc = ({ items }: { items: { id: string; label: string }[] }) => {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px' },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [items])

  const links = (mobile: boolean) =>
    items.map((item, i) => (
      <a
        key={item.id}
        href={`#${item.id}`}
        aria-current={!mobile && active === item.id ? 'location' : undefined}
        className={cn(
          'flex gap-2.5 text-ink no-underline',
          mobile
            ? 'border-t border-line py-3 text-[15px]'
            : cn('rounded-xl px-3 py-2.5 text-[15px] leading-[1.35]', active === item.id ? 'bg-accent-soft font-semibold' : 'hover:bg-surface-2'),
        )}
      >
        <span className="pt-0.5 font-mono text-xs font-normal text-muted">{String(i + 1).padStart(2, '0')}</span>
        {item.label}
      </a>
    ))

  return (
    <>
      {/* Mobile et tablette : sommaire repliable */}
      <details className="group rounded-tile bg-white px-[18px] py-1 lg:hidden">
        <summary className="flex h-[52px] list-none items-center justify-between text-base font-semibold [&::-webkit-details-marker]:hidden">
          Sommaire
          <span className="font-mono text-xs font-normal text-muted">{items.length} parties</span>
        </summary>
        <nav aria-label="Sommaire" className="mb-3.5 flex flex-col">
          {links(true)}
        </nav>
      </details>

      <nav aria-label="Sommaire" className="flex flex-col gap-1 rounded-block bg-white p-6 max-lg:hidden">
        <span className="eyebrow px-3 pb-2.5 text-[11px] text-muted">Sommaire</span>
        {links(false)}
      </nav>
    </>
  )
}
