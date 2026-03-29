'use client';

import { ProductCardHorizontalBlock as ProductCardHorizontalBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const staggerDelays = [
  '',
  'animation-delay-100',
  'animation-delay-200',
  'animation-delay-300',
];

export const ProductCardHorizontalBlock = ({
  title,
  items,
}: ProductCardHorizontalBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-white">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-16',
        )}
      >
        {title && (
          <Typography variant="h3" className="mb-8 text-meopta-text-primary lg:mb-12">
            {title}
          </Typography>
        )}

        <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {items.map((item, i) => {
            const imgSrc = getImageSrcWithFallback(item.image, {
              width: 400,
              height: 300,
            });
            const hasLink = item.linkLabel && item.linkUrl;

            return (
              <div
                key={item.id ?? i}
                className={cn(
                  `
                    group flex flex-col overflow-hidden rounded-2xl border
                    border-meopta-border bg-white opacity-0 transition-shadow
                    md:flex-row
                  `,
                  isVisible && 'animate-fade-in-up',
                  isVisible && staggerDelays[i % staggerDelays.length],
                )}
              >
                {imgSrc && (
                  <div
                    className={cn(
                      `
                        relative aspect-[4/3] w-full flex-shrink-0
                        overflow-hidden
                        md:aspect-auto md:w-[200px]
                        lg:w-[240px]
                      `,
                    )}
                  >
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
                    <p className="mb-4 flex-1 text-14 text-meopta-text-secondary lg:text-16">
                      {item.description}
                    </p>
                  )}

                  {hasLink && (
                    <a
                      href={item.linkUrl!}
                      className={cn(
                        `
                          mt-auto inline-flex items-center gap-1 text-14
                          font-semibold text-meopta-blue-dark no-underline
                          transition-colors
                          hover:text-meopta-blue-hover
                          lg:text-16
                        `,
                      )}
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
