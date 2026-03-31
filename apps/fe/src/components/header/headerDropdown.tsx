'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LinkCMS } from '../link/link';
import { useTranslations } from 'next-intl';

interface NavChild {
  label: string;
  link?: {
    type?: string | null;
    url?: string | null;
    label?: string | null;
    reference?: { value: string | { slug?: string } } | null;
  } | null;
  description?: string | null;
  id?: string | null;
}

interface NavItemData {
  label: string;
  url: string;
  id: string;
  children?: NavChild[];
}

interface HeaderDropdownProps {
  items: NavItemData[];
}

function getNavUrl(link: NavChild['link']): string {
  if (!link) return '#';
  if (link.type === 'custom' && link.url) return link.url;
  if (link.type === 'reference' && link.reference?.value) {
    const ref = link.reference.value;
    return typeof ref === 'string' ? `/${ref}` : `/${ref.slug ?? ''}`;
  }
  return link.url ?? '#';
}

const HamburgerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 25 25"
    fill="#497D00"
    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
  >
    <path
      d="M18.64 9.247a.842.842 0 0 0-1.19 0l-4.507 4.506-4.505-4.506a.842.842 0 1 0-1.192 1.19l5.1 5.1a.838.838 0 0 0 1.191.002l5.103-5.102a.838.838 0 0 0 0-1.19"
      fillRule="evenodd"
    />
  </svg>
);

function AccordionItem({ item, onNavigate }: { item: NavItemData; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const regionId = `nav-mobile-submenu-${item.id}`;

  return (
    <li>
      <button
        className={`flex w-full items-center justify-between py-3 text-left text-[0.9375rem] text-black ${open ? 'border-b border-meopta-border' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={regionId}
      >
        {item.label}
        <ChevronIcon open={open} />
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: open ? `${contentRef.current?.scrollHeight ?? 500}px` : '0px' }}
        aria-hidden={!open}
      >
        <div
          ref={contentRef}
          id={regionId}
          role="region"
          aria-label={item.label}
          className="pb-2 pl-6 pt-1"
        >
          {item.children?.map((child, j) => {
            const childUrl = getNavUrl(child.link);
            return (
              <LinkCMS
                key={child.id ?? j}
                url={childUrl}
                onClick={onNavigate}
                className="block py-2 text-[0.9375rem] text-black no-underline hover:text-meopta-blue-dark"
                tabIndex={open ? 0 : -1}
              >
                {child.label}
              </LinkCMS>
            );
          })}
        </div>
      </div>
    </li>
  );
}

export const HeaderDropdown = ({ items }: HeaderDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="lg:hidden">
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full border border-meopta-blue-dark text-meopta-blue-dark transition-colors hover:bg-meopta-blue-light"
        onClick={toggleDropdown}
        aria-expanded={dropdownOpen}
        aria-label={t('general.menu')}
      >
        {dropdownOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>
      {dropdownOpen && (
        <div className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-60px)] overflow-y-auto border-t border-meopta-border bg-white shadow-lg">
          <div className="mx-auto max-w-[1232px] px-6 py-4">
            <ul className="list-none p-0">
              {items.map((item) =>
                item.children && item.children.length > 0
                  ? (
                      <AccordionItem key={item.id} item={item} onNavigate={closeDropdown} />
                    )
                  : (
                      <li key={item.id}>
                        <LinkCMS
                          onClick={closeDropdown}
                          url={item.url}
                          className="block border-b border-meopta-border py-3 text-[0.9375rem] text-black no-underline last:border-0 hover:text-meopta-blue-dark"
                        >
                          {item.label}
                        </LinkCMS>
                      </li>
                    ),
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
