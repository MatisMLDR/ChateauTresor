'use client';

import React, { useEffect, useState } from 'react';
import { Chasse } from '@/types';

const ChasseDetailsPage = ({ params }: { params: { id: string } }) => {
  const [chasse, setChasse] = useState<Chasse | null>(null);

  useEffect(() => {
    const fetchChasse = async () => {
      try {
        const response = await fetch(`/api/chasses/${params.id}`);
        const data = await response.json();
        setChasse(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de la chasse :', err);
      }
    };

    fetchChasse();
  }, [params.id]);

  if (!chasse) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{chasse.titre}</h1>
      <img
        src={chasse.image}
        alt={chasse.titre}
        className="w-full max-h-80 object-cover rounded-md shadow-lg mb-4"
      />
      <p className="text-gray-600 text-sm mb-4">{chasse.description}</p>
      <p className="font-medium">Difficulté : {chasse.difficulte} / 3</p>
      <p className="font-medium">Prix : {chasse.prix} €</p>
      <p className="text-gray-600 text-sm">
        Date : {new Date(chasse.date_debut).toLocaleDateString()} -{' '}
        {new Date(chasse.date_fin).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ChasseDetailsPage;