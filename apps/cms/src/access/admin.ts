import { Access, FieldAccess } from 'payload';

/**
 * Access control function that restricts access to admin users only.
 *
 * @param req - The request object containing user information
 * @returns `true` if the user has admin role, `false` otherwise
 *
 */
export const admin: Access = ({ req }) => {
  return req?.user?.role === 'admin';
};

/**
 * Access control function that restricts field access to admin users only.
 *
 * @param req - The request object containing user information
 * @returns `true` if the user has admin role, `false` otherwise
 *
 */
export const adminField: FieldAccess = ({ req }) => {
  return req?.user?.role === 'admin';
};
