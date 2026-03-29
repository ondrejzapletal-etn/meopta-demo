import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const FaqItemsBlock: Block = {
  slug: 'faqItemsBlock',
  interfaceName: 'FaqItemsBlock',
  imageURL: '/block-thumbnails/faqItemsBlock.png',
  imageAltText: 'Numbered steps accordion',
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
      name: 'numbered',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'allowMultiple',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
  ],
};
