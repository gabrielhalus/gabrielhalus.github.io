import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_hero_tasks_icon" AS ENUM('document', 'bell', 'calendar');
  CREATE TYPE "public"."enum_home_hero_tasks_badge_tone" AS ENUM('done', 'pending');
  CREATE TABLE "home_hero_tasks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_hero_tasks_icon" DEFAULT 'document',
  	"title" varchar NOT NULL,
  	"detail" varchar,
  	"badge" varchar,
  	"badge_tone" "enum_home_hero_tasks_badge_tone" DEFAULT 'done'
  );
  
  ALTER TABLE "home" DROP CONSTRAINT "home_hero_photo_id_media_id_fk";
  
  DROP INDEX "home_hero_hero_photo_idx";
  ALTER TABLE "home" ADD COLUMN "hero_tasks_title" varchar DEFAULT 'Cette nuit, Curso s’est occupé de :';
  ALTER TABLE "home_hero_tasks" ADD CONSTRAINT "home_hero_tasks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_hero_tasks_order_idx" ON "home_hero_tasks" USING btree ("_order");
  CREATE INDEX "home_hero_tasks_parent_id_idx" ON "home_hero_tasks" USING btree ("_parent_id");
  ALTER TABLE "home" DROP COLUMN "hero_photo_id";
  ALTER TABLE "home" DROP COLUMN "hero_photo_placeholder";
  ALTER TABLE "home" DROP COLUMN "hero_benefits_title";
  ALTER TABLE "home" DROP COLUMN "hero_curso_says";`)

  // Tâches de la maquette pour une Accueil déjà existante (une base vierge passe par le seed)
  await db.execute(sql`
   INSERT INTO "home_hero_tasks" ("_order", "_parent_id", "id", "icon", "title", "detail", "badge", "badge_tone")
   SELECT t.ord, h.id, md5(random()::text || t.ord)::varchar(24), t.icon::"enum_home_hero_tasks_icon", t.title, t.detail, t.badge, t.tone::"enum_home_hero_tasks_badge_tone"
   FROM (SELECT id FROM "home" LIMIT 1) h
   CROSS JOIN (VALUES
     (1, 'document', 'Devis · Mariage Dupont', '120 couverts, envoyé au client', 'Envoyé', 'done'),
     (2, 'bell', 'Relance d’acompte', 'Programmée automatiquement', 'J−7', 'pending'),
     (3, 'calendar', 'Planning de samedi', 'Fiches et liste de courses', 'Prêt', 'done')
   ) AS t(ord, icon, title, detail, badge, tone);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_hero_tasks" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_hero_tasks" CASCADE;
  ALTER TABLE "home" ADD COLUMN "hero_photo_id" integer;
  ALTER TABLE "home" ADD COLUMN "hero_photo_placeholder" varchar DEFAULT '[Photo : Gabriel avec un client, dans son atelier ou en cuisine — lumière naturelle, cadrage serré]';
  ALTER TABLE "home" ADD COLUMN "hero_benefits_title" varchar DEFAULT 'Ce que vous y gagnez';
  ALTER TABLE "home" ADD COLUMN "hero_curso_says" varchar DEFAULT 'Pendant que vous dormez, Curso s’occupe des relances.';
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_photo_id_media_id_fk" FOREIGN KEY ("hero_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_hero_hero_photo_idx" ON "home" USING btree ("hero_photo_id");
  ALTER TABLE "home" DROP COLUMN "hero_tasks_title";
  DROP TYPE "public"."enum_home_hero_tasks_icon";
  DROP TYPE "public"."enum_home_hero_tasks_badge_tone";`)
}
