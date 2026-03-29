import type { CollectionConfig } from 'payload';
import { createAuditLogDelete, createAuditLogModify } from '../hooks/auditLogs';

const slug = 'media';

/**
 * Media collection configuration for Payload CMS.
 *
 * Defines the media collection for managing image uploads with automatic
 * WebP conversion and preview generation. Includes alt text for accessibility.
 */
export const Media: CollectionConfig = {
  slug,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'sourceHash',
      type: 'text',
      unique: true,
      admin: {
        description: 'SHA-256 hash of the source file content (first 16 hex chars). Used for deduplication in populate scripts.',
        readOnly: true,
      },
    },
  ],
  upload: {
    // If not specified explicitly, defaults to 'media' (slug) directory in app root directory (apps/cms)
    staticDir: process.env.STATIC_DIR ? `${process.env.STATIC_DIR}/${slug}` : slug,
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'preview',
        width: 170,
        height: 170,
        formatOptions: { format: 'webp' },
        withoutEnlargement: false,
      },
    ],
  },
  hooks: {
    afterChange: [createAuditLogModify],
    afterDelete: [createAuditLogDelete],
  },
};
