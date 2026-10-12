import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { toneField } from '@/fields/tone'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/**
 * Offres métier (/traiteurs, …) : un gabarit de page réutilisable par métier.
 */
export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: { singular: 'Offre métier', plural: 'Offres métier' },
  admin: {
    group: 'Contenu',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', '_status'],
  },
  defaultSort: 'order',
  access: { read: () => true },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Métier', required: true, admin: { description: 'Ex. « Traiteurs ».' } },
    slugField({ useAsSlug: 'name' }),
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      defaultValue: 'live',
      // Distinct de l'enum `_status` des brouillons (même nom par défaut sous Postgres)
      enumName: 'enum_offers_availability',
      options: [
        { label: 'En ligne', value: 'live' },
        { label: 'Bientôt (carte en pointillés, pas de page)', value: 'soon' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', label: 'Ordre', defaultValue: 0, admin: { position: 'sidebar' } },
    toneField({ admin: { position: 'sidebar' } }),
    {
      name: 'bookingUrl',
      type: 'text',
      label: 'Lien de prise de rendez-vous',
      validate: (value: string | null | undefined) => !value || /^https?:\/\//.test(value) || 'Une adresse complète, ex. https://cal.com/…',
      admin: {
        position: 'sidebar',
        description: 'Ex. un événement cal.com dédié à cette offre (démo, audit). Vide : le lien des Réglages du site.',
      },
    },
    {
      name: 'promise',
      type: 'text',
      label: 'Promesse courte',
      admin: { description: 'Ex. « 10 h gagnées par semaine ». Utilisée dans les cartes et le héros de l’accueil.' },
    },
    {
      name: 'cardText',
      type: 'textarea',
      label: 'Texte de la carte (accueil)',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Héros',
          name: 'hero',
          fields: [
            { name: 'badge', type: 'text', label: 'Badge', defaultValue: 'Offre clé en main · prix fixe' },
            { name: 'title', type: 'text', label: 'Titre', required: true },
            { name: 'lead', type: 'textarea', label: 'Chapô' },
            {
              type: 'row',
              fields: [
                { name: 'primaryLabel', type: 'text', label: 'CTA principal', defaultValue: 'Calculer mon gain' },
                { name: 'secondaryLabel', type: 'text', label: 'CTA secondaire', defaultValue: 'Réserver une démo' },
              ],
            },
            {
              name: 'trustPoints',
              type: 'array',
              label: 'Points de réassurance',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Photo' },
            { name: 'imagePlaceholder', type: 'text', label: 'Description du visuel attendu (sans photo)' },
            {
              name: 'floatingCards',
              type: 'group',
              label: 'Cartes flottantes',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'docLabel', type: 'text', label: 'Document', defaultValue: 'Devis n° 0142' },
                    { name: 'docTitle', type: 'text', label: 'Titre', defaultValue: 'Mariage · 120 couverts' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'docAmount', type: 'text', label: 'Montant', defaultValue: '6 840,00 €' },
                    { name: 'docTime', type: 'text', label: 'Durée', defaultValue: 'en 3 min' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'timeLabel', type: 'text', label: 'Libellé compteur', defaultValue: 'Temps récupéré cette semaine' },
                    { name: 'timeValue', type: 'text', label: 'Valeur compteur', defaultValue: '+ 10 h 15' },
                  ],
                },
                { name: 'notification', type: 'text', label: 'Notification', defaultValue: 'Fiche allergènes générée' },
              ],
            },
          ],
        },
        {
          label: 'Constat',
          name: 'problem',
          fields: [
            { name: 'title', type: 'text', label: 'Titre' },
            { name: 'text', type: 'textarea', label: 'Texte' },
            { name: 'breakdownTitle', type: 'text', label: 'Titre de la répartition', defaultValue: 'Où partent 10 heures par semaine' },
            {
              name: 'breakdown',
              type: 'array',
              label: 'Répartition du temps',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', label: 'Tâche', required: true },
                    { name: 'minutes', type: 'number', label: 'Minutes / semaine', required: true },
                  ],
                },
              ],
            },
            { name: 'footnote', type: 'textarea', label: 'Note' },
          ],
        },
        {
          label: 'Modules',
          name: 'modules',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Quatre modules, un seul outil.' },
            { name: 'intro', type: 'textarea', label: 'Introduction' },
            {
              name: 'items',
              type: 'array',
              label: 'Modules',
              maxRows: 6,
              fields: [
                { name: 'title', type: 'text', label: 'Titre', required: true },
                { name: 'description', type: 'textarea', label: 'Description' },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'variant',
                      type: 'select',
                      label: 'Style',
                      defaultValue: 'light',
                      options: [
                        { label: 'Citron', value: 'accent' },
                        { label: 'Clair', value: 'light' },
                        { label: 'Ton métier', value: 'tone' },
                        { label: 'Encre', value: 'dark' },
                      ],
                    },
                    {
                      name: 'visual',
                      type: 'select',
                      label: 'Illustration',
                      defaultValue: 'none',
                      options: [
                        { label: 'Aucune', value: 'none' },
                        { label: 'Grand glyphe', value: 'glyph' },
                        { label: 'Lignes (libellé / valeur)', value: 'rows' },
                        { label: 'Pastilles', value: 'chips' },
                        { label: 'Terminal', value: 'terminal' },
                      ],
                    },
                    { name: 'glyph', type: 'text', label: 'Glyphe', admin: { condition: (_, s) => s?.visual === 'glyph' } },
                  ],
                },
                {
                  name: 'visualItems',
                  type: 'array',
                  label: 'Éléments de l’illustration',
                  admin: { condition: (_, s) => ['rows', 'chips', 'terminal'].includes(s?.visual) },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', label: 'Libellé', required: true },
                        { name: 'value', type: 'text', label: 'Valeur (mise en avant)' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Formules',
          name: 'pricing',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Une offre définie. Ajustée à votre maison.' },
            { name: 'intro', type: 'textarea', label: 'Introduction' },
            {
              name: 'plans',
              type: 'array',
              label: 'Formules',
              maxRows: 4,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', label: 'Nom', required: true },
                    { name: 'subtitle', type: 'text', label: 'Sous-titre' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'price', type: 'text', label: 'Prix affiché', admin: { description: 'Ex. « 2 400 € » ou « Sur devis ».' } },
                    { name: 'priceNote', type: 'text', label: 'Mention', defaultValue: 'HT, une fois' },
                  ],
                },
                { name: 'features', type: 'array', label: 'Inclus', fields: [{ name: 'text', type: 'text', required: true }] },
                {
                  type: 'row',
                  fields: [
                    { name: 'highlighted', type: 'checkbox', label: 'Mise en avant (carte encre)' },
                    { name: 'badge', type: 'text', label: 'Badge', admin: { condition: (_, s) => Boolean(s?.highlighted) } },
                    { name: 'ctaLabel', type: 'text', label: 'Libellé du bouton' },
                  ],
                },
              ],
            },
            { name: 'footnote', type: 'textarea', label: 'Note sous les formules' },
          ],
        },
        {
          label: 'Calculateur',
          name: 'roi',
          fields: [
            { name: 'enabled', type: 'checkbox', label: 'Afficher le calculateur', defaultValue: true },
            { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Combien d’heures récupérez-vous ?' },
            { name: 'intro', type: 'textarea', label: 'Hypothèses affichées' },
            {
              type: 'row',
              fields: [
                {
                  name: 'offerPrice',
                  type: 'number',
                  label: 'Prix de référence (€)',
                  admin: { description: 'Sert au calcul « rentabilisée en ». Vide = « [X] mois ».' },
                },
                { name: 'minutesPerQuoteAfter', type: 'number', label: 'Minutes par devis après', defaultValue: 5 },
                { name: 'automationRate', type: 'number', label: 'Part automatisée (%)', defaultValue: 60 },
                { name: 'weeksPerYear', type: 'number', label: 'Semaines / an', defaultValue: 46 },
              ],
            },
            { name: 'ctaLabel', type: 'text', label: 'Libellé du bouton', defaultValue: 'Vérifier ces chiffres lors d’un audit offert' },
          ],
        },
        {
          label: 'Déroulé',
          name: 'process',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', defaultValue: 'De l’audit aux heures gagnées.' },
            {
              name: 'steps',
              type: 'array',
              label: 'Étapes',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'when', type: 'text', label: 'Quand', required: true },
                    { name: 'title', type: 'text', label: 'Titre', required: true },
                  ],
                },
                { name: 'text', type: 'textarea', label: 'Texte' },
              ],
            },
          ],
        },
        {
          label: 'Preuve & FAQ',
          fields: [
            {
              name: 'testimonial',
              type: 'group',
              label: 'Témoignage',
              fields: [
                { name: 'quote', type: 'textarea', label: 'Citation' },
                {
                  type: 'row',
                  fields: [
                    { name: 'author', type: 'text', label: 'Auteur' },
                    { name: 'company', type: 'text', label: 'Maison · ville' },
                  ],
                },
                { name: 'photo', type: 'upload', relationTo: 'media', label: 'Photo' },
              ],
            },
            {
              name: 'faq',
              type: 'array',
              label: 'Questions fréquentes',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'CTA final',
          name: 'finalCta',
          fields: [
            { name: 'title', type: 'text', label: 'Titre' },
            { name: 'text', type: 'textarea', label: 'Texte' },
            { name: 'label', type: 'text', label: 'Libellé du bouton', defaultValue: 'Réserver mon audit' },
          ],
        },
      ],
    },
  ],
}
