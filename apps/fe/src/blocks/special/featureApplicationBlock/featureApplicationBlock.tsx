'use client';

import { FeatureApplicationBlock as FeatureApplicationBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { PillLink } from '../../../components/link/pillLink';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';
import { getImageSrcWithFallback } from '../../../utils/images';

/** Renders N filled star characters */
const StarRating = ({ count = 5 }: { count?: number }) => (
  <span className="text-14 tracking-wider text-[#f5c518]" aria-label={`${count} out of 5 stars`}>
    {'★'.repeat(count)}
  </span>
);

/** My Air app icon — from original airbank.cz */
const MyAirIcon = () => (
  <svg viewBox="0 0 60 60" className="h-12 w-12 shrink-0" aria-hidden="true">
    <g fill="none" fillRule="evenodd">
      <rect fill="#9C3" width="60" height="60" rx="8" />
      <g fillRule="nonzero">
        <path d="M37.32 39.76c-.1-.67-.1-1.16-.1-1.48-1.2 1.74-2.64 1.74-3.24 1.74-1.56 0-2.27-.45-2.7-.86a3.36 3.36 0 01-.95-2.38c0-.86.3-2.44 2.3-3.37 1.33-.6 3.24-.6 4.3-.6 0-.7-.03-1.05-.16-1.44-.28-.8-1.11-.9-1.41-.9-.46 0-.93.2-1.2.6-.24.37-.24.71-.24.97H30.8c.02-.58.08-1.74 1.22-2.55.99-.71 2.25-.88 3.28-.88.9 0 2.79.15 3.86 1.39.73.88.75 2.17.75 2.66l.03 4.35c0 .93.02 1.85.2 2.75h-2.83zm-3.9-3.35c0 .73.5 1.55 1.55 1.55a1.8 1.8 0 001.35-.62c.56-.69.6-1.53.6-2.69-2.04-.17-3.5.48-3.5 1.76zm8.55 3.33V28.86h3.18v10.88h-3.18zm8.34-8.77c.4-.92 1.12-2.23 3.69-2.1v2.86c-3.22-.3-3.41 1.35-3.41 2.7v5.34H47.4V31.6c0-.52-.08-2.08-.15-2.7h2.99l.06 2.07z" fill="#000" />
        <path d="M28.77 27.41c-.04.11.02-.11-.02.04 1.01-.97 2.37-1.78 2.65-1.76 0 .36-.67.83-1.4 1.4-1 .83-1.56 1.6-1.56 1.6-1.61 6.08-2.28 10.91-4.9 10.73-1.17-.09-1.76-1.16-1.78-2.07-.06-2.96 2.56-5.96 5.27-8.93.19-.73.32-1.01.52-1.76-1.27 1.86-2.74 3.32-3.81 3.39-1.13.07-1.28-.38-1.28-1.13 0-.28.02-.58.06-.9-.75.82-1.98 1.84-3.09 1.8-2-.05-1.51-2.37-1.42-3.07.2-1.4.4-2.13.53-3 .05-.33.1-.5.11-.72-.78.67-2.44 2.58-4.46 6.6v.03s-.23.7-.95.6c-1.1-.07-1.2-.72-1.2-1.05.29-1.77 1.05-4.4 1.5-6.25-2.12 1.56-3.7 4.38-5.05 6.3-.74 1.04-1.2 1.76-1.45 1.8-.3.02-1.12-.4-1.03-.77a47.1 47.1 0 002.3-7.93c-.07.09-.18.14-.26.13-.44-.03-.6-.29-.6-.64 0-.64.73-1.5 1.46-1.45.58.04 1.27.37 1.21.84a25.76 25.76 0 01-1.16 4.55c2.24-2.86 3.85-4.87 5-5.23.6-.15 1.28.32 1.1 1.5-.1.75-.2 1.33-.34 1.86-.18.8-.32 1.33-.73 2.87 1.17-1.67 2.01-2.92 2.62-3.86 1-1.58 1.41-2.26 1.98-2.43.57-.1 1.54.07 1.54 1.36 0 .76-.17 1.79-.26 2.8-.2 2.19-.46 3.66.1 3.7.47.03 1.83-.35 2.63-.97.24-1.5.7-3.14.97-4.1.11-.35.18-.65.32-.9-.34-.09-.59-.47-.6-.8-.01-.66.63-1.23 1.34-1.18.45.03 1.2.25 1.2 1.01 0 .04-.01.2-.07.43-.2 1.11-1.22 4.86-1.27 6.27 1.06-.14 3.35-3.66 4.55-5.61.67-1.06 1.16-1.85 1.4-1.83.13.01.43.05.43.32a61.92 61.92 0 00-2.1 6.41zm-5.41 10.9c1.14.07 1.44-1.92 3.15-8.05-1.63 1.95-3.13 4.85-3.13 7-.02.2-.02.5-.02.73v.31z" fill="#FFF" />
      </g>
    </g>
  </svg>
);

/** Apple App Store badge */
const AppStoreBadge = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/appstore-badge.svg" alt="Download on the App Store" width={170} height={50} className="h-[50px] w-[170px]" />
);

/** Google Play badge — uses static SVG file extracted from original airbank.cz */
const GooglePlayBadge = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/gplay-badge.svg" alt="Get it on Google Play" width={170} height={50} className="h-[50px] w-[170px]" />
);

/** Small App Store icon for review cards */
const AppStoreIcon = () => (
  <svg viewBox="0 0 24 24" className="h-12 w-12 shrink-0 rounded-lg" aria-hidden="true">
    <rect width="24" height="24" rx="5" fill="#2196F3" />
    <path d="M12 4.5l1.8 3.5h3.7l-3 2.7.9 3.8L12 12.3 8.6 14.5l.9-3.8-3-2.7h3.7L12 4.5z" fill="#fff" opacity=".9" />
    <path d="M12 6l1.2 2.4h2.5l-2 1.8.6 2.6L12 11.2l-2.3 1.6.6-2.6-2-1.8h2.5L12 6z" fill="#fff" />
  </svg>
);

/** Small Google Play icon for review cards */
const GooglePlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-12 w-12 shrink-0 rounded-lg" aria-hidden="true">
    <rect width="24" height="24" rx="5" fill="#fff" stroke="#e0e0e0" strokeWidth=".5" />
    <g transform="translate(4 4) scale(.67)">
      <path fill="#4285F4" d="M3 2.5l8.5 8.5L3 19.5V2.5z" />
      <path fill="#EA4335" d="M3 2.5l12 7-3.5 3.5L3 2.5z" />
      <path fill="#34A853" d="M3 19.5l8.5-6.5L15 16.5 3 19.5z" />
      <path fill="#FBBC04" d="M15 9.5l3 1.5-3 1.5-3.5-1.5L15 9.5z" />
    </g>
  </svg>
);

/** Single review card */
const ReviewCard = ({
  author,
  date,
  title,
  text,
  stars = 5,
  store,
}: {
  author?: string | null;
  date?: string | null;
  title?: string | null;
  text?: string | null;
  stars?: number | null;
  store?: ('appStore' | 'googlePlay') | null;
}) => (
  <div className="flex gap-3 rounded-lg bg-[#f5f5f5] p-4">
    <div className="flex-1">
      <StarRating count={stars ?? 5} />
      <p className="mt-1 text-13 text-meopta-text-secondary">
        {author}
        ,
        {date}
      </p>
      {title && <p className="mt-2 text-14 font-bold text-meopta-text-primary">{title}</p>}
      <p className="mt-1 line-clamp-4 text-14 leading-relaxed text-meopta-text-secondary">{text}</p>
    </div>
    <div className="shrink-0">
      {store === 'appStore' ? <AppStoreIcon /> : <GooglePlayIcon />}
    </div>
  </div>
);

interface Props extends FeatureApplicationBlockType {
  appStoreUrl?: string;
  googlePlayUrl?: string;
}

export const FeatureApplicationBlock = ({
  title,
  subtitle,
  description,
  image,
  linkLabel,
  linkUrl,
  appStoreUrl,
  googlePlayUrl,
  rating,
  ratingCount,
  reviews,
}: Props) => {
  const { ref, isVisible } = useScrollAnimation();
  const ratingValue = parseFloat(rating ?? '4.9') || 4.9;

  return (
    <div className="w-full bg-[#f5f5f5]">
      <Container
        size="ab-content"
        className={cn(
          'relative overflow-hidden',
          'pt-12 lg:pt-16',
          'pb-12 lg:pb-16',
        )}
      >
        <div
          ref={ref}
          className={cn('opacity-0', isVisible && 'animate-fade-in-up')}
        >
          {/* Mobile: stacked layout */}
          {image && (
            <div className="mb-8 flex justify-center md:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageSrcWithFallback(image)}
                alt={title}
                className="h-auto w-full max-w-[400px]"
              />
            </div>
          )}

          {/* Medium + Large: relative container with absolutely-positioned image */}
          <div className="relative">
            {/* Phone image - absolutely positioned LEFT (md+) */}
            {image && (
              <div className="pointer-events-none absolute -left-5 top-0 hidden h-full w-[53%] md:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageSrcWithFallback(image)}
                  alt={title}
                  className="h-auto w-full max-w-[660px]"
                />
              </div>
            )}

            {/* Text content - RIGHT, takes ~58% width on md+ */}
            <div className="md:ml-auto md:w-[58%] md:pl-8">
              <h2 className="mb-0 text-24 font-medium leading-[1.2] text-meopta-text-primary lg:text-[32px]">
                {title}
              </h2>

              {subtitle && (
                <p className="mt-3 text-20 font-light leading-[1.4] text-meopta-text-primary lg:text-[28px]">
                  {subtitle}
                </p>
              )}

              {description && (
                <p className="mt-4 text-16 leading-relaxed text-meopta-text-secondary lg:text-18">
                  {description}
                </p>
              )}

              {/* Links: stacked on md, row on lg */}
              <div className="mt-8 flex flex-wrap items-center gap-4 md:flex-col md:items-start lg:flex-row lg:items-center">
                {linkLabel && linkUrl && (
                  <PillLink href={linkUrl}>{linkLabel}</PillLink>
                )}
                {appStoreUrl && (
                  <a
                    href={appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex transition-opacity hover:opacity-80"
                    aria-label="Download on the App Store"
                  >
                    <AppStoreBadge />
                  </a>
                )}
                {googlePlayUrl && (
                  <a
                    href={googlePlayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex transition-opacity hover:opacity-80"
                    aria-label="Get it on Google Play"
                  >
                    <GooglePlayBadge />
                  </a>
                )}
              </div>

              {/* Rating section — white background, visible only on lg+ */}
              <div className="mt-8 hidden rounded-xl bg-white p-6 lg:block">
                {/* Rating header row */}
                <div className="flex flex-wrap items-end gap-4">
                  <MyAirIcon />
                  <span className="text-18 font-medium text-meopta-text-primary lg:text-20">
                    Hodnocení aplikace
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[40px] font-medium leading-none text-meopta-text-primary lg:text-[48px]">
                      {ratingValue.toFixed(1)}
                    </span>
                    <span className="text-14 text-meopta-text-secondary">out of 5</span>
                  </div>
                  {ratingCount && (
                    <span className="ml-auto self-end text-14 text-meopta-text-secondary">
                      {ratingCount}
                      {' '}
                      Ratings
                    </span>
                  )}
                </div>

                {/* Review cards — grey background */}
                {reviews && reviews.length > 0 && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {reviews.map((review, index) => (
                      <ReviewCard key={index} {...review} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
