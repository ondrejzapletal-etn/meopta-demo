import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const DiscountsBlock: Block = {
  slug: 'discountsBlock',
  interfaceName: 'DiscountsBlock',
  imageURL: '/block-thumbnails/discountsBlock.png',
  imageAltText: 'Discount cards grid with load more',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'itemsPerPage',
      type: 'number',
      defaultValue: 6,
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
          name: 'discount',
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
