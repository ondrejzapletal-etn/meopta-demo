'use client';

import { BenefitsBlock as BenefitsBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { RichTextRenderer } from '../../../components/richTextRenderer/richTextRenderer';
import { cn } from '../../../utils/styles';

const itemWidthClasses: Record<string, string> = {
  2: 'md:w-[calc(50%-16px)]',
  3: 'md:w-[calc(50%-16px)] lg:w-[calc(33.333%-27px)]',
  4: 'md:w-[calc(50%-16px)] lg:w-[calc(25%-30px)]',
};

export const BenefitsBlock = ({
  title,
  description,
  columns,
  items,
}: BenefitsBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) return null;

  const cols = columns ?? '3';

  return (
    <div className="w-full bg-white">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-8 lg:pt-12',
          'pb-8 lg:pb-12',
        )}
      >
        <div
          ref={ref}
          className={cn('opacity-0', isVisible && 'animate-fade-in-up')}
        >
          {(title || description) && (
            <div className="mb-6 text-center lg:mb-8">
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

          <div className="flex flex-col gap-8 px-8 md:flex-row md:flex-wrap md:justify-center md:px-0 lg:gap-10">
            {items.map((item, i) => (
              <div
                key={item.id ?? i}
                className={cn(`
                  flex flex-row items-center gap-4 text-left
                  md:flex-col md:items-center md:gap-0 md:text-center
                `, itemWidthClasses[cols])}
              >
                <div className="flex flex-shrink-0 items-end justify-center md:pb-3">
                  {item.icon && typeof item.icon === 'object' && (
                    <div className="relative h-12 w-12 lg:h-[72px] lg:w-[72px]">
                      <Image
                        src={getImageSrcWithFallback(item.icon)}
                        alt={item.title ?? ''}
                        width={72}
                        height={72}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="md:contents">
                  {item.title && (
                    <Typography variant="h5" className="mb-1 text-meopta-text-primary md:mb-2">
                      {item.title}
                    </Typography>
                  )}

                  {item.description && (
                    <div className="text-13 text-meopta-text-secondary lg:text-14 [&_a]:text-meopta-text-secondary [&_a]:underline hover:[&_a]:no-underline">
                      <RichTextRenderer content={item.description} />
                    </div>
                  )}

                  {item.linkLabel && item.linkUrl && (
                    <a
                      href={item.linkUrl}
                      className="mt-2 inline-flex items-center text-14 font-medium text-meopta-text-secondary hover:underline"
                    >
                      {item.linkLabel}
                      <svg viewBox="0 0 25 25" fill="currentColor" className="ml-1 h-4 w-4">
                        <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};
