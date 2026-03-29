import { Block } from 'payload';
import { LayoutStyles } from '../fields/LayoutStyles';

/**
 * Rich Text block configuration for Payload CMS.
 *
 * Provides a rich text content field for flexible text content management.
 */
export const RichTextBlock: Block = {
  slug: 'richTextBlock',
  interfaceName: 'RichTextBlock',
  imageURL: '/block-thumbnails/richTextBlock.png',
  imageAltText: 'Rich text content block',
  fields: [
    LayoutStyles,
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Grey', value: 'lightGrey' },
        { label: 'Green', value: 'green' },
      ],
    },
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Info Box', value: 'info-box' },
        { label: 'Compact', value: 'compact' },
      ],
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
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
