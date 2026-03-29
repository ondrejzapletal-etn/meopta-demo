'use client';

import { CompareTableBlock as CompareTableBlockType, Media } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';
import Image from 'next/image';
import { getImageSrcWithFallback } from '../../../utils/images';

const CheckIcon = ({ highlighted }: { highlighted?: boolean }) => (
  <svg
    viewBox="0 0 17 13"
    className={cn('mx-auto h-4 w-4', highlighted
      ? `text-meopta-blue-dark`
      : `text-meopta-blue`)}
  >
    <path
      d="M6.3 13L0.6 7.3L2.025 5.875L6.3 10.15L15.475 0.975L16.9 2.4L6.3 13Z"
      fill="currentColor"
    />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 15 15" className="mx-auto h-4 w-4 text-[#E22A55]">
    <path
      d="M1.65 14.5L0.25 13.1L5.85 7.5L0.25 1.9L1.65 0.5L7.25 6.1L12.85 0.5L14.25 1.9L8.65 7.5L14.25 13.1L12.85 14.5L7.25 8.9L1.65 14.5Z"
      fill="currentColor"
    />
  </svg>
);

const isPositiveBoolean = (val: string | null | undefined): boolean | null => {
  if (!val) return null;
  const lower = val.toLowerCase().trim();
  if (['true', 'yes', 'ano', '1', 'check'].includes(lower)) return true;
  if (['false', 'no', 'ne', '0', 'cross'].includes(lower)) return false;
  return null;
};

export const CompareTableBlock = ({
  title,
  banks,
  features,
}: CompareTableBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!banks || banks.length === 0 || !features || features.length === 0) return null;

  const highlightedBank = banks[0]; // First bank is highlighted (Air Bank)

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
        {title && (
          <Typography variant="h2" className="mb-8 text-center text-meopta-text-primary lg:mb-12">
            {title}
          </Typography>
        )}

        <div
          ref={ref}
          className={cn(
            '-mx-4 overflow-x-auto px-4 opacity-0 md:mx-0 md:px-0',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {/* Div-based card layout */}
          <div className="flex min-w-[600px] gap-0">
            {/* Feature labels column */}
            <div className="flex w-[200px] flex-shrink-0 flex-col">
              {/* Header - empty */}
              <div className="flex h-20 items-end pb-3 lg:h-24" />

              {/* Feature labels */}
              {features.map((feature, i) => (
                <div
                  key={feature.id ?? i}
                  className="flex min-h-[52px] items-center border-b border-meopta-border/30 px-3 py-3 text-14 font-semibold text-meopta-text-primary lg:px-4 lg:text-16"
                >
                  {feature.label}
                </div>
              ))}
            </div>

            {/* Highlighted bank column (Air Bank) */}
            {highlightedBank && (
              <div className="flex flex-1 flex-col rounded-2xl bg-meopta-blue-light shadow-sm">
                {/* Bank header */}
                <div className="flex h-20 flex-col items-center justify-end gap-1 pb-3 lg:h-24">
                  {highlightedBank.logo && (
                    <div className="relative h-8 w-16 lg:h-10 lg:w-20">
                      <Image
                        src={getImageSrcWithFallback(highlightedBank.logo as Media | (number | null), { width: 80, height: 40 })}
                        alt={highlightedBank.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-13 font-bold text-meopta-blue-dark lg:text-15">
                    {highlightedBank.name}
                  </span>
                </div>

                {/* Feature values */}
                {features.map((feature, featureIdx) => {
                  const cell = feature.values?.[0];
                  const boolState = isPositiveBoolean(cell?.value);

                  return (
                    <div
                      key={feature.id ?? featureIdx}
                      className="flex min-h-[52px] flex-col items-center justify-center border-b border-meopta-blue/20 px-3 py-3 text-center"
                    >
                      {boolState === true
                        ? (
                            <CheckIcon highlighted />
                          )
                        : boolState === false
                          ? (
                              <CrossIcon />
                            )
                          : (
                              <>
                                <span className="text-15 font-bold text-meopta-blue-dark lg:text-16">
                                  {cell?.value ?? '-'}
                                </span>
                                {cell?.subtitle && (
                                  <span className="mt-0.5 text-12 text-meopta-text-secondary">
                                    {cell.subtitle}
                                  </span>
                                )}
                              </>
                            )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Competitor columns */}
            {banks.slice(1).map((bank, bankIdx) => (
              <div key={bank.id ?? bankIdx} className="flex flex-1 flex-col">
                {/* Bank header */}
                <div className="flex h-20 flex-col items-center justify-end gap-1 pb-3 lg:h-24">
                  {bank.logo && (
                    <div className="relative h-8 w-16 lg:h-10 lg:w-20">
                      <Image
                        src={getImageSrcWithFallback(bank.logo as Media | (number | null), { width: 80, height: 40 })}
                        alt={bank.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-13 font-medium text-meopta-text-primary lg:text-15">
                    {bank.name}
                  </span>
                </div>

                {/* Feature values */}
                {features.map((feature, featureIdx) => {
                  const cell = feature.values?.[bankIdx + 1];
                  const boolState = isPositiveBoolean(cell?.value);

                  return (
                    <div
                      key={feature.id ?? featureIdx}
                      className="flex min-h-[52px] flex-col items-center justify-center border-b border-meopta-border/30 px-3 py-3 text-center"
                    >
                      {boolState === true
                        ? (
                            <CheckIcon />
                          )
                        : boolState === false
                          ? (
                              <>
                                <CrossIcon />
                                {cell?.subtitle && (
                                  <span className="mt-0.5 text-12 text-meopta-text-secondary">
                                    {cell.subtitle}
                                  </span>
                                )}
                              </>
                            )
                          : (
                              <>
                                <span className="text-14 text-meopta-text-primary lg:text-15">
                                  {cell?.value ?? '-'}
                                </span>
                                {cell?.subtitle && (
                                  <span className="mt-0.5 text-12 text-meopta-text-secondary">
                                    {cell.subtitle}
                                  </span>
                                )}
                              </>
                            )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};
