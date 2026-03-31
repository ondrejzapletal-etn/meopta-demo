'use client';

import { InfoCardNarrowBlock as InfoCardNarrowBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const InfoCardNarrowBlock = ({
  title,
  items,
}: InfoCardNarrowBlockType) => {
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

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div
          ref={ref}
          className={cn(
            `
              flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth
              pb-4
            `,
            '-mx-4 px-4 md:-mx-0 md:px-0',
            'md:grid md:overflow-visible md:pb-0',
            items.length === 2 && 'md:grid-cols-2',
            items.length === 3 && 'md:grid-cols-3',
            items.length >= 4 && 'md:grid-cols-4',
          )}
        >
          {items.map((item, i) => (
            <div
              key={item.id ?? i}
              className={cn(
                `
                  flex-shrink-0 snap-start rounded-2xl bg-meopta-blue p-6
                  opacity-0
                  lg:p-8
                `,
                'flex w-[280px] flex-col justify-between md:w-auto',
                isVisible && 'animate-fade-in-up',
              )}
            >
              {/* Number */}
              <span className="mb-4 text-48 font-bold leading-none text-white/30 lg:text-64">
                {String(item.number).padStart(2, '0')}
              </span>

              {/* Title */}
              <Typography variant="h4" className="mb-2 text-white">
                {item.title}
              </Typography>

              {/* Description */}
              {item.description && (
                <p className="mb-4 text-14 leading-relaxed text-white/80 lg:text-16">
                  {item.description}
                </p>
              )}

              {/* Optional link */}
              {item.linkLabel && item.linkUrl && (
                <a
                  href={item.linkUrl}
                  className="mt-auto inline-flex items-center gap-1 text-14 font-bold text-white underline transition-colors hover:text-white/80"
                >
                  {item.linkLabel}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <line x1={5} y1={12} x2={19} y2={12} />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
