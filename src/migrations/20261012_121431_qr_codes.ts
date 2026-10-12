import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_qr_scans_device" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TABLE "qr_codes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"destination" varchar DEFAULT '/' NOT NULL,
  	"active" boolean DEFAULT true,
  	"scans" numeric DEFAULT 0,
  	"last_scan_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "qr_scans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"qr_code_id" integer NOT NULL,
  	"device" "enum_qr_scans_device",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "qr_codes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "qr_scans_id" integer;
  ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_qr_code_id_qr_codes_id_fk" FOREIGN KEY ("qr_code_id") REFERENCES "public"."qr_codes"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "qr_codes_code_idx" ON "qr_codes" USING btree ("code");
  CREATE INDEX "qr_codes_updated_at_idx" ON "qr_codes" USING btree ("updated_at");
  CREATE INDEX "qr_codes_created_at_idx" ON "qr_codes" USING btree ("created_at");
  CREATE INDEX "qr_scans_qr_code_idx" ON "qr_scans" USING btree ("qr_code_id");
  CREATE INDEX "qr_scans_updated_at_idx" ON "qr_scans" USING btree ("updated_at");
  CREATE INDEX "qr_scans_created_at_idx" ON "qr_scans" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_qr_codes_fk" FOREIGN KEY ("qr_codes_id") REFERENCES "public"."qr_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_qr_scans_fk" FOREIGN KEY ("qr_scans_id") REFERENCES "public"."qr_scans"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_qr_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("qr_codes_id");
  CREATE INDEX "payload_locked_documents_rels_qr_scans_id_idx" ON "payload_locked_documents_rels" USING btree ("qr_scans_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "qr_codes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "qr_scans" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "qr_codes" CASCADE;
  DROP TABLE "qr_scans" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_qr_codes_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_qr_scans_fk";
  
  DROP INDEX "payload_locked_documents_rels_qr_codes_id_idx";
  DROP INDEX "payload_locked_documents_rels_qr_scans_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "qr_codes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "qr_scans_id";
  DROP TYPE "public"."enum_qr_scans_device";`)
}
