import React from 'react';
import { cn } from '../../utils/styles';

type CardVariant = 'default' | 'bordered' | 'green' | 'elevated';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white',
  bordered: 'bg-white border border-meopta-border',
  green: 'bg-meopta-blue text-white',
  elevated: 'bg-white shadow-lg',
};

export const Card = ({ variant = 'default', className, children, onClick }: CardProps) => {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      className={cn(
        'rounded-xl p-6 transition-shadow duration-300',
        onClick && 'cursor-pointer hover:shadow-lg',
        variantClasses[variant],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};
