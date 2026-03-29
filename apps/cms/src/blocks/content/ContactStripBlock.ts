import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ContactStripBlock: Block = {
  slug: 'contactStripBlock',
  interfaceName: 'ContactStripBlock',
  imageURL: '/block-thumbnails/contactStripBlock.png',
  imageAltText: 'Narrow info strip banner',
  fields: [
    LayoutStyles,
    {
      name: 'text',
      type: 'text',
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
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'green',
      options: [
        { label: 'Green', value: 'green' },
        { label: 'Light Green', value: 'lightGreen' },
      ],
    },
  ],
};
