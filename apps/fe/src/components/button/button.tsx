import { cn } from '../../utils/styles';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ab-primary' | 'ab-secondary' | 'ab-link';
  asChild?: boolean;
}

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => {
  const Component = 'button';
  const buttonVariantsClasses = {
    primary: 'bg-white text-black hover:bg-light-grey focus:ring-black active:border-black disabled:border-black',
    secondary:
      'bg-black text-white hover:bg-grey focus:ring-white active:border-white disabled:border-white disabled:!bg-grey',
    'ab-primary':
      'bg-meopta-blue text-white hover:bg-meopta-blue-hover focus:ring-meopta-blue active:bg-meopta-blue-dark rounded-full',
    'ab-secondary':
      'bg-transparent text-meopta-blue border-2 border-meopta-blue hover:bg-meopta-blue-light focus:ring-meopta-blue rounded-full',
    'ab-link':
      'bg-transparent text-meopta-blue-dark hover:text-meopta-blue-hover px-0 py-0 h-auto font-semibold',
  };

  const isABLink = variant === 'ab-link';

  return (
    <Component
      className={cn(
        !isABLink && `
          inline-flex h-[61px] cursor-pointer items-center gap-4 px-8 py-4
          text-20 leading-none font-bold whitespace-nowrap transition-colors
          duration-300
          focus:ring-2 focus:outline-none
          focus-visible:ring-2 focus-visible:ring-grey
          focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:cursor-not-allowed
          disabled:border-1 disabled:bg-transparent
          [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0
        `,
        isABLink && `
          inline-flex cursor-pointer items-center gap-2 text-16 font-semibold
          no-underline transition-colors duration-300
        `,
        !isABLink && !variant.startsWith('ab-') && 'rounded-md uppercase',
        buttonVariantsClasses[variant],
        className,
      )}
      {...props}
    />
  );
};
