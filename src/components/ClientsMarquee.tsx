import type { Media } from '@/payload-types'
import { cn, isMedia } from '@/lib/utils'

type Client = { id?: string | null; name: string; logo?: number | Media | null; featured?: boolean | null }

/** Tuile d'un client : logo s'il existe, sinon le nom. Les secondaires restent discrets. */
const ClientTile = ({ client, repeat = false }: { client: Client; repeat?: boolean }) => {
  const featured = client.featured !== false
  return (
    <li
      aria-hidden={repeat || undefined}
      className={cn(
        'box-border flex h-14 shrink-0 items-center justify-center rounded-2xl px-[22px] sm:h-[68px] sm:rounded-[18px] sm:px-7 lg:h-20 lg:rounded-tile lg:px-8',
        repeat && 'motion-reduce:hidden',
        featured ? 'bg-surface-2 lg:min-w-[200px]' : 'border border-line lg:min-w-[160px]',
      )}
    >
      {isMedia(client.logo) && client.logo.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={client.logo.url}
          alt={client.name}
          className={cn('block w-auto max-w-[180px] object-contain grayscale', featured ? 'h-7 opacity-80 sm:h-8 lg:h-9' : 'h-5 opacity-40 lg:h-6')}
        />
      ) : (
        <span className={cn('whitespace-nowrap tracking-[-0.02em]', featured ? 'text-base font-bold text-muted sm:text-lg lg:text-xl' : 'text-sm font-medium text-subtle lg:text-base')}>
          {client.name}
        </span>
      )}
    </li>
  )
}

/**
 * Bandeau « Ils me font confiance » : deux copies identiques qui défilent.
 * Les clients mis en avant passent d'abord, les secondaires ensuite ; la séquence
 * est répétée pour que 3 ou 4 noms suffisent à remplir la largeur.
 */
export const ClientsMarquee = ({ title, subtitle, items }: { title?: string | null; subtitle?: string | null; items: Client[] }) => {
  if (items.length === 0) return null
  const sequence = [...items.filter((c) => c.featured !== false), ...items.filter((c) => c.featured === false)]
  const repeat = Math.max(1, Math.ceil(8 / sequence.length))
  const copy = Array.from({ length: repeat }, () => sequence).flat()

  return (
    <section aria-labelledby="clients-title" className="flex flex-col gap-3.5 overflow-hidden rounded-block bg-white py-5 sm:gap-4 sm:py-6 lg:gap-5 lg:py-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 sm:px-8 lg:px-[clamp(24px,4vw,40px)]">
        <h2 id="clients-title" className="m-0 text-[17px] font-bold tracking-[-0.02em] sm:text-xl lg:text-[22px]">
          {title}
        </h2>
        {subtitle && <span className="hidden text-sm text-muted sm:inline">{subtitle}</span>}
      </div>

      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max gap-(--marquee-gap) motion-reduce:w-auto motion-reduce:justify-center motion-reduce:px-6" style={{ animationDuration: `${copy.length * 4}s` }}>
          <ul className="m-0 flex list-none gap-(--marquee-gap) p-0 motion-reduce:flex-wrap motion-reduce:justify-center">
            {copy.map((c, i) => (
              <ClientTile key={i} client={c} repeat={i >= sequence.length} />
            ))}
          </ul>
          <ul aria-hidden="true" className="m-0 flex list-none gap-(--marquee-gap) p-0 motion-reduce:hidden">
            {copy.map((c, i) => (
              <ClientTile key={i} client={c} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
