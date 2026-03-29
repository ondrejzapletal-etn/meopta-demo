import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const HeroSliderBlock2: Block = {
  slug: 'heroSliderBlock2',
  interfaceName: 'HeroSliderBlock2',
  imageURL: '/block-thumbnails/heroSliderBlock2.png',
  imageAltText: 'Hero panel slider with 3 expandable panels (50/25/25)',
  fields: [
    LayoutStyles,
    {
      name: 'slides',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      admin: {
        description: 'Exactly 3 slides required. First slide is active by default.',
      },
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
            { label: 'Blue (Industrial / Corporate)', value: 'green' },
            { label: 'Brown (Sport / Hunting)', value: 'white' },
            { label: 'Olive (Military / Defence)', value: 'lightGrey' },
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
  ],
};
