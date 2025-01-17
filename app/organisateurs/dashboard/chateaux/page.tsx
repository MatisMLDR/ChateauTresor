'use client';

import React, { useEffect, useState } from 'react';
import CardChateau from '@/components/global/CardChateau';
import Chateau from '@/classes/Chateau';

const ChateauListPage: React.FC = () => {
  const [chateaux, setChateaux] = useState<Chateau[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Récupere la liste des chateaux avec leurs chasses associée
  useEffect(() => {
    const fetchChateaux = async () => {
      try {
        const response = await fetch('/api/chateaux');
        const chateauxData = await response.json();

        const chateauxWithChasses = await Promise.all(
          chateauxData.map(async (chateau: any) => {
            const chassesResponse = await fetch(
              `/api/chasses/chateau?id_chateau=${chateau.id_chateau}`
            );
            const chasses = await chassesResponse.json();
            return new Chateau({ ...chateau, chasses }); // Ensure chateau is a Chateau instance
          })
        );

        setChateaux(chateauxWithChasses);
      } catch (err) {
        console.error('Erreur lors de la récupération des châteaux :', err);
      }
    };

    fetchChateaux();
  }, []);

  // Filtre les châteaux en fonction de la recherche
  const filteredChateaux = chateaux.filter((chateau) =>
    chateau.getNom().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Liste des Châteaux</h1>

        {/* Barre de recherche */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher un château..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 shadow-sm"
          />
        </div>

        {/* Liste des châteaux */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChateaux.map((chateau) => (
            <CardChateau chateau={chateau} key={chateau.getIdChateau()} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChateauListPage;
