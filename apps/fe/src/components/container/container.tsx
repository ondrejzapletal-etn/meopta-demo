import React from 'react';
import { cn } from '../../utils/styles';

type ContainerSize = 'large' | 'medium' | 'small' | 'full' | 'ab-content';

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  size?: ContainerSize;
} & React.ComponentPropsWithoutRef<T>;

export const Container = <T extends React.ElementType>({ as, children, className, size = 'large', id }: ContainerProps<T>) => {
  const Component = as ?? 'div';
  const containerTypesClasses: Record<ContainerSize, string> = {
    small: 'lg:max-w-small',
    medium: 'lg:max-w-medium',
    large: 'lg:max-w-large',
    full: 'w-full',
    'ab-content': 'lg:max-w-ab-content',
  };

  return (
    <Component
      className={cn(`mx-auto px-4 md:px-12`, containerTypesClasses[size], className)}
      id={id}
    >
      {children}
    </Component>
  );
};
