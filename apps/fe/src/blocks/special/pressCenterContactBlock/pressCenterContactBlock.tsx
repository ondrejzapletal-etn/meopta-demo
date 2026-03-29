'use client';

import { PressCenterContactBlock as PressCenterContactBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';
import Image from 'next/image';
import { getImageSrcWithFallback } from '../../../utils/images';

/** Mail icon */
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 flex-shrink-0"
    aria-hidden="true"
  >
    <rect width={20} height={16} x={2} y={4} rx={2} />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

/** Phone icon */
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 flex-shrink-0"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const PressCenterContactBlock = ({ title, items }: PressCenterContactBlockType) => {
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
          <Typography variant="h2" className="mb-10 text-meopta-text-primary lg:mb-14">
            {title}
          </Typography>
        )}

        <div
          ref={ref}
          className={cn(
            'grid grid-cols-1 gap-6 opacity-0 md:grid-cols-2 lg:gap-8',
            items.length >= 3 && 'lg:grid-cols-3',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {items.map((person, i) => (
            <div
              key={person.id ?? i}
              className="flex gap-4 rounded-2xl border border-meopta-border bg-white p-5 transition-shadow hover:shadow-md lg:p-6"
            >
              {/* Image */}
              {person.image && (
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-meopta-bg-light">
                  <Image
                    src={getImageSrcWithFallback(person.image)}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex flex-col justify-center">
                <Typography variant="h5" className="text-meopta-text-primary">
                  {person.name}
                </Typography>

                {person.role && (
                  <p className="mt-0.5 text-14 text-meopta-text-secondary">{person.role}</p>
                )}

                {/* Contact links */}
                <div className="mt-3 flex flex-col gap-1.5">
                  {person.email && (
                    <a
                      href={`mailto:${person.email}`}
                      className="inline-flex items-center gap-2 text-14 text-meopta-blue-dark no-underline transition-colors hover:text-meopta-blue"
                    >
                      <MailIcon />
                      <span>{person.email}</span>
                    </a>
                  )}

                  {person.phone && (
                    <a
                      href={`tel:${person.phone.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-2 text-14 text-meopta-blue-dark no-underline transition-colors hover:text-meopta-blue"
                    >
                      <PhoneIcon />
                      <span>{person.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
