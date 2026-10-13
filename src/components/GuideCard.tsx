import Link from 'next/link'

import type { Guide } from '@/payload-types'
import { readingTime } from '@/lib/lexical'
import { tone } from '@/lib/tones'
import { cn } from '@/lib/utils'

import { Media } from './Media'

/** `inCarousel` : carte étroite de la rangée défilante mobile. */
export const GuideCard = ({ guide, inCarousel = false }: { guide: Guide; inCarousel?: boolean }) => {
  const t = tone(guide.tone)
  const minutes = guide.readingTime ?? readingTime(guide.content)
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className={cn('flex flex-col gap-3 rounded-tile border border-line bg-surface-2 p-2 text-ink no-underline hover:border-line-strong', inCarousel && 'flex-[0_0_240px] max-sm:gap-2.5 max-sm:rounded-[18px]')}
    >
      <span className={cn('relative flex h-[180px] items-center justify-center overflow-hidden rounded-card font-mono text-xs', inCarousel && 'max-sm:h-[120px] max-sm:rounded-xl', t.bg, t.ink)}>
        {guide.cover ? <Media resource={guide.cover} size="card" sizes="(min-width: 1024px) 33vw, 100vw" /> : '[Visuel]'}
      </span>
      <span className={cn('flex flex-col gap-1.5 px-2.5 pt-1 pb-3', inCarousel && 'max-sm:gap-1 max-sm:px-1.5 max-sm:pt-0 max-sm:pb-1')}>
        <span className={cn('text-[13px] text-muted', inCarousel && 'max-sm:text-xs')}>
          {guide.category ?? 'Guide'} · {minutes} min
        </span>
        <span className={cn('text-[19px] leading-tight font-semibold tracking-[-0.015em]', inCarousel && 'max-sm:text-base')}>{guide.title}</span>
      </span>
    </Link>
  )
}
