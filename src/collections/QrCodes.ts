import type { CollectionConfig } from 'payload'

const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789'
const randomCode = () => Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('')

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/** QR codes imprimés (cartes de visite, flyers…) : /q/[code] enregistre le scan puis redirige. */
export const QrCodes: CollectionConfig = {
  slug: 'qr-codes',
  labels: { singular: 'QR code', plural: 'QR codes' },
  admin: {
    group: 'Suivi',
    useAsTitle: 'label',
    defaultColumns: ['label', 'code', 'destination', 'scans', 'lastScanAt', 'active'],
    description: 'Chaque QR code pointe vers https://votre-site/q/{code}. La destination peut changer sans réimprimer.',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'label', type: 'text', label: 'Libellé', required: true, admin: { description: 'Ex. « Cartes de visite 2026 ».' } },
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'Code',
          required: true,
          unique: true,
          index: true,
          defaultValue: randomCode,
          validate: (value: string | null | undefined) => (value && /^[a-z0-9-]+$/.test(value)) || 'Minuscules, chiffres et tirets uniquement.',
          admin: { description: 'Partie après /q/ ; ne plus la changer une fois imprimée.' },
        },
        {
          name: 'destination',
          type: 'text',
          label: 'Destination',
          required: true,
          defaultValue: '/',
          validate: (value: string | null | undefined) =>
            (value && (value.startsWith('/') || /^https?:\/\//.test(value))) || 'Un chemin du site (/contact) ou une adresse complète.',
        },
      ],
    },
    { name: 'active', type: 'checkbox', label: 'Actif', defaultValue: true, admin: { position: 'sidebar', description: 'Inactif : redirige vers l’accueil sans compter.' } },
    { name: 'scans', type: 'number', label: 'Scans', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
    { name: 'lastScanAt', type: 'date', label: 'Dernier scan', admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    {
      name: 'history',
      type: 'join',
      label: 'Historique des scans',
      collection: 'qr-scans',
      on: 'qrCode',
      defaultSort: '-createdAt',
      defaultLimit: 20,
      admin: { defaultColumns: ['createdAt', 'device'] },
    },
  ],
}
