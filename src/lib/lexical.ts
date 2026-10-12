import type { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

import { slugify } from './utils'

type Node = SerializedLexicalNode & { children?: Node[]; text?: string; tag?: string; fields?: unknown }

const valuesText = (value: unknown): string =>
  typeof value === 'string' ? value : Array.isArray(value) || (value && typeof value === 'object') ? Object.entries(value as object).filter(([k]) => k !== 'id' && k !== 'blockType').map(([, v]) => valuesText(v)).join(' ') : ''

export const nodeText = (node: Node): string =>
  node.text ?? (node.fields ? valuesText(node.fields) : (node.children ?? []).map(nodeText).join(' '))

/** Titres H2 du contenu, pour le sommaire. Les ids correspondent à ceux du rendu. */
export const extractHeadings = (data?: SerializedEditorState | null) =>
  ((data?.root?.children ?? []) as Node[])
    .filter((n) => n.type === 'heading' && n.tag === 'h2')
    .map((n) => {
      const label = nodeText(n)
      return { id: slugify(label), label }
    })

export const readingTime = (data?: SerializedEditorState | null, extra = '') => {
  const words = `${((data?.root?.children ?? []) as Node[]).map(nodeText).join(' ')} ${extra}`
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
