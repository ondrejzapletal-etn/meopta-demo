'use client';

import { useState, useCallback } from 'react';
import { TimelineBlock as TimelineBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';
import Image from 'next/image';
import { getImageSrcWithFallback } from '../../../utils/images';

const SliderArrow = ({
  direction,
  onClick,
  disabled,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === 'left' ? 'Previous' : 'Next'}
    className={cn(
      `
        flex h-10 w-10 items-center justify-center rounded-full border
        border-meopta-border bg-white transition-colors
      `,
      disabled ? 'cursor-default opacity-30' : 'hover:bg-meopta-bg-light',
    )}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5 text-meopta-text-primary"
    >
      {direction === 'left'
        ? (
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          )
        : (
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          )}
    </svg>
  </button>
);

export const TimelineBlock = ({ title, items }: TimelineBlockType) => {
  const { ref, isVisible } = useScrollAnimation();
  const [activeIndex, setActiveIndex] = useState(0);

  const itemCount = items?.length ?? 0;

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < itemCount) {
        setActiveIndex(index);
      }
    },
    [itemCount],
  );

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
          <Typography variant="h2" className="mb-10 text-center text-meopta-text-primary lg:mb-14">
            {title}
          </Typography>
        )}

        <div
          ref={ref}
          className={cn('relative opacity-0', isVisible && 'animate-fade-in-up')}
        >
          {/* Year tabs — top center */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.id ?? i}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  'rounded-full px-5 py-2 text-16 font-bold transition-colors',
                  i === activeIndex
                    ? 'bg-meopta-blue text-white'
                    : 'bg-meopta-bg-light text-meopta-text-secondary hover:bg-meopta-border',
                )}
              >
                {item.year}
              </button>
            ))}
          </div>

          {/* Slide area */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-[400ms] ease-in-out"
              style={{
                transform: `translate3d(-${activeIndex * 100}%, 0px, 0px)`,
              }}
            >
              {items.map((item, i) => (
                <div key={item.id ?? i} className="w-full flex-shrink-0 px-4">
                  <div className="mx-auto max-w-3xl">
                    <Typography variant="h3" className="mb-3 text-meopta-text-primary">
                      {item.year}
                      {' '}
                      —
                      {item.title}
                    </Typography>

                    {item.description && (
                      <p className="text-16 leading-relaxed text-meopta-text-secondary">
                        {item.description}
                      </p>
                    )}

                    {item.image && (
                      <div className="relative mt-6 h-[200px] w-full overflow-hidden rounded-xl md:h-[280px]">
                        <Image
                          src={getImageSrcWithFallback(item.image)}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Arrow navigation */}
            {itemCount > 1 && (
              <div className="absolute inset-y-0 left-0 flex items-center">
                <SliderArrow
                  direction="left"
                  onClick={() => goTo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                />
              </div>
            )}
            {itemCount > 1 && (
              <div className="absolute inset-y-0 right-0 flex items-center">
                <SliderArrow
                  direction="right"
                  onClick={() => goTo(activeIndex + 1)}
                  disabled={activeIndex === itemCount - 1}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
