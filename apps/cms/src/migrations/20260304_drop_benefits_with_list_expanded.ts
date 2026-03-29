import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Drop unused expanded column from benefitsWithListBlock tables.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE pages_blocks_benefits_with_list_block
      DROP COLUMN IF EXISTS expanded;

    ALTER TABLE _pages_v_blocks_benefits_with_list_block
      DROP COLUMN IF EXISTS expanded;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE pages_blocks_benefits_with_list_block
      ADD COLUMN IF NOT EXISTS expanded boolean DEFAULT false;

    ALTER TABLE _pages_v_blocks_benefits_with_list_block
      ADD COLUMN IF NOT EXISTS expanded boolean DEFAULT false;
  `);
}
