'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getIndiceById } from '@/utils/dao/IndiceUtils';
import Loader from '@/components/global/loader';
import { UUID } from 'crypto';

interface Indice {
  id_indice: UUID;
  contenu: string;
  degre_aide: number;
  id_enigme: UUID;
  ordre: number;
  type: string;
}

export default function IndicePage() {
  const [indice, setIndice] = useState<Indice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<boolean>(false);

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id_indice = params.id as UUID;
  const chasseId = searchParams.get('chasseId');
  const enigmeId = searchParams.get('enigmeId');

  useEffect(() => {
    const fetchIndice = async () => {
      try {
        const indice = await getIndiceById(id_indice);
        setIndice(indice);
        setError(null);

        // Vérifier si l'indice a déjà été révélé
        const discoveredIndices = JSON.parse(localStorage.getItem('discoveredIndices') || '[]');
        if (discoveredIndices.includes(id_indice)) {
          setDiscovered(true);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'indice :', error);
        setError('Impossible de charger l\'indice. Veuillez réessayer plus tard.');
      }
    };

    if (id_indice) {
      fetchIndice();
    }
  }, [id_indice]);

  const handleBackToEnigme = () => {
    router.push(`/participants/dashboard/jouer?chasseId=${chasseId}&enigmeId=${enigmeId}`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-500 to-pink-600 text-white p-4">
        <p className="text-lg text-center">{error}</p>
      </div>
    );
  }

  if (!indice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <button
        onClick={handleBackToEnigme}
        className="rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-3 text-white shadow-lg transition duration-300 hover:from-gray-600 hover:to-gray-700 w-full mt-4"
      >
        Revenir à l&apos;énigme
      </button>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Détails de l&apos;indice {indice.ordre}</h1>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Contenu de l&asos;indice :</h2>
          <p className="text-gray-600 mt-2">{indice.contenu}</p>
        </div>
      </div>
    </div>
  );
}