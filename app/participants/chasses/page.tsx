'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SideBar } from '@/components/ui/SideBar';
import { SideBarHuntCreator } from '@/components/ui/SideBarHuntCreator';

const ChasseListPage: React.FC = () => {
  const [chasses, setChasses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Récupérer toutes les chasses
  useEffect(() => {
    const fetchChasses = async () => {
      try {
        const response = await fetch('/api/chasses'); // API pour récupérer toutes les chasses
        const data = await response.json();
        setChasses(data);
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
      <SideBar />
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
            <div key={chasse.id_chasse} className="border rounded-md p-4 shadow-md">
              <img
                src={chasse.image || '/default-chasse.jpg'}
                alt={chasse.titre}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="font-bold text-lg mb-2">{chasse.titre}</h3>
              <p className="text-gray-600 text-sm mb-2">{chasse.description}</p>
              <p className="text-gray-800 font-medium">Difficulté : {chasse.difficulte} / 3</p>
              <p className="text-gray-800 font-medium">Prix : {chasse.prix} €</p>

              <Link href={`/participants/chasses/${chasse.id_chasse}`}>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full">
                  Voir plus
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
      );
      };

      export default ChasseListPage;