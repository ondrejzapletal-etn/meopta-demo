'use client';

import { CallbackBlock as CallbackBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

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

const descriptionClasses: Record<string, string> = {
  green: 'text-white/90',
  white: 'text-meopta-text-secondary',
  lightGrey: 'text-meopta-text-secondary',
};

const btnClasses: Record<string, string> = {
  green: 'bg-white text-meopta-blue-dark hover:bg-meopta-bg-light',
  white: 'bg-meopta-blue text-white hover:bg-meopta-blue-hover',
  lightGrey: 'bg-meopta-blue text-white hover:bg-meopta-blue-hover',
};

const secondaryBtnClasses: Record<string, string> = {
  green: 'border-2 border-white/60 text-white hover:bg-white/10',
  white: 'border border-meopta-blue-dark text-meopta-blue-dark hover:bg-meopta-blue/5',
  lightGrey: 'border border-meopta-blue-dark text-meopta-blue-dark hover:bg-meopta-blue/5',
};

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 25 25"
    fill="currentColor"
    className="ml-2 h-5 w-5 shrink-0"
  >
    <path
      d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99"
      fillRule="evenodd"
    />
  </svg>
);

export const CallbackBlock = ({
  title,
  description,
  image,
  linkLabel,
  linkUrl,
  secondaryLinkLabel,
  secondaryLinkUrl,
  backgroundColor,
}: CallbackBlockType) => {
  const bg = backgroundColor ?? 'green';
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="w-full">
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
            'relative overflow-hidden rounded-2xl opacity-0 lg:rounded-3xl',
            bgClasses[bg],
            isVisible && 'animate-fade-in-up',
          )}
        >
          <div className="flex flex-col items-center lg:flex-row">
            {/* Image - left side */}
            {image && (
              <div className="relative h-[220px] w-full flex-shrink-0 md:h-[260px] lg:h-[320px] lg:w-[40%]">
                <Image
                  src={getImageSrcWithFallback(image)}
                  alt={title ?? ''}
                  fill
                  className="object-contain object-center lg:object-left"
                />
              </div>
            )}

            {/* Text content - right side */}
            <div className="flex flex-1 flex-col items-start p-8 lg:p-12 xl:p-16">
              {title && (
                <Typography variant="h2" className={cn('mb-4', titleClasses[bg])}>
                  {title}
                </Typography>
              )}

              {description && (
                <p
                  className={cn(
                    'mb-6 text-16 leading-relaxed lg:text-18',
                    descriptionClasses[bg],
                  )}
                >
                  {description}
                </p>
              )}

              {(linkLabel && linkUrl) || (secondaryLinkLabel && secondaryLinkUrl)
                ? (
                    <div className="flex flex-wrap gap-3">
                      {linkLabel && linkUrl && (
                        <a
                          href={linkUrl}
                          className={cn(
                            `
                              inline-flex h-14 items-center rounded-full px-6
                              text-[0.875rem] font-medium no-underline
                              transition-colors
                            `,
                            btnClasses[bg],
                          )}
                        >
                          {linkLabel}
                          <ArrowRightIcon />
                        </a>
                      )}
                      {secondaryLinkLabel && secondaryLinkUrl && (
                        <a
                          href={secondaryLinkUrl}
                          className={cn(
                            `
                              inline-flex h-14 items-center rounded-full px-6
                              text-[0.875rem] font-medium no-underline
                              transition-colors
                            `,
                            secondaryBtnClasses[bg],
                          )}
                        >
                          {secondaryLinkLabel}
                          <ArrowRightIcon />
                        </a>
                      )}
                    </div>
                  )
                : null}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
