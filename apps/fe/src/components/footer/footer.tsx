import React from 'react';
import Image from 'next/image';
import { Container } from '../container/container';
import { LinkCMS } from '../link/link';
import { fetchFooter, fetchSettings } from '../../api/fetch';
import { AnetaSection, ChatFloatingButton } from './anetaChat';
import { FooterAccordionSection } from './footerAccordion';

interface FooterColumn {
  title: string;
  items?: FooterItem[];
  id?: string | null;
}

interface FooterItem {
  link?: {
    type?: string | null;
    url?: string | null;
    label?: string | null;
    reference?: { value: string | { slug?: string } } | null;
  } | null;
  id?: string | null;
}

interface Social {
  url?: string | null;
  type: string;
  id?: string | null;
}

function getLinkUrl(link: FooterItem['link']): string {
  if (!link) return '/';
  if (link.type === 'custom' && link.url) return link.url;
  if (link.type === 'reference' && link.reference?.value) {
    const ref = link.reference.value;
    return typeof ref === 'string' ? `/${ref}` : `/${ref.slug ?? ''}`;
  }
  return link.url ?? '/';
}

const ArrowIcon = () => (
  <svg viewBox="0 0 25 25" fill="#99cc33" aria-hidden="true" className="h-5 w-5 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

const socialIcons: Record<string, React.ReactNode> = {
  facebook: (
    <svg width="34" height="34" viewBox="0 0 60 60" fill="currentColor"><path d="M22 58h8V33a1 1 0 0 1 1-1h9.42l2.3-8H31a1 1 0 0 1-1-1v-8.48C30 10.5 32.2 8 35.74 8H44V2H32.86C26.98 2 22 6.74 22 12.36V23a1 1 0 0 1-1 1h-5v8h5a1 1 0 0 1 1 1v25Zm9 2H21a1 1 0 0 1-1-1V34h-5c-.56 0-1-.44-1-1V23a1 1 0 0 1 1-1h5v-9.64C20 5.54 25.76 0 32.86 0H45c.56 0 1 .44 1 1v8c0 .56-.44 1-1 1h-9.26C32.36 10 32 13.16 32 14.52V22h12.04c.32 0 .62.14.8.4.2.24.24.58.16.88l-2.88 10a.99.99 0 0 1-.96.72H32v25a1 1 0 0 1-1 1Z" /></svg>
  ),
  twitter: (
    <svg width="34" height="34" viewBox="0 0 60 60" fill="currentColor"><path d="M35.56 25.4 57.4 0h-5.17L33.26 22.05 18.1 0H.64l22.9 33.34L.64 59.97H5.8l20.03-23.29 16 23.29h17.48Zm-7.1 8.23-2.31-3.31L7.68 3.9h7.95l14.9 21.32 2.33 3.32 19.37 27.71h-7.95L28.47 33.64Zm0 0" /></svg>
  ),
  instagram: (
    <svg width="34" height="34" viewBox="0 0 25 25" fill="currentColor"><path d="M12.52 9.83a2.98 2.98 0 1 0 0 5.96 2.98 2.98 0 0 0 0-5.96m5.98 11.3h-12a2.63 2.63 0 0 1-2.63-2.63v-12A2.63 2.63 0 0 1 6.5 3.87h12a2.63 2.63 0 0 1 2.63 2.63v12a2.63 2.63 0 0 1-2.63 2.63Zm-12-16c-.76 0-1.38.61-1.38 1.37v12c0 .76.62 1.38 1.38 1.38h12c.76 0 1.38-.62 1.38-1.38v-12c0-.76-.62-1.38-1.38-1.38h-12Zm6.02 11.9a4.23 4.23 0 1 1 0-8.46 4.23 4.23 0 0 1 0 8.46Zm5.73-9.35a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0Z" /></svg>
  ),
  linkedin: (
    <svg width="34" height="34" viewBox="0 0 60 60" fill="currentColor"><path d="M56.5 60h-53A3.51 3.51 0 0 1 0 56.5v-53A3.5 3.5 0 0 1 3.5 0h53A3.5 3.5 0 0 1 60 3.5v53c0 1.92-1.57 3.5-3.5 3.5ZM3.5 2C2.67 2 2 2.68 2 3.5v53c0 .82.67 1.5 1.5 1.5h53c.83 0 1.5-.68 1.5-1.5v-53c0-.82-.67-1.5-1.5-1.5h-53ZM19 52H9a1 1 0 0 1-1-1V23a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v28a1 1 0 0 1-1 1Zm-9-2h8V24h-8v26Zm4.23-31.74a6.01 6.01 0 0 1 0-12 6 6 0 1 1 0 12Zm0-10a4 4 0 1 0-.01 8 4 4 0 0 0 0-8ZM51 52H41a1 1 0 0 1-1-1V36a4 4 0 0 0-8 0v15a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V23a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1.34c1.67-.82 4.63-1.84 9-1.84 6.06 0 11 4.94 11 11V51a1 1 0 0 1-1 1Zm-9-2h8V33.5c0-4.96-4.04-9-9-9-6.32 0-9.34 2.36-9.37 2.38-.3.24-.72.28-1.06.12a1 1 0 0 1-.57-.9V24h-6v26h6V36a6.01 6.01 0 0 1 12 0v14Z" /></svg>
  ),
  youtube: (
    <svg width="34" height="34" viewBox="0 0 60 60" fill="currentColor"><path d="M29.5 50.37c-5.45 0-11.02-.2-19.2-.7-4.24-.26-8.18-3.98-8.6-8.12-.93-9.12-.93-13.56 0-22.68.43-4.14 4.37-7.86 8.6-8.12 16.36-1 22.04-1 38.4 0 4.24.26 8.16 3.98 8.6 8.12.95 9.12.95 13.58 0 22.68-.41 4.14-4.35 7.86-8.6 8.12-8.18.5-13.73.7-19.2.7Zm0-38.32c-5.41 0-10.93.2-19.07.7-3.26.2-6.4 3.16-6.74 6.32-.92 8.96-.92 13.32 0 22.28.34 3.18 3.48 6.12 6.74 6.32 16.27 1 21.88 1 38.16 0 3.25-.2 6.4-3.14 6.73-6.32.92-8.94.9-13.32-.02-22.28-.31-3.16-3.45-6.12-6.71-6.32-8.15-.5-13.67-.7-19.09-.7Zm-5.48 24.76a.88.88 0 0 1-.54-.18.95.95 0 0 1-.46-.82V22.39c0-.34.16-.66.46-.84a1 1 0 0 1 .95-.08l15.27 6.7a1 1 0 0 1 0 1.84l-15.27 6.7a.94.94 0 0 1-.4.1Zm1-12.9v10.36l11.8-5.18-11.8-5.18Z" /></svg>
  ),
};

export const Footer = async () => {
  let footerData: { columns?: FooterColumn[]; copyrightText?: string } = {};
  let settingsData: { socials?: Social[]; appStore?: { iosUrl?: string; androidUrl?: string } } = {};

  try {
    [footerData, settingsData] = await Promise.all([fetchFooter(), fetchSettings()]);
  } catch {
    // Fallback to defaults if CMS is unavailable
  }

  const columns = footerData.columns ?? [];
  const socials = settingsData.socials ?? [];
  const copyrightText = footerData.copyrightText ?? '';

  return (
    <>
      <footer className="text-white">
        {/* Link columns — darker gray background */}
        <div className="bg-[#41454b]">
          <Container size="ab-content" className="border-0 pt-10 pb-8 lg:pt-16 lg:pb-10">
            <div className="mx-12 grid grid-cols-1 gap-0 md:mx-0 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {columns.map((col, i) =>
                col.title === 'Aneta'
                  ? (
                      <div key={col.id ?? i} className="pt-4 md:pt-0">
                        <h4 className="mb-5 text-18 font-bold text-meopta-blue">{col.title}</h4>
                        <AnetaSection />
                      </div>
                    )
                  : (
                      <FooterAccordionSection key={col.id ?? i} title={col.title}>
                        {col.items && col.items.length > 0 && (
                          <ul className="flex flex-col gap-3.5">
                            {col.items.map((item, j) => (
                              <li key={item.id ?? j}>
                                <a
                                  href={getLinkUrl(item.link)}
                                  className="inline-flex items-center gap-2 text-14 font-[550] text-white/80 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
                                >
                                  <ArrowIcon />
                                  {item.link?.label ?? ''}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </FooterAccordionSection>
                    ),
              )}
            </div>
          </Container>
        </div>

        {/* Bottom section — black background */}
        <div className="bg-black">
          <Container size="ab-content" className="border-0 py-8">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
              {/* Social links */}
              <div className="flex-1">
                <h4 className="mb-4 text-center text-16 font-bold text-meopta-blue">Sledujte nás</h4>
                <div className="flex items-center justify-center gap-3">
                  {socials.map((social, i) => (
                    <a
                      key={'id' in social ? social.id ?? i : i}
                      href={social.url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-meopta-blue transition-opacity hover:opacity-80"
                      aria-label={social.type}
                    >
                      {socialIcons[social.type] ?? socialIcons.facebook}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </Container>

          {/* PPF logo + Copyright */}
          <Container size="ab-content" className="border-0 pb-8">
            <div className="flex flex-col items-center gap-3 pt-0">
              <p className="text-center text-12 text-white">
                {copyrightText}
              </p>
            </div>
          </Container>
        </div>
      </footer>

      {/* Floating chat button */}
      <ChatFloatingButton />
    </>
  );
};
