import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const InfoCenterCardsBlock: Block = {
  slug: 'infoCenterCardsBlock',
  interfaceName: 'InfoCenterCardsBlock',
  imageURL: '/block-thumbnails/infoCenterCardsBlock.png',
  imageAltText: 'Centered info cards grid',
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
          name: 'icon',
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
