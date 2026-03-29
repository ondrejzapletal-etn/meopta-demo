import type { CollectionConfig } from 'payload';
import { Slug } from '../fields/Slug';
import { createAuditLogDelete, createAuditLogModify } from '../hooks/auditLogs';

export const Branch: CollectionConfig = {
  slug: 'branches',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    Slug,
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'street',
      type: 'text',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'zip',
      type: 'text',
    },
    {
      name: 'latitude',
      type: 'number',
      required: true,
      admin: {
        step: 0.0001,
      },
    },
    {
      name: 'longitude',
      type: 'number',
      required: true,
      admin: {
        step: 0.0001,
      },
    },
    {
      name: 'openingHours',
      type: 'array',
      fields: [
        {
          name: 'days',
          type: 'text',
          required: true,
        },
        {
          name: 'hours',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'amenities',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Bankomat', value: 'bankomat' },
        { label: 'Pes', value: 'pes' },
        { label: 'Děti', value: 'deti' },
        { label: 'Káva', value: 'kava' },
        { label: 'Jídlo', value: 'jidlo' },
        { label: 'Úsměv', value: 'usmev' },
        { label: 'Bez bariér', value: 'bez-barier' },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'listingImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [createAuditLogModify],
    afterDelete: [createAuditLogDelete],
  },
};
