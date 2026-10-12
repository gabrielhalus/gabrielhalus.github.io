import type { SelectField } from 'payload'

export const TONES = ['blush', 'mint', 'lilac', 'slate'] as const
export type Tone = (typeof TONES)[number]

export const toneField = (overrides: Partial<SelectField> = {}): SelectField =>
  ({
    name: 'tone',
    type: 'select',
    label: 'Ton métier',
    defaultValue: 'blush',
    options: [
      { label: 'Blush (rose)', value: 'blush' },
      { label: 'Menthe', value: 'mint' },
      { label: 'Lilas', value: 'lilac' },
      { label: 'Ardoise', value: 'slate' },
    ],
    admin: { description: 'Couleur pastel utilisée pour les aplats et visuels de substitution.' },
    ...overrides,
  }) as SelectField
