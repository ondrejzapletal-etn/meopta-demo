'use client';

import { YoutubeVideoBlock as YoutubeVideoBlockType } from '@repo/shared/payload-types';
import { Container } from '../../../components/container/container';
import { Typography } from '../../../components/typography/typography';
import { VideoEmbed } from '../../../components/videoEmbed/videoEmbed';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { cn } from '../../../utils/styles';

export const YoutubeVideoBlock = ({
  title,
  videoUrl,
  description,
}: YoutubeVideoBlockType) => {
  const { ref, isVisible } = useScrollAnimation();
  if (!videoUrl) return null;

  return (
    <div className="w-full bg-white">
      <Container
        size="ab-content"
        className={cn(
          'relative',
          'pt-12 lg:pt-20',
          'pb-12 lg:pb-20',
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="mb-8 max-w-2xl">
            {title && (
              <Typography variant="h2" className="text-meopta-text-primary">
                {title}
              </Typography>
            )}
            {description && (
              <p className="mt-3 text-16 leading-relaxed text-meopta-text-secondary lg:text-18">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Video */}
        <div
          ref={ref}
          className={cn(
            'mx-auto max-w-4xl opacity-0',
            isVisible && 'animate-fade-in-up',
          )}
        >
          <VideoEmbed url={videoUrl} title={title ?? undefined} />
        </div>
      </Container>
    </div>
  );
};
