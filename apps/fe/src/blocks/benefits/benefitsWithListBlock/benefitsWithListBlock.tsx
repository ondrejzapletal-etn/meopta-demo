'use client';

import Image from 'next/image';
import { BenefitsWithListBlock as BenefitsWithListBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

/** Green checkmark SVG icon matching the Airbank design */
const CheckIcon = () => (
  <svg
    viewBox="0 0 25 25"
    fill="none"
    className="h-10 w-10 flex-shrink-0 text-meopta-blue-dark"
    aria-hidden="true"
  >
    <defs>
      <path
        d="M19.3 7.762a.7.7 0 0 0-.99 0l-7.972 7.972-3.65-3.609a.701.701 0 1 0-.985.995l4.04 3.995c.027.041.046.086.082.122a.697.697 0 0 0 .99 0l8.484-8.485a.697.697 0 0 0 0-.99"
        id="tick_svg__a"
      />
    </defs>
    <use xlinkHref="#tick_svg__a" fill="currentColor" fillRule="evenodd" />
  </svg>
);

export const BenefitsWithListBlock = ({
  title,
  description,
  cards,
  items,
  backgroundColor,
}: BenefitsWithListBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  const hasCards = cards && cards.length > 0;
  const hasItems = items && items.length > 0;
  const isGreyCards = backgroundColor === 'lightGrey';
  const bgClass = backgroundColor === 'green'
    ? 'bg-meopta-blue'
    : backgroundColor === 'lightGrey'
      ? 'bg-meopta-bg-light'
      : 'bg-white';

  if (!hasCards && !hasItems) return null;

  return (
    <div className={cn('w-full', bgClass)}>
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-8 lg:pt-12',
          'pb-8 lg:pb-12',
        )}
      >
        <div
          ref={ref}
          className={cn(
            'opacity-0',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {/* Header: title + perex */}
          {(title || description) && (
            <div className="mb-8 text-center lg:mb-10">
              {title && (
                <Typography variant="h3" className="text-meopta-text-primary">
                  {title}
                </Typography>
              )}
              {description && (
                <p className="mt-3 text-16 text-meopta-text-secondary lg:text-18">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Cards row */}
          {hasCards && (
            <div className={cn(
              'flex flex-col gap-6',
              isGreyCards
                ? `
                  mx-auto max-w-[880px]
                  md:flex-row md:flex-wrap md:justify-center
                `
                : 'mb-10 md:flex-row md:flex-wrap md:justify-center lg:gap-8',
            )}
            >
              {cards.map((card, i) => {
                const iconSrc = getImageSrcWithFallback(card.icon);
                return (
                  <article
                    key={card.id ?? i}
                    className={cn(
                      isGreyCards
                        ? `
                          flex flex-row items-start gap-4 rounded-md bg-white
                          p-8 shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                          md:w-[calc(50%-12px)]
                        `
                        : `
                          flex flex-col items-center text-center
                          md:w-[calc(50%-12px)]
                          lg:w-[calc(33.333%-16px)]
                        `,
                    )}
                  >
                    {iconSrc && (
                      <div className={cn(
                        'relative flex-shrink-0',
                        isGreyCards ? 'h-16 w-16' : 'mb-4 h-14 w-14',
                      )}
                      >
                        <Image
                          src={iconSrc}
                          alt={card.title ?? ''}
                          width={isGreyCards ? 64 : 56}
                          height={isGreyCards ? 64 : 56}
                          className={cn(
                            'object-contain',
                            isGreyCards ? 'h-16 w-16' : 'h-14 w-14',
                          )}
                        />
                      </div>
                    )}
                    <div>
                      {card.title && (
                        <h3 className={cn(
                          'font-bold text-meopta-text-primary',
                          isGreyCards
                            ? 'mb-1 text-16'
                            : `mb-1 text-16 lg:text-18`,
                        )}
                        >
                          {card.title}
                        </h3>
                      )}
                      {card.text && (
                        <p className="text-14 text-meopta-text-secondary">
                          {card.text}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Checkmark list items in outlined boxes */}
          {hasItems && (
            <div className={cn(
              `
                mx-auto flex flex-col gap-6
                md:flex-row md:flex-wrap md:justify-center
              `,
              items.length === 4
                ? 'max-w-[1100px]'
                : 'max-w-[820px]',
            )}
            >
              {items.map((item, i) => (
                <div
                  key={item.id ?? i}
                  className={cn(
                    `
                      relative rounded-xl border border-meopta-border bg-white
                      px-5 pt-7 pb-5 text-center
                    `,
                    isGreyCards && 'rounded-md',
                    items.length === 4
                      ? 'md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]'
                      : 'md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]',
                  )}
                >
                  {/* Checkmark centered on top border */}
                  <div className={cn(`
                    absolute -top-4 left-1/2 -translate-x-1/2 px-1
                  `, bgClass)}
                  >
                    <CheckIcon />
                  </div>
                  <p className="text-14 text-meopta-text-secondary lg:text-16">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Glossary footnote for grey-cards variant */}
          {isGreyCards && (
            <p className="mt-8 text-center text-14 text-meopta-text-secondary lg:text-16">
              Nerozumíte nějakému pojmu související s
              {'\u00a0'}
              hypotékou? Podívejte se do našeho
              {' '}
              <a
                href="https://www.airbank.cz/file-download/hypotecni-slovnicek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-meopta-text-secondary underline hover:no-underline"
              >
                hypotečního slovníčku
              </a>
              .
            </p>
          )}
        </div>
      </Container>
    </div>
  );
};
