import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const PortuPensionCalculatorBlock: Block = {
  slug: 'portuPensionCalculatorBlock',
  dbName: 'portuPensionCalc',
  interfaceName: 'PortuPensionCalculatorBlock',
  imageURL: '/block-thumbnails/portuPensionCalculatorBlock.png',
  imageAltText: 'Portu pension DIP calculator',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Portu DIP kalkulacka',
    },
    {
      name: 'minMonthly',
      type: 'number',
      defaultValue: 500,
    },
    {
      name: 'maxMonthly',
      type: 'number',
      defaultValue: 10000,
    },
    {
      name: 'defaultMonthly',
      type: 'number',
      defaultValue: 3000,
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
      defaultValue: 5,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
