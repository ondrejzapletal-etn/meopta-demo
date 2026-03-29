import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "pages_blocks_benefits_block_items" SET "description" = NULL WHERE "description" IS NOT NULL;
  UPDATE "_pages_v_blocks_benefits_block_items" SET "description" = NULL WHERE "description" IS NOT NULL;
  ALTER TABLE "pages_blocks_benefits_block_items" ALTER COLUMN "description" SET DATA TYPE jsonb USING "description"::jsonb;
  ALTER TABLE "_pages_v_blocks_benefits_block_items" ALTER COLUMN "description" SET DATA TYPE jsonb USING "description"::jsonb;
  ALTER TABLE "pages_blocks_content_cards_block_items" ADD COLUMN "date" varchar;
  ALTER TABLE "pages_blocks_content_cards_block_items" ADD COLUMN "labels" varchar;
  ALTER TABLE "pages_blocks_mortgage_calculator_block" ADD COLUMN "dos_person_image_id" integer;
  ALTER TABLE "pages_blocks_cta_cards_block" ADD COLUMN "footnote_icon_id" integer;
  ALTER TABLE "pages_blocks_cta_cards_block" ADD COLUMN "footnote_text" jsonb;
  ALTER TABLE "_pages_v_blocks_content_cards_block_items" ADD COLUMN "date" varchar;
  ALTER TABLE "_pages_v_blocks_content_cards_block_items" ADD COLUMN "labels" varchar;
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" ADD COLUMN "dos_person_image_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_cards_block" ADD COLUMN "footnote_icon_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_cards_block" ADD COLUMN "footnote_text" jsonb;
  ALTER TABLE "pages_blocks_mortgage_calculator_block" ADD CONSTRAINT "pages_blocks_mortgage_calculator_block_dos_person_image_id_media_id_fk" FOREIGN KEY ("dos_person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_cards_block" ADD CONSTRAINT "pages_blocks_cta_cards_block_footnote_icon_id_media_id_fk" FOREIGN KEY ("footnote_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" ADD CONSTRAINT "_pages_v_blocks_mortgage_calculator_block_dos_person_image_id_media_id_fk" FOREIGN KEY ("dos_person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_cards_block" ADD CONSTRAINT "_pages_v_blocks_cta_cards_block_footnote_icon_id_media_id_fk" FOREIGN KEY ("footnote_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_mortgage_calculator_block_dos_person_image_idx" ON "pages_blocks_mortgage_calculator_block" USING btree ("dos_person_image_id");
  CREATE INDEX "pages_blocks_cta_cards_block_footnote_icon_idx" ON "pages_blocks_cta_cards_block" USING btree ("footnote_icon_id");
  CREATE INDEX "_pages_v_blocks_mortgage_calculator_block_dos_person_image_idx" ON "_pages_v_blocks_mortgage_calculator_block" USING btree ("dos_person_image_id");
  CREATE INDEX "_pages_v_blocks_cta_cards_block_footnote_icon_idx" ON "_pages_v_blocks_cta_cards_block" USING btree ("footnote_icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_mortgage_calculator_block" DROP CONSTRAINT "pages_blocks_mortgage_calculator_block_dos_person_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_cta_cards_block" DROP CONSTRAINT "pages_blocks_cta_cards_block_footnote_icon_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" DROP CONSTRAINT "_pages_v_blocks_mortgage_calculator_block_dos_person_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_cta_cards_block" DROP CONSTRAINT "_pages_v_blocks_cta_cards_block_footnote_icon_id_media_id_fk";
  
  DROP INDEX "pages_blocks_mortgage_calculator_block_dos_person_image_idx";
  DROP INDEX "pages_blocks_cta_cards_block_footnote_icon_idx";
  DROP INDEX "_pages_v_blocks_mortgage_calculator_block_dos_person_image_idx";
  DROP INDEX "_pages_v_blocks_cta_cards_block_footnote_icon_idx";
  ALTER TABLE "pages_blocks_benefits_block_items" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "_pages_v_blocks_benefits_block_items" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_content_cards_block_items" DROP COLUMN "date";
  ALTER TABLE "pages_blocks_content_cards_block_items" DROP COLUMN "labels";
  ALTER TABLE "pages_blocks_mortgage_calculator_block" DROP COLUMN "dos_person_image_id";
  ALTER TABLE "pages_blocks_cta_cards_block" DROP COLUMN "footnote_icon_id";
  ALTER TABLE "pages_blocks_cta_cards_block" DROP COLUMN "footnote_text";
  ALTER TABLE "_pages_v_blocks_content_cards_block_items" DROP COLUMN "date";
  ALTER TABLE "_pages_v_blocks_content_cards_block_items" DROP COLUMN "labels";
  ALTER TABLE "_pages_v_blocks_mortgage_calculator_block" DROP COLUMN "dos_person_image_id";
  ALTER TABLE "_pages_v_blocks_cta_cards_block" DROP COLUMN "footnote_icon_id";
  ALTER TABLE "_pages_v_blocks_cta_cards_block" DROP COLUMN "footnote_text";`)
}
