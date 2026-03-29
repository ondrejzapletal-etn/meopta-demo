import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const HeroPlainBlock: Block = {
  slug: 'heroPlainBlock',
  interfaceName: 'HeroPlainBlock',
  imageURL: '/block-thumbnails/heroPlainBlock.png',
  imageAltText: 'Hero block with green background, title and CTA buttons',
  fields: [
    LayoutStyles,
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
    {
      name: 'textAlign',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      maxLength: 200,
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 2,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'appearance',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
  ],
};
