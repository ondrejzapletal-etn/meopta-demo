import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const BenefitsWithImageBlock: Block = {
  slug: 'benefitsWithImageBlock',
  interfaceName: 'BenefitsWithImageBlock',
  imageURL: '/block-thumbnails/benefitsWithImageBlock.png',
  imageAltText: 'Benefits with image illustrations',
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
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
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
      ],
    },
  ],
};
