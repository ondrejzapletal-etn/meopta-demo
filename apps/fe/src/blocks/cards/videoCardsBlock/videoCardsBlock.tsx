'use client';

import { VideoCardsBlock as VideoCardsBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const VideoCardsBlock = ({
  title,
  items,
}: VideoCardsBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) return null;

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
        {title && (
          <Typography variant="h2" className="mb-8 text-meopta-text-primary lg:mb-12">
            {title}
          </Typography>
        )}

        <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item, i) => {
            const imgSrc = getImageSrcWithFallback(item.image, { width: 400, height: 260 });

            return (
              <div
                key={item.id ?? i}
                className={cn(
                  `
                    group flex flex-col overflow-hidden rounded-2xl border
                    border-meopta-border bg-white opacity-0 transition-shadow
                    hover:shadow-lg
                  `,
                  isVisible && 'animate-fade-in-up',
                )}
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  {imgSrc && (
                    <Image
                      src={imgSrc}
                      alt={item.title ?? ''}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {item.videoUrl && (
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
                      aria-label={`Play video: ${item.title}`}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-1 text-meopta-blue-dark" aria-hidden="true">
                          <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                        </svg>
                      </div>
                    </a>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 lg:p-6">
                  {item.title && (
                    <Typography variant="h5" className="mb-2 text-meopta-text-primary">
                      {item.title}
                    </Typography>
                  )}

                  {item.description && (
                    <p className="flex-1 text-14 leading-relaxed text-meopta-text-secondary lg:text-16">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
