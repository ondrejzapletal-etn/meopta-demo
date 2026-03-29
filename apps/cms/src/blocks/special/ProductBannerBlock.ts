import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ProductBannerBlock: Block = {
  slug: 'productBannerBlock',
  interfaceName: 'ProductBannerBlock',
  imageURL: '/block-thumbnails/productBannerBlock.png',
  imageAltText: 'Product quicklinks strip',
  fields: [
    LayoutStyles,
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'isButton',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
};
