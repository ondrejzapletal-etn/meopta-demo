import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const StepsBlock: Block = {
  slug: 'stepsBlock',
  interfaceName: 'StepsBlock',
  imageURL: '/block-thumbnails/stepsBlock.png',
  imageAltText: 'Numbered steps progress',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'stepNumber',
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
};
