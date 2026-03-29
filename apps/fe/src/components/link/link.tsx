import React from 'react';
import { useLocale } from 'next-intl';
import { Link } from '../../i18n/navigation';
import { cn } from '../../utils/styles';

/**
 * Props for the LinkCMS component.
 *
 * @interface LinkCMSProps
 * @property {React.ReactNode} children - The content to be rendered inside the link.
 * @property {string} [className] - Additional CSS classes to apply to the link.
 * @property {number} [tabIndex] - The tab index for keyboard navigation.
 * @property {boolean} [newTab] - Whether to open the link in a new tab/window.
 * @property {string} url - The URL to navigate to. If empty or invalid, defaults to '/'.
 * @property {() => void} [onClick] - Optional click handler function.
 */
interface LinkCMSProps {
  children: React.ReactNode;
  className?: string;
  tabIndex?: number;
  newTab?: boolean;
  url: string;
  onClick?: () => void;
}

/**
 * A localized link component that integrates with Next.js internationalization.
 *
 * This component wraps the Next.js Link component with additional features like
 * new tab support, click handlers, and automatic locale handling. It automatically
 * uses the current locale from the internationalization context.
 *
 * The component supports opening links in new tabs with proper security attributes
 * (noopener noreferrer) and provides keyboard navigation support through tabIndex.
 *
 * @param children - The content to render inside the link
 * @param className - Additional CSS classes to apply to the link
 * @param tabIndex - The tab index for keyboard navigation
 * @param newTab - Whether to open the link in a new tab/window (defaults to false)
 * @param url - The URL to navigate to (defaults to '/' if empty)
 * @param onClick - Optional click handler function
 *
 * @returns A localized Link component with the specified configuration
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LinkCMS url="/about">
 *   About Us
 * </LinkCMS>
 *
 * // With custom styling and new tab
 * <LinkCMS
 *   url="https://example.com"
 *   newTab
 *   className="text-blue-600 hover:text-blue-800"
 * >
 *   External Link
 * </LinkCMS>
 *
 * // With click handler and tab index
 * <LinkCMS
 *   url="/contact"
 *   onClick={() => console.log('Link clicked')}
 *   tabIndex={0}
 * >
 *   Contact Us
 * </LinkCMS>
 *
 * // With empty URL (defaults to '/')
 * <LinkCMS url="">
 *   Home
 * </LinkCMS>
 * ```
 */
export const LinkCMS = ({ children, className, tabIndex, newTab, url, onClick }: LinkCMSProps) => {
  const href = url ?? '/';
  const locale = useLocale();

  return (
    <Link
      href={href}
      className={cn(className)}
      rel={newTab ? 'noopener noreferrer' : undefined}
      target={newTab ? '_blank' : '_self'}
      tabIndex={tabIndex}
      onClick={onClick}
      locale={locale}
    >
      {children}
    </Link>
  );
};
