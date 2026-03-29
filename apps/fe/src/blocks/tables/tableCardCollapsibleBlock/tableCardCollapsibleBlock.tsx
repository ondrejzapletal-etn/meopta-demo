'use client';

import { useState } from 'react';
import { TableCardCollapsibleBlock as TableCardCollapsibleBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const TableCardCollapsibleBlock = ({
  title,
  sections,
}: TableCardCollapsibleBlockType) => {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const { ref, isVisible } = useScrollAnimation();

  if (!sections || sections.length === 0) return null;

  const toggleSection = (idx: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

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
          {sections.map((section, sIdx) => {
            const isOpen = openSections.has(sIdx);

            return (
              <div key={section.id ?? sIdx} className="border-b border-meopta-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleSection(sIdx)}
                  className="flex w-full items-center justify-between bg-meopta-blue px-6 py-4 text-left transition-colors hover:bg-meopta-blue-hover"
                >
                  <span className="text-16 font-bold text-white lg:text-18">
                    {section.sectionTitle}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={cn('text-white transition-transform', isOpen && `
                      rotate-180
                    `)}
                    aria-hidden="true"
                  >
                    <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && section.rows && (
                  <div>
                    {section.rows.map((row, rIdx) => (
                      <div
                        key={row.id ?? rIdx}
                        className={cn(
                          'flex items-center justify-between px-6 py-3 lg:py-4',
                          rIdx % 2 === 0 ? 'bg-meopta-bg-light' : 'bg-white',
                        )}
                      >
                        <span className="text-14 text-meopta-text-primary lg:text-16">{row.label}</span>
                        <span className="text-14 font-semibold text-meopta-text-primary lg:text-16">{row.value ?? '-'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
