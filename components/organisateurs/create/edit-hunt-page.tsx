import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChasseType } from '@/types';
import dynamic from 'next/dynamic';
import Chasse from '@/classes/Chasse';
import { UUID } from 'crypto';

// Import dynamique avec SSR désactivé
const CreateHuntForm = dynamic(
  () => import('@/components/organisateurs/create/create-hunt-form').then((mod) => mod.CreateHuntForm), // Accéder à l'export nommé
  { ssr: false }
);

const EditHuntPage: React.FC = () => {
  const params = useParams();
  const id = params.id as UUID; // ID de la chasse
  const [initialData, setInitialData] = useState<Partial<ChasseType> | null>(null);

  useEffect(() => {
    const fetchHuntData = async () => {
      try {
        const chasse = await Chasse.readId(id);
        if (chasse) {
          console.log("Données de la chasse récupérées :", chasse); // Log des données récupérées
          setInitialData(chasse);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données de la chasse :', err);
      }
    };
  
    if (id) {
      fetchHuntData();
    }
  }, [id]);

  if (!initialData) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Modifier la chasse</h1>
      <CreateHuntForm initialData={initialData} isEditMode={true} />
    </div>
  );
};

export default EditHuntPage;