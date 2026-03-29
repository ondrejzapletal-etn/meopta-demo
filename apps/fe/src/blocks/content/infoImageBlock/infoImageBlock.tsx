'use client';

import { InfoImageBlock as InfoImageBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { RichTextRenderer } from '../../../components/richTextRenderer/richTextRenderer';
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

export const InfoImageBlock = ({
  title,
  description,
  image,
  imagePosition,
  linkLabel,
  linkUrl,
  secondaryLinkLabel,
  secondaryLinkUrl,
}: InfoImageBlockType) => {
  const position = imagePosition ?? 'right';
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="w-full bg-white">
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
            'flex flex-col items-center gap-0 opacity-0 lg:flex-row',
            position === 'left' && 'lg:flex-row-reverse',
            isVisible && 'animate-fade-in-up',
          )}
        >
          <div className="flex flex-1 flex-col items-start p-6 lg:p-12">
            {title && (
              <Typography variant="h2" className="mb-4 text-meopta-text-primary">
                {title}
              </Typography>
            )}

            {description && (
              <div className="mb-6 max-w-xl text-meopta-text-secondary">
                <RichTextRenderer content={description as Record<string, unknown>} />
              </div>
            )}

            {(linkLabel || secondaryLinkLabel) && (
              <div className="flex flex-wrap gap-3">
                {linkLabel && linkUrl && (
                  <a
                    href={linkUrl}
                    className="inline-flex h-14 items-center rounded-full bg-meopta-blue px-6 text-[0.875rem] font-medium text-white no-underline transition-colors hover:bg-meopta-blue-hover"
                  >
                    {linkLabel}
                    <ArrowRight />
                  </a>
                )}
                {secondaryLinkLabel && secondaryLinkUrl && (
                  <a
                    href={secondaryLinkUrl}
                    className="inline-flex h-14 items-center rounded-full border border-meopta-blue-dark px-6 text-[0.875rem] font-medium text-meopta-blue-dark no-underline transition-colors hover:bg-meopta-blue/5"
                  >
                    {secondaryLinkLabel}
                    <ArrowRight />
                  </a>
                )}
              </div>
            )}
          </div>

          {image && (
            <div className="relative h-[280px] w-full flex-shrink-0 md:h-[340px] lg:h-[420px] lg:w-1/2">
              <Image
                src={getImageSrcWithFallback(image)}
                alt={title ?? ''}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
