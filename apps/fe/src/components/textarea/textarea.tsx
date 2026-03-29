import { cn } from '../../utils/styles';
import React from 'react';

/**
 * Props for the TextArea component
 * Extends all standard HTML textarea element attributes
 * @property {string} className - Additional CSS classes to apply to the textarea element (optional)
 */
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

/**
 * Custom TextArea component with enhanced styling
 *
 * Features:
 * - Extends all standard HTML textarea attributes
 * - Minimum height of 180px for better usability
 * - Customizable styling via className prop
 * - Consistent input styling with other form components
 * - Full accessibility support through native textarea element
 * - Responsive design with proper resizing
 *
 * @example
 * ```tsx
 * // Basic textarea
 * <TextArea
 *   placeholder="Enter your message here..."
 *   className="w-full"
 * />
 *
 * // Textarea with additional attributes
 * <TextArea
 *   placeholder="Describe your experience"
 *   rows={5}
 *   maxLength={500}
 *   required
 *   className="w-full"
 * />
 *
 * // Textarea with custom styling
 * <TextArea
 *   placeholder="Your feedback"
 *   className="w-full border-2 border-blue-500 rounded-lg"
 * />
 * ```
 *
 * @param {string} className - Additional CSS classes to apply to the textarea element (optional)
 * @param {React.TextareaHTMLAttributes<HTMLTextAreaElement>} props - All other standard HTML textarea attributes
 * @returns JSX.Element
 */
export const TextArea = ({ className, ...props }: TextAreaProps) => {
  return <textarea className={cn('input-default min-h-[180px]', className)} {...props} />;
};
