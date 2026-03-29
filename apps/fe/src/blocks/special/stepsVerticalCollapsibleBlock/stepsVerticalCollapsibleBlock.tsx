'use client';

import { useState } from 'react';
import { StepsVerticalCollapsibleBlock as StepsVerticalCollapsibleBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { RichTextRenderer } from '../../../components/richTextRenderer/richTextRenderer';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ChevronDown = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="h-6 w-6 text-meopta-blue-dark">
    <path
      d="M18.64 9.247a.842.842 0 0 0-1.19 0l-4.507 4.506-4.505-4.506a.842.842 0 1 0-1.192 1.19l5.1 5.1a.838.838 0 0 0 1.191.002l5.103-5.102a.838.838 0 0 0 0-1.19"
      fillRule="evenodd"
    />
  </svg>
);

export const StepsVerticalCollapsibleBlock = ({
  title,
  items,
}: StepsVerticalCollapsibleBlockType) => {
  const { ref, isVisible } = useScrollAnimation();
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  if (!items || items.length === 0) return null;

  const toggle = (index: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="w-full bg-white">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-8 lg:pt-12',
          'pb-8 lg:pb-12',
        )}
      >
        {title && (
          <div className="mb-8 text-center lg:mb-10">
            <Typography variant="h3" className="text-meopta-text-primary">
              {title}
            </Typography>
          </div>
        )}

        <div
          ref={ref}
          className={cn('mx-auto max-w-[640px] opacity-0', isVisible && `
            animate-fade-in-up
          `)}
        >
          {items.map((item, index) => {
            const isOpen = openSet.has(index);
            const isLast = index === items.length - 1;

            return (
              <div key={item.id ?? index} className="flex">
                {/* Left column: number circle + dashed connecting line */}
                <div className="flex flex-col items-center mr-4 lg:mr-6">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-meopta-blue text-14 font-bold text-meopta-text-primary lg:h-10 lg:w-10 lg:text-16">
                    {index + 1}
                  </div>
                  {!isLast && (
                    <div className="flex-1 border-l-2 border-dashed border-[#b0b0b0]" />
                  )}
                </div>

                {/* Right column: accordion content */}
                <div className="flex-1 pb-8">
                  <button
                    onClick={() => toggle(index)}
                    aria-label={`Rozbalit krok ${index + 1}`}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between py-1 text-left"
                  >
                    <h3 className="text-16 font-semibold text-meopta-text-primary lg:text-18">
                      {item.title}
                    </h3>
                    <span
                      className={cn(
                        'ml-3 shrink-0 transition-transform duration-300',
                        isOpen && 'rotate-180',
                      )}
                    >
                      <ChevronDown />
                    </span>
                  </button>

                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-300',
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-4 pt-2 text-14 leading-relaxed text-meopta-text-secondary lg:text-16">
                        <RichTextRenderer content={item.content as Record<string, unknown>} />
                      </div>
                    </div>
                  </div>

                  {!isLast && <hr className="border-[#d9d9d9]" />}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
