import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ExchangeTradedFundsTableBlock: Block = {
  slug: 'exchangeTradedFundsTableBlock',
  dbName: 'etfTable',
  interfaceName: 'ExchangeTradedFundsTableBlock',
  imageURL: '/block-thumbnails/exchangeTradedFundsTableBlock.png',
  imageAltText: 'Tariff pricing table',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'columns',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'rows',
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
          ],
        },
      ],
    },
  ],
};
