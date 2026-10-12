import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const getPayloadClient = cache(() => getPayload({ config }))

export const getSettings = cache(async () => (await getPayloadClient()).findGlobal({ slug: 'settings', depth: 1 }))

/** Offres métier publiées (en ligne + « bientôt »), triées. */
export const getOffers = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'offers',
    where: { _status: { equals: 'published' } },
    sort: 'order',
    depth: 0,
    limit: 50,
    select: { name: true, slug: true, status: true, tone: true, promise: true, cardText: true, bookingUrl: true },
  })
  return docs
})
