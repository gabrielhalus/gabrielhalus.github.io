import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

const notify: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  const to = process.env.CONTACT_NOTIFICATION_EMAIL
  try {
    if (to) {
      await req.payload.sendEmail({
        to,
        replyTo: doc.email,
        subject: `Nouveau message — ${doc.name}`,
        text: [
          `Type : ${doc.requestType}`,
          `Nom : ${doc.name}`,
          `E-mail : ${doc.email}`,
          doc.company && `Entreprise : ${doc.company}`,
          doc.phone && `Téléphone : ${doc.phone}`,
          doc.budget && `Budget : ${doc.budget}`,
          '',
          doc.message,
        ]
          .filter((l) => l !== undefined && l !== null && l !== false)
          .join('\n'),
      })
    }
    await req.payload.sendEmail({
      to: doc.email,
      subject: 'Votre message a bien été reçu',
      text: `Bonjour ${doc.name},\n\nMerci pour votre message, je reviens vers vous très vite.\n\nPour rappel :\n\n${doc.message}\n\nGabriel Halus`,
    })
  } catch (err) {
    req.payload.logger.error({ err, msg: 'Envoi des e-mails de contact impossible' })
  }
  return doc
}

/** Messages reçus via le formulaire de contact. Créés uniquement par l’action serveur du site. */
export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  labels: { singular: 'Demande de contact', plural: 'Demandes de contact' },
  admin: {
    group: 'Administration',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'requestType', 'createdAt', 'handled'],
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: { afterChange: [notify] },
  fields: [
    {
      name: 'requestType',
      type: 'select',
      label: 'Besoin',
      required: true,
      options: [
        { label: 'Projet sur mesure', value: 'custom' },
        { label: 'Offre métier', value: 'offer' },
        { label: 'Autre question', value: 'other' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Nom et prénom', required: true },
        { name: 'email', type: 'email', label: 'E-mail', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'company', type: 'text', label: 'Entreprise' },
        { name: 'phone', type: 'text', label: 'Téléphone' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'offer', type: 'text', label: 'Offre choisie' },
        { name: 'budget', type: 'text', label: 'Budget' },
      ],
    },
    { name: 'message', type: 'textarea', label: 'Message', required: true },
    { name: 'consent', type: 'checkbox', label: 'Consentement RGPD', required: true },
    { name: 'handled', type: 'checkbox', label: 'Traité', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
