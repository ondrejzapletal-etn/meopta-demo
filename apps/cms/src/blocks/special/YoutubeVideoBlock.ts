import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const YoutubeVideoBlock: Block = {
  slug: 'youtubeVideoBlock',
  interfaceName: 'YoutubeVideoBlock',
  imageURL: '/block-thumbnails/youtubeVideoBlock.png',
  imageAltText: 'YouTube video embed',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
