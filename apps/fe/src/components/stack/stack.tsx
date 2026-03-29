import { cn } from '../../utils/styles';
import React from 'react';

/**
 * Type for flex direction values
 */
type StackDirection = 'flex-row' | 'flex-row-reverse' | 'flex-col' | 'flex-col-reverse';

/**
 * Type for gap values using Tailwind CSS gap classes
 */
type StackGap
  = | 'gap-0'
    | 'gap-1'
    | 'gap-2'
    | 'gap-3'
    | 'gap-4'
    | 'gap-5'
    | 'gap-6'
    | 'gap-7'
    | 'gap-8'
    | 'gap-9'
    | 'gap-10'
    | 'gap-11'
    | 'gap-12';

/**
 * Type for justify-content values
 */
type StackJustify
  = | 'justify-start'
    | 'justify-end'
    | 'justify-center'
    | 'justify-between'
    | 'justify-around'
    | 'justify-evenly';

/**
 * Type for align-items values
 */
type StackAlignItems = 'items-start' | 'items-end' | 'items-center' | 'items-baseline' | 'items-stretch';

/**
 * Type for flex-wrap values
 */
type StackWrap = 'flex-wrap' | 'flex-nowrap' | 'flex-wrap-reverse';

/**
 * Props for the Stack component.
 *
 * @interface StackProps
 * @extends React.HTMLAttributes<HTMLDivElement>
 *
 * @property {StackDirection} [direction='flex-col'] - The flex direction of the stack
 * @property {StackGap} [gap='gap-1'] - The gap between stack items using Tailwind CSS gap classes
 * @property {StackJustify} [justify='justify-start'] - The justify-content property for the flex container
 * @property {StackAlignItems} [alignItems='items-start'] - The align-items property for the flex container
 * @property {StackWrap} [wrap='flex-nowrap'] - The flex-wrap property for the flex container
 */
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  gap?: StackGap;
  justify?: StackJustify;
  alignItems?: StackAlignItems;
  wrap?: StackWrap;
}

/**
 * A flexible layout component that creates a flex container with customizable direction, gap, alignment, and wrapping.
 *
 * @param {StackDirection} [direction='flex-col'] - The flex direction of the stack
 * @param {StackGap} [gap='gap-1'] - The gap between stack items
 * @param {StackJustify} [justify='justify-start'] - The justify-content property
 * @param {StackAlignItems} [alignItems='items-start'] - The align-items property
 * @param {StackWrap} [wrap='flex-nowrap'] - The flex-wrap property
 * @param {string} [className] - Additional CSS classes to apply
 * @param {React.ReactNode} children - The child elements to render inside the stack
 * @param {React.HTMLAttributes<HTMLDivElement>} props - All other HTML div attributes
 * @returns {JSX.Element} A div element configured as a flex container
 *
 * @example
 * ```tsx
 * // Basic vertical stack
 * <Stack>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Stack>
 *
 * // Horizontal stack with custom gap and center alignment
 * <Stack direction="flex-row" gap="gap-4" alignItems="items-center">
 *   <button>Button 1</button>
 *   <button>Button 2</button>
 * </Stack>
 *
 * // Stack with all HTML div attributes
 * <Stack
 *   id="my-stack"
 *   className="custom-class"
 *   onClick={() => console.log('clicked')}
 *   data-testid="stack-component"
 * >
 *   <p>Content</p>
 * </Stack>
 * ```
 */
export const Stack = ({
  children,
  direction = 'flex-col',
  className,
  gap = 'gap-1',
  justify = 'justify-start',
  alignItems = 'items-start',
  wrap = 'flex-nowrap',
  ...props
}: StackProps) => {
  return (
    <div className={cn('flex', direction, justify, alignItems, gap, wrap, className)} {...props}>
      {children}
    </div>
  );
};
