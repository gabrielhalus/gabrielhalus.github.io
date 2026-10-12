import { Fragment } from 'react'

import type { Media } from '@/payload-types'
import { cn, isMedia } from '@/lib/utils'

import { Curso } from './Curso'

type Client = { id?: string | null; name: string; logo?: number | Media | null; featured?: boolean | null }

const ClientMark = ({ client }: { client: Client }) => {
  const featured = client.featured !== false
  if (isMedia(client.logo) && client.logo.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={client.logo.url}
        alt={client.name}
        className={cn('block w-auto max-w-[200px] object-contain', featured ? 'h-9' : 'h-6 opacity-40 grayscale')}
      />
    )
  }
  return (
    <span
      className={cn(
        'whitespace-nowrap',
        featured ? 'text-[clamp(22px,2.2vw,30px)] font-bold tracking-[-0.03em] text-ink' : 'text-[17px] font-medium tracking-[-0.01em] text-subtle',
      )}
    >
      {client.name}
    </span>
  )
}

const Separator = () => <span aria-hidden="true" className="size-2.5 shrink-0 rounded-[3px] bg-accent" />

/**
 * Bandeau « Ils me font confiance ». Les clients mis en avant passent d'abord,
 * les secondaires ensuite, plus discrets ; la séquence est répétée pour remplir
 * la largeur même avec 3 ou 4 noms.
 */
export const ClientsMarquee = ({ title, items }: { title?: string | null; items: Client[] }) => {
  if (items.length === 0) return null
  const sequence = [...items.filter((c) => c.featured !== false), ...items.filter((c) => c.featured === false)]
  const repeat = sequence.length <= 2 ? 4 : sequence.length <= 4 ? 3 : 2
  const half = Array.from({ length: repeat }, () => sequence).flat()

  return (
    <section aria-labelledby="clients-title" className="flex flex-col gap-3 md:flex-row">
      <div className="flex h-[88px] shrink-0 items-center gap-3 rounded-full bg-ink pr-8 pl-6 text-white md:h-[120px]">
        <Curso size={40} tone="sombre" expression="content" />
        <h2 id="clients-title" className="m-0 text-[19px] leading-tight font-semibold tracking-[-0.02em]">
          {title}
        </h2>
      </div>

      <div className="marquee relative flex h-[88px] min-w-0 flex-1 items-center overflow-hidden rounded-full bg-white [mask-image:linear-gradient(to_right,transparent,#000_56px,#000_calc(100%-56px),transparent)] md:h-[120px]">
        <ul className="sr-only">
          {items.map((c, i) => (
            <li key={c.id ?? i}>{c.name}</li>
          ))}
        </ul>

        {/* Défilement (masqué si l'utilisateur réduit les animations) */}
        <div aria-hidden="true" className="marquee-track flex w-max motion-reduce:hidden" style={{ animationDuration: `${half.length * 4}s` }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {half.map((c, i) => (
                <Fragment key={i}>
                  <span className="flex items-center px-9">
                    <ClientMark client={c} />
                  </span>
                  <Separator />
                </Fragment>
              ))}
            </div>
          ))}
        </div>

        {/* Version fixe */}
        <div aria-hidden="true" className="hidden w-full flex-wrap items-center justify-center gap-x-8 gap-y-2 px-8 motion-reduce:flex">
          {sequence.map((c, i) => (
            <ClientMark key={c.id ?? i} client={c} />
          ))}
        </div>
      </div>
    </section>
  )
}
