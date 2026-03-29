'use client';

import { ImageBlock as ImageBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const ImageBlock = ({
  title,
  description,
  image,
  imagePosition,
  linkLabel,
  linkUrl,
}: ImageBlockType) => {
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
            'flex flex-col items-center gap-8 opacity-0 lg:flex-row lg:gap-12',
            position === 'left' && 'lg:flex-row-reverse',
            isVisible && 'animate-fade-in-up',
          )}
        >
          <div className="flex flex-1 flex-col items-start">
            {title && (
              <Typography variant="h2" className="mb-4 text-meopta-text-primary">
                {title}
              </Typography>
            )}

            {description && (
              <p className="mb-6 text-16 leading-relaxed text-meopta-text-secondary lg:text-18">
                {description}
              </p>
            )}

            {linkLabel && linkUrl && (
              <a
                href={linkUrl}
                className="inline-flex items-center gap-1 text-16 font-semibold text-meopta-blue-dark no-underline transition-colors hover:text-meopta-blue-hover"
              >
                {linkLabel}
                <svg viewBox="0 0 25 25" fill="currentColor" className="ml-1 inline-block h-5 w-5 flex-shrink-0" aria-hidden="true">
                  <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
                </svg>
              </a>
            )}
          </div>

          {image && (
            <div className="relative h-[260px] w-full flex-shrink-0 md:h-[320px] lg:h-[380px] lg:w-[480px]">
              <Image
                src={getImageSrcWithFallback(image)}
                alt={title ?? ''}
                fill
                className="rounded-xl object-contain"
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
