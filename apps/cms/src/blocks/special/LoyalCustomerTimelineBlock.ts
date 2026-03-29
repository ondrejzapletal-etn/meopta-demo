import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const LoyalCustomerTimelineBlock: Block = {
  slug: 'loyalCustomerTimelineBlock',
  dbName: 'loyalCustTimeline',
  interfaceName: 'LoyalCustomerTimelineBlock',
  imageURL: '/block-thumbnails/loyalCustomerTimelineBlock.png',
  imageAltText: 'Loyal customer program timeline',
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
          name: 'step',
          type: 'text',
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
      ],
    },
  ],
};
