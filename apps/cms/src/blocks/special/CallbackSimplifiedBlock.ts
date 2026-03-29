import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const CallbackSimplifiedBlock: Block = {
  slug: 'callbackSimplifiedBlock',
  interfaceName: 'CallbackSimplifiedBlock',
  imageURL: '/block-thumbnails/callbackSimplifiedBlock.png',
  imageAltText: 'Contact form with inputs',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Kontaktujte nás',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'emailTo',
      type: 'text',
    },
    {
      name: 'showPhone',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showSubject',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};
