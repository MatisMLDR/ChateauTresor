'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import PopUpChateau from '@/components/participants/PopUpChateau';
import Loader from '@/components/global/loader';
import { ChateauType } from '@/types';

// Import dynamique des composants React-Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });

export default function ParticipantsPage() {
  const [chateaux, setChateaux] = useState<ChateauType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [L, setLeaflet] = useState<any>(null);
  const [selectedChateau, setSelectedChateau] = useState<ChateauType | null>(null);

  useEffect(() => {
    const fetchLeaflet = async () => {
      const leaflet = await import('leaflet');
      setLeaflet(leaflet);
    };

    const fetchChateaux = async () => {
      try {
        const response = await fetch('/api/chateaux');
        const chateauxData: ChateauType[] = await response.json();

        const chateauxWithChasses = await Promise.all(
          chateauxData.map(async (chateau) => {
            const response = await fetch(`/api/chasses/chateau?id_chateau=${chateau.id_chateau}`);
            const chasses = await response.json();
            return { ...chateau, chasses };
          })
        );

        setChateaux(chateauxWithChasses);
      } catch (error) {
        console.error('Erreur lors de la récupération des châteaux :', error);
      }
    };

    fetchLeaflet();
    fetchChateaux();
  }, []);

  const franceCenter: [number, number] = [46.603354, 1.888334];

  const filteredChateaux = chateaux.filter(
    (chateau) => chateau.nom && chateau.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!L) return <Loader />;

  const customIcon = new L.Icon({
    iconUrl: '/castle-marker.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return (
    <div className="z-0 flex h-full">
      <div className="relative flex flex-1 flex-col">
        <input
          type="text"
          placeholder="Rechercher un château..."
          className="fixed bottom-8 left-1/2 z-[1000] h-8
             w-72 -translate-x-1/2 rounded-full p-2 pl-4 text-gray-700 placeholder-gray-500
             shadow-lg !outline-none
             transition-all duration-200
             hover:shadow-xl focus:shadow-xl
             md:absolute md:right-4 md:top-4 md:translate-x-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="h-full w-full">
          <MapContainer center={franceCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {filteredChateaux.map((chateau) => {
              // Vérifier que la localisation est définie
              if (!chateau.localisation) {
                console.warn(`Localisation manquante pour le château ${chateau.nom}`);
                return null; // Ignorer ce château
              }

              const position = chateau.localisation
                .split(',')
                .map((coord) => parseFloat(coord.trim())) as [number, number];

              return (
                <Marker
                  key={chateau.id_chateau}
                  position={position}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedChateau(chateau),
                  }}
                />
              );
            })}
          </MapContainer>
        </div>

        <PopUpChateau
          chateau={selectedChateau}
          open={!!selectedChateau}
          onClose={() => setSelectedChateau(null)}
        />
      </div>
    </div>
  );
}
