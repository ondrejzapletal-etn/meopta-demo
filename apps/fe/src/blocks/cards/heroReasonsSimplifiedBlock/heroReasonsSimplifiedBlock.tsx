'use client';

import { useRef, useState, useCallback } from 'react';
import { HeroReasonsSimplifiedBlock as HeroReasonsSimplifiedBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { cn } from '../../../utils/styles';
import { getImageSrcWithFallback } from '../../../utils/images';

/** Green diagonal slash — decorative element used next to the title and counter */
const GreenSlash = ({ className }: { className?: string }) => (
  <svg
    width="71"
    height="110"
    viewBox="0 0 25 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.2329 0.25L0.75 34.4763H6.10322L24.5861 0.25H19.2329Z"
      fill="#99CC33"
    />
  </svg>
);

/** Arrow icon for the CTA button */
const ArrowIcon = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="h-5 w-5">
    <path
      d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99"
      fillRule="evenodd"
    />
  </svg>
);

/** Carousel navigation arrow */
const NavArrow = ({
  direction,
  onClick,
  disabled,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === 'left' ? 'Předchozí výhoda' : 'Další výhoda'}
    className={cn(
      `
        flex h-10 w-10 items-center justify-center rounded-full border-2
        transition-colors
      `,
      disabled
        ? 'cursor-not-allowed border-gray-300 text-gray-300'
        : 'border-[#497D00] text-[#497D00] hover:bg-[#497D00]/10',
    )}
  >
    <svg viewBox="0 0 20 10" fill="none" className="h-4 w-5">
      {direction === 'left'
        ? (
            <path
              d="M4.9974 1.66504L1.6624 5.00004M1.6624 5.00004L4.9974 8.33504M1.6624 5.00004H18.3374"
              stroke="currentColor"
              strokeWidth="1.6675"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        : (
            <path
              d="M15.0026 1.66504L18.3376 5.00004M18.3376 5.00004L15.0026 8.33504M18.3376 5.00004H1.6626"
              stroke="currentColor"
              strokeWidth="1.6675"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
    </svg>
  </button>
);

const CARD_WIDTH = 176;
const CARD_GAP = 12;

export const HeroReasonsSimplifiedBlock = ({
  title,
  linkLabel,
  linkUrl,
  image,
  items,
}: HeroReasonsSimplifiedBlockType) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const itemCount = items?.length ?? 0;
  const visibleCards = 3;
  const maxIndex = Math.max(0, itemCount - visibleCards);

  const scrollPrev = useCallback(() => {
    setScrollIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const scrollNext = useCallback(() => {
    setScrollIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  if (!items || items.length === 0) return null;

  const offset = -(scrollIndex * (CARD_WIDTH + CARD_GAP));
  const displayLabel = linkLabel || 'Tlačítko';
  const displayUrl = linkUrl || '/';

  return (
    <div className="w-full overflow-hidden bg-[#f2f2f2]" style={{ padding: '72px 0 96px' }}>
      <section className="relative mx-auto max-w-[1232px] px-4 lg:px-8" style={{ paddingBottom: '48px' }}>
        {/* Two-column layout: left title area, right cards bleeding to viewport edge */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* LEFT COLUMN — Title, button, counter, image */}
          <div className="relative z-10 flex-shrink-0 lg:w-[55%] lg:pr-8">
            {/* Title with green slash */}
            <div className="flex items-start gap-3">
              <GreenSlash className="mt-1 h-[40px] w-[25px] flex-shrink-0 lg:h-[110px] lg:w-[70px]" />
              <h1 className="text-[28px] font-light leading-tight text-meopta-text-primary lg:text-[42px] lg:leading-[50px]">
                {title?.split(',').map((part, i) =>
                  i === 0
                    ? (
                        <strong key={i} className="font-bold">{part}</strong>
                      )
                    : (
                        <span key={i}>
                          ,
                          {part}
                        </span>
                      ),
                )}
              </h1>
            </div>

            {/* Button link — green rounded pill matching primary CTA style */}
            <a
              href={displayUrl}
              className="mt-6 inline-flex h-14 items-center gap-3 rounded-full bg-meopta-blue px-6 text-14 font-medium text-meopta-text-primary no-underline transition-colors hover:bg-meopta-blue-hover"
            >
              <span>{displayLabel}</span>
              <ArrowIcon />
            </a>

          </div>

          {/* RIGHT COLUMN — Card carousel, bleeds to viewport right edge */}
          <div
            className="relative flex-1"
            style={{ marginRight: 'min(0px, calc(-1 * (100vw - 1232px) / 2 - 2rem))' }}
          >
            {/* Card track — clips overflow on the right, no scrollbar */}
            <div className="overflow-hidden">
              <div
                ref={trackRef}
                className="flex gap-3 transition-transform duration-300 ease-out"
                style={{ transform: `translate3d(${offset}px, 0, 0)` }}
              >
                {items.map((item, i) => {
                  const itemImage
                    = item.image && typeof item.image === 'object'
                      ? getImageSrcWithFallback(item.image)
                      : null;

                  return (
                    <a
                      key={item.id ?? i}
                      href="#"
                      className="relative flex h-[230px] w-[176px] flex-shrink-0 flex-col overflow-hidden rounded-xl bg-[#99CC33] no-underline"
                      style={{ padding: '24px 12px 24px 16px' }}
                    >
                      <div>
                        <span className="text-[24px] leading-none text-[#1e3300] lg:text-[28px]" style={{ fontWeight: 900 }}>
                          {item.number}
                        </span>
                        <span className="ml-0.5 text-[24px] text-white" style={{ fontWeight: 900 }}>
                          {' '}
                          /
                        </span>
                      </div>
                      <p className="relative z-10 mt-3 text-14 font-bold leading-snug text-[#1e3300] lg:text-16">
                        {item.title}
                      </p>
                      {/* Card background image (product/promo photo) */}
                      {itemImage && (
                        <Image
                          src={itemImage}
                          alt=""
                          width={176}
                          height={230}
                          className="pointer-events-none absolute -bottom-6 -right-4 h-[230px] w-[176px] object-contain object-right-bottom"
                        />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Navigation arrows — aligned to content area, right side */}
        <div className="mt-4 flex justify-start gap-3 lg:justify-end">
          <NavArrow direction="left" onClick={scrollPrev} />
          <NavArrow direction="right" onClick={scrollNext} />
        </div>

        {/* Decorative image (heart-shaped gift box) — absolute to section, overlaps cards */}
        {image && typeof image === 'object' && (
          <Image
            src={getImageSrcWithFallback(image)}
            alt=""
            width={340}
            height={340}
            className="pointer-events-none absolute z-[5] hidden h-[340px] w-[340px] object-contain lg:block"
            style={{ bottom: '-80px', right: '300px' }}
          />
        )}
      </section>
    </div>
  );
};
