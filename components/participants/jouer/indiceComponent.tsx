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
import { useSearchParams } from 'next/navigation'; // Importez useSearchParams


interface Indice {
  id_indice: UUID;
  contenu: string;
  degre_aide: number;
  id_enigme: UUID;
  ordre: number;
  type: string;
}

import { IndiceParticipant } from '@/classes/IndiceParticipant'; // Importez la méthode markAsDiscovered
import { Participant } from '@/classes/Participant'; // Importez la méthode readByIdUser
import { createClient } from '@/utils/supabase/client';
import { getParticipationByParticipantIdAndChasseId, updateParticipationScore } from '@/utils/dao/ParticipationUtils';


const IndiceList: React.FC<{ idEnigme: UUID, participantId: UUID}> = ({ idEnigme, participantId }) => {
  const [indices, setIndices] = useState<Indice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [selectedIndice, setSelectedIndice] = useState<Indice | null>(null);
  const [discoveredIndices, setDiscoveredIndices] = useState<UUID[]>([]);
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [userId, setUserId] = useState<string | null>(null);


  // Récupérez les paramètres de recherche de l'URL
  const searchParams = useSearchParams();
  const chasseId = searchParams.get('chasseId');
  const enigmeId = searchParams.get('enigmeId');


  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id); // Récupérer l'ID de l'utilisateur connecté
      } else {
        console.error('Utilisateur non connecté');
      }
    };

    fetchUser();
  }, []);



  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const indices = await getAllIndicesByEnigme(idEnigme as UUID);
        const sortedIndices = indices.sort(
          (a: { ordre: number }, b: { ordre: number }) => a.ordre - b.ordre
        );
        setIndices(sortedIndices);

        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des indices :', error);
        setError('Impossible de charger les indices. Veuillez réessayer plus tard.');
      }
    };

    fetchIndices();
  }, [idEnigme]);


// CA MARCHE MAIS ERREUR SI L'INDIE N'EST PAS DEJA DECOUVERT
  // Vérifier tous les indices au chargement du composant
  useEffect(() => {
    const checkAllIndices = async () => {
      const discoveredIds: UUID[] = [];
      const participant = await Participant.readByIdUser(userId as UUID);
      const participantId = participant.id_participant;

      for (const indice of indices) {
        try {
          // Vérifier si l'indice est déjà renseigné pour ce participant
          const isDiscovered = await IndiceParticipant.checkIfIndiceExists(
            participantId,
            indice.id_indice
          );

          if (isDiscovered) {
            discoveredIds.push(indice.id_indice); // Ajouter l'ID de l'indice révélé
          }
        } catch (error) {
          console.error(
            `Erreur lors de la vérification de l'indice ${indice.id_indice}:`,
            error
          );
        }
      }

      setDiscoveredIndices(discoveredIds); // Mettre à jour l'état des indices révélés
      setLoading(false); // Fin du chargement

    };

    checkAllIndices();
  }, [indices, participantId]); // Déclencher cette vérification lorsque indices ou participant change

  // Fonction pour gérer le clic sur un indice
  const handleIndiceClick = async (indice: Indice) => {
    setSelectedIndice(indice);
    const participant = await Participant.readByIdUser(userId as UUID);

    // Vérifier si l'indice est déjà révélé
    const isDiscovered = await IndiceParticipant.checkIfIndiceExists(
      participant.id_participant,
      indice.id_indice
    );

    if (isDiscovered) {
      // Si l'indice est déjà révélé, mettre à jour l'état discoveredIndices
      setDiscoveredIndices((prev) => [...prev, indice.id_indice]);
      setShowConfirmation(false);
      return;
    }

    // Si l'indice n'est pas révélé, afficher la confirmation
    setShowConfirmation(true);
  };


  const handleConfirmation = async (confirmed: boolean) => {
    if (!confirmed || !selectedIndice || !userId) {
      setShowConfirmation(false);
      return;
    }

    try {
      // Récupérer l'ID du participant associé à l'utilisateur
      const participant = await Participant.readByIdUser(userId as UUID);

      // Vérifier que le participant est bien défini
      if (!participant || !participant.id_participant) {
        throw new Error('Participant non trouvé ou ID invalide.');
      }

      const participantId = participant.id_participant;


      // Vérifier si l'indice est déjà révélé
      const isDiscovered = await IndiceParticipant.checkIfIndiceExists(
        participantId,
        selectedIndice.id_indice
      );

      if (isDiscovered) {
        // Si l'indice est déjà révélé, ne rien faire
        setShowConfirmation(false);
        setDiscoveredIndices((prev) => [...prev, selectedIndice.id_indice]);
        return;
      }



      // Créer une instance de IndiceParticipant
      const indiceParticipant = new IndiceParticipant({
        id_indice: selectedIndice.id_indice,
        id_participant: participantId,
      });

      // Marquer l'indice comme découvert
      await indiceParticipant.markAsDiscovered();

      // Soustraire le degre_aide de l'indice au score de l'utilisateur
      const participation = await getParticipationByParticipantIdAndChasseId(participantId, chasseId as UUID);
      const pointsLost = selectedIndice.degre_aide;
      const participationScore = (participation.score ?? 0) as number;
      const score = (participationScore + pointsLost) as number;

      console.log(`Vous avez perdu ${participationScore} points.`); // À remplacer par la logique de mise à jour du score
      console.log(`Votre nouveau score est de ${score} points.`); // À remplacer par la logique de mise à jour du score
      await updateParticipationScore(participantId, chasseId as UUID, score);

      // Ajouter l'indice à la liste des indices découverts
      setDiscoveredIndices((prev) => [...prev, selectedIndice.id_indice]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'indice :', error);

      // Afficher un message d'erreur approprié à l'utilisateur
      if (error instanceof Error) {
        setError(error.message || 'Une erreur est survenue lors de la révélation de l\'indice.');
      } else {
        setError('Une erreur inattendue est survenue.');
      }
    } finally {
      setShowConfirmation(false);
    }
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (indices.length === 0) {
    return <p className="text-center">Aucun indice disponible pour cette énigme.</p>;
  }
  console.log('log pour afficher id_enigme : ', enigmeId);
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

export default IndiceList;