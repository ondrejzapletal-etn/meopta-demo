import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const DownloadSectionBlock: Block = {
  slug: 'downloadSectionBlock',
  interfaceName: 'DownloadSectionBlock',
  imageURL: '/block-thumbnails/downloadSectionBlock.png',
  imageAltText: 'Download files table',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
};
