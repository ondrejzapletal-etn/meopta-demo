import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const HeroSliderBlock: Block = {
  slug: 'heroSliderBlock',
  interfaceName: 'HeroSliderBlock',
  imageURL: '/block-thumbnails/heroSliderBlock.png',
  imageAltText: 'Hero carousel with dot navigation',
  fields: [
    LayoutStyles,
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
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
    },
    {
      name: 'autoPlay',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'autoPlayInterval',
      type: 'number',
      defaultValue: 5000,
      admin: {
        description: 'Interval in milliseconds',
      },
    },
  ],
};
