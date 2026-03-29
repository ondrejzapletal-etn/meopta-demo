import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const StepsVerticalCollapsibleBlock: Block = {
  slug: 'stepsVerticalCollapsibleBlock',
  dbName: 'stepsVertCollapse',
  interfaceName: 'StepsVerticalCollapsibleBlock',
  imageURL: '/block-thumbnails/stepsVerticalCollapsibleBlock.png',
  imageAltText: 'Vertical collapsible steps accordion',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
  ],
};
