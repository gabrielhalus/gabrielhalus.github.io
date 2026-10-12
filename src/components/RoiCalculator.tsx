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

const Slider = ({
  id,
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: {
  id: string
  label: string
  value: number
  unit?: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) => (
  <div className="flex flex-col gap-2.5">
    <div className="flex justify-between gap-4 text-[15px]">
      <label htmlFor={id}>{label}</label>
      <span className="font-mono text-accent">
        {value}
        {unit && ` ${unit}`}
      </span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="m-0 h-6 w-full accent-accent"
    />
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

  return (
    <>
      <div className="flex flex-col gap-7">
        {children}
        <div className="flex flex-col gap-[22px]">
        <Slider id="r-devis" label="Devis rédigés par semaine" value={s.quotes} min={1} max={30} step={1} onChange={set('quotes')} />
        <Slider id="r-mindevis" label="Minutes par devis aujourd’hui" value={s.minQuote} unit="min" min={10} max={120} step={5} onChange={set('minQuote')} />
        <Slider id="r-cmd" label="Commandes livrées par semaine" value={s.orders} min={1} max={20} step={1} onChange={set('orders')} />
        <Slider id="r-mincmd" label="Minutes d’administration par commande" value={s.minOrder} unit="min" min={10} max={180} step={5} onChange={set('minOrder')} />
        <Slider id="r-taux" label="Valeur d’une heure de votre temps" value={s.rate} unit="€" min={15} max={120} step={5} onChange={set('rate')} />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="relative flex flex-col gap-2 overflow-hidden rounded-panel bg-accent p-8 text-ink">
          <span className="text-[15px] font-medium">Temps récupéré chaque semaine</span>
          <output htmlFor="r-devis r-mindevis r-cmd r-mincmd" aria-live="polite" className="text-[clamp(72px,9vw,128px)] leading-[0.9] font-extrabold tracking-[-0.06em]">
            {fmtHours(perWeek)}
          </output>
          <span className="text-[15px]">
            soit <strong>{nf.format(Math.round(perYear))} heures</strong> sur une année de {weeksPerYear} semaines
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
          <div className="flex flex-col gap-1.5 rounded-tile border border-night-line bg-night p-6">
            <span className="text-[13px] text-subtle">Valeur de ce temps / an</span>
            <span className="font-mono text-[30px] font-medium tracking-[-0.03em]">{nf.format(Math.round(value))} €</span>
          </div>
          <div className="flex flex-col gap-1.5 rounded-tile border border-night-line bg-night p-6">
            <span className="text-[13px] text-subtle">Offre rentabilisée en</span>
            <span className="font-mono text-[30px] font-medium tracking-[-0.03em]">{payback}</span>
          </div>
        </div>
        <ButtonLink href={ctaHref} variant="white" size="xl" arrow className="h-auto min-h-14 justify-between py-2 text-base">
          {ctaLabel}
        </ButtonLink>
      </div>
    </>
  )
}
