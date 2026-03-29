import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_branches_amenities" AS ENUM('bankomat', 'pes', 'deti', 'kava', 'jidlo', 'usmev', 'bez-barier');
  CREATE TABLE "branches_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"days" varchar NOT NULL,
  	"hours" varchar NOT NULL
  );
  
  CREATE TABLE "branches_amenities" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_branches_amenities",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "branches_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "branches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"street" varchar,
  	"city" varchar,
  	"zip" varchar,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"listing_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_blocks_branch_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"layout_styles_anchor_id" varchar,
  	"layout_styles_variant" varchar,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_branch_map_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"layout_styles_anchor_id" varchar,
  	"layout_styles_variant" varchar,
  	"title" varchar,
  	"default_zoom" numeric DEFAULT 7,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_branch_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"layout_styles_anchor_id" varchar,
  	"layout_styles_variant" varchar,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_branch_map_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_styles_hide_top_padding" boolean,
  	"layout_styles_hide_bottom_padding" boolean,
  	"layout_styles_anchor_id" varchar,
  	"layout_styles_variant" varchar,
  	"title" varchar,
  	"default_zoom" numeric DEFAULT 7,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "branches_id" integer;
  ALTER TABLE "branches_opening_hours" ADD CONSTRAINT "branches_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_amenities" ADD CONSTRAINT "branches_amenities_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_gallery" ADD CONSTRAINT "branches_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches_gallery" ADD CONSTRAINT "branches_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_listing_image_id_media_id_fk" FOREIGN KEY ("listing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_branch_list_block" ADD CONSTRAINT "pages_blocks_branch_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_branch_map_block" ADD CONSTRAINT "pages_blocks_branch_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_branch_list_block" ADD CONSTRAINT "_pages_v_blocks_branch_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_branch_map_block" ADD CONSTRAINT "_pages_v_blocks_branch_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "branches_opening_hours_order_idx" ON "branches_opening_hours" USING btree ("_order");
  CREATE INDEX "branches_opening_hours_parent_id_idx" ON "branches_opening_hours" USING btree ("_parent_id");
  CREATE INDEX "branches_amenities_order_idx" ON "branches_amenities" USING btree ("order");
  CREATE INDEX "branches_amenities_parent_idx" ON "branches_amenities" USING btree ("parent_id");
  CREATE INDEX "branches_gallery_order_idx" ON "branches_gallery" USING btree ("_order");
  CREATE INDEX "branches_gallery_parent_id_idx" ON "branches_gallery" USING btree ("_parent_id");
  CREATE INDEX "branches_gallery_image_idx" ON "branches_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "branches_slug_idx" ON "branches" USING btree ("slug");
  CREATE INDEX "branches_listing_image_idx" ON "branches" USING btree ("listing_image_id");
  CREATE INDEX "branches_updated_at_idx" ON "branches" USING btree ("updated_at");
  CREATE INDEX "branches_created_at_idx" ON "branches" USING btree ("created_at");
  CREATE INDEX "pages_blocks_branch_list_block_order_idx" ON "pages_blocks_branch_list_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_branch_list_block_parent_id_idx" ON "pages_blocks_branch_list_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_branch_list_block_path_idx" ON "pages_blocks_branch_list_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_branch_map_block_order_idx" ON "pages_blocks_branch_map_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_branch_map_block_parent_id_idx" ON "pages_blocks_branch_map_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_branch_map_block_path_idx" ON "pages_blocks_branch_map_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_branch_list_block_order_idx" ON "_pages_v_blocks_branch_list_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_branch_list_block_parent_id_idx" ON "_pages_v_blocks_branch_list_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_branch_list_block_path_idx" ON "_pages_v_blocks_branch_list_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_branch_map_block_order_idx" ON "_pages_v_blocks_branch_map_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_branch_map_block_parent_id_idx" ON "_pages_v_blocks_branch_map_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_branch_map_block_path_idx" ON "_pages_v_blocks_branch_map_block" USING btree ("_path");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_branches_fk" FOREIGN KEY ("branches_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_branches_id_idx" ON "payload_locked_documents_rels" USING btree ("branches_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "branches_opening_hours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "branches_amenities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "branches_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "branches" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_branch_list_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_branch_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_branch_list_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_branch_map_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "branches_opening_hours" CASCADE;
  DROP TABLE "branches_amenities" CASCADE;
  DROP TABLE "branches_gallery" CASCADE;
  DROP TABLE "branches" CASCADE;
  DROP TABLE "pages_blocks_branch_list_block" CASCADE;
  DROP TABLE "pages_blocks_branch_map_block" CASCADE;
  DROP TABLE "_pages_v_blocks_branch_list_block" CASCADE;
  DROP TABLE "_pages_v_blocks_branch_map_block" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_branches_fk";
  
  DROP INDEX "payload_locked_documents_rels_branches_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "branches_id";
  DROP TYPE "public"."enum_branches_amenities";`)
}
