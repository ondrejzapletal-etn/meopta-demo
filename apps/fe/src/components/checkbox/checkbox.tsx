import React from 'react';
import { cn } from '../../utils/styles';
import { Check } from 'lucide-react';
import { Label } from '../label/label';
import { Stack } from '../stack/stack';

/**
 * Props for the Checkbox component
 * Extends all standard HTML input element attributes
 * @property {string} className - Additional CSS classes to apply to the checkbox element (optional)
 * @property {string | React.ReactNode} label - Label text or component to display next to the checkbox (optional)
 * @property {string} id - Unique identifier for the checkbox input (required)
 */
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string | React.ReactNode;
  id: string;
}

/**
 * Custom Checkbox component with custom styling and label support
 *
 * Features:
 * - Custom checkbox design with check icon
 * - Optional label support (string or React component)
 * - Uses peer-based styling for checked/unchecked states
 * - Accessible with proper label association
 * - Focus ring and disabled states
 * - Extends all standard HTML input attributes
 * - Full accessibility support through native input element
 *
 * @example
 * ```tsx
 * // Basic checkbox with string label
 * <Checkbox
 *   id="terms"
 *   label="I agree to the terms and conditions"
 *   className="w-full"
 * />
 *
 * // Checkbox with React component label
 * <Checkbox
 *   id="newsletter"
 *   label={<span>Subscribe to <strong>newsletter</strong></span>}
 *   defaultChecked
 * />
 *
 * // Checkbox with additional attributes
 * <Checkbox
 *   id="privacy"
 *   label="I accept the privacy policy"
 *   required
 *   disabled
 *   className="w-full"
 * />
 * ```
 *
 * @param {string} className - Additional CSS classes to apply to the checkbox element (optional)
 * @param {string} id - Unique identifier for the checkbox input (required)
 * @param {string | React.ReactNode} label - Label text or component to display next to the checkbox (optional)
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - All other standard HTML input attributes
 * @returns JSX.Element
 */
export const Checkbox = ({ className, id, label, ...props }: CheckboxProps) => {
  return (
    <Label htmlFor={id}>
      <Stack direction="flex-row" gap="gap-4">
        <>
          <input type="checkbox" id={id} className="peer sr-only" {...props} />
          <div
            className={cn(
              `
                grid h-6 w-6 shrink-0 cursor-pointer place-content-center
                rounded-sm border-[1.5px]
                peer-checked:bg-transparent peer-checked:text-black
                peer-focus:ring-1 peer-focus:ring-black
                peer-disabled:cursor-not-allowed
                [&>svg]:hidden
                peer-checked:[&>svg]:block
              `,
              className,
            )}
          >
            <Check width={16} height={16} strokeWidth={1} />
          </div>
        </>
        <div className="peer-disabled:opacity-50">{label}</div>
      </Stack>
    </Label>
  );
};
