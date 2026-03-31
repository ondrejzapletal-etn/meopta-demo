'use client';

import { Branch, Media } from '@repo/shared/payload-types';
import { useState } from 'react';
import Image from 'next/image';
import { getImageSrcWithFallback } from '../../../utils/images';
import { cn } from '../../../utils/styles';

const AMENITY_LABELS: Record<string, string> = {
  bankomat: 'Bankomat',
  pes: 'Pes',
  deti: 'Děti',
  kava: 'Káva',
  jidlo: 'Jídlo',
  usmev: 'Úsměv',
  'bez-barier': 'Bez bariér',
};

const ICON_FILL = '#D1D5DB';

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  bankomat: (
    <svg viewBox="0 0 64 64" width="40" height="40" fill={ICON_FILL}>
      <g>
        <path d="M19.4 15.2H12c-3 0-5.3 2.4-5.3 5.3v35.3c0 3 2.4 5.3 5.3 5.3h12.8c3 0 5.3-2.4 5.3-5.3V31.7L19.4 15.2z" />
        <circle cx="45.8" cy="7.6" r="5" />
        <path d="m57.3 32.1-1.7-12c-.5-3.6-3.8-6.1-7.4-5.6-1.4.2-2.6.8-3.6 1.7l-5 4.2-7.6 2.5c-.6.2-1.1.6-1.5 1.1-.5.7-.6 1.6-.3 2.4.2.6.6 1.1 1.1 1.5.7.5 1.6.6 2.4.3l9.2-3.1 1.2 8.8c.3 2.2 1.7 4 3.5 5v18.6a3.8 3.8 0 1 0 7.6 0V37.6c1.7-1.4 2.4-3.4 2.1-5.5z" />
      </g>
    </svg>
  ),
  pes: (
    <svg viewBox="0 0 200 200" width="40" height="40" fill={ICON_FILL}>
      <path d="m147.5 63.4 27.9 17.5c7.5 4.7 17.4 2.4 22.1-5.2 4.7-7.6 2.4-17.5-5.2-24.3l-24.9-21.1-19.9 33.1zm13.1 83.8-2-2V110c.1-1 .1-2.1.1-3.1 0-19.1-15.4-34.5-34.4-34.5l-73.3.1-4.8-4.9a6.58 6.58 0 0 0-9.5 0 6.73 6.73 0 0 0 0 9.6l6 6.1-40.6 66.5c-1.2 2-1.8 4.3-1.8 6.6 0 1 .1 2 .3 2.9.8 3.2 2.8 6.1 5.6 7.8a12.95 12.95 0 0 0 9.5 1.6c3.2-.8 6.1-2.8 7.8-5.7l25-40.9 69.9 17.7 24.3 25c2.3 2.4 5.5 3.8 8.8 3.8h.1c3.3 0 6.4-1.3 8.8-3.6 2.4-2.3 3.7-5.6 3.8-8.9v-.2c0-3.2-1.3-6.4-3.6-8.7z" />
    </svg>
  ),
  deti: (
    <svg viewBox="0 0 64 64" width="40" height="40" fill={ICON_FILL}>
      <path d="M53.46 36.23 41.53 24.5a6.17 6.17 0 0 0-.53-.46 12.4 12.4 0 0 0-8.51-3.33c-3.52 0-6.69 1.43-8.91 3.73l-.07.06-11.8 11.62c-3.24 3.16 1.14 7.22 4.35 4.06l7.13-7.05v6.61h18.6V33.1l7.31 7.2c2.95 3.05 7.43-1.04 4.36-4.06zM24.93 10.71c0-4.06 3.4-7.35 7.6-7.35 4.2 0 7.6 3.29 7.6 7.35s-3.4 7.34-7.6 7.34c-4.2 0-7.6-3.28-7.6-7.34zm9.77 49.6h8.57l4.2-4.28c1.8-1.8 2.29-5.1.37-7l-5.97-5.86-7 6.89L40 55.1l-5.27 5.18c-.02 0-.02.02-.04.04zm-12.79 0h8.58l-.04-.03-5.27-5.18 5.15-5.04-7-6.89-5.97 5.87c-1.92 1.88-1.43 5.2.35 6.99l4.2 4.29z" />
    </svg>
  ),
  kava: (
    <svg viewBox="0 0 64 64" width="40" height="40" fill={ICON_FILL}>
      <path d="M35.39 48.87c11.56 0 20.84-10.18 20.84-23.7v-4.39H9.65a2.51 2.51 0 1 0 0 5.03h4.76c.3 13.22 9.6 23.06 20.98 23.06zm-13.61 12.1a4.07 4.07 0 0 1 0-8.13h26.6a4.07 4.07 0 0 1 0 8.13h-26.6zm8.2-43.79a2.12 2.12 0 0 1-1.79-3.27l5.76-9.08a2.13 2.13 0 1 1 3.59 2.27l-5.76 9.1a2.12 2.12 0 0 1-1.8.98zm8.95 0c-.4 0-.8-.11-1.14-.33a2.12 2.12 0 0 1-.99-1.8c0-.4.12-.8.34-1.13l5.75-9.1a2.13 2.13 0 1 1 3.6 2.28l-5.76 9.1a2.12 2.12 0 0 1-1.8.98z" />
    </svg>
  ),
  jidlo: (
    <svg viewBox="0 0 64 64" width="40" height="40" fill={ICON_FILL}>
      <path d="M56.75 23.88H6.6a3.54 3.54 0 0 1-3.53-3.54c0-1.96 3.02-13.02 28.63-13.02 25.62 0 28.58 11.06 28.58 13.02a3.54 3.54 0 0 1-3.54 3.54zM6.62 40.1h50.13a3.54 3.54 0 0 1 3.54 3.54c0 1.96-3.02 13.02-28.64 13.02S3.08 45.6 3.08 43.64A3.54 3.54 0 0 1 6.6 40.1zm1.27-9.2c.16.26 4.06 6.41 11.45 6.41 3.97 0 6.18-1.8 7.79-3.13 1.33-1.08 2.22-1.8 4.04-1.85 1.83.05 2.72.77 4.05 1.85 1.61 1.32 3.82 3.13 7.78 3.13 7.4 0 11.3-6.15 11.46-6.42a2.77 2.77 0 0 0-.89-3.8 2.79 2.79 0 0 0-3.82.86c-.1.16-2.5 3.8-6.75 3.8-1.98 0-2.89-.74-4.27-1.86-1.66-1.37-3.74-3.06-7.56-3.11-3.81.05-5.89 1.74-7.56 3.1-1.38 1.13-2.29 1.88-4.27 1.88-4.25 0-6.64-3.65-6.74-3.8a2.79 2.79 0 0 0-3.83-.87 2.77 2.77 0 0 0-.88 3.8" />
    </svg>
  ),
  usmev: (
    <svg viewBox="0 0 64 64" width="40" height="40" fill={ICON_FILL}>
      <path d="M45.65 18.07a12.2 12.2 0 0 0 .39-3.51C45.62 4.4 36.2 4.07 36.2 4.07s.22 9.51-2.1 5.51C28.56.18 13.18 3.61 13.18 3.61s10.8 3.34 10.06 8.77c-.3 2.18-2.1 4.17-3.73 5.56L16.16 21A21.78 21.78 0 0 0 9 37.52a23.48 23.48 0 1 0 36.65-19.45zm-4.7 8.32a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6zm-15.41 0a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6zM45.3 46.13c-.15.3-3.78 7.4-11.95 7.4-8.1 0-11.97-6.98-12.14-7.28a2 2 0 0 1 .8-2.7 2 2 0 0 1 2.7.8c.12.21 2.89 5.19 8.64 5.19 5.73 0 8.28-4.98 8.4-5.19a2.03 2.03 0 0 1 2.66-.89 2 2 0 0 1 .9 2.67z" />
    </svg>
  ),
  'bez-barier': (
    <svg viewBox="0 0 64 64" width="40" height="40" fill={ICON_FILL}>
      <path d="M17.39 27.99a2.66 2.66 0 0 1-1.02-2.1c0-.57.2-1.15.57-1.63l7.02-9a2.65 2.65 0 0 1 2.24-1.24H40s.76.04 1.66.64a5.2 5.2 0 0 1 2.22 4.27 5.19 5.19 0 0 1-.94 2.97L36 32.05l-.6-.46a17.12 17.12 0 0 0-8.18-3.4l-1.17-.17 6.02-8.69h-4.55l-6.4 8.21a2.66 2.66 0 0 1-2.09 1.01 2.65 2.65 0 0 1-1.64-.56m30.93 25.99h-.13c-.78 0-1.48-.35-1.9-.82a3.3 3.3 0 0 1-1.14-2.49V38.68h-4.32l-.19-.42a17.33 17.33 0 0 0-3.41-4.98L36 32.05h12.45a3.3 3.3 0 0 1 3.24 2.66c.05.21.08.44.08.68V48.7a2.66 2.66 0 0 1-.48 5.28h-2.97zM24.64 31.5a14.37 14.37 0 0 0-14.35 14.35c0 7.91 6.44 14.35 14.35 14.35a14.36 14.36 0 0 0 0-28.7zM42 8.43a4.96 4.96 0 0 1 4.95-4.96 4.96 4.96 0 0 1 0 9.91A4.95 4.95 0 0 1 42 8.43z" />
    </svg>
  ),
};

const DAY_FULL_NAMES: Record<string, string> = {
  Po: 'Pondělí',
  Út: 'Úterý',
  St: 'Středa',
  Čt: 'Čtvrtek',
  Pá: 'Pátek',
  So: 'Sobota',
  Ne: 'Neděle',
};

function expandSingleDay(days: string): string {
  if (days.includes('–')) return days;
  return DAY_FULL_NAMES[days] ?? days;
}

function GallerySlider({ gallery }: { gallery: Branch['gallery'] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = gallery ?? [];

  if (images.length === 0) return null;

  return (
    <div>
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '62.5%' }}>
        <div
          className="absolute inset-0 flex transition-transform duration-300 ease-in-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${(activeIndex * 100) / images.length}%)`,
          }}
        >
          {images.map((item, i) => (
            <div
              key={i}
              className="relative h-full shrink-0"
              style={{ width: `${100 / images.length}%` }}
            >
              <Image
                src={getImageSrcWithFallback(item.image as Media)}
                alt={`Fotografie pobočky ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className={cn(
              `
                flex h-10 w-10 items-center justify-center rounded-sm border
                transition-colors
              `,
              activeIndex === 0
                ? 'border-[#f4f4f6] text-[#828588]'
                : `
                  border-meopta-blue text-meopta-text-primary
                  hover:bg-meopta-bg-light
                `,
            )}
            aria-label="Předchozí fotografie"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor">
              <path
                d="M12 23.597c0-.358.137-.674.412-.95L31.63 3.414c.275-.275.59-.413.948-.413s.674.138.949.413l2.062 2.064c.275.275.412.591.412.949s-.137.674-.412.95L19.38 23.596l16.207 16.222c.275.275.412.591.412.95 0 .357-.137.673-.412.948l-2.062 2.064c-.275.275-.591.413-.949.413-.357 0-.673-.138-.948-.413L12.412 24.546c-.275-.275-.412-.591-.412-.949z"
                fillRule="evenodd"
              />
            </svg>
          </button>

          <span className="min-w-[60px] text-center text-14 text-meopta-text-secondary">
            {activeIndex + 1}
            {' '}
            /
            {' '}
            {images.length}
          </span>

          <button
            onClick={() => setActiveIndex(Math.min(images.length - 1, activeIndex + 1))}
            disabled={activeIndex === images.length - 1}
            className={cn(
              `
                flex h-10 w-10 items-center justify-center rounded-sm border
                transition-colors
              `,
              activeIndex === images.length - 1
                ? 'border-[#f4f4f6] text-[#828588]'
                : `
                  border-meopta-blue text-meopta-text-primary
                  hover:bg-meopta-bg-light
                `,
            )}
            aria-label="Další fotografie"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor">
              <path
                d="M36 23.597c0 .358-.137.674-.412.95L16.37 43.78c-.275.275-.59.413-.948.413s-.674-.138-.949-.413l-2.062-2.064c-.275-.275-.412-.591-.412-.949s.137-.674.412-.95L28.62 23.598 12.412 7.375C12.137 7.1 12 6.784 12 6.426s.137-.674.412-.95l2.062-2.063c.275-.275.591-.413.949-.413.357 0 .673.138.948.413l19.217 19.235c.275.275.412.591.412.949z"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export interface BranchDetailBlockProps {
  branch: Branch;
}

export const BranchDetailBlock = ({ branch }: BranchDetailBlockProps) => {
  const amenities = branch.amenities ?? [];

  const amenityItems = amenities.map((amenity) => (
    <div key={amenity} className="flex flex-col items-center gap-1">
      <span className="text-[#c8c8c8]">
        {AMENITY_ICONS[amenity] ?? null}
      </span>
      <span className="text-12 text-meopta-text-secondary">
        {AMENITY_LABELS[amenity] ?? amenity}
      </span>
    </div>
  ));

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-x-16">
      {/* Info panel */}
      <div className="text-center md:text-left">
        <h3 className="mb-4 text-[22px] font-medium text-meopta-text-primary md:text-[24px]">
          {branch.name}
        </h3>
        <p className="mb-6 text-16 leading-relaxed tracking-wide text-meopta-text-secondary">
          {branch.street}
          <br />
          {branch.zip}
&nbsp;&nbsp;
          {branch.city}
        </p>

        {branch.openingHours && branch.openingHours.length > 0 && (
          <div className="mb-6 flex flex-col items-center gap-3 md:items-start">
            {branch.openingHours.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-14 lg:text-16">
                <span className="inline-block w-[72px] rounded-sm border border-gray-300 px-2 py-0.5 text-center text-[13px] font-medium text-meopta-blue-dark">
                  {expandSingleDay(h.days)}
                </span>
                <span className="text-meopta-text-secondary">{h.hours}</span>
              </div>
            ))}
          </div>
        )}

        {/* Amenities — mobile + velká */}
        {amenities.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-4 md:hidden lg:flex lg:justify-start">
            {amenityItems}
          </div>
        )}

        <a
          href="/mapa-pobocek-a-bankomatu/nase-pobocky/"
          className="group inline-flex items-center justify-center gap-3 text-14 text-meopta-text-secondary transition-colors hover:text-meopta-text-primary md:justify-start"
        >
          <span>Hledáte jinou pobočku?</span>
          <svg
            viewBox="0 0 25 25"
            width="20"
            height="20"
            className="fill-meopta-blue-dark transition-transform group-hover:translate-x-1.5"
          >
            <path
              d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99"
              fillRule="evenodd"
            />
          </svg>
        </a>
      </div>

      {/* Amenities — střední only (right of info) */}
      {amenities.length > 0 && (
        <div className="hidden md:flex md:flex-wrap md:items-start md:justify-start md:gap-4 md:self-end lg:hidden">
          {amenityItems}
        </div>
      )}

      {/* Gallery — full width on mobile/střední, right column on velká */}
      <div className="md:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
        <GallerySlider gallery={branch.gallery} />
      </div>
    </div>
  );
};
