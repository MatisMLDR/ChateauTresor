'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CreateHuntForm } from '@/components/organisateurs/create/Create-hunt-form';

const EditHuntPage: React.FC = () => {
  const params = useParams(); // Récupère les paramètres de l'URL
  const [huntData, setHuntData] = useState<any | null>(null); // Stocke les données de la chasse

  // Charge les données de la chasse
  useEffect(() => {
    const fetchHuntData = async () => {
      try {
        const response = await fetch(`/api/chasses/${params.id}`); // API pour récupérer une chasse spécifique
        const data = await response.json();
        setHuntData(data); // Met à jour l'état avec les données récupérées
      } catch (err) {
        console.error('Erreur lors de la récupération des données de la chasse :', err);
      }
    };

    if (params.id) {
      fetchHuntData();
    }
  }, [params.id]);

  // Affiche un message de chargement tant que les données ne sont pas disponibles
  if (!huntData) {
    return <div>Chargement des données de la chasse...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Modifier la chasse</h1>
      {/* Formulaire de modification, prérempli avec les données existantes */}
      <CreateHuntForm initialData={huntData} />
    </div>
  );
};

export default EditHuntPage;
