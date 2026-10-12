import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { toneField } from '@/fields/tone'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { longformEditor } from '@/lib/editor'

/** Guides SEO (/guides/[slug]). Le sommaire est construit à partir des titres H2 du contenu. */
export const Guides: CollectionConfig = {
  slug: 'guides',
  labels: { singular: 'Guide', plural: 'Guides' },
  admin: {
    group: 'Contenu',
    useAsTitle: 'title',
    defaultColumns: ['title', 'offer', 'publishedAt', '_status'],
  },
  defaultSort: '-publishedAt',
  access: { read: () => true },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Titre', required: true },
    slugField(),
    { name: 'lead', type: 'textarea', label: 'Chapô' },
    {
      name: 'tldr',
      type: 'array',
      label: 'En bref',
      admin: { description: 'Trois points maximum, affichés en tête d’article.' },
      maxRows: 5,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'intro', type: 'textarea', label: 'Introduction (paragraphe d’accroche)' },
    { name: 'content', type: 'richText', label: 'Contenu', editor: longformEditor, required: true },
    {
      name: 'faq',
      type: 'array',
      label: 'Questions fréquentes',
      admin: { description: 'Affichées en fin d’article et balisées en FAQPage (données structurées).' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'related',
      type: 'relationship',
      relationTo: 'guides',
      hasMany: true,
      label: 'À lire ensuite',
      maxRows: 3,
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
    // Barre latérale
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date de publication',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
      hooks: {
        beforeChange: [({ value, siblingData }) => value ?? (siblingData._status === 'published' ? new Date().toISOString() : value)],
      },
    },
    { name: 'offer', type: 'relationship', relationTo: 'offers', label: 'Offre liée', admin: { position: 'sidebar' } },
    { name: 'category', type: 'text', label: 'Catégorie', defaultValue: 'Guide pratique', admin: { position: 'sidebar' } },
    { name: 'tags', type: 'text', hasMany: true, label: 'Étiquettes', admin: { position: 'sidebar' } },
    toneField({ admin: { position: 'sidebar' } }),
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Visuel', admin: { position: 'sidebar' } },
    {
      name: 'readingTime',
      type: 'number',
      label: 'Temps de lecture (min)',
      admin: { position: 'sidebar', description: 'Laisser vide pour un calcul automatique.' },
    },
    { name: 'showToc', type: 'checkbox', label: 'Afficher le sommaire', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
