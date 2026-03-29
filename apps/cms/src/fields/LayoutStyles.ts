import { Field } from 'payload';

/**
 * Payload CMS field configuration for layout styling options
 */
export const LayoutStyles: Field = {
  name: 'layoutStyles',
  interfaceName: 'LayoutStyles',
  type: 'group',
  fields: [
    {
      name: 'anchorId',
      type: 'text',
      label: 'Anchor ID',
      admin: {
        description: 'HTML id for anchor links (e.g. "kalkulacka" → #kalkulacka)',
      },
    },
    {
      name: 'variant',
      type: 'text',
      label: 'Variant',
      admin: {
        description: 'Style variant (e.g. "info-box" for grey background with white box)',
      },
    },
  ],
};
