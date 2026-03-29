import React from 'react';
import { Typography } from '../typography/typography';

/**
 * Props for the Label component
 * Extends all standard HTML label element attributes
 * @property {React.ReactNode} children - The content to render inside the label
 */
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

/**
 * Custom Label component built on top of Typography
 *
 * Features:
 * - Uses Typography component with "label" variant
 * - Semibold font weight by default
 * - Peer-based disabled state styling
 * - Extends all standard HTML label attributes
 * - Full accessibility support through native label element
 * - Consistent typography styling across the application
 *
 * @example
 * ```tsx
 * // Basic label
 * <Label htmlFor="username">Username</Label>
 *
 * // Label with custom styling
 * <Label
 *   htmlFor="email"
 *   className="text-blue-600"
 * >
 *   Email Address
 * </Label>
 *
 * // Label with complex content
 * <Label htmlFor="terms">
 *   I agree to the <a href="/terms">terms and conditions</a>
 * </Label>
 * ```
 *
 * @param {React.ReactNode} children - The content to render inside the label
 * @param {React.LabelHTMLAttributes<HTMLLabelElement>} props - All other standard HTML label attributes
 * @returns JSX.Element
 */
export const Label = ({ children, ...props }: LabelProps) => {
  return (
    <Typography
      variant="label"
      weight="font-semibold"
      className="peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      {...props}
    >
      {children}
    </Typography>
  );
};
