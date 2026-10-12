import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Accueil',
  admin: { group: 'Pages & réglages' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Héros',
          name: 'hero',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Je développe les outils qui font tourner' },
                { name: 'highlight', type: 'text', label: 'Fin du titre surlignée', defaultValue: 'votre activité.' },
              ],
            },
            { name: 'lead', type: 'textarea', label: 'Chapô' },
            {
              type: 'row',
              fields: [
                { name: 'primaryLabel', type: 'text', label: 'CTA principal', defaultValue: 'Réserver un appel' },
                { name: 'secondaryLabel', type: 'text', label: 'CTA secondaire', defaultValue: 'Voir les projets' },
              ],
            },
            {
              name: 'terminal',
              type: 'array',
              label: 'Lignes du terminal',
              admin: { description: 'Une ligne par étape ; « Statut » s’affiche en citron à droite.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'text', type: 'text', label: 'Texte', required: true },
                    { name: 'status', type: 'text', label: 'Statut' },
                  ],
                },
              ],
            },
            { name: 'terminalPath', type: 'text', label: 'Chemin affiché', defaultValue: '~/projets/client' },
            { name: 'terminalDone', type: 'text', label: 'Ligne finale', defaultValue: 'déployé — prêt pour vos utilisateurs' },
            { name: 'chips', type: 'text', hasMany: true, label: 'Pastilles (savoir-faire)' },
            {
              name: 'featuredOffer',
              type: 'relationship',
              relationTo: 'offers',
              label: 'Offre mise en avant',
            },
          ],
        },
        {
          label: 'Clients',
          name: 'clients',
          description: 'Bandeau défilant sous le héros. Masqué tant qu’aucun client n’est saisi.',
          fields: [
            { name: 'title', type: 'text', label: 'Intitulé', defaultValue: 'Ils me font confiance' },
            {
              name: 'items',
              type: 'array',
              label: 'Clients',
              maxRows: 8,
              labels: { singular: 'Client', plural: 'Clients' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'name', type: 'text', label: 'Nom', required: true },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo (facultatif)',
                  admin: { description: 'SVG ou PNG transparent, monochrome de préférence. Sans logo, le nom s’affiche.' },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  label: 'Mettre en avant',
                  defaultValue: true,
                  admin: { description: 'Décoché : affiché plus petit et en gris, une seule fois par tour de bandeau.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Services',
          name: 'services',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Du code qui travaille' },
            { name: 'titleMuted', type: 'text', label: 'Fin du titre (grisée)', defaultValue: 'à votre place.' },
            { name: 'intro', type: 'textarea', label: 'Introduction' },
            {
              name: 'items',
              type: 'array',
              label: 'Services',
              maxRows: 4,
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
                        { label: 'Encre', value: 'dark' },
                      ],
                    },
                    { name: 'glyph', type: 'text', label: 'Glyphe décoratif' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Projets',
          name: 'projects',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Projets récents' },
            { name: 'intro', type: 'textarea', label: 'Introduction' },
          ],
        },
        {
          label: 'Méthode',
          name: 'method',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Un prix fixe, des démos régulières,' },
            { name: 'highlight', type: 'text', label: 'Fin du titre (citron)', defaultValue: 'aucune surprise.' },
            {
              name: 'steps',
              type: 'array',
              label: 'Étapes',
              fields: [
                { name: 'title', type: 'text', label: 'Titre', required: true },
                { name: 'text', type: 'textarea', label: 'Texte' },
              ],
            },
          ],
        },
        {
          label: 'Offres métier',
          name: 'offers',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Votre métier a déjà son offre clé en main.' },
            { name: 'intro', type: 'textarea', label: 'Introduction' },
            { name: 'tags', type: 'text', hasMany: true, label: 'Pastilles' },
          ],
        },
        {
          label: 'Outils',
          name: 'tools',
          fields: [
            { name: 'title', type: 'text', label: 'Libellé', defaultValue: 'Outils du quotidien' },
            { name: 'items', type: 'text', hasMany: true, label: 'Outils' },
          ],
        },
      ],
    },
  ],
}
