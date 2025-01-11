import React, { useEffect, useState } from 'react';
import { CreateHuntForm } from '@/components/organisateurs/create/Create-hunt-form';
import { useRouter } from 'next/router';

const EditHuntPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // ID de la chasse
  const [initialData, setInitialData] = useState<Partial<ChasseType> | null>(null);

  useEffect(() => {
    const fetchHuntData = async () => {
      try {
        const response = await fetch(`/api/chasses/${id}`); // API pour récupérer une chasse par ID
        const data = await response.json();
        setInitialData(data);
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
      <CreateHuntForm initialData={initialData} />
    </div>
  );
};

export default EditHuntPage;
