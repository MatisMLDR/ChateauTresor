'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CreateHuntForm } from '@/components/organisateurs/create/create-hunt-form';
import Chasse from '@/classes/Chasse';
import { ChasseType } from '@/types';
import { UUID } from 'crypto';

const EditHuntPage: React.FC = () => {
  const params = useParams(); // Récupère les paramètres de l'URL
  const [huntData, setHuntData] = useState<Partial<ChasseType> | null>(null); // Stocke les données de la chasse

  // Charge les données de la chasse
  useEffect(() => {
    const fetchHuntData = async () => {
      try {
        const chasse = await Chasse.readId(params.id as UUID);
        if (chasse) {
          console.log("Données de la chasse récupérées :", chasse); // Log des données récupérées
          setHuntData(chasse);
        }
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
      <CreateHuntForm initialData={huntData} isEditMode={true} />
    </div>
  );
};

export default EditHuntPage;