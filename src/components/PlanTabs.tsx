'use client'

import { type ReactNode, useId, useState } from 'react'

import { cn } from '@/lib/utils'

/** Formules en onglets (mobile) : une seule carte visible à la fois. */
export const PlanTabs = ({ labels, initial = 0, children, className }: { labels: string[]; initial?: number; children: ReactNode[]; className?: string }) => {
  const id = useId()
  const [active, setActive] = useState(initial)

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div role="tablist" aria-label="Formules" className="grid gap-1 rounded-full bg-surface-2 p-1" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
        {labels.map((label, i) => (
          <button
            key={label}
            id={`${id}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            onClick={() => setActive(i)}
            className={cn('h-11 cursor-pointer truncate rounded-full border-0 px-2 text-sm font-semibold', i === active ? 'bg-ink text-white' : 'bg-transparent text-muted')}
          >
            {label}
          </button>
        ))}
      </div>
      {children.map((panel, i) => (
        <div key={i} id={`${id}-panel-${i}`} role="tabpanel" aria-labelledby={`${id}-tab-${i}`} hidden={i !== active}>
          {panel}
        </div>
      ))}
    </div>
  )
}
