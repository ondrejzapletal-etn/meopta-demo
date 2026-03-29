import type { CollectionConfig } from 'payload';
import { createAuditLogDelete, createAuditLogModify } from '../hooks/auditLogs';

/**
 * Category collection configuration for Payload CMS.
 *
 * Defines a simple category system for organizing content.
 * Categories can be used to group articles and other content types.
 */
export const Category: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    afterChange: [createAuditLogModify],
    afterDelete: [createAuditLogDelete],
  },
};
