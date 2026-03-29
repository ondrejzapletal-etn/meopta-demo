'use client';
/* eslint-disable better-tailwindcss/no-unregistered-classes */

import { RichTextBlock as RichTextBlockType } from '@repo/shared/payload-types';
import { Container } from '../../components/container/container';
import { RichTextRenderer } from '../../components/richTextRenderer/richTextRenderer';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { cn } from '../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path
      d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99"
      fillRule="evenodd"
    />
  </svg>
);

const btnClasses = {
  green: {
    primary: 'bg-white hover:bg-meopta-blue-hover',
    outline: 'border border-meopta-blue-dark hover:bg-[#c6e87a]',
  },
  white: {
    primary: 'bg-meopta-blue hover:bg-meopta-blue-hover text-white',
    outline: 'border border-meopta-blue-dark hover:bg-meopta-blue-light',
  },
  lightGrey: {
    primary: 'bg-meopta-blue hover:bg-meopta-blue-hover text-white',
    outline: 'border border-meopta-blue-dark hover:bg-meopta-blue-light',
  },
} as const;

export const RichTextBlock = ({
  title,
  content,
  linkLabel,
  linkUrl,
  secondaryLinkLabel,
  secondaryLinkUrl,
  backgroundColor,
  variant,
}: RichTextBlockType) => {
  const { ref, isVisible } = useScrollAnimation();
  const isInfoBox = variant === 'info-box';
  const isCompact = variant === 'compact';
  const bg = (backgroundColor ?? 'white') as keyof typeof btnClasses;
  const bgClass = bg === 'green'
    ? 'bg-meopta-blue'
    : bg === 'lightGrey'
      ? 'bg-meopta-bg-light'
      : 'bg-white';
  const btn = btnClasses[bg] ?? btnClasses.white;

  if (isInfoBox) {
    return (
      <div className={cn('w-full', bgClass)}>
        <Container
          size="ab-content"
          className={cn(
            'pt-10 lg:pt-16',
            'pb-10 lg:pb-16',
          )}
        >
          <div
            ref={ref}

            className={cn(
              'rounded-2xl bg-white p-6 opacity-0 shadow-sm lg:p-10',
              isVisible && 'animate-fade-in-up',
              `
                [&_h3]:lg:text-28 [&_h3]:mb-4 [&_h3]:text-24 [&_h3]:font-bold
                [&_h3]:text-meopta-text-primary
              `,
              `
                [&_p]:mb-4 [&_p]:text-14 [&_p]:leading-relaxed
                [&_p]:text-meopta-text-secondary [&_p]:lg:text-15
              `,
              'list-check-icon',
              `
                [&_ul_li]:text-14 [&_ul_li]:text-meopta-text-secondary
                [&_ul_li]:lg:text-15
              `,
            )}
          >
            <RichTextRenderer content={content as Record<string, unknown>} className="max-w-none" />
          </div>
        </Container>
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className={cn('w-full', bgClass)}>
        <Container
          size="ab-content"
          className={cn(
            'pt-10 lg:pt-16',
            'pb-10 lg:pb-16',
          )}
        >
          <div
            ref={ref}
            className={cn(
              'mx-auto max-w-3xl text-center opacity-0',
              isVisible && 'animate-fade-in-up',
            )}
          >
            {title && (
              <h2 className="mb-4 text-24 font-medium leading-[1.33] text-meopta-text-primary lg:text-[32px]">
                {title}
              </h2>
            )}
            <div className="text-meopta-text-secondary">
              <RichTextRenderer content={content as Record<string, unknown>} className="max-w-none" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={cn('w-full', bgClass)}>
      <Container
        size="ab-content"
        className={cn(
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-20',
        )}
      >
        <div
          ref={ref}
          className={cn(
            'opacity-0',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {title && (
            <h2 className="mb-6 text-24 font-medium leading-[1.33] text-meopta-text-primary lg:text-[32px]">
              {title}
            </h2>
          )}
          <div className="text-meopta-text-secondary">
            <RichTextRenderer content={content as Record<string, unknown>} className="max-w-none" />
          </div>

          {(linkLabel || secondaryLinkLabel) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {linkLabel && linkUrl && (
                <a
                  href={linkUrl}
                  className={cn(
                    `
                      inline-flex h-14 items-center rounded-full px-6
                      text-[0.875rem] font-medium text-meopta-text-primary
                      no-underline transition-colors
                    `,
                    btn.primary,
                  )}
                >
                  {linkLabel}
                  <ArrowRight />
                </a>
              )}
              {secondaryLinkLabel && secondaryLinkUrl && (
                <a
                  href={secondaryLinkUrl}
                  className={cn(
                    `
                      inline-flex h-14 items-center rounded-full px-6
                      text-[0.875rem] font-medium text-meopta-text-primary
                      no-underline transition-colors
                    `,
                    btn.outline,
                  )}
                >
                  {secondaryLinkLabel}
                  <ArrowRight />
                </a>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
