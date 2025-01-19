'use client';

import React, { useEffect, useState } from 'react';
import CardChateau from '@/components/global/CardChateau';
import Chateau from '@/classes/Chateau';

const ChateauListPage: React.FC = () => {
  const [chateaux, setChateaux] = useState<Chateau[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchChateaux = async () => {
      try {
        const chateauxInstances = await Chateau.getAllChateaux();
        setChateaux(chateauxInstances);
      } catch (err) {
        console.error('Erreur lors de la récupération des châteaux :', err);
      }
    };
    fetchChateaux();
  }, []);

  const filteredChateaux = chateaux.filter((chateau) =>
    chateau.getNom().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Liste des Châteaux</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher un château..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChateaux.map((chateau) => (
            <CardChateau key={chateau.getIdChateau()} chateau={chateau} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChateauListPage;