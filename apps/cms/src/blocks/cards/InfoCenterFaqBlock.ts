import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const InfoCenterFaqBlock: Block = {
  slug: 'infoCenterFaqBlock',
  interfaceName: 'InfoCenterFaqBlock',
  imageURL: '/block-thumbnails/infoCenterFaqBlock.png',
  imageAltText: 'FAQ grid with icons and links',
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
            { label: 'Info', value: 'info' },
            { label: 'Lightbulb', value: 'lightbulb' },
          ],
        },
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};
