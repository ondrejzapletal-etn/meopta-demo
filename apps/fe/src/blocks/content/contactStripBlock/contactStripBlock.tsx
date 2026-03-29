'use client';

import { ContactStripBlock as ContactStripBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const bgClasses: Record<string, string> = {
  green: 'bg-meopta-blue',
  lightGreen: 'bg-[#b3b78a]',
};

const textClasses: Record<string, string> = {
  green: 'text-white',
  lightGreen: 'text-meopta-text-primary',
};

const linkClasses: Record<string, string> = {
  green: 'text-white font-semibold hover:text-white/80',
  lightGreen: 'text-meopta-blue-dark font-semibold hover:text-meopta-blue-hover',
};

export const ContactStripBlock = ({
  text,
  linkLabel,
  linkUrl,
  backgroundColor,
}: ContactStripBlockType) => {
  const bg = backgroundColor ?? 'green';
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="w-full">
      <Container size="ab-content" className="py-4 lg:py-5">
        <div
          ref={ref}
          className={cn(
            `
              flex items-center gap-4 rounded-full px-6 py-3 opacity-0
              lg:px-8 lg:py-4
            `,
            bgClasses[bg],
            isVisible && 'animate-fade-in',
          )}
        >
          <span className="flex-shrink-0 rounded bg-meopta-blue-dark px-2 py-0.5 text-12 font-bold text-white">
            TIP
          </span>

          {text && (
            <p className={cn('flex-1 text-14 font-medium lg:text-16', textClasses[bg])}>
              {text}
            </p>
          )}

          {linkLabel && linkUrl && (
            <a
              href={linkUrl}
              className={cn(
                `
                  inline-flex flex-shrink-0 items-center gap-1 text-14 underline
                  transition-colors
                  lg:text-16
                `,
                linkClasses[bg],
              )}
            >
              {linkLabel}
              <svg
                width="20"
                height="20"
                viewBox="0 0 25 25"
                fill="currentColor"
                className="inline-block flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99"
                  fillRule="evenodd"
                />
              </svg>
            </a>
          )}
        </div>
      </Container>
    </div>
  );
};
