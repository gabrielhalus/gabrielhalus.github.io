import Link from 'next/link'

import type { Guide } from '@/payload-types'
import { readingTime } from '@/lib/lexical'
import { tone } from '@/lib/tones'
import { cn } from '@/lib/utils'

import { Media } from './Media'

export const GuideCard = ({ guide }: { guide: Guide }) => {
  const t = tone(guide.tone)
  const minutes = guide.readingTime ?? readingTime(guide.content)
  return (
    <Link href={`/guides/${guide.slug}`} className="flex flex-col gap-3 rounded-tile border border-line bg-surface-2 p-2 text-ink no-underline hover:border-line-strong">
      <span className={cn('relative flex h-[180px] items-center justify-center overflow-hidden rounded-card font-mono text-xs', t.bg, t.ink)}>
        {guide.cover ? <Media resource={guide.cover} size="card" sizes="(min-width: 1024px) 33vw, 100vw" /> : '[Visuel]'}
      </span>
      <span className="flex flex-col gap-1.5 px-2.5 pt-1 pb-3">
        <span className="text-[13px] text-muted">
          {guide.category ?? 'Guide'} · {minutes} min
        </span>
        <span className="text-[19px] leading-tight font-semibold tracking-[-0.015em]">{guide.title}</span>
      </span>
    </Link>
  )
}
