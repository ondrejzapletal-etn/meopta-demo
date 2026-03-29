import { HeroWithImageBlock as HeroWithImageBlockType } from '@repo/shared/payload-types';
import Image from 'next/image';
import { Container } from '../../../components/container/container';
import { RichTextRenderer } from '../../../components/richTextRenderer/richTextRenderer';
import { getImageSrcWithFallback } from '../../../utils/images';
import { cn } from '../../../utils/styles';

const ArrowRight = () => (
  <svg viewBox="0 0 25 25" fill="currentColor" className="ml-2 h-6 w-6 shrink-0">
    <path d="m19.16 12-4.24-4.24a.7.7 0 1 0-1 1l3.05 3.04H6.33a.7.7 0 0 0 0 1.4h10.64l-3.04 3.05a.7.7 0 0 0 0 .99.7.7 0 0 0 .99 0l4.24-4.25a.7.7 0 0 0 0-.99" fillRule="evenodd" />
  </svg>
);

const bgClasses: Record<string, string> = {
  green: 'bg-meopta-blue',
  white: 'bg-white',
  lightGrey: 'bg-meopta-bg-light',
  lightGreen: 'bg-meopta-blue-light',
};

const btnClasses: Record<string, { primary: string; outline: string }> = {
  green: {
    primary: 'bg-white hover:bg-meopta-bg-light',
    outline: 'border border-meopta-blue-dark hover:bg-white/10',
  },
  white: {
    primary: 'bg-meopta-blue hover:bg-meopta-blue-hover text-white',
    outline: 'border border-meopta-blue-dark hover:bg-meopta-blue-light',
  },
  lightGrey: {
    primary: 'bg-meopta-blue hover:bg-meopta-blue-hover text-white',
    outline: 'border border-meopta-blue-dark hover:bg-meopta-blue-light',
  },
  lightGreen: {
    primary: 'bg-meopta-blue hover:bg-meopta-blue-hover text-white',
    outline: 'border border-meopta-blue-dark hover:bg-meopta-blue-light',
  },
};

export const HeroWithImageBlock = ({
  title,
  description,
  image,
  backgroundColor,
  imagePosition,
  links,
}: HeroWithImageBlockType) => {
  const bg = backgroundColor ?? 'white';
  const position = imagePosition ?? 'right';

  return (
    <div className={cn('w-full', bgClasses[bg])}>
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-20',
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center gap-8 lg:flex-row lg:gap-12',
            position === 'left' && 'lg:flex-row-reverse',
          )}
        >
          {/* Text content */}
          <div className="flex flex-1 flex-col items-start">
            {title && (
              <h1 className="mb-4 text-30 font-bold leading-[1.17] text-black lg:text-48">
                {title}
              </h1>
            )}

            {description && (
              <div className="mb-6 max-w-xl text-18 font-light leading-normal text-meopta-text-primary lg:text-24">
                <RichTextRenderer content={description as Record<string, unknown>} />
              </div>
            )}

            {links && links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url ?? '#'}
                    className={cn(
                      `
                        flex h-14 items-center rounded-full px-6 text-[0.875rem]
                        font-medium text-meopta-text-primary no-underline
                        transition-colors
                      `,
                      link.appearance === 'outline'
                        ? btnClasses[bg]?.outline
                        : btnClasses[bg]?.primary,
                    )}
                  >
                    {link.label}
                    <ArrowRight />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          {image && (
            <div className="relative h-[220px] w-full flex-shrink-0 md:h-[260px] lg:h-[290px] lg:w-[520px]">
              <Image
                src={getImageSrcWithFallback(image)}
                alt={title ?? ''}
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
