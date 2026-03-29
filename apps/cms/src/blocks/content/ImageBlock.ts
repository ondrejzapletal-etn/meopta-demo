import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';
import { ImagePosition } from '../../fields/ImagePosition';

export const ImageBlock: Block = {
  slug: 'imageBlock',
  interfaceName: 'ImageBlock',
  imageURL: '/block-thumbnails/imageBlock.png',
  imageAltText: 'Image with text content',
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
  ],
};
