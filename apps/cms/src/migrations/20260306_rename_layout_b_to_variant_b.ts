import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';

// Renames the A/B test blocks field from 'layoutB' to 'variantB'.
// 'layout' and 'layoutB' shared the same DB tables (distinguished by _path),
// causing Payload's reduceFormStateByPath prefix-match bug to capture layoutB.*
// state when copying the layout field, resulting in ghost rows in the admin UI.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(`
    DO $$
    DECLARE
      tbl text;
    BEGIN
      FOR tbl IN
        SELECT t.table_name
        FROM information_schema.tables t
        JOIN information_schema.columns c
          ON c.table_name = t.table_name AND c.column_name = '_path'
        WHERE t.table_schema = 'public'
          AND (t.table_name LIKE 'pages_blocks_%' OR t.table_name LIKE '_pages_v_blocks_%')
      LOOP
        EXECUTE format('UPDATE %I SET _path = ''variantB'' WHERE _path = ''layoutB''', tbl);
      END LOOP;
    END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(`
    DO $$
    DECLARE
      tbl text;
    BEGIN
      FOR tbl IN
        SELECT t.table_name
        FROM information_schema.tables t
        JOIN information_schema.columns c
          ON c.table_name = t.table_name AND c.column_name = '_path'
        WHERE t.table_schema = 'public'
          AND (t.table_name LIKE 'pages_blocks_%' OR t.table_name LIKE '_pages_v_blocks_%')
      LOOP
        EXECUTE format('UPDATE %I SET _path = ''layoutB'' WHERE _path = ''variantB''', tbl);
      END LOOP;
    END $$;
  `);
}
