import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Drop unused file_size and category columns from downloadSectionBlock items tables.
 * These fields were never used by the frontend component.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE pages_blocks_download_section_block_items
      DROP COLUMN IF EXISTS file_size,
      DROP COLUMN IF EXISTS category;

    ALTER TABLE _pages_v_blocks_download_section_block_items
      DROP COLUMN IF EXISTS file_size,
      DROP COLUMN IF EXISTS category;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE pages_blocks_download_section_block_items
      ADD COLUMN IF NOT EXISTS file_size varchar,
      ADD COLUMN IF NOT EXISTS category varchar;

    ALTER TABLE _pages_v_blocks_download_section_block_items
      ADD COLUMN IF NOT EXISTS file_size varchar,
      ADD COLUMN IF NOT EXISTS category varchar;
  `);
}
