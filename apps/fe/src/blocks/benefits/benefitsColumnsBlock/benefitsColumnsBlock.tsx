'use client';

import { BenefitsColumnsBlock as BenefitsColumnsBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { RichTextRenderer } from '../../../components/richTextRenderer/richTextRenderer';
import { PillLink } from '../../../components/link/pillLink';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const BenefitsColumnsBlock = ({
  title,
  description,
  items,
  linkLabel,
  linkUrl,
}: BenefitsColumnsBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="w-full bg-white">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12',
          'pb-12',
        )}
      >
        <div
          ref={ref}
          className={cn('opacity-0', isVisible && 'animate-fade-in-up')}
        >
          {title && (
            <h2 className="mb-0 text-center text-24 font-medium leading-[1.33] text-meopta-text-primary lg:text-[32px]">
              {title}
            </h2>
          )}

          {description && (
            <div className="mx-auto mt-2 max-w-2xl text-center text-18 font-light leading-[1.5] text-meopta-text-primary lg:text-[24px]">
              <RichTextRenderer content={description as Record<string, unknown>} />
            </div>
          )}

          {items && items.length > 0 && (
            <div className="mt-12 flex flex-col gap-6 px-8 md:flex-row md:flex-wrap md:justify-center md:px-0 lg:gap-8">
              {items.map((item, index) => (
                <div key={index} className="flex flex-row items-center gap-5 text-left md:w-[calc(33.333%-16px)] md:flex-col md:gap-0 md:text-center lg:w-[calc(20%-25.6px)]">
                  {item.icon && (
                    <div className="relative h-[48px] w-[48px] flex-shrink-0 md:mb-6 md:h-[72px] md:w-[72px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageSrcWithFallback(item.icon)}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <p className="text-14 font-bold leading-relaxed text-meopta-text-secondary md:font-light lg:text-16">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {linkLabel && linkUrl && (
            <div className="mt-12 flex justify-center">
              <PillLink href={linkUrl}>{linkLabel}</PillLink>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
