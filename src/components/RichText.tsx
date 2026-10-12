import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { type JSXConvertersFunction, RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

import { nodeText } from '@/lib/lexical'
import { cn, slugify } from '@/lib/utils'

import { Check } from './icons'
import { Media } from './Media'
import { ButtonLink } from './ui'

/* eslint-disable @typescript-eslint/no-explicit-any */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  // Ancres sur les H2/H3 pour le sommaire
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag as 'h2' | 'h3'
    return <Tag id={slugify(nodeText(node as any))}>{nodesToJSX({ nodes: node.children })}</Tag>
  },
  blocks: {
    callout: ({ node }: any) => (
      <aside className="flex gap-4 rounded-2xl border border-line bg-surface-2 px-[22px] py-5 text-base leading-relaxed">
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[15px] font-medium text-accent">
          i
        </span>
        <span>
          {node.fields.title && <strong>{node.fields.title} </strong>}
          {node.fields.text}
        </span>
      </aside>
    ),
    offerCta: ({ node }: any) => (
      <aside className="flex flex-wrap items-center justify-between gap-5 rounded-panel bg-ink p-7 text-white">
        <div className="flex flex-[1_1_280px] flex-col gap-1.5">
          {node.fields.eyebrow && <span className="eyebrow text-subtle">{node.fields.eyebrow}</span>}
          <span className="text-[22px] leading-[1.2] font-semibold tracking-[-0.02em] text-white">{node.fields.text}</span>
        </div>
        <ButtonLink href={node.fields.url} variant="accent" arrow className="no-underline">
          {node.fields.label}
        </ButtonLink>
      </aside>
    ),
    steps: ({ node }: any) => (
      <ol className="!list-none !gap-3 !p-0">
        {node.fields.items?.map((item: any, i: number) => (
          <li key={item.id ?? i} className="flex items-start gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-sm font-medium text-ink">{i + 1}</span>
            <span>
              <strong>{item.title}</strong> {item.text}
            </span>
          </li>
        ))}
      </ol>
    ),
    checklist: ({ node }: any) => (
      <ul className="!list-none !gap-2.5 !p-0">
        {node.fields.items?.map((item: any, i: number) => (
          <li key={item.id ?? i} className="flex gap-3">
            <Check size={20} className="mt-[5px] shrink-0 text-ink" />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    ),
    figure: ({ node }: any) => (
      <figure className="flex flex-col gap-2.5">
        <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-tile bg-accent-soft p-6 text-center font-mono text-[13px] text-ink-soft">
          {node.fields.image ? <Media resource={node.fields.image} size="large" sizes="(min-width: 1024px) 760px, 100vw" /> : `[${node.fields.placeholder ?? 'Illustration'}]`}
        </div>
        {node.fields.caption && <figcaption className="text-sm text-muted">{node.fields.caption}</figcaption>}
      </figure>
    ),
  },
  upload: ({ node }: any) => (
    <figure className="relative h-80 overflow-hidden rounded-tile">
      <Media resource={node.value} size="large" sizes="(min-width: 1024px) 760px, 100vw" />
    </figure>
  ),
  link: ({ node, nodesToJSX }: any) => {
    const href = node.fields.linkType === 'internal' ? `/${node.fields.doc?.value?.slug ?? ''}` : node.fields.url
    const external = node.fields.newTab
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {nodesToJSX({ nodes: node.children })}
      </a>
    ) : (
      <Link href={href}>{nodesToJSX({ nodes: node.children })}</Link>
    )
  },
})

export const RichText = ({ data, className }: { data?: SerializedEditorState | null; className?: string }) =>
  data ? <LexicalRichText data={data} converters={converters} className={cn('prose-gh', className)} /> : null
