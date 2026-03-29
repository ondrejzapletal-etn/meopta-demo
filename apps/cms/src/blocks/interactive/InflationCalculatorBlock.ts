import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const InflationCalculatorBlock: Block = {
  slug: 'inflationCalculatorBlock',
  interfaceName: 'InflationCalculatorBlock',
  imageURL: '/block-thumbnails/inflationCalculatorBlock.png',
  imageAltText: 'Inflation impact calculator',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Inflační kalkulačka',
    },
    {
      name: 'defaultAmount',
      type: 'number',
      defaultValue: 100000,
    },
    {
      name: 'minYears',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'maxYears',
      type: 'number',
      defaultValue: 30,
    },
    {
      name: 'defaultYears',
      type: 'number',
      defaultValue: 10,
    },
    {
      name: 'defaultInflation',
      type: 'number',
      defaultValue: 3,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
