import { GlobalConfig } from 'payload';
import { createAuditLogGlobalsModify } from '../hooks/auditLogs';

const socials = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
];

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'appStore',
      type: 'group',
      fields: [
        {
          name: 'iosUrl',
          type: 'text',
          label: 'App Store URL (iOS)',
        },
        {
          name: 'androidUrl',
          type: 'text',
          label: 'Google Play URL (Android)',
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'type',
          type: 'select',
          options: socials,
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [createAuditLogGlobalsModify],
  },
};
