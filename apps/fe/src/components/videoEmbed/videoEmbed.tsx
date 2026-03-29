'use client';

import React, { useState } from 'react';
import { cn } from '../../utils/styles';

interface VideoEmbedProps {
  url: string;
  title?: string;
  thumbnail?: string;
  className?: string;
}

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;

  return url;
}

function getThumbnailUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
  return null;
}

export const VideoEmbed = ({ url, title, thumbnail, className }: VideoEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = getEmbedUrl(url);
  const thumbUrl = thumbnail ?? getThumbnailUrl(url);

  if (isPlaying) {
    return (
      <div className={cn(`
        relative aspect-video w-full overflow-hidden rounded-xl
      `, className)}
      >
        <iframe
          src={embedUrl}
          title={title ?? 'Video'}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsPlaying(true)}
      className={cn(`
        group relative aspect-video w-full cursor-pointer overflow-hidden
        rounded-xl bg-meopta-bg-light
      `, className)}
      aria-label={`Play ${title ?? 'video'}`}
    >
      {thumbUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-meopta-blue text-white shadow-lg transition-transform group-hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
};
