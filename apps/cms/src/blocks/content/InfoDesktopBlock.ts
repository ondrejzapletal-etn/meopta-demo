import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';
import { ImagePosition } from '../../fields/ImagePosition';

export const InfoDesktopBlock: Block = {
  slug: 'infoDesktopBlock',
  interfaceName: 'InfoDesktopBlock',
  imageURL: '/block-thumbnails/infoDesktopBlock.png',
  imageAltText: 'Content with desktop image',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    ImagePosition,
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Grey', value: 'lightGrey' },
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
    {
      name: 'secondaryLinkLabel',
      type: 'text',
    },
    {
      name: 'secondaryLinkUrl',
      type: 'text',
    },
  ],
};
