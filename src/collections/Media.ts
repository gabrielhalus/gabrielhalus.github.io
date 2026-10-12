import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  admin: { group: 'Contenu' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texte alternatif',
      required: true,
      admin: { description: 'Décrit l’image pour les lecteurs d’écran et le référencement.' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'card', width: 800 },
      { name: 'large', width: 1600 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
}
