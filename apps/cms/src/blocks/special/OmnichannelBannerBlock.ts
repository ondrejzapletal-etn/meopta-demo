import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const OmnichannelBannerBlock: Block = {
  slug: 'omnichannelBannerBlock',
  interfaceName: 'OmnichannelBannerBlock',
  imageURL: '/block-thumbnails/omnichannelBannerBlock.png',
  imageAltText: 'Omnichannel contact banner',
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
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'text',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'linkUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'green',
      options: [
        { label: 'Green', value: 'green' },
        { label: 'Light Green', value: 'lightGreen' },
      ],
    },
  ],
};
