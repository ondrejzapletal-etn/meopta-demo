import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const FeatureApplicationBlock: Block = {
  slug: 'featureApplicationBlock',
  interfaceName: 'FeatureApplicationBlock',
  imageURL: '/block-thumbnails/featureApplicationBlock.png',
  imageAltText: 'App download promo banner',
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
      name: 'linkLabel',
      type: 'text',
    },
    {
      name: 'linkUrl',
      type: 'text',
    },
    {
      name: 'rating',
      type: 'text',
      defaultValue: '4.9',
    },
    {
      name: 'ratingCount',
      type: 'text',
    },
    {
      name: 'reviews',
      type: 'array',
      fields: [
        {
          name: 'author',
          type: 'text',
        },
        {
          name: 'date',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'text',
          type: 'textarea',
        },
        {
          name: 'stars',
          type: 'number',
          defaultValue: 5,
        },
        {
          name: 'store',
          type: 'select',
          options: [
            { label: 'App Store', value: 'appStore' },
            { label: 'Google Play', value: 'googlePlay' },
          ],
        },
      ],
    },
  ],
};
