'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Loader from '@/components/global/loader';
import Link from 'next/link';

const ChasseDetailsPage: React.FC = () => {
  const params = useParams(); // Utilisez useParams pour récupérer les paramètres
  const [chasse, setChasse] = useState<any | null>(null);

  useEffect(() => {
    const fetchChasse = async () => {
      try {
        const response = await fetch(`/api/chasses/${params.id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la chasse');
        }
        const data = await response.json();
        setChasse(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de la chasse :', err);
      }
    };

    fetchChasse();
  }, [params.id]);

  if (!chasse) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{chasse.titre}</h1>
      <img
        src={chasse.image}
        alt={chasse.titre}
        className="w-full max-h-80 object-cover rounded-lg shadow-md mb-4"
      />
      <p className="text-lg text-gray-700 mb-4">{chasse.description}</p>
      <div className="text-md font-medium text-gray-800">
        <p>Difficulté : {chasse.difficulte} / 3</p>
        <p>Prix : {chasse.prix} €</p>
        <p>
          Date : {new Date(chasse.date_debut).toLocaleDateString()} -{' '}
          {new Date(chasse.date_fin).toLocaleDateString()}
        </p>
        <Button className='text-gray-50'>
          <Link href={`/participants/dashboard/chasses/${params.id}/inscription`}>
            Réserver
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ChasseDetailsPage;