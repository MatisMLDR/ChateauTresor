// /app/participants/jouer/recompense/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { getAllRecompensesByChasse, getRecompensesByChasseAndScore } from '@/utils/dao/RecompenseUtils';
import Loader from '@/components/global/loader';
import Recompense from '@/classes/Recompense';
import { UUID } from 'crypto';
import { Participant } from '@/classes/Participant';
import { getParticipationByParticipantIdAndChasseId } from '@/utils/dao/ParticipationUtils';
import { createClient } from '@/utils/supabase/client'; // Import des styles de bouton


const RecompensePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chasseId = searchParams.get('chasseId'); // Récupère l'ID de la chasse
  const [recompenses, setRecompenses] = useState<Recompense[]>([]); // État pour stocker les récompenses
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [error, setError] = useState<string | null>(null); // État pour gérer les erreurs
  const [selectedRecompense, setSelectedRecompense] = useState<Recompense | null>(null); // État pour la récompense sélectionnée

  const [userId, setUserId] = useState<string | null>(null); // État pour l'ID de l'utilisateur connecté
  const [participantId, setParticipantId] = useState<string | null>(null); // État pour l'ID du participant
  const [score, setScore] = useState<number | null>(null); // État pour stocker le score


  const handleBack = () => {
    router.push('/participants/dashboard/chassesAchete'); // Rediriger vers la liste des chasses
  };
  // Récupérer l'ID de l'utilisateur connecté
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
        setError('Utilisateur non connecté. Veuillez vous connecter.');
      }
    };

    fetchUser();
  }, []);

  // Récupérer l'ID du participant une fois que userId est défini
  useEffect(() => {
    const fetchParticipantId = async () => {
      if (userId) {
        try {
          const participant = await Participant.readByIdUser(userId as UUID);
          setParticipantId(participant.id_participant);
        } catch (error) {
          console.error('Erreur lors de la récupération du participant :', error);
          setError('Erreur lors de la récupération du participant. Veuillez réessayer.');
        }
      }
    };

    fetchParticipantId();
  }, [userId]);

  // Récupérer le score une fois que participantId et chasseId sont définis
  useEffect(() => {
    const fetchScore = async () => {
      if (participantId && chasseId) {
        try {
          const participation = await getParticipationByParticipantIdAndChasseId(
            participantId as UUID,
            chasseId as UUID
          );
          setScore(participation.score); // Mettre à jour l'état du score
        } catch (error) {
          console.error('Erreur lors de la récupération du score :', error);
          setError('Erreur lors de la récupération du score. Veuillez réessayer.');
        }
      }
    };

    fetchScore();
  }, [participantId, chasseId]);

  // Fonction pour récupérer les récompenses avec un score maximal
  const fetchRecompenses = async () => {
    try {
      if (!chasseId || !score) {
        throw new Error('ID de chasse ou score manquant');
      }

      // Récupérer les récompenses filtrées par score maximal
      const data = await getRecompensesByChasseAndScore(chasseId as UUID, score);
      const recompenses = data.map((recompense: any) => new Recompense(recompense)); // Convertir en objets Recompense
      setRecompenses(recompenses);
    } catch (err) {
      setError('Erreur lors de la récupération des récompenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les récompenses une fois que le score est disponible
  useEffect(() => {
    if (score !== null) {
      fetchRecompenses();
    }
  }, [score]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 relative overflow-hidden">
      {/* Confettis */}
      {[...Array(20)].map((_, index) => (
        <div
          key={index}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`, // Couleurs aléatoires
          }}
        ></div>
      ))}

      {/* Trophée animé */}
      <div className="relative mb-8 animate-bounce">
        <Trophy size={120} /> {/* Augmentation de la taille à 120px */}
      </div>

      {/* Titre et message de félicitations */}
      <h1 className="text-5xl font-bold mb-6 animate-pulse">Félicitations !</h1>
      <p className="text-xl mb-8 text-center">
        Vous avez terminé la chasse avec succès. Vous avez {score} points <br />
        Choisissez votre récompense :
      </p>

      {/* Affichage des récompenses */}
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-xl mb-8 text-red-500">{error}</p>
      ) : recompenses.length === 0 ? (
        <p className="text-xl mb-8">Aucune récompense disponible pour cette chasse.</p>
      ) : selectedRecompense ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-bold">{selectedRecompense.getNom()}</h2>
          <p className="text-xl text-center">{selectedRecompense.getDescription()}</p>
          <p className="text-xl font-semibold">Valeur : {selectedRecompense.getValeur()} points</p>
          <button
            onClick={() => setSelectedRecompense(null)} // Revenir à la liste des récompenses
            className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
          >
            Retour aux récompenses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recompenses.map((recompense) => (
            <button
              key={recompense.getIdRecompense()}
              onClick={() => setSelectedRecompense(recompense)} // Sélectionner la récompense
              className="bg-white text-blue-600 px-6 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 flex flex-col items-center"
            >
              <h2 className="text-xl font-bold">{recompense.getNom()}</h2>
              <p className="text-lg font-semibold mt-2">Valeur : {recompense.getValeur()} points</p>
            </button>
          ))}
        </div>
      )}

      {/* Bouton de retour */}
      <button
        onClick={handleBack}
        className="mt-8 bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
      >
        Retour aux chasses
      </button>

      {/* Styles CSS pour les confettis */}
      <style jsx>{`
          @keyframes confetti {
              0% {
                  transform: translateY(-10vh) rotate(0);
                  opacity: 1;
              }
              100% {
                  transform: translateY(100vh) rotate(360deg);
                  opacity: 0;
              }
          }

          .confetti {
              position: absolute;
              width: 10px;
              height: 10px;
              clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); // Forme de losange
              animation: confetti 3s ease-out infinite;
          }
      `}</style>
    </div>
  );
};

export default RecompensePage;