import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const MortgageCalculatorBlock: Block = {
  slug: 'mortgageCalculatorBlock',
  interfaceName: 'MortgageCalculatorBlock',
  imageURL: '/block-thumbnails/mortgageCalculatorBlock.png',
  imageAltText: 'Mortgage calculator',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Hypoteční kalkulačka',
    },
    {
      name: 'minAmount',
      type: 'number',
      defaultValue: 500000,
    },
    {
      name: 'maxAmount',
      type: 'number',
      defaultValue: 10000000,
    },
    {
      name: 'defaultAmount',
      type: 'number',
      defaultValue: 3000000,
    },
    {
      name: 'minYears',
      type: 'number',
      defaultValue: 5,
    },
    {
      name: 'maxYears',
      type: 'number',
      defaultValue: 30,
    },
    {
      name: 'defaultYears',
      type: 'number',
      defaultValue: 20,
    },
    {
      name: 'interestRate',
      type: 'number',
      defaultValue: 5.49,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'dosPersonImage',
      type: 'upload',
      relationTo: 'media',
      label: '"Dosáhnu na hypotéku?" tab illustration',
    },
  ],
};
