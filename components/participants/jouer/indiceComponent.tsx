"use client";
import React, { useState, useEffect } from 'react';
import { getAllIndicesByEnigme } from '@/utils/dao/IndiceUtils';
import IndiceDetails from '@/components/participants/jouer/indiceDetails';
import { UUID } from 'crypto';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Indice {
  id_indice: UUID;
  contenu: string;
  degre_aide: number;
  id_enigme: string;
  ordre: number;
  type: string;
}

const IndiceList: React.FC<{ idEnigme: string }> = ({ idEnigme }) => {
  const [indices, setIndices] = useState<Indice[]>([]);
  const [currentIndiceIndex, setCurrentIndiceIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [nextIndiceIndex, setNextIndiceIndex] = useState<number | null>(null);
  const [discoveredIndices, setDiscoveredIndices] = useState<UUID[]>([]); // Pour suivre les indices déjà découverts

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const indices = await getAllIndicesByEnigme(idEnigme);
        const sortedIndices = indices.sort((a, b) => a.ordre - b.ordre);
        setIndices(sortedIndices);

        // Marquer le premier indice comme découvert
        if (sortedIndices.length > 0) {
          setDiscoveredIndices([sortedIndices[0].id_indice]);
        }

        setCurrentIndiceIndex(0);
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des indices :', error);
        setError('Impossible de charger les indices. Veuillez réessayer plus tard.');
      }
    };

    fetchIndices();
  }, [idEnigme]);

  const handleNextIndice = (index: number) => {
    const nextIndice = indices[index];

    // Si l'indice est le premier ou a déjà été découvert, passez directement à l'indice
    if (index === 0 || discoveredIndices.includes(nextIndice.id_indice)) {
      setCurrentIndiceIndex(index);
    } else {
      // Sinon, affichez la popup de confirmation
      setNextIndiceIndex(index);
      setShowConfirmation(true);
    }
  };

  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed && nextIndiceIndex !== null) {
      // Soustraire le degre_aide de l'indice actuel au score de l'utilisateur
      const pointsLost = indices[currentIndiceIndex].degre_aide;
      console.log(`Vous avez perdu ${pointsLost} points.`); // À remplacer par la logique de mise à jour du score

      // Ajouter l'indice à la liste des indices découverts
      setDiscoveredIndices((prev) => [...prev, indices[nextIndiceIndex].id_indice]);

      // Passer à l'indice suivant
      setCurrentIndiceIndex(nextIndiceIndex);
    }
    setShowConfirmation(false);
    setNextIndiceIndex(null);
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (indices.length === 0) {
    return <p className="text-center">Aucun indice disponible pour cette énigme.</p>;
  }

  const currentIndice = indices[currentIndiceIndex];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Indices disponibles</h1>

      {/* Carte de l'indice actuel */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
          <IndiceDetails indice={currentIndice} />
        </div>
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => handleNextIndice(currentIndiceIndex - 1)}
          disabled={currentIndiceIndex === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
        >
          Précédent
        </button>
        <button
          onClick={() => handleNextIndice(currentIndiceIndex + 1)}
          disabled={currentIndiceIndex === indices.length - 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
        >
          Suivant
        </button>
      </div>

      {/* Indicateur de progression */}
      <div className="mt-4 text-center">
        <span className="text-gray-600">
          Indice {currentIndiceIndex + 1} sur {indices.length}
        </span>
      </div>

      {/* Popup de confirmation */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="rounded-xl bg-white shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-800">
              Attention !
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-gray-600">
              Passer à l'indice suivant vous fera perdre {indices[currentIndiceIndex].degre_aide} points.
              Êtes-vous sûr de vouloir continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => handleConfirmation(false)}
              className="rounded-lg bg-gray-500 text-white px-6 py-3 shadow-lg hover:bg-gray-600 transition duration-300"
            >
              Non
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleConfirmation(true)}
              className="rounded-lg bg-red-500 text-white px-6 py-3 shadow-lg hover:bg-red-600 transition duration-300"
            >
              Oui, continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IndiceList;