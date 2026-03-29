import { Container } from '../container/container';
import { LinkCMS } from '../link/link';
import React from 'react';
import { HeaderDropdown } from './headerDropdown';
import { NavItems } from './navItems';
import { fetchHeader } from '../../api/fetch';

interface NavItem {
  labelEn: string;
  labelCs?: string;
  link?: {
    type?: string | null;
    url?: string | null;
    label?: string | null;
    reference?: { value: string | { slug?: string } } | null;
  } | null;
  children?: NavChild[];
  id?: string | null;
}

interface NavChild {
  labelEn: string;
  labelCs?: string;
  link?: {
    type?: string | null;
    url?: string | null;
    label?: string | null;
    reference?: { value: string | { slug?: string } } | null;
  } | null;
  description?: string | null;
  id?: string | null;
}

import type { Media } from '@repo/shared/payload-types';
interface CtaButton {
  labelEn: string;
  labelCs?: string;
  url: string;
  appearance?: string | null;
  icon?: number | Media | null;
  id?: string | null;
}

function getNavUrl(link: NavItem['link']): string {
  if (!link) return '#';
  if (link.type === 'custom' && link.url) return link.url;
  if (link.type === 'reference' && link.reference?.value) {
    const ref = link.reference.value;
    return typeof ref === 'string' ? `/${ref}` : `/${ref.slug ?? ''}`;
  }
  return link.url ?? '#';
}

const WebLogo = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/logo.webp" alt="Logo" height={40} className="h-10 w-auto" />
);

const PersonPlusIcon = () => (
  <svg viewBox="0 0 25 25" className="h-5 w-5 fill-meopta-blue-dark">
    <path d="M5.696 8.756c0-1.057.412-2.05 1.16-2.798a3.933 3.933 0 0 1 2.798-1.159c1.056 0 2.05.412 2.798 1.159a3.962 3.962 0 0 1 0 5.597 3.933 3.933 0 0 1-2.798 1.158 3.933 3.933 0 0 1-2.798-1.158 3.932 3.932 0 0 1-1.16-2.799m6.664 4.488c3.134 1.115 5.39 4.098 5.394 7.606 0 .359-.29.65-.648.65h-.001a.65.65 0 0 1-.65-.649c-.004-3.74-3.055-6.781-6.799-6.781-1.816 0-3.521.705-4.801 1.988a6.72 6.72 0 0 0-1.98 4.79.65.65 0 0 1-.648.651h-.001a.65.65 0 0 1-.65-.648 8.015 8.015 0 0 1 2.359-5.711 8.063 8.063 0 0 1 3.01-1.898 5.249 5.249 0 0 1-1.008-.769 5.218 5.218 0 0 1-1.539-3.717c0-1.404.546-2.724 1.54-3.717A5.22 5.22 0 0 1 9.653 3.5c1.403 0 2.723.546 3.716 1.54a5.264 5.264 0 0 1 0 7.433 5.27 5.27 0 0 1-1.01.771zm10.414-2.73a.649.649 0 1 1 0 1.3H20.55v2.224a.65.65 0 0 1-1.3 0v-2.225h-2.224a.65.65 0 1 1 0-1.298h2.224V8.29a.65.65 0 1 1 1.3 0v2.224h2.224z" fillRule="evenodd" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 25 25" className="h-5 w-5 fill-meopta-blue-dark">
    <path d="M18.453 21.5a.3.3 0 0 1-.3.3H6.848a.3.3 0 0 1-.3-.3v-8.623a.3.3 0 0 1 .3-.3h11.305a.3.3 0 0 1 .3.3V21.5zM8.374 7.317a4.08 4.08 0 0 1 1.202-2.909A4.095 4.095 0 0 1 12.494 3.2a4.135 4.135 0 0 1 4.133 4.119v3.858H8.374v-3.86zm9.779 3.86h-.126V7.318c-.004-3.042-2.486-5.517-5.533-5.518h-.001a5.487 5.487 0 0 0-3.908 1.619 5.47 5.47 0 0 0-1.611 3.899v3.859h-.126c-.938 0-1.701.762-1.701 1.7V21.5c0 .937.763 1.7 1.701 1.7h11.305c.938 0 1.7-.763 1.7-1.7v-8.623c0-.938-.762-1.7-1.7-1.7z" fillRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 25 25" className="h-5 w-5 fill-meopta-blue-dark">
    <path d="M16.101 15.18l5.859 5.858a.647.647 0 0 1 0 .92.648.648 0 0 1-.919 0L15.183 16.1a7.442 7.442 0 0 1-4.826 1.762 7.458 7.458 0 0 1-5.308-2.199 7.458 7.458 0 0 1-2.199-5.308c0-2.006.781-3.89 2.199-5.308 2.927-2.927 7.69-2.928 10.616 0 2.772 2.771 2.915 7.187.436 10.133zm-10.133-.436a6.167 6.167 0 0 0 4.389 1.818 6.166 6.166 0 0 0 4.387-1.816l.002-.002.002-.002a6.214 6.214 0 0 0-.002-8.776 6.187 6.187 0 0 0-4.389-1.815 6.189 6.189 0 0 0-4.389 1.815 6.167 6.167 0 0 0-1.818 4.39c0 1.657.646 3.216 1.818 4.388z" fillRule="evenodd" />
  </svg>
);

export const Header = async () => {
  let headerData: { navigation?: NavItem[]; ctaButtons?: CtaButton[] } = {};

  try {
    headerData = await fetchHeader();
  } catch {
    // Fallback to defaults if CMS is unavailable
  }

  const cmsNavigation = headerData.navigation ?? [];
  const cmsCtaButtons = headerData.ctaButtons ?? [];

  const navItems = cmsNavigation.map((item, i) => ({
    label: item.labelEn,
    url: getNavUrl(item.link),
    id: item.id ?? String(i),
    children: item.children?.map((child) => ({
      ...child,
      label: child.labelEn,
    })),
  }));

  const ctaButtons = cmsCtaButtons.map((cta) => ({
    ...cta,
    label: cta.labelEn,
  }));

  // Mobile dropdown receives full nav items (with children for accordion submenus)


  // Helper: get icon URL from Media object or return null
  const getIconUrl = (icon: number | Media | null | undefined): string | null => {
    if (!icon) return null;
    if (typeof icon === 'object' && 'url' in icon && icon.url) return icon.url;
    if (typeof icon === 'object' && 'sizes' in icon && icon.sizes?.preview?.url) return icon.sizes.preview.url;
    return null;
  };

  const ctaButtonClass = (appearance: string | null | undefined) => {
    switch (appearance) {
      case 'primary':
        return 'hidden items-center gap-2 rounded-full bg-meopta-blue-dark px-3 py-2 text-[0.75rem] font-medium leading-none text-white no-underline transition-colors hover:bg-meopta-blue md:inline-flex';
      case 'link':
        return 'hidden items-center gap-2 px-3 py-2 text-[0.75rem] font-medium leading-none text-meopta-blue-dark no-underline transition-colors hover:underline md:inline-flex';
      case 'default':
        return 'hidden items-center gap-2 rounded-full px-3 py-2 text-[0.75rem] font-medium leading-none text-black no-underline transition-colors hover:bg-meopta-blue-light md:inline-flex';
      case 'outline':
      default:
        return 'hidden items-center gap-2 rounded-full border border-meopta-blue-dark px-3 py-2 text-[0.75rem] font-medium leading-none text-black no-underline transition-colors hover:bg-meopta-blue-light md:inline-flex';
    }
  };

  return (
    <div className="bg-white">
      {/* Top bar: logo + CTA buttons + search */}
      <Container size="ab-content" className="border-0">
        <div className="flex items-center justify-between py-2 lg:py-2.5">
          <LinkCMS url="/">
            <WebLogo />
          </LinkCMS>

          <nav className="hidden pb-3 lg:block">
            <NavItems items={navItems} />
          </nav>


          <div className="flex items-center gap-2">
            {ctaButtons.map((cta, i) => (
              <LinkCMS
                key={cta.id ?? i}
                url={cta.url}
                className={ctaButtonClass(cta.appearance)}
              >
                {getIconUrl(cta.icon)
                  ? <img src={getIconUrl(cta.icon)!} alt="" className="h-5 w-5 object-contain" />
                  : null}
                {cta.label}
              </LinkCMS>
            ))}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-meopta-blue-dark text-meopta-blue-dark transition-colors hover:bg-meopta-blue-light"
              aria-label="Vyhledávání"
            >
              <SearchIcon />
            </button>
            <HeaderDropdown items={navItems} />
          </div>
        </div>
      </Container>

      {/* Navigation bar */}
      <div>
        <Container size="ab-content" className="border-0">
        </Container>
      </div>
    </div>
  );
};
