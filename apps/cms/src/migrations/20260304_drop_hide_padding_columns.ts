import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Remove layout_styles_hide_top_padding and layout_styles_hide_bottom_padding
 * from all block tables. These checkbox fields were removed from the CMS schema
 * because they were never used — no page had either value checked.
 *
 * The migration is safe to run without downtime: dropping nullable boolean columns
 * with no NOT NULL constraint is a metadata-only operation in PostgreSQL 11+.
 *
 * The down migration restores the columns to any table that still has
 * layout_styles_anchor_id (the sibling field that was kept), which is an exact
 * proxy for "tables that originally had the padding columns".
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      r RECORD;
    BEGIN
      FOR r IN
        SELECT table_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND column_name = 'layout_styles_hide_top_padding'
      LOOP
        EXECUTE format(
          'ALTER TABLE %I
             DROP COLUMN IF EXISTS layout_styles_hide_top_padding,
             DROP COLUMN IF EXISTS layout_styles_hide_bottom_padding',
          r.table_name
        );
      END LOOP;
    END;
    $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Re-add the columns to every table that still has layout_styles_anchor_id
  // (all original block tables had these three columns together).
  await db.execute(sql`
    DO $$
    DECLARE
      r RECORD;
    BEGIN
      FOR r IN
        SELECT table_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND column_name = 'layout_styles_anchor_id'
          AND NOT EXISTS (
            SELECT 1
            FROM information_schema.columns c2
            WHERE c2.table_schema = 'public'
              AND c2.table_name = information_schema.columns.table_name
              AND c2.column_name = 'layout_styles_hide_top_padding'
          )
      LOOP
        EXECUTE format(
          'ALTER TABLE %I
             ADD COLUMN IF NOT EXISTS layout_styles_hide_top_padding boolean,
             ADD COLUMN IF NOT EXISTS layout_styles_hide_bottom_padding boolean',
          r.table_name
        );
      END LOOP;
    END;
    $$;
  `);
}
