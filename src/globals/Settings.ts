import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Réglages du site',
  admin: { group: 'Pages & réglages' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identité',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'siteName', type: 'text', label: 'Nom du site', defaultValue: 'Gabriel Halus' },
                { name: 'siteUrl', type: 'text', label: 'URL publique', defaultValue: 'https://gabrielhalus.com' },
              ],
            },
            { name: 'defaultDescription', type: 'textarea', label: 'Description SEO par défaut' },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Image de partage par défaut' },
            {
              type: 'row',
              fields: [
                { name: 'role', type: 'text', label: 'Métier', defaultValue: 'Développeur' },
                { name: 'city', type: 'text', label: 'Ville' },
              ],
            },
            { name: 'portrait', type: 'upload', relationTo: 'media', label: 'Portrait' },
            { name: 'authorBio', type: 'textarea', label: 'Bio courte (auteur des guides)' },
            {
              name: 'availability',
              type: 'group',
              label: 'Disponibilité',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'show', type: 'checkbox', label: 'Afficher la pastille', defaultValue: true },
                    { name: 'text', type: 'text', label: 'Texte', defaultValue: 'Disponible à partir de [mois]' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', label: 'E-mail', defaultValue: 'contact@gabrielhalus.com' },
                { name: 'phone', type: 'text', label: 'Téléphone' },
              ],
            },
            { name: 'bookingUrl', type: 'text', label: 'Lien de prise de rendez-vous', defaultValue: 'https://cal.com/' },
            { name: 'responseTime', type: 'text', label: 'Délai de réponse', defaultValue: 'sous 48 h ouvrées' },
            {
              name: 'socials',
              type: 'array',
              label: 'Réseaux',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', label: 'Libellé', required: true },
                    { name: 'url', type: 'text', label: 'URL', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Entreprise',
          description: 'Utilisé dans le pied de page et les mentions légales.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'legalName', type: 'text', label: 'Dénomination', defaultValue: 'Gabriel Halus, entrepreneur individuel (EI)' },
                { name: 'siret', type: 'text', label: 'SIRET', defaultValue: '[000 000 000 00000]' },
              ],
            },
            { name: 'address', type: 'textarea', label: 'Adresse postale' },
            { name: 'registration', type: 'text', label: 'Immatriculation', defaultValue: 'Registre national des entreprises' },
            { name: 'vatMention', type: 'text', label: 'Mention TVA', defaultValue: 'TVA non applicable, art. 293 B du CGI' },
          ],
        },
        {
          label: 'Pied de page',
          fields: [
            {
              name: 'footerCta',
              type: 'text',
              label: 'Accroche',
              defaultValue: 'Un projet, ou un process qui vous coûte des heures chaque semaine ?',
            },
            { name: 'footerCtaLabel', type: 'text', label: 'Libellé du bouton', defaultValue: 'Parlons-en' },
            { name: 'footerWordmark', type: 'text', label: 'Grand mot-marque', defaultValue: 'gabrielhalus' },
          ],
        },
      ],
    },
  ],
}
