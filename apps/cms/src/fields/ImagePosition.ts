import { Field } from 'payload';

export const ImagePosition: Field = {
  name: 'imagePosition',
  type: 'radio',
  defaultValue: 'right',
  options: [
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
  ],
};
