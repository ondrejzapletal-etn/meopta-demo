'use client';

import { InfoCenterCardsBlock as InfoCenterCardsBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { getImageSrcWithFallback } from '../../../utils/images';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const CardIllustration = () => (
  <svg fill="none" viewBox="0 0 56 56" className="h-16 w-16 lg:h-20 lg:w-20" aria-hidden="true">
    <path fill="#000" d="M28.83 50.62c5.75-.27 10.32-2.31 10.22-4.55-.11-2.24-4.85-3.83-10.6-3.56-5.75.27-10.32 2.31-10.22 4.55.11 2.24 4.85 3.83 10.6 3.56Z" opacity=".2" />
    <path fill="#9c3" d="M41.03 35.37c.31-1.51.49-3.1.52-4.73l-3.3-1.66c-.03-.73-.09-1.47-.19-2.21-.18-1.37-.47-2.68-.85-3.93l2.35-3.17a22 22 0 0 0-1.77-2.75l-3.1 1.21c-1.99-3.13-4.66-5.42-7.6-6.47l-.67-3.64a12 12 0 0 0-2.9-.11l-.84 3.35c-.17.01-.33.03-.5.05a12 12 0 0 0-5.98 2.91l-2.27-2.13a17 17 0 0 0-2.57 3.27l1.64 3.26a18 18 0 0 0-1.49 3.48l-3.02-.08c-.32 1.56-.5 3.2-.52 4.88l2.97 1.49c.03.73.09 1.47.19 2.21.18 1.37.47 2.68.85 3.93l-2.14 2.88c.52 1.33 1.13 2.59 1.82 3.77l2.83-1.11c1.99 3.13 4.66 5.42 7.6 6.47l.66 3.56c.96.23 1.93.36 2.92.38l.84-3.34c.17-.01.33-.03.5-.05a12 12 0 0 0 5.98-2.91l2.44 2.29c.95-.92 1.8-1.97 2.55-3.13l-1.79-3.56a18 18 0 0 0 1.49-3.48l3.35.09Zm-15.07 3.57c-3.57.47-7.06-3.75-7.81-9.43-.75-5.68 1.54-10.66 5.1-11.13 3.57-.47 7.06 3.75 7.81 9.43.75 5.68-1.54 10.66-5.1 11.13Z" />
    <ellipse cx="27.7" cy="27.5" rx="7.5" ry="10.5" stroke="#1E3300" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-8 27.7 27.5)" fill="none" />
  </svg>
);

export const InfoCenterCardsBlock = ({
  title,
  items,
}: InfoCenterCardsBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) return null;

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

        <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item, i) => {
            const iconSrc = item.icon && typeof item.icon === 'object' ? getImageSrcWithFallback(item.icon) : '';

            return (
              <div
                key={item.id ?? i}
                className={cn(
                  `
                    flex flex-col items-center rounded-2xl border
                    border-meopta-border bg-white p-6 text-center opacity-0
                    transition-shadow
                    hover:shadow-lg
                    lg:p-8
                  `,
                  isVisible && 'animate-fade-in-up',
                )}
              >
                <div className="mb-4">
                  {iconSrc
                    ? (
                        <div className="relative h-16 w-16 lg:h-20 lg:w-20">
                          <Image
                            src={iconSrc}
                            alt={item.title ?? ''}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )
                    : (
                        <CardIllustration />
                      )}
                </div>

                {item.title && (
                  <Typography variant="h5" className="mb-2 text-meopta-text-primary">
                    {item.title}
                  </Typography>
                )}

                {item.description && (
                  <p className="mb-4 flex-1 text-14 leading-relaxed text-meopta-text-secondary lg:text-16">
                    {item.description}
                  </p>
                )}

                {item.linkLabel && item.linkUrl && (
                  <a
                    href={item.linkUrl}
                    className="mt-auto inline-flex items-center gap-1 text-14 font-semibold text-meopta-blue-dark no-underline transition-colors hover:text-meopta-blue-hover lg:text-16"
                  >
                    {item.linkLabel}
                    <svg viewBox="0 0 25 25" fill="currentColor" className="ml-1 inline-block h-5 w-5 flex-shrink-0" aria-hidden="true">
                      <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
                    </svg>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
