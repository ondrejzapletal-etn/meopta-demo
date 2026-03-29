'use client';

import { LogoCarouselBlock as LogoCarouselBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';
import Image from 'next/image';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useState, useRef, useCallback } from 'react';

const ArrowLeft = () => (
  <svg viewBox="0 0 20 10" className="h-3 w-5" aria-hidden="true">
    <path
      d="M4.997 1.665L1.662 5m0 0l3.335 3.335M1.662 5h16.675"
      stroke="#497D00"
      strokeWidth="1.668"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const ArrowRightNav = () => (
  <svg viewBox="0 0 20 10" className="h-3 w-5" aria-hidden="true">
    <path
      d="M15.003 1.665L18.338 5m0 0l-3.335 3.335M18.338 5H1.663"
      stroke="#497D00"
      strokeWidth="1.668"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const LogoCarouselBlock = ({ title, description, logos }: LogoCarouselBlockType) => {
  const { ref, isVisible } = useScrollAnimation();
  const [scrollPos, setScrollPos] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const ITEM_WIDTH = 180;
  const VISIBLE_ITEMS = 5;

  const maxScroll = logos ? Math.max(0, (logos.length - VISIBLE_ITEMS) * ITEM_WIDTH) : 0;
  const canScrollLeft = scrollPos > 0;
  const canScrollRight = scrollPos < maxScroll;

  const scroll = useCallback(
    (dir: 'left' | 'right') => {
      setScrollPos((prev) => {
        const next = dir === 'left' ? prev - ITEM_WIDTH * 2 : prev + ITEM_WIDTH * 2;
        return Math.max(0, Math.min(next, maxScroll));
      });
    },
    [maxScroll],
  );

  if (!logos || logos.length === 0) return null;

  return (
    <div className="w-full bg-[#c8c8c8]">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-20',
        )}
      >
        {(title || description) && (
          <div className="mb-8 text-center lg:mb-10">
            {title && (
              <Typography variant="h2" className="mb-3 text-meopta-text-primary">
                {title}
              </Typography>
            )}
            {description && (
              <p className="text-16 text-meopta-text-secondary lg:text-18">{description}</p>
            )}
          </div>
        )}

        <div
          ref={ref}
          className={cn('flex items-center gap-4 opacity-0', isVisible && `
            animate-fade-in-up
          `)}
        >
          <button
            type="button"
            aria-label="Previous logo"
            disabled={!canScrollLeft}
            onClick={() => scroll('left')}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-meopta-border transition-colors hover:bg-meopta-bg-light disabled:opacity-30"
          >
            <ArrowLeft />
          </button>

          <div className="flex-1 overflow-hidden">
            <div
              ref={trackRef}
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translate3d(-${scrollPos}px, 0, 0)` }}
            >
              {logos.map((logo, i) => {
                const imgSrc = getImageSrcWithFallback(logo.image);
                const logoName = logo.name ?? '';

                const logoImage = (
                  <div
                    key={logo.id ?? i}
                    className="flex h-[80px] w-[160px] flex-shrink-0 items-center justify-center px-4 lg:w-[180px]"
                  >
                    <div className="relative h-[60px] w-full">
                      <Image src={imgSrc} alt={logoName} fill className="object-contain" />
                    </div>
                  </div>
                );

                if (logo.url) {
                  return (
                    <a
                      key={logo.id ?? i}
                      href={logo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-shrink-0"
                      aria-label={logoName || 'Partner logo'}
                    >
                      {logoImage}
                    </a>
                  );
                }

                return logoImage;
              })}
            </div>
          </div>

          <button
            type="button"
            aria-label="Next logo"
            disabled={!canScrollRight}
            onClick={() => scroll('right')}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-meopta-border transition-colors hover:bg-meopta-bg-light disabled:opacity-30"
          >
            <ArrowRightNav />
          </button>
        </div>
      </Container>
    </div>
  );
};
