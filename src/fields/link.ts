import type { GroupField } from 'payload'

/** Lien simple : libellé + URL (interne « /contact », ancre « /#projets » ou externe). */
export const linkGroup = (name: string, label: string, defaults?: { label?: string; url?: string }): GroupField => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', label: 'Libellé', defaultValue: defaults?.label },
        { name: 'url', type: 'text', label: 'URL', defaultValue: defaults?.url },
      ],
    },
  ],
})
