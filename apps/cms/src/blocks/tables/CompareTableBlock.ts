import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const CompareTableBlock: Block = {
  slug: 'compareTableBlock',
  interfaceName: 'CompareTableBlock',
  imageURL: '/block-thumbnails/compareTableBlock.png',
  imageAltText: 'Bank comparison table',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'banks',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'values',
          type: 'array',
          fields: [
            {
              name: 'value',
              type: 'text',
            },
            {
              name: 'subtitle',
              type: 'text',
            },
            {
              name: 'highlighted',
              type: 'checkbox',
            },
          ],
        },
      ],
    },
  ],
};
