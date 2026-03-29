import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ContentCardsBlock: Block = {
  slug: 'contentCardsBlock',
  interfaceName: 'ContentCardsBlock',
  imageURL: '/block-thumbnails/contentCardsBlock.png',
  imageAltText: 'Image cards with links grid',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'date',
          type: 'text',
        },
        {
          name: 'labels',
          type: 'text',
          admin: { description: 'Comma-separated labels (e.g. "Air Bank, Půjčky a hypotéky")' },
        },
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
          name: 'linkLabel',
          type: 'text',
        },
        {
          name: 'linkUrl',
          type: 'text',
        },
      ],
    },
  ],
};
