import { cn } from '../../utils/styles';
import React from 'react';

/**
 * Props for the Input component
 * Extends all standard HTML input element attributes
 * @property {string} className - Additional CSS classes to apply to the input element (optional)
 * @property {React.ReactNode} icon - Icon to display inside the input field (optional)
 * @property {React.RefObject<HTMLInputElement | null>} ref - Reference to the input element (optional)
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  icon?: React.ReactNode;
  ref?: React.RefObject<HTMLInputElement | null>;
}

/**
 * Custom Input component with optional icon support
 *
 * Features:
 * - Extends all standard HTML input attributes
 * - Optional icon display inside the input field
 * - Icon is positioned absolutely and shows only when placeholder is visible
 * - Responsive design with peer-based styling
 * - Customizable styling via className prop
 * - Full accessibility support through native input element
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input
 *   type="text"
 *   placeholder="Enter your name"
 *   className="w-full"
 * />
 *
 * // Input with icon
 * <Input
 *   type="email"
 *   placeholder="Enter your email"
 *   icon={<MailIcon className="w-5 h-5" />}
 *   className="w-full"
 * />
 *
 * // Input with ref
 * const inputRef = useRef<HTMLInputElement>(null);
 * <Input
 *   ref={inputRef}
 *   type="password"
 *   placeholder="Enter password"
 * />
 * ```
 *
 * @param {string} className - Additional CSS classes to apply to the input element (optional)
 * @param {React.ReactNode} icon - Icon to display inside the input field (optional)
 * @param {React.RefObject<HTMLInputElement | null>} ref - Reference to the input element (optional)
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - All other standard HTML input attributes
 * @returns JSX.Element
 */
export const Input = ({ className, icon, ref, ...props }: InputProps) => {
  const input = <input className={cn('peer input-default', className)} ref={ref} {...props} />;

  return icon
    ? (
        <div className="relative w-full">
          {input}
          <span className={`
            absolute top-1/2 right-3 hidden -translate-y-1/2
            peer-placeholder-shown:block
          `}
          >
            {icon}
          </span>
        </div>
      )
    : (
        input
      );
};
