'use client';

import { CompareBondsTableBlock as CompareBondsTableBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const CompareBondsTableBlock = ({
  title,
  description,
  rows,
}: CompareBondsTableBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!rows || rows.length === 0) return null;

  const hasMinAmount = rows.some((r) => r.minAmount);

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
          <Typography variant="h2" className="mb-4 text-meopta-text-primary lg:mb-6">
            {title}
          </Typography>
        )}

        {description && (
          <p className="mb-8 max-w-2xl text-14 leading-relaxed text-meopta-text-secondary lg:mb-12 lg:text-16">
            {description}
          </p>
        )}

        {/* Horizontal scroll wrapper for mobile */}
        <div
          ref={ref}
          className={cn(
            '-mx-4 overflow-x-auto px-4 opacity-0 md:mx-0 md:px-0',
            isVisible && 'animate-fade-in-up',
          )}
        >
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr>
                <th className="rounded-tl-lg bg-meopta-blue px-4 py-3 text-left text-14 font-bold text-white lg:px-6 lg:py-4 lg:text-16">
                  Period
                </th>
                <th className={cn(
                  `
                    bg-meopta-blue px-4 py-3 text-right text-14 font-bold
                    text-white
                    lg:px-6 lg:py-4 lg:text-16
                  `,
                  !hasMinAmount && 'rounded-tr-lg',
                )}
                >
                  Interest rate
                </th>
                {hasMinAmount && (
                  <th className="rounded-tr-lg bg-meopta-blue px-4 py-3 text-right text-14 font-bold text-white lg:px-6 lg:py-4 lg:text-16">
                    Min. amount
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const isLast = idx === rows.length - 1;

                return (
                  <tr
                    key={row.id ?? idx}
                    className={cn(
                      'transition-colors',
                      row.highlighted
                        ? 'bg-meopta-blue-light hover:bg-meopta-blue-light/80'
                        : idx % 2 === 0
                          ? 'bg-meopta-bg-light hover:bg-meopta-blue-light/30'
                          : 'bg-white hover:bg-meopta-blue-light/30',
                    )}
                  >
                    {/* Period */}
                    <td
                      className={cn(
                        `
                          border-b border-meopta-border px-4 py-3 text-14
                          font-semibold text-meopta-text-primary
                          lg:px-6 lg:py-4 lg:text-16
                        `,
                        row.highlighted && 'border-l-4 border-l-meopta-blue-dark',
                        isLast && 'rounded-bl-lg border-b-0',
                      )}
                    >
                      {row.period}
                    </td>

                    {/* Interest rate */}
                    <td
                      className={cn(
                        `
                          border-b border-meopta-border px-4 py-3 text-right text-14
                          lg:px-6 lg:py-4 lg:text-16
                        `,
                        row.highlighted
                          ? 'font-bold text-meopta-blue-dark'
                          : 'font-medium text-meopta-text-primary',
                        isLast && 'border-b-0',
                        isLast && !hasMinAmount && 'rounded-br-lg',
                      )}
                    >
                      {row.interestRate}
                    </td>

                    {/* Min. amount (conditional column) */}
                    {hasMinAmount && (
                      <td
                        className={cn(
                          `
                            border-b border-meopta-border px-4 py-3 text-right
                            text-14 text-meopta-text-secondary
                            lg:px-6 lg:py-4 lg:text-16
                          `,
                          isLast && 'rounded-br-lg border-b-0',
                        )}
                      >
                        {row.minAmount ?? '-'}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
};
