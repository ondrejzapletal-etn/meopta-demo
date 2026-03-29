import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const TopManagementCardsBlock: Block = {
  slug: 'topManagementCardsBlock',
  dbName: 'topMgmtCards',
  interfaceName: 'TopManagementCardsBlock',
  imageURL: '/block-thumbnails/topManagementCardsBlock.png',
  imageAltText: 'Team members photo grid',
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
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'linkedinUrl',
          type: 'text',
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
};
