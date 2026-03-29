'use client';

import React, { useState } from 'react';
import { FaqItemsBlock as FaqItemsBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { RichTextRenderer } from '../../../components/richTextRenderer/richTextRenderer';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

/** Question mark on green circle — from original airbank.cz (60×60) */
const QuestionMarkIcon = () => (
  <svg viewBox="6 6 42 47" fill="none" className="h-[60px] w-[60px] shrink-0">
    <path fill="#000" d="M31.8625 51.8254c5.5557-.3563 9.9783-1.9096 9.8782-3.4694-.1-1.5597-4.6848-2.5353-10.2405-2.179-5.5556.3564-9.9782 1.9097-9.8781 3.4695.1 1.5597 4.6848 2.5353 10.2404 2.1789" opacity=".2" />
    <path fill="#9c3" d="M30.7413 51.5423C42.0031 49.6739 49.4838 38.2215 47.45 25.9627 45.4161 13.7038 34.6379 5.28075 23.3761 7.14916 12.1143 9.01758 4.63361 20.47 6.66745 32.7288 8.70128 44.9877 19.4795 53.4108 30.7413 51.5423" />
    <path stroke="#1e3300" strokeLinecap="round" strokeLinejoin="round" d="M30.7057 51.3812c11.2617-1.8684 18.7425-13.3208 16.7086-25.5796-2.0338-12.2589-12.812-20.68199-24.0738-18.81357C12.0787 8.85644 4.59797 20.3088 6.6318 32.5677c2.03384 12.2588 12.8121 20.6819 24.0739 18.8135" />
    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M31.6799 11.3398c5 2.02 9.92 7.04 11.43 13.22" />
    <path fill="#fff" d="M33.9899 21.39c-.34-.96-.81-1.84-1.39-2.6-.57-.74-1.24-1.43-2-2.05-.75-.62-1.57-1.15-2.41-1.57-.85-.42-1.73-.76-2.63-1-1.21-.32-2.41-.44-3.56-.35-.41.03-.82.09-1.21.18l-.19.04-3.38.91c-.74.15-1.43.4-2.07.73-.98.52-1.77 1.33-2.36 2.42-.58 1.07-.87 2.38-.87 3.87 0 .22.15.41.36.46l3.81.97c.38.1.78.1 1.16 0 1.14-.27 3.64-.87 4.59-1.1.22-.06.38-.26.36-.49-.03-.51-.03-1.46.2-2.51h.01c.84.37 1.58.9 2.19 1.58.84.94 1.25 2.04 1.25 3.38 0 1.42-.76 2.57-2.33 3.5-1.48.9-2.53 1.65-3.2 2.3-.7.67-1.19 1.45-1.47 2.31-.27.85-.41 1.97-.41 3.45v.04c0 .61.41 1.15 1 1.3l2.83.75c.41.11.84.11 1.25 0l2.03-.54c.59-.16 1-.69 1-1.3v-.26c0-.57.08-1.11.24-1.59.16-.49.34-.9.53-1.22.18-.3.49-.64.9-.99.44-.38.79-.66 1.04-.83.27-.18.69-.45 1.24-.8 1.2-.7 2.17-1.52 2.87-2.44.81-1.06 1.17-2.45 1.09-4.13-.04-.83-.21-1.66-.48-2.45z" />
    <path fill="#1e3200" d="M18.1599 19.38c.84-.29 1.81-.18 2.55.3s1.25 1.31 1.33 2.2c0-.9.13-1.69.29-2.58-.96-.52-2.12-.43-3.21-.31-.38.04-.68.15-.97.39z" />
    <path stroke="#1e3200" strokeLinecap="round" strokeLinejoin="round" d="M33.9899 21.39c-.34-.96-.81-1.84-1.39-2.6-.57-.74-1.24-1.43-2-2.05-.75-.62-1.57-1.15-2.41-1.57-.85-.42-1.73-.76-2.63-1-1.21-.32-2.41-.44-3.56-.35-.41.03-.82.09-1.21.18l-.19.04-3.38.91c-.74.15-1.43.4-2.07.73-.98.52-1.77 1.33-2.36 2.42-.58 1.07-.87 2.38-.87 3.87 0 .22.15.41.36.46l3.81.97c.38.1.78.1 1.16 0 1.14-.27 3.64-.87 4.59-1.1.22-.06.38-.26.36-.49-.03-.51-.03-1.46.2-2.51h.01c.84.37 1.58.9 2.19 1.58.84.94 1.25 2.04 1.25 3.38 0 1.42-.76 2.57-2.33 3.5-1.48.9-2.53 1.65-3.2 2.3-.7.67-1.19 1.45-1.47 2.31-.27.85-.41 1.97-.41 3.45v.04c0 .61.41 1.15 1 1.3l2.83.75c.41.11.84.11 1.25 0l2.03-.54c.59-.16 1-.69 1-1.3v-.26c0-.57.08-1.11.24-1.59.16-.49.34-.9.53-1.22.18-.3.49-.64.9-.99.44-.38.79-.66 1.04-.83.27-.18.69-.45 1.24-.8 1.2-.7 2.17-1.52 2.87-2.44.81-1.06 1.17-2.45 1.09-4.13-.04-.83-.21-1.66-.48-2.45z" />
    <path fill="#fff" d="M26.0898 41.8604c-.29-2.17-1.78-3.77-3.38-3.65h-.03l-2.59.53c-.05 0-.1 0-.16.01-1.64.22-2.73 2.19-2.44 4.42.29 2.17 1.79 3.77 3.38 3.64h.12c.12-.02.24-.05.36-.08l2.44-.48h.03c1.54-.33 2.55-2.25 2.27-4.39" />
    <path stroke="#94cd15" strokeLinecap="round" strokeLinejoin="round" d="M23.0299 40.7803c.24.48.4 1.03.48 1.63.14 1.05-.03 2.05-.43 2.83-.44.87-1.12 1.43-1.98 1.54" />
    <path stroke="#1e3200" strokeLinecap="round" strokeLinejoin="round" d="M26.0899 41.8604c-.29-2.17-1.78-3.77-3.38-3.65h-.03l-2.59.53c-.05 0-.12.03-.17.05-1.65.41-2.71 2.16-2.42 4.38.29 2.17 1.79 3.77 3.38 3.64h.12c.12-.02 2.8-.56 2.8-.56h.03c1.54-.33 2.55-2.25 2.27-4.39zM22.4499 19.3397c-.95-.43-2.72-.57-3.7-.22s-1.79 1.25-1.87 2.29" />
    <path stroke="#94cd15" strokeLinecap="round" strokeLinejoin="round" d="M23.04 34.3203c.16-.48.33-.88.51-1.18.18-.29.47-.62.88-.96.43-.37.77-.64 1.01-.81.26-.18.67-.44 1.2-.77 1.17-.68 2.1-1.47 2.79-2.36.71-.93 1.07-2.12 1.07-3.55 0-.98-.17-1.95-.49-2.87" />
  </svg>
);

/** Extract plain text from Lexical rich text JSON */
function extractPlainText(content: Record<string, unknown> | null | undefined): string {
  if (!content) return '';
  try {
    const root = content.root as { children?: { children?: { text?: string }[] }[] } | undefined;
    if (!root?.children) return '';
    const parts: string[] = [];
    for (const node of root.children) {
      if (node.children) {
        for (const child of node.children) {
          if (child.text) parts.push(child.text);
        }
      }
    }
    return parts.join(' ');
  } catch {
    return '';
  }
}

/** Single FAQ item with icon, truncated preview, and expandable answer */
const FaqItem = ({
  title,
  content,
}: {
  title: string;
  content: Record<string, unknown> | null | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const plainText = extractPlainText(content);
  const truncatedText = plainText.length > 330
    ? plainText.substring(0, 330).replace(/\s+\S*$/, '') + '\u2026'
    : plainText;

  return (
    <div className="flex gap-5 border-b border-meopta-border py-6 last:border-b-0">
      <div className="hidden md:block">
        <QuestionMarkIcon />
      </div>
      <div className="flex-1">
        <h3 className="text-[24px] font-medium leading-snug text-meopta-text-primary">
          {title}
        </h3>

        {isOpen
          ? (
              <div className="list-check-icon mt-3 text-16 leading-relaxed text-meopta-text-secondary">
                <RichTextRenderer content={content as Record<string, unknown>} />
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-2 text-16 text-meopta-text-primary underline transition-colors hover:text-meopta-blue-dark"
                >
                  Skrýt
                </button>
              </div>
            )
          : (
              <>
                <p className="mt-3 text-16 leading-relaxed text-meopta-text-secondary">
                  {truncatedText}
                </p>
                <button
                  onClick={() => setIsOpen(true)}
                  className="mt-2 text-16 text-meopta-text-primary underline transition-colors hover:text-meopta-blue-dark"
                >
                  Celý text
                </button>
              </>
            )}
      </div>
    </div>
  );
};

export const FaqItemsBlock = ({
  title,
  items,
  backgroundColor,
}: FaqItemsBlockType) => {
  const { ref, isVisible } = useScrollAnimation();
  const bgClass = backgroundColor === 'green'
    ? 'bg-meopta-blue'
    : backgroundColor === 'lightGrey'
      ? 'bg-meopta-bg-light'
      : 'bg-white';

  if (!items || items.length === 0) return null;

  return (
    <div className={cn('w-full', bgClass)}>
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-8 lg:pt-12',
          'pb-8 lg:pb-12',
        )}
      >
        {title && (
          <h2 className="mb-8 text-center text-[32px] font-medium text-meopta-text-primary lg:mb-10">
            {title}
          </h2>
        )}

        <div
          ref={ref}
          className={cn(
            'mx-auto max-w-[704px] opacity-0',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {items.map((item, index) => (
            <FaqItem
              key={item.id ?? index}
              title={item.title}
              content={item.content as Record<string, unknown> | null | undefined}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};
