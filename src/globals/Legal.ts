import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const Legal: GlobalConfig = {
  slug: 'legal',
  label: 'Mentions légales',
  admin: {
    group: 'Pages & réglages',
    description: 'L’identité de l’éditeur (SIRET, adresse…) se règle dans « Réglages du site › Entreprise ».',
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'updatedOn', type: 'date', label: 'Dernière mise à jour', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'publisher', type: 'text', label: 'Directeur de la publication', defaultValue: 'Gabriel Halus' },
    { name: 'hosting', type: 'textarea', label: 'Hébergement', defaultValue: 'Le site est hébergé par [Nom de l’hébergeur], [raison sociale], [adresse], [téléphone].' },
    { name: 'intellectualProperty', type: 'textarea', label: 'Propriété intellectuelle' },
    {
      name: 'privacy',
      type: 'group',
      label: 'Données personnelles',
      fields: [
        { name: 'intro', type: 'textarea', label: 'Introduction' },
        {
          name: 'rows',
          type: 'array',
          label: 'Tableau',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', label: 'Quoi', required: true },
                { name: 'detail', type: 'text', label: 'Détail', required: true },
              ],
            },
          ],
        },
        { name: 'rights', type: 'textarea', label: 'Vos droits' },
      ],
    },
  ],
}
