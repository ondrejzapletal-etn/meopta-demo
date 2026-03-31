'use client';

import { ExchangeRatesBlock as ExchangeRatesBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

/**
 * Derive a flag emoji from a currency code.
 * Uses the first 2 characters as an ISO 3166-1 alpha-2 country code and
 * converts them to regional indicator symbols.
 * Example: "USD" -> "US" -> US flag emoji.
 */
const currencyCodeToFlag = (code: string): string => {
  const countryCode = code.slice(0, 2).toUpperCase();
  const codePoints = [...countryCode].map(
    (char) => 0x1f1e6 + char.charCodeAt(0) - 65,
  );
  return String.fromCodePoint(...codePoints);
};

export const ExchangeRatesBlock = ({
  title,
  lastUpdated,
  rates,
}: ExchangeRatesBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!rates || rates.length === 0) return null;

  const hasMidRate = rates.some((r) => r.midRate);

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
        {/* Header row: title + lastUpdated */}
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between lg:mb-12">
          {title && (
            <Typography variant="h2" className="text-meopta-text-primary">
              {title}
            </Typography>
          )}

          {lastUpdated && (
            <span className="text-12 text-meopta-text-secondary lg:text-14">
              {lastUpdated}
            </span>
          )}
        </div>

        {/* Table with horizontal scroll */}
        <div
          ref={ref}
          className={cn(
            '-mx-4 overflow-x-auto px-4 opacity-0 md:mx-0 md:px-0',
            isVisible && 'animate-fade-in-up',
          )}
        >
          <table className="w-full min-w-[540px] border-collapse">
            <thead>
              <tr>
                <th className="rounded-tl-lg bg-meopta-blue px-4 py-3 text-left text-14 font-bold text-white lg:px-6 lg:py-4 lg:text-16">
                  Currency
                </th>
                <th className="bg-meopta-blue px-4 py-3 text-right text-14 font-bold text-white lg:px-6 lg:py-4 lg:text-16">
                  Buy
                </th>
                <th className="bg-meopta-blue px-4 py-3 text-right text-14 font-bold text-white lg:px-6 lg:py-4 lg:text-16">
                  Sell
                </th>
                {hasMidRate && (
                  <th className="rounded-tr-lg bg-meopta-blue px-4 py-3 text-right text-14 font-bold text-white lg:px-6 lg:py-4 lg:text-16">
                    Mid
                  </th>
                )}
                {!hasMidRate && (
                  <th className="rounded-tr-lg bg-meopta-blue" aria-hidden="true" />
                )}
              </tr>
            </thead>
            <tbody>
              {rates.map((rate, idx) => {
                const isEven = idx % 2 === 0;
                const isLast = idx === rates.length - 1;

                return (
                  <tr
                    key={rate.id ?? idx}
                    className={cn(
                      'transition-colors hover:bg-meopta-blue-light/50',
                      isEven ? 'bg-meopta-bg-light' : 'bg-white',
                    )}
                  >
                    {/* Currency info */}
                    <td
                      className={cn(
                        `
                          border-b border-meopta-border px-4 py-3
                          lg:px-6 lg:py-4
                        `,
                        isLast && 'rounded-bl-lg border-b-0',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-20 leading-none" role="img" aria-label={rate.currencyCode}>
                          {currencyCodeToFlag(rate.currencyCode)}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-14 font-semibold text-meopta-text-primary lg:text-16">
                            {rate.currencyCode}
                          </span>
                          <span className="text-12 text-meopta-text-secondary lg:text-14">
                            {rate.currencyName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Buy rate */}
                    <td
                      className={cn(
                        `
                          border-b border-meopta-border px-4 py-3 text-right
                          text-14 font-medium text-meopta-text-primary
                          lg:px-6 lg:py-4 lg:text-16
                        `,
                        isLast && 'border-b-0',
                      )}
                    >
                      {rate.buyRate}
                    </td>

                    {/* Sell rate */}
                    <td
                      className={cn(
                        `
                          border-b border-meopta-border px-4 py-3 text-right
                          text-14 font-medium text-meopta-text-primary
                          lg:px-6 lg:py-4 lg:text-16
                        `,
                        isLast && 'border-b-0',
                      )}
                    >
                      {rate.sellRate}
                    </td>

                    {/* Mid rate (optional) */}
                    {hasMidRate && (
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
                        {rate.midRate ?? '-'}
                      </td>
                    )}
                    {!hasMidRate && (
                      <td
                        className={cn(
                          'border-b border-meopta-border',
                          isLast && 'rounded-br-lg border-b-0',
                        )}
                        aria-hidden="true"
                      />
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
