import Image from 'next/image'

import type { Media as MediaType } from '@/payload-types'
import { cn, isMedia } from '@/lib/utils'

type Props = {
  resource?: number | MediaType | null
  className?: string
  sizes?: string
  priority?: boolean
  size?: 'card' | 'large'
}

/** Image d'un document Media, en mode « cover » dans un conteneur positionné. */
export const Media = ({ resource, className, sizes = '100vw', priority, size }: Props) => {
  if (!isMedia(resource) || !resource.url) return null
  const variant = size ? resource.sizes?.[size] : undefined
  const src = variant?.url ?? resource.url
  const focal = resource.focalX != null && resource.focalY != null ? `${resource.focalX}% ${resource.focalY}%` : undefined

  return (
    <Image
      src={src}
      alt={resource.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', className)}
      style={focal ? { objectPosition: focal } : undefined}
    />
  )
}
