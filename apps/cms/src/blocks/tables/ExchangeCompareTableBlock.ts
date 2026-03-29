import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ExchangeCompareTableBlock: Block = {
  slug: 'exchangeCompareTableBlock',
  dbName: 'exchCompTable',
  interfaceName: 'ExchangeCompareTableBlock',
  imageURL: '/block-thumbnails/exchangeCompareTableBlock.png',
  imageAltText: 'Exchange rate comparison table',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'providers',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'currencies',
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
            {
              name: 'highlighted',
              type: 'checkbox',
            },
          ],
        },
      ],
    },
  ],
};
