import { GlobalConfig } from 'payload';
import { Link } from '../fields/Link';
import { createAuditLogGlobalsModify } from '../hooks/auditLogs';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navigation',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'labelCs',
              label: 'Label (česky)',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'labelEn',
              label: 'Label (anglicky)',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        Link,
        {
          name: 'children',
          type: 'array',
          fields: [
            {
              name: 'labelCs',
              label: 'Label (česky)',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'labelEn',
              label: 'Label (anglicky)',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            Link,
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      name: 'ctaButtons',
      type: 'array',
      maxRows: 5,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'labelCs',
              label: 'Label (česky)',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'labelEn',
              label: 'Label (anglicky)',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'appearance',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Default', value: 'default' },
            { label: 'Link', value: 'link' },
          ],
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Volitelná ikona tlačítka (SVG/PNG, ideálně 24x24px)',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [createAuditLogGlobalsModify],
  },
};
