import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const LoanCalculatorBlock: Block = {
  slug: 'loanCalculatorBlock',
  interfaceName: 'LoanCalculatorBlock',
  imageURL: '/block-thumbnails/loanCalculatorBlock.png',
  imageAltText: 'Loan calculator with sliders',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Kalkulačka půjčky',
    },
    {
      name: 'minAmount',
      type: 'number',
      defaultValue: 20000,
    },
    {
      name: 'maxAmount',
      type: 'number',
      defaultValue: 800000,
    },
    {
      name: 'defaultAmount',
      type: 'number',
      defaultValue: 200000,
    },
    {
      name: 'minMonths',
      type: 'number',
      defaultValue: 6,
    },
    {
      name: 'maxMonths',
      type: 'number',
      defaultValue: 96,
    },
    {
      name: 'defaultMonths',
      type: 'number',
      defaultValue: 36,
    },
    {
      name: 'interestRate',
      type: 'number',
      defaultValue: 4.9,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
