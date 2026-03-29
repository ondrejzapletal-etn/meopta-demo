'use client';

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

export function FullscreenControl() {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setTimeout(() => map.invalidateSize(), 100);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [map]);

  const toggle = () => {
    const container = map.getContainer();
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={toggle}
          className="flex !h-[30px] !w-[30px] items-center justify-center bg-white hover:bg-gray-100"
          title={isFullscreen ? 'Ukončit celou obrazovku' : 'Celá obrazovka'}
          aria-label={isFullscreen ? 'Ukončit celou obrazovku' : 'Celá obrazovka'}
        >
          {isFullscreen
            ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="#333">
                  <path d="M0 9h3v3h2V7H0v2zm3-4H0v2h5V2H3v3zm6 7h2v-3h3V7H9v5zm2-10V0H9v5h5V3h-3z" />
                </svg>
              )
            : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="#333">
                  <path d="M2 9H0v5h5v-2H2V9zM0 5h2V2h3V0H0v5zm12 7H9v2h5V9h-2v3zM9 0v2h3v3h2V0H9z" />
                </svg>
              )}
        </button>
      </div>
    </div>
  );
}
