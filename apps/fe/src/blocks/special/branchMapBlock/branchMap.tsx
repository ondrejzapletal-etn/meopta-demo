'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Branch } from '@repo/shared/payload-types';
import type { GeoJsonObject } from 'geojson';
import { FullscreenControl } from '../../../components/map/fullscreenControl';

export type BranchWithThumb = Branch & { thumbUrl: string | null };

const customIcon = new L.Icon({
  iconUrl: '/branch-marker.png',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -44],
});

const BORDER_STYLE: L.PathOptions = {
  color: '#333',
  weight: 2,
  opacity: 0.8,
  fillOpacity: 0,
};

function CzechBorder() {
  const [data, setData] = useState<GeoJsonObject | null>(null);
  useEffect(() => {
    fetch('/cz-border.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);
  if (!data) return null;
  return <GeoJSON data={data} style={BORDER_STYLE} />;
}

function FitMarkers({ branches }: { branches: BranchWithThumb[] }) {
  const map = useMap();
  useEffect(() => {
    const points = branches
      .filter((b) => b.latitude && b.longitude)
      .map((b) => L.latLng(b.latitude!, b.longitude!));
    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    const fit = () => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [30, 30] });
    };

    const ro = new ResizeObserver(fit);
    ro.observe(map.getContainer());
    fit();
    return () => ro.disconnect();
  }, [map, branches]);
  return null;
}

interface BranchMapProps {
  branches: BranchWithThumb[];
}

export function BranchMap({ branches }: BranchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const setHeight = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    el.style.height = `${Math.max(400, Math.floor(window.innerHeight - top))}px`;
  }, []);

  useEffect(() => {
    // Wait for layout to settle before measuring
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHeight();
      });
    });
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, [setHeight]);

  return (
    <div ref={containerRef} style={{ height: 'calc(100dvh - 130px)', isolation: 'isolate' }}>
      <MapContainer
        center={[49.8, 15.5]}
        zoom={7}
        className="h-full w-full"
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <FullscreenControl />
        <FitMarkers branches={branches} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
        />
        <CzechBorder />
        {branches.map((branch) => {
          if (!branch.latitude || !branch.longitude) return null;
          return (
            <Marker
              key={branch.id}
              position={[branch.latitude, branch.longitude]}
              icon={customIcon}
            >
              <Popup maxWidth={400} minWidth={branch.thumbUrl ? 340 : 180}>
                <div className={`flex ${branch.thumbUrl ? 'gap-3' : ''}`}>
                  <div className="min-w-0 flex-1">
                    <strong className="block text-[15px] leading-tight text-meopta-text-primary">
                      {branch.name}
                    </strong>
                    <span className="mt-1 block text-[13px] text-meopta-text-secondary">
                      {branch.street}
                      <br />
                      {branch.zip}
&nbsp;&nbsp;
                      {branch.city}
                    </span>
                    {branch.openingHours && branch.openingHours.length > 0 && (
                      <span className="mt-1 block text-[12px] text-meopta-text-secondary">
                        {branch.openingHours.map((h, i) => (
                          <span key={i}>
                            {h.days}
                            {': '}
                            {h.hours}
                            {i < branch.openingHours!.length - 1 && <br />}
                          </span>
                        ))}
                      </span>
                    )}
                    <a
                      href={`/${branch.slug}/`}
                      className="mt-2 inline-block text-[13px] font-medium text-meopta-blue-dark no-underline hover:underline"
                    >
                      Detail pobočky &rarr;
                    </a>
                  </div>
                  {branch.thumbUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- inside Leaflet popup, next/image not supported
                    <img
                      src={branch.thumbUrl}
                      alt={branch.name}
                      className="h-[110px] w-[130px] flex-shrink-0 rounded object-cover"
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
