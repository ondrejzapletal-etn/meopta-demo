import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const TableCardCollapsibleBlock: Block = {
  slug: 'tableCardCollapsibleBlock',
  dbName: 'tblCardCollapse',
  interfaceName: 'TableCardCollapsibleBlock',
  imageURL: '/block-thumbnails/tableCardCollapsibleBlock.png',
  imageAltText: 'Collapsible pricing table card',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'sections',
      type: 'array',
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          required: true,
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
              name: 'value',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
};
