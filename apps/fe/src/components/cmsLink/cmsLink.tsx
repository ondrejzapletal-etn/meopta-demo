import React from 'react';
import { cn } from '../../utils/styles';
import { LinkCMS } from '../link/link';
import { Button } from '../button/button';

interface CmsLinkProps {
  link?: {
    type?: 'reference' | 'custom' | null;
    newTab?: boolean | null;
    reference?: {
      relationTo: string;
      value: string | { slug?: string };
    } | null;
    url?: string | null;
    label?: string | null;
    appearance?: 'default' | 'primary' | 'outline' | 'link' | null;
  } | null;
  className?: string;
  children?: React.ReactNode;
}

function getLinkUrl(link: CmsLinkProps['link']): string {
  if (!link) return '/';
  if (link.type === 'custom' && link.url) return link.url;
  if (link.type === 'reference' && link.reference?.value) {
    const ref = link.reference.value;
    if (typeof ref === 'string') return `/${ref}`;
    return `/${ref.slug ?? ''}`;
  }
  return '/';
}

const appearanceToVariant: Record<string, 'ab-primary' | 'ab-secondary' | 'ab-link'> = {
  default: 'ab-primary',
  primary: 'ab-primary',
  outline: 'ab-secondary',
  link: 'ab-link',
};

export const CmsLink = ({ link, className, children }: CmsLinkProps) => {
  if (!link) return null;

  const url = getLinkUrl(link);
  const label = children ?? link.label;
  const appearance = link.appearance ?? 'default';

  if (appearance === 'link') {
    return (
      <LinkCMS
        url={url}
        newTab={link.newTab ?? false}
        className={cn(`
          inline-flex items-center gap-1 font-semibold text-meopta-blue-dark
          no-underline
          hover:text-meopta-blue-hover
        `, className)}
      >
        {label}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </LinkCMS>
    );
  }

  return (
    <LinkCMS
      url={url}
      newTab={link.newTab ?? false}
      className={cn(`no-underline`, className)}
    >
      <Button variant={appearanceToVariant[appearance]} className="pointer-events-none">
        {label}
      </Button>
    </LinkCMS>
  );
};
