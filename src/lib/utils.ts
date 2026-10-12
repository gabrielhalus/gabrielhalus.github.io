import type { Media } from '@/payload-types'

export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

export const offerPath = (slug?: string | null) => `/${slug ?? ''}`

export const isMedia = (value: unknown): value is Media =>
  typeof value === 'object' && value !== null && 'url' in value

export const formatDate = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(iso)) : null

export const formatShortDate = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('fr-FR').format(new Date(iso)) : '[JJ/MM/AAAA]'

export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Formate une durée en minutes au format « 2 h 30 ». */
export const formatMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return `${h} h ${String(m).padStart(2, '0')}`
}
