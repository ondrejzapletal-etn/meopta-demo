'use client';

import { TopManagementCardsBlock as TopManagementCardsBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';
import Image from 'next/image';
import { getImageSrcWithFallback } from '../../../utils/images';

/** LinkedIn icon inline SVG */
const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <defs>
      <path d="M16.496 11.471a2.571 2.571 0 0 1 0-3.632 2.56 2.56 0 0 1 1.816-.751c.658 0 1.315.25 1.817.751a2.571 2.571 0 0 1 0 3.632 2.571 2.571 0 0 1-3.633 0m3.98 1.221A5.69 5.69 0 0 1 24 17.936a.586.586 0 0 1-1.172 0 4.517 4.517 0 0 0-4.514-4.502c-1.24 0-2.395.493-3.252 1.386a.585.585 0 1 1-.845-.81 5.651 5.651 0 0 1 1.93-1.319 3.764 3.764 0 0 1-.479-.391 3.745 3.745 0 0 1 0-5.29 3.744 3.744 0 0 1 5.289 0 3.745 3.745 0 0 1 0 5.29c-.15.15-.315.273-.481.392zm-9.755.479c2.825 1.005 4.86 3.695 4.864 6.857a.585.585 0 0 1-.585.586.587.587 0 0 1-.586-.584c-.004-3.372-2.755-6.115-6.13-6.115h-.001a6.074 6.074 0 0 0-4.328 1.792 6.06 6.06 0 0 0-1.784 4.32A.586.586 0 0 1 1 20.03a7.225 7.225 0 0 1 2.126-5.15 7.27 7.27 0 0 1 2.715-1.71 4.746 4.746 0 0 1-.91-.693 4.71 4.71 0 0 1-1.388-3.351c0-1.266.493-2.456 1.388-3.352a4.707 4.707 0 0 1 3.351-1.387c1.266 0 2.456.492 3.351 1.387a4.746 4.746 0 0 1 0 6.703 4.757 4.757 0 0 1-.912.695zm-2.439-.479c.953 0 1.849-.371 2.523-1.045a3.573 3.573 0 0 0 0-5.045 3.548 3.548 0 0 0-2.523-1.045c-.954 0-1.849.371-2.523 1.045a3.548 3.548 0 0 0-1.046 2.523c0 .952.373 1.848 1.046 2.522a3.543 3.543 0 0 0 2.523 1.045z" id="multiple_svg__a" />
    </defs>
    <use xlinkHref="#multiple_svg__a" fillRule="evenodd" />
  </svg>
);

export const TopManagementCardsBlock = ({ title, items, linkLabel, linkUrl }: TopManagementCardsBlockType) => {
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
            `
              grid grid-cols-1 gap-8 opacity-0
              md:grid-cols-2
              lg:grid-cols-3 lg:gap-10
            `,
            isVisible && 'animate-fade-in-up',
          )}
        >
          {items.map((member, i) => (
            <div key={member.id ?? i} className="flex flex-col items-center text-center">
              {/* Circular image with hover effect */}
              <div className="group relative mb-4 h-40 w-40 overflow-hidden rounded-full bg-meopta-bg-light lg:h-48 lg:w-48">
                {member.image
                  ? (
                      <Image
                        src={getImageSrcWithFallback(member.image)}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    )
                  : (
                      <div className="flex h-full w-full items-center justify-center text-48 font-bold text-meopta-border">
                        {member.name.charAt(0)}
                      </div>
                    )}
              </div>

              {/* Name */}
              <Typography variant="h5" className="text-meopta-text-primary">
                {member.name}
              </Typography>

              {/* Role */}
              {member.role && (
                <p className="mt-1 text-14 text-meopta-text-secondary">{member.role}</p>
              )}

              {/* LinkedIn link */}
              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-meopta-text-secondary transition-colors hover:text-meopta-blue-dark"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <LinkedInIcon />
                </a>
              )}
            </div>
          ))}
        </div>

        {linkLabel && linkUrl && (
          <div className="mt-10 flex justify-center lg:mt-14">
            <a
              href={linkUrl}
              className="inline-flex h-14 items-center rounded-full bg-meopta-blue px-6 text-[0.875rem] font-medium text-white no-underline transition-colors hover:bg-meopta-blue-hover"
            >
              {linkLabel}
              <PeopleIcon />
            </a>
          </div>
        )}
      </Container>
    </div>
  );
};
