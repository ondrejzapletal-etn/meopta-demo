import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const InfoPlainBlock: Block = {
  slug: 'infoPlainBlock',
  interfaceName: 'InfoPlainBlock',
  imageURL: '/block-thumbnails/infoPlainBlock.png',
  imageAltText: 'Plain text content block',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Green', value: 'green' },
        { label: 'Light Grey', value: 'lightGrey' },
      ],
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
      name: 'secondaryLinkLabel',
      type: 'text',
    },
    {
      name: 'secondaryLinkUrl',
      type: 'text',
    },
  ],
};
