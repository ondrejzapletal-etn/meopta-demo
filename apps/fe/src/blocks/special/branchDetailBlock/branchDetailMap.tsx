'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import type { Branch } from '@repo/shared/payload-types';
import type { GeoJsonObject } from 'geojson';
import { FullscreenControl } from '../../../components/map/fullscreenControl';

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

function OpenPopup() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.openPopup();
          // Re-center on marker after popup opens
          const pos = layer.getLatLng();
          map.setView(pos, map.getZoom(), { animate: false });
        }
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

interface BranchDetailMapProps {
  branch: Branch;
}

export function BranchDetailMap({ branch }: BranchDetailMapProps) {
  if (!branch.latitude || !branch.longitude) return null;

  return (
    <div style={{ isolation: 'isolate' }}>
      <MapContainer
        center={[branch.latitude, branch.longitude]}
        zoom={14}
        className="h-[540px] w-full"
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <FullscreenControl />
        <OpenPopup />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
        />
        <CzechBorder />
        <Marker
          position={[branch.latitude, branch.longitude]}
          icon={customIcon}
        >
          <Popup maxWidth={220} minWidth={140}>
            <div>
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
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
