'use client';

import { useState, useRef } from 'react';

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 25 25"
    fill="#99cc33"
    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
  >
    <path
      d="M18.64 9.247a.842.842 0 0 0-1.19 0l-4.507 4.506-4.505-4.506a.842.842 0 1 0-1.192 1.19l5.1 5.1a.838.838 0 0 0 1.191.002l5.103-5.102a.838.838 0 0 0 0-1.19"
      fillRule="evenodd"
    />
  </svg>
);

export function FooterAccordionSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      {/* Mobile: accordion button */}
      <button
        className="flex w-full items-center justify-between py-4 text-left md:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <h4 className="text-18 font-bold text-meopta-blue">{title}</h4>
        <ChevronIcon open={open} />
      </button>
      {/* Desktop: static heading */}
      <h4 className="mb-5 hidden text-18 font-bold text-White md:block">{title}</h4>

      {/* Mobile: collapsible content */}
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out md:!max-h-none"
        style={{ maxHeight: open ? `${contentRef.current?.scrollHeight ?? 1000}px` : '0px' }}
      >
        <div ref={contentRef} className="pb-4 md:pb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
