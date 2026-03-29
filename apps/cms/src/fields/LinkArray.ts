import { Field } from 'payload';
import { Link } from './Link';

export const LinkArray: Field = {
  name: 'links',
  type: 'array',
  maxRows: 3,
  fields: [
    Link,
  ],
};
