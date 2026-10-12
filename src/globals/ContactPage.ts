import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Page Contact',
  admin: { group: 'Pages & réglages' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Parlons de votre projet.' },
    { name: 'lead', type: 'textarea', label: 'Chapô', admin: { description: '« {delai} » est remplacé par le délai de réponse des réglages.' } },
    {
      type: 'row',
      fields: [
        { name: 'bookingTitle', type: 'text', label: 'Carte agenda — titre', defaultValue: 'Réserver un appel' },
        { name: 'bookingText', type: 'text', label: 'Carte agenda — texte', defaultValue: '30 min en visio, gratuit' },
      ],
    },
    { name: 'mailTitle', type: 'text', label: 'Carte e-mail — titre', defaultValue: 'Écrire directement' },
    { name: 'messagePlaceholder', type: 'text', label: 'Aide du champ message', defaultValue: 'Le contexte, ce qui vous fait perdre du temps, l’échéance éventuelle…' },
    { name: 'budgets', type: 'text', hasMany: true, label: 'Fourchettes de budget' },
    { name: 'formNote', type: 'text', label: 'Mention sous le bouton', defaultValue: 'Pas de newsletter, pas de revente.' },
    {
      name: 'success',
      type: 'group',
      label: 'Message de confirmation',
      fields: [
        { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Message bien reçu.' },
        { name: 'text', type: 'textarea', label: 'Texte' },
      ],
    },
    { name: 'stepsTitle', type: 'text', label: 'Titre des étapes', defaultValue: 'Ce qui se passe après l’envoi' },
    {
      name: 'steps',
      type: 'array',
      label: 'Étapes',
      maxRows: 3,
      fields: [
        { name: 'title', type: 'text', label: 'Titre', required: true },
        { name: 'text', type: 'textarea', label: 'Texte' },
      ],
    },
  ],
}
