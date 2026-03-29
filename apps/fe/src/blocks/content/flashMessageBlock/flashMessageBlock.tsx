'use client';

import { FlashMessageBlock as FlashMessageBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const FlashMessageBlock = ({
  content,
  linkLabel,
  linkUrl,
}: FlashMessageBlockType) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="w-full bg-[#667c3e]">
      <Container size="ab-content" className="py-3 lg:py-4">
        <div
          ref={ref}
          className={cn(
            'text-center opacity-0',
            isVisible && 'animate-fade-in',
          )}
        >
          <span className="text-14 text-white/90 lg:text-16">
            {content}
            {linkLabel && linkUrl && (
              <a
                href={linkUrl}
                className="ml-1 text-white underline hover:text-white/80"
              >
                {linkLabel}
              </a>
            )}
          </span>
        </div>
      </Container>
    </div>
  );
};
