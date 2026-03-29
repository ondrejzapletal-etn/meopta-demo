import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const BenefitsColumnsBlock: Block = {
  slug: 'benefitsColumnsBlock',
  interfaceName: 'BenefitsColumnsBlock',
  imageURL: '/block-thumbnails/benefitsColumnsBlock.png',
  imageAltText: 'Benefits with icon columns',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
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
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
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
};
