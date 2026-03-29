import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';
import { ImagePosition } from '../../fields/ImagePosition';

export const InfoImageBlock: Block = {
  slug: 'infoImageBlock',
  interfaceName: 'InfoImageBlock',
  imageURL: '/block-thumbnails/infoImageBlock.png',
  imageAltText: 'Content with edge-to-edge image',
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
