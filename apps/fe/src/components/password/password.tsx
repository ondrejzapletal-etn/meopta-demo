'use client';
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from '../input/input';

/**
 * Props for the Password component
 * Extends all standard HTML input element attributes
 * @property {React.InputHTMLAttributes<HTMLInputElement>} props - All standard HTML input attributes
 */
type PasswordProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Custom Password component with toggle visibility functionality
 *
 * Features:
 * - Toggle password visibility with eye icon button
 * - Uses Input component as base with password type
 * - Eye icon shows/hides based on password visibility state
 * - Button is positioned absolutely and non-focusable (tabIndex={-1})
 * - Extends all standard HTML input attributes
 * - Full accessibility support through native input element
 *
 * @example
 * ```tsx
 * // Basic password input
 * <Password
 *   placeholder="Enter your password"
 *   className="w-full"
 * />
 *
 * // Password input with additional attributes
 * <Password
 *   placeholder="Confirm password"
 *   required
 *   minLength={8}
 *   className="w-full"
 * />
 *
 * // Password input with custom styling
 * <Password
 *   placeholder="Enter password"
 *   className="w-full border-2 border-blue-500"
 * />
 * ```
 *
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - All standard HTML input attributes
 * @returns JSX.Element
 */
export const Password = ({ ...props }: PasswordProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  /**
   * Toggles the password visibility state between visible and hidden
   * Updates the input type between 'text' and 'password'
   */
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative">
      <Input {...props} type={isPasswordVisible ? 'text' : 'password'} />
      <button
        tabIndex={-1}
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};
