'use client';

import { ProductCardsVerticalBlock as ProductCardsVerticalBlockType } from '@repo/shared/payload-types';
import { ABIcon } from '../../../components/icon/icon';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const columnClasses: Record<string, string> = {
  1: 'grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
};

const staggerDelays = [
  '',
  'animation-delay-100',
  'animation-delay-200',
];

export const ProductCardsVerticalBlock = ({
  title,
  items,
}: ProductCardsVerticalBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) return null;

  const cols = String(Math.min(items.length, 3));

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
          <Typography variant="h3" className="mb-8 text-center text-meopta-text-primary lg:mb-12">
            {title}
          </Typography>
        )}

        <div ref={ref} className={cn('grid grid-cols-1 gap-6 lg:gap-8', columnClasses[cols])}>
          {items.map((item, i) => {
            const hasLink = item.linkLabel && item.linkUrl;

            return (
              <div
                key={item.id ?? i}
                className={cn(
                  `
                    group flex flex-col items-center rounded-2xl border
                    border-meopta-border bg-meopta-bg-light p-6 text-center opacity-0
                    transition-shadow
                    lg:p-8
                  `,
                  isVisible && 'animate-fade-in-up',
                  isVisible && staggerDelays[i % staggerDelays.length],
                )}
              >
                {item.icon && (
                  <div
                    className={cn(
                      `
                        mb-4 flex h-12 w-12 items-center justify-center
                        rounded-full bg-meopta-blue-light
                      `,
                    )}
                    aria-hidden="true"
                  >
                    <ABIcon
                      name={item.icon as Parameters<typeof ABIcon>[0]['name']}
                      size={20}
                      className="text-meopta-blue-dark"
                    />
                  </div>
                )}

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
            );
          })}
        </div>
      </Container>
    </div>
  );
};
