import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const CompareBondsTableBlock: Block = {
  slug: 'compareBondsTableBlock',
  interfaceName: 'CompareBondsTableBlock',
  imageURL: '/block-thumbnails/compareBondsTableBlock.png',
  imageAltText: 'Term deposit rates table',
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
      name: 'rows',
      type: 'array',
      fields: [
        {
          name: 'period',
          type: 'text',
          required: true,
        },
        {
          name: 'interestRate',
          type: 'text',
          required: true,
        },
        {
          name: 'minAmount',
          type: 'text',
        },
        {
          name: 'highlighted',
          type: 'checkbox',
        },
      ],
    },
  ],
};
