import type { CollectionConfig } from 'payload'

/** Un scan de QR code. Anonyme : ni IP ni cookie, seulement la date et le type d'appareil. */
export const QrScans: CollectionConfig = {
  slug: 'qr-scans',
  labels: { singular: 'Scan', plural: 'Scans' },
  admin: {
    group: 'Suivi',
    defaultColumns: ['qrCode', 'device', 'createdAt'],
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'qrCode', type: 'relationship', relationTo: 'qr-codes', label: 'QR code', required: true, index: true },
    {
      name: 'device',
      type: 'select',
      label: 'Appareil',
      options: [
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablette', value: 'tablet' },
        { label: 'Ordinateur', value: 'desktop' },
      ],
    },
  ],
}
