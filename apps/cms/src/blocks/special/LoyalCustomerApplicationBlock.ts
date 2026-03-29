import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const LoyalCustomerApplicationBlock: Block = {
  slug: 'loyalCustomerApplicationBlock',
  dbName: 'loyalCustApp',
  interfaceName: 'LoyalCustomerApplicationBlock',
  imageURL: '/block-thumbnails/loyalCustomerApplicationBlock.png',
  imageAltText: 'Loyal customer app download banner',
  fields: [
    LayoutStyles,
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
    {
      name: 'rating',
      type: 'text',
      defaultValue: '4.8',
    },
  ],
};
