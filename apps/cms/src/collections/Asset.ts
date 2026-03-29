import type { CollectionConfig } from 'payload';
import { createAuditLogDelete, createAuditLogModify } from '../hooks/auditLogs';

const slug = 'assets';

/**
 * Asset collection configuration for Payload CMS.
 *
 * Defines the asset collection for managing PDF and CSV file uploads.
 * Provides a simple structure with alt text field for accessibility.
 */
export const Asset: CollectionConfig = {
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
  ],
  upload: {
    // If not specified explicitly, defaults to 'media' (slug) directory in app root directory (apps/cms)
    staticDir: process.env.STATIC_DIR ? `${process.env.STATIC_DIR}/${slug}` : slug,
    mimeTypes: ['application/pdf', 'text/csv'],
  },
  hooks: {
    afterChange: [createAuditLogModify],
    afterDelete: [createAuditLogDelete],
  },
};
