import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ProductCardHorizontalBlock: Block = {
  slug: 'productCardHorizontalBlock',
  dbName: 'prodCardHorz',
  interfaceName: 'ProductCardHorizontalBlock',
  imageURL: '/block-thumbnails/productCardHorizontalBlock.png',
  imageAltText: 'Horizontal benefit cards',
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
