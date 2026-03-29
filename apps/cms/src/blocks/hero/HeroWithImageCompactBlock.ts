import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';
import { BackgroundColor } from '../../fields/BackgroundColor';

export const HeroWithImageCompactBlock: Block = {
  slug: 'heroWithImageCompactBlock',
  dbName: 'heroCompact',
  interfaceName: 'HeroWithImageCompactBlock',
  imageURL: '/block-thumbnails/heroWithImageCompactBlock.png',
  imageAltText: 'Compact hero with breadcrumbs',
  fields: [
    LayoutStyles,
    BackgroundColor,
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
