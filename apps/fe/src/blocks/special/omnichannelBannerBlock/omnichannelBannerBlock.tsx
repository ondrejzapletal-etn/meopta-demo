'use client';

import { OmnichannelBannerBlock as OmnichannelBannerBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-1 h-4 w-4 shrink-0">
    <path
      d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99"
      fillRule="evenodd"
    />
  </svg>
);

export const OmnichannelBannerBlock = ({
  title,
  description,
  items,
}: OmnichannelBannerBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  const bannerText = description;
  const boldPart = title;
  const linkItem = items?.[0];

  if (!bannerText && !linkItem) return null;

  return (
    <div className="w-full">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-4 lg:pt-6',
          'pb-4 lg:pb-6',
        )}
      >
        <div
          ref={ref}
          className={cn(
            `
              flex flex-col items-center gap-6 rounded-3xl bg-meopta-blue px-6
              py-8 text-center opacity-0
              md:flex-row md:justify-between md:gap-0 md:rounded-full md:py-5
              md:text-left
              lg:px-8
            `,
            isVisible && 'animate-fade-in-up',
          )}
        >
          {/* Banner text */}
          {(boldPart || bannerText) && (
            <p className="text-[18px] leading-snug text-meopta-text-primary lg:text-[20px]">
              {boldPart && <strong className="font-black">{boldPart}</strong>}
              {bannerText}
            </p>
          )}

          {/* Link */}
          {linkItem?.linkUrl && (
            <a
              href={linkItem.linkUrl}
              className="flex shrink-0 items-center text-[14px] font-medium text-meopta-text-primary no-underline transition-colors hover:text-meopta-blue-dark md:ml-4"
            >
              {linkItem.label}
              <ArrowRight />
            </a>
          )}
        </div>
      </Container>
    </div>
  );
};
