'use client';

import { ContentCardsBlock as ContentCardsBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const TRUNCATE_LIMIT = 147;

const ArrowRight = () => (
  <svg
    viewBox="0 0 25 25"
    fill="currentColor"
    className="ml-1 inline-block h-5 w-5 flex-shrink-0 text-meopta-blue-dark transition-transform duration-200 group-hover/link:translate-x-1"
    aria-hidden="true"
  >
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + '\u2026';
}

const staggerDelays = [
  '',
  'animation-delay-100',
  'animation-delay-200',
  'animation-delay-300',
];

export const ContentCardsBlock = ({
  title,
  items,
}: ContentCardsBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) return null;

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
        {title && (
          <Typography variant="h3" className="mb-8 text-center text-meopta-text-primary lg:mb-10">
            {title}
          </Typography>
        )}

        <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const imgSrc = getImageSrcWithFallback(item.image, {
              width: 400,
              height: 260,
            });
            const hasLink = item.linkLabel && item.linkUrl;
            const labels = item.labels
              ? item.labels.split(',').map((l) => l.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={item.id ?? i}
                className={cn(
                  'group flex flex-col bg-white opacity-0',
                  isVisible && 'animate-fade-in-up',
                  isVisible && staggerDelays[i % staggerDelays.length],
                )}
              >
                {/* Card image */}
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

                {/* Card body */}
                <div className="flex flex-1 flex-col pt-4">
                  {/* Date + labels */}
                  {(item.date || labels.length > 0) && (
                    <div className="mb-3 flex flex-wrap items-center gap-x-2 text-12 text-meopta-text-secondary">
                      {item.date && <time>{item.date}</time>}
                      {labels.map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-meopta-bg-light px-2 py-0.5 text-11"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.title && (
                    <h3 className="mb-2 text-18 font-semibold leading-snug text-meopta-text-primary">
                      {item.title}
                    </h3>
                  )}

                  {item.description && (
                    <p className="mb-4 flex-1 text-14 leading-relaxed text-meopta-text-secondary">
                      {truncate(item.description, TRUNCATE_LIMIT)}
                    </p>
                  )}

                  {hasLink && (
                    <a
                      href={item.linkUrl!}
                      className="group/link mt-auto inline-flex items-center text-14 text-meopta-text-secondary underline hover:no-underline"
                    >
                      {item.linkLabel}
                      <ArrowRight />
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
