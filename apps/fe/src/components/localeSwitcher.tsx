'use client';
import { Link, usePathname } from '../i18n/navigation';
import { routing } from '../i18n/routing';

export default function LanguageSwitcher() {
  const pathname = usePathname();

  if (routing.locales.length <= 1) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {routing.locales.map((locale, i) => (
        <span key={locale}>
          {i > 0 && <span className="mr-2">|</span>}
          <Link href={pathname} locale={locale}>
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
