'use client';

import { LoyalCustomerTimelineBlock as LoyalCustomerTimelineBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const LoyalCustomerTimelineBlock = ({
  title,
  items,
}: LoyalCustomerTimelineBlockType) => {
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
          <div className="mb-10 lg:mb-14">
            <Typography variant="h2" className="text-meopta-text-primary">
              {title}
            </Typography>
          </div>
        )}

        <div
          ref={ref}
          className={cn('relative opacity-0', isVisible && 'animate-fade-in-up')}
        >
          {/* Horizontal timeline */}
          <div className="flex flex-col gap-8 md:flex-row md:gap-0">
            {items.map((item, i) => {
              const isLast = i === items.length - 1;

              return (
                <div key={item.id ?? i} className="flex flex-1 flex-col items-center md:flex-row">
                  <div className="flex flex-col items-center">
                    {/* Step circle */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-meopta-blue-light lg:h-20 lg:w-20">
                      <span className="text-20 font-bold text-meopta-blue-dark lg:text-24">
                        {item.step}
                      </span>
                    </div>

                    {/* Label */}
                    <p className="mt-3 max-w-[160px] text-center text-14 leading-snug text-meopta-text-primary lg:text-16">
                      {item.title}
                    </p>
                  </div>

                  {/* Connector line */}
                  {!isLast && (
                    <div className="hidden flex-1 px-2 md:flex md:items-start md:pt-8 lg:pt-10">
                      <div className="h-0.5 w-full bg-meopta-border" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};
