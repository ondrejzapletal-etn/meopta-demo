import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const HeroWithImageAndSearchBlock: Block = {
  slug: 'heroWithImageAndSearchBlock',
  dbName: 'heroSearch',
  interfaceName: 'HeroWithImageAndSearchBlock',
  imageURL: '/block-thumbnails/heroWithImageAndSearchBlock.png',
  imageAltText: 'Hero with search input field',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
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
      name: 'searchPlaceholder',
      type: 'text',
      defaultValue: 'Co hledáte?',
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
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'green',
      options: [
        { label: 'Green', value: 'green' },
        { label: 'White', value: 'white' },
      ],
    },
  ],
};
