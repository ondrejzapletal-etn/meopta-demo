import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ExchangeRatesBlock: Block = {
  slug: 'exchangeRatesBlock',
  interfaceName: 'ExchangeRatesBlock',
  imageURL: '/block-thumbnails/exchangeRatesBlock.png',
  imageAltText: 'Exchange rates with flags',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'lastUpdated',
      type: 'text',
    },
    {
      name: 'rates',
      type: 'array',
      fields: [
        {
          name: 'currencyCode',
          type: 'text',
          required: true,
          maxLength: 3,
        },
        {
          name: 'currencyName',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'buyRate',
          type: 'text',
          required: true,
        },
        {
          name: 'sellRate',
          type: 'text',
          required: true,
        },
        {
          name: 'midRate',
          type: 'text',
        },
      ],
    },
  ],
};
