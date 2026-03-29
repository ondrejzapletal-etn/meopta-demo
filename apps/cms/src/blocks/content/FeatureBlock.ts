import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';
import { ImagePosition } from '../../fields/ImagePosition';

export const FeatureBlock: Block = {
  slug: 'featureBlock',
  interfaceName: 'FeatureBlock',
  imageURL: '/block-thumbnails/featureBlock.png',
  imageAltText: 'Content with alternating image',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Optional larger intro text displayed above description',
      },
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
    ImagePosition,
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Grey', value: 'lightGrey' },
        { label: 'Green', value: 'green' },
      ],
    },
    {
      name: 'imageOverflow',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When enabled, the image is displayed smaller and overflows above/below the block (for phone mockups)',
      },
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 4,
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
