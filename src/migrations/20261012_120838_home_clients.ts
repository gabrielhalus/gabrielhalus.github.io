import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_clients_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"featured" boolean DEFAULT true
  );
  
  ALTER TABLE "home" ADD COLUMN "clients_title" varchar DEFAULT 'Ils me font confiance';
  ALTER TABLE "home_clients_items" ADD CONSTRAINT "home_clients_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_clients_items" ADD CONSTRAINT "home_clients_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_clients_items_order_idx" ON "home_clients_items" USING btree ("_order");
  CREATE INDEX "home_clients_items_parent_id_idx" ON "home_clients_items" USING btree ("_parent_id");
  CREATE INDEX "home_clients_items_logo_idx" ON "home_clients_items" USING btree ("logo_id");
  ALTER TABLE "home" DROP COLUMN "word_band_first";
  ALTER TABLE "home" DROP COLUMN "word_band_second";
  ALTER TABLE "home" DROP COLUMN "word_band_last";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_clients_items" CASCADE;
  ALTER TABLE "home" ADD COLUMN "word_band_first" varchar DEFAULT 'Concevoir';
  ALTER TABLE "home" ADD COLUMN "word_band_second" varchar DEFAULT '<coder/>';
  ALTER TABLE "home" ADD COLUMN "word_band_last" varchar DEFAULT 'Livrer';
  ALTER TABLE "home" DROP COLUMN "clients_title";`)
}
