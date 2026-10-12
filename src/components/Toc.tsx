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

  return (
    <nav aria-label="Sommaire" className="flex flex-col gap-1 rounded-block bg-white p-6">
      <span className="eyebrow px-3 pb-2.5 text-[11px] text-muted">Sommaire</span>
      {items.map((item, i) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? 'location' : undefined}
          className={cn('flex gap-2.5 rounded-xl px-3 py-2.5 text-[15px] leading-[1.35] text-ink no-underline', active === item.id ? 'bg-accent-soft font-semibold' : 'hover:bg-surface-2')}
        >
          <span className="pt-0.5 font-mono text-xs font-normal text-muted">{String(i + 1).padStart(2, '0')}</span>
          {item.label}
        </a>
      ))}
    </nav>
  )
}
