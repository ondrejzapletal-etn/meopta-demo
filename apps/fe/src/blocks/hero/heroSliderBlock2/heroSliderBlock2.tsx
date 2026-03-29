'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HeroSliderBlock2 as HeroSliderBlock2Type } from '@repo/shared/payload-types';
import { getImageSrcWithFallback } from '../../../utils/images';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path
      d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99"
      fillRule="evenodd"
    />
  </svg>
);

// Vertical accent bar colour per slide backgroundColor value
const accentColorClass: Record<string, string> = {
  green: 'bg-meopta-blue',      // Industrial / Corporate – Meopta blue
  white: 'bg-segment-sport',   // Sport / Hunting – olive green
  lightGrey: 'bg-segment-defence', // Military / Defence – steel grey
};

// Bottom gradient overlay per slide backgroundColor value
const overlayClass: Record<string, string> = {
  green: 'from-meopta-blue-dark/80 via-meopta-blue-dark/30 to-transparent',
  white: 'from-[#3D2200]/80 via-[#3D2200]/30 to-transparent',
  lightGrey: 'from-[#1E2218]/80 via-[#1E2218]/30 to-transparent',
};

export const HeroSliderBlock2 = ({ slides }: HeroSliderBlock2Type) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="flex h-[480px] w-full overflow-hidden lg:h-[560px]">
      {slides.map((slide, i) => {
        const isActive = i === activeIndex;
        const bg = slide.backgroundColor ?? 'green';

        return (
          <div
            key={i}
            role={isActive ? undefined : 'button'}
            tabIndex={isActive ? undefined : 0}
            aria-label={isActive ? undefined : slide.title}
            onClick={() => setActiveIndex(i)}
            onKeyDown={(e) => {
              if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setActiveIndex(i);
              }
            }}
            style={{ flex: isActive ? '2 2 0%' : '1 1 0%' }}
            className={cn(
              'group relative overflow-hidden transition-[flex] duration-500 ease-in-out',
              !isActive && 'cursor-pointer',
            )}
          >
            {/* Background image */}
            {slide.image && (
              <Image
                src={getImageSrcWithFallback(slide.image)}
                alt={slide.title ?? ''}
                fill
                className="object-cover"
                priority={i === 0}
              />
            )}

            {/* Bottom-to-top gradient overlay */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-t',
                overlayClass[bg] ?? overlayClass['green'],
              )}
            />

            {/* Content anchored at the bottom-left of each panel */}
            <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-6 lg:p-8">
              {/* Vertical accent bar */}
              <div
                className={cn(
                  'w-[3px] shrink-0 self-stretch rounded-full transition-all duration-500',
                  accentColorClass[bg] ?? accentColorClass['green'],
                  isActive ? 'min-h-[80px]' : 'min-h-[40px]',
                )}
              />

              {/* Text content */}
              <div
                className={cn(
                  'flex flex-col transition-opacity duration-300',
                  !isActive && 'opacity-80 group-hover:opacity-100',
                )}
              >
                <h2
                  className={cn(
                    'font-bold transition-all duration-500 !text-white',
                    isActive ? 'mb-3 text-24 lg:text-30' : 'mb-0 text-18 lg:text-24',
                  )}
                >
                  {slide.title}
                </h2>

                {/* Description + CTA — visible only for the active panel */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-500',
                    isActive ? 'max-h-[220px] opacity-100' : 'max-h-0 opacity-0',
                  )}
                  aria-hidden={!isActive}
                >
                  {slide.description && (
                    <p className="mb-4 max-w-md text-base leading-relaxed text-white">
                      {slide.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {slide.linkLabel && slide.linkUrl && (
                      <a
                        href={slide.linkUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center rounded-full border border-white/50 bg-white/15 px-5 py-2 text-sm font-medium text-white no-underline backdrop-blur-sm transition-colors hover:bg-white/25"
                      >
                        {slide.linkLabel}
                        <ArrowRight />
                      </a>
                    )}
                    {slide.secondaryLinkLabel && slide.secondaryLinkUrl && (
                      <a
                        href={slide.secondaryLinkUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white no-underline transition-colors hover:border-white/50"
                      >
                        {slide.secondaryLinkLabel}
                        <ArrowRight />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
