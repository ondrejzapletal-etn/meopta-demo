import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    `ALTER TABLE pages ADD COLUMN IF NOT EXISTS ab_enabled boolean DEFAULT false;`,
  );
  await db.execute(
    `ALTER TABLE pages ADD COLUMN IF NOT EXISTS ab_preview_segment varchar;`,
  );
  await db.execute(
    `ALTER TABLE _pages_v ADD COLUMN IF NOT EXISTS version_ab_enabled boolean DEFAULT false;`,
  );
  await db.execute(
    `ALTER TABLE _pages_v ADD COLUMN IF NOT EXISTS version_ab_preview_segment varchar;`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    `ALTER TABLE pages DROP COLUMN IF EXISTS ab_enabled;`,
  );
  await db.execute(
    `ALTER TABLE pages DROP COLUMN IF EXISTS ab_preview_segment;`,
  );
  await db.execute(
    `ALTER TABLE _pages_v DROP COLUMN IF EXISTS version_ab_enabled;`,
  );
  await db.execute(
    `ALTER TABLE _pages_v DROP COLUMN IF EXISTS version_ab_preview_segment;`,
  );
}
