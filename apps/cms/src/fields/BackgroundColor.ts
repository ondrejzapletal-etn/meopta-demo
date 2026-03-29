import { Field } from 'payload';

export const BackgroundColor: Field = {
  name: 'backgroundColor',
  type: 'select',
  defaultValue: 'white',
  options: [
    { label: 'White', value: 'white' },
    { label: 'Green', value: 'green' },
    { label: 'Light Green', value: 'lightGreen' },
    { label: 'Light Grey', value: 'lightGrey' },
  ],
};
