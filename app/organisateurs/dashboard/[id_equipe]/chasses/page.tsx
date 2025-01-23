'use client';

import { useEffect, useState } from 'react';
import Chasse from '@/classes/Chasse';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import CardChasse from '@/components/global/CardChasse';
import Loader from '@/components/global/loader';

export default function OrganisateurChassesPage() {
  const [chasses, setChasses] = useState<Chasse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id_equipe } = useParams<{ id_equipe: UUID }>();

  useEffect(() => {
    const fetchChasses = async () => {
      try {
        const chassesEquipe = await Chasse.getChassesByEquipeId(id_equipe);

        const chassesAvecDetails = await Promise.all(
          chassesEquipe.map(async (chasseData: any) => {
            const chasse = new Chasse(chasseData);
            await chasse.load();
            return chasse;
          })
        );

        // Filtrer les chasses selon les statuts souhaités
        const chassesFiltrees = chassesAvecDetails.filter(chasse => 
          ["Validée", "En attente de validation", "Refusée"].includes(chasse.getStatut())
        );

        setChasses(chassesFiltrees);
      } catch (error) {
        console.error('Erreur lors de la récupération des chasses :', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChasses();
  }, [id_equipe]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Chasses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chasses.map((chasse) => (
          <CardChasse key={chasse.getIdChasse()} chasse={chasse} />
        ))}
      </div>
    </div>
  );
}