import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const InfoDoubleImageBlock: Block = {
  slug: 'infoDoubleImageBlock',
  interfaceName: 'InfoDoubleImageBlock',
  imageURL: '/block-thumbnails/infoDoubleImageBlock.png',
  imageAltText: 'Content with two phone screenshots',
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
      name: 'imageLeft',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imageRight',
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
