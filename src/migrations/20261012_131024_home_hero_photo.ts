import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_hero_terminal" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_hero_terminal" CASCADE;
  ALTER TABLE "home" ADD COLUMN "hero_photo_id" integer;
  ALTER TABLE "home" ADD COLUMN "hero_photo_placeholder" varchar DEFAULT '[Photo : Gabriel avec un client, dans son atelier ou en cuisine — lumière naturelle, cadrage serré]';
  ALTER TABLE "home" ADD COLUMN "hero_tagline" varchar DEFAULT 'Un seul interlocuteur, du début à la fin';
  ALTER TABLE "home" ADD COLUMN "hero_benefits_title" varchar DEFAULT 'Ce que vous y gagnez';
  ALTER TABLE "home" ADD COLUMN "hero_curso_says" varchar DEFAULT 'Pendant que vous dormez, Curso s’occupe des relances.';
  ALTER TABLE "home" ADD COLUMN "clients_subtitle" varchar DEFAULT 'Artisans, traiteurs, PME et indépendants';
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_photo_id_media_id_fk" FOREIGN KEY ("hero_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_hero_hero_photo_idx" ON "home" USING btree ("hero_photo_id");
  ALTER TABLE "home" DROP COLUMN "hero_terminal_path";
  ALTER TABLE "home" DROP COLUMN "hero_terminal_done";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_hero_terminal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"status" varchar
  );
  
  ALTER TABLE "home" DROP CONSTRAINT "home_hero_photo_id_media_id_fk";
  
  DROP INDEX "home_hero_hero_photo_idx";
  ALTER TABLE "home" ADD COLUMN "hero_terminal_path" varchar DEFAULT '~/projets/client';
  ALTER TABLE "home" ADD COLUMN "hero_terminal_done" varchar DEFAULT 'déployé — prêt pour vos utilisateurs';
  ALTER TABLE "home_hero_terminal" ADD CONSTRAINT "home_hero_terminal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_hero_terminal_order_idx" ON "home_hero_terminal" USING btree ("_order");
  CREATE INDEX "home_hero_terminal_parent_id_idx" ON "home_hero_terminal" USING btree ("_parent_id");
  ALTER TABLE "home" DROP COLUMN "hero_photo_id";
  ALTER TABLE "home" DROP COLUMN "hero_photo_placeholder";
  ALTER TABLE "home" DROP COLUMN "hero_tagline";
  ALTER TABLE "home" DROP COLUMN "hero_benefits_title";
  ALTER TABLE "home" DROP COLUMN "hero_curso_says";
  ALTER TABLE "home" DROP COLUMN "clients_subtitle";`)
}
