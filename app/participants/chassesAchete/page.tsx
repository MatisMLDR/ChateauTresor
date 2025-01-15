// /app/participants/chassesAchete/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ChasseCard from '@/components/participants/jouer/chasseCard';
import { useRouter } from 'next/navigation';

const ChasseList: React.FC = () => {
  const [chasses, setChasses] = useState<any[]>([]);
  const [chassesAchetees, setChassesAchetees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const participantId = '1'; // Remplacez par une gestion dynamique si nécessaire.
  const router = useRouter();

  // Récupération des chasses et des chasses achetées
  useEffect(() => {
    const fetchChasses = async () => {
      try {
        const response = await fetch('/api/chasses');
        const data = await response.json();
        setChasses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur lors de la récupération des chasses :', err);
      }
    };

    const fetchChassesAchetees = async () => {
      try {
        const response = await fetch(`/api/participants/chasse?id_participant=${participantId}`);
        const data = await response.json();
        setChassesAchetees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur lors de la récupération des chasses achetées :', err);
      }
    };

    fetchChasses();
    fetchChassesAchetees();
  }, [participantId]);

  // Filtrage des chasses en fonction de la recherche
  const chassesFiltrees = chasses.filter((chasse) =>
    chasse.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour rediriger vers la page de jeu
  const handleJouer = (chasseId: string) => {
    router.push(`/participants/jouer?chasseId=${chasseId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Liste des Chasses</h1>

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
        {chassesFiltrees.map((chasse) => (
          <ChasseCard
            key={chasse.id_chasse}
            chasse={chasse}
            isAchetee={true} // On force la valeur à true pour permettre de jouer à toutes les chasses
            onJouer={() => handleJouer(chasse.id_chasse)} // Passe la fonction de redirection
          />
        ))}
      </div>
    </div>
  );
};

export default ChasseList;