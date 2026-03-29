'use client';

import { JumbotronWithStickerBlock as JumbotronWithStickerBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
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

const btnClasses: Record<string, string> = {
  green: 'bg-white text-meopta-blue-dark hover:bg-meopta-bg-light',
  white: 'bg-meopta-blue text-white hover:bg-meopta-blue-hover',
  lightGrey: 'bg-meopta-blue text-white hover:bg-meopta-blue-hover',
};

export const JumbotronWithStickerBlock = ({
  title,
  description,
  image,
  stickerText,
  linkLabel,
  linkUrl,
  secondaryLinkLabel,
  secondaryLinkUrl,
  backgroundColor,
}: JumbotronWithStickerBlockType) => {
  const bg = backgroundColor ?? 'green';
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className={cn('relative w-full', bgClasses[bg])}>
      {/* Sticker badge - positioned absolutely in top-left */}
      {stickerText && (
        <div className="absolute top-4 left-6 z-10 -rotate-6 rounded-lg bg-meopta-blue-dark px-4 py-2 shadow-md lg:top-6 lg:left-10">
          <span className="text-14 font-bold italic text-white lg:text-16">
            {stickerText}
          </span>
        </div>
      )}

      <Container size="ab-content" className="py-12 lg:py-20">
        <div
          ref={ref}
          className={cn(
            'relative flex flex-col items-center gap-8 opacity-0 lg:flex-row',
            isVisible && 'animate-fade-in-up',
          )}
        >
          <div className="flex flex-1 flex-col items-start">
            {title && (
              <Typography variant="h2" className={cn('mb-4', titleClasses[bg])}>
                {title}
              </Typography>
            )}

            {description && (
              <p className={cn('mb-6 text-16 leading-relaxed lg:text-18', descClasses[bg])}>
                {description}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
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
                  className="inline-flex h-14 items-center rounded-full border-2 border-white/60 px-6 text-[0.875rem] font-medium text-white no-underline transition-colors hover:bg-white/10"
                >
                  {secondaryLinkLabel}
                  <ArrowRight />
                </a>
              )}
            </div>
          </div>

          {image && (
            <div className="relative h-[220px] w-full flex-shrink-0 md:h-[260px] lg:h-[320px] lg:w-[40%]">
              <Image
                src={getImageSrcWithFallback(image)}
                alt={title ?? ''}
                fill
                className="object-contain object-center lg:object-right"
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
