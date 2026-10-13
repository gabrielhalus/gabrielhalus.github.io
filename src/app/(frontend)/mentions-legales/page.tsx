import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalNav } from '@/components/LegalNav'
import { ArrowDot, Block, Eyebrow } from '@/components/ui'
import { getPayloadClient, getSettings } from '@/lib/payload'
import { cn, formatShortDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Mentions légales & confidentialité',
  alternates: { canonical: '/mentions-legales' },
}

const h2 = 'm-0 text-2xl leading-[1.1] font-bold tracking-[-0.03em] text-ink sm:text-[28px]'
// Sur mobile, chaque section devient sa propre carte
const section = 'flex flex-col max-lg:scroll-mt-[72px] max-lg:rounded-block max-lg:bg-white max-lg:px-[18px] max-lg:py-[22px] sm:max-lg:p-8'

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
    { href: '#editeur', label: '1. Éditeur du site', short: 'Éditeur' },
    { href: '#hebergement', label: '2. Hébergement', short: 'Hébergement' },
    { href: '#propriete', label: '3. Propriété intellectuelle', short: 'Propriété' },
    { href: '#confidentialite', label: '4. Données personnelles', short: 'Données' },
  ]

  return (
    <>
      <Block className="pad-block flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-3 sm:gap-3.5">
          <Eyebrow>// Informations légales</Eyebrow>
          <h1 className="m-0 text-4xl leading-[0.98] font-extrabold tracking-[-0.05em] sm:text-[clamp(42px,5.4vw,80px)] sm:leading-[0.95]">Mentions légales &amp; confidentialité</h1>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-surface-2 px-3 py-[7px] text-[13px] sm:self-auto sm:px-3.5 sm:py-2">Dernière mise à jour : {formatShortDate(legal.updatedOn)}</span>
      </Block>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <LegalNav items={toc} />

        <article className="box-border flex min-w-0 flex-1 flex-col gap-3 text-base leading-[1.65] text-body lg:gap-12 lg:rounded-block lg:bg-white lg:p-[clamp(24px,4.5vw,56px)]">
          <section id="editeur" className={cn(section, 'gap-3.5 lg:gap-[18px]')}>
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

          <section id="hebergement" className={cn(section, 'gap-2.5 lg:gap-3.5')}>
            <h2 className={h2}>2. Hébergement</h2>
            <p className="m-0 whitespace-pre-line">{legal.hosting}</p>
          </section>

          <section id="propriete" className={cn(section, 'gap-2.5 lg:gap-3.5')}>
            <h2 className={h2}>3. Propriété intellectuelle</h2>
            <p className="m-0 whitespace-pre-line">{legal.intellectualProperty}</p>
          </section>

          <section id="confidentialite" className={cn(section, 'gap-3.5 lg:gap-[18px]')}>
            <h2 className={h2}>4. Données personnelles</h2>
            {legal.privacy?.intro && <p className="m-0 whitespace-pre-line">{legal.privacy.intro}</p>}
            {legal.privacy?.rows && legal.privacy.rows.length > 0 && (
              <dl className="m-0 flex flex-col gap-2 sm:hidden">
                {legal.privacy.rows.map((row) => (
                  <div key={row.id} className="flex flex-col gap-0.5 rounded-card bg-surface-2 px-4 py-3.5">
                    <dt className="text-xs font-semibold tracking-[0.06em] text-muted uppercase">{row.label}</dt>
                    <dd className="m-0 text-[15px] leading-normal text-ink">{row.detail}</dd>
                  </div>
                ))}
              </dl>
            )}
            {legal.privacy?.rows && legal.privacy.rows.length > 0 && (
              <div className="overflow-x-auto rounded-card border border-line max-sm:hidden">
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

          <Link
            href="/cookies"
            className="flex items-center justify-between gap-3 rounded-block bg-ink py-[18px] pr-3.5 pl-5 text-white no-underline lg:gap-4 lg:rounded-tile lg:border lg:border-line lg:bg-surface-2 lg:py-5 lg:pr-5 lg:pl-6 lg:text-ink lg:hover:border-line-strong"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-lg font-semibold lg:text-[19px]">5. Cookies</span>
              <span className="text-sm text-subtle lg:text-[15px] lg:text-muted">Lire la politique et modifier vos choix</span>
            </span>
            <ArrowDot className="size-11 bg-accent text-ink lg:bg-ink lg:text-accent" />
          </Link>
        </article>
      </div>
    </>
  )
}
