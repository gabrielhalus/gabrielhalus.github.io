import {
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { guideBlocks } from '@/blocks'

/** Éditeur des guides et études de cas : H2/H3 (alimentent le sommaire), tableaux et blocs maison. */
export const longformEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((f) => f.key !== 'heading'),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
    EXPERIMENTAL_TableFeature(),
    BlocksFeature({ blocks: guideBlocks }),
    FixedToolbarFeature(),
  ],
})
