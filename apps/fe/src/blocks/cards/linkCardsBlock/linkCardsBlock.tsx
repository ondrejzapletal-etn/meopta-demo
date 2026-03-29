'use client';

import { LinkCardsBlock as LinkCardsBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const LinkCardsBlock = ({
  title,
  items,
}: LinkCardsBlockType) => {
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
            const hasLink = item.linkLabel && item.linkUrl;

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
                {imgSrc && (
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={item.title ?? ''}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5 lg:p-6">
                  {item.title && (
                    <Typography variant="h5" className="mb-2 text-meopta-text-primary">
                      {item.title}
                    </Typography>
                  )}

                  {item.description && (
                    <p className="mb-4 flex-1 text-14 leading-relaxed text-meopta-text-secondary lg:text-16">
                      {item.description}
                    </p>
                  )}

                  {hasLink && (
                    <a
                      href={item.linkUrl!}
                      className="mt-auto inline-flex items-center gap-1 text-14 font-semibold text-meopta-blue-dark no-underline transition-colors hover:text-meopta-blue-hover lg:text-16"
                    >
                      {item.linkLabel}
                      <svg viewBox="0 0 25 25" fill="currentColor" className="ml-1 inline-block h-5 w-5 flex-shrink-0" aria-hidden="true">
                        <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
                      </svg>
                    </a>
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
