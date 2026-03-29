import { CollectionConfig } from 'payload';
import { admin } from '../access/admin';
import { createAuditLogDelete, createAuditLogModify } from '../hooks/auditLogs';

/**
 * Third Party Access collection configuration for Payload CMS.
 *
 * Allows generating API keys for third-party services to access the CMS.
 */
export const ThirdPartyAccess: CollectionConfig = {
  slug: 'third-party-access',
  labels: {
    singular: { en: 'Third party access', cs: 'Přístup třetích stran' },
    plural: { en: 'Third party access', cs: 'Přístupy třetích stran' },
  },
  access: {
    create: admin,
    delete: admin,
    read: admin,
    readVersions: () => false,
    update: admin,
  },
  auth: {
    disableLocalStrategy: true,
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'name',
    enableRichTextLink: false,
  },
  fields: [
    {
      name: 'name',
      required: true,
      type: 'text',
    },
  ],
  hooks: {
    afterChange: [createAuditLogModify],
    afterDelete: [createAuditLogDelete],
  },
};
