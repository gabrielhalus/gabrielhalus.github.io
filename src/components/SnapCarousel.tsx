'use client'

import { Children, type ReactNode, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * Rangée défilante aimantée avec pastilles de position, pour mobile.
 * `className` reçoit la mise en page des écrans plus larges (ex. `sm:grid sm:grid-cols-2`).
 */
export const SnapCarousel = ({ children, className, dotsClassName = 'sm:hidden' }: { children: ReactNode; className?: string; dotsClassName?: string }) => {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const count = Children.count(children)

  const onScroll = () => {
    const el = track.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
    setActive(atEnd ? count - 1 : Math.round(el.scrollLeft / step))
  }

  return (
    <>
      <div ref={track} onScroll={onScroll} className={cn('snap-row gap-2.5 scroll-px-5 px-5', className)}>
        {children}
      </div>
      {count > 1 && (
        <div aria-hidden="true" className={cn('flex justify-center gap-1.5', dotsClassName)}>
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className={cn('h-1.5 rounded-full transition-all', i === active ? 'w-[18px] bg-ink' : 'w-1.5 bg-line-strong')} />
          ))}
        </div>
      )}
    </>
  )
}
