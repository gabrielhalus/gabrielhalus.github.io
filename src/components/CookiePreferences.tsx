'use client'

import { useId, useState, useSyncExternalStore } from 'react'

import { type Consent, OPEN_BANNER_EVENT, parseConsent, readConsentRaw, subscribeConsent, writeConsent } from '@/lib/consent'
import { cn } from '@/lib/utils'

const Switch = ({ on, onToggle, labelledBy }: { on: boolean; onToggle: () => void; labelledBy: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-labelledby={labelledBy}
    onClick={onToggle}
    className={cn('box-border flex h-[30px] w-[52px] shrink-0 cursor-pointer rounded-full p-[3px] transition-colors', on ? 'justify-end bg-accent' : 'justify-start bg-night-line-2')}
  >
    <span className={cn('size-6 rounded-full', on ? 'bg-ink' : 'bg-white')} />
  </button>
)

const Row = ({ title, text, children, id }: { title: string; text?: string | null; children: React.ReactNode; id: string }) => (
  <div className="flex items-start justify-between gap-5 rounded-tile border border-night-line bg-night p-5">
    <div className="flex flex-col gap-1.5">
      <span id={id} className="text-[17px] font-semibold">{title}</span>
      {text && <span className="text-sm leading-normal text-on-dark">{text}</span>}
    </div>
    {children}
  </div>
)

export const CookiePreferences = ({ necessary, analytics, thirdParty }: { necessary?: string | null; analytics?: string | null; thirdParty?: string | null }) => {
  const id = useId()
  const stored = parseConsent(useSyncExternalStore(subscribeConsent, readConsentRaw, () => null))
  // Brouillon local tant que l'utilisateur n'a pas enregistré
  const [draft, setDraft] = useState<Consent | null>(null)
  const consent = draft ?? stored ?? { analytics: false, thirdParty: false }
  const saved = draft === null && stored !== null

  const toggle = (key: keyof Consent) => setDraft({ ...consent, [key]: !consent[key] })

  return (
    <div className="flex flex-col gap-5 rounded-block bg-ink p-[clamp(24px,4vw,48px)] text-white">
      <div className="flex items-center justify-between gap-4">
        <h2 className="m-0 text-[26px] font-bold tracking-[-0.03em]">Vos préférences</h2>
        <span aria-live="polite" className={cn('font-mono text-xs', saved ? 'text-accent' : 'text-subtle')}>
          {saved ? 'enregistré' : 'non enregistré'}
        </span>
      </div>

      <Row id={`${id}-n`} title="Nécessaires" text={necessary}>
        <span className="shrink-0 rounded-chip bg-night-line px-2.5 py-1.5 text-[13px] text-on-dark">Toujours actif</span>
      </Row>
      <Row id={`${id}-a`} title="Mesure d’audience" text={analytics}>
        <Switch on={consent.analytics} onToggle={() => toggle('analytics')} labelledBy={`${id}-a`} />
      </Row>
      <Row id={`${id}-t`} title="Contenus tiers" text={thirdParty}>
        <Switch on={consent.thirdParty} onToggle={() => toggle('thirdParty')} labelledBy={`${id}-t`} />
      </Row>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => {
            writeConsent(consent)
            setDraft(null)
          }}
          className="h-12 flex-[1_1_180px] cursor-pointer rounded-full bg-accent text-[15px] font-semibold text-ink hover:bg-accent-deep"
        >
          Enregistrer mes choix
        </button>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_BANNER_EVENT))}
          className="h-12 flex-[1_1_180px] cursor-pointer rounded-full border border-night-line-2 bg-transparent text-[15px] font-medium text-white hover:border-subtle"
        >
          Revoir la bannière
        </button>
      </div>
    </div>
  )
}
