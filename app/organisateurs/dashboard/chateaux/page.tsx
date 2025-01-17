'use client';

import React, { useEffect, useState } from 'react';
import CardChateau from '@/components/global/CardChateau';
import Chateau from '@/classes/Chateau';
import { Skeleton } from '@/components/ui/skeleton'; // Importez les composants Skeleton de shadcn/ui

const ChateauListPage: React.FC = () => {
  const [chateaux, setChateaux] = useState<Chateau[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // État de chargement

  // Récupère la liste des châteaux avec leurs chasses associées
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
            return new Chateau({ ...chateau, chasses }); // Assurez-vous que chateau est une instance de Chateau
          })
        );

        setChateaux(chateauxWithChasses);
      } catch (err) {
        console.error('Erreur lors de la récupération des châteaux :', err);
      } finally {
        setLoading(false); // Arrête le chargement une fois les données récupérées
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
          {loading
            ? // Affiche les squelettes pendant le chargement
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))
            : // Affiche les châteaux une fois le chargement terminé
              filteredChateaux.map((chateau) => (
                <CardChateau chateau={chateau} key={chateau.getIdChateau()} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ChateauListPage;
