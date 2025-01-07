'use client';

import React, { useEffect, useState } from 'react';
import { Chasse } from '@/types';

const ChassesPage: React.FC = () => {
  const [chasses, setChasses] = useState<Chasse[]>([]);
  const [filteredChasses, setFilteredChasses] = useState<Chasse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all chasses
  useEffect(() => {
    const fetchChasses = async () => {
      try {
        const response = await fetch('/api/chasses');
        const data = await response.json();
        console.log('Réponse API :', data);
        setChasses(data || []); // Initialiser avec un tableau vide si la réponse est nulle
        setFilteredChasses(data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des chasses :', err);
        setChasses([]);
        setFilteredChasses([]);
      }
    };

    fetchChasses();
  }, []);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredChasses(
      chasses.filter((chasse) =>
        chasse.titre.toLowerCase().includes(query) ||
        chasse.description.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Liste des Chasses</h1>

      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une chasse..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Liste des chasses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(filteredChasses) && filteredChasses.map((chasse) => (
          <div key={chasse.id_chasse} className="border rounded-md p-4 shadow-md">
            <img
              src={chasse.image}
              alt={chasse.titre}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="font-bold text-lg mb-2">{chasse.titre}</h3>
            <p className="text-gray-600 text-sm mb-2">{chasse.description}</p>
            <p className="text-gray-800 font-medium">
              Difficulté : {chasse.difficulte} / 3 | Prix : {chasse.prix} €
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChassesPage;