import type { Metadata } from 'next'
import Link from 'next/link'

import { CookiePreferences } from '@/components/CookiePreferences'
import { Badge, Block, Eyebrow } from '@/components/ui'
import { activeCategories } from '@/lib/consent'
import { getPayloadClient } from '@/lib/payload'
import { formatShortDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Cookies',
  alternates: { canonical: '/cookies' },
}

const categories = {
  necessary: { label: 'Nécessaire', className: 'bg-surface-2 text-muted' },
  analytics: { label: 'Audience', className: 'bg-slate text-slate-ink' },
  thirdParty: { label: 'Tiers', className: 'bg-lilac text-lilac-ink' },
} as const

export default async function CookiesPage() {
  const payload = await getPayloadClient()
  const cookies = await payload.findGlobal({ slug: 'cookies' })
  // Préférences affichées seulement si un traceur soumis au consentement est déclaré
  const optional = activeCategories(cookies.trackers)

  return (
    <>
      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="pad-block flex flex-col gap-3 rounded-block bg-white sm:gap-5">
          <Eyebrow>// Cookies</Eyebrow>
          <h1 className="m-0 text-4xl leading-[0.98] font-extrabold tracking-[-0.05em] text-balance sm:text-[clamp(42px,5.4vw,80px)] sm:leading-[0.95]">{cookies.title}</h1>
          {cookies.intro && <p className="m-0 max-w-[520px] text-base leading-normal text-body sm:text-lg sm:leading-[1.55]">{cookies.intro}</p>}
          <span className="inline-flex self-start rounded-full bg-surface-2 px-3 py-[7px] text-[13px] sm:px-3.5 sm:py-2">Dernière mise à jour : {formatShortDate(cookies.updatedOn)}</span>
        </div>
        {optional.length > 0 && (
          <CookiePreferences
            categories={optional}
            necessary={cookies.categories?.necessary}
            analytics={cookies.categories?.analytics}
            thirdParty={cookies.categories?.thirdParty}
          />
        )}
      </section>

      <Block className="pad-block flex flex-col gap-3 sm:gap-6">
        <h2 className="m-0 text-[22px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[32px] sm:tracking-[-0.035em]">Liste des traceurs</h2>
        {cookies.trackers && cookies.trackers.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-3 p-0 sm:hidden">
            {cookies.trackers.map((t) => (
              <li key={t.id} className="flex flex-col gap-1.5 rounded-2xl border border-line px-4 py-3.5">
                <span className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm break-all text-ink">{t.name}</span>
                  <Badge className={categories[t.category].className}>{categories[t.category].label}</Badge>
                </span>
                <span className="text-sm text-body">
                  {t.purpose} · {t.duration}
                </span>
              </li>
            ))}
          </ul>
        )}
        {cookies.trackers && cookies.trackers.length > 0 && (
          <div className="overflow-x-auto rounded-card border border-line max-sm:hidden">
            <table className="w-full min-w-[720px] border-collapse text-[15px] leading-normal text-body">
              <thead>
                <tr className="bg-surface-2 text-left">
                  {['Nom', 'Catégorie', 'Finalité', 'Durée'].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-[13px] font-medium text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cookies.trackers.map((t) => (
                  <tr key={t.id} className="border-t border-line">
                    <td className="px-4 py-3.5 font-mono text-[13px] text-ink">{t.name}</td>
                    <td className="px-4 py-3.5">
                      <Badge className={categories[t.category].className}>{categories[t.category].label}</Badge>
                    </td>
                    <td className="px-4 py-3.5">{t.purpose}</td>
                    <td className="px-4 py-3.5">{t.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="m-0 max-w-[760px] text-sm leading-[1.55] text-body sm:text-[15px] sm:leading-relaxed">
          {cookies.footnote} Pour le reste, voir les <Link href="/mentions-legales#confidentialite" className="text-ink">données personnelles</Link>.
        </p>
      </Block>
    </>
  )
}
