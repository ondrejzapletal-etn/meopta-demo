import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const CtaCardsBlock: Block = {
  slug: 'ctaCardsBlock',
  interfaceName: 'CtaCardsBlock',
  imageURL: '/block-thumbnails/ctaCardsBlock.png',
  imageAltText: 'CTA cards with icons',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
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
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
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
    {
      name: 'footnoteIcon',
      type: 'upload',
      relationTo: 'media',
      label: 'Footnote Icon',
    },
    {
      name: 'footnoteText',
      type: 'richText',
      label: 'Footnote Text',
    },
  ],
};
