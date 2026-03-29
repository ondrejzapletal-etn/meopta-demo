'use client';

import { DownloadSectionBlock as DownloadSectionBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

/** Air Bank app icon (rounded green square with "air" logo) — 72×72 matching original */
const AppIcon = () => (
  <svg viewBox="0 0 60 60" className="h-[72px] w-[72px] flex-shrink-0 rounded-xl" aria-hidden="true">
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
  <img src="/appstore-badge.svg" alt="Stáhněte si aplikaci v App Store" width={170} height={50} className="h-[50px] w-[170px]" />
);

/** Google Play badge — uses static SVG file extracted from original airbank.cz (170×50) */
const GooglePlayBadge = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/gplay-badge.svg" alt="Get it on Google Play" width={170} height={50} className="h-[50px] w-[170px]" />
);

interface Props extends DownloadSectionBlockType {
  iosUrl?: string;
  androidUrl?: string;
}

export const DownloadSectionBlock = ({
  items,
  iosUrl,
  androidUrl,
}: Props) => {
  const { ref, isVisible } = useScrollAnimation();

  const firstItem = items?.[0];
  if (!firstItem) return null;

  const appStoreUrl = iosUrl ?? 'https://apps.apple.com/app/apple-store/id593036778';
  const playStoreUrl = androidUrl ?? 'https://play.google.com/store/apps/details?id=cz.airbank.android';

  return (
    <div className="w-full bg-[#41454B]">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'py-12',
          '',
        )}
      >
        <div
          ref={ref}
          className={cn(
            `
              flex flex-col items-center gap-6 opacity-0
              md:flex-row md:flex-nowrap md:items-center md:justify-between
            `,
            isVisible && 'animate-fade-in',
          )}
        >
          {/* App icon + text */}
          <div className="flex flex-shrink-0 items-center gap-4">
            <AppIcon />
            <p className="text-18 text-white lg:text-24">
              <strong className="font-bold text-[#99CC33]">{firstItem.title}</strong>
              {' '}
              <span className="text-white">{firstItem.description}</span>
            </p>
          </div>

          {/* Store badges + QR code — right-aligned group */}
          <div className="flex flex-shrink-0 items-center gap-4">
            <div className="flex items-center gap-4">
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex transition-opacity hover:opacity-80"
                aria-label="Stáhněte si aplikaci v App Store"
              >
                <AppStoreBadge />
              </a>
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex transition-opacity hover:opacity-80"
                aria-label="Stáhněte si aplikaci na Google Play"
              >
                <GooglePlayBadge />
              </a>
            </div>

            {/* QR Code — real image from original airbank.cz */}
            <div className="hidden flex-shrink-0 pl-8 lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/myair-qr.png"
                alt="QR code pro stažení aplikace My Air"
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
