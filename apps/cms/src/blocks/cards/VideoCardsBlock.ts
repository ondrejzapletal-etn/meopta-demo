import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const VideoCardsBlock: Block = {
  slug: 'videoCardsBlock',
  interfaceName: 'VideoCardsBlock',
  imageURL: '/block-thumbnails/videoCardsBlock.png',
  imageAltText: 'Video cards with play button',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
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
          name: 'videoUrl',
          type: 'text',
        },
      ],
    },
  ],
};
