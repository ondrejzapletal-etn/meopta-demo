import React from 'react';
import type { CollectionConfig } from 'payload';
import { Slug } from '../fields/Slug';
import { createAuditLogDelete, createAuditLogModify } from '../hooks/auditLogs';
import { versionsConfig } from '../utils/versions';

/**
 * Article collection configuration for Payload CMS.
 *
 * Defines the article content type with title, category, and image fields.
 * Supports versioning with drafts and scheduled publishing.
 */
export const Article: CollectionConfig = {
  slug: 'articles',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            Slug,
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
            },
          ],
        },
        {
          label: 'Validace',
          fields: [
            {
              name: 'validationTab',
              type: 'ui',
              admin: {},
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [createAuditLogModify],
    afterDelete: [createAuditLogDelete],
  },
  versions: versionsConfig,
};
