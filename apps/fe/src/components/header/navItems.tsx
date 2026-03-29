'use client';

import { usePathname } from 'next/navigation';
import { LinkCMS } from '../link/link';

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

function getNavUrl(link: NavChild['link']): string {
  if (!link) return '#';
  if (link.type === 'custom' && link.url) return link.url;
  if (link.type === 'reference' && link.reference?.value) {
    const ref = link.reference.value;
    return typeof ref === 'string' ? `/${ref}` : `/${ref.slug ?? ''}`;
  }
  return link.url ?? '#';
}

/** Check if a nav item matches the current pathname */
function isActive(pathname: string, itemUrl: string, children?: NavChild[]): boolean {
  if (itemUrl === '#') return false;
  const stripped = pathname.replace(/^\/(cs|en)(\/|$)/, '/');
  if (stripped === itemUrl || stripped === itemUrl.replace(/\/$/, '')) return true;
  if (children) {
    for (const child of children) {
      const childUrl = getNavUrl(child.link);
      if (childUrl !== '#' && (stripped === childUrl || stripped === childUrl.replace(/\/$/, ''))) return true;
    }
  }
  if (stripped.startsWith(itemUrl) && itemUrl !== '/') return true;
  return false;
}

/** Underline span that wraps link text — the ::after sits exactly under the text */
function UnderlineText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block after:pointer-events-none after:absolute after:-bottom-[8px] after:left-0 after:right-0 after:h-[2px] after:origin-center after:scale-x-0 after:bg-meopta-blue-dark after:transition-[scale] after:duration-300 after:content-[''] group-hover:after:scale-x-100">
      {children}
    </span>
  );
}

export function NavItems({ items }: { items: NavItemData[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex w-full items-center justify-start gap-4">
      {items.map((item) => {
        const active = isActive(pathname, item.url, item.children);
        return (
          <li key={item.id} className="group/item relative">
            <LinkCMS
              url={item.url}
              className={`group block translate-y-[4px] py-1.5 text-[0.9375rem] font-normal leading-7 no-underline ${
                active ? 'text-meopta-blue-dark' : 'text-meopta-blue-dark'
              }`}
            >
              <UnderlineText>{item.label}</UnderlineText>
            </LinkCMS>

            {/* Submenu dropdown */}
            {item.children && item.children.length > 0 && (
              <div className="invisible absolute right-0 top-full z-50 min-w-[240px] pt-3 opacity-0 transition-all duration-150 group-hover/item:visible group-hover/item:opacity-100">
                <div className="bg-white py-1 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  {item.children.map((child, j) => {
                    const childUrl = getNavUrl(child.link);
                    const childActive = isActive(pathname, childUrl);
                    return (
                      <LinkCMS
                        key={child.id ?? j}
                        url={childUrl}
                        className={`group block whitespace-nowrap px-6 py-3 text-[0.9375rem] no-underline ${
                          childActive ? 'text-meopta-blue-dark' : 'text-[#1a1a1a]'
                        }`}
                      >
                        <UnderlineText>{child.label}</UnderlineText>
                      </LinkCMS>
                    );
                  })}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
