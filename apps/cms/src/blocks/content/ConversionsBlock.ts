import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ConversionsBlock: Block = {
  slug: 'conversionsBlock',
  interfaceName: 'ConversionsBlock',
  imageURL: '/block-thumbnails/conversionsBlock.png',
  imageAltText: 'CTA conversion block with button',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'linkLabel',
          type: 'text',
        },
        {
          name: 'linkUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'Green', value: 'green' },
        { label: 'White', value: 'white' },
        { label: 'Light Grey', value: 'lightGrey' },
      ],
    },
  ],
};
