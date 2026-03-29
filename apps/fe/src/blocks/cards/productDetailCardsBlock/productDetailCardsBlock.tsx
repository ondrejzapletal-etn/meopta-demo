'use client';

import { useState, useRef, useCallback } from 'react';
import { ProductDetailCardsBlock as ProductDetailCardsBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { RichTextRenderer } from '../../../components/richTextRenderer/richTextRenderer';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

const staggerDelays = [
  '',
  'animation-delay-100',
  'animation-delay-200',
];

const bgClasses: Record<string, string> = {
  lightGrey: 'bg-meopta-bg-light',
  white: 'bg-white',
};

const CardContent = ({
  item,
  className,
}: {
  item: NonNullable<ProductDetailCardsBlockType['items']>[number];
  className?: string;
}) => (
  <div className={cn(`
    flex flex-col overflow-hidden rounded-lg bg-white
    shadow-[0_5px_10px_0_rgba(0,0,0,0.18)]
  `, className)}
  >
    {/* Top zone: white with icon + name */}
    <div className="flex flex-col items-center px-4 pb-6 pt-8 text-center">
      {item.icon && (
        <div className="mb-6 h-12 w-12 lg:h-[72px] lg:w-[72px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageSrcWithFallback(item.icon)}
            alt={item.name}
            className="h-full w-full object-contain"
          />
        </div>
      )}

      <h4 className="text-[22px] font-medium leading-snug text-meopta-text-primary lg:text-[24px]">
        {item.name}
      </h4>
    </div>

    {/* Grey inset with subtitle, description, features */}
    <div className="mx-4 flex flex-1 flex-col rounded-lg bg-[#f2f2f2] px-4 py-6">
      {item.subtitle && (
        <h5 className="mb-3 text-[18px] font-medium leading-snug text-meopta-text-primary lg:text-[20px]">
          {item.subtitle}
        </h5>
      )}

      {item.description && (
        <div className="mb-4 text-[13px] font-light leading-[1.63] text-meopta-text-secondary lg:text-[14px] [&_strong]:font-medium [&_strong]:text-meopta-text-primary">
          <RichTextRenderer content={item.description as Record<string, unknown>} />
        </div>
      )}

      {item.features && item.features.length > 0 && (
        <ul className="list-disc space-y-3 pl-5">
          {item.features.map((feature, fi) => (
            <li key={fi} className="text-[13px] leading-[1.63] text-meopta-text-secondary lg:text-[14px]">
              {feature.text}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* CTA below grey box */}
    {item.linkLabel && item.linkUrl && (
      <div className="flex justify-center px-4 pb-6 pt-4">
        <a
          href={item.linkUrl}
          className="inline-flex h-12 items-center rounded-full bg-meopta-blue px-6 text-[0.875rem] font-medium text-white no-underline transition-colors hover:bg-meopta-blue-hover"
        >
          {item.linkLabel}
          <ArrowRight />
        </a>
      </div>
    )}
  </div>
);

export const ProductDetailCardsBlock = ({
  title,
  description,
  backgroundColor,
  items,
}: ProductDetailCardsBlockType) => {
  const { ref, isVisible } = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(index);
  }, []);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: 'smooth' });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { isDragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = 'grabbing';
    el.style.scrollSnapType = 'none';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 0.3;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  }, []);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.isDragging) return;
    const el = scrollRef.current;
    dragState.current.isDragging = false;
    if (!el) return;
    el.style.cursor = '';
    // Determine direction based on mouse drag distance (50px threshold)
    const dragDistance = e.pageX - el.offsetLeft - dragState.current.startX;
    const startIndex = Math.round(dragState.current.scrollLeft / el.offsetWidth);
    let targetIndex = startIndex;
    if (dragDistance > 50) targetIndex = Math.max(0, startIndex - 1);
    else if (dragDistance < -50) targetIndex = startIndex + 1;
    el.style.scrollSnapType = 'x mandatory';
    el.scrollTo({ left: targetIndex * el.offsetWidth, behavior: 'smooth' });
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <div className={cn('w-full', bgClasses[backgroundColor ?? 'lightGrey'] ?? `
      bg-meopta-bg-light
    `)}
    >
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-10 lg:pt-14',
          'pb-10 lg:pb-14',
        )}
      >
        <div
          ref={ref}
          className={cn('opacity-0', isVisible && 'animate-fade-in-up')}
        >
          {title && (
            <h2 className="mb-8 text-center text-[28px] font-medium leading-tight text-meopta-text-primary lg:mb-12 lg:text-[32px]">
              {title}
            </h2>
          )}

          {description && (
            <p className="mx-auto mb-8 max-w-2xl text-center text-[18px] font-light leading-snug text-meopta-text-secondary lg:mb-12 lg:text-[20px]">
              {description}
            </p>
          )}

          {/* Mobile: horizontal swipe carousel */}
          <div className="md:hidden">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={() => {
                if (!dragState.current.isDragging) return;
                dragState.current.isDragging = false;
                const el = scrollRef.current;
                if (!el) return;
                el.style.cursor = '';
                el.style.scrollSnapType = 'x mandatory';
                const index = Math.round(el.scrollLeft / el.offsetWidth);
                el.scrollTo({ left: index * el.offsetWidth, behavior: 'smooth' });
              }}
              className="scrollbar-none flex cursor-grab snap-x snap-mandatory overflow-x-scroll py-4 select-none"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {items.map((item, index) => (
                <div key={item.id ?? index} className="w-full flex-shrink-0 snap-start px-8">
                  <CardContent item={item} />
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            {items.length > 1 && (
              <div className="mt-6 flex justify-center gap-3">
                {items.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollTo(index)}
                    aria-label={`Karta ${index + 1}`}
                    className={cn(
                      'h-3 w-3 rounded-full transition-colors',
                      index === activeIndex
                        ? 'bg-meopta-blue'
                        : 'border border-meopta-blue bg-transparent',
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Medium + Large: flex wrap grid */}
          <div className="hidden flex-wrap justify-center gap-5 md:flex">
            {items.map((item, index) => (
              <CardContent
                key={item.id ?? index}
                item={item}
                className={cn(
                  'w-full max-w-[490px] opacity-0',
                  'md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]',
                  isVisible && 'animate-fade-in-up',
                  isVisible && staggerDelays[index % staggerDelays.length],
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};
