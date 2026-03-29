import { Block } from 'payload';
import { LayoutStyles } from '../../fields/LayoutStyles';

export const BranchListBlock: Block = {
  slug: 'branchListBlock',
  interfaceName: 'BranchListBlock',
  imageURL: '/block-thumbnails/branchListBlock.png',
  imageAltText: 'Branch listing grid',
  fields: [
    LayoutStyles,
    {
      name: 'title',
      type: 'text',
    },
  ],
};
