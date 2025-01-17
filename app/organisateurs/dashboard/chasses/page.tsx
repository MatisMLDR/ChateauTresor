'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Chasse from '@/classes/Chasse';
import { UUID } from 'crypto';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { MembreEquipeClass } from '@/classes/MembreEquipe';
import EquipeOrganisatrice from '@/classes/EquipeOrganisatrice';

export default function OrganisateurChassesPage() {
  const [chasses, setChasses] = useState<Chasse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchChasses = async () => {
      // Récupérer l'utilisateur connecté
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        return;
      }

      try {
        // Étape 1 : Récupérer le membre d'équipe correspondant à l'utilisateur
        const membre = await MembreEquipeClass.readByIdUser(user.id as UUID);
        const id_membre = membre.getIdMembre();

        if (!membre) {
          console.error('Aucun membre trouvé pour cet utilisateur.');
          return;
        }

        const equipe = await EquipeOrganisatrice.getEquipeByMembreId(id_membre);

        if (!equipe) {
          console.error('Aucune équipe trouvée pour ce membre.');
          return;
        }

        // Étape 4 : Récupérer l'id_equipe
        const id_equipe = equipe.getIdEquipe();

        // Étape 5 : Récupérer les chasses de l'équipe
        const chassesEquipe = await Chasse.getChassesByEquipeId(id_equipe);

        // Étape 6 : Convertir les données en instances de la classe Chasse
        const chasses = await Promise.all(
          chassesEquipe.map(async (chasseData: any) => {
            const chasse = new Chasse(chasseData);
            await chasse.load(); // Charger les détails de la chasse
            return chasse;
          })
        );

        setChasses(chasses); // Mettre à jour l'état des chasses
      } catch (error) {
        console.error('Erreur lors de la récupération des chasses :', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChasses();
  }, [router, supabase]);

  if (isLoading) {
    return <div>Chargement des chasses...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Chasses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chasses.map((chasse) => (
          <Card key={chasse.getIdChasse()}>
            <CardHeader>
              <CardTitle>{chasse.getTitre()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-2">{chasse.getDescription()}</p>
              <p className="text-sm text-gray-500">Durée : {chasse.getDureeEstime()} minutes</p>
              <p className="text-sm text-gray-500">Prix : {chasse.getPrix()}€</p>
              <Link href={`/organisateurs/dashboard/chasses/${chasse.getIdChasse()}`}>
                <Button className="mt-4 w-full">Voir les détails</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}