import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_blocks_hero_plain_block_links_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_plain_block_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum_pages_blocks_hero_plain_block_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_hero_with_image_block_links_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_with_image_block_background_color" AS ENUM('white', 'green', 'lightGreen', 'lightGrey');
  CREATE TYPE "public"."enum_pages_blocks_hero_with_image_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_hero_slider_block_slides_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum_heroSearch_links_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum_heroSearch_background_color" AS ENUM('green', 'white');
  CREATE TYPE "public"."enum_heroCompact_links_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum_heroCompact_background_color" AS ENUM('white', 'green', 'lightGreen', 'lightGrey');
  CREATE TYPE "public"."enum_pages_blocks_feature_block_links_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_feature_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_feature_block_background_color" AS ENUM('white', 'lightGrey', 'green');
  CREATE TYPE "public"."enum_pages_blocks_info_image_big_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_info_video_block_video_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_callback_block_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum_pages_blocks_contact_strip_block_background_color" AS ENUM('green', 'lightGreen');
  CREATE TYPE "public"."enum_pages_blocks_conversions_block_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum_pages_blocks_image_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_jumbotronSticker_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum_pages_blocks_info_desktop_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_info_desktop_block_background_color" AS ENUM('white', 'lightGrey');
  CREATE TYPE "public"."enum_pages_blocks_info_image_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_info_plain_block_background_color" AS ENUM('white', 'green', 'lightGrey');
  CREATE TYPE "public"."enum_pages_blocks_jumbotron_block_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum_pages_blocks_benefits_block_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_benefits_with_image_block_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_prodCardsVert_items_icon" AS ENUM('creditCard', 'wallet', 'phone', 'shield', 'chart', 'piggyBank', 'home', 'transfer', 'globe', 'calculator', 'clock', 'star', 'check', 'arrowRight', 'info', 'lightbulb');
  CREATE TYPE "public"."enum_pages_blocks_info_center_faq_block_items_icon" AS ENUM('creditCard', 'wallet', 'phone', 'shield', 'chart', 'piggyBank', 'home', 'transfer', 'globe', 'calculator', 'info', 'lightbulb');
  CREATE TYPE "public"."enum_pages_blocks_feature_application_block_reviews_store" AS ENUM('appStore', 'googlePlay');
  CREATE TYPE "public"."enum_pages_blocks_omnichannel_banner_block_background_color" AS ENUM('green', 'lightGreen');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_plain_block_links_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_plain_block_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_plain_block_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_with_image_block_links_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_with_image_block_background_color" AS ENUM('white', 'green', 'lightGreen', 'lightGrey');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_with_image_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_slider_block_slides_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum__heroSearch_v_links_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum__heroSearch_v_background_color" AS ENUM('green', 'white');
  CREATE TYPE "public"."enum__heroCompact_v_links_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum__heroCompact_v_background_color" AS ENUM('white', 'green', 'lightGreen', 'lightGrey');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_links_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_background_color" AS ENUM('white', 'lightGrey', 'green');
  CREATE TYPE "public"."enum__pages_v_blocks_info_image_big_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_info_video_block_video_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_callback_block_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_strip_block_background_color" AS ENUM('green', 'lightGreen');
  CREATE TYPE "public"."enum__pages_v_blocks_conversions_block_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum__pages_v_blocks_image_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__jumbotronSticker_v_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum__pages_v_blocks_info_desktop_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_info_desktop_block_background_color" AS ENUM('white', 'lightGrey');
  CREATE TYPE "public"."enum__pages_v_blocks_info_image_block_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_info_plain_block_background_color" AS ENUM('white', 'green', 'lightGrey');
  CREATE TYPE "public"."enum__pages_v_blocks_jumbotron_block_background_color" AS ENUM('green', 'white', 'lightGrey');
  CREATE TYPE "public"."enum__pages_v_blocks_benefits_block_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_benefits_with_image_block_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__prodCardsVert_v_items_icon" AS ENUM('creditCard', 'wallet', 'phone', 'shield', 'chart', 'piggyBank', 'home', 'transfer', 'globe', 'calculator', 'clock', 'star', 'check', 'arrowRight', 'info', 'lightbulb');
  CREATE TYPE "public"."enum__pages_v_blocks_info_center_faq_block_items_icon" AS ENUM('creditCard', 'wallet', 'phone', 'shield', 'chart', 'piggyBank', 'home', 'transfer', 'globe', 'calculator', 'info', 'lightbulb');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_application_block_reviews_store" AS ENUM('appStore', 'googlePlay');
  CREATE TYPE "public"."enum__pages_v_blocks_omnichannel_banner_block_background_color" AS ENUM('green', 'lightGreen');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('editor', 'admin');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_header_navigation_children_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_navigation_children_link_appearance" AS ENUM('default', 'primary', 'outline', 'link');
  CREATE TYPE "public"."enum_header_navigation_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_navigation_link_appearance" AS ENUM('default', 'primary', 'outline', 'link');
  CREATE TYPE "public"."enum_header_cta_buttons_appearance" AS ENUM('primary', 'outline');
  CREATE TYPE "public"."enum_footer_columns_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_columns_items_link_appearance" AS ENUM('default', 'primary', 'outline', 'link');
  CREATE TYPE "public"."enum_settings_socials_type" AS ENUM('facebook', 'instagram', 'twitter', 'youtube', 'linkedin', 'tiktok');
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"category_id" integer,
  	"image_id" integer,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_category_id" integer,
  	"version_image_id" integer,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "assets" (
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
  	"focal_y" numeric
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"sizes_preview_url" varchar,
  	"sizes_preview_width" numeric,
  	"sizes_preview_height" numeric,
  	"sizes_preview_mime_type" varchar,
  	"sizes_preview_filesize" numeric,
  	"sizes_preview_filename" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_plain_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"appearance" "enum_pages_blocks_hero_plain_block_links_appearance" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_hero_plain_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"background_color" "enum_pages_blocks_hero_plain_block_background_color" DEFAULT 'green',
  	"text_align" "enum_pages_blocks_hero_plain_block_text_align" DEFAULT 'left',
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_with_image_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"appearance" "enum_pages_blocks_hero_with_image_block_links_appearance" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_hero_with_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"background_color" "enum_pages_blocks_hero_with_image_block_background_color" DEFAULT 'white',
  	"image_position" "enum_pages_blocks_hero_with_image_block_image_position" DEFAULT 'right',
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_slider_block_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"background_color" "enum_pages_blocks_hero_slider_block_slides_background_color" DEFAULT 'green',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_slider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"auto_play" boolean DEFAULT true,
  	"auto_play_interval" numeric DEFAULT 5000,
  	"block_name" varchar
  );
  
  CREATE TABLE "heroSearch_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"appearance" "enum_heroSearch_links_appearance" DEFAULT 'primary'
  );
  
  CREATE TABLE "heroSearch" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"search_placeholder" varchar DEFAULT 'Co hledáte?',
  	"background_color" "enum_heroSearch_background_color" DEFAULT 'green',
  	"block_name" varchar
  );
  
  CREATE TABLE "heroCompact_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"appearance" "enum_heroCompact_links_appearance" DEFAULT 'primary'
  );
  
  CREATE TABLE "heroCompact_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "heroCompact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"background_color" "enum_heroCompact_background_color" DEFAULT 'white',
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"content" jsonb,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"appearance" "enum_pages_blocks_feature_block_links_appearance" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_feature_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_feature_block_image_position" DEFAULT 'right',
  	"background_color" "enum_pages_blocks_feature_block_background_color" DEFAULT 'white',
  	"image_overflow" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_double_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"image_left_id" integer,
  	"image_right_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_image_big_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_info_image_big_block_image_position" DEFAULT 'left',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"video_url" varchar,
  	"video_position" "enum_pages_blocks_info_video_block_video_position" DEFAULT 'right',
  	"thumbnail_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_content_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_callback_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"background_color" "enum_pages_blocks_callback_block_background_color" DEFAULT 'green',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_strip_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"background_color" "enum_pages_blocks_contact_strip_block_background_color" DEFAULT 'green',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_flash_message_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'TIP',
  	"content" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_conversions_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_conversions_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"background_color" "enum_pages_blocks_conversions_block_background_color" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_image_block_image_position" DEFAULT 'right',
  	"link_label" varchar,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "jumbotronSticker" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"sticker_text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"background_color" "enum_jumbotronSticker_background_color" DEFAULT 'green',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_desktop_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_info_desktop_block_image_position" DEFAULT 'right',
  	"background_color" "enum_pages_blocks_info_desktop_block_background_color" DEFAULT 'white',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_info_image_block_image_position" DEFAULT 'right',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_plain_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"content" jsonb,
  	"background_color" "enum_pages_blocks_info_plain_block_background_color" DEFAULT 'white',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_jumbotron_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"background_color" "enum_pages_blocks_jumbotron_block_background_color" DEFAULT 'green',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum_pages_blocks_benefits_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_with_image_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_with_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum_pages_blocks_benefits_with_image_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "prodCardsVert_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_prodCardsVert_items_icon",
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "prodCardsVert" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "prodCardHorz_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "prodCardHorz" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_with_list_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_with_list_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_with_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"expanded" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_card_narrow_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_info_card_narrow_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "loyalBenefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"before_value" varchar,
  	"after_value" varchar,
  	"highlight" boolean
  );
  
  CREATE TABLE "loyalBenefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"before_title" varchar DEFAULT 'Platím',
  	"after_title" varchar DEFAULT 'Žiju s Air Bank',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_discounts_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"discount" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_discounts_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"items_per_page" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq_items_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"numbered" boolean DEFAULT true,
  	"allow_multiple" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_center_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_info_center_faq_block_items_icon",
  	"question" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_info_center_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_center_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_info_center_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"video_url" varchar
  );
  
  CREATE TABLE "pages_blocks_video_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_link_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_link_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "heroReasonsSimpl_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"title" varchar,
  	"url" varchar,
  	"image_id" integer,
  	"description" varchar
  );
  
  CREATE TABLE "heroReasonsSimpl" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"counter_text" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "etfTable_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "etfTable_rows_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "etfTable_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "etfTable" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_download_section_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"file_url" varchar,
  	"file_size" varchar,
  	"category" varchar
  );
  
  CREATE TABLE "pages_blocks_download_section_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_exchange_rates_block_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"currency_code" varchar,
  	"currency_name" varchar,
  	"country" varchar,
  	"buy_rate" varchar,
  	"sell_rate" varchar,
  	"mid_rate" varchar
  );
  
  CREATE TABLE "pages_blocks_exchange_rates_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"last_updated" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_compare_table_block_banks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_compare_table_block_features_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"subtitle" varchar,
  	"highlighted" boolean
  );
  
  CREATE TABLE "pages_blocks_compare_table_block_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_compare_table_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_compare_bonds_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"period" varchar,
  	"interest_rate" varchar,
  	"min_amount" varchar,
  	"highlighted" boolean
  );
  
  CREATE TABLE "pages_blocks_compare_bonds_table_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "tblCardCollapse_sections_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "tblCardCollapse_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_title" varchar
  );
  
  CREATE TABLE "tblCardCollapse" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "exchCompTable_providers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "exchCompTable_currencies_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"highlighted" boolean
  );
  
  CREATE TABLE "exchCompTable_currencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "exchCompTable" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_loan_calculator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Kalkulačka půjčky',
  	"min_amount" numeric DEFAULT 20000,
  	"max_amount" numeric DEFAULT 800000,
  	"default_amount" numeric DEFAULT 200000,
  	"min_months" numeric DEFAULT 6,
  	"max_months" numeric DEFAULT 96,
  	"default_months" numeric DEFAULT 36,
  	"interest_rate" numeric DEFAULT 4.9,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_mortgage_calculator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Hypoteční kalkulačka',
  	"min_amount" numeric DEFAULT 500000,
  	"max_amount" numeric DEFAULT 10000000,
  	"default_amount" numeric DEFAULT 3000000,
  	"min_years" numeric DEFAULT 5,
  	"max_years" numeric DEFAULT 30,
  	"default_years" numeric DEFAULT 20,
  	"interest_rate" numeric DEFAULT 5.49,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_inflation_calculator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Inflační kalkulačka',
  	"default_amount" numeric DEFAULT 100000,
  	"min_years" numeric DEFAULT 1,
  	"max_years" numeric DEFAULT 30,
  	"default_years" numeric DEFAULT 10,
  	"default_inflation" numeric DEFAULT 3,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_zonky_calculator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Investiční kalkulačka',
  	"min_amount" numeric DEFAULT 10000,
  	"max_amount" numeric DEFAULT 5000000,
  	"default_amount" numeric DEFAULT 500000,
  	"min_years" numeric DEFAULT 1,
  	"max_years" numeric DEFAULT 30,
  	"default_years" numeric DEFAULT 10,
  	"expected_return" numeric DEFAULT 7,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_zone_interest_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Graf spoření',
  	"monthly_deposit" numeric DEFAULT 5000,
  	"interest_rate" numeric DEFAULT 3,
  	"years" numeric DEFAULT 10,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_portu_calculator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Portu kalkulacka',
  	"min_amount" numeric DEFAULT 10000,
  	"max_amount" numeric DEFAULT 5000000,
  	"default_amount" numeric DEFAULT 500000,
  	"min_years" numeric DEFAULT 1,
  	"max_years" numeric DEFAULT 30,
  	"default_years" numeric DEFAULT 10,
  	"expected_return" numeric DEFAULT 6,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portuPensionCalc" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Portu DIP kalkulacka',
  	"min_monthly" numeric DEFAULT 500,
  	"max_monthly" numeric DEFAULT 10000,
  	"default_monthly" numeric DEFAULT 3000,
  	"min_years" numeric DEFAULT 5,
  	"max_years" numeric DEFAULT 40,
  	"default_years" numeric DEFAULT 20,
  	"expected_return" numeric DEFAULT 5,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pensionSavCalc" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'DPS kalkulacka',
  	"min_monthly" numeric DEFAULT 300,
  	"max_monthly" numeric DEFAULT 10000,
  	"default_monthly" numeric DEFAULT 1000,
  	"min_years" numeric DEFAULT 5,
  	"max_years" numeric DEFAULT 40,
  	"default_years" numeric DEFAULT 20,
  	"expected_return" numeric DEFAULT 4,
  	"state_contribution" numeric DEFAULT 230,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "topMgmtCards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"image_id" integer,
  	"linkedin_url" varchar
  );
  
  CREATE TABLE "topMgmtCards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pressContact_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pressContact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_carousel_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_application_block_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author" varchar,
  	"date" varchar,
  	"title" varchar,
  	"text" varchar,
  	"stars" numeric DEFAULT 5,
  	"store" "enum_pages_blocks_feature_application_block_reviews_store"
  );
  
  CREATE TABLE "pages_blocks_feature_application_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"app_store_url" varchar,
  	"google_play_url" varchar,
  	"rating" varchar DEFAULT '4.9',
  	"rating_count" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_youtube_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"video_url" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_callback_simplified_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Kontaktujte nás',
  	"description" varchar,
  	"email_to" varchar,
  	"show_phone" boolean DEFAULT true,
  	"show_subject" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "loyalCustTimeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "loyalCustTimeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_omnichannel_banner_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_omnichannel_banner_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"background_color" "enum_pages_blocks_omnichannel_banner_block_background_color" DEFAULT 'green',
  	"block_name" varchar
  );
  
  CREATE TABLE "prodCardsHorz_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "prodCardsHorz" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_number" numeric,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stepsVertCollapse_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "stepsVertCollapse" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "loyalCustApp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"app_store_url" varchar,
  	"google_play_url" varchar,
  	"rating" varchar DEFAULT '4.8',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_banner_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"label" varchar,
  	"url" varchar,
  	"is_button" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_product_banner_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_homepage_bottom_block_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"currency" varchar,
  	"buy_rate" varchar,
  	"sell_rate" varchar,
  	"flag_icon_id" integer
  );
  
  CREATE TABLE "pages_blocks_homepage_bottom_block_news" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_homepage_bottom_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"rates_title" varchar DEFAULT 'Kurzovní lístek',
  	"rates_link_label" varchar,
  	"rates_link_url" varchar,
  	"news_title" varchar DEFAULT 'Co je u nás nového',
  	"news_link_label" varchar,
  	"news_link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_columns_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_columns_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"link_label" varchar,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"parent_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_blocks_hero_plain_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"appearance" "enum__pages_v_blocks_hero_plain_block_links_appearance" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_plain_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"background_color" "enum__pages_v_blocks_hero_plain_block_background_color" DEFAULT 'green',
  	"text_align" "enum__pages_v_blocks_hero_plain_block_text_align" DEFAULT 'left',
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_with_image_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"appearance" "enum__pages_v_blocks_hero_with_image_block_links_appearance" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_with_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"background_color" "enum__pages_v_blocks_hero_with_image_block_background_color" DEFAULT 'white',
  	"image_position" "enum__pages_v_blocks_hero_with_image_block_image_position" DEFAULT 'right',
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slider_block_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"background_color" "enum__pages_v_blocks_hero_slider_block_slides_background_color" DEFAULT 'green',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"auto_play" boolean DEFAULT true,
  	"auto_play_interval" numeric DEFAULT 5000,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_heroSearch_v_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"appearance" "enum__heroSearch_v_links_appearance" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_heroSearch_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"search_placeholder" varchar DEFAULT 'Co hledáte?',
  	"background_color" "enum__heroSearch_v_background_color" DEFAULT 'green',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_heroCompact_v_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"appearance" "enum__heroCompact_v_links_appearance" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_heroCompact_v_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_heroCompact_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"background_color" "enum__heroCompact_v_background_color" DEFAULT 'white',
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"content" jsonb,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"appearance" "enum__pages_v_blocks_feature_block_links_appearance" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_feature_block_image_position" DEFAULT 'right',
  	"background_color" "enum__pages_v_blocks_feature_block_background_color" DEFAULT 'white',
  	"image_overflow" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_double_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"image_left_id" integer,
  	"image_right_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_image_big_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_info_image_big_block_image_position" DEFAULT 'left',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"video_url" varchar,
  	"video_position" "enum__pages_v_blocks_info_video_block_video_position" DEFAULT 'right',
  	"thumbnail_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_callback_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"background_color" "enum__pages_v_blocks_callback_block_background_color" DEFAULT 'green',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_strip_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"background_color" "enum__pages_v_blocks_contact_strip_block_background_color" DEFAULT 'green',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_flash_message_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'TIP',
  	"content" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_conversions_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_conversions_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"background_color" "enum__pages_v_blocks_conversions_block_background_color" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_image_block_image_position" DEFAULT 'right',
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jumbotronSticker_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"sticker_text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"background_color" "enum__jumbotronSticker_v_background_color" DEFAULT 'green',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_desktop_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_info_desktop_block_image_position" DEFAULT 'right',
  	"background_color" "enum__pages_v_blocks_info_desktop_block_background_color" DEFAULT 'white',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_info_image_block_image_position" DEFAULT 'right',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_plain_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"content" jsonb,
  	"background_color" "enum__pages_v_blocks_info_plain_block_background_color" DEFAULT 'white',
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_jumbotron_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"secondary_link_label" varchar,
  	"secondary_link_url" varchar,
  	"background_color" "enum__pages_v_blocks_jumbotron_block_background_color" DEFAULT 'green',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum__pages_v_blocks_benefits_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_with_image_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_with_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"columns" "enum__pages_v_blocks_benefits_with_image_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prodCardsVert_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__prodCardsVert_v_items_icon",
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_prodCardsVert_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prodCardHorz_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_prodCardHorz_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_with_list_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_with_list_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_with_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"expanded" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_card_narrow_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_card_narrow_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_loyalBenefits_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"before_value" varchar,
  	"after_value" varchar,
  	"highlight" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_loyalBenefits_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"before_title" varchar DEFAULT 'Platím',
  	"after_title" varchar DEFAULT 'Žiju s Air Bank',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_discounts_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"discount" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_discounts_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"items_per_page" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"numbered" boolean DEFAULT true,
  	"allow_multiple" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_center_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_info_center_faq_block_items_icon",
  	"question" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_center_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_center_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_center_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"video_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_link_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_link_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_heroReasonsSimpl_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"title" varchar,
  	"url" varchar,
  	"image_id" integer,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_heroReasonsSimpl_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"counter_text" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_etfTable_v_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_etfTable_v_rows_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_etfTable_v_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_etfTable_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_download_section_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"file_url" varchar,
  	"file_size" varchar,
  	"category" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_download_section_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_exchange_rates_block_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"currency_code" varchar,
  	"currency_name" varchar,
  	"country" varchar,
  	"buy_rate" varchar,
  	"sell_rate" varchar,
  	"mid_rate" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_exchange_rates_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"last_updated" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_table_block_banks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_table_block_features_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"subtitle" varchar,
  	"highlighted" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_table_block_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_table_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_bonds_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"period" varchar,
  	"interest_rate" varchar,
  	"min_amount" varchar,
  	"highlighted" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_bonds_table_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_tblCardCollapse_v_sections_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tblCardCollapse_v_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tblCardCollapse_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_exchCompTable_v_providers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_exchCompTable_v_currencies_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"highlighted" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_exchCompTable_v_currencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_exchCompTable_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_loan_calculator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Kalkulačka půjčky',
  	"min_amount" numeric DEFAULT 20000,
  	"max_amount" numeric DEFAULT 800000,
  	"default_amount" numeric DEFAULT 200000,
  	"min_months" numeric DEFAULT 6,
  	"max_months" numeric DEFAULT 96,
  	"default_months" numeric DEFAULT 36,
  	"interest_rate" numeric DEFAULT 4.9,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mortgage_calculator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Hypoteční kalkulačka',
  	"min_amount" numeric DEFAULT 500000,
  	"max_amount" numeric DEFAULT 10000000,
  	"default_amount" numeric DEFAULT 3000000,
  	"min_years" numeric DEFAULT 5,
  	"max_years" numeric DEFAULT 30,
  	"default_years" numeric DEFAULT 20,
  	"interest_rate" numeric DEFAULT 5.49,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_inflation_calculator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Inflační kalkulačka',
  	"default_amount" numeric DEFAULT 100000,
  	"min_years" numeric DEFAULT 1,
  	"max_years" numeric DEFAULT 30,
  	"default_years" numeric DEFAULT 10,
  	"default_inflation" numeric DEFAULT 3,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_zonky_calculator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Investiční kalkulačka',
  	"min_amount" numeric DEFAULT 10000,
  	"max_amount" numeric DEFAULT 5000000,
  	"default_amount" numeric DEFAULT 500000,
  	"min_years" numeric DEFAULT 1,
  	"max_years" numeric DEFAULT 30,
  	"default_years" numeric DEFAULT 10,
  	"expected_return" numeric DEFAULT 7,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_zone_interest_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Graf spoření',
  	"monthly_deposit" numeric DEFAULT 5000,
  	"interest_rate" numeric DEFAULT 3,
  	"years" numeric DEFAULT 10,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_portu_calculator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Portu kalkulacka',
  	"min_amount" numeric DEFAULT 10000,
  	"max_amount" numeric DEFAULT 5000000,
  	"default_amount" numeric DEFAULT 500000,
  	"min_years" numeric DEFAULT 1,
  	"max_years" numeric DEFAULT 30,
  	"default_years" numeric DEFAULT 10,
  	"expected_return" numeric DEFAULT 6,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portuPensionCalc_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Portu DIP kalkulacka',
  	"min_monthly" numeric DEFAULT 500,
  	"max_monthly" numeric DEFAULT 10000,
  	"default_monthly" numeric DEFAULT 3000,
  	"min_years" numeric DEFAULT 5,
  	"max_years" numeric DEFAULT 40,
  	"default_years" numeric DEFAULT 20,
  	"expected_return" numeric DEFAULT 5,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pensionSavCalc_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'DPS kalkulacka',
  	"min_monthly" numeric DEFAULT 300,
  	"max_monthly" numeric DEFAULT 10000,
  	"default_monthly" numeric DEFAULT 1000,
  	"min_years" numeric DEFAULT 5,
  	"max_years" numeric DEFAULT 40,
  	"default_years" numeric DEFAULT 20,
  	"expected_return" numeric DEFAULT 4,
  	"state_contribution" numeric DEFAULT 230,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_topMgmtCards_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"image_id" integer,
  	"linkedin_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_topMgmtCards_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pressContact_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pressContact_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_carousel_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_application_block_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar,
  	"date" varchar,
  	"title" varchar,
  	"text" varchar,
  	"stars" numeric DEFAULT 5,
  	"store" "enum__pages_v_blocks_feature_application_block_reviews_store",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_application_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"app_store_url" varchar,
  	"google_play_url" varchar,
  	"rating" varchar DEFAULT '4.9',
  	"rating_count" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_youtube_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"video_url" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_callback_simplified_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar DEFAULT 'Kontaktujte nás',
  	"description" varchar,
  	"email_to" varchar,
  	"show_phone" boolean DEFAULT true,
  	"show_subject" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_loyalCustTimeline_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_loyalCustTimeline_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_omnichannel_banner_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_omnichannel_banner_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"background_color" "enum__pages_v_blocks_omnichannel_banner_block_background_color" DEFAULT 'green',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prodCardsHorz_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_prodCardsHorz_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step_number" numeric,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stepsVertCollapse_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stepsVertCollapse_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_loyalCustApp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"app_store_url" varchar,
  	"google_play_url" varchar,
  	"rating" varchar DEFAULT '4.8',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_banner_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"label" varchar,
  	"url" varchar,
  	"is_button" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_banner_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_homepage_bottom_block_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"currency" varchar,
  	"buy_rate" varchar,
  	"sell_rate" varchar,
  	"flag_icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_homepage_bottom_block_news" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_homepage_bottom_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"rates_title" varchar DEFAULT 'Kurzovní lístek',
  	"rates_link_label" varchar,
  	"rates_link_url" varchar,
  	"news_title" varchar DEFAULT 'Co je u nás nového',
  	"news_link_label" varchar,
  	"news_link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_columns_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_columns_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"title" varchar,
  	"description" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_parent_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
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
  	"role" "enum_users_role" DEFAULT 'editor',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "third_party_access" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"categories_id" integer,
  	"articles_id" integer
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"articles_id" integer,
  	"assets_id" integer,
  	"categories_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"users_id" integer,
  	"third_party_access_id" integer,
  	"search_id" integer,
  	"redirects_id" integer,
  	"payload_jobs_id" integer
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
  	"users_id" integer,
  	"third_party_access_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_navigation_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_header_navigation_children_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_header_navigation_children_link_appearance" DEFAULT 'default' NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "header_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_header_navigation_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_header_navigation_link_appearance" DEFAULT 'default' NOT NULL
  );
  
  CREATE TABLE "header_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"appearance" "enum_header_cta_buttons_appearance" DEFAULT 'primary'
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "footer_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_columns_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_footer_columns_items_link_appearance" DEFAULT 'default' NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"app_store_ios_url" varchar,
  	"app_store_android_url" varchar,
  	"copyright_text" varchar DEFAULT '© Air Bank a.s.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"type" "enum_settings_socials_type" NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_plain_block_links" ADD CONSTRAINT "pages_blocks_hero_plain_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_plain_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_plain_block" ADD CONSTRAINT "pages_blocks_hero_plain_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_plain_block" ADD CONSTRAINT "pages_blocks_hero_plain_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_with_image_block_links" ADD CONSTRAINT "pages_blocks_hero_with_image_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_with_image_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_with_image_block" ADD CONSTRAINT "pages_blocks_hero_with_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_with_image_block" ADD CONSTRAINT "pages_blocks_hero_with_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_block_slides" ADD CONSTRAINT "pages_blocks_hero_slider_block_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_block_slides" ADD CONSTRAINT "pages_blocks_hero_slider_block_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slider_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_block" ADD CONSTRAINT "pages_blocks_hero_slider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heroSearch_links" ADD CONSTRAINT "heroSearch_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."heroSearch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heroSearch" ADD CONSTRAINT "heroSearch_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "heroSearch" ADD CONSTRAINT "heroSearch_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heroCompact_links" ADD CONSTRAINT "heroCompact_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."heroCompact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heroCompact_breadcrumbs" ADD CONSTRAINT "heroCompact_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."heroCompact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heroCompact" ADD CONSTRAINT "heroCompact_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "heroCompact" ADD CONSTRAINT "heroCompact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_block" ADD CONSTRAINT "pages_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_block_links" ADD CONSTRAINT "pages_blocks_feature_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_block" ADD CONSTRAINT "pages_blocks_feature_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_block" ADD CONSTRAINT "pages_blocks_feature_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_double_image_block" ADD CONSTRAINT "pages_blocks_info_double_image_block_image_left_id_media_id_fk" FOREIGN KEY ("image_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_double_image_block" ADD CONSTRAINT "pages_blocks_info_double_image_block_image_right_id_media_id_fk" FOREIGN KEY ("image_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_double_image_block" ADD CONSTRAINT "pages_blocks_info_double_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_image_big_block" ADD CONSTRAINT "pages_blocks_info_image_big_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_image_big_block" ADD CONSTRAINT "pages_blocks_info_image_big_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_video_block" ADD CONSTRAINT "pages_blocks_info_video_block_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_video_block" ADD CONSTRAINT "pages_blocks_info_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_cards_block_items" ADD CONSTRAINT "pages_blocks_content_cards_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_cards_block_items" ADD CONSTRAINT "pages_blocks_content_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_cards_block" ADD CONSTRAINT "pages_blocks_content_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_callback_block" ADD CONSTRAINT "pages_blocks_callback_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_callback_block" ADD CONSTRAINT "pages_blocks_callback_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_strip_block" ADD CONSTRAINT "pages_blocks_contact_strip_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_flash_message_block" ADD CONSTRAINT "pages_blocks_flash_message_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_conversions_block_items" ADD CONSTRAINT "pages_blocks_conversions_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_conversions_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_conversions_block" ADD CONSTRAINT "pages_blocks_conversions_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_block" ADD CONSTRAINT "pages_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_block" ADD CONSTRAINT "pages_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jumbotronSticker" ADD CONSTRAINT "jumbotronSticker_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jumbotronSticker" ADD CONSTRAINT "jumbotronSticker_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_desktop_block" ADD CONSTRAINT "pages_blocks_info_desktop_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_desktop_block" ADD CONSTRAINT "pages_blocks_info_desktop_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_image_block" ADD CONSTRAINT "pages_blocks_info_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_image_block" ADD CONSTRAINT "pages_blocks_info_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_plain_block" ADD CONSTRAINT "pages_blocks_info_plain_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_jumbotron_block" ADD CONSTRAINT "pages_blocks_jumbotron_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_jumbotron_block" ADD CONSTRAINT "pages_blocks_jumbotron_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_block_items" ADD CONSTRAINT "pages_blocks_benefits_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_block_items" ADD CONSTRAINT "pages_blocks_benefits_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_benefits_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_block" ADD CONSTRAINT "pages_blocks_benefits_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_with_image_block_items" ADD CONSTRAINT "pages_blocks_benefits_with_image_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_with_image_block_items" ADD CONSTRAINT "pages_blocks_benefits_with_image_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_benefits_with_image_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_with_image_block" ADD CONSTRAINT "pages_blocks_benefits_with_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prodCardsVert_items" ADD CONSTRAINT "prodCardsVert_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prodCardsVert"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prodCardsVert" ADD CONSTRAINT "prodCardsVert_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prodCardHorz_items" ADD CONSTRAINT "prodCardHorz_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prodCardHorz_items" ADD CONSTRAINT "prodCardHorz_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prodCardHorz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prodCardHorz" ADD CONSTRAINT "prodCardHorz_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_with_list_block_cards" ADD CONSTRAINT "pages_blocks_benefits_with_list_block_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_with_list_block_cards" ADD CONSTRAINT "pages_blocks_benefits_with_list_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_benefits_with_list_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_with_list_block_items" ADD CONSTRAINT "pages_blocks_benefits_with_list_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_benefits_with_list_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_with_list_block" ADD CONSTRAINT "pages_blocks_benefits_with_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_card_narrow_block_items" ADD CONSTRAINT "pages_blocks_info_card_narrow_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_info_card_narrow_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_card_narrow_block" ADD CONSTRAINT "pages_blocks_info_card_narrow_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "loyalBenefits_items" ADD CONSTRAINT "loyalBenefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."loyalBenefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "loyalBenefits" ADD CONSTRAINT "loyalBenefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_discounts_block_items" ADD CONSTRAINT "pages_blocks_discounts_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_discounts_block_items" ADD CONSTRAINT "pages_blocks_discounts_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_discounts_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_discounts_block" ADD CONSTRAINT "pages_blocks_discounts_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items_block_items" ADD CONSTRAINT "pages_blocks_faq_items_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_items_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items_block" ADD CONSTRAINT "pages_blocks_faq_items_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_center_faq_block_items" ADD CONSTRAINT "pages_blocks_info_center_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_info_center_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_center_faq_block" ADD CONSTRAINT "pages_blocks_info_center_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_center_cards_block_items" ADD CONSTRAINT "pages_blocks_info_center_cards_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_center_cards_block_items" ADD CONSTRAINT "pages_blocks_info_center_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_info_center_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_center_cards_block" ADD CONSTRAINT "pages_blocks_info_center_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_cards_block_items" ADD CONSTRAINT "pages_blocks_video_cards_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_cards_block_items" ADD CONSTRAINT "pages_blocks_video_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_cards_block" ADD CONSTRAINT "pages_blocks_video_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_cards_block_items" ADD CONSTRAINT "pages_blocks_link_cards_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_cards_block_items" ADD CONSTRAINT "pages_blocks_link_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_link_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_cards_block" ADD CONSTRAINT "pages_blocks_link_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heroReasonsSimpl_items" ADD CONSTRAINT "heroReasonsSimpl_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "heroReasonsSimpl_items" ADD CONSTRAINT "heroReasonsSimpl_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."heroReasonsSimpl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heroReasonsSimpl" ADD CONSTRAINT "heroReasonsSimpl_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "heroReasonsSimpl" ADD CONSTRAINT "heroReasonsSimpl_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "etfTable_columns" ADD CONSTRAINT "etfTable_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."etfTable"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "etfTable_rows_values" ADD CONSTRAINT "etfTable_rows_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."etfTable_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "etfTable_rows" ADD CONSTRAINT "etfTable_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."etfTable"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "etfTable" ADD CONSTRAINT "etfTable_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_download_section_block_items" ADD CONSTRAINT "pages_blocks_download_section_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_download_section_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_download_section_block" ADD CONSTRAINT "pages_blocks_download_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_exchange_rates_block_rates" ADD CONSTRAINT "pages_blocks_exchange_rates_block_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_exchange_rates_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_exchange_rates_block" ADD CONSTRAINT "pages_blocks_exchange_rates_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_table_block_banks" ADD CONSTRAINT "pages_blocks_compare_table_block_banks_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_table_block_banks" ADD CONSTRAINT "pages_blocks_compare_table_block_banks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_compare_table_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_table_block_features_values" ADD CONSTRAINT "pages_blocks_compare_table_block_features_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_compare_table_block_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_table_block_features" ADD CONSTRAINT "pages_blocks_compare_table_block_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_compare_table_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_table_block" ADD CONSTRAINT "pages_blocks_compare_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_bonds_table_block_rows" ADD CONSTRAINT "pages_blocks_compare_bonds_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_compare_bonds_table_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_bonds_table_block" ADD CONSTRAINT "pages_blocks_compare_bonds_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tblCardCollapse_sections_rows" ADD CONSTRAINT "tblCardCollapse_sections_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tblCardCollapse_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tblCardCollapse_sections" ADD CONSTRAINT "tblCardCollapse_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tblCardCollapse"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tblCardCollapse" ADD CONSTRAINT "tblCardCollapse_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exchCompTable_providers" ADD CONSTRAINT "exchCompTable_providers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exchCompTable_providers" ADD CONSTRAINT "exchCompTable_providers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."exchCompTable"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exchCompTable_currencies_values" ADD CONSTRAINT "exchCompTable_currencies_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."exchCompTable_currencies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exchCompTable_currencies" ADD CONSTRAINT "exchCompTable_currencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."exchCompTable"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exchCompTable" ADD CONSTRAINT "exchCompTable_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_loan_calculator_block" ADD CONSTRAINT "pages_blocks_loan_calculator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mortgage_calculator_block" ADD CONSTRAINT "pages_blocks_mortgage_calculator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_inflation_calculator_block" ADD CONSTRAINT "pages_blocks_inflation_calculator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_zonky_calculator_block" ADD CONSTRAINT "pages_blocks_zonky_calculator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_zone_interest_block" ADD CONSTRAINT "pages_blocks_zone_interest_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_portu_calculator_block" ADD CONSTRAINT "pages_blocks_portu_calculator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portuPensionCalc" ADD CONSTRAINT "portuPensionCalc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pensionSavCalc" ADD CONSTRAINT "pensionSavCalc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_block_items" ADD CONSTRAINT "pages_blocks_timeline_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_block_items" ADD CONSTRAINT "pages_blocks_timeline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_block" ADD CONSTRAINT "pages_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "topMgmtCards_items" ADD CONSTRAINT "topMgmtCards_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "topMgmtCards_items" ADD CONSTRAINT "topMgmtCards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."topMgmtCards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "topMgmtCards" ADD CONSTRAINT "topMgmtCards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pressContact_items" ADD CONSTRAINT "pressContact_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pressContact_items" ADD CONSTRAINT "pressContact_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pressContact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pressContact" ADD CONSTRAINT "pressContact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_carousel_block_logos" ADD CONSTRAINT "pages_blocks_logo_carousel_block_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_carousel_block_logos" ADD CONSTRAINT "pages_blocks_logo_carousel_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_carousel_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_carousel_block" ADD CONSTRAINT "pages_blocks_logo_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_application_block_reviews" ADD CONSTRAINT "pages_blocks_feature_application_block_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_application_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_application_block" ADD CONSTRAINT "pages_blocks_feature_application_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_application_block" ADD CONSTRAINT "pages_blocks_feature_application_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_youtube_video_block" ADD CONSTRAINT "pages_blocks_youtube_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_callback_simplified_block" ADD CONSTRAINT "pages_blocks_callback_simplified_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "loyalCustTimeline_items" ADD CONSTRAINT "loyalCustTimeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."loyalCustTimeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "loyalCustTimeline" ADD CONSTRAINT "loyalCustTimeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_omnichannel_banner_block_items" ADD CONSTRAINT "pages_blocks_omnichannel_banner_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_omnichannel_banner_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_omnichannel_banner_block" ADD CONSTRAINT "pages_blocks_omnichannel_banner_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prodCardsHorz_items" ADD CONSTRAINT "prodCardsHorz_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prodCardsHorz_items" ADD CONSTRAINT "prodCardsHorz_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prodCardsHorz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prodCardsHorz" ADD CONSTRAINT "prodCardsHorz_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_block_items" ADD CONSTRAINT "pages_blocks_steps_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_block_items" ADD CONSTRAINT "pages_blocks_steps_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_block" ADD CONSTRAINT "pages_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stepsVertCollapse_items" ADD CONSTRAINT "stepsVertCollapse_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stepsVertCollapse"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stepsVertCollapse" ADD CONSTRAINT "stepsVertCollapse_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "loyalCustApp" ADD CONSTRAINT "loyalCustApp_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loyalCustApp" ADD CONSTRAINT "loyalCustApp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_banner_block_items" ADD CONSTRAINT "pages_blocks_product_banner_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_banner_block_items" ADD CONSTRAINT "pages_blocks_product_banner_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_banner_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_banner_block" ADD CONSTRAINT "pages_blocks_product_banner_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_homepage_bottom_block_rates" ADD CONSTRAINT "pages_blocks_homepage_bottom_block_rates_flag_icon_id_media_id_fk" FOREIGN KEY ("flag_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_homepage_bottom_block_rates" ADD CONSTRAINT "pages_blocks_homepage_bottom_block_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_homepage_bottom_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_homepage_bottom_block_news" ADD CONSTRAINT "pages_blocks_homepage_bottom_block_news_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_homepage_bottom_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_homepage_bottom_block" ADD CONSTRAINT "pages_blocks_homepage_bottom_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_columns_block_items" ADD CONSTRAINT "pages_blocks_benefits_columns_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_columns_block_items" ADD CONSTRAINT "pages_blocks_benefits_columns_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_benefits_columns_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_columns_block" ADD CONSTRAINT "pages_blocks_benefits_columns_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_cards_block_items" ADD CONSTRAINT "pages_blocks_cta_cards_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_cards_block_items" ADD CONSTRAINT "pages_blocks_cta_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_cards_block" ADD CONSTRAINT "pages_blocks_cta_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_plain_block_links" ADD CONSTRAINT "_pages_v_blocks_hero_plain_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_plain_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_plain_block" ADD CONSTRAINT "_pages_v_blocks_hero_plain_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_plain_block" ADD CONSTRAINT "_pages_v_blocks_hero_plain_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_with_image_block_links" ADD CONSTRAINT "_pages_v_blocks_hero_with_image_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_with_image_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_with_image_block" ADD CONSTRAINT "_pages_v_blocks_hero_with_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_with_image_block" ADD CONSTRAINT "_pages_v_blocks_hero_with_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slider_block_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slider_block_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slider_block_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slider_block_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_slider_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slider_block" ADD CONSTRAINT "_pages_v_blocks_hero_slider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heroSearch_v_links" ADD CONSTRAINT "_heroSearch_v_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_heroSearch_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heroSearch_v" ADD CONSTRAINT "_heroSearch_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_heroSearch_v" ADD CONSTRAINT "_heroSearch_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heroCompact_v_links" ADD CONSTRAINT "_heroCompact_v_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_heroCompact_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heroCompact_v_breadcrumbs" ADD CONSTRAINT "_heroCompact_v_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_heroCompact_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heroCompact_v" ADD CONSTRAINT "_heroCompact_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_heroCompact_v" ADD CONSTRAINT "_heroCompact_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD CONSTRAINT "_pages_v_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_block_links" ADD CONSTRAINT "_pages_v_blocks_feature_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_block" ADD CONSTRAINT "_pages_v_blocks_feature_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_block" ADD CONSTRAINT "_pages_v_blocks_feature_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_double_image_block" ADD CONSTRAINT "_pages_v_blocks_info_double_image_block_image_left_id_media_id_fk" FOREIGN KEY ("image_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_double_image_block" ADD CONSTRAINT "_pages_v_blocks_info_double_image_block_image_right_id_media_id_fk" FOREIGN KEY ("image_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_double_image_block" ADD CONSTRAINT "_pages_v_blocks_info_double_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_image_big_block" ADD CONSTRAINT "_pages_v_blocks_info_image_big_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_image_big_block" ADD CONSTRAINT "_pages_v_blocks_info_image_big_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_video_block" ADD CONSTRAINT "_pages_v_blocks_info_video_block_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_video_block" ADD CONSTRAINT "_pages_v_blocks_info_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_content_cards_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_content_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_cards_block" ADD CONSTRAINT "_pages_v_blocks_content_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_callback_block" ADD CONSTRAINT "_pages_v_blocks_callback_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_callback_block" ADD CONSTRAINT "_pages_v_blocks_callback_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_strip_block" ADD CONSTRAINT "_pages_v_blocks_contact_strip_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_flash_message_block" ADD CONSTRAINT "_pages_v_blocks_flash_message_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_conversions_block_items" ADD CONSTRAINT "_pages_v_blocks_conversions_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_conversions_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_conversions_block" ADD CONSTRAINT "_pages_v_blocks_conversions_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_block" ADD CONSTRAINT "_pages_v_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_block" ADD CONSTRAINT "_pages_v_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jumbotronSticker_v" ADD CONSTRAINT "_jumbotronSticker_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jumbotronSticker_v" ADD CONSTRAINT "_jumbotronSticker_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_desktop_block" ADD CONSTRAINT "_pages_v_blocks_info_desktop_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_desktop_block" ADD CONSTRAINT "_pages_v_blocks_info_desktop_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_image_block" ADD CONSTRAINT "_pages_v_blocks_info_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_image_block" ADD CONSTRAINT "_pages_v_blocks_info_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_plain_block" ADD CONSTRAINT "_pages_v_blocks_info_plain_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_jumbotron_block" ADD CONSTRAINT "_pages_v_blocks_jumbotron_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_jumbotron_block" ADD CONSTRAINT "_pages_v_blocks_jumbotron_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_block_items" ADD CONSTRAINT "_pages_v_blocks_benefits_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_block_items" ADD CONSTRAINT "_pages_v_blocks_benefits_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_benefits_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_block" ADD CONSTRAINT "_pages_v_blocks_benefits_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block_items" ADD CONSTRAINT "_pages_v_blocks_benefits_with_image_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block_items" ADD CONSTRAINT "_pages_v_blocks_benefits_with_image_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_benefits_with_image_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block" ADD CONSTRAINT "_pages_v_blocks_benefits_with_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prodCardsVert_v_items" ADD CONSTRAINT "_prodCardsVert_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prodCardsVert_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prodCardsVert_v" ADD CONSTRAINT "_prodCardsVert_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prodCardHorz_v_items" ADD CONSTRAINT "_prodCardHorz_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prodCardHorz_v_items" ADD CONSTRAINT "_prodCardHorz_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prodCardHorz_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prodCardHorz_v" ADD CONSTRAINT "_prodCardHorz_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block_cards" ADD CONSTRAINT "_pages_v_blocks_benefits_with_list_block_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block_cards" ADD CONSTRAINT "_pages_v_blocks_benefits_with_list_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_benefits_with_list_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block_items" ADD CONSTRAINT "_pages_v_blocks_benefits_with_list_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_benefits_with_list_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" ADD CONSTRAINT "_pages_v_blocks_benefits_with_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_card_narrow_block_items" ADD CONSTRAINT "_pages_v_blocks_info_card_narrow_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_info_card_narrow_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_card_narrow_block" ADD CONSTRAINT "_pages_v_blocks_info_card_narrow_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_loyalBenefits_v_items" ADD CONSTRAINT "_loyalBenefits_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_loyalBenefits_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_loyalBenefits_v" ADD CONSTRAINT "_loyalBenefits_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_discounts_block_items" ADD CONSTRAINT "_pages_v_blocks_discounts_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_discounts_block_items" ADD CONSTRAINT "_pages_v_blocks_discounts_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_discounts_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_discounts_block" ADD CONSTRAINT "_pages_v_blocks_discounts_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items_block_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_items_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items_block" ADD CONSTRAINT "_pages_v_blocks_faq_items_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_center_faq_block_items" ADD CONSTRAINT "_pages_v_blocks_info_center_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_info_center_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_center_faq_block" ADD CONSTRAINT "_pages_v_blocks_info_center_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_center_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_info_center_cards_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_center_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_info_center_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_info_center_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_center_cards_block" ADD CONSTRAINT "_pages_v_blocks_info_center_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_video_cards_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_video_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_cards_block" ADD CONSTRAINT "_pages_v_blocks_video_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_link_cards_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_link_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_link_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_cards_block" ADD CONSTRAINT "_pages_v_blocks_link_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heroReasonsSimpl_v_items" ADD CONSTRAINT "_heroReasonsSimpl_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_heroReasonsSimpl_v_items" ADD CONSTRAINT "_heroReasonsSimpl_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_heroReasonsSimpl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heroReasonsSimpl_v" ADD CONSTRAINT "_heroReasonsSimpl_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_heroReasonsSimpl_v" ADD CONSTRAINT "_heroReasonsSimpl_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_etfTable_v_columns" ADD CONSTRAINT "_etfTable_v_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_etfTable_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_etfTable_v_rows_values" ADD CONSTRAINT "_etfTable_v_rows_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_etfTable_v_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_etfTable_v_rows" ADD CONSTRAINT "_etfTable_v_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_etfTable_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_etfTable_v" ADD CONSTRAINT "_etfTable_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_download_section_block_items" ADD CONSTRAINT "_pages_v_blocks_download_section_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_download_section_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_download_section_block" ADD CONSTRAINT "_pages_v_blocks_download_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_exchange_rates_block_rates" ADD CONSTRAINT "_pages_v_blocks_exchange_rates_block_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_exchange_rates_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_exchange_rates_block" ADD CONSTRAINT "_pages_v_blocks_exchange_rates_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_table_block_banks" ADD CONSTRAINT "_pages_v_blocks_compare_table_block_banks_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_table_block_banks" ADD CONSTRAINT "_pages_v_blocks_compare_table_block_banks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_compare_table_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_table_block_features_values" ADD CONSTRAINT "_pages_v_blocks_compare_table_block_features_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_compare_table_block_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_table_block_features" ADD CONSTRAINT "_pages_v_blocks_compare_table_block_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_compare_table_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_table_block" ADD CONSTRAINT "_pages_v_blocks_compare_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_bonds_table_block_rows" ADD CONSTRAINT "_pages_v_blocks_compare_bonds_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_compare_bonds_table_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_bonds_table_block" ADD CONSTRAINT "_pages_v_blocks_compare_bonds_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tblCardCollapse_v_sections_rows" ADD CONSTRAINT "_tblCardCollapse_v_sections_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tblCardCollapse_v_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tblCardCollapse_v_sections" ADD CONSTRAINT "_tblCardCollapse_v_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tblCardCollapse_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tblCardCollapse_v" ADD CONSTRAINT "_tblCardCollapse_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_exchCompTable_v_providers" ADD CONSTRAINT "_exchCompTable_v_providers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_exchCompTable_v_providers" ADD CONSTRAINT "_exchCompTable_v_providers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_exchCompTable_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_exchCompTable_v_currencies_values" ADD CONSTRAINT "_exchCompTable_v_currencies_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_exchCompTable_v_currencies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_exchCompTable_v_currencies" ADD CONSTRAINT "_exchCompTable_v_currencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_exchCompTable_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_exchCompTable_v" ADD CONSTRAINT "_exchCompTable_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_loan_calculator_block" ADD CONSTRAINT "_pages_v_blocks_loan_calculator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" ADD CONSTRAINT "_pages_v_blocks_mortgage_calculator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_inflation_calculator_block" ADD CONSTRAINT "_pages_v_blocks_inflation_calculator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_zonky_calculator_block" ADD CONSTRAINT "_pages_v_blocks_zonky_calculator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_zone_interest_block" ADD CONSTRAINT "_pages_v_blocks_zone_interest_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_portu_calculator_block" ADD CONSTRAINT "_pages_v_blocks_portu_calculator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portuPensionCalc_v" ADD CONSTRAINT "_portuPensionCalc_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pensionSavCalc_v" ADD CONSTRAINT "_pensionSavCalc_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_block_items" ADD CONSTRAINT "_pages_v_blocks_timeline_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_block_items" ADD CONSTRAINT "_pages_v_blocks_timeline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_block" ADD CONSTRAINT "_pages_v_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_topMgmtCards_v_items" ADD CONSTRAINT "_topMgmtCards_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_topMgmtCards_v_items" ADD CONSTRAINT "_topMgmtCards_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_topMgmtCards_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_topMgmtCards_v" ADD CONSTRAINT "_topMgmtCards_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pressContact_v_items" ADD CONSTRAINT "_pressContact_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pressContact_v_items" ADD CONSTRAINT "_pressContact_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pressContact_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pressContact_v" ADD CONSTRAINT "_pressContact_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_carousel_block_logos" ADD CONSTRAINT "_pages_v_blocks_logo_carousel_block_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_carousel_block_logos" ADD CONSTRAINT "_pages_v_blocks_logo_carousel_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_carousel_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" ADD CONSTRAINT "_pages_v_blocks_logo_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_application_block_reviews" ADD CONSTRAINT "_pages_v_blocks_feature_application_block_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_application_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_application_block" ADD CONSTRAINT "_pages_v_blocks_feature_application_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_application_block" ADD CONSTRAINT "_pages_v_blocks_feature_application_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_youtube_video_block" ADD CONSTRAINT "_pages_v_blocks_youtube_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_callback_simplified_block" ADD CONSTRAINT "_pages_v_blocks_callback_simplified_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_loyalCustTimeline_v_items" ADD CONSTRAINT "_loyalCustTimeline_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_loyalCustTimeline_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_loyalCustTimeline_v" ADD CONSTRAINT "_loyalCustTimeline_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_omnichannel_banner_block_items" ADD CONSTRAINT "_pages_v_blocks_omnichannel_banner_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_omnichannel_banner_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_omnichannel_banner_block" ADD CONSTRAINT "_pages_v_blocks_omnichannel_banner_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prodCardsHorz_v_items" ADD CONSTRAINT "_prodCardsHorz_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prodCardsHorz_v_items" ADD CONSTRAINT "_prodCardsHorz_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prodCardsHorz_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prodCardsHorz_v" ADD CONSTRAINT "_prodCardsHorz_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_block_items" ADD CONSTRAINT "_pages_v_blocks_steps_block_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_block_items" ADD CONSTRAINT "_pages_v_blocks_steps_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD CONSTRAINT "_pages_v_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stepsVertCollapse_v_items" ADD CONSTRAINT "_stepsVertCollapse_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stepsVertCollapse_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stepsVertCollapse_v" ADD CONSTRAINT "_stepsVertCollapse_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_loyalCustApp_v" ADD CONSTRAINT "_loyalCustApp_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_loyalCustApp_v" ADD CONSTRAINT "_loyalCustApp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_banner_block_items" ADD CONSTRAINT "_pages_v_blocks_product_banner_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_banner_block_items" ADD CONSTRAINT "_pages_v_blocks_product_banner_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_product_banner_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_banner_block" ADD CONSTRAINT "_pages_v_blocks_product_banner_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block_rates" ADD CONSTRAINT "_pages_v_blocks_homepage_bottom_block_rates_flag_icon_id_media_id_fk" FOREIGN KEY ("flag_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block_rates" ADD CONSTRAINT "_pages_v_blocks_homepage_bottom_block_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_homepage_bottom_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block_news" ADD CONSTRAINT "_pages_v_blocks_homepage_bottom_block_news_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_homepage_bottom_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block" ADD CONSTRAINT "_pages_v_blocks_homepage_bottom_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_columns_block_items" ADD CONSTRAINT "_pages_v_blocks_benefits_columns_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_columns_block_items" ADD CONSTRAINT "_pages_v_blocks_benefits_columns_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_benefits_columns_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_columns_block" ADD CONSTRAINT "_pages_v_blocks_benefits_columns_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_cta_cards_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_cta_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_cards_block" ADD CONSTRAINT "_pages_v_blocks_cta_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assets_fk" FOREIGN KEY ("assets_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_third_party_access_fk" FOREIGN KEY ("third_party_access_id") REFERENCES "public"."third_party_access"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_third_party_access_fk" FOREIGN KEY ("third_party_access_id") REFERENCES "public"."third_party_access"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navigation_children" ADD CONSTRAINT "header_navigation_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navigation" ADD CONSTRAINT "header_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_cta_buttons" ADD CONSTRAINT "header_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_items" ADD CONSTRAINT "footer_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_socials" ADD CONSTRAINT "settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
  CREATE INDEX "articles_image_idx" ON "articles" USING btree ("image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_category_idx" ON "_articles_v" USING btree ("version_category_id");
  CREATE INDEX "_articles_v_version_version_image_idx" ON "_articles_v" USING btree ("version_image_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
  CREATE INDEX "assets_updated_at_idx" ON "assets" USING btree ("updated_at");
  CREATE INDEX "assets_created_at_idx" ON "assets" USING btree ("created_at");
  CREATE UNIQUE INDEX "assets_filename_idx" ON "assets" USING btree ("filename");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_preview_sizes_preview_filename_idx" ON "media" USING btree ("sizes_preview_filename");
  CREATE INDEX "pages_blocks_hero_plain_block_links_order_idx" ON "pages_blocks_hero_plain_block_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_plain_block_links_parent_id_idx" ON "pages_blocks_hero_plain_block_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_plain_block_order_idx" ON "pages_blocks_hero_plain_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_plain_block_parent_id_idx" ON "pages_blocks_hero_plain_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_plain_block_path_idx" ON "pages_blocks_hero_plain_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_plain_block_image_idx" ON "pages_blocks_hero_plain_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_with_image_block_links_order_idx" ON "pages_blocks_hero_with_image_block_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_with_image_block_links_parent_id_idx" ON "pages_blocks_hero_with_image_block_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_with_image_block_order_idx" ON "pages_blocks_hero_with_image_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_with_image_block_parent_id_idx" ON "pages_blocks_hero_with_image_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_with_image_block_path_idx" ON "pages_blocks_hero_with_image_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_with_image_block_image_idx" ON "pages_blocks_hero_with_image_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_slider_block_slides_order_idx" ON "pages_blocks_hero_slider_block_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slider_block_slides_parent_id_idx" ON "pages_blocks_hero_slider_block_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_block_slides_image_idx" ON "pages_blocks_hero_slider_block_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_slider_block_order_idx" ON "pages_blocks_hero_slider_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slider_block_parent_id_idx" ON "pages_blocks_hero_slider_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_block_path_idx" ON "pages_blocks_hero_slider_block" USING btree ("_path");
  CREATE INDEX "heroSearch_links_order_idx" ON "heroSearch_links" USING btree ("_order");
  CREATE INDEX "heroSearch_links_parent_id_idx" ON "heroSearch_links" USING btree ("_parent_id");
  CREATE INDEX "heroSearch_order_idx" ON "heroSearch" USING btree ("_order");
  CREATE INDEX "heroSearch_parent_id_idx" ON "heroSearch" USING btree ("_parent_id");
  CREATE INDEX "heroSearch_path_idx" ON "heroSearch" USING btree ("_path");
  CREATE INDEX "heroSearch_image_idx" ON "heroSearch" USING btree ("image_id");
  CREATE INDEX "heroCompact_links_order_idx" ON "heroCompact_links" USING btree ("_order");
  CREATE INDEX "heroCompact_links_parent_id_idx" ON "heroCompact_links" USING btree ("_parent_id");
  CREATE INDEX "heroCompact_breadcrumbs_order_idx" ON "heroCompact_breadcrumbs" USING btree ("_order");
  CREATE INDEX "heroCompact_breadcrumbs_parent_id_idx" ON "heroCompact_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "heroCompact_order_idx" ON "heroCompact" USING btree ("_order");
  CREATE INDEX "heroCompact_parent_id_idx" ON "heroCompact" USING btree ("_parent_id");
  CREATE INDEX "heroCompact_path_idx" ON "heroCompact" USING btree ("_path");
  CREATE INDEX "heroCompact_image_idx" ON "heroCompact" USING btree ("image_id");
  CREATE INDEX "pages_blocks_rich_text_block_order_idx" ON "pages_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_block_parent_id_idx" ON "pages_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_block_path_idx" ON "pages_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_block_links_order_idx" ON "pages_blocks_feature_block_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_block_links_parent_id_idx" ON "pages_blocks_feature_block_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_block_order_idx" ON "pages_blocks_feature_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_block_parent_id_idx" ON "pages_blocks_feature_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_block_path_idx" ON "pages_blocks_feature_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_block_image_idx" ON "pages_blocks_feature_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_info_double_image_block_order_idx" ON "pages_blocks_info_double_image_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_double_image_block_parent_id_idx" ON "pages_blocks_info_double_image_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_double_image_block_path_idx" ON "pages_blocks_info_double_image_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_info_double_image_block_image_left_idx" ON "pages_blocks_info_double_image_block" USING btree ("image_left_id");
  CREATE INDEX "pages_blocks_info_double_image_block_image_right_idx" ON "pages_blocks_info_double_image_block" USING btree ("image_right_id");
  CREATE INDEX "pages_blocks_info_image_big_block_order_idx" ON "pages_blocks_info_image_big_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_image_big_block_parent_id_idx" ON "pages_blocks_info_image_big_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_image_big_block_path_idx" ON "pages_blocks_info_image_big_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_info_image_big_block_image_idx" ON "pages_blocks_info_image_big_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_info_video_block_order_idx" ON "pages_blocks_info_video_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_video_block_parent_id_idx" ON "pages_blocks_info_video_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_video_block_path_idx" ON "pages_blocks_info_video_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_info_video_block_thumbnail_idx" ON "pages_blocks_info_video_block" USING btree ("thumbnail_id");
  CREATE INDEX "pages_blocks_content_cards_block_items_order_idx" ON "pages_blocks_content_cards_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_cards_block_items_parent_id_idx" ON "pages_blocks_content_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_cards_block_items_image_idx" ON "pages_blocks_content_cards_block_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_content_cards_block_order_idx" ON "pages_blocks_content_cards_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_cards_block_parent_id_idx" ON "pages_blocks_content_cards_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_cards_block_path_idx" ON "pages_blocks_content_cards_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_callback_block_order_idx" ON "pages_blocks_callback_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_callback_block_parent_id_idx" ON "pages_blocks_callback_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_callback_block_path_idx" ON "pages_blocks_callback_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_callback_block_image_idx" ON "pages_blocks_callback_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_contact_strip_block_order_idx" ON "pages_blocks_contact_strip_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_strip_block_parent_id_idx" ON "pages_blocks_contact_strip_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_strip_block_path_idx" ON "pages_blocks_contact_strip_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_flash_message_block_order_idx" ON "pages_blocks_flash_message_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_flash_message_block_parent_id_idx" ON "pages_blocks_flash_message_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_flash_message_block_path_idx" ON "pages_blocks_flash_message_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_conversions_block_items_order_idx" ON "pages_blocks_conversions_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_conversions_block_items_parent_id_idx" ON "pages_blocks_conversions_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_conversions_block_order_idx" ON "pages_blocks_conversions_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_conversions_block_parent_id_idx" ON "pages_blocks_conversions_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_conversions_block_path_idx" ON "pages_blocks_conversions_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_block_order_idx" ON "pages_blocks_image_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_block_parent_id_idx" ON "pages_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_block_path_idx" ON "pages_blocks_image_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_block_image_idx" ON "pages_blocks_image_block" USING btree ("image_id");
  CREATE INDEX "jumbotronSticker_order_idx" ON "jumbotronSticker" USING btree ("_order");
  CREATE INDEX "jumbotronSticker_parent_id_idx" ON "jumbotronSticker" USING btree ("_parent_id");
  CREATE INDEX "jumbotronSticker_path_idx" ON "jumbotronSticker" USING btree ("_path");
  CREATE INDEX "jumbotronSticker_image_idx" ON "jumbotronSticker" USING btree ("image_id");
  CREATE INDEX "pages_blocks_info_desktop_block_order_idx" ON "pages_blocks_info_desktop_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_desktop_block_parent_id_idx" ON "pages_blocks_info_desktop_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_desktop_block_path_idx" ON "pages_blocks_info_desktop_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_info_desktop_block_image_idx" ON "pages_blocks_info_desktop_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_info_image_block_order_idx" ON "pages_blocks_info_image_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_image_block_parent_id_idx" ON "pages_blocks_info_image_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_image_block_path_idx" ON "pages_blocks_info_image_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_info_image_block_image_idx" ON "pages_blocks_info_image_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_info_plain_block_order_idx" ON "pages_blocks_info_plain_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_plain_block_parent_id_idx" ON "pages_blocks_info_plain_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_plain_block_path_idx" ON "pages_blocks_info_plain_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_jumbotron_block_order_idx" ON "pages_blocks_jumbotron_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_jumbotron_block_parent_id_idx" ON "pages_blocks_jumbotron_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_jumbotron_block_path_idx" ON "pages_blocks_jumbotron_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_jumbotron_block_image_idx" ON "pages_blocks_jumbotron_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_benefits_block_items_order_idx" ON "pages_blocks_benefits_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_block_items_parent_id_idx" ON "pages_blocks_benefits_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_block_items_icon_idx" ON "pages_blocks_benefits_block_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_benefits_block_order_idx" ON "pages_blocks_benefits_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_block_parent_id_idx" ON "pages_blocks_benefits_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_block_path_idx" ON "pages_blocks_benefits_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_benefits_with_image_block_items_order_idx" ON "pages_blocks_benefits_with_image_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_with_image_block_items_parent_id_idx" ON "pages_blocks_benefits_with_image_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_with_image_block_items_image_idx" ON "pages_blocks_benefits_with_image_block_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_benefits_with_image_block_order_idx" ON "pages_blocks_benefits_with_image_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_with_image_block_parent_id_idx" ON "pages_blocks_benefits_with_image_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_with_image_block_path_idx" ON "pages_blocks_benefits_with_image_block" USING btree ("_path");
  CREATE INDEX "prodCardsVert_items_order_idx" ON "prodCardsVert_items" USING btree ("_order");
  CREATE INDEX "prodCardsVert_items_parent_id_idx" ON "prodCardsVert_items" USING btree ("_parent_id");
  CREATE INDEX "prodCardsVert_order_idx" ON "prodCardsVert" USING btree ("_order");
  CREATE INDEX "prodCardsVert_parent_id_idx" ON "prodCardsVert" USING btree ("_parent_id");
  CREATE INDEX "prodCardsVert_path_idx" ON "prodCardsVert" USING btree ("_path");
  CREATE INDEX "prodCardHorz_items_order_idx" ON "prodCardHorz_items" USING btree ("_order");
  CREATE INDEX "prodCardHorz_items_parent_id_idx" ON "prodCardHorz_items" USING btree ("_parent_id");
  CREATE INDEX "prodCardHorz_items_image_idx" ON "prodCardHorz_items" USING btree ("image_id");
  CREATE INDEX "prodCardHorz_order_idx" ON "prodCardHorz" USING btree ("_order");
  CREATE INDEX "prodCardHorz_parent_id_idx" ON "prodCardHorz" USING btree ("_parent_id");
  CREATE INDEX "prodCardHorz_path_idx" ON "prodCardHorz" USING btree ("_path");
  CREATE INDEX "pages_blocks_benefits_with_list_block_cards_order_idx" ON "pages_blocks_benefits_with_list_block_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_with_list_block_cards_parent_id_idx" ON "pages_blocks_benefits_with_list_block_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_with_list_block_cards_icon_idx" ON "pages_blocks_benefits_with_list_block_cards" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_benefits_with_list_block_items_order_idx" ON "pages_blocks_benefits_with_list_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_with_list_block_items_parent_id_idx" ON "pages_blocks_benefits_with_list_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_with_list_block_order_idx" ON "pages_blocks_benefits_with_list_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_with_list_block_parent_id_idx" ON "pages_blocks_benefits_with_list_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_with_list_block_path_idx" ON "pages_blocks_benefits_with_list_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_info_card_narrow_block_items_order_idx" ON "pages_blocks_info_card_narrow_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_card_narrow_block_items_parent_id_idx" ON "pages_blocks_info_card_narrow_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_card_narrow_block_order_idx" ON "pages_blocks_info_card_narrow_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_card_narrow_block_parent_id_idx" ON "pages_blocks_info_card_narrow_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_card_narrow_block_path_idx" ON "pages_blocks_info_card_narrow_block" USING btree ("_path");
  CREATE INDEX "loyalBenefits_items_order_idx" ON "loyalBenefits_items" USING btree ("_order");
  CREATE INDEX "loyalBenefits_items_parent_id_idx" ON "loyalBenefits_items" USING btree ("_parent_id");
  CREATE INDEX "loyalBenefits_order_idx" ON "loyalBenefits" USING btree ("_order");
  CREATE INDEX "loyalBenefits_parent_id_idx" ON "loyalBenefits" USING btree ("_parent_id");
  CREATE INDEX "loyalBenefits_path_idx" ON "loyalBenefits" USING btree ("_path");
  CREATE INDEX "pages_blocks_discounts_block_items_order_idx" ON "pages_blocks_discounts_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_discounts_block_items_parent_id_idx" ON "pages_blocks_discounts_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_discounts_block_items_image_idx" ON "pages_blocks_discounts_block_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_discounts_block_order_idx" ON "pages_blocks_discounts_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_discounts_block_parent_id_idx" ON "pages_blocks_discounts_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_discounts_block_path_idx" ON "pages_blocks_discounts_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_block_items_order_idx" ON "pages_blocks_faq_items_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_block_items_parent_id_idx" ON "pages_blocks_faq_items_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_block_order_idx" ON "pages_blocks_faq_items_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_block_parent_id_idx" ON "pages_blocks_faq_items_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_block_path_idx" ON "pages_blocks_faq_items_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_info_center_faq_block_items_order_idx" ON "pages_blocks_info_center_faq_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_center_faq_block_items_parent_id_idx" ON "pages_blocks_info_center_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_center_faq_block_order_idx" ON "pages_blocks_info_center_faq_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_center_faq_block_parent_id_idx" ON "pages_blocks_info_center_faq_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_center_faq_block_path_idx" ON "pages_blocks_info_center_faq_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_info_center_cards_block_items_order_idx" ON "pages_blocks_info_center_cards_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_center_cards_block_items_parent_id_idx" ON "pages_blocks_info_center_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_center_cards_block_items_icon_idx" ON "pages_blocks_info_center_cards_block_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_info_center_cards_block_order_idx" ON "pages_blocks_info_center_cards_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_center_cards_block_parent_id_idx" ON "pages_blocks_info_center_cards_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_center_cards_block_path_idx" ON "pages_blocks_info_center_cards_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_cards_block_items_order_idx" ON "pages_blocks_video_cards_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_cards_block_items_parent_id_idx" ON "pages_blocks_video_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_cards_block_items_image_idx" ON "pages_blocks_video_cards_block_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_video_cards_block_order_idx" ON "pages_blocks_video_cards_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_cards_block_parent_id_idx" ON "pages_blocks_video_cards_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_cards_block_path_idx" ON "pages_blocks_video_cards_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_link_cards_block_items_order_idx" ON "pages_blocks_link_cards_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_cards_block_items_parent_id_idx" ON "pages_blocks_link_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_cards_block_items_image_idx" ON "pages_blocks_link_cards_block_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_link_cards_block_order_idx" ON "pages_blocks_link_cards_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_cards_block_parent_id_idx" ON "pages_blocks_link_cards_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_cards_block_path_idx" ON "pages_blocks_link_cards_block" USING btree ("_path");
  CREATE INDEX "heroReasonsSimpl_items_order_idx" ON "heroReasonsSimpl_items" USING btree ("_order");
  CREATE INDEX "heroReasonsSimpl_items_parent_id_idx" ON "heroReasonsSimpl_items" USING btree ("_parent_id");
  CREATE INDEX "heroReasonsSimpl_items_image_idx" ON "heroReasonsSimpl_items" USING btree ("image_id");
  CREATE INDEX "heroReasonsSimpl_order_idx" ON "heroReasonsSimpl" USING btree ("_order");
  CREATE INDEX "heroReasonsSimpl_parent_id_idx" ON "heroReasonsSimpl" USING btree ("_parent_id");
  CREATE INDEX "heroReasonsSimpl_path_idx" ON "heroReasonsSimpl" USING btree ("_path");
  CREATE INDEX "heroReasonsSimpl_image_idx" ON "heroReasonsSimpl" USING btree ("image_id");
  CREATE INDEX "etfTable_columns_order_idx" ON "etfTable_columns" USING btree ("_order");
  CREATE INDEX "etfTable_columns_parent_id_idx" ON "etfTable_columns" USING btree ("_parent_id");
  CREATE INDEX "etfTable_rows_values_order_idx" ON "etfTable_rows_values" USING btree ("_order");
  CREATE INDEX "etfTable_rows_values_parent_id_idx" ON "etfTable_rows_values" USING btree ("_parent_id");
  CREATE INDEX "etfTable_rows_order_idx" ON "etfTable_rows" USING btree ("_order");
  CREATE INDEX "etfTable_rows_parent_id_idx" ON "etfTable_rows" USING btree ("_parent_id");
  CREATE INDEX "etfTable_order_idx" ON "etfTable" USING btree ("_order");
  CREATE INDEX "etfTable_parent_id_idx" ON "etfTable" USING btree ("_parent_id");
  CREATE INDEX "etfTable_path_idx" ON "etfTable" USING btree ("_path");
  CREATE INDEX "pages_blocks_download_section_block_items_order_idx" ON "pages_blocks_download_section_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_download_section_block_items_parent_id_idx" ON "pages_blocks_download_section_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_download_section_block_order_idx" ON "pages_blocks_download_section_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_download_section_block_parent_id_idx" ON "pages_blocks_download_section_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_download_section_block_path_idx" ON "pages_blocks_download_section_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_exchange_rates_block_rates_order_idx" ON "pages_blocks_exchange_rates_block_rates" USING btree ("_order");
  CREATE INDEX "pages_blocks_exchange_rates_block_rates_parent_id_idx" ON "pages_blocks_exchange_rates_block_rates" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_exchange_rates_block_order_idx" ON "pages_blocks_exchange_rates_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_exchange_rates_block_parent_id_idx" ON "pages_blocks_exchange_rates_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_exchange_rates_block_path_idx" ON "pages_blocks_exchange_rates_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_compare_table_block_banks_order_idx" ON "pages_blocks_compare_table_block_banks" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_table_block_banks_parent_id_idx" ON "pages_blocks_compare_table_block_banks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_table_block_banks_logo_idx" ON "pages_blocks_compare_table_block_banks" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_compare_table_block_features_values_order_idx" ON "pages_blocks_compare_table_block_features_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_table_block_features_values_parent_id_idx" ON "pages_blocks_compare_table_block_features_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_table_block_features_order_idx" ON "pages_blocks_compare_table_block_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_table_block_features_parent_id_idx" ON "pages_blocks_compare_table_block_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_table_block_order_idx" ON "pages_blocks_compare_table_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_table_block_parent_id_idx" ON "pages_blocks_compare_table_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_table_block_path_idx" ON "pages_blocks_compare_table_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_compare_bonds_table_block_rows_order_idx" ON "pages_blocks_compare_bonds_table_block_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_bonds_table_block_rows_parent_id_idx" ON "pages_blocks_compare_bonds_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_bonds_table_block_order_idx" ON "pages_blocks_compare_bonds_table_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_bonds_table_block_parent_id_idx" ON "pages_blocks_compare_bonds_table_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_bonds_table_block_path_idx" ON "pages_blocks_compare_bonds_table_block" USING btree ("_path");
  CREATE INDEX "tblCardCollapse_sections_rows_order_idx" ON "tblCardCollapse_sections_rows" USING btree ("_order");
  CREATE INDEX "tblCardCollapse_sections_rows_parent_id_idx" ON "tblCardCollapse_sections_rows" USING btree ("_parent_id");
  CREATE INDEX "tblCardCollapse_sections_order_idx" ON "tblCardCollapse_sections" USING btree ("_order");
  CREATE INDEX "tblCardCollapse_sections_parent_id_idx" ON "tblCardCollapse_sections" USING btree ("_parent_id");
  CREATE INDEX "tblCardCollapse_order_idx" ON "tblCardCollapse" USING btree ("_order");
  CREATE INDEX "tblCardCollapse_parent_id_idx" ON "tblCardCollapse" USING btree ("_parent_id");
  CREATE INDEX "tblCardCollapse_path_idx" ON "tblCardCollapse" USING btree ("_path");
  CREATE INDEX "exchCompTable_providers_order_idx" ON "exchCompTable_providers" USING btree ("_order");
  CREATE INDEX "exchCompTable_providers_parent_id_idx" ON "exchCompTable_providers" USING btree ("_parent_id");
  CREATE INDEX "exchCompTable_providers_logo_idx" ON "exchCompTable_providers" USING btree ("logo_id");
  CREATE INDEX "exchCompTable_currencies_values_order_idx" ON "exchCompTable_currencies_values" USING btree ("_order");
  CREATE INDEX "exchCompTable_currencies_values_parent_id_idx" ON "exchCompTable_currencies_values" USING btree ("_parent_id");
  CREATE INDEX "exchCompTable_currencies_order_idx" ON "exchCompTable_currencies" USING btree ("_order");
  CREATE INDEX "exchCompTable_currencies_parent_id_idx" ON "exchCompTable_currencies" USING btree ("_parent_id");
  CREATE INDEX "exchCompTable_order_idx" ON "exchCompTable" USING btree ("_order");
  CREATE INDEX "exchCompTable_parent_id_idx" ON "exchCompTable" USING btree ("_parent_id");
  CREATE INDEX "exchCompTable_path_idx" ON "exchCompTable" USING btree ("_path");
  CREATE INDEX "pages_blocks_loan_calculator_block_order_idx" ON "pages_blocks_loan_calculator_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_loan_calculator_block_parent_id_idx" ON "pages_blocks_loan_calculator_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_loan_calculator_block_path_idx" ON "pages_blocks_loan_calculator_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_mortgage_calculator_block_order_idx" ON "pages_blocks_mortgage_calculator_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_mortgage_calculator_block_parent_id_idx" ON "pages_blocks_mortgage_calculator_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mortgage_calculator_block_path_idx" ON "pages_blocks_mortgage_calculator_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_inflation_calculator_block_order_idx" ON "pages_blocks_inflation_calculator_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_inflation_calculator_block_parent_id_idx" ON "pages_blocks_inflation_calculator_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_inflation_calculator_block_path_idx" ON "pages_blocks_inflation_calculator_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_zonky_calculator_block_order_idx" ON "pages_blocks_zonky_calculator_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_zonky_calculator_block_parent_id_idx" ON "pages_blocks_zonky_calculator_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_zonky_calculator_block_path_idx" ON "pages_blocks_zonky_calculator_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_zone_interest_block_order_idx" ON "pages_blocks_zone_interest_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_zone_interest_block_parent_id_idx" ON "pages_blocks_zone_interest_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_zone_interest_block_path_idx" ON "pages_blocks_zone_interest_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_portu_calculator_block_order_idx" ON "pages_blocks_portu_calculator_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_portu_calculator_block_parent_id_idx" ON "pages_blocks_portu_calculator_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_portu_calculator_block_path_idx" ON "pages_blocks_portu_calculator_block" USING btree ("_path");
  CREATE INDEX "portuPensionCalc_order_idx" ON "portuPensionCalc" USING btree ("_order");
  CREATE INDEX "portuPensionCalc_parent_id_idx" ON "portuPensionCalc" USING btree ("_parent_id");
  CREATE INDEX "portuPensionCalc_path_idx" ON "portuPensionCalc" USING btree ("_path");
  CREATE INDEX "pensionSavCalc_order_idx" ON "pensionSavCalc" USING btree ("_order");
  CREATE INDEX "pensionSavCalc_parent_id_idx" ON "pensionSavCalc" USING btree ("_parent_id");
  CREATE INDEX "pensionSavCalc_path_idx" ON "pensionSavCalc" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_block_items_order_idx" ON "pages_blocks_timeline_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_block_items_parent_id_idx" ON "pages_blocks_timeline_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_block_items_image_idx" ON "pages_blocks_timeline_block_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_timeline_block_order_idx" ON "pages_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_block_parent_id_idx" ON "pages_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_block_path_idx" ON "pages_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX "topMgmtCards_items_order_idx" ON "topMgmtCards_items" USING btree ("_order");
  CREATE INDEX "topMgmtCards_items_parent_id_idx" ON "topMgmtCards_items" USING btree ("_parent_id");
  CREATE INDEX "topMgmtCards_items_image_idx" ON "topMgmtCards_items" USING btree ("image_id");
  CREATE INDEX "topMgmtCards_order_idx" ON "topMgmtCards" USING btree ("_order");
  CREATE INDEX "topMgmtCards_parent_id_idx" ON "topMgmtCards" USING btree ("_parent_id");
  CREATE INDEX "topMgmtCards_path_idx" ON "topMgmtCards" USING btree ("_path");
  CREATE INDEX "pressContact_items_order_idx" ON "pressContact_items" USING btree ("_order");
  CREATE INDEX "pressContact_items_parent_id_idx" ON "pressContact_items" USING btree ("_parent_id");
  CREATE INDEX "pressContact_items_image_idx" ON "pressContact_items" USING btree ("image_id");
  CREATE INDEX "pressContact_order_idx" ON "pressContact" USING btree ("_order");
  CREATE INDEX "pressContact_parent_id_idx" ON "pressContact" USING btree ("_parent_id");
  CREATE INDEX "pressContact_path_idx" ON "pressContact" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_carousel_block_logos_order_idx" ON "pages_blocks_logo_carousel_block_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_carousel_block_logos_parent_id_idx" ON "pages_blocks_logo_carousel_block_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_carousel_block_logos_image_idx" ON "pages_blocks_logo_carousel_block_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logo_carousel_block_order_idx" ON "pages_blocks_logo_carousel_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_carousel_block_parent_id_idx" ON "pages_blocks_logo_carousel_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_carousel_block_path_idx" ON "pages_blocks_logo_carousel_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_application_block_reviews_order_idx" ON "pages_blocks_feature_application_block_reviews" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_application_block_reviews_parent_id_idx" ON "pages_blocks_feature_application_block_reviews" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_application_block_order_idx" ON "pages_blocks_feature_application_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_application_block_parent_id_idx" ON "pages_blocks_feature_application_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_application_block_path_idx" ON "pages_blocks_feature_application_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_application_block_image_idx" ON "pages_blocks_feature_application_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_youtube_video_block_order_idx" ON "pages_blocks_youtube_video_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_youtube_video_block_parent_id_idx" ON "pages_blocks_youtube_video_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_youtube_video_block_path_idx" ON "pages_blocks_youtube_video_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_callback_simplified_block_order_idx" ON "pages_blocks_callback_simplified_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_callback_simplified_block_parent_id_idx" ON "pages_blocks_callback_simplified_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_callback_simplified_block_path_idx" ON "pages_blocks_callback_simplified_block" USING btree ("_path");
  CREATE INDEX "loyalCustTimeline_items_order_idx" ON "loyalCustTimeline_items" USING btree ("_order");
  CREATE INDEX "loyalCustTimeline_items_parent_id_idx" ON "loyalCustTimeline_items" USING btree ("_parent_id");
  CREATE INDEX "loyalCustTimeline_order_idx" ON "loyalCustTimeline" USING btree ("_order");
  CREATE INDEX "loyalCustTimeline_parent_id_idx" ON "loyalCustTimeline" USING btree ("_parent_id");
  CREATE INDEX "loyalCustTimeline_path_idx" ON "loyalCustTimeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_omnichannel_banner_block_items_order_idx" ON "pages_blocks_omnichannel_banner_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_omnichannel_banner_block_items_parent_id_idx" ON "pages_blocks_omnichannel_banner_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_omnichannel_banner_block_order_idx" ON "pages_blocks_omnichannel_banner_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_omnichannel_banner_block_parent_id_idx" ON "pages_blocks_omnichannel_banner_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_omnichannel_banner_block_path_idx" ON "pages_blocks_omnichannel_banner_block" USING btree ("_path");
  CREATE INDEX "prodCardsHorz_items_order_idx" ON "prodCardsHorz_items" USING btree ("_order");
  CREATE INDEX "prodCardsHorz_items_parent_id_idx" ON "prodCardsHorz_items" USING btree ("_parent_id");
  CREATE INDEX "prodCardsHorz_items_image_idx" ON "prodCardsHorz_items" USING btree ("image_id");
  CREATE INDEX "prodCardsHorz_order_idx" ON "prodCardsHorz" USING btree ("_order");
  CREATE INDEX "prodCardsHorz_parent_id_idx" ON "prodCardsHorz" USING btree ("_parent_id");
  CREATE INDEX "prodCardsHorz_path_idx" ON "prodCardsHorz" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_block_items_order_idx" ON "pages_blocks_steps_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_block_items_parent_id_idx" ON "pages_blocks_steps_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_block_items_image_idx" ON "pages_blocks_steps_block_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_steps_block_order_idx" ON "pages_blocks_steps_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_block_parent_id_idx" ON "pages_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_block_path_idx" ON "pages_blocks_steps_block" USING btree ("_path");
  CREATE INDEX "stepsVertCollapse_items_order_idx" ON "stepsVertCollapse_items" USING btree ("_order");
  CREATE INDEX "stepsVertCollapse_items_parent_id_idx" ON "stepsVertCollapse_items" USING btree ("_parent_id");
  CREATE INDEX "stepsVertCollapse_order_idx" ON "stepsVertCollapse" USING btree ("_order");
  CREATE INDEX "stepsVertCollapse_parent_id_idx" ON "stepsVertCollapse" USING btree ("_parent_id");
  CREATE INDEX "stepsVertCollapse_path_idx" ON "stepsVertCollapse" USING btree ("_path");
  CREATE INDEX "loyalCustApp_order_idx" ON "loyalCustApp" USING btree ("_order");
  CREATE INDEX "loyalCustApp_parent_id_idx" ON "loyalCustApp" USING btree ("_parent_id");
  CREATE INDEX "loyalCustApp_path_idx" ON "loyalCustApp" USING btree ("_path");
  CREATE INDEX "loyalCustApp_image_idx" ON "loyalCustApp" USING btree ("image_id");
  CREATE INDEX "pages_blocks_product_banner_block_items_order_idx" ON "pages_blocks_product_banner_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_banner_block_items_parent_id_idx" ON "pages_blocks_product_banner_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_banner_block_items_icon_idx" ON "pages_blocks_product_banner_block_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_product_banner_block_order_idx" ON "pages_blocks_product_banner_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_banner_block_parent_id_idx" ON "pages_blocks_product_banner_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_banner_block_path_idx" ON "pages_blocks_product_banner_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_homepage_bottom_block_rates_order_idx" ON "pages_blocks_homepage_bottom_block_rates" USING btree ("_order");
  CREATE INDEX "pages_blocks_homepage_bottom_block_rates_parent_id_idx" ON "pages_blocks_homepage_bottom_block_rates" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_homepage_bottom_block_rates_flag_icon_idx" ON "pages_blocks_homepage_bottom_block_rates" USING btree ("flag_icon_id");
  CREATE INDEX "pages_blocks_homepage_bottom_block_news_order_idx" ON "pages_blocks_homepage_bottom_block_news" USING btree ("_order");
  CREATE INDEX "pages_blocks_homepage_bottom_block_news_parent_id_idx" ON "pages_blocks_homepage_bottom_block_news" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_homepage_bottom_block_order_idx" ON "pages_blocks_homepage_bottom_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_homepage_bottom_block_parent_id_idx" ON "pages_blocks_homepage_bottom_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_homepage_bottom_block_path_idx" ON "pages_blocks_homepage_bottom_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_benefits_columns_block_items_order_idx" ON "pages_blocks_benefits_columns_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_columns_block_items_parent_id_idx" ON "pages_blocks_benefits_columns_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_columns_block_items_icon_idx" ON "pages_blocks_benefits_columns_block_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_benefits_columns_block_order_idx" ON "pages_blocks_benefits_columns_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_columns_block_parent_id_idx" ON "pages_blocks_benefits_columns_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_columns_block_path_idx" ON "pages_blocks_benefits_columns_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_cards_block_items_order_idx" ON "pages_blocks_cta_cards_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_cards_block_items_parent_id_idx" ON "pages_blocks_cta_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_cards_block_items_icon_idx" ON "pages_blocks_cta_cards_block_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_cta_cards_block_order_idx" ON "pages_blocks_cta_cards_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_cards_block_parent_id_idx" ON "pages_blocks_cta_cards_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_cards_block_path_idx" ON "pages_blocks_cta_cards_block" USING btree ("_path");
  CREATE INDEX "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "pages_breadcrumbs_doc_idx" ON "pages_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_hero_plain_block_links_order_idx" ON "_pages_v_blocks_hero_plain_block_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_plain_block_links_parent_id_idx" ON "_pages_v_blocks_hero_plain_block_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_plain_block_order_idx" ON "_pages_v_blocks_hero_plain_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_plain_block_parent_id_idx" ON "_pages_v_blocks_hero_plain_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_plain_block_path_idx" ON "_pages_v_blocks_hero_plain_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_plain_block_image_idx" ON "_pages_v_blocks_hero_plain_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_with_image_block_links_order_idx" ON "_pages_v_blocks_hero_with_image_block_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_with_image_block_links_parent_id_idx" ON "_pages_v_blocks_hero_with_image_block_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_with_image_block_order_idx" ON "_pages_v_blocks_hero_with_image_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_with_image_block_parent_id_idx" ON "_pages_v_blocks_hero_with_image_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_with_image_block_path_idx" ON "_pages_v_blocks_hero_with_image_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_with_image_block_image_idx" ON "_pages_v_blocks_hero_with_image_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_slider_block_slides_order_idx" ON "_pages_v_blocks_hero_slider_block_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slider_block_slides_parent_id_idx" ON "_pages_v_blocks_hero_slider_block_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slider_block_slides_image_idx" ON "_pages_v_blocks_hero_slider_block_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_slider_block_order_idx" ON "_pages_v_blocks_hero_slider_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slider_block_parent_id_idx" ON "_pages_v_blocks_hero_slider_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slider_block_path_idx" ON "_pages_v_blocks_hero_slider_block" USING btree ("_path");
  CREATE INDEX "_heroSearch_v_links_order_idx" ON "_heroSearch_v_links" USING btree ("_order");
  CREATE INDEX "_heroSearch_v_links_parent_id_idx" ON "_heroSearch_v_links" USING btree ("_parent_id");
  CREATE INDEX "_heroSearch_v_order_idx" ON "_heroSearch_v" USING btree ("_order");
  CREATE INDEX "_heroSearch_v_parent_id_idx" ON "_heroSearch_v" USING btree ("_parent_id");
  CREATE INDEX "_heroSearch_v_path_idx" ON "_heroSearch_v" USING btree ("_path");
  CREATE INDEX "_heroSearch_v_image_idx" ON "_heroSearch_v" USING btree ("image_id");
  CREATE INDEX "_heroCompact_v_links_order_idx" ON "_heroCompact_v_links" USING btree ("_order");
  CREATE INDEX "_heroCompact_v_links_parent_id_idx" ON "_heroCompact_v_links" USING btree ("_parent_id");
  CREATE INDEX "_heroCompact_v_breadcrumbs_order_idx" ON "_heroCompact_v_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_heroCompact_v_breadcrumbs_parent_id_idx" ON "_heroCompact_v_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_heroCompact_v_order_idx" ON "_heroCompact_v" USING btree ("_order");
  CREATE INDEX "_heroCompact_v_parent_id_idx" ON "_heroCompact_v" USING btree ("_parent_id");
  CREATE INDEX "_heroCompact_v_path_idx" ON "_heroCompact_v" USING btree ("_path");
  CREATE INDEX "_heroCompact_v_image_idx" ON "_heroCompact_v" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_rich_text_block_order_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_block_parent_id_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_block_path_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_block_links_order_idx" ON "_pages_v_blocks_feature_block_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_block_links_parent_id_idx" ON "_pages_v_blocks_feature_block_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_block_order_idx" ON "_pages_v_blocks_feature_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_block_parent_id_idx" ON "_pages_v_blocks_feature_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_block_path_idx" ON "_pages_v_blocks_feature_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_block_image_idx" ON "_pages_v_blocks_feature_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_info_double_image_block_order_idx" ON "_pages_v_blocks_info_double_image_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_double_image_block_parent_id_idx" ON "_pages_v_blocks_info_double_image_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_double_image_block_path_idx" ON "_pages_v_blocks_info_double_image_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_info_double_image_block_image_left_idx" ON "_pages_v_blocks_info_double_image_block" USING btree ("image_left_id");
  CREATE INDEX "_pages_v_blocks_info_double_image_block_image_right_idx" ON "_pages_v_blocks_info_double_image_block" USING btree ("image_right_id");
  CREATE INDEX "_pages_v_blocks_info_image_big_block_order_idx" ON "_pages_v_blocks_info_image_big_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_image_big_block_parent_id_idx" ON "_pages_v_blocks_info_image_big_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_image_big_block_path_idx" ON "_pages_v_blocks_info_image_big_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_info_image_big_block_image_idx" ON "_pages_v_blocks_info_image_big_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_info_video_block_order_idx" ON "_pages_v_blocks_info_video_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_video_block_parent_id_idx" ON "_pages_v_blocks_info_video_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_video_block_path_idx" ON "_pages_v_blocks_info_video_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_info_video_block_thumbnail_idx" ON "_pages_v_blocks_info_video_block" USING btree ("thumbnail_id");
  CREATE INDEX "_pages_v_blocks_content_cards_block_items_order_idx" ON "_pages_v_blocks_content_cards_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_cards_block_items_parent_id_idx" ON "_pages_v_blocks_content_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_cards_block_items_image_idx" ON "_pages_v_blocks_content_cards_block_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_content_cards_block_order_idx" ON "_pages_v_blocks_content_cards_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_cards_block_parent_id_idx" ON "_pages_v_blocks_content_cards_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_cards_block_path_idx" ON "_pages_v_blocks_content_cards_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_callback_block_order_idx" ON "_pages_v_blocks_callback_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_callback_block_parent_id_idx" ON "_pages_v_blocks_callback_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_callback_block_path_idx" ON "_pages_v_blocks_callback_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_callback_block_image_idx" ON "_pages_v_blocks_callback_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_contact_strip_block_order_idx" ON "_pages_v_blocks_contact_strip_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_strip_block_parent_id_idx" ON "_pages_v_blocks_contact_strip_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_strip_block_path_idx" ON "_pages_v_blocks_contact_strip_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_flash_message_block_order_idx" ON "_pages_v_blocks_flash_message_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_flash_message_block_parent_id_idx" ON "_pages_v_blocks_flash_message_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_flash_message_block_path_idx" ON "_pages_v_blocks_flash_message_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_conversions_block_items_order_idx" ON "_pages_v_blocks_conversions_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_conversions_block_items_parent_id_idx" ON "_pages_v_blocks_conversions_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_conversions_block_order_idx" ON "_pages_v_blocks_conversions_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_conversions_block_parent_id_idx" ON "_pages_v_blocks_conversions_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_conversions_block_path_idx" ON "_pages_v_blocks_conversions_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_block_order_idx" ON "_pages_v_blocks_image_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_block_parent_id_idx" ON "_pages_v_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_block_path_idx" ON "_pages_v_blocks_image_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_block_image_idx" ON "_pages_v_blocks_image_block" USING btree ("image_id");
  CREATE INDEX "_jumbotronSticker_v_order_idx" ON "_jumbotronSticker_v" USING btree ("_order");
  CREATE INDEX "_jumbotronSticker_v_parent_id_idx" ON "_jumbotronSticker_v" USING btree ("_parent_id");
  CREATE INDEX "_jumbotronSticker_v_path_idx" ON "_jumbotronSticker_v" USING btree ("_path");
  CREATE INDEX "_jumbotronSticker_v_image_idx" ON "_jumbotronSticker_v" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_info_desktop_block_order_idx" ON "_pages_v_blocks_info_desktop_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_desktop_block_parent_id_idx" ON "_pages_v_blocks_info_desktop_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_desktop_block_path_idx" ON "_pages_v_blocks_info_desktop_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_info_desktop_block_image_idx" ON "_pages_v_blocks_info_desktop_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_info_image_block_order_idx" ON "_pages_v_blocks_info_image_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_image_block_parent_id_idx" ON "_pages_v_blocks_info_image_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_image_block_path_idx" ON "_pages_v_blocks_info_image_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_info_image_block_image_idx" ON "_pages_v_blocks_info_image_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_info_plain_block_order_idx" ON "_pages_v_blocks_info_plain_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_plain_block_parent_id_idx" ON "_pages_v_blocks_info_plain_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_plain_block_path_idx" ON "_pages_v_blocks_info_plain_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_jumbotron_block_order_idx" ON "_pages_v_blocks_jumbotron_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_jumbotron_block_parent_id_idx" ON "_pages_v_blocks_jumbotron_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_jumbotron_block_path_idx" ON "_pages_v_blocks_jumbotron_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_jumbotron_block_image_idx" ON "_pages_v_blocks_jumbotron_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_benefits_block_items_order_idx" ON "_pages_v_blocks_benefits_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_block_items_parent_id_idx" ON "_pages_v_blocks_benefits_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_block_items_icon_idx" ON "_pages_v_blocks_benefits_block_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_benefits_block_order_idx" ON "_pages_v_blocks_benefits_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_block_parent_id_idx" ON "_pages_v_blocks_benefits_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_block_path_idx" ON "_pages_v_blocks_benefits_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_benefits_with_image_block_items_order_idx" ON "_pages_v_blocks_benefits_with_image_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_with_image_block_items_parent_id_idx" ON "_pages_v_blocks_benefits_with_image_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_with_image_block_items_image_idx" ON "_pages_v_blocks_benefits_with_image_block_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_benefits_with_image_block_order_idx" ON "_pages_v_blocks_benefits_with_image_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_with_image_block_parent_id_idx" ON "_pages_v_blocks_benefits_with_image_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_with_image_block_path_idx" ON "_pages_v_blocks_benefits_with_image_block" USING btree ("_path");
  CREATE INDEX "_prodCardsVert_v_items_order_idx" ON "_prodCardsVert_v_items" USING btree ("_order");
  CREATE INDEX "_prodCardsVert_v_items_parent_id_idx" ON "_prodCardsVert_v_items" USING btree ("_parent_id");
  CREATE INDEX "_prodCardsVert_v_order_idx" ON "_prodCardsVert_v" USING btree ("_order");
  CREATE INDEX "_prodCardsVert_v_parent_id_idx" ON "_prodCardsVert_v" USING btree ("_parent_id");
  CREATE INDEX "_prodCardsVert_v_path_idx" ON "_prodCardsVert_v" USING btree ("_path");
  CREATE INDEX "_prodCardHorz_v_items_order_idx" ON "_prodCardHorz_v_items" USING btree ("_order");
  CREATE INDEX "_prodCardHorz_v_items_parent_id_idx" ON "_prodCardHorz_v_items" USING btree ("_parent_id");
  CREATE INDEX "_prodCardHorz_v_items_image_idx" ON "_prodCardHorz_v_items" USING btree ("image_id");
  CREATE INDEX "_prodCardHorz_v_order_idx" ON "_prodCardHorz_v" USING btree ("_order");
  CREATE INDEX "_prodCardHorz_v_parent_id_idx" ON "_prodCardHorz_v" USING btree ("_parent_id");
  CREATE INDEX "_prodCardHorz_v_path_idx" ON "_prodCardHorz_v" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_benefits_with_list_block_cards_order_idx" ON "_pages_v_blocks_benefits_with_list_block_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_with_list_block_cards_parent_id_idx" ON "_pages_v_blocks_benefits_with_list_block_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_with_list_block_cards_icon_idx" ON "_pages_v_blocks_benefits_with_list_block_cards" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_benefits_with_list_block_items_order_idx" ON "_pages_v_blocks_benefits_with_list_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_with_list_block_items_parent_id_idx" ON "_pages_v_blocks_benefits_with_list_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_with_list_block_order_idx" ON "_pages_v_blocks_benefits_with_list_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_with_list_block_parent_id_idx" ON "_pages_v_blocks_benefits_with_list_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_with_list_block_path_idx" ON "_pages_v_blocks_benefits_with_list_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_info_card_narrow_block_items_order_idx" ON "_pages_v_blocks_info_card_narrow_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_card_narrow_block_items_parent_id_idx" ON "_pages_v_blocks_info_card_narrow_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_card_narrow_block_order_idx" ON "_pages_v_blocks_info_card_narrow_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_card_narrow_block_parent_id_idx" ON "_pages_v_blocks_info_card_narrow_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_card_narrow_block_path_idx" ON "_pages_v_blocks_info_card_narrow_block" USING btree ("_path");
  CREATE INDEX "_loyalBenefits_v_items_order_idx" ON "_loyalBenefits_v_items" USING btree ("_order");
  CREATE INDEX "_loyalBenefits_v_items_parent_id_idx" ON "_loyalBenefits_v_items" USING btree ("_parent_id");
  CREATE INDEX "_loyalBenefits_v_order_idx" ON "_loyalBenefits_v" USING btree ("_order");
  CREATE INDEX "_loyalBenefits_v_parent_id_idx" ON "_loyalBenefits_v" USING btree ("_parent_id");
  CREATE INDEX "_loyalBenefits_v_path_idx" ON "_loyalBenefits_v" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_discounts_block_items_order_idx" ON "_pages_v_blocks_discounts_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_discounts_block_items_parent_id_idx" ON "_pages_v_blocks_discounts_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_discounts_block_items_image_idx" ON "_pages_v_blocks_discounts_block_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_discounts_block_order_idx" ON "_pages_v_blocks_discounts_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_discounts_block_parent_id_idx" ON "_pages_v_blocks_discounts_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_discounts_block_path_idx" ON "_pages_v_blocks_discounts_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_block_items_order_idx" ON "_pages_v_blocks_faq_items_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_block_items_parent_id_idx" ON "_pages_v_blocks_faq_items_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_block_order_idx" ON "_pages_v_blocks_faq_items_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_block_parent_id_idx" ON "_pages_v_blocks_faq_items_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_block_path_idx" ON "_pages_v_blocks_faq_items_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_info_center_faq_block_items_order_idx" ON "_pages_v_blocks_info_center_faq_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_center_faq_block_items_parent_id_idx" ON "_pages_v_blocks_info_center_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_center_faq_block_order_idx" ON "_pages_v_blocks_info_center_faq_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_center_faq_block_parent_id_idx" ON "_pages_v_blocks_info_center_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_center_faq_block_path_idx" ON "_pages_v_blocks_info_center_faq_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_info_center_cards_block_items_order_idx" ON "_pages_v_blocks_info_center_cards_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_center_cards_block_items_parent_id_idx" ON "_pages_v_blocks_info_center_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_center_cards_block_items_icon_idx" ON "_pages_v_blocks_info_center_cards_block_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_info_center_cards_block_order_idx" ON "_pages_v_blocks_info_center_cards_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_center_cards_block_parent_id_idx" ON "_pages_v_blocks_info_center_cards_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_center_cards_block_path_idx" ON "_pages_v_blocks_info_center_cards_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_cards_block_items_order_idx" ON "_pages_v_blocks_video_cards_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_cards_block_items_parent_id_idx" ON "_pages_v_blocks_video_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_cards_block_items_image_idx" ON "_pages_v_blocks_video_cards_block_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_video_cards_block_order_idx" ON "_pages_v_blocks_video_cards_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_cards_block_parent_id_idx" ON "_pages_v_blocks_video_cards_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_cards_block_path_idx" ON "_pages_v_blocks_video_cards_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_link_cards_block_items_order_idx" ON "_pages_v_blocks_link_cards_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_cards_block_items_parent_id_idx" ON "_pages_v_blocks_link_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_cards_block_items_image_idx" ON "_pages_v_blocks_link_cards_block_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_link_cards_block_order_idx" ON "_pages_v_blocks_link_cards_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_cards_block_parent_id_idx" ON "_pages_v_blocks_link_cards_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_cards_block_path_idx" ON "_pages_v_blocks_link_cards_block" USING btree ("_path");
  CREATE INDEX "_heroReasonsSimpl_v_items_order_idx" ON "_heroReasonsSimpl_v_items" USING btree ("_order");
  CREATE INDEX "_heroReasonsSimpl_v_items_parent_id_idx" ON "_heroReasonsSimpl_v_items" USING btree ("_parent_id");
  CREATE INDEX "_heroReasonsSimpl_v_items_image_idx" ON "_heroReasonsSimpl_v_items" USING btree ("image_id");
  CREATE INDEX "_heroReasonsSimpl_v_order_idx" ON "_heroReasonsSimpl_v" USING btree ("_order");
  CREATE INDEX "_heroReasonsSimpl_v_parent_id_idx" ON "_heroReasonsSimpl_v" USING btree ("_parent_id");
  CREATE INDEX "_heroReasonsSimpl_v_path_idx" ON "_heroReasonsSimpl_v" USING btree ("_path");
  CREATE INDEX "_heroReasonsSimpl_v_image_idx" ON "_heroReasonsSimpl_v" USING btree ("image_id");
  CREATE INDEX "_etfTable_v_columns_order_idx" ON "_etfTable_v_columns" USING btree ("_order");
  CREATE INDEX "_etfTable_v_columns_parent_id_idx" ON "_etfTable_v_columns" USING btree ("_parent_id");
  CREATE INDEX "_etfTable_v_rows_values_order_idx" ON "_etfTable_v_rows_values" USING btree ("_order");
  CREATE INDEX "_etfTable_v_rows_values_parent_id_idx" ON "_etfTable_v_rows_values" USING btree ("_parent_id");
  CREATE INDEX "_etfTable_v_rows_order_idx" ON "_etfTable_v_rows" USING btree ("_order");
  CREATE INDEX "_etfTable_v_rows_parent_id_idx" ON "_etfTable_v_rows" USING btree ("_parent_id");
  CREATE INDEX "_etfTable_v_order_idx" ON "_etfTable_v" USING btree ("_order");
  CREATE INDEX "_etfTable_v_parent_id_idx" ON "_etfTable_v" USING btree ("_parent_id");
  CREATE INDEX "_etfTable_v_path_idx" ON "_etfTable_v" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_download_section_block_items_order_idx" ON "_pages_v_blocks_download_section_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_download_section_block_items_parent_id_idx" ON "_pages_v_blocks_download_section_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_download_section_block_order_idx" ON "_pages_v_blocks_download_section_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_download_section_block_parent_id_idx" ON "_pages_v_blocks_download_section_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_download_section_block_path_idx" ON "_pages_v_blocks_download_section_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_exchange_rates_block_rates_order_idx" ON "_pages_v_blocks_exchange_rates_block_rates" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_exchange_rates_block_rates_parent_id_idx" ON "_pages_v_blocks_exchange_rates_block_rates" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_exchange_rates_block_order_idx" ON "_pages_v_blocks_exchange_rates_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_exchange_rates_block_parent_id_idx" ON "_pages_v_blocks_exchange_rates_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_exchange_rates_block_path_idx" ON "_pages_v_blocks_exchange_rates_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_compare_table_block_banks_order_idx" ON "_pages_v_blocks_compare_table_block_banks" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_table_block_banks_parent_id_idx" ON "_pages_v_blocks_compare_table_block_banks" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_table_block_banks_logo_idx" ON "_pages_v_blocks_compare_table_block_banks" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_compare_table_block_features_values_order_idx" ON "_pages_v_blocks_compare_table_block_features_values" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_table_block_features_values_parent_id_idx" ON "_pages_v_blocks_compare_table_block_features_values" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_table_block_features_order_idx" ON "_pages_v_blocks_compare_table_block_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_table_block_features_parent_id_idx" ON "_pages_v_blocks_compare_table_block_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_table_block_order_idx" ON "_pages_v_blocks_compare_table_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_table_block_parent_id_idx" ON "_pages_v_blocks_compare_table_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_table_block_path_idx" ON "_pages_v_blocks_compare_table_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_compare_bonds_table_block_rows_order_idx" ON "_pages_v_blocks_compare_bonds_table_block_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_bonds_table_block_rows_parent_id_idx" ON "_pages_v_blocks_compare_bonds_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_bonds_table_block_order_idx" ON "_pages_v_blocks_compare_bonds_table_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_bonds_table_block_parent_id_idx" ON "_pages_v_blocks_compare_bonds_table_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_bonds_table_block_path_idx" ON "_pages_v_blocks_compare_bonds_table_block" USING btree ("_path");
  CREATE INDEX "_tblCardCollapse_v_sections_rows_order_idx" ON "_tblCardCollapse_v_sections_rows" USING btree ("_order");
  CREATE INDEX "_tblCardCollapse_v_sections_rows_parent_id_idx" ON "_tblCardCollapse_v_sections_rows" USING btree ("_parent_id");
  CREATE INDEX "_tblCardCollapse_v_sections_order_idx" ON "_tblCardCollapse_v_sections" USING btree ("_order");
  CREATE INDEX "_tblCardCollapse_v_sections_parent_id_idx" ON "_tblCardCollapse_v_sections" USING btree ("_parent_id");
  CREATE INDEX "_tblCardCollapse_v_order_idx" ON "_tblCardCollapse_v" USING btree ("_order");
  CREATE INDEX "_tblCardCollapse_v_parent_id_idx" ON "_tblCardCollapse_v" USING btree ("_parent_id");
  CREATE INDEX "_tblCardCollapse_v_path_idx" ON "_tblCardCollapse_v" USING btree ("_path");
  CREATE INDEX "_exchCompTable_v_providers_order_idx" ON "_exchCompTable_v_providers" USING btree ("_order");
  CREATE INDEX "_exchCompTable_v_providers_parent_id_idx" ON "_exchCompTable_v_providers" USING btree ("_parent_id");
  CREATE INDEX "_exchCompTable_v_providers_logo_idx" ON "_exchCompTable_v_providers" USING btree ("logo_id");
  CREATE INDEX "_exchCompTable_v_currencies_values_order_idx" ON "_exchCompTable_v_currencies_values" USING btree ("_order");
  CREATE INDEX "_exchCompTable_v_currencies_values_parent_id_idx" ON "_exchCompTable_v_currencies_values" USING btree ("_parent_id");
  CREATE INDEX "_exchCompTable_v_currencies_order_idx" ON "_exchCompTable_v_currencies" USING btree ("_order");
  CREATE INDEX "_exchCompTable_v_currencies_parent_id_idx" ON "_exchCompTable_v_currencies" USING btree ("_parent_id");
  CREATE INDEX "_exchCompTable_v_order_idx" ON "_exchCompTable_v" USING btree ("_order");
  CREATE INDEX "_exchCompTable_v_parent_id_idx" ON "_exchCompTable_v" USING btree ("_parent_id");
  CREATE INDEX "_exchCompTable_v_path_idx" ON "_exchCompTable_v" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_loan_calculator_block_order_idx" ON "_pages_v_blocks_loan_calculator_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_loan_calculator_block_parent_id_idx" ON "_pages_v_blocks_loan_calculator_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_loan_calculator_block_path_idx" ON "_pages_v_blocks_loan_calculator_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_mortgage_calculator_block_order_idx" ON "_pages_v_blocks_mortgage_calculator_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mortgage_calculator_block_parent_id_idx" ON "_pages_v_blocks_mortgage_calculator_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mortgage_calculator_block_path_idx" ON "_pages_v_blocks_mortgage_calculator_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_inflation_calculator_block_order_idx" ON "_pages_v_blocks_inflation_calculator_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_inflation_calculator_block_parent_id_idx" ON "_pages_v_blocks_inflation_calculator_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_inflation_calculator_block_path_idx" ON "_pages_v_blocks_inflation_calculator_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_zonky_calculator_block_order_idx" ON "_pages_v_blocks_zonky_calculator_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_zonky_calculator_block_parent_id_idx" ON "_pages_v_blocks_zonky_calculator_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_zonky_calculator_block_path_idx" ON "_pages_v_blocks_zonky_calculator_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_zone_interest_block_order_idx" ON "_pages_v_blocks_zone_interest_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_zone_interest_block_parent_id_idx" ON "_pages_v_blocks_zone_interest_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_zone_interest_block_path_idx" ON "_pages_v_blocks_zone_interest_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_portu_calculator_block_order_idx" ON "_pages_v_blocks_portu_calculator_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_portu_calculator_block_parent_id_idx" ON "_pages_v_blocks_portu_calculator_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_portu_calculator_block_path_idx" ON "_pages_v_blocks_portu_calculator_block" USING btree ("_path");
  CREATE INDEX "_portuPensionCalc_v_order_idx" ON "_portuPensionCalc_v" USING btree ("_order");
  CREATE INDEX "_portuPensionCalc_v_parent_id_idx" ON "_portuPensionCalc_v" USING btree ("_parent_id");
  CREATE INDEX "_portuPensionCalc_v_path_idx" ON "_portuPensionCalc_v" USING btree ("_path");
  CREATE INDEX "_pensionSavCalc_v_order_idx" ON "_pensionSavCalc_v" USING btree ("_order");
  CREATE INDEX "_pensionSavCalc_v_parent_id_idx" ON "_pensionSavCalc_v" USING btree ("_parent_id");
  CREATE INDEX "_pensionSavCalc_v_path_idx" ON "_pensionSavCalc_v" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_block_items_order_idx" ON "_pages_v_blocks_timeline_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_block_items_parent_id_idx" ON "_pages_v_blocks_timeline_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_block_items_image_idx" ON "_pages_v_blocks_timeline_block_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_timeline_block_order_idx" ON "_pages_v_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_block_parent_id_idx" ON "_pages_v_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_block_path_idx" ON "_pages_v_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX "_topMgmtCards_v_items_order_idx" ON "_topMgmtCards_v_items" USING btree ("_order");
  CREATE INDEX "_topMgmtCards_v_items_parent_id_idx" ON "_topMgmtCards_v_items" USING btree ("_parent_id");
  CREATE INDEX "_topMgmtCards_v_items_image_idx" ON "_topMgmtCards_v_items" USING btree ("image_id");
  CREATE INDEX "_topMgmtCards_v_order_idx" ON "_topMgmtCards_v" USING btree ("_order");
  CREATE INDEX "_topMgmtCards_v_parent_id_idx" ON "_topMgmtCards_v" USING btree ("_parent_id");
  CREATE INDEX "_topMgmtCards_v_path_idx" ON "_topMgmtCards_v" USING btree ("_path");
  CREATE INDEX "_pressContact_v_items_order_idx" ON "_pressContact_v_items" USING btree ("_order");
  CREATE INDEX "_pressContact_v_items_parent_id_idx" ON "_pressContact_v_items" USING btree ("_parent_id");
  CREATE INDEX "_pressContact_v_items_image_idx" ON "_pressContact_v_items" USING btree ("image_id");
  CREATE INDEX "_pressContact_v_order_idx" ON "_pressContact_v" USING btree ("_order");
  CREATE INDEX "_pressContact_v_parent_id_idx" ON "_pressContact_v" USING btree ("_parent_id");
  CREATE INDEX "_pressContact_v_path_idx" ON "_pressContact_v" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_carousel_block_logos_order_idx" ON "_pages_v_blocks_logo_carousel_block_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_carousel_block_logos_parent_id_idx" ON "_pages_v_blocks_logo_carousel_block_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_carousel_block_logos_image_idx" ON "_pages_v_blocks_logo_carousel_block_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_logo_carousel_block_order_idx" ON "_pages_v_blocks_logo_carousel_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_carousel_block_parent_id_idx" ON "_pages_v_blocks_logo_carousel_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_carousel_block_path_idx" ON "_pages_v_blocks_logo_carousel_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_application_block_reviews_order_idx" ON "_pages_v_blocks_feature_application_block_reviews" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_application_block_reviews_parent_id_idx" ON "_pages_v_blocks_feature_application_block_reviews" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_application_block_order_idx" ON "_pages_v_blocks_feature_application_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_application_block_parent_id_idx" ON "_pages_v_blocks_feature_application_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_application_block_path_idx" ON "_pages_v_blocks_feature_application_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_application_block_image_idx" ON "_pages_v_blocks_feature_application_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_youtube_video_block_order_idx" ON "_pages_v_blocks_youtube_video_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_youtube_video_block_parent_id_idx" ON "_pages_v_blocks_youtube_video_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_youtube_video_block_path_idx" ON "_pages_v_blocks_youtube_video_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_callback_simplified_block_order_idx" ON "_pages_v_blocks_callback_simplified_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_callback_simplified_block_parent_id_idx" ON "_pages_v_blocks_callback_simplified_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_callback_simplified_block_path_idx" ON "_pages_v_blocks_callback_simplified_block" USING btree ("_path");
  CREATE INDEX "_loyalCustTimeline_v_items_order_idx" ON "_loyalCustTimeline_v_items" USING btree ("_order");
  CREATE INDEX "_loyalCustTimeline_v_items_parent_id_idx" ON "_loyalCustTimeline_v_items" USING btree ("_parent_id");
  CREATE INDEX "_loyalCustTimeline_v_order_idx" ON "_loyalCustTimeline_v" USING btree ("_order");
  CREATE INDEX "_loyalCustTimeline_v_parent_id_idx" ON "_loyalCustTimeline_v" USING btree ("_parent_id");
  CREATE INDEX "_loyalCustTimeline_v_path_idx" ON "_loyalCustTimeline_v" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_omnichannel_banner_block_items_order_idx" ON "_pages_v_blocks_omnichannel_banner_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_omnichannel_banner_block_items_parent_id_idx" ON "_pages_v_blocks_omnichannel_banner_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_omnichannel_banner_block_order_idx" ON "_pages_v_blocks_omnichannel_banner_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_omnichannel_banner_block_parent_id_idx" ON "_pages_v_blocks_omnichannel_banner_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_omnichannel_banner_block_path_idx" ON "_pages_v_blocks_omnichannel_banner_block" USING btree ("_path");
  CREATE INDEX "_prodCardsHorz_v_items_order_idx" ON "_prodCardsHorz_v_items" USING btree ("_order");
  CREATE INDEX "_prodCardsHorz_v_items_parent_id_idx" ON "_prodCardsHorz_v_items" USING btree ("_parent_id");
  CREATE INDEX "_prodCardsHorz_v_items_image_idx" ON "_prodCardsHorz_v_items" USING btree ("image_id");
  CREATE INDEX "_prodCardsHorz_v_order_idx" ON "_prodCardsHorz_v" USING btree ("_order");
  CREATE INDEX "_prodCardsHorz_v_parent_id_idx" ON "_prodCardsHorz_v" USING btree ("_parent_id");
  CREATE INDEX "_prodCardsHorz_v_path_idx" ON "_prodCardsHorz_v" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_steps_block_items_order_idx" ON "_pages_v_blocks_steps_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_block_items_parent_id_idx" ON "_pages_v_blocks_steps_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_block_items_image_idx" ON "_pages_v_blocks_steps_block_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_steps_block_order_idx" ON "_pages_v_blocks_steps_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_block_parent_id_idx" ON "_pages_v_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_block_path_idx" ON "_pages_v_blocks_steps_block" USING btree ("_path");
  CREATE INDEX "_stepsVertCollapse_v_items_order_idx" ON "_stepsVertCollapse_v_items" USING btree ("_order");
  CREATE INDEX "_stepsVertCollapse_v_items_parent_id_idx" ON "_stepsVertCollapse_v_items" USING btree ("_parent_id");
  CREATE INDEX "_stepsVertCollapse_v_order_idx" ON "_stepsVertCollapse_v" USING btree ("_order");
  CREATE INDEX "_stepsVertCollapse_v_parent_id_idx" ON "_stepsVertCollapse_v" USING btree ("_parent_id");
  CREATE INDEX "_stepsVertCollapse_v_path_idx" ON "_stepsVertCollapse_v" USING btree ("_path");
  CREATE INDEX "_loyalCustApp_v_order_idx" ON "_loyalCustApp_v" USING btree ("_order");
  CREATE INDEX "_loyalCustApp_v_parent_id_idx" ON "_loyalCustApp_v" USING btree ("_parent_id");
  CREATE INDEX "_loyalCustApp_v_path_idx" ON "_loyalCustApp_v" USING btree ("_path");
  CREATE INDEX "_loyalCustApp_v_image_idx" ON "_loyalCustApp_v" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_product_banner_block_items_order_idx" ON "_pages_v_blocks_product_banner_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_banner_block_items_parent_id_idx" ON "_pages_v_blocks_product_banner_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_banner_block_items_icon_idx" ON "_pages_v_blocks_product_banner_block_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_product_banner_block_order_idx" ON "_pages_v_blocks_product_banner_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_banner_block_parent_id_idx" ON "_pages_v_blocks_product_banner_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_banner_block_path_idx" ON "_pages_v_blocks_product_banner_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_homepage_bottom_block_rates_order_idx" ON "_pages_v_blocks_homepage_bottom_block_rates" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_homepage_bottom_block_rates_parent_id_idx" ON "_pages_v_blocks_homepage_bottom_block_rates" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_homepage_bottom_block_rates_flag_icon_idx" ON "_pages_v_blocks_homepage_bottom_block_rates" USING btree ("flag_icon_id");
  CREATE INDEX "_pages_v_blocks_homepage_bottom_block_news_order_idx" ON "_pages_v_blocks_homepage_bottom_block_news" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_homepage_bottom_block_news_parent_id_idx" ON "_pages_v_blocks_homepage_bottom_block_news" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_homepage_bottom_block_order_idx" ON "_pages_v_blocks_homepage_bottom_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_homepage_bottom_block_parent_id_idx" ON "_pages_v_blocks_homepage_bottom_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_homepage_bottom_block_path_idx" ON "_pages_v_blocks_homepage_bottom_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_benefits_columns_block_items_order_idx" ON "_pages_v_blocks_benefits_columns_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_columns_block_items_parent_id_idx" ON "_pages_v_blocks_benefits_columns_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_columns_block_items_icon_idx" ON "_pages_v_blocks_benefits_columns_block_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_benefits_columns_block_order_idx" ON "_pages_v_blocks_benefits_columns_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_columns_block_parent_id_idx" ON "_pages_v_blocks_benefits_columns_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_columns_block_path_idx" ON "_pages_v_blocks_benefits_columns_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_cards_block_items_order_idx" ON "_pages_v_blocks_cta_cards_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_cards_block_items_parent_id_idx" ON "_pages_v_blocks_cta_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_cards_block_items_icon_idx" ON "_pages_v_blocks_cta_cards_block_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_cta_cards_block_order_idx" ON "_pages_v_blocks_cta_cards_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_cards_block_parent_id_idx" ON "_pages_v_blocks_cta_cards_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_cards_block_path_idx" ON "_pages_v_blocks_cta_cards_block" USING btree ("_path");
  CREATE INDEX "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_doc_idx" ON "_pages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "third_party_access_updated_at_idx" ON "third_party_access" USING btree ("updated_at");
  CREATE INDEX "third_party_access_created_at_idx" ON "third_party_access" USING btree ("created_at");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_pages_id_idx" ON "search_rels" USING btree ("pages_id");
  CREATE INDEX "search_rels_categories_id_idx" ON "search_rels" USING btree ("categories_id");
  CREATE INDEX "search_rels_articles_id_idx" ON "search_rels" USING btree ("articles_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("assets_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_third_party_access_id_idx" ON "payload_locked_documents_rels" USING btree ("third_party_access_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_third_party_access_id_idx" ON "payload_preferences_rels" USING btree ("third_party_access_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_navigation_children_order_idx" ON "header_navigation_children" USING btree ("_order");
  CREATE INDEX "header_navigation_children_parent_id_idx" ON "header_navigation_children" USING btree ("_parent_id");
  CREATE INDEX "header_navigation_order_idx" ON "header_navigation" USING btree ("_order");
  CREATE INDEX "header_navigation_parent_id_idx" ON "header_navigation" USING btree ("_parent_id");
  CREATE INDEX "header_cta_buttons_order_idx" ON "header_cta_buttons" USING btree ("_order");
  CREATE INDEX "header_cta_buttons_parent_id_idx" ON "header_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "footer_columns_items_order_idx" ON "footer_columns_items" USING btree ("_order");
  CREATE INDEX "footer_columns_items_parent_id_idx" ON "footer_columns_items" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "settings_socials_order_idx" ON "settings_socials" USING btree ("_order");
  CREATE INDEX "settings_socials_parent_id_idx" ON "settings_socials" USING btree ("_parent_id");
  CREATE INDEX "settings_logo_idx" ON "settings" USING btree ("logo_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "articles" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "assets" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_hero_plain_block_links" CASCADE;
  DROP TABLE "pages_blocks_hero_plain_block" CASCADE;
  DROP TABLE "pages_blocks_hero_with_image_block_links" CASCADE;
  DROP TABLE "pages_blocks_hero_with_image_block" CASCADE;
  DROP TABLE "pages_blocks_hero_slider_block_slides" CASCADE;
  DROP TABLE "pages_blocks_hero_slider_block" CASCADE;
  DROP TABLE "heroSearch_links" CASCADE;
  DROP TABLE "heroSearch" CASCADE;
  DROP TABLE "heroCompact_links" CASCADE;
  DROP TABLE "heroCompact_breadcrumbs" CASCADE;
  DROP TABLE "heroCompact" CASCADE;
  DROP TABLE "pages_blocks_rich_text_block" CASCADE;
  DROP TABLE "pages_blocks_feature_block_links" CASCADE;
  DROP TABLE "pages_blocks_feature_block" CASCADE;
  DROP TABLE "pages_blocks_info_double_image_block" CASCADE;
  DROP TABLE "pages_blocks_info_image_big_block" CASCADE;
  DROP TABLE "pages_blocks_info_video_block" CASCADE;
  DROP TABLE "pages_blocks_content_cards_block_items" CASCADE;
  DROP TABLE "pages_blocks_content_cards_block" CASCADE;
  DROP TABLE "pages_blocks_callback_block" CASCADE;
  DROP TABLE "pages_blocks_contact_strip_block" CASCADE;
  DROP TABLE "pages_blocks_flash_message_block" CASCADE;
  DROP TABLE "pages_blocks_conversions_block_items" CASCADE;
  DROP TABLE "pages_blocks_conversions_block" CASCADE;
  DROP TABLE "pages_blocks_image_block" CASCADE;
  DROP TABLE "jumbotronSticker" CASCADE;
  DROP TABLE "pages_blocks_info_desktop_block" CASCADE;
  DROP TABLE "pages_blocks_info_image_block" CASCADE;
  DROP TABLE "pages_blocks_info_plain_block" CASCADE;
  DROP TABLE "pages_blocks_jumbotron_block" CASCADE;
  DROP TABLE "pages_blocks_benefits_block_items" CASCADE;
  DROP TABLE "pages_blocks_benefits_block" CASCADE;
  DROP TABLE "pages_blocks_benefits_with_image_block_items" CASCADE;
  DROP TABLE "pages_blocks_benefits_with_image_block" CASCADE;
  DROP TABLE "prodCardsVert_items" CASCADE;
  DROP TABLE "prodCardsVert" CASCADE;
  DROP TABLE "prodCardHorz_items" CASCADE;
  DROP TABLE "prodCardHorz" CASCADE;
  DROP TABLE "pages_blocks_benefits_with_list_block_cards" CASCADE;
  DROP TABLE "pages_blocks_benefits_with_list_block_items" CASCADE;
  DROP TABLE "pages_blocks_benefits_with_list_block" CASCADE;
  DROP TABLE "pages_blocks_info_card_narrow_block_items" CASCADE;
  DROP TABLE "pages_blocks_info_card_narrow_block" CASCADE;
  DROP TABLE "loyalBenefits_items" CASCADE;
  DROP TABLE "loyalBenefits" CASCADE;
  DROP TABLE "pages_blocks_discounts_block_items" CASCADE;
  DROP TABLE "pages_blocks_discounts_block" CASCADE;
  DROP TABLE "pages_blocks_faq_items_block_items" CASCADE;
  DROP TABLE "pages_blocks_faq_items_block" CASCADE;
  DROP TABLE "pages_blocks_info_center_faq_block_items" CASCADE;
  DROP TABLE "pages_blocks_info_center_faq_block" CASCADE;
  DROP TABLE "pages_blocks_info_center_cards_block_items" CASCADE;
  DROP TABLE "pages_blocks_info_center_cards_block" CASCADE;
  DROP TABLE "pages_blocks_video_cards_block_items" CASCADE;
  DROP TABLE "pages_blocks_video_cards_block" CASCADE;
  DROP TABLE "pages_blocks_link_cards_block_items" CASCADE;
  DROP TABLE "pages_blocks_link_cards_block" CASCADE;
  DROP TABLE "heroReasonsSimpl_items" CASCADE;
  DROP TABLE "heroReasonsSimpl" CASCADE;
  DROP TABLE "etfTable_columns" CASCADE;
  DROP TABLE "etfTable_rows_values" CASCADE;
  DROP TABLE "etfTable_rows" CASCADE;
  DROP TABLE "etfTable" CASCADE;
  DROP TABLE "pages_blocks_download_section_block_items" CASCADE;
  DROP TABLE "pages_blocks_download_section_block" CASCADE;
  DROP TABLE "pages_blocks_exchange_rates_block_rates" CASCADE;
  DROP TABLE "pages_blocks_exchange_rates_block" CASCADE;
  DROP TABLE "pages_blocks_compare_table_block_banks" CASCADE;
  DROP TABLE "pages_blocks_compare_table_block_features_values" CASCADE;
  DROP TABLE "pages_blocks_compare_table_block_features" CASCADE;
  DROP TABLE "pages_blocks_compare_table_block" CASCADE;
  DROP TABLE "pages_blocks_compare_bonds_table_block_rows" CASCADE;
  DROP TABLE "pages_blocks_compare_bonds_table_block" CASCADE;
  DROP TABLE "tblCardCollapse_sections_rows" CASCADE;
  DROP TABLE "tblCardCollapse_sections" CASCADE;
  DROP TABLE "tblCardCollapse" CASCADE;
  DROP TABLE "exchCompTable_providers" CASCADE;
  DROP TABLE "exchCompTable_currencies_values" CASCADE;
  DROP TABLE "exchCompTable_currencies" CASCADE;
  DROP TABLE "exchCompTable" CASCADE;
  DROP TABLE "pages_blocks_loan_calculator_block" CASCADE;
  DROP TABLE "pages_blocks_mortgage_calculator_block" CASCADE;
  DROP TABLE "pages_blocks_inflation_calculator_block" CASCADE;
  DROP TABLE "pages_blocks_zonky_calculator_block" CASCADE;
  DROP TABLE "pages_blocks_zone_interest_block" CASCADE;
  DROP TABLE "pages_blocks_portu_calculator_block" CASCADE;
  DROP TABLE "portuPensionCalc" CASCADE;
  DROP TABLE "pensionSavCalc" CASCADE;
  DROP TABLE "pages_blocks_timeline_block_items" CASCADE;
  DROP TABLE "pages_blocks_timeline_block" CASCADE;
  DROP TABLE "topMgmtCards_items" CASCADE;
  DROP TABLE "topMgmtCards" CASCADE;
  DROP TABLE "pressContact_items" CASCADE;
  DROP TABLE "pressContact" CASCADE;
  DROP TABLE "pages_blocks_logo_carousel_block_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_carousel_block" CASCADE;
  DROP TABLE "pages_blocks_feature_application_block_reviews" CASCADE;
  DROP TABLE "pages_blocks_feature_application_block" CASCADE;
  DROP TABLE "pages_blocks_youtube_video_block" CASCADE;
  DROP TABLE "pages_blocks_callback_simplified_block" CASCADE;
  DROP TABLE "loyalCustTimeline_items" CASCADE;
  DROP TABLE "loyalCustTimeline" CASCADE;
  DROP TABLE "pages_blocks_omnichannel_banner_block_items" CASCADE;
  DROP TABLE "pages_blocks_omnichannel_banner_block" CASCADE;
  DROP TABLE "prodCardsHorz_items" CASCADE;
  DROP TABLE "prodCardsHorz" CASCADE;
  DROP TABLE "pages_blocks_steps_block_items" CASCADE;
  DROP TABLE "pages_blocks_steps_block" CASCADE;
  DROP TABLE "stepsVertCollapse_items" CASCADE;
  DROP TABLE "stepsVertCollapse" CASCADE;
  DROP TABLE "loyalCustApp" CASCADE;
  DROP TABLE "pages_blocks_product_banner_block_items" CASCADE;
  DROP TABLE "pages_blocks_product_banner_block" CASCADE;
  DROP TABLE "pages_blocks_homepage_bottom_block_rates" CASCADE;
  DROP TABLE "pages_blocks_homepage_bottom_block_news" CASCADE;
  DROP TABLE "pages_blocks_homepage_bottom_block" CASCADE;
  DROP TABLE "pages_blocks_benefits_columns_block_items" CASCADE;
  DROP TABLE "pages_blocks_benefits_columns_block" CASCADE;
  DROP TABLE "pages_blocks_cta_cards_block_items" CASCADE;
  DROP TABLE "pages_blocks_cta_cards_block" CASCADE;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_plain_block_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_plain_block" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_with_image_block_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_with_image_block" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slider_block_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slider_block" CASCADE;
  DROP TABLE "_heroSearch_v_links" CASCADE;
  DROP TABLE "_heroSearch_v" CASCADE;
  DROP TABLE "_heroCompact_v_links" CASCADE;
  DROP TABLE "_heroCompact_v_breadcrumbs" CASCADE;
  DROP TABLE "_heroCompact_v" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_block" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_block_links" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_block" CASCADE;
  DROP TABLE "_pages_v_blocks_info_double_image_block" CASCADE;
  DROP TABLE "_pages_v_blocks_info_image_big_block" CASCADE;
  DROP TABLE "_pages_v_blocks_info_video_block" CASCADE;
  DROP TABLE "_pages_v_blocks_content_cards_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_content_cards_block" CASCADE;
  DROP TABLE "_pages_v_blocks_callback_block" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_strip_block" CASCADE;
  DROP TABLE "_pages_v_blocks_flash_message_block" CASCADE;
  DROP TABLE "_pages_v_blocks_conversions_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_conversions_block" CASCADE;
  DROP TABLE "_pages_v_blocks_image_block" CASCADE;
  DROP TABLE "_jumbotronSticker_v" CASCADE;
  DROP TABLE "_pages_v_blocks_info_desktop_block" CASCADE;
  DROP TABLE "_pages_v_blocks_info_image_block" CASCADE;
  DROP TABLE "_pages_v_blocks_info_plain_block" CASCADE;
  DROP TABLE "_pages_v_blocks_jumbotron_block" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_block" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_with_image_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_with_image_block" CASCADE;
  DROP TABLE "_prodCardsVert_v_items" CASCADE;
  DROP TABLE "_prodCardsVert_v" CASCADE;
  DROP TABLE "_prodCardHorz_v_items" CASCADE;
  DROP TABLE "_prodCardHorz_v" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_with_list_block_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_with_list_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_with_list_block" CASCADE;
  DROP TABLE "_pages_v_blocks_info_card_narrow_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_info_card_narrow_block" CASCADE;
  DROP TABLE "_loyalBenefits_v_items" CASCADE;
  DROP TABLE "_loyalBenefits_v" CASCADE;
  DROP TABLE "_pages_v_blocks_discounts_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_discounts_block" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items_block" CASCADE;
  DROP TABLE "_pages_v_blocks_info_center_faq_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_info_center_faq_block" CASCADE;
  DROP TABLE "_pages_v_blocks_info_center_cards_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_info_center_cards_block" CASCADE;
  DROP TABLE "_pages_v_blocks_video_cards_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_video_cards_block" CASCADE;
  DROP TABLE "_pages_v_blocks_link_cards_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_link_cards_block" CASCADE;
  DROP TABLE "_heroReasonsSimpl_v_items" CASCADE;
  DROP TABLE "_heroReasonsSimpl_v" CASCADE;
  DROP TABLE "_etfTable_v_columns" CASCADE;
  DROP TABLE "_etfTable_v_rows_values" CASCADE;
  DROP TABLE "_etfTable_v_rows" CASCADE;
  DROP TABLE "_etfTable_v" CASCADE;
  DROP TABLE "_pages_v_blocks_download_section_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_download_section_block" CASCADE;
  DROP TABLE "_pages_v_blocks_exchange_rates_block_rates" CASCADE;
  DROP TABLE "_pages_v_blocks_exchange_rates_block" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_table_block_banks" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_table_block_features_values" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_table_block_features" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_table_block" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_bonds_table_block_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_bonds_table_block" CASCADE;
  DROP TABLE "_tblCardCollapse_v_sections_rows" CASCADE;
  DROP TABLE "_tblCardCollapse_v_sections" CASCADE;
  DROP TABLE "_tblCardCollapse_v" CASCADE;
  DROP TABLE "_exchCompTable_v_providers" CASCADE;
  DROP TABLE "_exchCompTable_v_currencies_values" CASCADE;
  DROP TABLE "_exchCompTable_v_currencies" CASCADE;
  DROP TABLE "_exchCompTable_v" CASCADE;
  DROP TABLE "_pages_v_blocks_loan_calculator_block" CASCADE;
  DROP TABLE "_pages_v_blocks_mortgage_calculator_block" CASCADE;
  DROP TABLE "_pages_v_blocks_inflation_calculator_block" CASCADE;
  DROP TABLE "_pages_v_blocks_zonky_calculator_block" CASCADE;
  DROP TABLE "_pages_v_blocks_zone_interest_block" CASCADE;
  DROP TABLE "_pages_v_blocks_portu_calculator_block" CASCADE;
  DROP TABLE "_portuPensionCalc_v" CASCADE;
  DROP TABLE "_pensionSavCalc_v" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_block" CASCADE;
  DROP TABLE "_topMgmtCards_v_items" CASCADE;
  DROP TABLE "_topMgmtCards_v" CASCADE;
  DROP TABLE "_pressContact_v_items" CASCADE;
  DROP TABLE "_pressContact_v" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_carousel_block_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_carousel_block" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_application_block_reviews" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_application_block" CASCADE;
  DROP TABLE "_pages_v_blocks_youtube_video_block" CASCADE;
  DROP TABLE "_pages_v_blocks_callback_simplified_block" CASCADE;
  DROP TABLE "_loyalCustTimeline_v_items" CASCADE;
  DROP TABLE "_loyalCustTimeline_v" CASCADE;
  DROP TABLE "_pages_v_blocks_omnichannel_banner_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_omnichannel_banner_block" CASCADE;
  DROP TABLE "_prodCardsHorz_v_items" CASCADE;
  DROP TABLE "_prodCardsHorz_v" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_block" CASCADE;
  DROP TABLE "_stepsVertCollapse_v_items" CASCADE;
  DROP TABLE "_stepsVertCollapse_v" CASCADE;
  DROP TABLE "_loyalCustApp_v" CASCADE;
  DROP TABLE "_pages_v_blocks_product_banner_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_product_banner_block" CASCADE;
  DROP TABLE "_pages_v_blocks_homepage_bottom_block_rates" CASCADE;
  DROP TABLE "_pages_v_blocks_homepage_bottom_block_news" CASCADE;
  DROP TABLE "_pages_v_blocks_homepage_bottom_block" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_columns_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_columns_block" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_cards_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_cards_block" CASCADE;
  DROP TABLE "_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "third_party_access" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_navigation_children" CASCADE;
  DROP TABLE "header_navigation" CASCADE;
  DROP TABLE "header_cta_buttons" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_columns_items" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "settings_socials" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_pages_blocks_hero_plain_block_links_appearance";
  DROP TYPE "public"."enum_pages_blocks_hero_plain_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_hero_plain_block_text_align";
  DROP TYPE "public"."enum_pages_blocks_hero_with_image_block_links_appearance";
  DROP TYPE "public"."enum_pages_blocks_hero_with_image_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_hero_with_image_block_image_position";
  DROP TYPE "public"."enum_pages_blocks_hero_slider_block_slides_background_color";
  DROP TYPE "public"."enum_heroSearch_links_appearance";
  DROP TYPE "public"."enum_heroSearch_background_color";
  DROP TYPE "public"."enum_heroCompact_links_appearance";
  DROP TYPE "public"."enum_heroCompact_background_color";
  DROP TYPE "public"."enum_pages_blocks_feature_block_links_appearance";
  DROP TYPE "public"."enum_pages_blocks_feature_block_image_position";
  DROP TYPE "public"."enum_pages_blocks_feature_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_info_image_big_block_image_position";
  DROP TYPE "public"."enum_pages_blocks_info_video_block_video_position";
  DROP TYPE "public"."enum_pages_blocks_callback_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_contact_strip_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_conversions_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_image_block_image_position";
  DROP TYPE "public"."enum_jumbotronSticker_background_color";
  DROP TYPE "public"."enum_pages_blocks_info_desktop_block_image_position";
  DROP TYPE "public"."enum_pages_blocks_info_desktop_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_info_image_block_image_position";
  DROP TYPE "public"."enum_pages_blocks_info_plain_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_jumbotron_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_benefits_block_columns";
  DROP TYPE "public"."enum_pages_blocks_benefits_with_image_block_columns";
  DROP TYPE "public"."enum_prodCardsVert_items_icon";
  DROP TYPE "public"."enum_pages_blocks_info_center_faq_block_items_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_application_block_reviews_store";
  DROP TYPE "public"."enum_pages_blocks_omnichannel_banner_block_background_color";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_plain_block_links_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_hero_plain_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_hero_plain_block_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_hero_with_image_block_links_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_hero_with_image_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_hero_with_image_block_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_hero_slider_block_slides_background_color";
  DROP TYPE "public"."enum__heroSearch_v_links_appearance";
  DROP TYPE "public"."enum__heroSearch_v_background_color";
  DROP TYPE "public"."enum__heroCompact_v_links_appearance";
  DROP TYPE "public"."enum__heroCompact_v_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_links_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_info_image_big_block_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_info_video_block_video_position";
  DROP TYPE "public"."enum__pages_v_blocks_callback_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_contact_strip_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_conversions_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_image_block_image_position";
  DROP TYPE "public"."enum__jumbotronSticker_v_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_info_desktop_block_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_info_desktop_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_info_image_block_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_info_plain_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_jumbotron_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_benefits_block_columns";
  DROP TYPE "public"."enum__pages_v_blocks_benefits_with_image_block_columns";
  DROP TYPE "public"."enum__prodCardsVert_v_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_info_center_faq_block_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_feature_application_block_reviews_store";
  DROP TYPE "public"."enum__pages_v_blocks_omnichannel_banner_block_background_color";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_header_navigation_children_link_type";
  DROP TYPE "public"."enum_header_navigation_children_link_appearance";
  DROP TYPE "public"."enum_header_navigation_link_type";
  DROP TYPE "public"."enum_header_navigation_link_appearance";
  DROP TYPE "public"."enum_header_cta_buttons_appearance";
  DROP TYPE "public"."enum_footer_columns_items_link_type";
  DROP TYPE "public"."enum_footer_columns_items_link_appearance";
  DROP TYPE "public"."enum_settings_socials_type";`);
}
