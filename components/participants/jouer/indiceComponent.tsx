'use client';

import React, { useState, useEffect } from 'react';
import { getAllIndicesByEnigme } from '@/utils/dao/IndiceUtils';
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
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Indice {
  id_indice: UUID;
  contenu: string;
  degre_aide: number;
  id_enigme: UUID;
  ordre: number;
  type: string;
}

// Définir l'interface pour les props
interface IndiceComponentProps {
  idEnigme: string; // ou UUID si vous utilisez un type spécifique
}

const IndiceComponent: React.FC<IndiceComponentProps> = ({ idEnigme }) => {
  const [indices, setIndices] = useState<Indice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [selectedIndice, setSelectedIndice] = useState<Indice | null>(null);
  const [discoveredIndices, setDiscoveredIndices] = useState<UUID[]>([]);

  // Récupérer les paramètres de l'URL
  const searchParams = useSearchParams();
  const chasseId = searchParams.get('chasseId');
  const enigmeId = searchParams.get('enigmeId');

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

        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des indices :', error);
        setError('Impossible de charger les indices. Veuillez réessayer plus tard.');
      }
    };

    fetchIndices();
  }, [idEnigme]);

  const handleIndiceClick = (indice: Indice) => {
    if (discoveredIndices.includes(indice.id_indice)) {
      // Si l'indice a déjà été découvert, rediriger directement vers la page de détails
      return; // La redirection est gérée par le composant Link
    } else {
      // Sinon, afficher la pop-up de confirmation
      setSelectedIndice(indice);
      setShowConfirmation(true);
    }
  };

  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed && selectedIndice) {
      // Soustraire le degre_aide de l'indice au score de l'utilisateur
      const pointsLost = selectedIndice.degre_aide;
      console.log(`Vous avez perdu ${pointsLost} points.`); // À remplacer par la logique de mise à jour du score

      // Ajouter l'indice à la liste des indices découverts
      setDiscoveredIndices((prev) => [...prev, selectedIndice.id_indice]);
    }
    setShowConfirmation(false);
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (indices.length === 0) {
    return <p className="text-center">Aucun indice disponible pour cette énigme.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Indices disponibles</h1>

      {/* Liste des indices */}
      <div className="space-y-4">
        {indices.map((indice, index) => (
          <div
            key={indice.id_indice}
            className="p-4 bg-gray-50 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition duration-300"
            onClick={() => handleIndiceClick(indice)}
          >
            {discoveredIndices.includes(indice.id_indice) ? (
              // Si l'indice est déjà révélé, utiliser Link pour la redirection
              <Link href={`/participants/dashboard/jouer/indice/${indice.id_indice}?chasseId=${chasseId}&enigmeId=${enigmeId}`}>
                <div className="p-4 bg-gray-50 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition duration-300">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Indice {index + 1} {discoveredIndices.includes(indice.id_indice) ? '(Déjà révélé)' : ''}
                  </h2>
                  {discoveredIndices.includes(indice.id_indice) && (
                    <p className="text-gray-600 mt-2">{indice.contenu}</p>
                  )}
                </div>
              </Link>
            ) : (
              // Sinon, afficher uniquement le titre de l'indice
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Indice {index + 1}
                </h2>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Popup de confirmation */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="rounded-xl bg-white shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-800">
              Attention !
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-gray-600">
              Révéler cet indice vous fera perdre {selectedIndice?.degre_aide} points.
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

export default IndiceComponent;