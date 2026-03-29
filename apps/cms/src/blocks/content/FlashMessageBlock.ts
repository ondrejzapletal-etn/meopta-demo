import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const FlashMessageBlock: Block = {
  slug: 'flashMessageBlock',
  interfaceName: 'FlashMessageBlock',
  imageURL: '/block-thumbnails/flashMessageBlock.png',
  imageAltText: 'Tip bar with green accent',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      defaultValue: 'TIP',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'linkLabel',
      type: 'text',
    },
    {
      name: 'linkUrl',
      type: 'text',
    },
  ],
};
