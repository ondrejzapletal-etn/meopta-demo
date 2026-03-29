import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const InfoVideoBlock: Block = {
  slug: 'infoVideoBlock',
  interfaceName: 'InfoVideoBlock',
  imageURL: '/block-thumbnails/infoVideoBlock.png',
  imageAltText: 'Content with embedded video',
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
      name: 'videoUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'videoPosition',
      type: 'radio',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'thumbnail',
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
      name: 'secondaryLinkLabel',
      type: 'text',
    },
    {
      name: 'secondaryLinkUrl',
      type: 'text',
    },
  ],
};
