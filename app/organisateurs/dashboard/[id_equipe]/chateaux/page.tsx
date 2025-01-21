'use client';

import React, { useEffect, useState } from 'react';
import CardChateau from '@/components/global/CardChateau';
import Chateau from '@/classes/Chateau';
import { Skeleton } from '@/components/ui/skeleton';

const ChateauListPage: React.FC = () => {
  const [chateaux, setChateaux] = useState<Chateau[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // Récupère la liste des châteaux
  useEffect(() => {
    const fetchChateaux = async () => {
      try {
        const chateaux = await Chateau.getAllChateaux();
        setChateaux(chateaux);
      } catch (err) {
        console.error('Erreur lors de la récupération des châteaux :', err);
      } finally {
        setIsLoading(false);
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
        {isLoading
          ?
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <Skeleton className="h-[350px] rounded-md" />
            <Skeleton className="h-[350px] rounded-md" />
            <Skeleton className="h-[350px] rounded-md" />
            <Skeleton className="h-[350px] rounded-md" />
          </div>

          :
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredChateaux.map((chateau) => (
              <CardChateau chateau={chateau} key={chateau.getIdChateau()} />
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default ChateauListPage;