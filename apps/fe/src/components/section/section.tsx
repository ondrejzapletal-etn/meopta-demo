import { cn } from '../../utils/styles';
import React from 'react';

type BackgroundColor = 'white' | 'green' | 'lightGreen' | 'lightGrey';

type SectionProps<T extends React.ElementType> = {
  as?: T;
  testId?: string;
  backgroundColor?: BackgroundColor;
} & React.ComponentPropsWithoutRef<T>;

const bgColorClasses: Record<BackgroundColor, string> = {
  white: 'bg-white',
  green: 'bg-meopta-blue',
  lightGreen: 'bg-meopta-blue-light',
  lightGrey: 'bg-meopta-bg-light',
};

export const Section = <T extends React.ElementType>({
  as,
  children,
  className,
  testId,
  backgroundColor,
  ...props
}: SectionProps<T>) => {
  const Component = as ?? 'section';

  return (
    <Component
      className={cn(
        backgroundColor && bgColorClasses[backgroundColor],
        className,
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};
