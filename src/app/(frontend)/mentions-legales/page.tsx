import type { Metadata } from 'next'
import Link from 'next/link'

import { ArrowUpRight } from '@/components/icons'
import { ArrowDot, Block, Eyebrow } from '@/components/ui'
import { getPayloadClient, getSettings } from '@/lib/payload'
import { formatShortDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Mentions légales & confidentialité',
  alternates: { canonical: '/mentions-legales' },
}

const h2 = 'm-0 text-[28px] leading-[1.1] font-bold tracking-[-0.03em] text-ink'

export default async function LegalPage() {
  const payload = await getPayloadClient()
  const [legal, settings] = await Promise.all([payload.findGlobal({ slug: 'legal' }), getSettings()])

  const identity = [
    { label: 'Nom', value: settings.legalName },
    { label: 'SIRET', value: settings.siret, mono: true },
    { label: 'Adresse', value: settings.address ?? '[Adresse postale]' },
    { label: 'Immatriculation', value: settings.registration },
    { label: 'Contact', value: [settings.email, settings.phone ?? '[téléphone]'].filter(Boolean).join(' · ') },
    { label: 'TVA', value: settings.vatMention },
  ]

  const toc = [
    { href: '#editeur', label: '1. Éditeur du site' },
    { href: '#hebergement', label: '2. Hébergement' },
    { href: '#propriete', label: '3. Propriété intellectuelle' },
    { href: '#confidentialite', label: '4. Données personnelles' },
  ]

  return (
    <>
      <Block className="pad-block flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3.5">
          <Eyebrow>// Informations légales</Eyebrow>
          <h1 className="m-0 text-[clamp(42px,5.4vw,80px)] leading-[0.95] font-extrabold tracking-[-0.05em]">Mentions légales &amp; confidentialité</h1>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3.5 py-2 text-[13px]">Dernière mise à jour : {formatShortDate(legal.updatedOn)}</span>
      </Block>

      <div className="flex flex-wrap items-start gap-3">
        <nav aria-label="Sommaire" className="box-border flex max-w-full flex-[1_1_260px] flex-col gap-1 rounded-block bg-white p-6 lg:sticky lg:top-6">
          <span className="eyebrow px-3 pb-2.5 text-[11px] text-muted">Sommaire</span>
          {toc.map((item) => (
            <a key={item.href} href={item.href} className="rounded-xl px-3 py-2.5 text-[15px] text-ink no-underline hover:bg-accent-soft">
              {item.label}
            </a>
          ))}
          <Link href="/cookies" className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] text-ink no-underline hover:bg-accent-soft">
            5. Cookies
            <ArrowUpRight size={14} />
          </Link>
        </nav>

        <article className="box-border flex min-w-0 flex-[999_1_560px] flex-col gap-12 rounded-block bg-white p-[clamp(24px,4.5vw,56px)] text-base leading-[1.65] text-body">
          <section id="editeur" className="flex flex-col gap-[18px]">
            <h2 className={h2}>1. Éditeur du site</h2>
            <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-px overflow-hidden rounded-card border border-line bg-line">
              {identity.map((row) => (
                <div key={row.label} className="flex flex-col gap-1 bg-white px-[18px] py-4">
                  <dt className="text-[13px] text-muted">{row.label}</dt>
                  <dd className={row.mono ? 'm-0 font-mono text-[15px] font-medium text-ink' : 'm-0 font-medium whitespace-pre-line text-ink'}>{row.value}</dd>
                </div>
              ))}
            </dl>
            {legal.publisher && <p className="m-0">Directeur de la publication&nbsp;: {legal.publisher}.</p>}
          </section>

          <section id="hebergement" className="flex flex-col gap-3.5">
            <h2 className={h2}>2. Hébergement</h2>
            <p className="m-0 whitespace-pre-line">{legal.hosting}</p>
          </section>

          <section id="propriete" className="flex flex-col gap-3.5">
            <h2 className={h2}>3. Propriété intellectuelle</h2>
            <p className="m-0 whitespace-pre-line">{legal.intellectualProperty}</p>
          </section>

          <section id="confidentialite" className="flex flex-col gap-[18px]">
            <h2 className={h2}>4. Données personnelles</h2>
            {legal.privacy?.intro && <p className="m-0 whitespace-pre-line">{legal.privacy.intro}</p>}
            {legal.privacy?.rows && legal.privacy.rows.length > 0 && (
              <div className="overflow-x-auto rounded-card border border-line">
                <table className="w-full min-w-[560px] border-collapse text-[15px] leading-normal">
                  <thead>
                    <tr className="bg-surface-2 text-left">
                      <th scope="col" className="px-4 py-3 text-[13px] font-medium text-muted">Quoi</th>
                      <th scope="col" className="px-4 py-3 text-[13px] font-medium text-muted">Détail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {legal.privacy.rows.map((row) => (
                      <tr key={row.id} className="border-t border-line">
                        <th scope="row" className="px-4 py-3.5 text-left align-top font-semibold text-ink">{row.label}</th>
                        <td className="px-4 py-3.5">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {legal.privacy?.rights && <p className="m-0 whitespace-pre-line">{legal.privacy.rights}</p>}
          </section>

          <Link href="/cookies" className="flex items-center justify-between gap-4 rounded-tile border border-line bg-surface-2 py-5 pr-5 pl-6 text-ink no-underline hover:border-line-strong">
            <span className="flex flex-col gap-0.5">
              <span className="text-[19px] font-semibold">5. Cookies</span>
              <span className="text-[15px] text-muted">Lire la politique et modifier vos choix</span>
            </span>
            <ArrowDot className="size-11 bg-ink text-accent" />
          </Link>
        </article>
      </div>
    </>
  )
}
