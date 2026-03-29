import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';
import { ImagePosition } from '../../fields/ImagePosition';
import { BackgroundColor } from '../../fields/BackgroundColor';

export const HeroWithImageBlock: Block = {
  slug: 'heroWithImageBlock',
  interfaceName: 'HeroWithImageBlock',
  imageURL: '/block-thumbnails/heroWithImageBlock.png',
  imageAltText: 'Hero with image on the right side',
  fields: [
    LayoutStyles,
    BackgroundColor,
    ImagePosition,
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
