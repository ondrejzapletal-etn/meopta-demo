import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const LogoCarouselBlock: Block = {
  slug: 'logoCarouselBlock',
  interfaceName: 'LogoCarouselBlock',
  imageURL: '/block-thumbnails/logoCarouselBlock.png',
  imageAltText: 'Logo carousel strip',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'logos',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
};
