'use client';

import { CtaCardsBlock as CtaCardsBlockType } from '@repo/shared/payload-types';
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

export const CtaCardsBlock = ({
  title,
  description,
  items,
  footnoteIcon,
  footnoteText,
}: CtaCardsBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div id="zalozit-ucet" className="w-full bg-meopta-bg-light">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-6 lg:pt-10',
          'pb-10 lg:pb-14',
        )}
      >
        <div
          ref={ref}
          className={cn('opacity-0', isVisible && 'animate-fade-in-up')}
        >
          {title && (
            <h2 className="mb-3 text-center text-[28px] font-medium leading-tight text-meopta-text-primary lg:text-[32px]">
              {title}
            </h2>
          )}

          {description && (
            <div className="mx-auto mb-8 max-w-2xl text-center text-[20px] font-light leading-snug text-meopta-text-secondary lg:text-[24px]">
              <RichTextRenderer content={description as Record<string, unknown>} />
            </div>
          )}

          {items && items.length > 0 && (
            <div className={cn(
              'mx-auto flex flex-wrap justify-center gap-8',
              items.length <= 3 ? 'max-w-[1000px]' : 'max-w-[820px]',
            )}
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  className="mx-12 flex w-full flex-col items-center rounded-lg bg-white p-8 text-center md:mx-0 md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
                >
                  {item.icon && (
                    <div className="mb-4 h-[60px] w-[60px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageSrcWithFallback(item.icon)}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}

                  <h3 className="mb-3 text-[20px] font-medium leading-snug text-meopta-text-primary lg:text-[24px]">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mb-6 text-[14px] font-light leading-relaxed text-meopta-text-secondary lg:text-[16px]">
                      {item.description}
                    </p>
                  )}

                  {item.linkLabel && item.linkUrl && (
                    <a
                      href={item.linkUrl}
                      className="mt-auto inline-flex h-12 items-center rounded-full bg-meopta-blue px-6 text-[0.875rem] font-medium text-white no-underline transition-colors hover:bg-meopta-blue-hover"
                    >
                      {item.linkLabel}
                      <ArrowRight />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {footnoteText && (
            <div className="mt-8 flex items-center justify-center gap-3">
              {footnoteIcon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getImageSrcWithFallback(footnoteIcon)}
                  alt=""
                  className="h-14 w-14 shrink-0 object-contain"
                />
              )}
              <div className="text-14 text-meopta-text-secondary lg:text-16 [&_a]:text-meopta-text-secondary [&_a]:underline hover:[&_a]:no-underline">
                <RichTextRenderer content={footnoteText as Record<string, unknown>} />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
