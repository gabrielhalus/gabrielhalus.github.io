import type { Block } from 'payload'

/** Encadré « Bon à savoir » dans un guide. */
export const CalloutBlock: Block = {
  slug: 'callout',
  labels: { singular: 'Encadré', plural: 'Encadrés' },
  fields: [
    { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Bon à savoir.' },
    { name: 'text', type: 'textarea', label: 'Texte', required: true },
  ],
}

/** Appel à l'action vers une offre métier, inséré au fil d'un guide. */
export const OfferCtaBlock: Block = {
  slug: 'offerCta',
  labels: { singular: 'CTA offre', plural: 'CTA offre' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Sur-titre', defaultValue: 'Offre métier' },
    { name: 'text', type: 'textarea', label: 'Texte', required: true },
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', label: 'Libellé du bouton', defaultValue: 'Calculer mon gain' },
        { name: 'url', type: 'text', label: 'URL', required: true },
      ],
    },
  ],
}

/** Liste d'étapes numérotées (pastilles citron). */
export const StepsBlock: Block = {
  slug: 'steps',
  labels: { singular: 'Étapes numérotées', plural: 'Étapes numérotées' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Étapes',
      fields: [
        { name: 'title', type: 'text', label: 'Titre (en gras)', required: true },
        { name: 'text', type: 'textarea', label: 'Texte' },
      ],
    },
  ],
}

/** Liste à coches. */
export const ChecklistBlock: Block = {
  slug: 'checklist',
  labels: { singular: 'Liste à coches', plural: 'Listes à coches' },
  fields: [{ name: 'items', type: 'array', label: 'Éléments', fields: [{ name: 'text', type: 'text', required: true }] }],
}

/** Visuel avec légende ; sans image, un aplat légendé sert de substitut. */
export const FigureBlock: Block = {
  slug: 'figure',
  labels: { singular: 'Figure', plural: 'Figures' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Image' },
    { name: 'placeholder', type: 'text', label: 'Texte du visuel de substitution', admin: { condition: (_, s) => !s?.image } },
    { name: 'caption', type: 'text', label: 'Légende' },
  ],
}

export const guideBlocks = [CalloutBlock, OfferCtaBlock, StepsBlock, ChecklistBlock, FigureBlock]
