import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ProductCardsVerticalBlock: Block = {
  slug: 'productCardsVerticalBlock',
  dbName: 'prodCardsVert',
  interfaceName: 'ProductCardsVerticalBlock',
  imageURL: '/block-thumbnails/productCardsVerticalBlock.png',
  imageAltText: 'Vertical benefit cards',
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
          type: 'select',
          options: [
            { label: 'Credit Card', value: 'creditCard' },
            { label: 'Wallet', value: 'wallet' },
            { label: 'Phone', value: 'phone' },
            { label: 'Shield', value: 'shield' },
            { label: 'Chart', value: 'chart' },
            { label: 'Piggy Bank', value: 'piggyBank' },
            { label: 'Home', value: 'home' },
            { label: 'Transfer', value: 'transfer' },
            { label: 'Globe', value: 'globe' },
            { label: 'Calculator', value: 'calculator' },
            { label: 'Clock', value: 'clock' },
            { label: 'Star', value: 'star' },
            { label: 'Check', value: 'check' },
            { label: 'Arrow Right', value: 'arrowRight' },
            { label: 'Info', value: 'info' },
            { label: 'Lightbulb', value: 'lightbulb' },
          ],
        },
        {
          name: 'title',
          type: 'text',
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
