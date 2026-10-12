import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import { cursoSvg, type CursoEffect, type CursoExpression } from '@/components/Curso'
import type { Tone } from '@/fields/tone'

/**
 * Image de partage 1200×630, d'après la maquette « Image de partage (Open Graph) » :
 * bloc teinté (badges, titre, wordmark) + bloc encre avec Curso et le domaine.
 */

export const OG_SIZE = { width: 1200, height: 630 }

const TINTS: Record<Tone | 'accent', string> = {
  blush: '#ffddf6',
  mint: '#b3f3d4',
  lilac: '#c1b2fd',
  slate: '#dfe6ef',
  accent: '#dbf54c',
}

export type OgImageProps = {
  title: string
  badges?: (string | null | undefined)[]
  tint?: Tone | 'accent' | null
  domain?: string
  expression?: CursoExpression
  effect?: CursoEffect
}

const fontsDir = join(process.cwd(), 'src/og/fonts')
let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 800 | 400; style: 'normal' }[]> | undefined
const loadFonts = () =>
  (fonts ??= Promise.all([
    readFile(join(fontsDir, 'SchibstedGrotesk-Medium.ttf')).then((data) => ({ name: 'Schibsted', data, weight: 500 as const, style: 'normal' as const })),
    readFile(join(fontsDir, 'SchibstedGrotesk-ExtraBold.ttf')).then((data) => ({ name: 'Schibsted', data, weight: 800 as const, style: 'normal' as const })),
    readFile(join(fontsDir, 'JetBrainsMono-Regular.ttf')).then((data) => ({ name: 'JetBrains', data, weight: 400 as const, style: 'normal' as const })),
  ]))

/** Taille du titre selon sa longueur, pour qu'il tienne sur 4 lignes max. */
const titleSize = (title: string) => (title.length <= 56 ? 62 : title.length <= 84 ? 54 : title.length <= 110 ? 46 : 40)

export async function renderOgImage({ title, badges = [], tint, domain = 'gabrielhalus.com', expression = 'travail', effect = 'transparence' }: OgImageProps) {
  const [first, ...rest] = badges.filter((b): b is string => Boolean(b))

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', gap: 16, padding: 16, background: '#efefef', color: '#101010', fontFamily: 'Schibsted' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 52, borderRadius: 32, background: TINTS[tint ?? 'accent'] }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {first && <span style={{ padding: '10px 18px', borderRadius: 999, background: '#ffffff', fontSize: 20, fontWeight: 500 }}>{first}</span>}
            {rest.map((b) => (
              <span key={b} style={{ padding: '10px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.5)', fontSize: 20, fontWeight: 500 }}>
                {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', fontSize: titleSize(title), lineHeight: 0.98, fontWeight: 800, letterSpacing: '-0.05em' }}>{title}</div>
          <div style={{ display: 'flex', fontSize: 30, letterSpacing: '-0.05em' }}>
            <span style={{ fontWeight: 800 }}>gabriel</span>
            <span style={{ fontWeight: 500, color: '#2b2b2b' }}>halus</span>
          </div>
        </div>
        <div style={{ width: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 36, borderRadius: 32, background: '#101010' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {cursoSvg({ size: 290, tone: 'sombre', expression, effect, uid: 'og' })}
          </div>
          <span style={{ fontFamily: 'JetBrains', fontSize: 20, color: '#dbf54c' }}>{domain}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  )
}

/** Domaine affiché sous Curso, tiré de l'URL du site. */
export const domainOf = (siteUrl?: string | null) => {
  try {
    return new URL(siteUrl || 'https://gabrielhalus.com').hostname.replace(/^www\./, '')
  } catch {
    return 'gabrielhalus.com'
  }
}
