import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."prod_detail_cards_bg" AS ENUM('lightGrey', 'white');
  CREATE TYPE "public"."enum_pages_blocks_product_detail_cards_block_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_product_detail_cards_block_columns" AS ENUM('2', '3');
  CREATE TABLE "pages_blocks_product_detail_cards_block_items_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_product_detail_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"name" varchar,
  	"subtitle" varchar,
  	"description" jsonb,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_product_detail_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"layout_styles_anchor_id" varchar,
  	"layout_styles_variant" varchar,
  	"title" varchar,
  	"description" varchar,
  	"background_color" "prod_detail_cards_bg" DEFAULT 'lightGrey',
  	"columns" "enum_pages_blocks_product_detail_cards_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_detail_cards_block_items_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_detail_cards_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"name" varchar,
  	"subtitle" varchar,
  	"description" jsonb,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_detail_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"layout_styles_anchor_id" varchar,
  	"layout_styles_variant" varchar,
  	"title" varchar,
  	"description" varchar,
  	"background_color" "prod_detail_cards_bg" DEFAULT 'lightGrey',
  	"columns" "enum__pages_v_blocks_product_detail_cards_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_hero_plain_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_hero_plain_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_hero_with_image_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_hero_with_image_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_hero_slider_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_hero_slider_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "heroSearch" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "heroSearch" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "heroCompact" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "heroCompact" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_rich_text_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_rich_text_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_feature_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_feature_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_info_double_image_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_info_double_image_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_info_image_big_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_info_image_big_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_info_video_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_info_video_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_content_cards_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_content_cards_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_callback_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_callback_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_contact_strip_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_contact_strip_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_flash_message_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_flash_message_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_conversions_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_conversions_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_image_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_image_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "jumbotronSticker" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "jumbotronSticker" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_info_desktop_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_info_desktop_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_info_image_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_info_image_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_info_plain_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_info_plain_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_jumbotron_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_jumbotron_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_benefits_block_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_benefits_block_items" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_benefits_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_benefits_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_benefits_with_image_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_benefits_with_image_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "prodCardsVert" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "prodCardsVert" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "prodCardHorz" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "prodCardHorz" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_benefits_with_list_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_benefits_with_list_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_info_card_narrow_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_info_card_narrow_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "loyalBenefits" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "loyalBenefits" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_discounts_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_discounts_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_faq_items_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_faq_items_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_info_center_faq_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_info_center_faq_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_info_center_cards_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_info_center_cards_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_video_cards_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_video_cards_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_link_cards_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_link_cards_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "heroReasonsSimpl" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "heroReasonsSimpl" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "etfTable" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "etfTable" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_download_section_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_download_section_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_exchange_rates_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_exchange_rates_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_compare_table_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_compare_table_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_compare_bonds_table_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_compare_bonds_table_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "tblCardCollapse" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "tblCardCollapse" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "exchCompTable" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "exchCompTable" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_loan_calculator_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_loan_calculator_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_mortgage_calculator_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_mortgage_calculator_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_inflation_calculator_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_inflation_calculator_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_zonky_calculator_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_zonky_calculator_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_zone_interest_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_zone_interest_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_portu_calculator_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_portu_calculator_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "portuPensionCalc" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "portuPensionCalc" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pensionSavCalc" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pensionSavCalc" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_timeline_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_timeline_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "topMgmtCards" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "topMgmtCards" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pressContact" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pressContact" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_logo_carousel_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_logo_carousel_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_feature_application_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_feature_application_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_youtube_video_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_youtube_video_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_callback_simplified_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_callback_simplified_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "loyalCustTimeline" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "loyalCustTimeline" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_omnichannel_banner_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_omnichannel_banner_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "prodCardsHorz" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "prodCardsHorz" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_steps_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_steps_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "stepsVertCollapse" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "stepsVertCollapse" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "loyalCustApp" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "loyalCustApp" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_product_banner_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_product_banner_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_homepage_bottom_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_homepage_bottom_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_benefits_columns_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_benefits_columns_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_cta_cards_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "pages_blocks_cta_cards_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_hero_plain_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_hero_plain_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_hero_with_image_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_hero_with_image_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_hero_slider_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_hero_slider_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_heroSearch_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_heroSearch_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_heroCompact_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_heroCompact_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_feature_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_feature_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_info_double_image_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_info_double_image_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_info_image_big_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_info_image_big_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_info_video_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_info_video_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_content_cards_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_content_cards_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_callback_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_callback_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_contact_strip_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_contact_strip_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_flash_message_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_flash_message_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_conversions_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_conversions_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_image_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_image_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_jumbotronSticker_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_jumbotronSticker_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_info_desktop_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_info_desktop_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_info_image_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_info_image_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_info_plain_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_info_plain_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_jumbotron_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_jumbotron_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_benefits_block_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_benefits_block_items" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_benefits_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_benefits_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_prodCardsVert_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_prodCardsVert_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_prodCardHorz_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_prodCardHorz_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_info_card_narrow_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_info_card_narrow_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_loyalBenefits_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_loyalBenefits_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_discounts_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_discounts_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_faq_items_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_faq_items_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_info_center_faq_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_info_center_faq_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_info_center_cards_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_info_center_cards_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_video_cards_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_video_cards_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_link_cards_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_link_cards_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_heroReasonsSimpl_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_heroReasonsSimpl_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_etfTable_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_etfTable_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_download_section_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_download_section_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_exchange_rates_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_exchange_rates_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_compare_table_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_compare_table_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_compare_bonds_table_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_compare_bonds_table_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_tblCardCollapse_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_tblCardCollapse_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_exchCompTable_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_exchCompTable_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_loan_calculator_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_loan_calculator_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_inflation_calculator_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_inflation_calculator_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_zonky_calculator_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_zonky_calculator_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_zone_interest_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_zone_interest_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_portu_calculator_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_portu_calculator_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_portuPensionCalc_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_portuPensionCalc_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pensionSavCalc_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pensionSavCalc_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_timeline_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_timeline_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_topMgmtCards_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_topMgmtCards_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pressContact_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pressContact_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_feature_application_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_feature_application_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_youtube_video_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_youtube_video_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_callback_simplified_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_callback_simplified_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_loyalCustTimeline_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_loyalCustTimeline_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_omnichannel_banner_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_omnichannel_banner_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_prodCardsHorz_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_prodCardsHorz_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_stepsVertCollapse_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_stepsVertCollapse_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_loyalCustApp_v" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_loyalCustApp_v" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_product_banner_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_product_banner_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_benefits_columns_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_benefits_columns_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "_pages_v_blocks_cta_cards_block" ADD COLUMN "layout_styles_anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_cta_cards_block" ADD COLUMN "layout_styles_variant" varchar;
  ALTER TABLE "pages_blocks_product_detail_cards_block_items_features" ADD CONSTRAINT "pages_blocks_product_detail_cards_block_items_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_detail_cards_block_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_detail_cards_block_items" ADD CONSTRAINT "pages_blocks_product_detail_cards_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_detail_cards_block_items" ADD CONSTRAINT "pages_blocks_product_detail_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_detail_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_detail_cards_block" ADD CONSTRAINT "pages_blocks_product_detail_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_detail_cards_block_items_features" ADD CONSTRAINT "_pages_v_blocks_product_detail_cards_block_items_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_product_detail_cards_block_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_detail_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_product_detail_cards_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_detail_cards_block_items" ADD CONSTRAINT "_pages_v_blocks_product_detail_cards_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_product_detail_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_detail_cards_block" ADD CONSTRAINT "_pages_v_blocks_product_detail_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_product_detail_cards_block_items_features_order_idx" ON "pages_blocks_product_detail_cards_block_items_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_detail_cards_block_items_features_parent_id_idx" ON "pages_blocks_product_detail_cards_block_items_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_detail_cards_block_items_order_idx" ON "pages_blocks_product_detail_cards_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_detail_cards_block_items_parent_id_idx" ON "pages_blocks_product_detail_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_detail_cards_block_items_icon_idx" ON "pages_blocks_product_detail_cards_block_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_product_detail_cards_block_order_idx" ON "pages_blocks_product_detail_cards_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_detail_cards_block_parent_id_idx" ON "pages_blocks_product_detail_cards_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_detail_cards_block_path_idx" ON "pages_blocks_product_detail_cards_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_detail_cards_block_items_features_order_idx" ON "_pages_v_blocks_product_detail_cards_block_items_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_detail_cards_block_items_features_parent_id_idx" ON "_pages_v_blocks_product_detail_cards_block_items_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_detail_cards_block_items_order_idx" ON "_pages_v_blocks_product_detail_cards_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_detail_cards_block_items_parent_id_idx" ON "_pages_v_blocks_product_detail_cards_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_detail_cards_block_items_icon_idx" ON "_pages_v_blocks_product_detail_cards_block_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_product_detail_cards_block_order_idx" ON "_pages_v_blocks_product_detail_cards_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_detail_cards_block_parent_id_idx" ON "_pages_v_blocks_product_detail_cards_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_detail_cards_block_path_idx" ON "_pages_v_blocks_product_detail_cards_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_product_detail_cards_block_items_features" CASCADE;
  DROP TABLE "pages_blocks_product_detail_cards_block_items" CASCADE;
  DROP TABLE "pages_blocks_product_detail_cards_block" CASCADE;
  DROP TABLE "_pages_v_blocks_product_detail_cards_block_items_features" CASCADE;
  DROP TABLE "_pages_v_blocks_product_detail_cards_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_product_detail_cards_block" CASCADE;
  ALTER TABLE "pages_blocks_hero_plain_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_hero_plain_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_hero_with_image_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_hero_with_image_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_hero_slider_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_hero_slider_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "heroSearch" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "heroSearch" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "heroCompact" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "heroCompact" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_rich_text_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_rich_text_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_feature_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_feature_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_info_double_image_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_info_double_image_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_info_image_big_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_info_image_big_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_info_video_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_info_video_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_content_cards_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_content_cards_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_callback_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_callback_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_contact_strip_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_contact_strip_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_flash_message_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_flash_message_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_conversions_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_conversions_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_image_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_image_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "jumbotronSticker" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "jumbotronSticker" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_info_desktop_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_info_desktop_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_info_image_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_info_image_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_info_plain_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_info_plain_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_jumbotron_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_jumbotron_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_benefits_block_items" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_benefits_block_items" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_benefits_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_benefits_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_benefits_with_image_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_benefits_with_image_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "prodCardsVert" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "prodCardsVert" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "prodCardHorz" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "prodCardHorz" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_benefits_with_list_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_benefits_with_list_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_info_card_narrow_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_info_card_narrow_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "loyalBenefits" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "loyalBenefits" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_discounts_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_discounts_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_faq_items_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_faq_items_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_info_center_faq_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_info_center_faq_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_info_center_cards_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_info_center_cards_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_video_cards_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_video_cards_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_link_cards_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_link_cards_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "heroReasonsSimpl" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "heroReasonsSimpl" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "etfTable" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "etfTable" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_download_section_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_download_section_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_exchange_rates_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_exchange_rates_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_compare_table_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_compare_table_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_compare_bonds_table_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_compare_bonds_table_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "tblCardCollapse" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "tblCardCollapse" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "exchCompTable" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "exchCompTable" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_loan_calculator_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_loan_calculator_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_mortgage_calculator_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_mortgage_calculator_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_inflation_calculator_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_inflation_calculator_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_zonky_calculator_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_zonky_calculator_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_zone_interest_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_zone_interest_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_portu_calculator_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_portu_calculator_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "portuPensionCalc" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "portuPensionCalc" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pensionSavCalc" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pensionSavCalc" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_timeline_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_timeline_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "topMgmtCards" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "topMgmtCards" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pressContact" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pressContact" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_logo_carousel_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_logo_carousel_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_feature_application_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_feature_application_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_youtube_video_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_youtube_video_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_callback_simplified_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_callback_simplified_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "loyalCustTimeline" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "loyalCustTimeline" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_omnichannel_banner_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_omnichannel_banner_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "prodCardsHorz" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "prodCardsHorz" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_steps_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_steps_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "stepsVertCollapse" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "stepsVertCollapse" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "loyalCustApp" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "loyalCustApp" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_product_banner_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_product_banner_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_homepage_bottom_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_homepage_bottom_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_benefits_columns_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_benefits_columns_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "pages_blocks_cta_cards_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "pages_blocks_cta_cards_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_hero_plain_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_hero_plain_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_hero_with_image_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_hero_with_image_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_hero_slider_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_hero_slider_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_heroSearch_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_heroSearch_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_heroCompact_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_heroCompact_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_rich_text_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_rich_text_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_feature_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_feature_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_info_double_image_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_info_double_image_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_info_image_big_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_info_image_big_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_info_video_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_info_video_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_content_cards_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_content_cards_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_callback_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_callback_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_contact_strip_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_contact_strip_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_flash_message_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_flash_message_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_conversions_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_conversions_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_image_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_image_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_jumbotronSticker_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_jumbotronSticker_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_info_desktop_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_info_desktop_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_info_image_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_info_image_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_info_plain_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_info_plain_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_jumbotron_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_jumbotron_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_benefits_block_items" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_benefits_block_items" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_benefits_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_benefits_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_benefits_with_image_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_prodCardsVert_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_prodCardsVert_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_prodCardHorz_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_prodCardHorz_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_benefits_with_list_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_info_card_narrow_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_info_card_narrow_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_loyalBenefits_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_loyalBenefits_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_discounts_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_discounts_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_faq_items_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_faq_items_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_info_center_faq_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_info_center_faq_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_info_center_cards_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_info_center_cards_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_video_cards_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_video_cards_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_link_cards_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_link_cards_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_heroReasonsSimpl_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_heroReasonsSimpl_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_etfTable_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_etfTable_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_download_section_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_download_section_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_exchange_rates_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_exchange_rates_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_compare_table_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_compare_table_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_compare_bonds_table_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_compare_bonds_table_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_tblCardCollapse_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_tblCardCollapse_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_exchCompTable_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_exchCompTable_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_loan_calculator_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_loan_calculator_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_inflation_calculator_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_inflation_calculator_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_zonky_calculator_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_zonky_calculator_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_zone_interest_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_zone_interest_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_portu_calculator_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_portu_calculator_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_portuPensionCalc_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_portuPensionCalc_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pensionSavCalc_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pensionSavCalc_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_timeline_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_timeline_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_topMgmtCards_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_topMgmtCards_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pressContact_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pressContact_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_feature_application_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_feature_application_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_youtube_video_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_youtube_video_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_callback_simplified_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_callback_simplified_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_loyalCustTimeline_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_loyalCustTimeline_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_omnichannel_banner_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_omnichannel_banner_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_prodCardsHorz_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_prodCardsHorz_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_steps_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_steps_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_stepsVertCollapse_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_stepsVertCollapse_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_loyalCustApp_v" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_loyalCustApp_v" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_product_banner_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_product_banner_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_homepage_bottom_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_benefits_columns_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_benefits_columns_block" DROP COLUMN "layout_styles_variant";
  ALTER TABLE "_pages_v_blocks_cta_cards_block" DROP COLUMN "layout_styles_anchor_id";
  ALTER TABLE "_pages_v_blocks_cta_cards_block" DROP COLUMN "layout_styles_variant";
  DROP TYPE "public"."prod_detail_cards_bg";
  DROP TYPE "public"."enum_pages_blocks_product_detail_cards_block_columns";
  DROP TYPE "public"."enum__pages_v_blocks_product_detail_cards_block_columns";`)
}
