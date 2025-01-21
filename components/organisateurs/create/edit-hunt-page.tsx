import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CreateHuntForm } from '@/components/organisateurs/create/create-hunt-form';
import Chasse from '@/classes/Chasse';
import { ChasseType, FileType } from '@/types';
import Loader from '@/components/global/loader';
import { UUID } from 'crypto';
import { toast } from "react-hot-toast";

const EditHuntPage: React.FC = () => {
  const params = useParams();
  const [huntData, setHuntData] = useState<Partial<ChasseType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHuntData = async () => {
      try {
        const chasse = await Chasse.readId(params.id as UUID);
        if (!chasse) {
          throw new Error('Chasse non trouvée');
        }

        await chasse.loadChateau();
        await chasse.loadEnigmes();
        await chasse.loadRecompenses();

        // Extraction des dates au format YYYY-MM-DD
        const formatDate = (dateString: string | null): string => {
          if (!dateString) return '';
          return dateString.split('T')[0]; // Extrait la partie YYYY-MM-DD
        };

        // Conversion correcte pour les dates et heures
        const formattedHuntData = {
          ...chasse,
          date_debut: formatDate(chasse.getDateDebut() as string), // Format YYYY-MM-DD
          date_fin: formatDate(chasse.getDateFin() as string), // Format YYYY-MM-DD
          horaire_debut: chasse.getHoraireDebut()?.substring(0, 5) || '', // Garde seulement HH:mm
          horaire_fin: chasse.getHoraireFin()?.substring(0, 5) || '',
          image: chasse.getImage() || '',
          enigmes: chasse.getEnigmes()?.map(enigme => ({
            ...enigme,
            // Conversion secondes -> HH:mm pour l'affichage
            temps_max: enigme.temps_max ? Math.floor(enigme.temps_max / 3600) * 3600 + Math.floor((enigme.temps_max % 3600) / 60) * 60 : 0
          })) || [],
          recompenses: chasse.getRecompenses() || [],
          chateau: {
            ...chasse.getChateau(),
            // Conversion UUID si nécessaire
            id_chateau: chasse.getChateau()?.getIdChateau() as UUID,
            image: chasse.getChateau()?.getImage() || { /* default FileType object */ } as FileType
          }
        };

        setHuntData(formattedHuntData);
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des données :', err);
        toast.error("Erreur lors du chargement des données.");
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
    return <div>Données non disponibles.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Modifier la chasse</h1>
      <CreateHuntForm 
        initialData={huntData} 
        isEditMode={true}
        chateauInitial={huntData.chateau} // Ajout crucial pour la présélection
      />
    </div>
  );
};

export default EditHuntPage;