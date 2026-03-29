import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const BranchMapBlock: Block = {
  slug: 'branchMapBlock',
  interfaceName: 'BranchMapBlock',
  imageURL: '/block-thumbnails/branchMapBlock.png',
  imageAltText: 'Interactive branch map',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
  ],
};
