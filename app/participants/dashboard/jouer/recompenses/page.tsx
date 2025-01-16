// /app/participants/jouer/recompense/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { getAllRecompensesByChasse } from '@/utils/dao/RecompenseUtils';
import Recompense from '@/classes/Recompense';

const RecompensePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chasseId = searchParams.get('chasseId'); // Récupère l'ID de la chasse
  const [recompenses, setRecompenses] = useState<Recompense[]>([]); // État pour stocker les récompenses
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [error, setError] = useState<string | null>(null); // État pour gérer les erreurs
  const [selectedRecompense, setSelectedRecompense] = useState<Recompense | null>(null); // État pour la récompense sélectionnée

  const handleBack = () => {
    router.push('/participants/dashboard/chassesAchete'); // Rediriger vers la liste des chasses
  };

  // Fonction pour récupérer les récompenses
  const fetchRecompenses = async () => {
    try {
      if (!chasseId) {
        throw new Error('ID de chasse manquant');
      }

      const data = await getAllRecompensesByChasse(chasseId); // Récupérer les récompenses
      const recompenses = data.map((recompense: any) => new Recompense(recompense)); // Convertir en objets Recompense
      setRecompenses(recompenses);
    } catch (err) {
      setError('Erreur lors de la récupération des récompenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les récompenses au chargement de la page
  useEffect(() => {
    fetchRecompenses();
  }, [chasseId]);

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
        Vous avez terminé la chasse avec succès. <br />
        Choisissez votre récompense :
      </p>

      {/* Affichage des récompenses */}
      {loading ? (
        <p className="text-xl mb-8">Chargement des récompenses...</p>
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