'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const ChateauDetailsPage: React.FC = () => {
  const params = useParams();
  const [chateau, setChateau] = useState<any | null>(null);

  // Fetch château details
  useEffect(() => {
    const fetchChateau = async () => {
      try {
        const response = await fetch(`/api/chateaux/${params.id}`);
        const data = await response.json();
        setChateau(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails du château :', err);
      }
    };

    fetchChateau();
  }, [params.id]);

  if (!chateau) {
    return <div>Chargement des informations du château...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{chateau.nom}</h1>
      <img
        src={chateau.image || '/default-chateau.jpg'}
        alt={chateau.nom}
        className="w-full max-h-80 object-cover rounded-lg shadow-md mb-4"
      />
      <p className="text-lg text-gray-700 mb-4">{chateau.description}</p>
      <div className="text-md font-medium text-gray-800">
        <p>Capacité : {chateau.capacite} personnes</p>
        <p>Prix de location : {chateau.prix_location} €</p>
        <p>Adresse : {chateau.adresse_postale}</p>
        <p>Téléphone : {chateau.telephone}</p>
        <p>
          Localisation : {chateau.localisation || 'Non spécifiée'}
        </p>
      </div>
    </div>
  );
};

export default ChateauDetailsPage;