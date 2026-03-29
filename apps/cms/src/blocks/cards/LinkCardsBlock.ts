import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const LinkCardsBlock: Block = {
  slug: 'linkCardsBlock',
  interfaceName: 'LinkCardsBlock',
  imageURL: '/block-thumbnails/linkCardsBlock.png',
  imageAltText: 'Link cards grid with images',
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
