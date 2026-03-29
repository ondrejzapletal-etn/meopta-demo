'use client';
import React, { useState, useRef } from 'react';
import { cn } from '../../utils/styles';
import { ArrowDown } from 'lucide-react';

/**
 * Represents a single option in the select dropdown
 * @property {string} id - The unique identifier for the option
 * @property {string} value - The value of the option
 * @property {string} label - The label of the option
 * @property {boolean} disabled - Whether the option is disabled
 * @property {boolean} selected - Whether the option is selected as a default value
 */
interface SelectOption {
  id: string;
  value: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
}

/**
 * Props for the Select component
 * Extends all standard HTML select element attributes
 * @property {SelectOption[]} options - The options to display in the dropdown
 * @property {string} value - The value of the selected option
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  value?: string;
}

/**
 * Custom Select component with enhanced styling and behavior
 *
 * Features:
 * - Custom arrow icon that rotates when dropdown is open
 * - Keyboard navigation support (Enter and Space keys)
 * - Click outside detection to close dropdown
 * - Customizable styling via className prop
 * - Full accessibility support through native select element
 *
 * @example
 * ```tsx
 * const options = [
 *   { id: '1', value: 'apple', label: 'Apple' },
 *   { id: '2', value: 'banana', label: 'Banana', disabled: true },
 *   { id: '3', value: 'cherry', label: 'Cherry' }
 * ];
 *
 * <Select
 *   options={options}
 *   value="apple"
 *   onChange={handleChange}
 *   className="w-full"
 * />
 * ```
 *
 * @param {string} className - Additional CSS classes to apply to the select element
 * @param {SelectOption[]} options - Array of options to display in the dropdown
 * @param {string} value - Currently selected value
 * @param {React.SelectHTMLAttributes<HTMLSelectElement>} props - All other standard HTML select attributes
 * @returns JSX.Element
 */
export const Select = ({ className, options, value, ...props }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const componentRef = useRef<HTMLSelectElement>(null);

  /**
   * Handles click events on the select component to detect clicks outside the dropdown
   * and close the dropdown when clicking outside
   *
   * @param event - The mouse event that triggered the click
   */
  const selectClickHandle = (event: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
    if (componentRef.current) {
      const rect = componentRef.current.getBoundingClientRect();
      const { clientX, clientY } = event;

      const isInComponent
        = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

      if (!isInComponent) {
        setIsOpen(false);
      }
    }
  };

  /**
   * Handles keyboard events on the select component to open the dropdown
   * when Enter or Space keys are pressed
   *
   * @param event - The keyboard event that was triggered
   */
  const selectkeyHandle = (event: React.KeyboardEvent<HTMLSelectElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full">
      <select
        ref={componentRef}
        className={cn('input-default cursor-pointer appearance-none pr-12', className)}
        onMouseDown={() => setIsOpen(!isOpen)}
        onClick={selectClickHandle}
        onBlur={() => setIsOpen(false)}
        onKeyDown={selectkeyHandle}
        value={value}
        {...props}
      >
        {options.map((option) => (
          <option key={option.id} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <ArrowDown
        className={cn(
          `
            pointer-events-none absolute top-1/2 right-4 -translate-y-1/2
            transform transition-transform duration-300
          `,
          isOpen && 'rotate-180',
        )}
      />
    </div>
  );
};
