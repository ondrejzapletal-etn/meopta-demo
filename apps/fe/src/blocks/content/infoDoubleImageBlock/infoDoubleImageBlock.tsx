'use client';

import { InfoDoubleImageBlock as InfoDoubleImageBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { RichTextRenderer } from '../../../components/richTextRenderer/richTextRenderer';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

export const InfoDoubleImageBlock = ({
  title,
  description,
  imageLeft,
  imageRight,
  linkLabel,
  linkUrl,
  secondaryLinkLabel,
  secondaryLinkUrl,
}: InfoDoubleImageBlockType) => {
  const hasImages = imageLeft || imageRight;
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="w-full bg-meopta-bg-light">
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
          {/* Two phone images - left side */}
          {hasImages && (
            <div className="flex flex-shrink-0 items-end gap-4 lg:gap-6">
              {imageLeft && (
                <div className="relative h-[280px] w-[140px] md:h-[360px] md:w-[170px] lg:h-[440px] lg:w-[210px]">
                  <Image
                    src={getImageSrcWithFallback(imageLeft)}
                    alt={title ? `${title} - left` : 'Screenshot left'}
                    fill
                    className="rounded-2xl object-contain"
                  />
                </div>
              )}

              {imageRight && (
                <div className="relative h-[320px] w-[140px] md:h-[400px] md:w-[170px] lg:h-[480px] lg:w-[210px]">
                  <Image
                    src={getImageSrcWithFallback(imageRight)}
                    alt={title ? `${title} - right` : 'Screenshot right'}
                    fill
                    className="rounded-2xl object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {/* Text content - right side */}
          <div className="flex-1">
            {title && (
              <Typography variant="h2" className="mb-4 text-meopta-text-primary">
                {title}
              </Typography>
            )}

            {description && (
              <div className="mb-6 text-meopta-text-secondary">
                <RichTextRenderer content={description as Record<string, unknown>} />
              </div>
            )}

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
          </div>
        </div>
      </Container>
    </div>
  );
};
