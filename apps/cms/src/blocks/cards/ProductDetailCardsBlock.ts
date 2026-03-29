import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const ProductDetailCardsBlock: Block = {
  slug: 'productDetailCardsBlock',
  interfaceName: 'ProductDetailCardsBlock',
  imageURL: '/block-thumbnails/productDetailCardsBlock.png',
  imageAltText: 'Product detail cards with icon, description and feature list',
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
      name: 'backgroundColor',
      type: 'select',
      dbName: 'prod_detail_cards_bg',
      defaultValue: 'lightGrey',
      options: [
        { label: 'Light Grey', value: 'lightGrey' },
        { label: 'White', value: 'white' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'description',
          type: 'richText',
        },
        {
          name: 'features',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
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
      ],
    },
  ],
};
