'use client';

import { BenefitsWithImageBlock as BenefitsWithImageBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const columnClasses: Record<string, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

const staggerDelays = [
  '',
  'animation-delay-100',
  'animation-delay-200',
  'animation-delay-300',
];

export const BenefitsWithImageBlock = ({
  title,
  description,
  columns,
  items,
}: BenefitsWithImageBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) return null;

  const cols = columns ?? '3';

  return (
    <div className="w-full bg-white">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-8 lg:pt-14',
          'pb-8 lg:pb-14',
        )}
      >
        {(title || description) && (
          <div
            ref={ref}
            className={cn(
              'mb-6 text-center opacity-0 lg:mb-8',
              isVisible && 'animate-fade-in-up',
            )}
          >
            {title && (
              <Typography variant="h3" className="text-meopta-text-primary">
                {title}
              </Typography>
            )}
            {description && (
              <p className="mt-2 text-16 text-meopta-text-secondary lg:text-18">
                {description}
              </p>
            )}
          </div>
        )}

        <div className={cn('grid grid-cols-1 gap-8 lg:gap-10', columnClasses[cols])}>
          {items.map((item, i) => {
            const imgSrc = getImageSrcWithFallback(item.image, {
              width: 400,
              height: 260,
            });

            return (
              <div
                key={item.id ?? i}
                className={cn(
                  'text-center opacity-0',
                  isVisible && 'animate-fade-in-up',
                  isVisible && staggerDelays[i % staggerDelays.length],
                )}
              >
                {imgSrc && (
                  <div className="relative mx-auto mb-3 aspect-[1/2] w-[140px] overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={item.title ?? ''}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                {item.title && (
                  <Typography variant="h5" className="mb-2 text-meopta-text-primary">
                    {item.title}
                  </Typography>
                )}

                {item.description && (
                  <p className="text-14 text-meopta-text-secondary lg:text-16">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
