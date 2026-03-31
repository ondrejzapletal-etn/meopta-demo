'use client';

import { ExchangeCompareTableBlock as ExchangeCompareTableBlockType, Media } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';
import Image from 'next/image';
import { getImageSrcWithFallback } from '../../../utils/images';

export const ExchangeCompareTableBlock = ({
  title,
  providers,
  currencies,
}: ExchangeCompareTableBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!providers || providers.length === 0 || !currencies || currencies.length === 0) return null;

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
                <th className="bg-meopta-bg-light px-4 py-4 lg:px-6 lg:py-5" />
                {providers.map((provider, idx) => {
                  const logoSrc = getImageSrcWithFallback(provider.logo as Media | (number | null), { width: 80, height: 40 });

                  return (
                    <th
                      key={provider.id ?? idx}
                      className={cn(
                        `
                          bg-meopta-bg-light px-4 py-4 text-center
                          lg:px-6 lg:py-5
                        `,
                        idx === 0 && 'bg-meopta-blue-light',
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {logoSrc && (
                          <div className="relative h-8 w-16 lg:h-10 lg:w-20">
                            <Image src={logoSrc} alt={provider.name} fill className="object-contain" />
                          </div>
                        )}
                        <span className={cn('text-13 font-bold lg:text-15', idx === 0
                          ? `text-meopta-blue-dark`
                          : `text-meopta-text-primary`)}
                        >
                          {provider.name}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {currencies.map((currency, cIdx) => (
                <tr
                  key={currency.id ?? cIdx}
                  className={cn('transition-colors', cIdx % 2 === 0
                    ? 'bg-white'
                    : `bg-meopta-bg-light/50`)}
                >
                  <td className="border-b border-meopta-border px-4 py-3 text-14 font-semibold text-meopta-text-primary lg:px-6 lg:py-4 lg:text-16">
                    {currency.label}
                  </td>
                  {currency.values?.map((cell, cellIdx) => (
                    <td
                      key={cell.id ?? cellIdx}
                      className={cn(
                        `
                          border-b border-meopta-border px-4 py-3 text-center
                          text-14
                          lg:px-6 lg:py-4 lg:text-16
                        `,
                        cell.highlighted
                          ? `
                            bg-meopta-blue-light/60 font-semibold
                            text-meopta-blue-dark
                          `
                          : `text-meopta-text-secondary`,
                        !cell.highlighted && cellIdx === 0 && `
                          bg-meopta-blue-light/30
                        `,
                      )}
                    >
                      {cell.value ?? '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
};
