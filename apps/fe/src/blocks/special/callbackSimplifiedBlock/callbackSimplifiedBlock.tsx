'use client';

import React, { useState } from 'react';
import { CallbackSimplifiedBlock as CallbackSimplifiedBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-5 w-5 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

export const CallbackSimplifiedBlock = ({
  title,
  description,
}: CallbackSimplifiedBlockType) => {
  const { ref, isVisible } = useScrollAnimation();
  const [phone, setPhone] = useState('+420 ');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="w-full bg-meopta-blue-dark">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-20',
        )}
      >
        <div
          ref={ref}
          className={cn(
            'mx-auto max-w-xl text-center opacity-0',
            isVisible && 'animate-fade-in-up',
          )}
        >
          {title && (
            <Typography variant="h2" className="mb-3 text-white">
              {title}
            </Typography>
          )}

          {description && (
            <p className="mb-8 text-16 leading-relaxed text-white/80 lg:text-18">
              {description}
            </p>
          )}

          {isSubmitted
            ? (
                <div className="text-center">
                  <p className="text-18 font-medium text-white">
                    Dekujeme, budeme vas kontaktovat.
                  </p>
                </div>
              )
            : (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
                    <div className="relative w-full max-w-xs">
                      <input
                        name="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-14 w-full rounded-full border-2 border-white/30 bg-white/10 px-6 text-16 text-white outline-none placeholder:text-white/50 focus:border-white/60"
                        aria-label="Telefon"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex h-14 items-center rounded-full border-2 border-white bg-transparent px-6 text-[0.875rem] font-medium text-white transition-colors hover:bg-white/10"
                    >
                      Odeslat
                      <ArrowRight />
                    </button>
                  </div>
                </form>
              )}

          {description && (
            <p className="mt-6 text-13 text-white/50">
              {description}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
};
