'use client';

import { HomepageBottomBlock as HomepageBottomBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-1.5 h-4 w-4 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

export const HomepageBottomBlock = ({
  ratesTitle,
  rates,
  ratesLinkLabel,
  ratesLinkUrl,
  newsTitle,
  news,
  newsLinkLabel,
  newsLinkUrl,
}: HomepageBottomBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="w-full bg-white">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-8 lg:pt-10',
          'pb-8 lg:pb-10',
        )}
      >
        <div
          ref={ref}
          className={cn(
            'grid gap-8 opacity-0 lg:grid-cols-2 lg:gap-12',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {/* Exchange Rates */}
          <div>
            {ratesTitle && (
              <Typography variant="h3" className="mb-6 text-meopta-text-primary">
                {ratesTitle}
              </Typography>
            )}

            {rates && rates.length > 0 && (
              <div className="overflow-hidden rounded-xl bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-meopta-border">
                      <th className="px-4 py-3 text-left text-12 font-semibold uppercase tracking-wide text-meopta-text-tertiary">
                        Měna
                      </th>
                      <th className="px-4 py-3 text-right text-12 font-semibold uppercase tracking-wide text-meopta-text-tertiary">
                        Nákup
                      </th>
                      <th className="px-4 py-3 text-right text-12 font-semibold uppercase tracking-wide text-meopta-text-tertiary">
                        Prodej
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((rate, index) => (
                      <tr
                        key={index}
                        className="border-b border-meopta-border last:border-b-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {rate.flagIcon && (
                              <Image
                                src={getImageSrcWithFallback(rate.flagIcon)}
                                alt={rate.currency}
                                width={24}
                                height={16}
                                className="shrink-0 rounded-sm"
                              />
                            )}
                            <span className="text-14 font-semibold text-meopta-text-primary">
                              {rate.currency}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-14 text-meopta-text-primary">
                          {rate.buyRate}
                        </td>
                        <td className="px-4 py-3 text-right text-14 text-meopta-text-primary">
                          {rate.sellRate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {ratesLinkLabel && ratesLinkUrl && (
              <a
                href={ratesLinkUrl}
                className="mt-4 inline-flex items-center text-14 font-semibold text-meopta-blue-dark transition-colors hover:text-meopta-blue"
              >
                {ratesLinkLabel}
                <ArrowRight />
              </a>
            )}
          </div>

          {/* News */}
          <div>
            {newsTitle && (
              <Typography variant="h3" className="mb-6 text-meopta-text-primary">
                {newsTitle}
              </Typography>
            )}

            {news && news.length > 0 && (
              <div className="space-y-4">
                {news.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white p-4"
                  >
                    <span className="mb-1 block text-12 text-meopta-text-tertiary">
                      {item.date}
                    </span>
                    {item.url
                      ? (
                          <a
                            href={item.url}
                            className="text-14 font-semibold text-meopta-text-primary no-underline transition-colors hover:text-meopta-blue-dark hover:underline"
                          >
                            {item.title}
                          </a>
                        )
                      : (
                          <p className="text-14 font-semibold text-meopta-text-primary">
                            {item.title}
                          </p>
                        )}
                  </div>
                ))}
              </div>
            )}

            {newsLinkLabel && newsLinkUrl && (
              <a
                href={newsLinkUrl}
                className="mt-4 inline-flex items-center text-14 font-semibold text-meopta-blue-dark transition-colors hover:text-meopta-blue"
              >
                {newsLinkLabel}
                <ArrowRight />
              </a>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
