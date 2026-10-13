import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cookies" ALTER COLUMN "title" SET DEFAULT 'Pas de cookie, rien à accepter.';
  ALTER TABLE "cookies" ALTER COLUMN "banner_text" SET DEFAULT 'Certains contenus de ce site déposent des cookies, sans publicité ni revente. D’accord ?';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cookies" ALTER COLUMN "title" SET DEFAULT 'Le strict minimum, et c’est vous qui choisissez.';
  ALTER TABLE "cookies" ALTER COLUMN "banner_text" SET DEFAULT 'J’aimerais mesurer la fréquentation du site, sans publicité ni revente. D’accord ?';`)
}
