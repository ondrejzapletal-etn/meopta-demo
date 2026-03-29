import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const HeroReasonsSimplifiedBlock: Block = {
  slug: 'heroReasonsSimplifiedBlock',
  dbName: 'heroReasonsSimpl',
  interfaceName: 'HeroReasonsSimplifiedBlock',
  imageURL: '/block-thumbnails/heroReasonsSimplifiedBlock.png',
  imageAltText: 'Simplified reason cards',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
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
      name: 'counterText',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'number',
          type: 'number',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
};
