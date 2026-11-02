import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload_mcp_api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"projects_find" boolean DEFAULT false,
  	"projects_create" boolean DEFAULT false,
  	"projects_update" boolean DEFAULT false,
  	"projects_delete" boolean DEFAULT false,
  	"offers_find" boolean DEFAULT false,
  	"offers_create" boolean DEFAULT false,
  	"offers_update" boolean DEFAULT false,
  	"offers_delete" boolean DEFAULT false,
  	"guides_find" boolean DEFAULT false,
  	"guides_create" boolean DEFAULT false,
  	"guides_update" boolean DEFAULT false,
  	"guides_delete" boolean DEFAULT false,
  	"media_find" boolean DEFAULT false,
  	"media_create" boolean DEFAULT false,
  	"media_update" boolean DEFAULT false,
  	"media_delete" boolean DEFAULT false,
  	"qr_codes_find" boolean DEFAULT false,
  	"qr_codes_create" boolean DEFAULT false,
  	"qr_codes_update" boolean DEFAULT false,
  	"qr_codes_delete" boolean DEFAULT false,
  	"settings_find" boolean DEFAULT false,
  	"settings_update" boolean DEFAULT false,
  	"home_find" boolean DEFAULT false,
  	"home_update" boolean DEFAULT false,
  	"contact_page_find" boolean DEFAULT false,
  	"contact_page_update" boolean DEFAULT false,
  	"legal_find" boolean DEFAULT false,
  	"legal_update" boolean DEFAULT false,
  	"cookies_find" boolean DEFAULT false,
  	"cookies_update" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_mcp_api_keys_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "payload_mcp_api_keys_id" integer;
  ALTER TABLE "payload_mcp_api_keys" ADD CONSTRAINT "payload_mcp_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_mcp_api_keys_user_idx" ON "payload_mcp_api_keys" USING btree ("user_id");
  CREATE INDEX "payload_mcp_api_keys_updated_at_idx" ON "payload_mcp_api_keys" USING btree ("updated_at");
  CREATE INDEX "payload_mcp_api_keys_created_at_idx" ON "payload_mcp_api_keys" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_mcp_api_keys_id");
  CREATE INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx" ON "payload_preferences_rels" USING btree ("payload_mcp_api_keys_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_mcp_api_keys" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_mcp_api_keys" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk";
  
  DROP INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx";
  DROP INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_mcp_api_keys_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "payload_mcp_api_keys_id";`)
}
