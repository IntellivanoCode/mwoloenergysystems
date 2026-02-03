'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface MapMarker {
  lat: number;
  lng: number;
  popup?: string;
}

interface MapProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  className?: string;
}

// Composant Map dynamique (ne charge que côté client)
function MapComponent({ center, zoom = 13, markers = [], height = '400px', className = '' }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div 
        className={`bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <svg className="w-12 h-12 text-slate-600 animate-pulse mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-slate-500 text-sm">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  // Import dynamique de Leaflet côté client uniquement
  const L = require('leaflet');
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');
  
  // Fix pour les icônes Leaflet en Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  // Icône personnalisée pour Mwolo Energy
  const mwoloIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background: linear-gradient(to right, #06b6d4, #3b82f6); width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
      <div style="transform: rotate(45deg); text-align: center; line-height: 24px; font-size: 14px;">⚡</div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
      />
      <style>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        className={className}
        style={{ width: '100%', height }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={[marker.lat, marker.lng]}
            icon={mwoloIcon}
          >
            {marker.popup && (
              <Popup>
                <div dangerouslySetInnerHTML={{ __html: marker.popup }} />
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

// Export avec chargement dynamique (désactivé côté serveur)
export default dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: () => (
    <div className="bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center h-full w-full min-h-[200px]">
      <div className="text-center">
        <svg className="w-12 h-12 text-slate-600 animate-pulse mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p className="text-slate-500 text-sm">Chargement de la carte...</p>
      </div>
    </div>
  ),
});
