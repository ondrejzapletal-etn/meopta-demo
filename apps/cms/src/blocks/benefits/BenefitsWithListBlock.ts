import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const BenefitsWithListBlock: Block = {
  slug: 'benefitsWithListBlock',
  interfaceName: 'BenefitsWithListBlock',
  imageURL: '/block-thumbnails/benefitsWithListBlock.png',
  imageAltText: 'Expandable checklist of benefits',
  fields: [
    LayoutStyles,
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Grey', value: 'lightGrey' },
        { label: 'Green', value: 'green' },
      ],
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'cards',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};
