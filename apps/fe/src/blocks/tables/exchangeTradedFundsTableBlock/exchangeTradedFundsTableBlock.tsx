'use client';

import { ExchangeTradedFundsTableBlock as ExchangeTradedFundsTableBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const ExchangeTradedFundsTableBlock = ({
  title,
  columns,
  rows,
}: ExchangeTradedFundsTableBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!columns || columns.length === 0 || !rows || rows.length === 0) return null;

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
          <Typography variant="h2" className="mb-8 text-meopta-text-primary lg:mb-12">
            {title}
          </Typography>
        )}

        {/* Horizontal scroll wrapper for mobile */}
        <div
          ref={ref}
          className={cn(
            '-mx-4 overflow-x-auto px-4 opacity-0 md:mx-0 md:px-0',
            isVisible && 'animate-fade-in-up',
          )}
        >
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                {/* Empty header cell for the row label column */}
                <th className="rounded-tl-lg bg-meopta-blue px-4 py-3 text-left text-14 font-bold text-white lg:px-6 lg:py-4 lg:text-16">
                  &nbsp;
                </th>
                {columns.map((col, i) => (
                  <th
                    key={col.id ?? i}
                    className={cn(
                      `
                        bg-meopta-blue px-4 py-3 text-left text-14 font-bold
                        text-white
                        lg:px-6 lg:py-4 lg:text-16
                      `,
                      i === columns.length - 1 && 'rounded-tr-lg',
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => {
                const isEven = rowIdx % 2 === 0;
                const isLast = rowIdx === rows.length - 1;

                return (
                  <tr
                    key={row.id ?? rowIdx}
                    className={cn(
                      'transition-colors hover:bg-meopta-blue-light/50',
                      isEven ? 'bg-meopta-bg-light' : 'bg-white',
                    )}
                  >
                    <td
                      className={cn(
                        `
                          border-b border-meopta-border px-4 py-3 text-14
                          font-semibold text-meopta-text-primary
                          lg:px-6 lg:py-4 lg:text-16
                        `,
                        isLast && 'rounded-bl-lg border-b-0',
                      )}
                    >
                      {row.label}
                    </td>
                    {row.values?.map((cell, cellIdx) => (
                      <td
                        key={cell.id ?? cellIdx}
                        className={cn(
                          `
                            border-b border-meopta-border px-4 py-3 text-14
                            text-meopta-text-secondary
                            lg:px-6 lg:py-4 lg:text-16
                          `,
                          isLast && 'border-b-0',
                          isLast && cellIdx === (row.values?.length ?? 0) - 1 && `
                            rounded-br-lg
                          `,
                        )}
                      >
                        {cell.value ?? '-'}
                      </td>
                    ))}
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
