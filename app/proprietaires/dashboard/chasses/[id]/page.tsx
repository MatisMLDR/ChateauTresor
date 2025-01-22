"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Chasse from '@/classes/Chasse';
import { ChasseType } from '@/types';
import Loader from '@/components/global/loader';
import { UUID } from 'crypto';
import { toast } from "react-hot-toast";
import { createClient } from '@/utils/supabase/server';
import { BasicDetails } from '@/components/organisateurs/create/steps/basic-details';
import { CastleSelection } from '@/components/organisateurs/create/steps/castle-selection';
import { RiddlesCreation } from '@/components/organisateurs/create/steps/riddles-creation';
import { ReviewSubmit } from '@/components/organisateurs/create/steps/review-submit';
import { Progress } from "@/components/ui/progress";
import RewardCreation from '@/components/organisateurs/create/steps/reward-creation';

const PageVisualisationChasse: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [donneesChasse, setDonneesChasse] = useState<ChasseType | null>(null);
  const [chargement, setChargement] = useState(true);
  const supabase = createClient();

  const etapes = [
    { titre: 'Détails de base', composant: BasicDetails },
    { titre: 'Sélection du château', composant: CastleSelection },
    { titre: 'Énigmes et indices', composant: RiddlesCreation },
    { titre: 'Récompenses', composant: RewardCreation },
    { titre: 'Aperçu final', composant: ReviewSubmit }
  ];

  useEffect(() => {
    const chargerDonneesChasse = async () => {
      try {
        const chasse = await Chasse.readId(params.id as UUID);
        if (!chasse) throw new Error('Chasse non trouvée');

        await chasse.loadChateau();
        await chasse.loadEnigmes();
        await chasse.loadRecompenses();

        setDonneesChasse(chasse as unknown as ChasseType);
        setChargement(false);
      } catch (err) {
        console.error('Erreur lors du chargement :', err);
        toast.error("Erreur lors du chargement des données.");
        setChargement(false);
      }
    };

    if (params.id) chargerDonneesChasse();
  }, [params.id]);

  const modifierStatut = async (nouveauStatut: 'Acceptée' | 'Refusée') => {
    try {
      const { error } = await supabase
        .from('chasse')
        .update({ statut: nouveauStatut })
        .eq('id_chasse', params.id);

      if (error) throw error;

      toast.success(`Chasse ${nouveauStatut.toLowerCase()} avec succès !`);
      router.push('/proprietaires/dashboard/demandes');
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      toast.error(`Erreur lors de la mise à jour : ${(error as Error).message}`);
    }
  };

  if (chargement) return <Loader />;

  if (!donneesChasse) return <div>Aucune donnée disponible</div>;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Détails de la chasse</h1>
        <div className="flex gap-4">
          <Button 
            onClick={() => modifierStatut('Refusée')}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-6 py-3"
          >
            Refuser la chasse
          </Button>
          <Button 
            onClick={() => modifierStatut('Acceptée')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3"
          >
            Accepter la chasse
          </Button>
        </div>
      </div>

      <Progress value={100} className="h-2 bg-muted" />

      <div className="space-y-8">
        {etapes.map(({ composant: Composant }, index) => (
          <div key={index} className="bg-card p-6 rounded-lg border shadow-sm">
            <Composant 
              formData={donneesChasse} 
              setFormData={() => {}} 
              onValidityChange={() => {}} 
              readOnly // Mode lecture seule
            />
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Statut actuel : <span className="font-semibold">{donneesChasse.statut}</span>
        </p>
      </div>
    </div>
  );
};

export default PageVisualisationChasse;