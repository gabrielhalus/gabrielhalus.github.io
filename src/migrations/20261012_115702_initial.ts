import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_project_type" AS ENUM('web-app', 'automation', 'api', 'takeover');
  CREATE TYPE "public"."enum_projects_tone" AS ENUM('blush', 'mint', 'lilac', 'slate');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_project_type" AS ENUM('web-app', 'automation', 'api', 'takeover');
  CREATE TYPE "public"."enum__projects_v_version_tone" AS ENUM('blush', 'mint', 'lilac', 'slate');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_offers_modules_items_variant" AS ENUM('accent', 'light', 'tone', 'dark');
  CREATE TYPE "public"."enum_offers_modules_items_visual" AS ENUM('none', 'glyph', 'rows', 'chips', 'terminal');
  CREATE TYPE "public"."enum_offers_availability" AS ENUM('live', 'soon');
  CREATE TYPE "public"."enum_offers_tone" AS ENUM('blush', 'mint', 'lilac', 'slate');
  CREATE TYPE "public"."enum_offers_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__offers_v_version_modules_items_variant" AS ENUM('accent', 'light', 'tone', 'dark');
  CREATE TYPE "public"."enum__offers_v_version_modules_items_visual" AS ENUM('none', 'glyph', 'rows', 'chips', 'terminal');
  CREATE TYPE "public"."enum__offers_v_version_tone" AS ENUM('blush', 'mint', 'lilac', 'slate');
  CREATE TYPE "public"."enum__offers_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_guides_tone" AS ENUM('blush', 'mint', 'lilac', 'slate');
  CREATE TYPE "public"."enum_guides_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__guides_v_version_tone" AS ENUM('blush', 'mint', 'lilac', 'slate');
  CREATE TYPE "public"."enum__guides_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_requests_request_type" AS ENUM('custom', 'offer', 'other');
  CREATE TYPE "public"."enum_home_services_items_variant" AS ENUM('accent', 'light', 'dark');
  CREATE TYPE "public"."enum_cookies_trackers_category" AS ENUM('necessary', 'analytics', 'thirdParty');
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"project_type" "enum_projects_project_type",
  	"sector" varchar,
  	"year" numeric,
  	"client" varchar,
  	"result" varchar,
  	"summary" varchar,
  	"cover_id" integer,
  	"tone" "enum_projects_tone" DEFAULT 'blush',
  	"content" jsonb,
  	"featured" boolean DEFAULT false,
  	"highlight_sector" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_project_type" "enum__projects_v_version_project_type",
  	"version_sector" varchar,
  	"version_year" numeric,
  	"version_client" varchar,
  	"version_result" varchar,
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_tone" "enum__projects_v_version_tone" DEFAULT 'blush',
  	"version_content" jsonb,
  	"version_featured" boolean DEFAULT false,
  	"version_highlight_sector" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "offers_hero_trust_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "offers_problem_breakdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"minutes" numeric
  );
  
  CREATE TABLE "offers_modules_items_visual_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "offers_modules_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum_offers_modules_items_variant" DEFAULT 'light',
  	"visual" "enum_offers_modules_items_visual" DEFAULT 'none',
  	"glyph" varchar
  );
  
  CREATE TABLE "offers_pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "offers_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"subtitle" varchar,
  	"price" varchar,
  	"price_note" varchar DEFAULT 'HT, une fois',
  	"highlighted" boolean,
  	"badge" varchar,
  	"cta_label" varchar
  );
  
  CREATE TABLE "offers_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"when" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "offers_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"status" "enum_offers_availability" DEFAULT 'live',
  	"order" numeric DEFAULT 0,
  	"tone" "enum_offers_tone" DEFAULT 'blush',
  	"booking_url" varchar,
  	"promise" varchar,
  	"card_text" varchar,
  	"hero_badge" varchar DEFAULT 'Offre clé en main · prix fixe',
  	"hero_title" varchar,
  	"hero_lead" varchar,
  	"hero_primary_label" varchar DEFAULT 'Calculer mon gain',
  	"hero_secondary_label" varchar DEFAULT 'Réserver une démo',
  	"hero_image_id" integer,
  	"hero_image_placeholder" varchar,
  	"hero_floating_cards_doc_label" varchar DEFAULT 'Devis n° 0142',
  	"hero_floating_cards_doc_title" varchar DEFAULT 'Mariage · 120 couverts',
  	"hero_floating_cards_doc_amount" varchar DEFAULT '6 840,00 €',
  	"hero_floating_cards_doc_time" varchar DEFAULT 'en 3 min',
  	"hero_floating_cards_time_label" varchar DEFAULT 'Temps récupéré cette semaine',
  	"hero_floating_cards_time_value" varchar DEFAULT '+ 10 h 15',
  	"hero_floating_cards_notification" varchar DEFAULT 'Fiche allergènes générée',
  	"problem_title" varchar,
  	"problem_text" varchar,
  	"problem_breakdown_title" varchar DEFAULT 'Où partent 10 heures par semaine',
  	"problem_footnote" varchar,
  	"modules_title" varchar DEFAULT 'Quatre modules, un seul outil.',
  	"modules_intro" varchar,
  	"pricing_title" varchar DEFAULT 'Une offre définie. Ajustée à votre maison.',
  	"pricing_intro" varchar,
  	"pricing_footnote" varchar,
  	"roi_enabled" boolean DEFAULT true,
  	"roi_title" varchar DEFAULT 'Combien d’heures récupérez-vous ?',
  	"roi_intro" varchar,
  	"roi_offer_price" numeric,
  	"roi_minutes_per_quote_after" numeric DEFAULT 5,
  	"roi_automation_rate" numeric DEFAULT 60,
  	"roi_weeks_per_year" numeric DEFAULT 46,
  	"roi_cta_label" varchar DEFAULT 'Vérifier ces chiffres lors d’un audit offert',
  	"process_title" varchar DEFAULT 'De l’audit aux heures gagnées.',
  	"testimonial_quote" varchar,
  	"testimonial_author" varchar,
  	"testimonial_company" varchar,
  	"testimonial_photo_id" integer,
  	"final_cta_title" varchar,
  	"final_cta_text" varchar,
  	"final_cta_label" varchar DEFAULT 'Réserver mon audit',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_offers_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_offers_v_version_hero_trust_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_offers_v_version_problem_breakdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"minutes" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_offers_v_version_modules_items_visual_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_offers_v_version_modules_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"variant" "enum__offers_v_version_modules_items_variant" DEFAULT 'light',
  	"visual" "enum__offers_v_version_modules_items_visual" DEFAULT 'none',
  	"glyph" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_offers_v_version_pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_offers_v_version_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"subtitle" varchar,
  	"price" varchar,
  	"price_note" varchar DEFAULT 'HT, une fois',
  	"highlighted" boolean,
  	"badge" varchar,
  	"cta_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_offers_v_version_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"when" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_offers_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_offers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_status" "enum_offers_availability" DEFAULT 'live',
  	"version_order" numeric DEFAULT 0,
  	"version_tone" "enum__offers_v_version_tone" DEFAULT 'blush',
  	"version_booking_url" varchar,
  	"version_promise" varchar,
  	"version_card_text" varchar,
  	"version_hero_badge" varchar DEFAULT 'Offre clé en main · prix fixe',
  	"version_hero_title" varchar,
  	"version_hero_lead" varchar,
  	"version_hero_primary_label" varchar DEFAULT 'Calculer mon gain',
  	"version_hero_secondary_label" varchar DEFAULT 'Réserver une démo',
  	"version_hero_image_id" integer,
  	"version_hero_image_placeholder" varchar,
  	"version_hero_floating_cards_doc_label" varchar DEFAULT 'Devis n° 0142',
  	"version_hero_floating_cards_doc_title" varchar DEFAULT 'Mariage · 120 couverts',
  	"version_hero_floating_cards_doc_amount" varchar DEFAULT '6 840,00 €',
  	"version_hero_floating_cards_doc_time" varchar DEFAULT 'en 3 min',
  	"version_hero_floating_cards_time_label" varchar DEFAULT 'Temps récupéré cette semaine',
  	"version_hero_floating_cards_time_value" varchar DEFAULT '+ 10 h 15',
  	"version_hero_floating_cards_notification" varchar DEFAULT 'Fiche allergènes générée',
  	"version_problem_title" varchar,
  	"version_problem_text" varchar,
  	"version_problem_breakdown_title" varchar DEFAULT 'Où partent 10 heures par semaine',
  	"version_problem_footnote" varchar,
  	"version_modules_title" varchar DEFAULT 'Quatre modules, un seul outil.',
  	"version_modules_intro" varchar,
  	"version_pricing_title" varchar DEFAULT 'Une offre définie. Ajustée à votre maison.',
  	"version_pricing_intro" varchar,
  	"version_pricing_footnote" varchar,
  	"version_roi_enabled" boolean DEFAULT true,
  	"version_roi_title" varchar DEFAULT 'Combien d’heures récupérez-vous ?',
  	"version_roi_intro" varchar,
  	"version_roi_offer_price" numeric,
  	"version_roi_minutes_per_quote_after" numeric DEFAULT 5,
  	"version_roi_automation_rate" numeric DEFAULT 60,
  	"version_roi_weeks_per_year" numeric DEFAULT 46,
  	"version_roi_cta_label" varchar DEFAULT 'Vérifier ces chiffres lors d’un audit offert',
  	"version_process_title" varchar DEFAULT 'De l’audit aux heures gagnées.',
  	"version_testimonial_quote" varchar,
  	"version_testimonial_author" varchar,
  	"version_testimonial_company" varchar,
  	"version_testimonial_photo_id" integer,
  	"version_final_cta_title" varchar,
  	"version_final_cta_text" varchar,
  	"version_final_cta_label" varchar DEFAULT 'Réserver mon audit',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__offers_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "guides_tldr" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "guides_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "guides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"lead" varchar,
  	"intro" varchar,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"offer_id" integer,
  	"category" varchar DEFAULT 'Guide pratique',
  	"tone" "enum_guides_tone" DEFAULT 'blush',
  	"cover_id" integer,
  	"reading_time" numeric,
  	"show_toc" boolean DEFAULT true,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_guides_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "guides_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "guides_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"guides_id" integer
  );
  
  CREATE TABLE "_guides_v_version_tldr" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_guides_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_guides_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_lead" varchar,
  	"version_intro" varchar,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_offer_id" integer,
  	"version_category" varchar DEFAULT 'Guide pratique',
  	"version_tone" "enum__guides_v_version_tone" DEFAULT 'blush',
  	"version_cover_id" integer,
  	"version_reading_time" numeric,
  	"version_show_toc" boolean DEFAULT true,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__guides_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_guides_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_guides_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"guides_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "contact_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"request_type" "enum_contact_requests_request_type" NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"phone" varchar,
  	"offer" varchar,
  	"budget" varchar,
  	"message" varchar NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"handled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"offers_id" integer,
  	"guides_id" integer,
  	"media_id" integer,
  	"contact_requests_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Gabriel Halus',
  	"site_url" varchar DEFAULT 'https://gabrielhalus.com',
  	"default_description" varchar,
  	"og_image_id" integer,
  	"role" varchar DEFAULT 'Développeur',
  	"city" varchar,
  	"portrait_id" integer,
  	"author_bio" varchar,
  	"availability_show" boolean DEFAULT true,
  	"availability_text" varchar DEFAULT 'Disponible à partir de [mois]',
  	"email" varchar DEFAULT 'contact@gabrielhalus.com',
  	"phone" varchar,
  	"booking_url" varchar DEFAULT 'https://cal.com/',
  	"response_time" varchar DEFAULT 'sous 48 h ouvrées',
  	"legal_name" varchar DEFAULT 'Gabriel Halus, entrepreneur individuel (EI)',
  	"siret" varchar DEFAULT '[000 000 000 00000]',
  	"address" varchar,
  	"registration" varchar DEFAULT 'Registre national des entreprises',
  	"vat_mention" varchar DEFAULT 'TVA non applicable, art. 293 B du CGI',
  	"footer_cta" varchar DEFAULT 'Un projet, ou un process qui vous coûte des heures chaque semaine ?',
  	"footer_cta_label" varchar DEFAULT 'Parlons-en',
  	"footer_wordmark" varchar DEFAULT 'gabrielhalus',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_hero_terminal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"status" varchar
  );
  
  CREATE TABLE "home_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"variant" "enum_home_services_items_variant" DEFAULT 'light',
  	"glyph" varchar
  );
  
  CREATE TABLE "home_method_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar DEFAULT 'Je développe les outils qui font tourner',
  	"hero_highlight" varchar DEFAULT 'votre activité.',
  	"hero_lead" varchar,
  	"hero_primary_label" varchar DEFAULT 'Réserver un appel',
  	"hero_secondary_label" varchar DEFAULT 'Voir les projets',
  	"hero_terminal_path" varchar DEFAULT '~/projets/client',
  	"hero_terminal_done" varchar DEFAULT 'déployé — prêt pour vos utilisateurs',
  	"hero_featured_offer_id" integer,
  	"word_band_first" varchar DEFAULT 'Concevoir',
  	"word_band_second" varchar DEFAULT '<coder/>',
  	"word_band_last" varchar DEFAULT 'Livrer',
  	"services_title" varchar DEFAULT 'Du code qui travaille',
  	"services_title_muted" varchar DEFAULT 'à votre place.',
  	"services_intro" varchar,
  	"projects_title" varchar DEFAULT 'Projets récents',
  	"projects_intro" varchar,
  	"method_title" varchar DEFAULT 'Un prix fixe, des démos régulières,',
  	"method_highlight" varchar DEFAULT 'aucune surprise.',
  	"offers_title" varchar DEFAULT 'Votre métier a déjà son offre clé en main.',
  	"offers_intro" varchar,
  	"tools_title" varchar DEFAULT 'Outils du quotidien',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "contact_page_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Parlons de votre projet.',
  	"lead" varchar,
  	"booking_title" varchar DEFAULT 'Réserver un appel',
  	"booking_text" varchar DEFAULT '30 min en visio, gratuit',
  	"mail_title" varchar DEFAULT 'Écrire directement',
  	"message_placeholder" varchar DEFAULT 'Le contexte, ce qui vous fait perdre du temps, l’échéance éventuelle…',
  	"form_note" varchar DEFAULT 'Pas de newsletter, pas de revente.',
  	"success_title" varchar DEFAULT 'Message bien reçu.',
  	"success_text" varchar,
  	"steps_title" varchar DEFAULT 'Ce qui se passe après l’envoi',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "legal_privacy_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"detail" varchar NOT NULL
  );
  
  CREATE TABLE "legal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_on" timestamp(3) with time zone,
  	"publisher" varchar DEFAULT 'Gabriel Halus',
  	"hosting" varchar DEFAULT 'Le site est hébergé par [Nom de l’hébergeur], [raison sociale], [adresse], [téléphone].',
  	"intellectual_property" varchar,
  	"privacy_intro" varchar,
  	"privacy_rights" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cookies_trackers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" "enum_cookies_trackers_category" NOT NULL,
  	"purpose" varchar NOT NULL,
  	"duration" varchar NOT NULL
  );
  
  CREATE TABLE "cookies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_on" timestamp(3) with time zone,
  	"title" varchar DEFAULT 'Le strict minimum, et c’est vous qui choisissez.',
  	"intro" varchar,
  	"categories_necessary" varchar DEFAULT 'Mémorisent votre choix sur cette page. Toujours actifs.',
  	"categories_analytics" varchar,
  	"categories_third_party" varchar,
  	"footnote" varchar,
  	"banner_title" varchar DEFAULT 'Un petit réglage',
  	"banner_text" varchar DEFAULT 'J’aimerais mesurer la fréquentation du site, sans publicité ni revente. D’accord ?',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_texts" ADD CONSTRAINT "projects_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_texts" ADD CONSTRAINT "_projects_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_hero_trust_points" ADD CONSTRAINT "offers_hero_trust_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_problem_breakdown" ADD CONSTRAINT "offers_problem_breakdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_modules_items_visual_items" ADD CONSTRAINT "offers_modules_items_visual_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers_modules_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_modules_items" ADD CONSTRAINT "offers_modules_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_pricing_plans_features" ADD CONSTRAINT "offers_pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_pricing_plans" ADD CONSTRAINT "offers_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_process_steps" ADD CONSTRAINT "offers_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_faq" ADD CONSTRAINT "offers_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_testimonial_photo_id_media_id_fk" FOREIGN KEY ("testimonial_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offers_v_version_hero_trust_points" ADD CONSTRAINT "_offers_v_version_hero_trust_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offers_v_version_problem_breakdown" ADD CONSTRAINT "_offers_v_version_problem_breakdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offers_v_version_modules_items_visual_items" ADD CONSTRAINT "_offers_v_version_modules_items_visual_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offers_v_version_modules_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offers_v_version_modules_items" ADD CONSTRAINT "_offers_v_version_modules_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offers_v_version_pricing_plans_features" ADD CONSTRAINT "_offers_v_version_pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offers_v_version_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offers_v_version_pricing_plans" ADD CONSTRAINT "_offers_v_version_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offers_v_version_process_steps" ADD CONSTRAINT "_offers_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offers_v_version_faq" ADD CONSTRAINT "_offers_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offers_v" ADD CONSTRAINT "_offers_v_parent_id_offers_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offers_v" ADD CONSTRAINT "_offers_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offers_v" ADD CONSTRAINT "_offers_v_version_testimonial_photo_id_media_id_fk" FOREIGN KEY ("version_testimonial_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offers_v" ADD CONSTRAINT "_offers_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides_tldr" ADD CONSTRAINT "guides_tldr_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_faq" ADD CONSTRAINT "guides_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides_texts" ADD CONSTRAINT "guides_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_guides_v_version_tldr" ADD CONSTRAINT "_guides_v_version_tldr_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_guides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_guides_v_version_faq" ADD CONSTRAINT "_guides_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_guides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_parent_id_guides_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."guides"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_offer_id_offers_id_fk" FOREIGN KEY ("version_offer_id") REFERENCES "public"."offers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v_texts" ADD CONSTRAINT "_guides_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_guides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_guides_v_rels" ADD CONSTRAINT "_guides_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_guides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_guides_v_rels" ADD CONSTRAINT "_guides_v_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offers_fk" FOREIGN KEY ("offers_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_requests_fk" FOREIGN KEY ("contact_requests_id") REFERENCES "public"."contact_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_socials" ADD CONSTRAINT "settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero_terminal" ADD CONSTRAINT "home_hero_terminal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_services_items" ADD CONSTRAINT "home_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_method_steps" ADD CONSTRAINT "home_method_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_featured_offer_id_offers_id_fk" FOREIGN KEY ("hero_featured_offer_id") REFERENCES "public"."offers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_texts" ADD CONSTRAINT "home_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_steps" ADD CONSTRAINT "contact_page_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_texts" ADD CONSTRAINT "contact_page_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_privacy_rows" ADD CONSTRAINT "legal_privacy_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cookies_trackers" ADD CONSTRAINT "cookies_trackers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cookies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_meta_meta_image_idx" ON "projects" USING btree ("meta_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_texts_order_parent" ON "projects_texts" USING btree ("order","parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_meta_version_meta_image_idx" ON "_projects_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_texts_order_parent" ON "_projects_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "offers_hero_trust_points_order_idx" ON "offers_hero_trust_points" USING btree ("_order");
  CREATE INDEX "offers_hero_trust_points_parent_id_idx" ON "offers_hero_trust_points" USING btree ("_parent_id");
  CREATE INDEX "offers_problem_breakdown_order_idx" ON "offers_problem_breakdown" USING btree ("_order");
  CREATE INDEX "offers_problem_breakdown_parent_id_idx" ON "offers_problem_breakdown" USING btree ("_parent_id");
  CREATE INDEX "offers_modules_items_visual_items_order_idx" ON "offers_modules_items_visual_items" USING btree ("_order");
  CREATE INDEX "offers_modules_items_visual_items_parent_id_idx" ON "offers_modules_items_visual_items" USING btree ("_parent_id");
  CREATE INDEX "offers_modules_items_order_idx" ON "offers_modules_items" USING btree ("_order");
  CREATE INDEX "offers_modules_items_parent_id_idx" ON "offers_modules_items" USING btree ("_parent_id");
  CREATE INDEX "offers_pricing_plans_features_order_idx" ON "offers_pricing_plans_features" USING btree ("_order");
  CREATE INDEX "offers_pricing_plans_features_parent_id_idx" ON "offers_pricing_plans_features" USING btree ("_parent_id");
  CREATE INDEX "offers_pricing_plans_order_idx" ON "offers_pricing_plans" USING btree ("_order");
  CREATE INDEX "offers_pricing_plans_parent_id_idx" ON "offers_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "offers_process_steps_order_idx" ON "offers_process_steps" USING btree ("_order");
  CREATE INDEX "offers_process_steps_parent_id_idx" ON "offers_process_steps" USING btree ("_parent_id");
  CREATE INDEX "offers_faq_order_idx" ON "offers_faq" USING btree ("_order");
  CREATE INDEX "offers_faq_parent_id_idx" ON "offers_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "offers_slug_idx" ON "offers" USING btree ("slug");
  CREATE INDEX "offers_hero_hero_image_idx" ON "offers" USING btree ("hero_image_id");
  CREATE INDEX "offers_testimonial_testimonial_photo_idx" ON "offers" USING btree ("testimonial_photo_id");
  CREATE INDEX "offers_meta_meta_image_idx" ON "offers" USING btree ("meta_image_id");
  CREATE INDEX "offers_updated_at_idx" ON "offers" USING btree ("updated_at");
  CREATE INDEX "offers_created_at_idx" ON "offers" USING btree ("created_at");
  CREATE INDEX "offers__status_idx" ON "offers" USING btree ("_status");
  CREATE INDEX "_offers_v_version_hero_trust_points_order_idx" ON "_offers_v_version_hero_trust_points" USING btree ("_order");
  CREATE INDEX "_offers_v_version_hero_trust_points_parent_id_idx" ON "_offers_v_version_hero_trust_points" USING btree ("_parent_id");
  CREATE INDEX "_offers_v_version_problem_breakdown_order_idx" ON "_offers_v_version_problem_breakdown" USING btree ("_order");
  CREATE INDEX "_offers_v_version_problem_breakdown_parent_id_idx" ON "_offers_v_version_problem_breakdown" USING btree ("_parent_id");
  CREATE INDEX "_offers_v_version_modules_items_visual_items_order_idx" ON "_offers_v_version_modules_items_visual_items" USING btree ("_order");
  CREATE INDEX "_offers_v_version_modules_items_visual_items_parent_id_idx" ON "_offers_v_version_modules_items_visual_items" USING btree ("_parent_id");
  CREATE INDEX "_offers_v_version_modules_items_order_idx" ON "_offers_v_version_modules_items" USING btree ("_order");
  CREATE INDEX "_offers_v_version_modules_items_parent_id_idx" ON "_offers_v_version_modules_items" USING btree ("_parent_id");
  CREATE INDEX "_offers_v_version_pricing_plans_features_order_idx" ON "_offers_v_version_pricing_plans_features" USING btree ("_order");
  CREATE INDEX "_offers_v_version_pricing_plans_features_parent_id_idx" ON "_offers_v_version_pricing_plans_features" USING btree ("_parent_id");
  CREATE INDEX "_offers_v_version_pricing_plans_order_idx" ON "_offers_v_version_pricing_plans" USING btree ("_order");
  CREATE INDEX "_offers_v_version_pricing_plans_parent_id_idx" ON "_offers_v_version_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "_offers_v_version_process_steps_order_idx" ON "_offers_v_version_process_steps" USING btree ("_order");
  CREATE INDEX "_offers_v_version_process_steps_parent_id_idx" ON "_offers_v_version_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_offers_v_version_faq_order_idx" ON "_offers_v_version_faq" USING btree ("_order");
  CREATE INDEX "_offers_v_version_faq_parent_id_idx" ON "_offers_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_offers_v_parent_idx" ON "_offers_v" USING btree ("parent_id");
  CREATE INDEX "_offers_v_version_version_slug_idx" ON "_offers_v" USING btree ("version_slug");
  CREATE INDEX "_offers_v_version_hero_version_hero_image_idx" ON "_offers_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_offers_v_version_testimonial_version_testimonial_photo_idx" ON "_offers_v" USING btree ("version_testimonial_photo_id");
  CREATE INDEX "_offers_v_version_meta_version_meta_image_idx" ON "_offers_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_offers_v_version_version_updated_at_idx" ON "_offers_v" USING btree ("version_updated_at");
  CREATE INDEX "_offers_v_version_version_created_at_idx" ON "_offers_v" USING btree ("version_created_at");
  CREATE INDEX "_offers_v_version_version__status_idx" ON "_offers_v" USING btree ("version__status");
  CREATE INDEX "_offers_v_created_at_idx" ON "_offers_v" USING btree ("created_at");
  CREATE INDEX "_offers_v_updated_at_idx" ON "_offers_v" USING btree ("updated_at");
  CREATE INDEX "_offers_v_latest_idx" ON "_offers_v" USING btree ("latest");
  CREATE INDEX "guides_tldr_order_idx" ON "guides_tldr" USING btree ("_order");
  CREATE INDEX "guides_tldr_parent_id_idx" ON "guides_tldr" USING btree ("_parent_id");
  CREATE INDEX "guides_faq_order_idx" ON "guides_faq" USING btree ("_order");
  CREATE INDEX "guides_faq_parent_id_idx" ON "guides_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "guides_slug_idx" ON "guides" USING btree ("slug");
  CREATE INDEX "guides_offer_idx" ON "guides" USING btree ("offer_id");
  CREATE INDEX "guides_cover_idx" ON "guides" USING btree ("cover_id");
  CREATE INDEX "guides_meta_meta_image_idx" ON "guides" USING btree ("meta_image_id");
  CREATE INDEX "guides_updated_at_idx" ON "guides" USING btree ("updated_at");
  CREATE INDEX "guides_created_at_idx" ON "guides" USING btree ("created_at");
  CREATE INDEX "guides__status_idx" ON "guides" USING btree ("_status");
  CREATE INDEX "guides_texts_order_parent" ON "guides_texts" USING btree ("order","parent_id");
  CREATE INDEX "guides_rels_order_idx" ON "guides_rels" USING btree ("order");
  CREATE INDEX "guides_rels_parent_idx" ON "guides_rels" USING btree ("parent_id");
  CREATE INDEX "guides_rels_path_idx" ON "guides_rels" USING btree ("path");
  CREATE INDEX "guides_rels_guides_id_idx" ON "guides_rels" USING btree ("guides_id");
  CREATE INDEX "_guides_v_version_tldr_order_idx" ON "_guides_v_version_tldr" USING btree ("_order");
  CREATE INDEX "_guides_v_version_tldr_parent_id_idx" ON "_guides_v_version_tldr" USING btree ("_parent_id");
  CREATE INDEX "_guides_v_version_faq_order_idx" ON "_guides_v_version_faq" USING btree ("_order");
  CREATE INDEX "_guides_v_version_faq_parent_id_idx" ON "_guides_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_guides_v_parent_idx" ON "_guides_v" USING btree ("parent_id");
  CREATE INDEX "_guides_v_version_version_slug_idx" ON "_guides_v" USING btree ("version_slug");
  CREATE INDEX "_guides_v_version_version_offer_idx" ON "_guides_v" USING btree ("version_offer_id");
  CREATE INDEX "_guides_v_version_version_cover_idx" ON "_guides_v" USING btree ("version_cover_id");
  CREATE INDEX "_guides_v_version_meta_version_meta_image_idx" ON "_guides_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_guides_v_version_version_updated_at_idx" ON "_guides_v" USING btree ("version_updated_at");
  CREATE INDEX "_guides_v_version_version_created_at_idx" ON "_guides_v" USING btree ("version_created_at");
  CREATE INDEX "_guides_v_version_version__status_idx" ON "_guides_v" USING btree ("version__status");
  CREATE INDEX "_guides_v_created_at_idx" ON "_guides_v" USING btree ("created_at");
  CREATE INDEX "_guides_v_updated_at_idx" ON "_guides_v" USING btree ("updated_at");
  CREATE INDEX "_guides_v_latest_idx" ON "_guides_v" USING btree ("latest");
  CREATE INDEX "_guides_v_texts_order_parent" ON "_guides_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_guides_v_rels_order_idx" ON "_guides_v_rels" USING btree ("order");
  CREATE INDEX "_guides_v_rels_parent_idx" ON "_guides_v_rels" USING btree ("parent_id");
  CREATE INDEX "_guides_v_rels_path_idx" ON "_guides_v_rels" USING btree ("path");
  CREATE INDEX "_guides_v_rels_guides_id_idx" ON "_guides_v_rels" USING btree ("guides_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "contact_requests_updated_at_idx" ON "contact_requests" USING btree ("updated_at");
  CREATE INDEX "contact_requests_created_at_idx" ON "contact_requests" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_offers_id_idx" ON "payload_locked_documents_rels" USING btree ("offers_id");
  CREATE INDEX "payload_locked_documents_rels_guides_id_idx" ON "payload_locked_documents_rels" USING btree ("guides_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_contact_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_requests_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "settings_socials_order_idx" ON "settings_socials" USING btree ("_order");
  CREATE INDEX "settings_socials_parent_id_idx" ON "settings_socials" USING btree ("_parent_id");
  CREATE INDEX "settings_og_image_idx" ON "settings" USING btree ("og_image_id");
  CREATE INDEX "settings_portrait_idx" ON "settings" USING btree ("portrait_id");
  CREATE INDEX "home_hero_terminal_order_idx" ON "home_hero_terminal" USING btree ("_order");
  CREATE INDEX "home_hero_terminal_parent_id_idx" ON "home_hero_terminal" USING btree ("_parent_id");
  CREATE INDEX "home_services_items_order_idx" ON "home_services_items" USING btree ("_order");
  CREATE INDEX "home_services_items_parent_id_idx" ON "home_services_items" USING btree ("_parent_id");
  CREATE INDEX "home_method_steps_order_idx" ON "home_method_steps" USING btree ("_order");
  CREATE INDEX "home_method_steps_parent_id_idx" ON "home_method_steps" USING btree ("_parent_id");
  CREATE INDEX "home_hero_hero_featured_offer_idx" ON "home" USING btree ("hero_featured_offer_id");
  CREATE INDEX "home_texts_order_parent" ON "home_texts" USING btree ("order","parent_id");
  CREATE INDEX "contact_page_steps_order_idx" ON "contact_page_steps" USING btree ("_order");
  CREATE INDEX "contact_page_steps_parent_id_idx" ON "contact_page_steps" USING btree ("_parent_id");
  CREATE INDEX "contact_page_texts_order_parent" ON "contact_page_texts" USING btree ("order","parent_id");
  CREATE INDEX "legal_privacy_rows_order_idx" ON "legal_privacy_rows" USING btree ("_order");
  CREATE INDEX "legal_privacy_rows_parent_id_idx" ON "legal_privacy_rows" USING btree ("_parent_id");
  CREATE INDEX "cookies_trackers_order_idx" ON "cookies_trackers" USING btree ("_order");
  CREATE INDEX "cookies_trackers_parent_id_idx" ON "cookies_trackers" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_texts" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_texts" CASCADE;
  DROP TABLE "offers_hero_trust_points" CASCADE;
  DROP TABLE "offers_problem_breakdown" CASCADE;
  DROP TABLE "offers_modules_items_visual_items" CASCADE;
  DROP TABLE "offers_modules_items" CASCADE;
  DROP TABLE "offers_pricing_plans_features" CASCADE;
  DROP TABLE "offers_pricing_plans" CASCADE;
  DROP TABLE "offers_process_steps" CASCADE;
  DROP TABLE "offers_faq" CASCADE;
  DROP TABLE "offers" CASCADE;
  DROP TABLE "_offers_v_version_hero_trust_points" CASCADE;
  DROP TABLE "_offers_v_version_problem_breakdown" CASCADE;
  DROP TABLE "_offers_v_version_modules_items_visual_items" CASCADE;
  DROP TABLE "_offers_v_version_modules_items" CASCADE;
  DROP TABLE "_offers_v_version_pricing_plans_features" CASCADE;
  DROP TABLE "_offers_v_version_pricing_plans" CASCADE;
  DROP TABLE "_offers_v_version_process_steps" CASCADE;
  DROP TABLE "_offers_v_version_faq" CASCADE;
  DROP TABLE "_offers_v" CASCADE;
  DROP TABLE "guides_tldr" CASCADE;
  DROP TABLE "guides_faq" CASCADE;
  DROP TABLE "guides" CASCADE;
  DROP TABLE "guides_texts" CASCADE;
  DROP TABLE "guides_rels" CASCADE;
  DROP TABLE "_guides_v_version_tldr" CASCADE;
  DROP TABLE "_guides_v_version_faq" CASCADE;
  DROP TABLE "_guides_v" CASCADE;
  DROP TABLE "_guides_v_texts" CASCADE;
  DROP TABLE "_guides_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "contact_requests" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "settings_socials" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "home_hero_terminal" CASCADE;
  DROP TABLE "home_services_items" CASCADE;
  DROP TABLE "home_method_steps" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_texts" CASCADE;
  DROP TABLE "contact_page_steps" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "contact_page_texts" CASCADE;
  DROP TABLE "legal_privacy_rows" CASCADE;
  DROP TABLE "legal" CASCADE;
  DROP TABLE "cookies_trackers" CASCADE;
  DROP TABLE "cookies" CASCADE;
  DROP TYPE "public"."enum_projects_project_type";
  DROP TYPE "public"."enum_projects_tone";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_project_type";
  DROP TYPE "public"."enum__projects_v_version_tone";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_offers_modules_items_variant";
  DROP TYPE "public"."enum_offers_modules_items_visual";
  DROP TYPE "public"."enum_offers_availability";
  DROP TYPE "public"."enum_offers_tone";
  DROP TYPE "public"."enum_offers_status";
  DROP TYPE "public"."enum__offers_v_version_modules_items_variant";
  DROP TYPE "public"."enum__offers_v_version_modules_items_visual";
  DROP TYPE "public"."enum__offers_v_version_tone";
  DROP TYPE "public"."enum__offers_v_version_status";
  DROP TYPE "public"."enum_guides_tone";
  DROP TYPE "public"."enum_guides_status";
  DROP TYPE "public"."enum__guides_v_version_tone";
  DROP TYPE "public"."enum__guides_v_version_status";
  DROP TYPE "public"."enum_contact_requests_request_type";
  DROP TYPE "public"."enum_home_services_items_variant";
  DROP TYPE "public"."enum_cookies_trackers_category";`)
}
