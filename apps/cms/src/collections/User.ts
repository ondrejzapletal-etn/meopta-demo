import type { CollectionConfig } from 'payload';
import { admin } from '../access/admin';
import { createAuditLogDelete, createAuditLogForgotPassword, createAuditLogLogin, createAuditLogLoginError, createAuditLogLogout, createAuditLogModify } from '../hooks/auditLogs';

/**
 * User collection configuration for Payload CMS.
 *
 * Defines the user authentication and authorization system.
 * Supports role-based access control with editor and admin roles.
 */
export const User: CollectionConfig = {
  slug: 'users',
  access: {
    create: admin,
    delete: admin,
    update: admin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
      ],
      defaultValue: 'editor',
    },
  ],
  hooks: {
    afterChange: [createAuditLogModify],
    afterDelete: [createAuditLogDelete],
    afterLogin: [createAuditLogLogin],
    afterLogout: [createAuditLogLogout],
    afterForgotPassword: [createAuditLogForgotPassword],
    afterError: [createAuditLogLoginError],
  },
};
