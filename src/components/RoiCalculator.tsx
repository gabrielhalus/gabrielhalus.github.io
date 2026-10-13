'use client'

import { type ReactNode, useState } from 'react'

import { ButtonLink } from './ui'

type Props = {
  children: ReactNode
  ctaHref: string
  ctaLabel: string
  offerPrice?: number | null
  minutesPerQuoteAfter: number
  automationRate: number
  weeksPerYear: number
}

const fmtHours = (h: number) => {
  const hh = Math.floor(h)
  const mm = Math.round((h - hh) * 60)
  if (mm === 60) return `${hh + 1} h`
  return mm === 0 ? `${hh} h` : `${hh} h ${String(mm).padStart(2, '0')}`
}

const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

type Field = { id: string; key: 'quotes' | 'minQuote' | 'orders' | 'minOrder' | 'rate'; label: string; unit?: string; min: number; max: number; step: number }

const FIELDS: Field[] = [
  { id: 'r-devis', key: 'quotes', label: 'Devis rédigés par semaine', min: 1, max: 30, step: 1 },
  { id: 'r-mindevis', key: 'minQuote', label: 'Minutes par devis aujourd’hui', unit: 'min', min: 10, max: 120, step: 5 },
  { id: 'r-cmd', key: 'orders', label: 'Commandes livrées par semaine', min: 1, max: 20, step: 1 },
  { id: 'r-mincmd', key: 'minOrder', label: 'Minutes d’administration par commande', unit: 'min', min: 10, max: 180, step: 5 },
  { id: 'r-taux', key: 'rate', label: 'Valeur d’une heure de votre temps', unit: '€', min: 15, max: 120, step: 5 },
]

const display = (f: Field, value: number) => `${value}${f.unit ? ` ${f.unit}` : ''}`

const Slider = ({ field, value, onChange }: { field: Field; value: number; onChange: (v: number) => void }) => (
  <div className="flex flex-col gap-2 lg:gap-2.5">
    <div className="flex justify-between gap-4 text-sm lg:text-[15px]">
      <label htmlFor={field.id}>{field.label}</label>
      <span className="font-mono text-accent">{display(field, value)}</span>
    </div>
    <input
      id={field.id}
      type="range"
      min={field.min}
      max={field.max}
      step={field.step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="m-0 h-7 w-full accent-accent lg:h-6"
    />
  </div>
)

/** Variante mobile du curseur : boutons − / + de 44 px, plus sûrs au doigt. */
const Stepper = ({ field, value, onChange }: { field: Field; value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl border border-night-line bg-night py-2.5 pr-2.5 pl-3.5">
    <span id={`${field.id}-m`} className="flex-1 text-sm leading-[1.3] text-on-dark">
      {field.label}
    </span>
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label={`Diminuer : ${field.label}`}
        disabled={value <= field.min}
        onClick={() => onChange(Math.max(field.min, value - field.step))}
        className="size-11 cursor-pointer rounded-full border border-night-line-2 bg-transparent text-xl text-white disabled:opacity-40"
      >
        −
      </button>
      <output aria-labelledby={`${field.id}-m`} className="min-w-16 text-center font-mono text-base text-accent">
        {display(field, value)}
      </output>
      <button
        type="button"
        aria-label={`Augmenter : ${field.label}`}
        disabled={value >= field.max}
        onClick={() => onChange(Math.min(field.max, value + field.step))}
        className="size-11 cursor-pointer rounded-full border-0 bg-accent text-xl text-ink disabled:opacity-40"
      >
        +
      </button>
    </div>
  </div>
)

export const RoiCalculator = ({ children, ctaHref, ctaLabel, offerPrice, minutesPerQuoteAfter, automationRate, weeksPerYear }: Props) => {
  const [s, setS] = useState({ quotes: 8, minQuote: 45, orders: 6, minOrder: 75, rate: 40 })
  const set = (k: keyof typeof s) => (v: number) => setS((prev) => ({ ...prev, [k]: v }))

  const perWeek = (s.quotes * Math.max(0, s.minQuote - minutesPerQuoteAfter)) / 60 + (s.orders * s.minOrder * (automationRate / 100)) / 60
  const perYear = perWeek * weeksPerYear
  const value = perYear * s.rate
  let payback = '[X] mois'
  if (offerPrice && value > 0) {
    const months = offerPrice / (value / 12)
    payback = months < 1 ? '< 1 mois' : `${(Math.ceil(months * 10) / 10).toLocaleString('fr-FR')} mois`
  }

  // Sur mobile, le résultat passe juste sous le titre et les curseurs deviennent des boutons − / +
  return (
    <>
      <div className="flex flex-col gap-5 max-sm:contents lg:gap-7">
        <div className="max-sm:order-1">{children}</div>
        <div className="flex flex-col gap-4 max-sm:hidden lg:gap-[22px]">
          {FIELDS.map((f) => (
            <Slider key={f.id} field={f} value={s[f.key]} onChange={set(f.key)} />
          ))}
        </div>
        <div className="flex flex-col gap-2 max-sm:order-3 sm:hidden">
          {FIELDS.map((f) => (
            <Stepper key={f.id} field={f} value={s[f.key]} onChange={set(f.key)} />
          ))}
        </div>
        <p className="m-0 px-1 text-[13px] leading-[1.45] text-subtle max-sm:order-4 sm:hidden">
          Hypothèses&nbsp;: un devis ramené à {minutesPerQuoteAfter} min et {automationRate} % de l’administratif automatisé, sur {weeksPerYear} semaines travaillées.
        </p>
      </div>
      <div className="flex flex-col gap-3 max-sm:order-2">
        <div className="relative flex flex-col gap-1 overflow-hidden rounded-tile bg-accent p-5 text-ink sm:flex-1 sm:justify-center sm:gap-1.5 sm:p-6 lg:flex-none lg:gap-2 lg:rounded-panel lg:p-8">
          <span className="text-sm font-medium lg:text-[15px]">Temps récupéré chaque semaine</span>
          <output htmlFor="r-devis r-mindevis r-cmd r-mincmd" aria-live="polite" className="text-[72px] leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-[84px] lg:text-[clamp(72px,9vw,128px)]">
            {fmtHours(perWeek)}
          </output>
          <span className="text-sm max-sm:hidden lg:text-[15px]">
            soit <strong>{nf.format(Math.round(perYear))} heures</strong> sur une année de {weeksPerYear} semaines
          </span>
          <span className="mt-2 flex justify-between gap-3 border-t border-ink/15 pt-3 text-sm sm:hidden">
            <span>
              <strong>{nf.format(Math.round(value))} €</strong> / an
            </span>
            <span>
              rentabilisé en <strong>{payback}</strong>
            </span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 max-sm:hidden">
          <div className="flex flex-col gap-1 rounded-[18px] border border-night-line bg-night p-4 lg:gap-1.5 lg:rounded-tile lg:p-6">
            <span className="text-xs text-subtle lg:text-[13px]">Valeur de ce temps / an</span>
            <span className="font-mono text-xl font-medium tracking-[-0.03em] lg:text-[30px]">{nf.format(Math.round(value))} €</span>
          </div>
          <div className="flex flex-col gap-1 rounded-[18px] border border-night-line bg-night p-4 lg:gap-1.5 lg:rounded-tile lg:p-6">
            <span className="text-xs text-subtle lg:text-[13px]">Offre rentabilisée en</span>
            <span className="font-mono text-xl font-medium tracking-[-0.03em] lg:text-[30px]">{payback}</span>
          </div>
        </div>
        <span className="contents max-sm:hidden">
          <ButtonLink href={ctaHref} variant="white" size="xl" arrow wide className="h-auto min-h-14 py-2 text-base">
            {ctaLabel}
          </ButtonLink>
        </span>
      </div>
    </>
  )
}
