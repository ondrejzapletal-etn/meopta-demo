import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Add backgroundColor (and variant for richTextBlock) columns to block tables,
 * then migrate existing data from layout_styles_variant workaround fields.
 *
 * Columns are created by Payload dev-mode push as PostgreSQL enum types, so all
 * UPDATE statements must cast string literals to the correct UDT name.
 *
 * Live table enum prefixes:  enum_pages_blocks_*
 * Version table enum prefixes: enum__pages_v_blocks_*
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create enum types — idempotent, no-op if already created by dev-mode push.
  await db.execute(sql`
    DO $$ BEGIN CREATE TYPE "enum_pages_blocks_benefits_with_list_block_background_color" AS ENUM ('white', 'lightGrey'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_benefits_with_list_block_background_color" AS ENUM ('white', 'lightGrey'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "enum_pages_blocks_faq_items_block_background_color" AS ENUM ('white', 'lightGrey'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_faq_items_block_background_color" AS ENUM ('white', 'lightGrey'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "enum_pages_blocks_rich_text_block_background_color" AS ENUM ('white', 'lightGrey'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_rich_text_block_background_color" AS ENUM ('white', 'lightGrey'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "enum_pages_blocks_rich_text_block_variant" AS ENUM ('info-box', 'compact'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_rich_text_block_variant" AS ENUM ('info-box', 'compact'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);

  // --- benefitsWithListBlock ---
  // ADD COLUMN is a no-op if dev-mode already created it; IF NOT EXISTS is safe.
  await db.execute(sql`
    ALTER TABLE pages_blocks_benefits_with_list_block
      ADD COLUMN IF NOT EXISTS background_color
        "enum_pages_blocks_benefits_with_list_block_background_color"
        DEFAULT 'white';
    ALTER TABLE _pages_v_blocks_benefits_with_list_block
      ADD COLUMN IF NOT EXISTS background_color
        "enum__pages_v_blocks_benefits_with_list_block_background_color"
        DEFAULT 'white';
  `);

  await db.execute(sql`
    UPDATE pages_blocks_benefits_with_list_block
      SET background_color = CASE
        WHEN layout_styles_variant = 'grey-cards'
          THEN 'lightGrey'::"enum_pages_blocks_benefits_with_list_block_background_color"
        ELSE 'white'::"enum_pages_blocks_benefits_with_list_block_background_color"
      END
      WHERE layout_styles_variant IS NOT NULL;

    UPDATE _pages_v_blocks_benefits_with_list_block
      SET background_color = CASE
        WHEN layout_styles_variant = 'grey-cards'
          THEN 'lightGrey'::"enum__pages_v_blocks_benefits_with_list_block_background_color"
        ELSE 'white'::"enum__pages_v_blocks_benefits_with_list_block_background_color"
      END
      WHERE layout_styles_variant IS NOT NULL;
  `);

  await db.execute(sql`
    UPDATE pages_blocks_benefits_with_list_block
      SET layout_styles_variant = NULL
      WHERE layout_styles_variant = 'grey-cards';

    UPDATE _pages_v_blocks_benefits_with_list_block
      SET layout_styles_variant = NULL
      WHERE layout_styles_variant = 'grey-cards';
  `);

  // --- faqItemsBlock ---
  await db.execute(sql`
    ALTER TABLE pages_blocks_faq_items_block
      ADD COLUMN IF NOT EXISTS background_color
        "enum_pages_blocks_faq_items_block_background_color"
        DEFAULT 'white';
    ALTER TABLE _pages_v_blocks_faq_items_block
      ADD COLUMN IF NOT EXISTS background_color
        "enum__pages_v_blocks_faq_items_block_background_color"
        DEFAULT 'white';
  `);

  await db.execute(sql`
    UPDATE pages_blocks_faq_items_block
      SET background_color = CASE
        WHEN layout_styles_variant = 'grey-bg'
          THEN 'lightGrey'::"enum_pages_blocks_faq_items_block_background_color"
        ELSE 'white'::"enum_pages_blocks_faq_items_block_background_color"
      END
      WHERE layout_styles_variant IS NOT NULL;

    UPDATE _pages_v_blocks_faq_items_block
      SET background_color = CASE
        WHEN layout_styles_variant = 'grey-bg'
          THEN 'lightGrey'::"enum__pages_v_blocks_faq_items_block_background_color"
        ELSE 'white'::"enum__pages_v_blocks_faq_items_block_background_color"
      END
      WHERE layout_styles_variant IS NOT NULL;
  `);

  await db.execute(sql`
    UPDATE pages_blocks_faq_items_block
      SET layout_styles_variant = NULL
      WHERE layout_styles_variant = 'grey-bg';

    UPDATE _pages_v_blocks_faq_items_block
      SET layout_styles_variant = NULL
      WHERE layout_styles_variant = 'grey-bg';
  `);

  // --- richTextBlock ---
  await db.execute(sql`
    ALTER TABLE pages_blocks_rich_text_block
      ADD COLUMN IF NOT EXISTS background_color
        "enum_pages_blocks_rich_text_block_background_color"
        DEFAULT 'white',
      ADD COLUMN IF NOT EXISTS variant
        "enum_pages_blocks_rich_text_block_variant";
    ALTER TABLE _pages_v_blocks_rich_text_block
      ADD COLUMN IF NOT EXISTS background_color
        "enum__pages_v_blocks_rich_text_block_background_color"
        DEFAULT 'white',
      ADD COLUMN IF NOT EXISTS variant
        "enum__pages_v_blocks_rich_text_block_variant";
  `);

  await db.execute(sql`
    UPDATE pages_blocks_rich_text_block
      SET
        background_color = CASE
          WHEN layout_styles_variant IN ('grey-bg', 'compact-grey', 'info-box')
            THEN 'lightGrey'::"enum_pages_blocks_rich_text_block_background_color"
          ELSE 'white'::"enum_pages_blocks_rich_text_block_background_color"
        END,
        variant = CASE
          WHEN layout_styles_variant = 'info-box'
            THEN 'info-box'::"enum_pages_blocks_rich_text_block_variant"
          WHEN layout_styles_variant IN ('compact', 'compact-grey')
            THEN 'compact'::"enum_pages_blocks_rich_text_block_variant"
          ELSE NULL
        END
      WHERE layout_styles_variant IS NOT NULL;

    UPDATE _pages_v_blocks_rich_text_block
      SET
        background_color = CASE
          WHEN layout_styles_variant IN ('grey-bg', 'compact-grey', 'info-box')
            THEN 'lightGrey'::"enum__pages_v_blocks_rich_text_block_background_color"
          ELSE 'white'::"enum__pages_v_blocks_rich_text_block_background_color"
        END,
        variant = CASE
          WHEN layout_styles_variant = 'info-box'
            THEN 'info-box'::"enum__pages_v_blocks_rich_text_block_variant"
          WHEN layout_styles_variant IN ('compact', 'compact-grey')
            THEN 'compact'::"enum__pages_v_blocks_rich_text_block_variant"
          ELSE NULL
        END
      WHERE layout_styles_variant IS NOT NULL;
  `);

  await db.execute(sql`
    UPDATE pages_blocks_rich_text_block
      SET layout_styles_variant = NULL
      WHERE layout_styles_variant IN ('grey-bg', 'info-box', 'compact', 'compact-grey');

    UPDATE _pages_v_blocks_rich_text_block
      SET layout_styles_variant = NULL
      WHERE layout_styles_variant IN ('grey-bg', 'info-box', 'compact', 'compact-grey');
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // benefitsWithListBlock
  await db.execute(sql`
    UPDATE pages_blocks_benefits_with_list_block
      SET layout_styles_variant = 'grey-cards'
      WHERE background_color = 'lightGrey'::"enum_pages_blocks_benefits_with_list_block_background_color";
    UPDATE _pages_v_blocks_benefits_with_list_block
      SET layout_styles_variant = 'grey-cards'
      WHERE background_color = 'lightGrey'::"enum__pages_v_blocks_benefits_with_list_block_background_color";

    ALTER TABLE pages_blocks_benefits_with_list_block DROP COLUMN IF EXISTS background_color;
    ALTER TABLE _pages_v_blocks_benefits_with_list_block DROP COLUMN IF EXISTS background_color;
  `);

  // faqItemsBlock
  await db.execute(sql`
    UPDATE pages_blocks_faq_items_block
      SET layout_styles_variant = 'grey-bg'
      WHERE background_color = 'lightGrey'::"enum_pages_blocks_faq_items_block_background_color";
    UPDATE _pages_v_blocks_faq_items_block
      SET layout_styles_variant = 'grey-bg'
      WHERE background_color = 'lightGrey'::"enum__pages_v_blocks_faq_items_block_background_color";

    ALTER TABLE pages_blocks_faq_items_block DROP COLUMN IF EXISTS background_color;
    ALTER TABLE _pages_v_blocks_faq_items_block DROP COLUMN IF EXISTS background_color;
  `);

  // richTextBlock
  await db.execute(sql`
    UPDATE pages_blocks_rich_text_block
      SET layout_styles_variant = CASE
        WHEN background_color = 'lightGrey'::"enum_pages_blocks_rich_text_block_background_color"
          AND variant IS NULL     THEN 'grey-bg'
        WHEN background_color = 'lightGrey'::"enum_pages_blocks_rich_text_block_background_color"
          AND variant = 'compact'::"enum_pages_blocks_rich_text_block_variant" THEN 'compact-grey'
        WHEN variant = 'info-box'::"enum_pages_blocks_rich_text_block_variant" THEN 'info-box'
        WHEN variant = 'compact'::"enum_pages_blocks_rich_text_block_variant"  THEN 'compact'
        ELSE NULL
      END;
    UPDATE _pages_v_blocks_rich_text_block
      SET layout_styles_variant = CASE
        WHEN background_color = 'lightGrey'::"enum__pages_v_blocks_rich_text_block_background_color"
          AND variant IS NULL     THEN 'grey-bg'
        WHEN background_color = 'lightGrey'::"enum__pages_v_blocks_rich_text_block_background_color"
          AND variant = 'compact'::"enum__pages_v_blocks_rich_text_block_variant" THEN 'compact-grey'
        WHEN variant = 'info-box'::"enum__pages_v_blocks_rich_text_block_variant" THEN 'info-box'
        WHEN variant = 'compact'::"enum__pages_v_blocks_rich_text_block_variant"  THEN 'compact'
        ELSE NULL
      END;

    ALTER TABLE pages_blocks_rich_text_block
      DROP COLUMN IF EXISTS background_color,
      DROP COLUMN IF EXISTS variant;
    ALTER TABLE _pages_v_blocks_rich_text_block
      DROP COLUMN IF EXISTS background_color,
      DROP COLUMN IF EXISTS variant;
  `);
}
