import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    `ALTER TABLE pages_blocks_branch_map_block DROP COLUMN IF EXISTS default_zoom;`,
  );
  await db.execute(
    `ALTER TABLE _pages_v_blocks_branch_map_block DROP COLUMN IF EXISTS default_zoom;`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    `ALTER TABLE pages_blocks_branch_map_block ADD COLUMN IF NOT EXISTS default_zoom numeric;`,
  );
  await db.execute(
    `ALTER TABLE _pages_v_blocks_branch_map_block ADD COLUMN IF NOT EXISTS default_zoom numeric;`,
  );
}
