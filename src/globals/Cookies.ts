import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const Cookies: GlobalConfig = {
  slug: 'cookies',
  label: 'Cookies',
  admin: { group: 'Pages & réglages' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'updatedOn', type: 'date', label: 'Dernière mise à jour', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Le strict minimum, et c’est vous qui choisissez.' },
    { name: 'intro', type: 'textarea', label: 'Introduction' },
    {
      name: 'categories',
      type: 'group',
      label: 'Catégories de consentement',
      fields: [
        { name: 'necessary', type: 'textarea', label: 'Nécessaires', defaultValue: 'Mémorisent votre choix sur cette page. Toujours actifs.' },
        { name: 'analytics', type: 'textarea', label: 'Mesure d’audience' },
        { name: 'thirdParty', type: 'textarea', label: 'Contenus tiers' },
      ],
    },
    {
      name: 'trackers',
      type: 'array',
      label: 'Liste des traceurs',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', label: 'Nom', required: true },
            {
              name: 'category',
              type: 'select',
              label: 'Catégorie',
              required: true,
              options: [
                { label: 'Nécessaire', value: 'necessary' },
                { label: 'Audience', value: 'analytics' },
                { label: 'Tiers', value: 'thirdParty' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'purpose', type: 'text', label: 'Finalité', required: true },
            { name: 'duration', type: 'text', label: 'Durée', required: true },
          ],
        },
      ],
    },
    { name: 'footnote', type: 'textarea', label: 'Note sous le tableau' },
    {
      name: 'banner',
      type: 'group',
      label: 'Bannière',
      fields: [
        { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Un petit réglage' },
        { name: 'text', type: 'textarea', label: 'Texte', defaultValue: 'J’aimerais mesurer la fréquentation du site, sans publicité ni revente. D’accord ?' },
      ],
    },
  ],
}
