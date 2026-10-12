import { useId } from 'react'

import { cn } from '@/lib/utils'

/**
 * Curso, la créature de la marque (charte « Identité de marque — Curso »).
 * Seul l'œil change selon l'expression ; sous 36 px, l'antenne et la pupille
 * disparaissent et l'œil grossit pour rester lisible.
 */

export type CursoTone = 'clair' | 'sombre' | 'citron' | 'blush' | 'silhouette'
export type CursoExpression = 'travail' | 'curieux' | 'content' | 'veille' | 'surpris'
export type CursoEffect = 'aucun' | 'glitch' | 'transparence'

const TONES: Record<CursoTone, { body: string; eye: string; pupil: string; gBody: string; gEye: string; gPupil: string }> = {
  clair: { body: '#101010', eye: '#dbf54c', pupil: '#101010', gBody: '#dbf54c', gEye: '#101010', gPupil: '#dbf54c' },
  sombre: { body: '#ffffff', eye: '#101010', pupil: '#dbf54c', gBody: '#dbf54c', gEye: '#101010', gPupil: '#dbf54c' },
  citron: { body: '#101010', eye: '#ffffff', pupil: '#101010', gBody: '#ffffff', gEye: '#101010', gPupil: '#ffffff' },
  blush: { body: '#5a1140', eye: '#ffddf6', pupil: '#5a1140', gBody: '#ffddf6', gEye: '#5a1140', gPupil: '#ffddf6' },
  silhouette: { body: '#101010', eye: '#101010', pupil: '#101010', gBody: '#101010', gEye: '#101010', gPupil: '#101010' },
}

const BODY = 'M20 90C14 58 28 24 60 22s46 36 40 68c-2 12-12 14-20 8-6-4-10 4-20 4s-14-8-20-4c-8 6-18 4-20-8z'

const antenna = (color: string) => (
  <g>
    <path d="M64 23c0-8 4-13 11-14" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="77" cy="9" r="4.5" fill={color} />
  </g>
)

type Props = {
  size?: number
  tone?: CursoTone
  expression?: CursoExpression
  effect?: CursoEffect
  antenna?: boolean
  /** Flottement et clignement (coupés si l'utilisateur réduit les animations). */
  animated?: boolean
  /** Glitch bref au survol du parent `.group` (lien du logo). */
  glitchOnHover?: boolean
  /** Texte alternatif ; sans lui, le symbole est décoratif. */
  label?: string
  className?: string
}

/**
 * Rendu sans hook ni composant imbriqué, pour pouvoir aussi être dessiné
 * par le générateur d'images de partage (src/og).
 */
export const cursoSvg = ({
  size = 40,
  tone = 'clair',
  expression = 'travail',
  effect = 'aucun',
  antenna: withAntenna = true,
  animated = false,
  glitchOnHover = false,
  label,
  className,
  uid,
}: Props & { uid: string }) => {
  const c = TONES[tone]
  const small = size <= 36
  const trans = effect === 'transparence' && !small
  const glitch = effect === 'glitch'
  const showAntenna = withAntenna && !small
  const expr: CursoExpression = small ? 'travail' : expression
  // Glitch : cadre élargi pour ne pas couper la bande décalée de 9 unités
  const width = trans ? 114 : glitch ? 106 : 100
  const height = Math.round((size * 106) / width)
  const eye = small ? { x: 45, y: 40, s: 40, r: 9 } : { x: 50, y: 44, s: 30, r: 8 }

  const ids = { a: `${uid}a`, b: `${uid}b`, c: `${uid}c` }
  const glitchLayer = (
    <g>
      <defs>
        <clipPath id={ids.a}><rect x="-20" y="0" width="140" height="52" /></clipPath>
        <clipPath id={ids.b}><rect x="-20" y="52" width="140" height="18" /></clipPath>
        <clipPath id={ids.c}><rect x="-20" y="70" width="140" height="50" /></clipPath>
      </defs>
      <g clipPath={`url(#${ids.a})`}>
        <path d={BODY} fill={c.body} />
        {showAntenna && antenna(c.body)}
        <rect x="50" y="44" width="30" height="30" rx="8" fill={c.eye} />
      </g>
      <g clipPath={`url(#${ids.b})`}>
        <g transform="translate(9 0)">
          <path d={BODY} fill={c.gBody} />
          <rect x="50" y="44" width="30" height="30" rx="8" fill={c.gEye} />
          <rect x="66" y="60" width="10" height="10" rx="2.5" fill={c.gPupil} />
        </g>
      </g>
      <g clipPath={`url(#${ids.c})`}>
        <g transform="translate(-5 0)">
          <path d={BODY} fill={c.body} />
          <rect x="50" y="44" width="30" height="30" rx="8" fill={c.eye} />
        </g>
      </g>
    </g>
  )

  const normalLayer = (
    <g>
      <path d={BODY} fill={c.body} />
      {showAntenna && antenna(c.body)}
      <g className={animated ? 'curso-eye' : undefined}>
        {expr === 'travail' && (
          <g>
            <rect x={eye.x} y={eye.y} width={eye.s} height={eye.s} rx={eye.r} fill={c.eye} />
            {!small && <rect x="66" y="60" width="10" height="10" rx="2.5" fill={c.pupil} />}
          </g>
        )}
        {expr === 'curieux' && (
          <g>
            <rect x="50" y="44" width="30" height="30" rx="8" fill={c.eye} />
            <rect x="66" y="46" width="10" height="10" rx="2.5" fill={c.pupil} />
          </g>
        )}
        {expr === 'content' && <path d="M52 64q13-18 26 0" stroke={c.eye} strokeWidth="7" strokeLinecap="round" fill="none" />}
        {expr === 'veille' && (
          <g>
            <rect x="50" y="56" width="30" height="7" rx="3.5" fill={c.eye} />
            <path d="M90 32h7l-7 8h7M102 22h5l-5 6h5" stroke={c.body} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}
        {expr === 'surpris' && (
          <g>
            <rect x="45" y="39" width="40" height="40" rx="10" fill={c.eye} />
            <rect x="60" y="54" width="10" height="10" rx="2.5" fill={c.pupil} />
          </g>
        )}
      </g>
    </g>
  )

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={height}
      viewBox={trans ? '-4 2 114 106' : glitch ? '10 2 106 106' : '10 2 100 106'}
      className={cn('shrink-0', className)}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <g className={animated ? 'curso-float' : undefined}>
        {trans &&
          [
            { dx: -12, dy: 3, o: 0.1 },
            { dx: -6, dy: 1.5, o: 0.22 },
          ].map((echo) => (
            <g key={echo.dx} transform={`translate(${echo.dx} ${echo.dy})`} opacity={echo.o}>
              <path d={BODY} fill={c.body} />
              {showAntenna && antenna(c.body)}
            </g>
          ))}
        {glitch ? (
          glitchLayer
        ) : glitchOnHover ? (
          <g>
            <g className="curso-normal">{normalLayer}</g>
            <g className="curso-glitch">{glitchLayer}</g>
          </g>
        ) : (
          normalLayer
        )}
      </g>
    </svg>
  )
}

export const Curso = (props: Props) => cursoSvg({ ...props, uid: useId().replace(/:/g, '') })
