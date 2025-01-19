'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CreateHuntForm } from '@/components/organisateurs/create/create-hunt-form';
import Chasse from '@/classes/Chasse';
import { ChasseType } from '@/types';
import { UUID } from 'crypto';
import Chateau from '@/classes/Chateau';

const EditHuntPage: React.FC = () => {
  const params = useParams();
  const [huntData, setHuntData] = useState<Partial<ChasseType> | null>(null);

  useEffect(() => {
    const fetchHuntData = async () => {
      try {
        console.log('Début du chargement des données de la chasse...');

        // 1. Récupérer la chasse par son ID
        console.log('Récupération de la chasse par ID...');
        const chasse = await Chasse.readId(params.id as UUID);
        if (!chasse) {
          throw new Error('Chasse non trouvée');
        }
        console.log('Chasse récupérée:', chasse);

        // 2. Charger les relations
        console.log('Chargement du château associé...');
        await chasse.loadChateau();
        console.log('Château chargé:', chasse.chateau);

        console.log('Chargement des énigmes...');
        await chasse.loadEnigmes();
        console.log('Énigmes chargées:', chasse.enigmes);

        // Log des indices pour chaque énigme
        if (chasse.enigmes) {
          console.log('Vérification des indices pour chaque énigme...');
          for (const enigme of chasse.enigmes) {
            console.log(`Énigme ${enigme.id_enigme} - Titre: ${enigme.titre}`);
            console.log('Indices associés:', enigme.indices);
          }
        }

        console.log('Chargement des récompenses...');
        await chasse.loadRecompenses();
        console.log('Récompenses chargées:', chasse.recompenses);

        // 3. Mettre à jour l'état avec les données complètes
        console.log('Mise à jour de l\'état avec les données complètes...');
        setHuntData({
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
          prix: chasse.getPrix(),
          difficulte: chasse.getDifficulte(),
          duree_estime: chasse.getDureeEstime(),
          theme: chasse.getTheme(),
          statut: chasse.getStatut(),
          id_chateau: chasse.getIdChateau(),
          id_equipe: chasse.getIdEquipe(),
          chateau: chasse.chateau,
          enigmes: chasse.enigmes,
          recompenses: chasse.recompenses,
        });

        console.log('Données de la chasse mises à jour:', huntData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de la chasse :', err);
      }
    };

    if (params.id) {
      fetchHuntData();
    }
  }, [params.id]);

  if (!huntData) {
    return <div>Chargement des données de la chasse...</div>;
  }

  // Log des données finales avant affichage
  console.log('Données finales de la chasse:', huntData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Modifier la chasse</h1>
      <CreateHuntForm initialData={huntData} isEditMode={true} />
    </div>
  );
};

export default EditHuntPage;