"use client"
import React, { useState, useEffect } from 'react';
import { getAllIndicesByEnigme } from '@/utils/dao/IndiceUtils';
import IndiceDetails from '@/components/participants/jouer/indiceDetails';

interface Indice {
  id_indice: string;
  contenu: string; // Contenu de l'indice
  degre_aide: number;
  id_enigme: string;
  ordre: number;
  type: string;
}

const IndiceList: React.FC<{ idEnigme: string }> = ({ idEnigme }) => {
  const [indices, setIndices] = useState<Indice[]>([]);
  const [currentIndiceIndex, setCurrentIndiceIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la liste des indices et réinitialiser l'indice actuel lorsque idEnigme change
  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const indices = await getAllIndicesByEnigme(idEnigme);
        // Trier les indices par ordre
        const sortedIndices = indices.sort((a, b) => a.ordre - b.ordre);
        console.log('Indices récupérés et triés:', sortedIndices);
        setIndices(sortedIndices);
        setCurrentIndiceIndex(0); // Réinitialiser à l'indice 0
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des indices :', error);
        setError('Impossible de charger les indices. Veuillez réessayer plus tard.');
      }
    };

    fetchIndices();
  }, [idEnigme]); // Déclencher cet effet lorsque idEnigme change

  // Passer à l'indice suivant
  const handleNextIndice = () => {
    if (currentIndiceIndex < indices.length - 1) {
      setCurrentIndiceIndex(currentIndiceIndex + 1);
    }
  };

  // Revenir à l'indice précédent
  const handlePreviousIndice = () => {
    if (currentIndiceIndex > 0) {
      setCurrentIndiceIndex(currentIndiceIndex - 1);
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (indices.length === 0) {
    return <p>Aucun indice disponible pour cette énigme.</p>;
  }

  const currentIndice = indices[currentIndiceIndex];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Indices disponibles</h1>

      {/* Afficher l'indice actuel */}
      <IndiceDetails indice={currentIndice} />

      {/* Boutons de navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousIndice}
          disabled={currentIndiceIndex === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
        >
          Indice précédent
        </button>
        <button
          onClick={handleNextIndice}
          disabled={currentIndiceIndex === indices.length - 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
        >
          Indice suivant
        </button>
      </div>

      {/* Message de fin de liste */}
      {currentIndiceIndex === indices.length - 1 && (
        <p className="mt-4 text-green-500">Vous avez atteint le dernier indice.</p>
      )}
    </div>
  );
};

export default IndiceList;