import { Field, Validate } from 'payload';
import { Page } from '../collections/Page';

const appearanceOptions = [
  {
    label: 'Default button',
    value: 'default',
  },
  {
    label: 'Primary Button',
    value: 'primary',
  },
  {
    label: 'Outline Button',
    value: 'outline',
  },
  {
    label: 'Link',
    value: 'link',
  },
];

const validateURL: Validate = async (value: string) => {
  if (!value) return true;
  // Allow relative paths (/foo/bar), hash links (#section), and absolute URLs
  if (value.startsWith('/') || value.startsWith('#')) return true;
  try {
    new URL(value);
  } catch {
    return 'Please enter a valid URL';
  }
  return true;
};

/**
 * Payload CMS field configuration for links that can be either internal references or external URLs.
 * Supports different appearance options and validation for custom URLs.
 */
export const Link: Field = {
  name: 'link',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'radio',
      options: [
        {
          label: 'Internal link',
          value: 'reference',
        },
        {
          label: 'Custom URL',
          value: 'custom',
        },
      ],
      defaultValue: 'reference',
    },
    {
      name: 'newTab',
      type: 'checkbox',
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: [Page.slug],
      maxDepth: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      validate: validateURL,
    },
    {
      name: 'label',
      type: 'text',
      maxLength: 40,
    },
    {
      name: 'appearance',
      type: 'select',
      required: true,
      hasMany: false,
      options: appearanceOptions,
      defaultValue: 'default',
    },
  ],
  hooks: {
    beforeChange: [
      ({ value }) => {
        // This hook is used to remove the URL field if the type is reference and vice versa so we don't receive both values
        if (value?.type === 'reference') {
          value.url = null;
        } else {
          value.reference = null;
        }
        return value;
      },
    ],
  },
};
