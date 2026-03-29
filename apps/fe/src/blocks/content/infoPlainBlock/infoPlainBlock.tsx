'use client';

import { InfoPlainBlock as InfoPlainBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { RichTextRenderer } from '../../../components/richTextRenderer/richTextRenderer';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path
      d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99"
      fillRule="evenodd"
    />
  </svg>
);

const bgClasses: Record<string, string> = {
  green: 'bg-meopta-blue-dark',
  white: 'bg-white',
  lightGrey: 'bg-meopta-bg-light',
};

const titleClasses: Record<string, string> = {
  green: 'text-white',
  white: 'text-meopta-text-primary',
  lightGrey: 'text-meopta-text-primary',
};

const textClasses: Record<string, string> = {
  green: 'text-white/90',
  white: '',
  lightGrey: '',
};

const btnClasses: Record<string, string> = {
  green: 'bg-white text-meopta-blue-dark hover:bg-meopta-bg-light',
  white: 'bg-meopta-blue text-white hover:bg-meopta-blue-hover',
  lightGrey: 'bg-meopta-blue text-white hover:bg-meopta-blue-hover',
};

const secondaryBtnClasses: Record<string, string> = {
  green: 'border-2 border-white/60 text-white hover:bg-white/10',
  white: 'border border-meopta-blue-dark px-6 text-meopta-blue-dark hover:bg-meopta-blue/5',
  lightGrey: 'border border-meopta-blue-dark px-6 text-meopta-blue-dark hover:bg-meopta-blue/5',
};

export const InfoPlainBlock = ({
  title,
  content,
  linkLabel,
  linkUrl,
  secondaryLinkLabel,
  secondaryLinkUrl,
  backgroundColor,
}: InfoPlainBlockType) => {
  const bg = backgroundColor ?? 'white';
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className={cn('w-full', bgClasses[bg])}>
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
            <Typography variant="h2" className={cn('mb-6', titleClasses[bg])}>
              {title}
            </Typography>
          )}

          <div className={textClasses[bg]}>
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
                      text-[0.875rem] font-medium no-underline transition-colors
                    `,
                    btnClasses[bg],
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
                      text-[0.875rem] font-medium no-underline transition-colors
                    `,
                    secondaryBtnClasses[bg],
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
