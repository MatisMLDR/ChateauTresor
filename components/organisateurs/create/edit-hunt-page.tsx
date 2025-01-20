import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CreateHuntForm } from '@/components/organisateurs/create/create-hunt-form';
import Chasse from '@/classes/Chasse';
import { ChasseType } from '@/types';
import Loader from '@/components/global/loader';
import { UUID } from 'crypto';
import { format, parseISO } from 'date-fns';
import { toast } from "react-hot-toast";

const EditHuntPage: React.FC = () => {
  const params = useParams();
  const [huntData, setHuntData] = useState<Partial<ChasseType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHuntData = async () => {
      try {
        console.log('Début du chargement des données de la chasse...');
  
        const chasse = await Chasse.readId(params.id as UUID);
        if (!chasse) {
          throw new Error('Chasse non trouvée');
        }
        console.log('Chasse récupérée:', chasse);
  
        await chasse.loadChateau();
        await chasse.loadEnigmes();
        await chasse.loadRecompenses();
  
        const formattedHuntData = {
          ...chasse,
          date_debut: chasse.getDateDebut() ? format(parseISO(chasse.getDateDebut()), 'yyyy-MM-dd') : '',
          date_fin: chasse.getDateFin() ? format(parseISO(chasse.getDateFin()), 'yyyy-MM-dd') : '',
          horaire_debut: chasse.getHoraireDebut() || '',
          horaire_fin: chasse.getHoraireFin() || '',
          image: chasse.getImage() || '',
          enigmes: chasse.enigmes || [],
          recompenses: chasse.recompenses || [],
        };
  
        setHuntData(formattedHuntData);
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de la chasse :', err);
        toast.error("Erreur lors du chargement des données de la chasse.");
        setIsLoading(false);
      }
    };
  
    if (params.id) {
      fetchHuntData();
    }
  }, [params.id]);

  if (isLoading) {
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