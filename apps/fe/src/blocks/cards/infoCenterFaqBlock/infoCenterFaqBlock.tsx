'use client';

import { InfoCenterFaqBlock as InfoCenterFaqBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const FaqIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="6 6 42 47" aria-hidden="true" className="h-12 w-12 flex-shrink-0">
    <path fill="#000" d="M31.86 51.83c5.56-.36 9.98-1.91 9.88-3.47-.1-1.56-4.69-2.54-10.24-2.18-5.56.36-9.98 1.91-9.88 3.47.1 1.56 4.69 2.54 10.24 2.18" opacity=".2" />
    <path fill="#9c3" d="M30.74 51.54c11.26-1.87 18.74-13.32 16.71-25.58C45.42 13.7 34.64 5.28 23.38 7.15 12.11 9.02 4.63 20.47 6.67 32.73c2.03 12.26 12.81 20.68 24.07 18.81" />
    <path stroke="#1e3300" strokeLinecap="round" strokeLinejoin="round" d="M30.71 51.38c11.26-1.87 18.74-13.32 16.71-25.58C45.38 13.54 34.6 5.12 23.34 6.99 12.08 8.86 4.6 20.31 6.63 32.57c2.03 12.26 12.81 20.68 24.08 18.81" />
    <path fill="#fff" d="M34 21.39c-.34-.96-.81-1.84-1.39-2.6-.57-.74-1.24-1.43-2-2.05a12 12 0 0 0-2.41-1.57c-.85-.42-1.73-.76-2.63-1a10 10 0 0 0-3.56-.35c-.41.03-.82.09-1.21.18l-.19.04-3.38.91c-.74.15-1.43.4-2.07.73-.98.52-1.77 1.33-2.36 2.42-.58 1.07-.87 2.38-.87 3.87 0 .22.15.41.36.46l3.81.97c.38.1.78.1 1.16 0 1.14-.27 3.64-.87 4.59-1.1.22-.06.38-.26.36-.49-.03-.51-.03-1.46.2-2.51.84.37 1.58.9 2.19 1.58.84.94 1.25 2.04 1.25 3.38 0 1.42-.76 2.57-2.33 3.5-1.48.9-2.53 1.65-3.2 2.3-.7.67-1.19 1.45-1.47 2.31-.27.85-.41 1.97-.41 3.45v.04c0 .61.41 1.15 1 1.3l2.83.75c.41.11.84.11 1.25 0l2.03-.54c.59-.16 1-.69 1-1.3v-.26c0-.57.08-1.11.24-1.59.16-.49.34-.9.53-1.22.18-.3.49-.64.9-.99.44-.38.79-.66 1.04-.83.27-.18.69-.45 1.24-.8 1.2-.7 2.17-1.52 2.87-2.44.81-1.06 1.17-2.45 1.09-4.13-.04-.83-.21-1.66-.48-2.45z" />
    <path fill="#fff" d="M26.09 41.86c-.29-2.17-1.78-3.77-3.38-3.65h-.03l-2.59.53c-.05 0-.1 0-.16.01-1.64.22-2.73 2.19-2.44 4.42.29 2.17 1.79 3.77 3.38 3.64h.12c.12-.02.24-.05.36-.08l2.44-.48h.03c1.54-.33 2.55-2.25 2.27-4.39" />
  </svg>
);

export const InfoCenterFaqBlock = ({
  items,
}: InfoCenterFaqBlockType) => {
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
        <div
          ref={ref}
          className={cn(
            'grid grid-cols-1 gap-0 opacity-0 md:grid-cols-2',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {items.map((item, i) => (
            <a
              key={item.id ?? i}
              href={item.url}
              className="group flex items-center gap-5 border-b border-meopta-border px-4 py-5 no-underline transition-colors hover:bg-meopta-bg-light lg:px-6 lg:py-6"
            >
              <FaqIcon />
              <span className="text-16 font-medium text-meopta-text-primary underline decoration-meopta-text-secondary/30 underline-offset-2 group-hover:text-meopta-blue-dark group-hover:decoration-meopta-blue-dark lg:text-18">
                {item.question}
              </span>
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
};
