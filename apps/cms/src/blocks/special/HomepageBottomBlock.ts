import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const HomepageBottomBlock: Block = {
  slug: 'homepageBottomBlock',
  interfaceName: 'HomepageBottomBlock',
  imageURL: '/block-thumbnails/homepageBottomBlock.png',
  imageAltText: 'Exchange rates and news section',
  fields: [
    LayoutStyles,
    {
      name: 'ratesTitle',
      type: 'text',
      defaultValue: 'Kurzovní lístek',
    },
    {
      name: 'rates',
      type: 'array',
      fields: [
        {
          name: 'currency',
          type: 'text',
          required: true,
        },
        {
          name: 'buyRate',
          type: 'text',
          required: true,
        },
        {
          name: 'sellRate',
          type: 'text',
          required: true,
        },
        {
          name: 'flagIcon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'ratesLinkLabel',
      type: 'text',
    },
    {
      name: 'ratesLinkUrl',
      type: 'text',
    },
    {
      name: 'newsTitle',
      type: 'text',
      defaultValue: 'Co je u nás nového',
    },
    {
      name: 'news',
      type: 'array',
      fields: [
        {
          name: 'date',
          type: 'text',
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
      ],
    },
    {
      name: 'newsLinkLabel',
      type: 'text',
    },
    {
      name: 'newsLinkUrl',
      type: 'text',
    },
  ],
};
