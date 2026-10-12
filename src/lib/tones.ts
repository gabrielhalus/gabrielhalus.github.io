import type { Tone } from '@/fields/tone'

/** Classes complètes (Tailwind ne détecte pas les classes construites dynamiquement). */
export const toneClasses: Record<Tone, { bg: string; ink: string; inkBg: string; onInk: string }> = {
  blush: { bg: 'bg-blush', ink: 'text-blush-ink', inkBg: 'bg-blush-ink', onInk: 'text-blush' },
  mint: { bg: 'bg-mint', ink: 'text-mint-ink', inkBg: 'bg-mint-ink', onInk: 'text-mint' },
  lilac: { bg: 'bg-lilac', ink: 'text-lilac-ink', inkBg: 'bg-lilac-ink', onInk: 'text-lilac' },
  slate: { bg: 'bg-slate', ink: 'text-slate-ink', inkBg: 'bg-slate-ink', onInk: 'text-slate' },
}

export const tone = (value?: string | null) => toneClasses[(value as Tone) ?? 'blush'] ?? toneClasses.blush
