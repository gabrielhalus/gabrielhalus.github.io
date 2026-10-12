import type { Media } from '@/payload-types'

import { isMedia } from './utils'

/**
 * Image de partage : celle choisie dans l'onglet SEO si elle existe,
 * sinon l'image générée (src/app/og). `v` change à chaque modification du
 * document pour que les réseaux sociaux ne gardent pas une ancienne version.
 */
export const ogImages = (metaImage: number | Media | null | undefined, generatedPath: string, updatedAt?: string | null) => {
  if (isMedia(metaImage)) {
    const url = metaImage.sizes?.og?.url ?? metaImage.url
    if (url) return [{ url, alt: metaImage.alt ?? undefined }]
  }
  const v = updatedAt ? `?v=${Date.parse(updatedAt)}` : ''
  return [{ url: `${generatedPath}${v}`, width: 1200, height: 630 }]
}
