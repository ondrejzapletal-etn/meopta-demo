'use client';

import { JumbotronBlock as JumbotronBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-6 w-6 shrink-0">
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

const descClasses: Record<string, string> = {
  green: 'text-white/90',
  white: 'text-meopta-text-secondary',
  lightGrey: 'text-meopta-text-secondary',
};

const primaryBtnClasses: Record<string, string> = {
  green: 'bg-white text-meopta-text-primary hover:bg-meopta-bg-light',
  white: 'bg-meopta-blue text-white hover:bg-meopta-blue-hover',
  lightGrey: 'bg-meopta-blue text-white hover:bg-meopta-blue-hover',
};

const secondaryBtnClasses: Record<string, string> = {
  green: 'border-2 border-white text-white hover:bg-white/10',
  white: 'border border-meopta-blue-dark text-meopta-blue-dark hover:bg-meopta-blue/5',
  lightGrey: 'border border-meopta-blue-dark text-meopta-blue-dark hover:bg-meopta-blue/5',
};

export const JumbotronBlock = ({
  title,
  description,
  image,
  linkLabel,
  linkUrl,
  secondaryLinkLabel,
  secondaryLinkUrl,
  backgroundColor,
}: JumbotronBlockType) => {
  const bg = backgroundColor ?? 'green';
  const { ref, isVisible } = useScrollAnimation();
  const imgSrc = image ? getImageSrcWithFallback(image) : null;

  return (
    <div className={cn('w-full', bgClasses[bg])}>
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-20',
        )}
      >
        <div
          ref={ref}
          className={cn(
            'flex flex-col items-center gap-8 opacity-0 lg:flex-row lg:gap-12',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {/* Image — left side on desktop */}
          {imgSrc && (
            <div className="relative h-[300px] w-[210px] flex-shrink-0 md:h-[360px] md:w-[240px] lg:h-[420px] lg:w-[280px]">
              <Image
                src={imgSrc}
                alt={title ?? ''}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Text content — right side on desktop */}
          <div className={cn('flex flex-1 flex-col', imgSrc
            ? 'items-start'
            : `items-center text-center`)}
          >
            {title && (
              <Typography variant="h1" className={cn('mb-4', titleClasses[bg])}>
                {title}
              </Typography>
            )}

            {description && (
              <p className={cn(`
                mb-8 text-18 leading-relaxed font-light
                lg:text-24
              `, descClasses[bg])}
              >
                {description}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              {linkLabel && linkUrl && (
                <a
                  href={linkUrl}
                  className={cn(
                    `
                      inline-flex h-14 items-center rounded-full px-6
                      text-[0.875rem] font-medium no-underline transition-colors
                    `,
                    primaryBtnClasses[bg],
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
          </div>
        </div>
      </Container>
    </div>
  );
};
