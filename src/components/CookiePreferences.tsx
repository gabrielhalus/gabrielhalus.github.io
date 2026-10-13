'use client'

import { useId, useState, useSyncExternalStore } from 'react'

import { type Consent, type ConsentCategory, OPEN_BANNER_EVENT, parseConsent, readConsentRaw, subscribeConsent, writeConsent } from '@/lib/consent'
import { cn } from '@/lib/utils'

const Switch = ({ on, onToggle, labelledBy }: { on: boolean; onToggle: () => void; labelledBy: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-labelledby={labelledBy}
    onClick={onToggle}
    className={cn('box-border flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-[3px] transition-colors sm:h-[30px] sm:w-[52px]', on ? 'justify-end bg-accent' : 'justify-start bg-night-line-2')}
  >
    <span className={cn('size-[26px] rounded-full sm:size-6', on ? 'bg-ink' : 'bg-white')} />
  </button>
)

const Row = ({ title, text, children, id }: { title: string; text?: string | null; children: React.ReactNode; id: string }) => (
  <div className="flex items-center justify-between gap-3.5 rounded-[18px] border border-night-line bg-night p-4 sm:items-start sm:gap-5 sm:rounded-tile sm:p-5">
    <div className="flex flex-col gap-1 sm:gap-1.5">
      <span id={id} className="text-base font-semibold sm:text-[17px]">{title}</span>
      {text && <span className="text-[13px] leading-[1.45] text-on-dark sm:text-sm sm:leading-normal">{text}</span>}
    </div>
    {children}
  </div>
)

export const CookiePreferences = ({
  categories,
  necessary,
  analytics,
  thirdParty,
}: {
  categories: ConsentCategory[]
  necessary?: string | null
  analytics?: string | null
  thirdParty?: string | null
}) => {
  const id = useId()
  const stored = parseConsent(useSyncExternalStore(subscribeConsent, readConsentRaw, () => null))
  // Brouillon local tant que l'utilisateur n'a pas enregistré
  const [draft, setDraft] = useState<Consent | null>(null)
  const consent = draft ?? stored ?? { analytics: false, thirdParty: false }
  const saved = draft === null && stored !== null

  const toggle = (key: keyof Consent) => setDraft({ ...consent, [key]: !consent[key] })

  return (
    <div className="flex flex-col gap-3 rounded-block bg-ink px-4 py-[22px] text-white sm:gap-5 sm:p-[clamp(24px,4vw,48px)]">
      <div className="flex items-center justify-between gap-4 max-sm:px-1">
        <h2 className="m-0 text-[22px] font-bold tracking-[-0.02em] sm:text-[26px] sm:tracking-[-0.03em]">Vos préférences</h2>
        <span aria-live="polite" className={cn('font-mono text-xs', saved ? 'text-accent' : 'text-subtle')}>
          {saved ? 'enregistré' : 'non enregistré'}
        </span>
      </div>

      <Row id={`${id}-n`} title="Nécessaires" text={necessary}>
        <span className="shrink-0 rounded-chip bg-night-line px-[9px] py-1.5 text-xs text-on-dark sm:px-2.5 sm:text-[13px]">Toujours actif</span>
      </Row>
      {categories.includes('analytics') && (
        <Row id={`${id}-a`} title="Mesure d’audience" text={analytics}>
          <Switch on={consent.analytics} onToggle={() => toggle('analytics')} labelledBy={`${id}-a`} />
        </Row>
      )}
      {categories.includes('thirdParty') && (
        <Row id={`${id}-t`} title="Contenus tiers" text={thirdParty}>
          <Switch on={consent.thirdParty} onToggle={() => toggle('thirdParty')} labelledBy={`${id}-t`} />
        </Row>
      )}

      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:pt-1">
        <button
          type="button"
          onClick={() => {
            writeConsent(consent)
            setDraft(null)
          }}
          className="h-[52px] cursor-pointer rounded-full bg-accent text-base font-semibold text-ink hover:bg-accent-deep sm:h-12 sm:flex-[1_1_180px] sm:text-[15px]"
        >
          Enregistrer mes choix
        </button>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_BANNER_EVENT))}
          className="h-12 cursor-pointer rounded-full border border-night-line-2 bg-transparent text-[15px] font-medium text-white hover:border-subtle sm:flex-[1_1_180px]"
        >
          Revoir la bannière
        </button>
      </div>
    </div>
  )
}
