'use client';

import { useState } from 'react';
import { DiscountsBlock as DiscountsBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const DiscountsBlock = ({
  title,
  itemsPerPage,
  items,
}: DiscountsBlockType) => {
  const perPage = itemsPerPage ?? 6;
  const [visibleCount, setVisibleCount] = useState(perPage);
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) return null;

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + perPage, items.length));
  };

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

        <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {visibleItems.map((item, i) => {
            const imgSrc = getImageSrcWithFallback(item.image, {
              width: 400,
              height: 260,
            });

            const Wrapper = item.linkUrl ? 'a' : 'div';
            const wrapperProps = item.linkUrl
              ? { href: item.linkUrl, className: 'no-underline' }
              : {};

            return (
              <Wrapper
                key={item.id ?? i}
                {...wrapperProps}
                className={cn(
                  `
                    group relative flex flex-col overflow-hidden rounded-2xl
                    border border-meopta-border bg-white opacity-0
                  `,
                  'transition-shadow duration-200 hover:shadow-lg',
                  item.linkUrl && 'no-underline',
                  isVisible && 'animate-fade-in-up',
                )}
              >
                {/* Card image */}
                {imgSrc && (
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={item.title ?? ''}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Discount badge */}
                    {item.discount && (
                      <span
                        className={cn(
                          `
                            absolute top-3 right-3 inline-flex items-center
                            rounded-full bg-meopta-blue px-3 py-1
                          `,
                          'text-12 font-bold text-white shadow-sm lg:text-14',
                        )}
                      >
                        {item.discount}
                      </span>
                    )}
                  </div>
                )}

                {/* Discount badge fallback when no image */}
                {!imgSrc && item.discount && (
                  <div className="flex justify-end px-5 pt-5">
                    <span
                      className={cn(
                        `
                          inline-flex items-center rounded-full bg-meopta-blue px-3
                          py-1
                        `,
                        'text-12 font-bold text-white lg:text-14',
                      )}
                    >
                      {item.discount}
                    </span>
                  </div>
                )}

                {/* Card body */}
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
              </Wrapper>
            );
          })}
        </div>

        {/* Load more button */}
        {hasMore && (
          <div className="mt-8 flex justify-center lg:mt-12">
            <button
              type="button"
              onClick={handleLoadMore}
              className={cn(
                `
                  inline-flex items-center rounded-full border
                  border-meopta-blue-dark px-8 py-3
                `,
                'text-16 font-bold text-meopta-blue-dark',
                'transition-colors hover:bg-meopta-blue hover:text-white',
              )}
            >
              Nacist dalsi
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};
