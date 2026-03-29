import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const InfoCardNarrowBlock: Block = {
  slug: 'infoCardNarrowBlock',
  interfaceName: 'InfoCardNarrowBlock',
  imageURL: '/block-thumbnails/infoCardNarrowBlock.png',
  imageAltText: 'Numbered reason cards carousel',
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
          name: 'number',
          type: 'number',
          required: true,
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
