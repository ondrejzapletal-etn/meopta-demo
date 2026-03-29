import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const PressCenterContactBlock: Block = {
  slug: 'pressCenterContactBlock',
  dbName: 'pressContact',
  interfaceName: 'PressCenterContactBlock',
  imageURL: '/block-thumbnails/pressCenterContactBlock.png',
  imageAltText: 'Contact persons cards',
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
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
        },
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
};
