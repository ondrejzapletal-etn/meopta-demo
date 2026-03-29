import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ZoneInterestBlock: Block = {
  slug: 'zoneInterestBlock',
  interfaceName: 'ZoneInterestBlock',
  imageURL: '/block-thumbnails/zoneInterestBlock.png',
  imageAltText: 'Savings chart visualization',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Graf spoření',
    },
    {
      name: 'monthlyDeposit',
      type: 'number',
      defaultValue: 5000,
    },
    {
      name: 'interestRate',
      type: 'number',
      defaultValue: 3,
    },
    {
      name: 'years',
      type: 'number',
      defaultValue: 10,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
