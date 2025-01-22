'use client';

import React, { useEffect, useState } from 'react';
import CardChasse from '@/components/global/CardChasse';
import Chasse from '@/classes/Chasse';

const ChasseListPage: React.FC = () => {
  const [chasses, setChasses] = useState<Chasse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchChasses = async () => {
      try {
        // Utilisation directe de la méthode de classe
        const chasseInstances = await Chasse.getAllChassesFinies()
        
        // Tri
        const sortedChasses = chasseInstances.sort(
          (a: any, b: any) => 
            new Date(b.getDateCreation()).getTime() - 
            new Date(a.getDateCreation()).getTime()
        );

        setChasses(sortedChasses);
      } catch (err) {
        console.error('Erreur lors de la récupération des chasses :', err);
      }
    };

    fetchChasses();
  }, []);

  // Filtrer les chasses en fonction de la recherche
  const chassesFiltrees = chasses.filter((chasse) =>
    chasse.getTitre().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Chasses au trésor terminées</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher une chasse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chassesFiltrees.map((chasse) => {
            return (
              <CardChasse key={chasse.getIdChasse()} chasse={chasse} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChasseListPage;