import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Montserrat } from 'next/font/google';
import { notFound } from 'next/navigation';
import appleTouchIcon from '../../../public/apple-touch-icon.png';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { Preview } from '../../components/preview/preview';
import { Section } from '../../components/section/section';
import { routing } from '../../i18n/routing';
import { throwIfMissingEnv } from '../../utils/env';
import '../globals.css';

export const dynamic = 'force-dynamic';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

interface LocaleLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // ensure that the locale is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="16x16" type="image/x-icon" />
        <link rel="apple-touch-icon" href={appleTouchIcon.src} sizes="152x152" />
      </head>
      <body className={`${montserrat.variable}`}>
        <Preview url={throwIfMissingEnv('CMS_URL')} />
        <NextIntlClientProvider>
          <Section as="header" className="sticky top-0 z-50">
            <Header />
          </Section>

          <Section as="main">
            {children}
          </Section>

          <Section as="footer">
            <Footer />
          </Section>
        </NextIntlClientProvider>
        <span
          dangerouslySetInnerHTML={{
            __html: `<!-- __ETN_.O.K.__ -->`,
          }}
        />
      </body>
    </html>
  );
}
