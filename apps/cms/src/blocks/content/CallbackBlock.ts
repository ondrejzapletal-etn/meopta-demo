import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const CallbackBlock: Block = {
  slug: 'callbackBlock',
  interfaceName: 'CallbackBlock',
  imageURL: '/block-thumbnails/callbackBlock.png',
  imageAltText: 'CTA banner with image and button',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
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
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'green',
      options: [
        { label: 'Green', value: 'green' },
        { label: 'White', value: 'white' },
        { label: 'Light Grey', value: 'lightGrey' },
      ],
    },
  ],
};
