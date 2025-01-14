'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CardChasse from '@/components/CardChasse';
import Chasse from '@/classes/Chasse';

const ChasseListPage: React.FC = () => {
  const [chasses, setChasses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Récupérer toutes les chasses
  useEffect(() => {
    const fetchChasses = async () => {
      try {
        const everyChasses = await Chasse.getAllChasses();
        setChasses(everyChasses);
      } catch (err) {
        console.error('Erreur lors de la récupération des chasses :', err);
      }
    };

    fetchChasses();
  }, []);

  // Filtrer les chasses en fonction de la recherche
  const chassesFiltrees = chasses.filter((chasse) =>
    chasse.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Liste des Chasses</h1>

        {/* Barre de recherche */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher une chasse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Liste des chasses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chassesFiltrees.map((chasse) => (
            <CardChasse key={chasse.id_chasse} chasse={chasse} />
          ))}
        </div>
      </div>
    </div>
      );
      };

      export default ChasseListPage;