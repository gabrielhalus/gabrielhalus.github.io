import type { Metadata } from 'next'
import Link from 'next/link'

import { CookiePreferences } from '@/components/CookiePreferences'
import { Badge, Block, Eyebrow } from '@/components/ui'
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

  return (
    <>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))] gap-3">
        <div className="flex flex-col gap-5 rounded-block bg-white p-[clamp(28px,5vw,64px)]">
          <Eyebrow>// Cookies</Eyebrow>
          <h1 className="m-0 text-[clamp(42px,5.4vw,80px)] leading-[0.95] font-extrabold tracking-[-0.05em]">{cookies.title}</h1>
          {cookies.intro && <p className="m-0 max-w-[520px] text-lg leading-[1.55] text-body">{cookies.intro}</p>}
          <span className="inline-flex self-start rounded-full bg-surface-2 px-3.5 py-2 text-[13px]">Dernière mise à jour : {formatShortDate(cookies.updatedOn)}</span>
        </div>
        <CookiePreferences necessary={cookies.categories?.necessary} analytics={cookies.categories?.analytics} thirdParty={cookies.categories?.thirdParty} />
      </section>

      <Block className="pad-block flex flex-col gap-6">
        <h2 className="m-0 text-[32px] leading-[1.05] font-bold tracking-[-0.035em]">Liste des traceurs</h2>
        {cookies.trackers && cookies.trackers.length > 0 && (
          <div className="overflow-x-auto rounded-card border border-line">
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
        <p className="m-0 max-w-[760px] text-[15px] leading-relaxed text-body">
          {cookies.footnote} Pour le reste, voir les <Link href="/mentions-legales#confidentialite" className="text-ink">données personnelles</Link>.
        </p>
      </Block>
    </>
  )
}
