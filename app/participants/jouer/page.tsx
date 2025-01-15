// /app/participants/jouer/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnigmeType } from '@/types';
import IndiceComponent from '@/components/participants/jouer/indiceComponent';
import Chasse from '@/classes/Chasse';
import Link from 'next/link';

const GameInterface: React.FC = () => {
  const [enigmes, setEnigmes] = useState<EnigmeType[]>([]);
  const [currentEnigmeIndex, setCurrentEnigmeIndex] = useState(0);
  const [showIndices, setShowIndices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const chasseId = searchParams.get('chasseId'); // Récupère l'ID de la chasse
  const enigmeIdFromUrl = searchParams.get('enigmeId'); // Récupère l'ID de l'énigme depuis l'URL

  useEffect(() => {
    const fetchEnigmes = async () => {
      try {
        const chasseInstance = await Chasse.readId(chasseId);
        const enigmes = await chasseInstance.getAllEnigmes();
        const enigmesTriees = enigmes.sort((a, b) => a.ordre - b.ordre);
        setEnigmes(enigmesTriees);

        // Si un ID d'énigme est présent dans l'URL, on définit l'index de l'énigme actuelle
        if (enigmeIdFromUrl) {
          const index = enigmesTriees.findIndex((enigme) => enigme.id_enigme === enigmeIdFromUrl);
          if (index !== -1) {
            setCurrentEnigmeIndex(index);
          }
        }

        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des énigmes :', error);
        setError('Impossible de charger les énigmes. Veuillez réessayer plus tard.');
      }
    };

    if (chasseId) {
      fetchEnigmes();
    }
  }, [chasseId, enigmeIdFromUrl]);

  const handleBackAfterSuccess = () => {
    router.push('/participants/chassesAchete');
  };

  const handleBack = () => {
    router.push('/participants/chassesAchete');
  };

  // Mettre à jour l'URL avec l'ID de l'énigme actuelle
  useEffect(() => {
    if (enigmes.length > 0) {
      const currentEnigmeId = enigmes[currentEnigmeIndex].id_enigme;
      router.push(`/participants/jouer?chasseId=${chasseId}&enigmeId=${currentEnigmeId}`, { scroll: false });
    }
  }, [currentEnigmeIndex, enigmes, chasseId, router]);

  if (showSuccessPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-5xl font-bold mb-6 animate-bounce">Félicitations !</h1>
        <p className="text-xl mb-8">Vous avez résolu toutes les énigmes de cette chasse.</p>
        <button
          onClick={handleBackAfterSuccess}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Retour aux chasses achetées
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <button onClick={handleBack} className="mb-6 bg-white text-red-600 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
          Retour à la liste des chasses
        </button>
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (enigmes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <button onClick={handleBack} className="mb-6 bg-white text-blue-600 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
          Retour à la liste des chasses
        </button>
        <p className="text-xl">Chargement des énigmes...</p>
      </div>
    );
  }

  const currentEnigme = enigmes[currentEnigmeIndex];

  // Calcul de la progression
  const progress = ((currentEnigmeIndex + 1) / enigmes.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <button
          onClick={handleBack}
          className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300"
        >
          Retour à la liste des chasses
        </button>

        {/* Barre de progression */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Énigme {currentEnigmeIndex + 1} sur {enigmes.length}
            </span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">{currentEnigme.titre}</h1>
        <p className="text-lg text-gray-600 mb-8">{currentEnigme.description}</p>

        <div className="mb-8">
          <button
            onClick={() => setShowIndices(!showIndices)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300"
          >
            {showIndices ? 'Masquer les indices' : 'Afficher les indices'}
          </button>
        </div>

        {showIndices && (
          <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indices</h2>
            <IndiceComponent idEnigme={currentEnigme.id_enigme} />
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Valider le code</h2>
          <Link href={`/participants/jouer/scan?chasseId=${chasseId}&enigmeId=${currentEnigme.id_enigme}`}>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300">
              Valider le code
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;