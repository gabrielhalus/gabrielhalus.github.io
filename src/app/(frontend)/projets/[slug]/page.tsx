import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PROJECT_TYPES } from '@/collections/Projects'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Block, ButtonLink, Eyebrow, Tag } from '@/components/ui'
import { getPayloadClient } from '@/lib/payload'
import { tone } from '@/lib/tones'
import { ogImages } from '@/lib/og'
import { cn } from '@/lib/utils'
import type { Project } from '@/payload-types'

type Params = { params: Promise<{ slug: string }> }

const getProject = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  return docs[0] as Project | undefined
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProject((await params).slug)
  if (!project) return {}
  return {
    title: project.meta?.title ?? project.title,
    description: project.meta?.description ?? project.summary ?? undefined,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: { images: ogImages(project.meta?.image, `/og/projects/${project.slug}`, project.updatedAt) },
  }
}

export default async function ProjectPage({ params }: Params) {
  const project = await getProject((await params).slug)
  if (!project) notFound()
  const t = tone(project.tone)
  const type = PROJECT_TYPES.find((p) => p.value === project.projectType)?.label

  return (
    <>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))] gap-3">
        <div className="pad-block flex flex-col justify-between gap-10 rounded-block bg-white">
          <nav aria-label="Fil d’Ariane" className="text-sm">
            <Link href="/#projets" className="text-muted no-underline hover:text-ink">← Tous les projets</Link>
          </nav>
          <div className="flex flex-col gap-5">
            <Eyebrow>// Étude de cas · {project.year}</Eyebrow>
            <h1 className="m-0 text-[clamp(42px,5.4vw,80px)] leading-[0.95] font-extrabold tracking-[-0.05em] text-balance">{project.title}</h1>
            {project.summary && <p className="m-0 max-w-[560px] text-[19px] leading-normal text-body">{project.summary}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {type && <Tag>{type}</Tag>}
            {project.sector && <Tag accent>{project.sector}</Tag>}
            {project.stack?.map((s) => (
              <Tag key={s} mono>
                {s}
              </Tag>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className={cn('relative flex min-h-[320px] flex-1 items-center justify-center overflow-hidden rounded-block font-mono text-xs', t.bg, t.ink)}>
            {project.cover ? <Media resource={project.cover} priority size="large" sizes="(min-width: 1024px) 50vw, 100vw" /> : `[Capture ${project.title}]`}
          </div>
          {project.result && (
            <div className="flex flex-col gap-1 rounded-block bg-accent p-8">
              <span className="text-[15px] font-medium">Résultat</span>
              <span className="text-[clamp(28px,3vw,40px)] leading-[1.05] font-extrabold tracking-[-0.04em]">{project.result}</span>
              {project.client && <span className="text-sm">{project.client}</span>}
            </div>
          )}
        </div>
      </section>

      {project.content && (
        <Block className="flex justify-center px-[clamp(20px,5vw,96px)] py-[clamp(24px,5vw,80px)]">
          <RichText data={project.content} className="w-full max-w-[760px]" />
        </Block>
      )}

      <Block variant="dark" className="flex flex-wrap items-center justify-between gap-7 p-[clamp(32px,5vw,64px)]">
        <h2 className="m-0 max-w-[720px] text-[clamp(30px,3.6vw,48px)] leading-none font-bold tracking-[-0.04em] text-balance">Un besoin comparable&nbsp;? Parlons-en.</h2>
        <ButtonLink href="/contact" variant="accent" size="xl" arrow>
          Réserver un appel
        </ButtonLink>
      </Block>
    </>
  )
}
