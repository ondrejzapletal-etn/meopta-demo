import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const PortuCalculatorBlock: Block = {
  slug: 'portuCalculatorBlock',
  interfaceName: 'PortuCalculatorBlock',
  imageURL: '/block-thumbnails/portuCalculatorBlock.png',
  imageAltText: 'Portu investment calculator',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Portu kalkulacka',
    },
    {
      name: 'minAmount',
      type: 'number',
      defaultValue: 10000,
    },
    {
      name: 'maxAmount',
      type: 'number',
      defaultValue: 5000000,
    },
    {
      name: 'defaultAmount',
      type: 'number',
      defaultValue: 500000,
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
      name: 'expectedReturn',
      type: 'number',
      defaultValue: 6,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
