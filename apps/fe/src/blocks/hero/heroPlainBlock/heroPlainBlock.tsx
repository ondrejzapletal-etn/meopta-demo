import { HeroPlainBlock as HeroPlainBlockType } from '@repo/shared/payload-types';
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
};

const btnClasses: Record<string, { primary: string; outline: string }> = {
  green: {
    primary: 'bg-white hover:bg-meopta-blue-hover',
    outline: 'border border-meopta-blue-dark hover:bg-[#c6e87a]',
  },
  white: {
    primary: 'bg-meopta-blue hover:bg-meopta-blue-hover text-white',
    outline: 'border border-meopta-blue-dark hover:bg-meopta-blue-light',
  },
  lightGrey: {
    primary: 'bg-meopta-blue hover:bg-meopta-blue-hover text-white',
    outline: 'border border-meopta-blue-dark hover:bg-meopta-blue-light',
  },
};

export const HeroPlainBlock = ({
  title,
  description,
  image,
  backgroundColor,
  textAlign,
  links,
}: HeroPlainBlockType) => {
  const bg = backgroundColor ?? 'green';
  const centered = textAlign === 'center';

  return (
    <div className={cn('w-full', bgClasses[bg])}>
      <Container size="ab-content" className="relative pt-12 pb-5 lg:py-8">
        <div className={cn(
          'flex flex-col gap-6 lg:gap-12',
          image
            ? 'flex-row items-center'
            : centered
              ? `items-center text-center`
              : `items-start`,
        )}
        >
          <div className={cn(image ? 'w-2/3' : 'flex-1', !image && centered && `
            flex flex-col items-center
          `)}
          >
            {title && (
              <h2 className={cn(
                'mb-4 leading-[1.17] text-black',
                image
                  ? 'text-30 font-bold lg:text-48'
                  : `text-24 font-medium lg:text-[32px]`,
              )}
              >
                {title}
              </h2>
            )}
            {description && (
              <div className={cn(
                `
                  mb-6 leading-normal font-light text-meopta-text-primary
                  [&_p]:text-18 [&_p]:lg:text-20
                `,
                image ? 'max-w-xl' : 'max-w-3xl',
              )}
              >
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
          {image && (
            <div className="relative h-[400px] w-1/3 flex-shrink-0">
              <Image
                src={getImageSrcWithFallback(image)}
                alt={title ?? ''}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
