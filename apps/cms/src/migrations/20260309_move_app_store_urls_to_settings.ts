import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Move app store URLs from footer global to settings global.
 * Remove app store URL fields from featureApplicationBlock and loyalCustomerApplicationBlock
 * (now provided globally via settings).
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Move app store URLs from footer to settings
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "app_store_ios_url" varchar,
      ADD COLUMN IF NOT EXISTS "app_store_android_url" varchar;

    UPDATE "settings" s
    SET
      "app_store_ios_url"     = f."app_store_ios_url",
      "app_store_android_url" = f."app_store_android_url"
    FROM "footer" f
    WHERE s.id = 1;

    ALTER TABLE "footer"
      DROP COLUMN IF EXISTS "app_store_ios_url",
      DROP COLUMN IF EXISTS "app_store_android_url";

    -- Drop app store URL fields from featureApplicationBlock
    ALTER TABLE "pages_blocks_feature_application_block"
      DROP COLUMN IF EXISTS "app_store_url",
      DROP COLUMN IF EXISTS "google_play_url";

    ALTER TABLE "_pages_v_blocks_feature_application_block"
      DROP COLUMN IF EXISTS "app_store_url",
      DROP COLUMN IF EXISTS "google_play_url";

    -- Drop app store URL fields from loyalCustomerApplicationBlock
    ALTER TABLE "loyalCustApp"
      DROP COLUMN IF EXISTS "app_store_url",
      DROP COLUMN IF EXISTS "google_play_url";

    ALTER TABLE "_loyalCustApp_v"
      DROP COLUMN IF EXISTS "app_store_url",
      DROP COLUMN IF EXISTS "google_play_url";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore app store URLs to footer
    ALTER TABLE "footer"
      ADD COLUMN IF NOT EXISTS "app_store_ios_url" varchar,
      ADD COLUMN IF NOT EXISTS "app_store_android_url" varchar;

    UPDATE "footer" f
    SET
      "app_store_ios_url"     = s."app_store_ios_url",
      "app_store_android_url" = s."app_store_android_url"
    FROM "settings" s
    WHERE f.id = 1;

    ALTER TABLE "settings"
      DROP COLUMN IF EXISTS "app_store_ios_url",
      DROP COLUMN IF EXISTS "app_store_android_url";

    -- Restore app store URL fields to featureApplicationBlock
    ALTER TABLE "pages_blocks_feature_application_block"
      ADD COLUMN IF NOT EXISTS "app_store_url" varchar,
      ADD COLUMN IF NOT EXISTS "google_play_url" varchar;

    ALTER TABLE "_pages_v_blocks_feature_application_block"
      ADD COLUMN IF NOT EXISTS "app_store_url" varchar,
      ADD COLUMN IF NOT EXISTS "google_play_url" varchar;

    -- Restore app store URL fields to loyalCustomerApplicationBlock
    ALTER TABLE "loyalCustApp"
      ADD COLUMN IF NOT EXISTS "app_store_url" varchar,
      ADD COLUMN IF NOT EXISTS "google_play_url" varchar;

    ALTER TABLE "_loyalCustApp_v"
      ADD COLUMN IF NOT EXISTS "app_store_url" varchar,
      ADD COLUMN IF NOT EXISTS "google_play_url" varchar;
  `);
}
