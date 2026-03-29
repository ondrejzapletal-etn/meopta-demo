import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    `ALTER TYPE "public"."enum_header_cta_buttons_appearance" ADD VALUE IF NOT EXISTS 'default';`,
  );
  await db.execute(
    `ALTER TYPE "public"."enum_header_cta_buttons_appearance" ADD VALUE IF NOT EXISTS 'link';`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // PostgreSQL does not support removing values from an enum type.
  // To roll back, the column would need to be migrated to a new enum without these values.
  // This is left as a no-op since removing enum values is destructive.
}
