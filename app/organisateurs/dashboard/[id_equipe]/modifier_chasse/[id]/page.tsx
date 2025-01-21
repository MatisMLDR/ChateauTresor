'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CreateHuntForm } from '@/components/organisateurs/create/create-hunt-form';
import Chasse from '@/classes/Chasse';
import { ChasseType } from '@/types';
import { UUID } from 'crypto';
import { toast } from 'react-hot-toast';
import Loader from '@/components/global/loader';
import Chateau from '@/classes/Chateau';

const EditHuntPage: React.FC = () => {
  const params = useParams();
  const [huntData, setHuntData] = useState<Partial<ChasseType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHuntData = async () => {
      try {
        console.log('Début du chargement des données de la chasse...');

        // Récupérer la chasse par son ID
        const chasse = await Chasse.readId(params.id as UUID);
        if (!chasse) {
          throw new Error('Chasse non trouvée');
        }

        // Charger les relations (château, énigmes, récompenses)
        await chasse.loadChateau();
        await chasse.loadEnigmes();
        await chasse.loadRecompenses();

        // Formater les données pour le formulaire
        const formattedHuntData = {
          id_chasse: chasse.getIdChasse(),
          titre: chasse.getTitre(),
          capacite: chasse.getCapacite(),
          description: chasse.getDescription(),
          age_requis: chasse.getAgeRequis(),
          image: chasse.getImage(),
          date_creation: chasse.getDateCreation(),
          date_modification: chasse.getDateModification(),
          date_debut: chasse.getDateDebut(),
          date_fin: chasse.getDateFin(),
          horaire_debut: chasse.getHoraireDebut(),
          horaire_fin: chasse.getHoraireFin(),
          prix: chasse.getPrix(),
          difficulte: chasse.getDifficulte(),
          duree_estime: chasse.getDureeEstime(),
          theme: chasse.getTheme(),
          statut: chasse.getStatut(),
          id_chateau: chasse.getIdChateau(),
          id_equipe: chasse.getIdEquipe(),
          chateau: chasse.getChateau(),
          enigmes: chasse.getEnigmes() || [], // Assurez-vous que les énigmes sont bien incluses
          recompenses: chasse.getRecompenses() || [], // Assurez-vous que les récompenses sont bien incluses
        };

        setHuntData(formattedHuntData as ChasseType);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de la chasse :', err);
        toast.error('Erreur lors du chargement des données de la chasse.');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchHuntData();
    }
  }, [params.id]);

  if (!huntData) {
    return <Loader />;
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