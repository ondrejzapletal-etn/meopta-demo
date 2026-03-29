'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '../../utils/styles';

interface CarouselProps {
  children: React.ReactNode;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  itemClassName?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const Carousel = ({
  children,
  showDots = true,
  showArrows = true,
  className,
  itemClassName,
  autoPlay = false,
  autoPlayInterval = 5000,
}: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = React.Children.toArray(children);
  const itemCount = items.length;

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement;
    if (child) {
      container.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const childWidth = (container.children[0] as HTMLElement)?.offsetWidth ?? 1;
    const newIndex = Math.round(scrollLeft / childWidth);
    setActiveIndex(Math.min(newIndex, itemCount - 1));
  }, [itemCount]);

  useEffect(() => {
    if (!autoPlay || itemCount <= 1) return;
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % itemCount;
      scrollToIndex(next);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, activeIndex, itemCount, scrollToIndex]);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((child, i) => (
          <div key={i} className={cn('flex-shrink-0 snap-start', itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      {showArrows && itemCount > 1 && (
        <>
          <button
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition-opacity hover:bg-white disabled:opacity-30"
            disabled={activeIndex === 0}
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scrollToIndex(Math.min(itemCount - 1, activeIndex + 1))}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition-opacity hover:bg-white disabled:opacity-30"
            disabled={activeIndex === itemCount - 1}
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {showDots && itemCount > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={cn(
                'h-3 w-3 rounded-full transition-colors',
                i === activeIndex ? 'bg-meopta-blue' : 'bg-meopta-border',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
