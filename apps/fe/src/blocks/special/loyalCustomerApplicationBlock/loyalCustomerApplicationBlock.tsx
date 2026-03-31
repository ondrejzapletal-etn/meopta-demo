'use client';

import { LoyalCustomerApplicationBlock as LoyalCustomerApplicationBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';
import Image from 'next/image';
import { getImageSrcWithFallback } from '../../../utils/images';

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <svg key={i} className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>,
      );
    } else if (i - 0.5 <= rating) {
      stars.push(
        <svg key={i} className="h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <linearGradient id={`half-star-loyal-${i}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="currentColor" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={`url(#half-star-loyal-${i})`} />
        </svg>,
      );
    } else {
      stars.push(
        <svg key={i} className="h-5 w-5 text-white/30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>,
      );
    }
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

const AppStoreBadge = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/appstore-badge.svg" alt="Download on the App Store" width={170} height={50} className="h-[50px] w-[170px]" />
);

const GooglePlayBadge = () => (
  <svg viewBox="0 0 162 48" className="h-[50px] w-[170px]" aria-hidden="true">
    <defs>
      <clipPath id="gp-clip-loyal-a"><path d="M0 44.14h129.29V5.86H0z" /></clipPath>
    </defs>
    <g clipPath="url(#gp-clip-loyal-a)" transform="matrix(.13333 0 0 -.13333 0 6.67) scale(10 10) translate(0 -4.414)">
      <path fill="#100f0d" d="M124.41 5.86H4.79C2.15 5.86 0 8.02 0 10.64v28.73c0 2.63 2.15 4.79 4.79 4.79h119.62c2.63 0 4.79-2.16 4.79-4.79V10.64c0-2.62-2.16-4.78-4.79-4.78" />
      <path fill="#a2a2a1" d="M124.41 44.14H4.79C2.15 44.14 0 41.99 0 39.37V10.64C0 8.01 2.15 5.86 4.79 5.86h119.62c2.63 0 4.79 2.15 4.79 4.78v28.73c0 2.62-2.16 4.77-4.79 4.77m0-.77c2.22 0 4.02-1.8 4.02-4.01V10.64c0-2.22-1.8-4.02-4.02-4.02H4.79c-2.22 0-4.02 1.8-4.02 4.02v28.72c0 2.21 1.8 4.01 4.02 4.01h119.62" />
    </g>
    <g transform="translate(13 10.5) scale(.052)">
      <path fill="#eb3131" d="M67.83 71.16 33.07 11.94c.003-.006.003-.016.006-.022 1.04-3.91 4.62-6.8 8.86-6.8 1.7 0 3.29.46 4.65 1.26l.11.064L84.93 28.5 67.83 71.16z" />
      <path fill="#f6b60b" d="M101.35 17.66l-.47.34-16.12 9.32-17.89-10.5 16.06 11.68 16.42-10.84z" />
      <path fill="#5778c5" d="M33.06 81.7c-.2-.75-.31-1.54-.31-2.36V11.92c0-.82.11-1.61.32-2.36l35.16 35.15-35.17 37.0z" />
      <path fill="#3bad49" d="M67.4 47.7l17.59 17.59-38.22 22.16c-1.39.83-3.01 1.31-4.74 1.31-4.25 0-7.83-2.89-8.88-6.81 0-.003-.003-.007-.003-.01L67.4 47.7z" />
    </g>
    <g fill="#FFF">
      <text x="81" y="12.5" textAnchor="middle" fontSize="5.2" fontFamily="Arial, sans-serif" letterSpacing=".3">ROZJEĎTE TO NA</text>
      <text x="81" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="Arial, sans-serif">Google Play</text>
    </g>
  </svg>
);

interface Props extends LoyalCustomerApplicationBlockType {
  appStoreUrl?: string;
  googlePlayUrl?: string;
}

export const LoyalCustomerApplicationBlock = ({
  title,
  description,
  image,
  appStoreUrl,
  googlePlayUrl,
  rating,
}: Props) => {
  const { ref, isVisible } = useScrollAnimation();
  const ratingValue = parseFloat(rating ?? '4.8') || 4.8;

  return (
    <div className="w-full">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-20',
        )}
      >
        <div
          ref={ref}
          className={cn(
            `
              overflow-hidden rounded-2xl bg-meopta-blue opacity-0
              lg:rounded-3xl
            `,
            isVisible && 'animate-fade-in-up',
          )}
        >
          <div className="flex flex-col items-center lg:flex-row">
            <div className="flex flex-1 flex-col items-start p-8 lg:p-12 xl:p-16">
              <Typography variant="h2" className="mb-4 text-white">
                {title}
              </Typography>

              {description && (
                <p className="mb-6 text-16 leading-relaxed text-white/90 lg:text-18">
                  {description}
                </p>
              )}

              <div className="mb-6 flex items-center gap-3">
                <StarRating rating={ratingValue} />
                <span className="text-18 font-bold text-white">{ratingValue.toFixed(1)}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {appStoreUrl && (
                  <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-flex transition-opacity hover:opacity-80" aria-label="Download on the App Store">
                    <AppStoreBadge />
                  </a>
                )}
                {googlePlayUrl && (
                  <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="inline-flex transition-opacity hover:opacity-80" aria-label="Get it on Google Play">
                    <GooglePlayBadge />
                  </a>
                )}
              </div>
            </div>

            {image && (
              <div className="relative h-[300px] w-full flex-shrink-0 md:h-[360px] lg:h-[420px] lg:w-[45%]">
                <Image
                  src={getImageSrcWithFallback(image)}
                  alt={title}
                  fill
                  className="object-contain object-bottom lg:object-right-bottom"
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
