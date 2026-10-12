import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { toneField } from '@/fields/tone'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { longformEditor } from '@/lib/editor'

export const PROJECT_TYPES = [
  { label: 'Application web', value: 'web-app' },
  { label: 'Automatisation', value: 'automation' },
  { label: 'API & intégrations', value: 'api' },
  { label: 'Reprise de code', value: 'takeover' },
]

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projet', plural: 'Projets' },
  admin: {
    group: 'Contenu',
    useAsTitle: 'title',
    defaultColumns: ['title', 'projectType', 'year', 'featured', '_status'],
  },
  defaultSort: 'order',
  access: { read: () => true },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Nom du projet', required: true },
    slugField(),
    {
      type: 'row',
      fields: [
        { name: 'projectType', type: 'select', label: 'Type', options: PROJECT_TYPES, required: true },
        { name: 'sector', type: 'text', label: 'Secteur' },
        { name: 'year', type: 'number', label: 'Année', required: true },
      ],
    },
    { name: 'client', type: 'text', label: 'Client' },
    {
      name: 'result',
      type: 'text',
      label: 'Résultat mesuré',
      admin: { description: 'Ex. « −40 % de temps de saisie ». Affiché sur la carte du projet.' },
    },
    { name: 'summary', type: 'textarea', label: 'Résumé', admin: { description: 'Chapô de l’étude de cas et description SEO par défaut.' } },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Capture' },
    toneField({ admin: { description: 'Couleur du visuel de substitution tant qu’il n’y a pas de capture.' } }),
    {
      name: 'stack',
      type: 'text',
      label: 'Technologies',
      hasMany: true,
    },
    { name: 'content', type: 'richText', label: 'Étude de cas', editor: longformEditor },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Mis en avant (carte avec capture)',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'highlightSector',
      type: 'checkbox',
      label: 'Secteur en citron dans la liste',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', label: 'Ordre', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
