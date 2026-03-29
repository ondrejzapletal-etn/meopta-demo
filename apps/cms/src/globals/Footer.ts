import { GlobalConfig } from 'payload';
import { Link } from '../fields/Link';
import { createAuditLogGlobalsModify } from '../hooks/auditLogs';

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          fields: [
            Link,
          ],
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: '© Air Bank a.s.',
    },
  ],
  hooks: {
    afterChange: [createAuditLogGlobalsModify],
  },
};
