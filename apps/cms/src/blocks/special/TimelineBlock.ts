import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const TimelineBlock: Block = {
  slug: 'timelineBlock',
  interfaceName: 'TimelineBlock',
  imageURL: '/block-thumbnails/timelineBlock.png',
  imageAltText: 'Timeline with progress steps',
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
          name: 'year',
          type: 'text',
          required: true,
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
};
