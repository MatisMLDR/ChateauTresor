'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnigmeType } from '@/types';
import IndiceComponent from '@/components/participants/jouer/indiceComponent';
import Chasse from '@/classes/Chasse';
import Link from 'next/link';
import { ArrowLeftFromLine } from 'lucide-react'; // Import de l'icône
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'; // Import des composants AlertDialog
import { buttonVariants } from '@/components/ui/button'; // Import des styles de bouton

const GameInterface: React.FC = () => {
  const [enigmes, setEnigmes] = useState<EnigmeType[]>([]);
  const [currentEnigmeIndex, setCurrentEnigmeIndex] = useState(0);
  const [showIndices, setShowIndices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const chasseId = searchParams.get('chasseId');
  const enigmeIdFromUrl = searchParams.get('enigmeId');

  useEffect(() => {
    const fetchEnigmes = async () => {
      try {
        const chasseInstance = await Chasse.readId(chasseId);
        const enigmes = await chasseInstance.getAllEnigmes();
        const enigmesTriees = enigmes.sort((a, b) => a.ordre - b.ordre);
        setEnigmes(enigmesTriees);

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
    router.push('/participants/dashboard/chassesAchete');
  };

  const handleBack = () => {
    router.push('/participants/dashboard/chassesAchete');
  };

  if (showSuccessPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <h1 className="text-4xl font-bold mb-6 animate-bounce">Félicitations !</h1>
        <p className="text-lg mb-8 text-center">Vous avez résolu toutes les énigmes de cette chasse.</p>
        <button
          onClick={handleBackAfterSuccess}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Retour aux chasses achetées
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-500 to-pink-600 text-white p-4">
        <button onClick={handleBack} className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
          Retour à la liste des chasses
        </button>
        <p className="text-lg text-center">{error}</p>
      </div>
    );
  }

  if (enigmes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <button onClick={handleBack} className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
          Retour à la liste des chasses
        </button>
        <p className="text-lg">Chargement des énigmes...</p>
      </div>
    );
  }

  const currentEnigme = enigmes[currentEnigmeIndex];
  const progress = ((currentEnigmeIndex + 1) / enigmes.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6">
        {/* Bouton de retour avec AlertDialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="mb-6 text-black p-3 rounded-lg shadow-lg transition duration-300 flex items-center justify-center"
              title="Retour à la liste des chasses" // Info-bulle au survol
            >
              <ArrowLeftFromLine className="w-6 h-6" /> {/* Icône de retour */}
            </button>
          </AlertDialogTrigger>

          {/* Pop-up de confirmation */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold mb-4">
                Êtes-vous sûr de vouloir quitter ?
              </AlertDialogTitle>
              <AlertDialogDescription className="mb-6">
                Votre progression sera enregistrée, mais vous devrez revenir pour continuer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={buttonVariants({ variant: 'outline' })}>
                Non
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBack}
                className={buttonVariants({ variant: 'default' })}
              >
                Oui
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
              className="bg-black h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">{currentEnigme.titre}</h1>
        <p className="text-lg text-gray-600 mb-8">{currentEnigme.description}</p>

        <div className="mb-8">
          <button
            onClick={() => setShowIndices(!showIndices)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 w-full"
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
          <Link href={`/participants/dashboard/jouer/scan?chasseId=${chasseId}&enigmeId=${currentEnigme.id_enigme}`}>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 w-full">
              Valider le code
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;