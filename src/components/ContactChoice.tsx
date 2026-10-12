'use client'

import { createContext, type ReactNode, useContext, useState } from 'react'

/**
 * Choix en cours dans le formulaire de contact (type de demande, offre),
 * partagé avec la carte « Réserver un appel » pour qu'elle suive l'offre choisie.
 */

export type RequestType = 'custom' | 'offer' | 'other'
type Choice = { type: RequestType; offer?: string }

const ChoiceContext = createContext<{
  choice: Choice
  update: (next: Partial<Choice>) => void
} | null>(null)

export const ContactChoiceProvider = ({
  initial,
  children,
}: {
  initial: Choice
  children: ReactNode
}) => {
  const [choice, setChoice] = useState(initial)
  return (
    <ChoiceContext value={{ choice, update: (next) => setChoice((c) => ({ ...c, ...next })) }}>
      {children}
    </ChoiceContext>
  )
}

export const useContactChoice = () => useContext(ChoiceContext)

type BookingLinkProps = {
  /** Lien des Réglages du site. */
  defaultHref?: string | null
  /** Valeur d'option d'offre (« Traiteurs — Complet ») → agenda dédié. */
  byOffer: Record<string, string>
  className?: string
  children: ReactNode
}

/** Lien d'agenda : celui de l'offre sélectionnée dans le formulaire, sinon le lien par défaut. */
export const BookingLink = ({ defaultHref, byOffer, className, children }: BookingLinkProps) => {
  const choice = useContactChoice()?.choice
  const href = (choice?.type === 'offer' && choice.offer && byOffer[choice.offer]) || defaultHref
  if (!href) return null
  return (
    <a href={href} target="_blank" rel="noopener" className={className}>
      {children}
    </a>
  )
}
