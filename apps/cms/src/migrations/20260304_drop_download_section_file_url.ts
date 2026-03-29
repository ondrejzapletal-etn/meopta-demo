import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Drop unused file_url column from downloadSectionBlock items tables.
 * App store URLs are hardcoded in the frontend component.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE pages_blocks_download_section_block_items
      DROP COLUMN IF EXISTS file_url;

    ALTER TABLE _pages_v_blocks_download_section_block_items
      DROP COLUMN IF EXISTS file_url;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE pages_blocks_download_section_block_items
      ADD COLUMN IF NOT EXISTS file_url varchar;

    ALTER TABLE _pages_v_blocks_download_section_block_items
      ADD COLUMN IF NOT EXISTS file_url varchar;
  `);
}
