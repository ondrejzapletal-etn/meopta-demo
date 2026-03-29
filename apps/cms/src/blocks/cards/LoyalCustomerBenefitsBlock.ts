import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const LoyalCustomerBenefitsBlock: Block = {
  slug: 'loyalCustomerBenefitsBlock',
  dbName: 'loyalBenefits',
  interfaceName: 'LoyalCustomerBenefitsBlock',
  imageURL: '/block-thumbnails/loyalCustomerBenefitsBlock.png',
  imageAltText: 'Tariff comparison table',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'beforeTitle',
      type: 'text',
      defaultValue: 'Platím',
    },
    {
      name: 'afterTitle',
      type: 'text',
      defaultValue: 'Žiju s Air Bank',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'beforeValue',
          type: 'text',
          required: true,
        },
        {
          name: 'afterValue',
          type: 'text',
          required: true,
        },
        {
          name: 'highlight',
          type: 'checkbox',
        },
      ],
    },
  ],
};
