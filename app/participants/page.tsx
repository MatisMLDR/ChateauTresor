'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import PopUpChateau from '@/components/participants/PopUpChateau';
import { ChateauType } from '@/types';
import { SideBar } from '@/components/ui/SideBar';

// Import dynamique des composants React-Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

export default function ParticipantsPage() {
  const [chateaux, setChateaux] = useState<ChateauType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [L, setLeaflet] = useState<any>(null); // Charger Leaflet côté client

  useEffect(() => {
    const fetchLeaflet = async () => {
      const leaflet = await import('leaflet'); // Charger Leaflet côté client
      setLeaflet(leaflet);
    };

    const fetchChateaux = async () => {
      try {
        const response = await fetch('/api/chateaux');
        const chateauxData: ChateauType[] = await response.json();

        console.log('Châteaux récupérés :', chateauxData); // Debug

        const chateauxWithChasses = await Promise.all(
          chateauxData.map(async (chateau) => {
            const response = await fetch(`/api/chasses/chateau?id_chateau=${chateau.id_chateau}`);
            const chasses = await response.json();
            console.log(`Chasses pour le château ${chateau.nom}:`, chasses); // Debug
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

  const filteredChateaux = chateaux.filter((chateau) =>
    chateau.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!L) return <p>Chargement de la carte...</p>;

  const customIcon = new L.Icon({
    iconUrl: '/castle-marker.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return (
    <div className="flex">
      <SideBar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Barre de recherche */}
        <div className="p-4 bg-gray-100">
          <input
            type="text"
            placeholder="Rechercher un château..."
            className="p-2 w-full border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Carte */}
        <div style={{ height: 'calc(100vh - 74px)', width: '100%' }}>
          <MapContainer center={franceCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {filteredChateaux.map((chateau) => {
              const position = chateau.localisation
                .split(',')
                .map((coord) => parseFloat(coord.trim())) as [number, number];

              console.log(`Position pour le château ${chateau.nom}:`, position); // Debug

              return (
                <Marker key={chateau.id_chateau} position={position} icon={customIcon}>
                  <Popup maxWidth={600} maxHeight={400}>
                    <PopUpChateau chateau={chateau} />
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}