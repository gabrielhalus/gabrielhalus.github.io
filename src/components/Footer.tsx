import Link from 'next/link'

import { getOffers, getSettings } from '@/lib/payload'
import { offerPath } from '@/lib/utils'

import { ButtonLink } from './ui'

const linkClass = 'text-white no-underline hover:text-subtle'
const titleClass = 'mb-1 font-mono text-[11px] tracking-[0.08em] text-subtle uppercase'

export const Footer = async () => {
  const [settings, offers] = await Promise.all([getSettings(), getOffers()])

  return (
    <footer className="p-3 text-white">
      <div className="mx-auto flex max-w-[1416px] flex-col gap-12 overflow-hidden rounded-block bg-ink px-6 pt-14 sm:px-12">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex max-w-[520px] flex-[1_1_380px] flex-col items-start gap-6">
            <p className="m-0 text-[clamp(26px,3vw,34px)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance">{settings.footerCta}</p>
            <ButtonLink href="/contact" variant="accent" size="md" arrow>
              {settings.footerCtaLabel}
            </ButtonLink>
          </div>
          <div className="grid flex-[1_1_520px] grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-8 text-[15px]">
            <nav aria-label="Site" className="flex flex-col gap-3">
              <p className={titleClass}>Site</p>
              <Link href="/" className={linkClass}>Accueil</Link>
              <Link href="/#projets" className={linkClass}>Projets</Link>
              <Link href="/#methode" className={linkClass}>Méthode</Link>
              <Link href="/guides" className={linkClass}>Guides</Link>
              <Link href="/contact" className={linkClass}>Contact</Link>
            </nav>
            <nav aria-label="Offres métier" className="flex flex-col gap-3">
              <p className={titleClass}>Offres métier</p>
              {offers.map((offer) =>
                offer.status === 'live' ? (
                  <Link key={offer.id} href={offerPath(offer.slug)} className={linkClass}>
                    {offer.name}
                  </Link>
                ) : (
                  <span key={offer.id} className="text-subtle">
                    {offer.name} — bientôt
                  </span>
                ),
              )}
            </nav>
            <nav aria-label="Informations légales" className="flex flex-col gap-3">
              <p className={titleClass}>Légal</p>
              <Link href="/mentions-legales" className={linkClass}>Mentions légales</Link>
              <Link href="/mentions-legales#confidentialite" className={linkClass}>Confidentialité</Link>
              <Link href="/cookies" className={linkClass}>Cookies</Link>
            </nav>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-night-line pt-6 text-[13px] text-subtle">
          <span>
            © {new Date().getFullYear()} {settings.siteName} — Entrepreneur individuel · SIRET {settings.siret}
          </span>
          {settings.socials && settings.socials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {settings.socials.map((s) => (
                <a key={s.id} href={s.url} rel="me noopener" target="_blank" className="rounded-full border border-night-line-2 px-3.5 py-2 text-white no-underline hover:border-subtle">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {settings.footerWordmark && (
          <p aria-hidden="true" className="m-0 mb-[-0.2em] text-[clamp(64px,15vw,228px)] leading-[0.8] font-extrabold tracking-[-0.06em] whitespace-nowrap text-night-glyph select-none">
            {settings.footerWordmark}
          </p>
        )}
      </div>
    </footer>
  )
}
