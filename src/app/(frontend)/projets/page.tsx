import type { Metadata } from 'next'

import { ProjectCard } from '@/components/ProjectCard'
import { Block, ButtonLink } from '@/components/ui'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Réalisations web et automatisations',
  description:
    'Des projets concrets pour des besoins différents : une gestion trop manuelle, un outil difficile à maintenir ou une fonctionnalité manquante. Découvrez les solutions mises en place.',
  alternates: { canonical: '/projets' },
}

export default async function ProjectsPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'projects', where: { _status: { equals: 'published' } }, sort: 'order', limit: 100, depth: 1 })

  return (
    <>
      <Block className="pad-block flex flex-col gap-3.5">
        <h1 className="m-0 max-w-[900px] text-[clamp(42px,5.4vw,80px)] leading-[0.95] font-extrabold tracking-[-0.05em] text-balance">Des projets concrets, des besoins différents.</h1>
        <p className="m-0 max-w-[620px] text-lg leading-normal text-body">
          Chaque projet commence par un problème à résoudre : une gestion trop manuelle, un outil difficile à maintenir ou une fonctionnalité manquante. Découvrez quelques réalisations, les solutions mises en place et les résultats obtenus.
        </p>
      </Block>
      <Block className="p-[clamp(20px,3vw,40px)]">
        {docs.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-3">
            {docs.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="m-0 text-muted">Les premiers projets arrivent bientôt.</p>
        )}
      </Block>
      <Block variant="dark" className="flex flex-wrap items-center justify-between gap-7 p-[clamp(32px,5vw,64px)]">
        <h2 className="m-0 max-w-[720px] text-[clamp(30px,3.6vw,48px)] leading-none font-bold tracking-[-0.04em] text-balance">Vous avez un besoin comparable&nbsp;?</h2>
        <ButtonLink href="/contact" variant="accent" size="xl" arrow>
          Parler de mon projet
        </ButtonLink>
      </Block>
    </>
  )
}
