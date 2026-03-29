'use client';

import { StepsBlock as StepsBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const StepsBlock = ({ title, description, items }: StepsBlockType) => {
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
          <Typography variant="h2" className="mb-2 text-center text-meopta-text-primary">
            {title}
          </Typography>
        )}

        {description && (
          <p className="mb-10 text-center text-16 text-meopta-text-secondary lg:mb-14 lg:text-18">
            {description}
          </p>
        )}

        <div
          ref={ref}
          className={cn('relative opacity-0', isVisible && 'animate-fade-in-up')}
        >
          {/* Horizontal steps with connecting dashed line */}
          <div className="relative flex items-start justify-between">
            {/* Dashed line connecting circles */}
            <div className="absolute left-0 right-0 top-6 z-0 border-t-2 border-dashed border-meopta-border" />

            {items.map((item, i) => (
              <div
                key={item.id ?? i}
                className="relative z-10 flex flex-1 flex-col items-center text-center"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-meopta-blue shadow-md">
                  <span className="text-18 font-bold text-white">{item.stepNumber}</span>
                </div>

                <h3 className="mb-1 max-w-[200px] text-16 font-semibold text-meopta-text-primary lg:text-18">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="max-w-[200px] text-13 text-meopta-text-secondary lg:text-14">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};
