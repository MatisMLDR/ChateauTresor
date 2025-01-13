'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const ChateauListPage: React.FC = () => {
  const [chateaux, setChateaux] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all chateaux with their associated chasses
  useEffect(() => {
    const fetchChateaux = async () => {
      try {
        const response = await fetch('/api/chateaux');
        const chateauxData = await response.json();

        const chateauxWithChasses = await Promise.all(
          chateauxData.map(async (chateau: any) => {
            const chassesResponse = await fetch(`/api/chasses/chateau?id_chateau=${chateau.id_chateau}`);
            const chasses = await chassesResponse.json();
            return { ...chateau, chasses };
          })
        );

        setChateaux(chateauxWithChasses);
      } catch (err) {
        console.error('Erreur lors de la récupération des châteaux :', err);
      }
    };

    fetchChateaux();
  }, []);

  // Filter chateaux based on search query
  const filteredChateaux = chateaux.filter((chateau) =>
    chateau.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Liste des Châteaux</h1>

        {/* Barre de recherche */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher un château..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Liste des châteaux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChateaux.map((chateau) => (
            <div key={chateau.id_chateau} className="border rounded-md p-4 shadow-md">
              <img
                src={chateau.image || '/default-chateau.jpg'}
                alt={chateau.nom}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="font-bold text-lg mb-2">{chateau.nom}</h3>
              <p className="text-gray-600 text-sm mb-2">{chateau.description}</p>
              <p className="text-gray-800 font-medium">Capacité : {chateau.capacite} personnes</p>

              {/* Liste des chasses associées */}
              {chateau.chasses && chateau.chasses.length > 0 ? (
                <div className="mt-4">
                  <h4 className="font-bold text-md mb-2">Chasses disponibles :</h4>
                  <ul className="list-disc pl-5">
                    {chateau.chasses.map((chasse: any) => (
                      <li key={chasse.id_chasse} className="text-sm text-gray-600 mb-1">
                        {chasse.titre} - {chasse.difficulte} / 3
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">Aucune chasse disponible.</p>
              )}

              <Link href={`/participants/chateaux/${chateau.id_chateau}`}>
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

      export default ChateauListPage;