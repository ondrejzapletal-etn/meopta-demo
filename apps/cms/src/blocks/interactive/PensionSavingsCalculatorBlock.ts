import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const PensionSavingsCalculatorBlock: Block = {
  slug: 'pensionSavingsCalculatorBlock',
  dbName: 'pensionSavCalc',
  interfaceName: 'PensionSavingsCalculatorBlock',
  imageURL: '/block-thumbnails/pensionSavingsCalculatorBlock.png',
  imageAltText: 'Supplementary pension savings calculator',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      defaultValue: 'DPS kalkulacka',
    },
    {
      name: 'minMonthly',
      type: 'number',
      defaultValue: 300,
    },
    {
      name: 'maxMonthly',
      type: 'number',
      defaultValue: 10000,
    },
    {
      name: 'defaultMonthly',
      type: 'number',
      defaultValue: 1000,
    },
    {
      name: 'minYears',
      type: 'number',
      defaultValue: 5,
    },
    {
      name: 'maxYears',
      type: 'number',
      defaultValue: 40,
    },
    {
      name: 'defaultYears',
      type: 'number',
      defaultValue: 20,
    },
    {
      name: 'expectedReturn',
      type: 'number',
      defaultValue: 4,
    },
    {
      name: 'stateContribution',
      type: 'number',
      defaultValue: 230,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
