import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_slider_block2_slides_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_block_background_color" AS ENUM('white', 'lightGrey', 'green');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_block_variant" AS ENUM('info-box', 'compact');
  CREATE TYPE "public"."enum_pages_blocks_benefits_with_list_block_background_color" AS ENUM('white', 'lightGrey', 'green');
  CREATE TYPE "public"."enum_pages_blocks_faq_items_block_background_color" AS ENUM('white', 'lightGrey', 'green');
  CREATE TYPE "public"."enum_pages_ab_preview_segment" AS ENUM('A', 'B');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_slider_block2_slides_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_block_background_color" AS ENUM('white', 'lightGrey', 'green');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_block_variant" AS ENUM('info-box', 'compact');
  CREATE TYPE "public"."enum__pages_v_blocks_benefits_with_list_block_background_color" AS ENUM('white', 'lightGrey', 'green');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_items_block_background_color" AS ENUM('white', 'lightGrey', 'green');
  CREATE TYPE "public"."enum__pages_v_version_ab_preview_segment" AS ENUM('A', 'B');
  ALTER TYPE "public"."enum_header_cta_buttons_appearance" ADD VALUE 'default';
  ALTER TYPE "public"."enum_header_cta_buttons_appearance" ADD VALUE 'link';
  CREATE TABLE "pages_blocks_hero_slider_block2_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"background_color" "enum_pages_blocks_hero_slider_block2_slides_background_color" DEFAULT 'green',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_slider_block2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_anchor_id" varchar,
  	"layout_styles_variant" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slider_block2_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"background_color" "enum__pages_v_blocks_hero_slider_block2_slides_background_color" DEFAULT 'green',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slider_block2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_anchor_id" varchar,
  	"layout_styles_variant" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload_mcp_api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"pages_find" boolean DEFAULT false,
  	"pages_create" boolean DEFAULT false,
  	"pages_update" boolean DEFAULT false,
  	"pages_delete" boolean DEFAULT false,
  	"articles_find" boolean DEFAULT false,
  	"articles_create" boolean DEFAULT false,
  	"articles_update" boolean DEFAULT false,
  	"articles_delete" boolean DEFAULT false,
  	"media_find" boolean DEFAULT false,
  	"media_create" boolean DEFAULT false,
  	"assets_find" boolean DEFAULT false,
  	"categories_find" boolean DEFAULT false,
  	"categories_create" boolean DEFAULT false,
  	"categories_update" boolean DEFAULT false,
  	"categories_delete" boolean DEFAULT false,
  	"header_find" boolean DEFAULT false,
  	"header_update" boolean DEFAULT false,
  	"footer_find" boolean DEFAULT false,
  	"footer_update" boolean DEFAULT false,
  	"settings_find" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "business_context" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar,
  	"business_description" varchar,
  	"target_audience" varchar,
  	"communication_style" varchar,
  	"services" varchar,
  	"seo_priorities" varchar,
  	"brand_voice" varchar,
  	"forbidden_phrases" varchar,
  	"editorial_rules" varchar,
  	"important_entities" varchar,
  	"competitors" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "heroCompact_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_heroCompact_v_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "heroCompact_breadcrumbs" CASCADE;
  DROP TABLE "_heroCompact_v_breadcrumbs" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk";
  
  DROP INDEX "_pages_v_blocks_mortgage_calculator_block_dos_person_image_idx";
  DROP INDEX "payload_locked_documents_rels_payload_jobs_id_idx";
  ALTER TABLE "articles" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "articles" ADD COLUMN "ai_summary" varchar;
  ALTER TABLE "articles" ADD COLUMN "ai_validation_seo" jsonb;
  ALTER TABLE "articles" ADD COLUMN "ai_validation_geo" jsonb;
  ALTER TABLE "articles" ADD COLUMN "ai_validation_updated_at" timestamp(3) with time zone;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_ai_summary" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_ai_validation_seo" jsonb;
  ALTER TABLE "_articles_v" ADD COLUMN "version_ai_validation_geo" jsonb;
  ALTER TABLE "_articles_v" ADD COLUMN "version_ai_validation_updated_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN "source_hash" varchar;
  ALTER TABLE "pages_blocks_rich_text_block" ADD COLUMN "background_color" "enum_pages_blocks_rich_text_block_background_color" DEFAULT 'white';
  ALTER TABLE "pages_blocks_rich_text_block" ADD COLUMN "variant" "enum_pages_blocks_rich_text_block_variant";
  ALTER TABLE "pages_blocks_benefits_with_list_block" ADD COLUMN "background_color" "enum_pages_blocks_benefits_with_list_block_background_color" DEFAULT 'white';
  ALTER TABLE "pages_blocks_faq_items_block" ADD COLUMN "background_color" "enum_pages_blocks_faq_items_block_background_color" DEFAULT 'white';
  ALTER TABLE "pages" ADD COLUMN "ab_preview_segment" "enum_pages_ab_preview_segment" DEFAULT 'A';
  ALTER TABLE "pages" ADD COLUMN "ai_summary" varchar;
  ALTER TABLE "pages" ADD COLUMN "ai_validation_seo" jsonb;
  ALTER TABLE "pages" ADD COLUMN "ai_validation_geo" jsonb;
  ALTER TABLE "pages" ADD COLUMN "ai_validation_updated_at" timestamp(3) with time zone;
  ALTER TABLE "pages" ADD COLUMN "ab_enabled" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD COLUMN "background_color" "enum__pages_v_blocks_rich_text_block_background_color" DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD COLUMN "variant" "enum__pages_v_blocks_rich_text_block_variant";
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" ADD COLUMN "background_color" "enum__pages_v_blocks_benefits_with_list_block_background_color" DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_faq_items_block" ADD COLUMN "background_color" "enum__pages_v_blocks_faq_items_block_background_color" DEFAULT 'white';
  ALTER TABLE "_pages_v" ADD COLUMN "version_ab_preview_segment" "enum__pages_v_version_ab_preview_segment" DEFAULT 'A';
  ALTER TABLE "_pages_v" ADD COLUMN "version_ai_summary" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_ai_validation_seo" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_ai_validation_geo" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_ai_validation_updated_at" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_ab_enabled" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_mcp_api_keys_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "payload_mcp_api_keys_id" integer;
  ALTER TABLE "header_navigation_children" ADD COLUMN "label_cs" varchar NOT NULL;
  ALTER TABLE "header_navigation_children" ADD COLUMN "label_en" varchar NOT NULL;
  ALTER TABLE "header_navigation" ADD COLUMN "label_cs" varchar NOT NULL;
  ALTER TABLE "header_navigation" ADD COLUMN "label_en" varchar NOT NULL;
  ALTER TABLE "header_cta_buttons" ADD COLUMN "label_cs" varchar NOT NULL;
  ALTER TABLE "header_cta_buttons" ADD COLUMN "label_en" varchar NOT NULL;
  ALTER TABLE "header_cta_buttons" ADD COLUMN "icon_id" integer;
  ALTER TABLE "settings" ADD COLUMN "app_store_ios_url" varchar;
  ALTER TABLE "settings" ADD COLUMN "app_store_android_url" varchar;
  ALTER TABLE "pages_blocks_hero_slider_block2_slides" ADD CONSTRAINT "pages_blocks_hero_slider_block2_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_block2_slides" ADD CONSTRAINT "pages_blocks_hero_slider_block2_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slider_block2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_block2" ADD CONSTRAINT "pages_blocks_hero_slider_block2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slider_block2_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slider_block2_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slider_block2_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slider_block2_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_slider_block2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slider_block2" ADD CONSTRAINT "_pages_v_blocks_hero_slider_block2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_mcp_api_keys" ADD CONSTRAINT "payload_mcp_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_slider_block2_slides_order_idx" ON "pages_blocks_hero_slider_block2_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slider_block2_slides_parent_id_idx" ON "pages_blocks_hero_slider_block2_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_block2_slides_image_idx" ON "pages_blocks_hero_slider_block2_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_slider_block2_order_idx" ON "pages_blocks_hero_slider_block2" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slider_block2_parent_id_idx" ON "pages_blocks_hero_slider_block2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_block2_path_idx" ON "pages_blocks_hero_slider_block2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_slider_block2_slides_order_idx" ON "_pages_v_blocks_hero_slider_block2_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slider_block2_slides_parent_id_idx" ON "_pages_v_blocks_hero_slider_block2_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slider_block2_slides_image_idx" ON "_pages_v_blocks_hero_slider_block2_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_slider_block2_order_idx" ON "_pages_v_blocks_hero_slider_block2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slider_block2_parent_id_idx" ON "_pages_v_blocks_hero_slider_block2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slider_block2_path_idx" ON "_pages_v_blocks_hero_slider_block2" USING btree ("_path");
  CREATE INDEX "payload_mcp_api_keys_user_idx" ON "payload_mcp_api_keys" USING btree ("user_id");
  CREATE INDEX "payload_mcp_api_keys_updated_at_idx" ON "payload_mcp_api_keys" USING btree ("updated_at");
  CREATE INDEX "payload_mcp_api_keys_created_at_idx" ON "payload_mcp_api_keys" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  ALTER TABLE "articles" ADD CONSTRAINT "articles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_cta_buttons" ADD CONSTRAINT "header_cta_buttons_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles" USING btree ("meta_image_id");
  CREATE INDEX "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v" USING btree ("version_meta_image_id");
  CREATE UNIQUE INDEX "media_source_hash_idx" ON "media" USING btree ("source_hash");
  CREATE INDEX "_pages_v_blocks_mortgage_calculator_block_dos_person_ima_idx" ON "_pages_v_blocks_mortgage_calculator_block" USING btree ("dos_person_image_id");
  CREATE INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_mcp_api_keys_id");
  CREATE INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx" ON "payload_preferences_rels" USING btree ("payload_mcp_api_keys_id");
  CREATE INDEX "header_cta_buttons_icon_idx" ON "header_cta_buttons" USING btree ("icon_id");
  ALTER TABLE "pages_blocks_hero_plain_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_hero_plain_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_hero_with_image_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_hero_with_image_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_hero_slider_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_hero_slider_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "heroSearch" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "heroSearch" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "heroCompact" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "heroCompact" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_rich_text_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_rich_text_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_feature_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_feature_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_info_double_image_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_info_double_image_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_info_image_big_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_info_image_big_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_info_video_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_info_video_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_content_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_content_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_callback_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_callback_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_contact_strip_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_contact_strip_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_flash_message_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_flash_message_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_conversions_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_conversions_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_image_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_image_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "jumbotronSticker" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "jumbotronSticker" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_info_desktop_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_info_desktop_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_info_image_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_info_image_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_info_plain_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_info_plain_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_jumbotron_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_jumbotron_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_benefits_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_benefits_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_benefits_with_image_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_benefits_with_image_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "prodCardsVert" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "prodCardsVert" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "prodCardHorz" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "prodCardHorz" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_benefits_with_list_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_benefits_with_list_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_benefits_with_list_block" DROP COLUMN "expanded";
  ALTER TABLE "pages_blocks_info_card_narrow_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_info_card_narrow_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "loyalBenefits" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "loyalBenefits" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_discounts_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_discounts_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_faq_items_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_faq_items_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_info_center_faq_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_info_center_faq_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_info_center_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_info_center_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_video_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_video_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_link_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_link_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "heroReasonsSimpl" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "heroReasonsSimpl" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "etfTable" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "etfTable" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_download_section_block_items" DROP COLUMN "file_url";
  ALTER TABLE "pages_blocks_download_section_block_items" DROP COLUMN "file_size";
  ALTER TABLE "pages_blocks_download_section_block_items" DROP COLUMN "category";
  ALTER TABLE "pages_blocks_download_section_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_download_section_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_exchange_rates_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_exchange_rates_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_compare_table_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_compare_table_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_compare_bonds_table_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_compare_bonds_table_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "tblCardCollapse" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "tblCardCollapse" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "exchCompTable" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "exchCompTable" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_loan_calculator_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_loan_calculator_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_mortgage_calculator_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_mortgage_calculator_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_inflation_calculator_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_inflation_calculator_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_zonky_calculator_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_zonky_calculator_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_zone_interest_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_zone_interest_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_portu_calculator_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_portu_calculator_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "portuPensionCalc" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "portuPensionCalc" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pensionSavCalc" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pensionSavCalc" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_timeline_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_timeline_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "topMgmtCards" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "topMgmtCards" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pressContact" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pressContact" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_logo_carousel_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_logo_carousel_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_feature_application_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_feature_application_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_feature_application_block" DROP COLUMN "app_store_url";
  ALTER TABLE "pages_blocks_feature_application_block" DROP COLUMN "google_play_url";
  ALTER TABLE "pages_blocks_youtube_video_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_youtube_video_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_callback_simplified_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_callback_simplified_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "loyalCustTimeline" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "loyalCustTimeline" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_omnichannel_banner_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_omnichannel_banner_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "prodCardsHorz" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "prodCardsHorz" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_steps_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_steps_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "stepsVertCollapse" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "stepsVertCollapse" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "loyalCustApp" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "loyalCustApp" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "loyalCustApp" DROP COLUMN "app_store_url";
  ALTER TABLE "loyalCustApp" DROP COLUMN "google_play_url";
  ALTER TABLE "pages_blocks_product_banner_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_product_banner_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_homepage_bottom_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_homepage_bottom_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_branch_list_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_branch_list_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_branch_map_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_branch_map_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_branch_map_block" DROP COLUMN "default_zoom";
  ALTER TABLE "pages_blocks_benefits_columns_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_benefits_columns_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_cta_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_cta_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "pages_blocks_product_detail_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "pages_blocks_product_detail_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_hero_plain_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_hero_plain_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_hero_with_image_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_hero_with_image_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_hero_slider_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_hero_slider_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_heroSearch_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_heroSearch_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_heroCompact_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_heroCompact_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_rich_text_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_rich_text_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_feature_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_feature_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_info_double_image_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_info_double_image_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_info_image_big_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_info_image_big_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_info_video_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_info_video_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_content_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_content_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_callback_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_callback_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_contact_strip_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_contact_strip_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_flash_message_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_flash_message_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_conversions_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_conversions_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_image_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_image_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_jumbotronSticker_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_jumbotronSticker_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_info_desktop_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_info_desktop_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_info_image_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_info_image_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_info_plain_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_info_plain_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_jumbotron_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_jumbotron_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_benefits_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_benefits_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_prodCardsVert_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_prodCardsVert_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_prodCardHorz_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_prodCardHorz_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" DROP COLUMN "expanded";
  ALTER TABLE "_pages_v_blocks_info_card_narrow_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_info_card_narrow_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_loyalBenefits_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_loyalBenefits_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_discounts_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_discounts_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_faq_items_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_faq_items_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_info_center_faq_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_info_center_faq_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_info_center_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_info_center_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_video_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_video_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_link_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_link_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_heroReasonsSimpl_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_heroReasonsSimpl_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_etfTable_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_etfTable_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_download_section_block_items" DROP COLUMN "file_url";
  ALTER TABLE "_pages_v_blocks_download_section_block_items" DROP COLUMN "file_size";
  ALTER TABLE "_pages_v_blocks_download_section_block_items" DROP COLUMN "category";
  ALTER TABLE "_pages_v_blocks_download_section_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_download_section_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_exchange_rates_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_exchange_rates_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_compare_table_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_compare_table_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_compare_bonds_table_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_compare_bonds_table_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_tblCardCollapse_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_tblCardCollapse_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_exchCompTable_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_exchCompTable_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_loan_calculator_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_loan_calculator_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_inflation_calculator_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_inflation_calculator_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_zonky_calculator_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_zonky_calculator_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_zone_interest_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_zone_interest_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_portu_calculator_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_portu_calculator_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_portuPensionCalc_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_portuPensionCalc_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pensionSavCalc_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pensionSavCalc_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_timeline_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_timeline_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_topMgmtCards_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_topMgmtCards_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pressContact_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pressContact_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_feature_application_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_feature_application_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_feature_application_block" DROP COLUMN "app_store_url";
  ALTER TABLE "_pages_v_blocks_feature_application_block" DROP COLUMN "google_play_url";
  ALTER TABLE "_pages_v_blocks_youtube_video_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_youtube_video_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_callback_simplified_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_callback_simplified_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_loyalCustTimeline_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_loyalCustTimeline_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_omnichannel_banner_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_omnichannel_banner_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_prodCardsHorz_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_prodCardsHorz_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_steps_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_steps_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_stepsVertCollapse_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_stepsVertCollapse_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_loyalCustApp_v" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_loyalCustApp_v" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_loyalCustApp_v" DROP COLUMN "app_store_url";
  ALTER TABLE "_loyalCustApp_v" DROP COLUMN "google_play_url";
  ALTER TABLE "_pages_v_blocks_product_banner_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_product_banner_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_branch_list_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_branch_list_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_branch_map_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_branch_map_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_branch_map_block" DROP COLUMN "default_zoom";
  ALTER TABLE "_pages_v_blocks_benefits_columns_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_benefits_columns_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_cta_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_cta_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "_pages_v_blocks_product_detail_cards_block" DROP COLUMN "layout_styles_hide_top_padding";
  ALTER TABLE "_pages_v_blocks_product_detail_cards_block" DROP COLUMN "layout_styles_hide_bottom_padding";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_jobs_id";
  ALTER TABLE "header_navigation_children" DROP COLUMN "label";
  ALTER TABLE "header_navigation" DROP COLUMN "label";
  ALTER TABLE "header_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "footer" DROP COLUMN "app_store_ios_url";
  ALTER TABLE "footer" DROP COLUMN "app_store_android_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "heroCompact_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "_heroCompact_v_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_hero_slider_block2_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_slider_block2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_slider_block2_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_slider_block2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_mcp_api_keys" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "business_context" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_slider_block2_slides" CASCADE;
  DROP TABLE "pages_blocks_hero_slider_block2" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slider_block2_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slider_block2" CASCADE;
  DROP TABLE "payload_mcp_api_keys" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "business_context" CASCADE;
  ALTER TABLE "articles" DROP CONSTRAINT "articles_meta_image_id_media_id_fk";
  
  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk";
  
  ALTER TABLE "header_cta_buttons" DROP CONSTRAINT "header_cta_buttons_icon_id_media_id_fk";
  
  ALTER TABLE "header_cta_buttons" ALTER COLUMN "appearance" SET DATA TYPE text;
  ALTER TABLE "header_cta_buttons" ALTER COLUMN "appearance" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_header_cta_buttons_appearance";
  CREATE TYPE "public"."enum_header_cta_buttons_appearance" AS ENUM('primary', 'outline');
  ALTER TABLE "header_cta_buttons" ALTER COLUMN "appearance" SET DEFAULT 'primary'::"public"."enum_header_cta_buttons_appearance";
  ALTER TABLE "header_cta_buttons" ALTER COLUMN "appearance" SET DATA TYPE "public"."enum_header_cta_buttons_appearance" USING "appearance"::"public"."enum_header_cta_buttons_appearance";
  DROP INDEX "articles_meta_meta_image_idx";
  DROP INDEX "_articles_v_version_meta_version_meta_image_idx";
  DROP INDEX "media_source_hash_idx";
  DROP INDEX "_pages_v_blocks_mortgage_calculator_block_dos_person_ima_idx";
  DROP INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx";
  DROP INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx";
  DROP INDEX "header_cta_buttons_icon_idx";
  ALTER TABLE "pages_blocks_hero_plain_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_hero_plain_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_hero_with_image_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_hero_with_image_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_hero_slider_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_hero_slider_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "heroSearch" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "heroSearch" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "heroCompact" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "heroCompact" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_rich_text_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_rich_text_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_feature_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_feature_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_info_double_image_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_info_double_image_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_info_image_big_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_info_image_big_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_info_video_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_info_video_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_content_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_content_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_callback_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_callback_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_contact_strip_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_contact_strip_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_flash_message_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_flash_message_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_conversions_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_conversions_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_image_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_image_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "jumbotronSticker" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "jumbotronSticker" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_info_desktop_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_info_desktop_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_info_image_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_info_image_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_info_plain_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_info_plain_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_jumbotron_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_jumbotron_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_benefits_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_benefits_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_benefits_with_image_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_benefits_with_image_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "prodCardsVert" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "prodCardsVert" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "prodCardHorz" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "prodCardHorz" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_benefits_with_list_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_benefits_with_list_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_benefits_with_list_block" ADD COLUMN "expanded" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_info_card_narrow_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_info_card_narrow_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "loyalBenefits" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "loyalBenefits" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_discounts_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_discounts_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_faq_items_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_faq_items_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_info_center_faq_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_info_center_faq_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_info_center_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_info_center_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_video_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_video_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_link_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_link_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "heroReasonsSimpl" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "heroReasonsSimpl" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "etfTable" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "etfTable" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_download_section_block_items" ADD COLUMN "file_url" varchar;
  ALTER TABLE "pages_blocks_download_section_block_items" ADD COLUMN "file_size" varchar;
  ALTER TABLE "pages_blocks_download_section_block_items" ADD COLUMN "category" varchar;
  ALTER TABLE "pages_blocks_download_section_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_download_section_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_exchange_rates_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_exchange_rates_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_compare_table_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_compare_table_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_compare_bonds_table_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_compare_bonds_table_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "tblCardCollapse" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "tblCardCollapse" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "exchCompTable" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "exchCompTable" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_loan_calculator_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_loan_calculator_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_mortgage_calculator_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_mortgage_calculator_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_inflation_calculator_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_inflation_calculator_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_zonky_calculator_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_zonky_calculator_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_zone_interest_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_zone_interest_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_portu_calculator_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_portu_calculator_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "portuPensionCalc" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "portuPensionCalc" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pensionSavCalc" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pensionSavCalc" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_timeline_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_timeline_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "topMgmtCards" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "topMgmtCards" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pressContact" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pressContact" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_logo_carousel_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_logo_carousel_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_feature_application_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_feature_application_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_feature_application_block" ADD COLUMN "app_store_url" varchar;
  ALTER TABLE "pages_blocks_feature_application_block" ADD COLUMN "google_play_url" varchar;
  ALTER TABLE "pages_blocks_youtube_video_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_youtube_video_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_callback_simplified_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_callback_simplified_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "loyalCustTimeline" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "loyalCustTimeline" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_omnichannel_banner_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_omnichannel_banner_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "prodCardsHorz" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "prodCardsHorz" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_steps_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_steps_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "stepsVertCollapse" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "stepsVertCollapse" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "loyalCustApp" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "loyalCustApp" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "loyalCustApp" ADD COLUMN "app_store_url" varchar;
  ALTER TABLE "loyalCustApp" ADD COLUMN "google_play_url" varchar;
  ALTER TABLE "pages_blocks_product_banner_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_product_banner_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_homepage_bottom_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_homepage_bottom_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_branch_list_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_branch_list_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_branch_map_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_branch_map_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_branch_map_block" ADD COLUMN "default_zoom" numeric DEFAULT 7;
  ALTER TABLE "pages_blocks_benefits_columns_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_benefits_columns_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_cta_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_cta_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "pages_blocks_product_detail_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "pages_blocks_product_detail_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_hero_plain_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_hero_plain_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_hero_with_image_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_hero_with_image_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_hero_slider_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_hero_slider_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_heroSearch_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_heroSearch_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_heroCompact_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_heroCompact_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_feature_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_feature_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_double_image_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_double_image_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_image_big_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_image_big_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_video_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_video_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_content_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_content_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_callback_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_callback_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_contact_strip_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_contact_strip_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_flash_message_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_flash_message_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_conversions_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_conversions_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_image_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_image_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_jumbotronSticker_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_jumbotronSticker_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_desktop_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_desktop_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_image_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_image_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_plain_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_plain_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_jumbotron_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_jumbotron_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_benefits_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_benefits_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_prodCardsVert_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_prodCardsVert_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_prodCardHorz_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_prodCardHorz_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" ADD COLUMN "expanded" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_info_card_narrow_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_card_narrow_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_loyalBenefits_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_loyalBenefits_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_discounts_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_discounts_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_faq_items_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_faq_items_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_center_faq_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_center_faq_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_center_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_info_center_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_video_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_video_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_link_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_link_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_heroReasonsSimpl_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_heroReasonsSimpl_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_etfTable_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_etfTable_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_download_section_block_items" ADD COLUMN "file_url" varchar;
  ALTER TABLE "_pages_v_blocks_download_section_block_items" ADD COLUMN "file_size" varchar;
  ALTER TABLE "_pages_v_blocks_download_section_block_items" ADD COLUMN "category" varchar;
  ALTER TABLE "_pages_v_blocks_download_section_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_download_section_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_exchange_rates_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_exchange_rates_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_compare_table_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_compare_table_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_compare_bonds_table_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_compare_bonds_table_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_tblCardCollapse_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_tblCardCollapse_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_exchCompTable_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_exchCompTable_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_loan_calculator_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_loan_calculator_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_inflation_calculator_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_inflation_calculator_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_zonky_calculator_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_zonky_calculator_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_zone_interest_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_zone_interest_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_portu_calculator_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_portu_calculator_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_portuPensionCalc_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_portuPensionCalc_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pensionSavCalc_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pensionSavCalc_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_timeline_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_timeline_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_topMgmtCards_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_topMgmtCards_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pressContact_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pressContact_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_feature_application_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_feature_application_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_feature_application_block" ADD COLUMN "app_store_url" varchar;
  ALTER TABLE "_pages_v_blocks_feature_application_block" ADD COLUMN "google_play_url" varchar;
  ALTER TABLE "_pages_v_blocks_youtube_video_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_youtube_video_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_callback_simplified_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_callback_simplified_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_loyalCustTimeline_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_loyalCustTimeline_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_omnichannel_banner_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_omnichannel_banner_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_prodCardsHorz_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_prodCardsHorz_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_stepsVertCollapse_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_stepsVertCollapse_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_loyalCustApp_v" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_loyalCustApp_v" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_loyalCustApp_v" ADD COLUMN "app_store_url" varchar;
  ALTER TABLE "_loyalCustApp_v" ADD COLUMN "google_play_url" varchar;
  ALTER TABLE "_pages_v_blocks_product_banner_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_product_banner_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_branch_list_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_branch_list_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_branch_map_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_branch_map_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_branch_map_block" ADD COLUMN "default_zoom" numeric DEFAULT 7;
  ALTER TABLE "_pages_v_blocks_benefits_columns_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_benefits_columns_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_cta_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_cta_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "_pages_v_blocks_product_detail_cards_block" ADD COLUMN "layout_styles_hide_top_padding" boolean;
  ALTER TABLE "_pages_v_blocks_product_detail_cards_block" ADD COLUMN "layout_styles_hide_bottom_padding" boolean;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_jobs_id" integer;
  ALTER TABLE "header_navigation_children" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "header_navigation" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "header_cta_buttons" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "app_store_ios_url" varchar;
  ALTER TABLE "footer" ADD COLUMN "app_store_android_url" varchar;
  ALTER TABLE "heroCompact_breadcrumbs" ADD CONSTRAINT "heroCompact_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."heroCompact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heroCompact_v_breadcrumbs" ADD CONSTRAINT "_heroCompact_v_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_heroCompact_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "heroCompact_breadcrumbs_order_idx" ON "heroCompact_breadcrumbs" USING btree ("_order");
  CREATE INDEX "heroCompact_breadcrumbs_parent_id_idx" ON "heroCompact_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_heroCompact_v_breadcrumbs_order_idx" ON "_heroCompact_v_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_heroCompact_v_breadcrumbs_parent_id_idx" ON "_heroCompact_v_breadcrumbs" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_mortgage_calculator_block_dos_person_image_idx" ON "_pages_v_blocks_mortgage_calculator_block" USING btree ("dos_person_image_id");
  CREATE INDEX "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  ALTER TABLE "articles" DROP COLUMN "meta_title";
  ALTER TABLE "articles" DROP COLUMN "meta_description";
  ALTER TABLE "articles" DROP COLUMN "meta_image_id";
  ALTER TABLE "articles" DROP COLUMN "ai_summary";
  ALTER TABLE "articles" DROP COLUMN "ai_validation_seo";
  ALTER TABLE "articles" DROP COLUMN "ai_validation_geo";
  ALTER TABLE "articles" DROP COLUMN "ai_validation_updated_at";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_ai_summary";
  ALTER TABLE "_articles_v" DROP COLUMN "version_ai_validation_seo";
  ALTER TABLE "_articles_v" DROP COLUMN "version_ai_validation_geo";
  ALTER TABLE "_articles_v" DROP COLUMN "version_ai_validation_updated_at";
  ALTER TABLE "media" DROP COLUMN "source_hash";
  ALTER TABLE "pages_blocks_rich_text_block" DROP COLUMN "background_color";
  ALTER TABLE "pages_blocks_rich_text_block" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_benefits_with_list_block" DROP COLUMN "background_color";
  ALTER TABLE "pages_blocks_faq_items_block" DROP COLUMN "background_color";
  ALTER TABLE "pages" DROP COLUMN "ab_preview_segment";
  ALTER TABLE "pages" DROP COLUMN "ai_summary";
  ALTER TABLE "pages" DROP COLUMN "ai_validation_seo";
  ALTER TABLE "pages" DROP COLUMN "ai_validation_geo";
  ALTER TABLE "pages" DROP COLUMN "ai_validation_updated_at";
  ALTER TABLE "pages" DROP COLUMN "ab_enabled";
  ALTER TABLE "_pages_v_blocks_rich_text_block" DROP COLUMN "background_color";
  ALTER TABLE "_pages_v_blocks_rich_text_block" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" DROP COLUMN "background_color";
  ALTER TABLE "_pages_v_blocks_faq_items_block" DROP COLUMN "background_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_ab_preview_segment";
  ALTER TABLE "_pages_v" DROP COLUMN "version_ai_summary";
  ALTER TABLE "_pages_v" DROP COLUMN "version_ai_validation_seo";
  ALTER TABLE "_pages_v" DROP COLUMN "version_ai_validation_geo";
  ALTER TABLE "_pages_v" DROP COLUMN "version_ai_validation_updated_at";
  ALTER TABLE "_pages_v" DROP COLUMN "version_ab_enabled";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_mcp_api_keys_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "payload_mcp_api_keys_id";
  ALTER TABLE "header_navigation_children" DROP COLUMN "label_cs";
  ALTER TABLE "header_navigation_children" DROP COLUMN "label_en";
  ALTER TABLE "header_navigation" DROP COLUMN "label_cs";
  ALTER TABLE "header_navigation" DROP COLUMN "label_en";
  ALTER TABLE "header_cta_buttons" DROP COLUMN "label_cs";
  ALTER TABLE "header_cta_buttons" DROP COLUMN "label_en";
  ALTER TABLE "header_cta_buttons" DROP COLUMN "icon_id";
  ALTER TABLE "settings" DROP COLUMN "app_store_ios_url";
  ALTER TABLE "settings" DROP COLUMN "app_store_android_url";
  DROP TYPE "public"."enum_pages_blocks_hero_slider_block2_slides_background_color";
  DROP TYPE "public"."enum_pages_blocks_rich_text_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_rich_text_block_variant";
  DROP TYPE "public"."enum_pages_blocks_benefits_with_list_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_faq_items_block_background_color";
  DROP TYPE "public"."enum_pages_ab_preview_segment";
  DROP TYPE "public"."enum__pages_v_blocks_hero_slider_block2_slides_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_block_variant";
  DROP TYPE "public"."enum__pages_v_blocks_benefits_with_list_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_faq_items_block_background_color";
  DROP TYPE "public"."enum__pages_v_version_ab_preview_segment";`)
}
