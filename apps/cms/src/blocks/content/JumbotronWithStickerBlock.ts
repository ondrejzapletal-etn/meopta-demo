import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const JumbotronWithStickerBlock: Block = {
  slug: 'jumbotronWithStickerBlock',
  dbName: 'jumbotronSticker',
  interfaceName: 'JumbotronWithStickerBlock',
  imageURL: '/block-thumbnails/jumbotronWithStickerBlock.png',
  imageAltText: 'Banner with sticker badge',
  fields: [
    LayoutStyles,
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
    {
      name: 'stickerText',
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
      name: 'secondaryLinkLabel',
      type: 'text',
    },
    {
      name: 'secondaryLinkUrl',
      type: 'text',
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'green',
      options: [
        { label: 'Green', value: 'green' },
        { label: 'White', value: 'white' },
        { label: 'Light Grey', value: 'lightGrey' },
      ],
    },
  ],
};
