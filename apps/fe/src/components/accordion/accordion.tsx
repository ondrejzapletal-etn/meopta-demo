'use client';

import React, { useState } from 'react';
import { cn } from '../../utils/styles';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
  id?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
  numbered?: boolean;
}

export const Accordion = ({ items, className, allowMultiple = false, numbered = false }: AccordionProps) => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className={cn('divide-y divide-meopta-border', className)}>
      {items.map((item, index) => {
        const isOpen = openIndices.has(index);
        return (
          <div key={item.id ?? index}>
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center gap-4 py-5 text-left transition-colors hover:text-meopta-blue-dark"
              aria-expanded={isOpen}
            >
              {numbered && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-meopta-blue text-14 font-bold text-white">
                  {index + 1}
                </span>
              )}
              <span className="flex-1 text-16 font-semibold lg:text-18">{item.title}</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className={cn('shrink-0 transition-transform duration-300', isOpen && `
                  rotate-180
                `)}
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-300',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-5 text-14 leading-relaxed text-meopta-text-secondary lg:text-16">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
