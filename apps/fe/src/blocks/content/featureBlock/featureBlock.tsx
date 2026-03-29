'use client';

import { FeatureBlock as FeatureBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { RichTextRenderer } from '../../../components/richTextRenderer/richTextRenderer';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  lightGrey: 'bg-meopta-bg-light',
  green: 'bg-meopta-blue',
};

export const FeatureBlock = ({
  title,
  subtitle,
  description,
  image,
  imagePosition,
  backgroundColor,
  imageOverflow,
  links,
  layoutStyles,
}: FeatureBlockType & Record<string, unknown>) => {
  const bg = backgroundColor ?? 'white';
  const isGreen = bg === 'green';
  const isHighlighted = bg === 'green' || bg === 'lightGrey';
  const hasOverflow = !!imageOverflow;
  const isSmallImage = (layoutStyles as { variant?: string })?.variant === 'small-image';
  const position = imagePosition ?? 'right';
  const { ref, isVisible } = useScrollAnimation();

  const effectiveLinks: { label: string; url: string; appearance: string }[] = [];
  if (links && links.length > 0) {
    for (const link of links) {
      if (link.label && link.url) {
        effectiveLinks.push({ label: link.label, url: link.url, appearance: link.appearance ?? 'primary' });
      }
    }
  }

  return (
    <div className={cn('w-full', bgClasses[bg])}>
      <Container
        size="ab-content"
        className={cn(
          'relative',
          hasOverflow ? 'overflow-visible' : '',
          isHighlighted ? 'pt-4 lg:pt-6' : `pt-6 lg:pt-8`,
          isHighlighted ? `pb-4 lg:pb-6` : `pb-6 lg:pb-8`,
        )}
      >
        <div
          ref={ref}
          className={cn(
            'flex flex-col items-center gap-8 opacity-0 md:flex-row md:gap-12',
            position === 'left' && 'md:flex-row-reverse',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {/* Text content */}
          <div className={cn(
            'flex flex-col items-start',
            hasOverflow ? 'md:w-[55%]' : isSmallImage ? 'md:w-3/5' : 'md:w-2/5',
          )}
          >
            {title && (
              <h2 className="mb-4 text-24 font-medium leading-[1.33] text-meopta-text-primary lg:text-[32px]">
                {title}
              </h2>
            )}

            {subtitle && (
              <h3 className="mb-4 text-20 font-light leading-[1.4] text-meopta-text-primary lg:text-[28px]">
                {subtitle}
              </h3>
            )}

            {description && (
              <div className={cn('mb-6 text-meopta-text-secondary', !isSmallImage && `
                max-w-xl
              `)}
              >
                <RichTextRenderer content={description as Record<string, unknown>} />
              </div>
            )}

            {effectiveLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {effectiveLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className={cn(
                      `
                        inline-flex h-14 items-center rounded-full px-6
                        text-[0.875rem] font-medium no-underline
                        transition-colors
                      `,
                      link.appearance === 'outline'
                        ? `
                          border border-meopta-blue-dark text-meopta-text-primary
                          hover:bg-meopta-blue-light
                        `
                        : isGreen
                          ? `
                            bg-white text-meopta-text-primary
                            hover:bg-meopta-blue-hover
                          `
                          : `
                            bg-meopta-blue text-meopta-text-primary
                            hover:bg-meopta-blue-hover
                          `,
                    )}
                  >
                    {link.label}
                    <ArrowRight />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          {image && (
            <div className={cn(
              'relative w-full flex-shrink-0',
              hasOverflow
                ? 'md:w-[40%] md:self-center'
                : isSmallImage
                  ? `
                    md:max-h-[620px] md:w-2/5 md:self-center md:overflow-hidden
                  `
                  : `
                    md:max-h-[620px] md:w-3/5 md:self-center md:overflow-hidden
                  `,
            )}
            >
              {hasOverflow
                ? (
                    // Overflow variant: image overflows above and below (for phone mockups)
                    <div className="relative md:-my-20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageSrcWithFallback(image)}
                        alt={title ?? ''}
                        className="mx-auto h-auto w-full max-w-[344px]"
                      />
                    </div>
                  )
                : (
                    // Default variant: natural image size, not stretched
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageSrcWithFallback(image)}
                      alt={title ?? ''}
                      className="mx-auto h-auto max-w-full"
                    />
                  )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
