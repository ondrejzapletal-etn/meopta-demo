'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HeroWithImageAndSearchBlock as HeroWithImageAndSearchBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { getImageSrcWithFallback } from '../../../utils/images';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-6 w-6 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

const bgClasses: Record<string, string> = {
  green: 'bg-meopta-blue',
  white: 'bg-white',
};

const btnClasses: Record<string, { primary: string; outline: string }> = {
  green: {
    primary: 'bg-white hover:bg-meopta-bg-light',
    outline: 'border border-meopta-blue-dark hover:bg-white/10',
  },
  white: {
    primary: 'bg-meopta-blue hover:bg-meopta-blue-hover text-white',
    outline: 'border border-meopta-blue-dark hover:bg-meopta-blue-light',
  },
};

const inputClasses: Record<string, string> = {
  green: 'bg-transparent text-meopta-text-primary placeholder:text-meopta-text-secondary/70 border-b-2 border-meopta-text-primary/30 focus:border-meopta-text-primary',
  white: 'bg-meopta-bg-light text-meopta-text-primary placeholder:text-meopta-text-secondary focus:ring-meopta-blue/30 rounded-lg ring-2 ring-transparent focus:ring-2',
};

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25 25"
    fill="gray"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      d="M16.101 15.18l5.859 5.858a.647.647 0 0 1 0 .92.648.648 0 0 1-.919 0L15.183 16.1a7.442 7.442 0 0 1-4.826 1.762 7.458 7.458 0 0 1-5.308-2.199 7.458 7.458 0 0 1-2.199-5.308c0-2.006.781-3.89 2.199-5.308 2.927-2.927 7.69-2.928 10.616 0 2.772 2.771 2.915 7.187.436 10.133zm-10.133-.436a6.167 6.167 0 0 0 4.389 1.818 6.166 6.166 0 0 0 4.387-1.816l.002-.002.002-.002a6.214 6.214 0 0 0-.002-8.776 6.187 6.187 0 0 0-4.389-1.815 6.189 6.189 0 0 0-4.389 1.815 6.167 6.167 0 0 0-1.818 4.39c0 1.657.646 3.216 1.818 4.388z"
      fillRule="evenodd"
    />
  </svg>
);

export const HeroWithImageAndSearchBlock = ({
  title,
  description,
  image,
  searchPlaceholder,
  backgroundColor,
  links,
}: HeroWithImageAndSearchBlockType) => {
  const [searchValue, setSearchValue] = useState('');

  const bg = backgroundColor ?? 'green';
  const placeholder = searchPlaceholder ?? 'Co hledate?';

  return (
    <div className={cn('w-full', bgClasses[bg])}>
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-20',
        )}
      >
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          {/* Text content */}
          <div className="flex flex-1 flex-col items-start">
            {title && (
              <h1 className="mb-4 text-30 font-bold leading-[1.17] text-black lg:text-48">
                {title}
              </h1>
            )}

            {description && (
              <p className="mb-6 max-w-xl text-18 font-light leading-normal text-meopta-text-primary lg:text-24">
                {description}
              </p>
            )}

            {links && links.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-3">
                {links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url ?? '#'}
                    className={cn(
                      `
                        flex h-14 items-center rounded-full px-6 text-[0.875rem]
                        font-medium text-meopta-text-primary no-underline
                        transition-colors
                      `,
                      link.appearance === 'outline'
                        ? btnClasses[bg]?.outline
                        : btnClasses[bg]?.primary,
                    )}
                  >
                    {link.label}
                    <ArrowRight />
                  </a>
                ))}
              </div>
            )}

            {/* Search input */}
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={placeholder}
                className={cn(
                  `
                    w-full py-3 pr-12 pl-1 text-16 transition-colors
                    outline-none
                  `,
                  inputClasses[bg],
                )}
              />
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-meopta-text-secondary">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Image */}
          {image && (
            <div className="relative h-[220px] w-full flex-shrink-0 md:h-[260px] lg:h-[360px] lg:w-[520px]">
              <Image
                src={getImageSrcWithFallback(image)}
                alt={title ?? ''}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
