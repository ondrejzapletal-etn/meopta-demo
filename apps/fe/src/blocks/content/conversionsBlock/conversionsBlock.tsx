'use client';

import { ConversionsBlock as ConversionsBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

const PlaceholderIllustration = () => (
  <svg viewBox="0 0 56 56" fill="none" className="h-[120px] w-[120px] lg:h-[160px] lg:w-[160px]" aria-hidden="true">
    <circle cx="28" cy="28" r="22" fill="#99CC33" />
    <circle cx="28" cy="28" r="22" stroke="#1E3405" strokeLinecap="round" />
    <path d="M28 18v8m0 4h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ConversionsBlock = ({
  title,
  description,
  items,
}: ConversionsBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="w-full bg-white">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-20',
        )}
      >
        <div className="mb-8 text-center lg:mb-12">
          {title && (
            <Typography variant="h2" className="mb-4 text-meopta-text-primary">
              {title}
            </Typography>
          )}
          {description && (
            <p className="mx-auto max-w-2xl text-16 leading-relaxed text-meopta-text-secondary lg:text-18">
              {description}
            </p>
          )}
        </div>

        <div
          ref={ref}
          className={cn(
            'grid grid-cols-1 gap-6 opacity-0 md:grid-cols-2 lg:grid-cols-3',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {items?.map((item, i) => (
            <article
              key={item.id ?? i}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4">
                <PlaceholderIllustration />
              </div>

              {item.title && (
                <h3 className="mb-2 text-18 font-semibold text-meopta-text-primary lg:text-20">
                  {item.title}
                </h3>
              )}

              {item.description && (
                <p className="mb-4 text-14 leading-relaxed text-meopta-text-secondary lg:text-16">
                  {item.description}
                </p>
              )}

              {item.linkLabel && item.linkUrl && (
                <a
                  href={item.linkUrl}
                  className="mt-auto inline-flex h-14 items-center rounded-full bg-meopta-blue px-6 text-[0.875rem] font-medium text-white no-underline transition-colors hover:bg-meopta-blue-hover"
                >
                  {item.linkLabel}
                  <ArrowRight />
                </a>
              )}
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
};
