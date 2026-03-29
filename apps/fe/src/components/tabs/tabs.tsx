'use client';

import React, { useState } from 'react';
import { cn } from '../../utils/styles';

interface Tab {
  label: string;
  content: React.ReactNode;
  id?: string;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
  defaultIndex?: number;
}

export const Tabs = ({ tabs, className, defaultIndex = 0 }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  if (tabs.length === 0) return null;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex gap-0 border-b border-meopta-border overflow-x-auto" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id ?? index}
            role="tab"
            aria-selected={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={cn(
              `
                px-6 py-3 text-14 font-semibold whitespace-nowrap
                transition-colors
                lg:text-16
              `,
              index === activeIndex
                ? 'border-b-2 border-meopta-blue text-meopta-blue-dark'
                : 'text-meopta-text-tertiary hover:text-meopta-text-primary',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-6" role="tabpanel">
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
};
