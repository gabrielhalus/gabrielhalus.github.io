import type { Metadata } from 'next'

import { Curso } from '@/components/Curso'
import { GuideCard } from '@/components/GuideCard'
import { Block, Eyebrow } from '@/components/ui'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Guides pratiques pour gagner du temps sur la gestion quotidienne de votre activité.',
  alternates: { canonical: '/guides' },
}

export default async function GuidesPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'guides', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 100, depth: 1 })

  return (
    <>
      <Block className="pad-block flex flex-col gap-3.5">
        <Eyebrow>// Guides</Eyebrow>
        <h1 className="m-0 text-[clamp(42px,5.4vw,80px)] leading-[0.95] font-extrabold tracking-[-0.05em]">Guides pratiques</h1>
        <p className="m-0 max-w-[560px] text-lg leading-normal text-body">Des méthodes concrètes pour retirer le travail répétitif de votre semaine.</p>
      </Block>
      <Block className="p-[clamp(20px,3vw,40px)]">
        {docs.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-3">
            {docs.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Curso size={80} expression="veille" />
            <p className="m-0 text-[22px] leading-[1.2] font-semibold tracking-[-0.02em]">Pas encore de guide publié. Curso fait la sieste.</p>
          </div>
        )}
      </Block>
    </>
  )
}
