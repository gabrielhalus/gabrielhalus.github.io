import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { ContactRequests } from './collections/ContactRequests'
import { Guides } from './collections/Guides'
import { Media } from './collections/Media'
import { Offers } from './collections/Offers'
import { Projects } from './collections/Projects'
import { QrCodes } from './collections/QrCodes'
import { QrScans } from './collections/QrScans'
import { Users } from './collections/Users'
import { ContactPage } from './globals/ContactPage'
import { Cookies } from './globals/Cookies'
import { Home } from './globals/Home'
import { Legal } from './globals/Legal'
import { Settings } from './globals/Settings'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: { titleSuffix: ' — gabrielhalus.com' },
  },
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: 'fr',
  },
  collections: [Projects, Offers, Guides, Media, ContactRequests, QrCodes, QrScans, Users],
  globals: [Settings, Home, ContactPage, Legal, Cookies],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // En production, les migrations de src/migrations s'appliquent au démarrage
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['projects', 'offers', 'guides'],
      uploadsCollection: 'media',
      tabbedUI: false,
      generateTitle: ({ doc }) => `${doc?.title ?? doc?.name ?? ''} — Gabriel Halus`,
      generateDescription: ({ doc }) => doc?.lead ?? doc?.summary ?? doc?.hero?.lead ?? '',
    }),
  ],
})
