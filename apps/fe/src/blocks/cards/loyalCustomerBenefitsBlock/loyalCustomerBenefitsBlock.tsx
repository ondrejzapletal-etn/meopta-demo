'use client';

import { LoyalCustomerBenefitsBlock as LoyalCustomerBenefitsBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const LoyalCustomerBenefitsBlock = ({
  title,
  beforeTitle,
  afterTitle,
  items,
}: LoyalCustomerBenefitsBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) return null;

  const colBefore = beforeTitle ?? 'Platim';
  const colAfter = afterTitle ?? 'Ziju s Air Bank';

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
          <Typography variant="h2" className="mb-8 text-meopta-text-primary lg:mb-12">
            {title}
          </Typography>
        )}

        <div
          ref={ref}
          className={cn(
            'overflow-hidden rounded-2xl border border-meopta-border opacity-0',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {/* Table header */}
          <div className="grid grid-cols-3 bg-meopta-bg-light">
            <div className="p-4 lg:p-5">
              <span className="text-14 font-semibold text-meopta-text-secondary lg:text-16">
                {/* empty - label column */}
              </span>
            </div>
            <div className="p-4 text-center lg:p-5">
              <span className="text-14 font-semibold text-meopta-text-secondary lg:text-16">
                {colBefore}
              </span>
            </div>
            <div className="p-4 text-center lg:p-5">
              <span className="text-14 font-bold text-meopta-blue-dark lg:text-16">
                {colAfter}
              </span>
            </div>
          </div>

          {/* Table rows */}
          {items.map((item, i) => (
            <div
              key={item.id ?? i}
              className={cn(
                'grid grid-cols-3 border-t border-meopta-border',
                item.highlight && 'bg-meopta-blue-light',
              )}
            >
              {/* Label */}
              <div className="flex items-center p-4 lg:p-5">
                <span className="text-14 font-medium text-meopta-text-primary lg:text-16">
                  {item.label}
                </span>
              </div>

              {/* Before value */}
              <div className="flex items-center justify-center p-4 text-center lg:p-5">
                <span className="text-14 text-meopta-text-secondary lg:text-16">
                  {item.beforeValue}
                </span>
              </div>

              {/* After value */}
              <div className="flex items-center justify-center p-4 text-center lg:p-5">
                <span className="text-14 font-semibold text-meopta-blue-dark lg:text-16">
                  {item.afterValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
