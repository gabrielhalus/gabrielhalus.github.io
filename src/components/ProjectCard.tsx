import Link from 'next/link'

import type { Project } from '@/payload-types'
import { tone } from '@/lib/tones'

import { Media } from './Media'

export const ProjectCard = ({ project }: { project: Project }) => {
  const t = tone(project.tone)
  return (
    <Link
      href={`/projets/${project.slug}`}
      className="group flex flex-col gap-3 rounded-tile border border-line bg-surface-2 p-2 text-ink no-underline transition-colors hover:border-line-strong"
    >
      <div className={`relative flex h-[220px] items-center justify-center overflow-hidden rounded-card font-mono text-xs ${t.bg} ${t.ink}`}>
        {project.cover ? <Media resource={project.cover} size="card" sizes="(min-width: 1024px) 33vw, 100vw" /> : `[Capture ${project.title}]`}
      </div>
      <div className="flex flex-col gap-1 px-2 pt-1 pb-2">
        <span className="text-base font-semibold">{project.result ?? project.title}</span>
        <span className="text-[13px] text-muted">{[project.client, project.sector].filter(Boolean).join(' · ')}</span>
      </div>
    </Link>
  )
}
