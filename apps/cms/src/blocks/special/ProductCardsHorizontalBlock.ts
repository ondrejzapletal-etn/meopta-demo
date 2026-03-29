import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ProductCardsHorizontalBlock: Block = {
  slug: 'productCardsHorizontalBlock',
  dbName: 'prodCardsHorz',
  interfaceName: 'ProductCardsHorizontalBlock',
  imageURL: '/block-thumbnails/productCardsHorizontalBlock.png',
  imageAltText: 'Horizontal product cards grid',
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
