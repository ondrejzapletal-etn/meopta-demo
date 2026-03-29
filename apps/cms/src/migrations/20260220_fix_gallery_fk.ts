import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "branches_gallery"
      DROP CONSTRAINT "branches_gallery_image_id_media_id_fk",
      ADD CONSTRAINT "branches_gallery_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
        ON DELETE cascade ON UPDATE no action;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "branches_gallery"
      DROP CONSTRAINT "branches_gallery_image_id_media_id_fk",
      ADD CONSTRAINT "branches_gallery_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
  `)
}
