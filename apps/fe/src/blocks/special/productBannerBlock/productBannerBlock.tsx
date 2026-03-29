'use client';

import { ProductBannerBlock as ProductBannerBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-1 h-4 w-4 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

export const ProductBannerBlock = ({
  items,
}: ProductBannerBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) return null;

  return (
    <div className="relative z-10 -mt-[72px] w-full">
      <Container
        size="ab-content"
        className="relative"
      >
        <div
          ref={ref}
          className={cn(
            `
              grid grid-cols-3 gap-2 rounded-xl bg-white px-4 py-5 opacity-0
              lg:grid-cols-6 lg:px-6 lg:py-6
            `,
            isVisible && 'animate-fade-in-up',
          )}
        >
          {items.map((item, index) => (
            <a
              key={index}
              href={item.url}
              className={cn(
                `
                  flex flex-col items-center gap-2 rounded-lg py-3 text-center
                  no-underline transition-colors
                `,
                item.isButton
                  ? 'hover:bg-meopta-blue-light'
                  : `hover:bg-meopta-bg-light`,
              )}
            >
              {item.icon && (
                <div className="flex h-10 w-10 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageSrcWithFallback(item.icon)}
                    alt=""
                    className="h-10 w-10"
                  />
                </div>
              )}
              <span
                className={cn(
                  'text-13',
                  item.isButton
                    ? 'inline-flex items-center font-bold text-meopta-blue-dark'
                    : 'font-semibold text-meopta-text-secondary',
                )}
              >
                {item.label}
                {item.isButton && <ArrowRight />}
              </span>
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
};
