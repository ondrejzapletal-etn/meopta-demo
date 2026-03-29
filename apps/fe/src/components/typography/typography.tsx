import React from 'react';
import { cn } from '../../utils/styles';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'perex' | 'body1' | 'body2' | 'subtitle' | 'caption' | 'label';

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'div' | 'ul' | 'ol' | 'label';

type TypographyWeight = 'font-regular' | 'font-medium' | 'font-semibold' | 'font-bold';

export interface TypographyProps {
  variant: TypographyVariant;
  as?: TypographyElement;
  children: React.ReactNode;
  className?: string;
  weight?: TypographyWeight;
}

const variantTags: Record<string, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  body1: 'p',
  body2: 'p',
  perex: 'p',
  subtitle: 'p',
  caption: 'span',
  label: 'label',
  span: 'span',
  p: 'p',
};

export const Typography = ({ variant, children, className, weight, as, ...props }: TypographyProps) => {
  const Component = as ?? (variantTags[variant] as keyof React.JSX.IntrinsicElements);

  const variantClasses: Record<string, string> = {
    h1: 'text-36 lg:text-64 tracking-wide font-bold',
    h2: 'text-26 lg:text-48 tracking-wide font-bold',
    h3: 'text-20 lg:text-36 tracking-wide font-bold',
    h4: 'text-18 lg:text-24 font-bold',
    h5: 'text-16 lg:text-20 font-bold',
    perex: 'text-16 lg:text-30 font-medium',
    body1: 'text-16 lg:text-20 font-medium',
    body2: 'text-14 lg:text-16 font-regular',
    subtitle: 'text-14 lg:text-18 font-semibold',
    caption: 'text-12 lg:text-14 font-regular',
    label: 'text-14 lg:text-16 font-semibold',
  };

  return (
    <Component className={cn('typo', variantClasses[variant], className, weight)} {...props}>
      {children}
    </Component>
  );
};
