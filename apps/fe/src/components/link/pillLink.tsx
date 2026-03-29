import React from 'react';
import { cn } from '../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

interface PillLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'dark' | 'green-outline';
  className?: string;
}

/**
 * Pill-shaped link matching airbank.cz style.
 *
 * - `dark`: black text, green border (default — used for standalone section links)
 * - `green-outline`: green text, green border (legacy / alternative)
 */
export const PillLink = ({ href, children, variant = 'dark', className }: PillLinkProps) => (
  <a
    href={href}
    className={cn(
      `
        inline-flex h-14 items-center rounded-full border px-6 text-[0.875rem]
        font-medium tracking-[0.5px] no-underline transition-colors
      `,
      variant === 'dark'
        ? 'border-meopta-blue-dark text-meopta-text-primary hover:bg-meopta-blue-light'
        : 'border-meopta-blue-dark text-meopta-blue-dark hover:bg-meopta-blue-light',
      className,
    )}
  >
    {children}
    <ArrowRight />
  </a>
);
