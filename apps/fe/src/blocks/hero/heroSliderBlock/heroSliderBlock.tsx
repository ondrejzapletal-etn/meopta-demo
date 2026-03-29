'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { HeroSliderBlock as HeroSliderBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { getImageSrcWithFallback } from '../../../utils/images';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-6 w-6 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

const SliderArrow = ({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
    className={cn(
      `
        absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center
        justify-center rounded-full bg-white/80 shadow-md transition-colors
        hover:bg-white
      `,
      direction === 'left' ? 'left-4' : 'right-4',
    )}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-meopta-text-primary">
      {direction === 'left'
        ? <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  </button>
);

const bgClasses: Record<string, string> = {
  green: 'bg-meopta-blue',
  white: 'bg-white',
  lightGrey: 'bg-meopta-bg-light',
};

const btnClasses: Record<string, string> = {
  green: 'bg-white hover:bg-meopta-bg-light',
  white: 'bg-meopta-blue hover:bg-meopta-blue-hover text-white',
  lightGrey: 'bg-meopta-blue hover:bg-meopta-blue-hover text-white',
};

const dotClasses: Record<string, { active: string; inactive: string }> = {
  green: {
    active: 'bg-meopta-text-primary',
    inactive: 'bg-meopta-blue-dark/30 hover:bg-meopta-blue-dark/50',
  },
  white: {
    active: 'bg-meopta-blue',
    inactive: 'bg-meopta-border hover:bg-meopta-text-secondary',
  },
  lightGrey: {
    active: 'bg-meopta-blue',
    inactive: 'bg-meopta-border hover:bg-meopta-text-secondary',
  },
};

export const HeroSliderBlock = ({
  slides,
  autoPlay,
  autoPlayInterval,
}: HeroSliderBlockType) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const slideCount = slides?.length ?? 0;
  const interval = autoPlayInterval ?? 5000;

  const goTo = useCallback((index: number) => {
    if (isTransitioning || slideCount <= 1) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 350);
  }, [isTransitioning, slideCount]);

  const goToNext = useCallback(() => {
    goTo((activeIndex + 1) % slideCount);
  }, [activeIndex, slideCount, goTo]);

  const goToPrev = useCallback(() => {
    goTo((activeIndex - 1 + slideCount) % slideCount);
  }, [activeIndex, slideCount, goTo]);

  useEffect(() => {
    if (!autoPlay || slideCount <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, goToNext, slideCount]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[activeIndex];
  if (!currentSlide) return null;

  const bg = currentSlide.backgroundColor ?? 'green';

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden transition-colors duration-500',
        bgClasses[bg],
      )}
    >
      {/* Slide track with translate3d animation */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex transition-transform duration-[350ms] ease-in-out"
          style={{
            transform: `translate3d(-${activeIndex * 100}%, 0px, 0px)`,
          }}
        >
          {slides.map((slide, i) => {
            const slideBg = slide.backgroundColor ?? 'green';
            return (
              <div
                key={i}
                className={cn(
                  'w-full flex-shrink-0',
                  bgClasses[slideBg],
                )}
              >
                <Container
                  size="ab-content"
                  className={cn(
                    'relative',
                    'pt-12 lg:pt-20',
                    'pb-12 lg:pb-20',
                  )}
                >
                  <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
                    {/* Text content */}
                    <div className="flex flex-1 flex-col items-start">
                      {slide.title && (
                        <h2 className="mb-4 text-30 font-bold leading-[1.17] text-black lg:text-48">
                          {slide.title}
                        </h2>
                      )}

                      {slide.description && (
                        <p className="mb-6 max-w-xl text-18 font-light leading-normal text-meopta-text-primary lg:text-24">
                          {slide.description}
                        </p>
                      )}

                      {(slide.linkLabel || slide.secondaryLinkLabel) && (
                        <div className="flex flex-wrap gap-3">
                          {slide.linkLabel && slide.linkUrl && (
                            <a
                              href={slide.linkUrl}
                              className={cn(
                                `
                                  flex h-14 items-center rounded-full px-6
                                  text-[0.875rem] font-medium
                                  text-meopta-text-primary no-underline
                                  transition-colors
                                `,
                                btnClasses[slideBg],
                              )}
                            >
                              {slide.linkLabel}
                              <ArrowRight />
                            </a>
                          )}
                          {slide.secondaryLinkLabel && slide.secondaryLinkUrl && (
                            <a
                              href={slide.secondaryLinkUrl}
                              className="flex h-14 items-center rounded-full border border-meopta-text-primary/30 px-6 text-[0.875rem] font-medium text-meopta-text-primary no-underline transition-colors hover:bg-white/10"
                            >
                              {slide.secondaryLinkLabel}
                              <ArrowRight />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Image */}
                    {slide.image && (
                      <div className="relative h-[220px] w-full flex-shrink-0 md:h-[260px] lg:h-[320px] lg:w-[500px]">
                        <Image
                          src={getImageSrcWithFallback(slide.image)}
                          alt={slide.title ?? ''}
                          fill
                          className="object-contain"
                          priority={i === 0}
                        />
                      </div>
                    )}
                  </div>
                </Container>
              </div>
            );
          })}
        </div>

        {/* Arrow navigation */}
        {slideCount > 1 && (
          <>
            <SliderArrow direction="left" onClick={goToPrev} />
            <SliderArrow direction="right" onClick={goToNext} />
          </>
        )}
      </div>

      {/* Navigation dots */}
      {slideCount > 1 && (
        <div className="flex items-center justify-center gap-2 pb-6">
          {slides.map((slide, i) => {
            const slideBg = slide.backgroundColor ?? 'green';
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  'h-3 rounded-full transition-all duration-300',
                  i === activeIndex
                    ? cn('w-8', dotClasses[slideBg]?.active ?? dotClasses[bg]?.active)
                    : cn('w-3', dotClasses[slideBg]?.inactive ?? dotClasses[bg]?.inactive),
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
