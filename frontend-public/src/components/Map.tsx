'use client';

import { useEffect, useState } from 'react';

interface MapProps {
  latitude: number;
  longitude: number;
  name?: string;
  className?: string;
}

// Composant Map avec Leaflet
export default function Map({ latitude, longitude, name, className = '' }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Import dynamique de react-leaflet côté client
    const loadMap = async () => {
      const L = await import('leaflet');
      const RL = await import('react-leaflet');
      
      // Fix pour les icônes Leaflet en Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      
      setMapComponents({
        MapContainer: RL.MapContainer,
        TileLayer: RL.TileLayer,
        Marker: RL.Marker,
        Popup: RL.Popup,
      });
    };
    
    loadMap();
  }, []);

  // État de chargement
  if (!isMounted || !MapComponents) {
    return (
      <div className={`bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center min-h-[320px] ${className}`}>
        <div className="text-center">
          <svg className="w-12 h-12 text-cyan-500 animate-pulse mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-slate-400 text-sm">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className={`min-h-[320px] ${className}`}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
      />
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ width: '100%', height: '320px' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          {name && (
            <Popup>
              <div className="text-center font-medium">{name}</div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}
