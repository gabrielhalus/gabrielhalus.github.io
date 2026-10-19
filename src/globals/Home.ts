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
              type: 'collapsible',
              label: 'Bloc Curso (à droite)',
              admin: { description: 'Le portrait de la pastille vient de Réglages du site › Identité.' },
              fields: [
                { name: 'tagline', type: 'text', label: 'Pastille en haut à droite', defaultValue: 'Un seul interlocuteur, du début à la fin' },
                { name: 'tasksTitle', type: 'text', label: 'Titre de la liste', defaultValue: 'Cette nuit, Curso s’est occupé de :' },
                {
                  name: 'tasks',
                  type: 'array',
                  label: 'Tâches',
                  maxRows: 4,
                  labels: { singular: 'Tâche', plural: 'Tâches' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'icon',
                          type: 'select',
                          label: 'Icône',
                          defaultValue: 'document',
                          options: [
                            { label: 'Document', value: 'document' },
                            { label: 'Cloche', value: 'bell' },
                            { label: 'Calendrier', value: 'calendar' },
                          ],
                        },
                        { name: 'title', type: 'text', label: 'Titre', required: true },
                        { name: 'detail', type: 'text', label: 'Détail' },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        { name: 'badge', type: 'text', label: 'Étiquette', admin: { description: 'Ex. « Envoyé », « J−7 ».' } },
                        {
                          name: 'badgeTone',
                          type: 'select',
                          label: 'Style de l’étiquette',
                          defaultValue: 'done',
                          options: [
                            { label: 'Fait (vert, avec coche)', value: 'done' },
                            { label: 'À venir (bleu-gris)', value: 'pending' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
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
            { name: 'subtitle', type: 'text', label: 'Sous-titre', defaultValue: 'Artisans, traiteurs, PME et indépendants' },
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
