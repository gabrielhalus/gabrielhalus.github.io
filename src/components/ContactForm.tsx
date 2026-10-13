'use client'

import Link from 'next/link'
import { startTransition, useActionState, useState } from 'react'

import { type ContactState, submitContact } from '@/app/(frontend)/contact/actions'
import { cn } from '@/lib/utils'

import { useContactChoice } from './ContactChoice'
import { Curso } from './Curso'
import { ArrowDot } from './ui'

const TYPES = [
  { id: 'custom', label: 'Projet sur mesure' },
  { id: 'offer', label: 'Offre métier' },
  { id: 'other', label: 'Autre question' },
] as const

// 16 px sur mobile : en dessous, iOS zoome sur le champ actif
const fieldClass =
  'box-border h-[52px] rounded-[14px] border border-line-strong bg-white px-4 text-base text-ink outline-none focus:border-ink focus:shadow-[0_0_0_4px_var(--color-accent)] sm:h-12 sm:rounded-field sm:border-line sm:px-3.5 sm:text-[15px]'
const labelClass = 'text-sm font-semibold sm:text-[13px] sm:font-medium'

type Props = {
  offers: { label: string; value: string }[]
  budgets: string[]
  defaultType?: 'custom' | 'offer' | 'other'
  defaultOffer?: string
  placeholder?: string | null
  note?: string | null
  success: { title?: string | null; text?: string | null }
}

export const ContactForm = ({
  offers,
  budgets,
  defaultType = 'custom',
  defaultOffer,
  placeholder,
  note,
  success,
}: Props) => {
  const [type, setLocalType] = useState<(typeof TYPES)[number]['id']>(defaultType)
  const choice = useContactChoice()
  const setType = (next: (typeof TYPES)[number]['id']) => {
    setLocalType(next)
    choice?.update({ type: next })
  }
  const [dismissedAt, setDismissedAt] = useState<number>()
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, {
    status: 'idle',
  })

  if (state.status === 'success' && state.at !== dismissedAt) {
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center gap-4 py-6 text-center sm:min-h-[560px] sm:items-start sm:gap-5 sm:py-0 sm:text-left"
        role="status"
      >
        <span className="flex size-[104px] items-center justify-center rounded-tile bg-accent">
          <Curso size={72} tone="citron" expression="content" />
        </span>
        <h2 className="m-0 text-[30px] leading-none font-bold tracking-[-0.04em] sm:text-[40px]">
          {success.title}
        </h2>
        {success.text && (
          <p className="m-0 max-w-[420px] text-base leading-normal text-body sm:text-[17px]">{success.text}</p>
        )}
        <button
          type="button"
          onClick={() => setDismissedAt(state.at)}
          className="h-11 cursor-pointer rounded-full border border-line-strong bg-white px-[18px] text-[15px] font-medium text-ink hover:border-ink"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form
      key={dismissedAt ?? 0}
      className="flex flex-col gap-5"
      // Pas de `action={…}` : React réinitialiserait les champs, y compris en cas d’erreur
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => action(data))
      }}
    >
      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className={cn('mb-2.5 p-0', labelClass)}>Votre besoin</legend>
        <input type="hidden" name="requestType" value={type} />
        <div className="flex flex-wrap gap-2 sm:gap-1 sm:self-start sm:rounded-[28px] sm:bg-surface-2 sm:p-1">
          {TYPES.map((t) => {
            const on = t.id === type
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => setType(t.id)}
                className={cn(
                  'h-11 cursor-pointer rounded-full border px-4 text-[15px] font-medium sm:h-10 sm:border-0 sm:text-sm',
                  on
                    ? 'border-ink bg-ink text-white sm:bg-white sm:text-ink sm:shadow-raised'
                    : 'border-line-strong bg-white text-ink sm:bg-transparent sm:text-muted sm:hover:text-ink',
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="c-nom" className={labelClass}>
            Nom et prénom
          </label>
          <input id="c-nom" name="name" autoComplete="name" required className={fieldClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="c-mail" className={labelClass}>
            E-mail
          </label>
          <input
            id="c-mail"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="c-ent" className={labelClass}>
            Entreprise <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <input id="c-ent" name="company" autoComplete="organization" className={fieldClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="c-tel" className={labelClass}>
            Téléphone <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <input id="c-tel" name="phone" type="tel" autoComplete="tel" className={fieldClass} />
        </div>
      </div>

      {type === 'offer' && offers.length > 0 && (
        <div className="flex flex-col gap-2">
          <label htmlFor="c-offre" className={labelClass}>
            Quelle offre&nbsp;?
          </label>
          <select
            id="c-offre"
            name="offer"
            defaultValue={defaultOffer}
            onChange={(e) => choice?.update({ offer: e.target.value })}
            className={fieldClass}
          >
            {offers.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {type === 'custom' && budgets.length > 0 && (
        <div className="flex flex-col gap-2">
          <label htmlFor="c-budget" className={labelClass}>
            Budget envisagé
          </label>
          <select id="c-budget" name="budget" className={fieldClass}>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="c-msg" className={labelClass}>
          Votre message
        </label>
        <textarea
          id="c-msg"
          name="message"
          rows={6}
          required
          placeholder={placeholder ?? undefined}
          className={cn(fieldClass, 'h-auto min-h-[140px] resize-y py-3.5 leading-normal sm:min-h-40 sm:py-3')}
        />
      </div>

      {/* Champ piège anti-spam, invisible pour les humains */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor="c-site">Site web</label>
        <input id="c-site" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-3 text-sm leading-[1.45] text-body sm:gap-2.5">
        <input
          type="checkbox"
          name="consent"
          required
          className="m-0 size-[22px] shrink-0 accent-ink sm:mt-px sm:size-[18px]"
        />
        <span>
          J’accepte que ces informations soient utilisées pour me recontacter. Détails dans la{' '}
          <Link href="/mentions-legales#confidentialite" className="text-ink">
            politique de confidentialité
          </Link>
          .
        </span>
      </label>

      {state.status === 'error' && (
        <p
          role="alert"
          className="m-0 rounded-field border border-danger/30 bg-danger/5 px-3.5 py-3 text-sm text-danger"
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-14 cursor-pointer items-center justify-between gap-2.5 rounded-full border-0 bg-ink pr-2 pl-[22px] text-[17px] font-semibold text-white hover:bg-ink-soft disabled:cursor-wait disabled:opacity-60 sm:h-[52px] sm:pr-1.5 sm:text-base"
        >
          {pending ? 'Envoi…' : 'Envoyer le message'}
          <ArrowDot className="size-10 bg-accent text-ink" />
        </button>
        {note && <span className="text-center text-[13px] text-muted">{note}</span>}
      </div>
    </form>
  )
}
