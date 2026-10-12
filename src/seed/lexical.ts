import { randomBytes } from 'crypto'

/** Petits constructeurs de nœuds Lexical pour écrire du contenu de démonstration. */

const base = { direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 }

type Inline = string | ReturnType<typeof text>

export const text = (value: string, bold = false) => ({ type: 'text', text: value, format: bold ? 1 : 0, detail: 0, mode: 'normal', style: '', version: 1 })
const inline = (children: Inline[]) => children.map((c) => (typeof c === 'string' ? text(c) : c))

export const p = (...children: Inline[]) => ({ ...base, type: 'paragraph', textFormat: 0, children: inline(children) })
export const h2 = (value: string) => ({ ...base, type: 'heading', tag: 'h2', children: [text(value)] })
export const h3 = (value: string) => ({ ...base, type: 'heading', tag: 'h3', children: [text(value)] })
export const quote = (value: string) => ({ ...base, type: 'quote', children: [text(value)] })

export const ul = (...items: Inline[][]) => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((item, i) => ({ ...base, type: 'listitem', value: i + 1, children: inline(item) })),
})

export const block = (blockType: string, fields: Record<string, unknown>) => ({
  type: 'block',
  format: '',
  version: 2,
  fields: { id: randomBytes(12).toString('hex'), blockName: '', blockType, ...fields },
})

export const table = (rows: string[][]) => ({
  ...base,
  type: 'table',
  colWidths: rows[0].map(() => 220),
  children: rows.map((row, r) => ({
    ...base,
    type: 'tablerow',
    children: row.map((cell, c) => ({
      ...base,
      type: 'tablecell',
      colSpan: 1,
      rowSpan: 1,
      backgroundColor: null,
      headerState: r === 0 ? 1 : c === 0 ? 2 : 0,
      children: [p(cell)],
    })),
  })),
})

export const root = (...children: object[]) => ({ root: { ...base, type: 'root', children } })
