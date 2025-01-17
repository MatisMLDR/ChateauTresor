import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CreateHuntForm } from '@/components/organisateurs/create/create-hunt-form';
import Chasse from '@/classes/Chasse';
import { ChasseType } from '@/types';
import { UUID } from 'crypto';
import { format, parseISO } from 'date-fns'; // Import de date-fns pour le formatage des dates

const EditHuntPage: React.FC = () => {
  const params = useParams();
  const [huntData, setHuntData] = useState<Partial<ChasseType> | null>(null);
  const [isLoading, setIsLoading] = useState(true); // État de chargement

  useEffect(() => {
    const fetchHuntData = async () => {
      try {
        console.log('Début du chargement des données de la chasse...');

        // 1. Récupérer la chasse par son ID
        const chasse = await Chasse.readId(params.id as UUID);
        if (!chasse) {
          throw new Error('Chasse non trouvée');
        }
        console.log('Chasse récupérée:', chasse);

        // 2. Charger les relations
        await chasse.loadChateau();
        await chasse.loadEnigmes();
        await chasse.loadRecompenses();

        // 3. Formater les dates pour le formulaire
        const formattedHuntData = {
          ...chasse,
          date_debut: chasse.getDateDebut() ? format(parseISO(chasse.getDateDebut()), 'yyyy-MM-dd') : '',
          date_fin: chasse.getDateFin() ? format(parseISO(chasse.getDateFin()), 'yyyy-MM-dd') : '',
          image: chasse.getImage() || '', // Assurez-vous que l'image est bien récupérée
        };

        // 4. Mettre à jour l'état avec les données formatées
        setHuntData(formattedHuntData);
        setIsLoading(false); // Fin du chargement
      } catch (err) {
        console.error('Erreur lors de la récupération des données de la chasse :', err);
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchHuntData();
    }
  }, [params.id]);

  if (isLoading) {
    return <div>Chargement des données de la chasse...</div>;
  }

  if (!huntData) {
    return <div>Données de la chasse non disponibles.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Modifier la chasse</h1>
      <CreateHuntForm initialData={huntData} isEditMode={true} />
    </div>
  );
};

export default EditHuntPage;