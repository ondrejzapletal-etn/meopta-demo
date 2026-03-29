import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "source_hash" varchar;
    CREATE UNIQUE INDEX IF NOT EXISTS "media_source_hash_idx" ON "media" ("source_hash");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "media_source_hash_idx";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "source_hash";
  `)
}
