'use client';

import { convertTimeToMinutesAndHours } from '@/lib/utils';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Castle, Clock, Euro, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/RatingStars';
import Chasse from '@/classes/Chasse';
import { usePathname } from 'next/navigation';
import Chateau from '@/classes/Chateau';
import { UUID } from 'crypto';

interface CardChasseProps {
  chasse: Chasse;
  className?: string;
}

const CardChasse = ({ chasse, className }: CardChasseProps) => {
  const [nbAvis, setNbAvis] = useState<number>(0);
  const [note, setNote] = useState<number>(0);
  const [chateau, setChateau] = useState<Chateau | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchNbAvis = async () => {
      try {
        const nbAvis = await chasse.getNbAvis();
        setNbAvis(nbAvis);
      } catch (err) {
        console.error("Erreur lors de la récupération du nombre d'avis :", err);
      }
    };
    const fetchNote = async () => {
      try {
        const noteMoyenne = await chasse.getNoteMoyenne();
        setNote(noteMoyenne);
      } catch (err) {
        console.error('Erreur lors de la récupération de la note :', err);
      }
    };
    fetchNbAvis();
    fetchNote();
  }, [chasse]);

  useEffect(() => {
    const fetchChateau = async () => {
      try {
        const chateau = await Chateau.readId(chasse.getIdChateau() as UUID);
        setChateau(chateau);
      } catch (err) {
        console.error('Erreur lors de la récupération du château :', err);
      }
    };
    fetchChateau();
  }, []);

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Facile';
      case 2: return 'Moyen';
      case 3: return 'Difficile';
      default: return 'Inconnu';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-500 hover:bg-green-700 text-secondary';
      case 2: return 'bg-orange-500 hover:bg-orange-700 text-secondary';
      case 3: return 'bg-red-500 hover:bg-red-700 text-secondary';
      default: return 'bg-gray-500 hover:bg-gray-700 text-secondary';
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut.toLowerCase()) {
      case 'validée': return 'bg-green-500 text-white';
      case 'en attente de validation': return 'bg-orange-500 text-white';
      case 'refusée': return 'bg-red-500 text-white';
    }
  };

  const formattedNote = note.toFixed(1);
  const url = pathname.split('/');
  const participantType = url[1];
  let teamId = null;

  if (participantType === 'organisateurs') {
    teamId = url[3];
  }

  const getChasseLink = () => {
    return `/${participantType}/dashboard${teamId ? `/${teamId}` : ''}/chasses/${chasse.getIdChasse()}`;
  };

  const chasseimage = String(chasse.getImage());

  return (
    <Card className={`transition-shadow duration-200 hover:shadow-lg ${className}`}>
      <CardHeader className="relative p-0 aspect-video overflow-hidden">
        <div className="relative h-full w-full">
          <img src={chasseimage} alt="Chasse Image" className="h-full w-full object-cover" />
          <Badge
            className={`${getDifficultyColor(chasse.getDifficulte())} absolute right-2 top-2 cursor-default select-none px-2 py-1 text-xs font-bold`}
          >
            {getDifficultyText(chasse.getDifficulte())}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 truncate text-xl font-bold">{chasse.getTitre()}</CardTitle>
        <p
          className="mb-4 text-sm text-gray-600"
          style={{
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
            overflow: 'hidden',
          }}
        >
          {chasse.getDescription()}
        </p>
        <div className="mb-4 flex flex-wrap items-center space-x-2">
          <RatingStars value={note} maxStars={5} />
          <span className="text-sm text-gray-600">
            {formattedNote} ({nbAvis} avis)
          </span>
        </div>
        <div className="space-y-2">
          {participantType === 'organisateurs' && (
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(chasse.getStatut())} px-2 py-1 text-xs font-medium`}>
                {chasse.getStatut()}
              </Badge>
            </div>
          )}
          {chasse.getIdChateau() && (
            <div className="flex items-center space-x-2">
              <Castle className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-800 line-clamp-1">{chateau?.getNom()}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-800 line-clamp-1">
              Durée : {convertTimeToMinutesAndHours(chasse.getDureeEstime()).minutesFormatted}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-800 line-clamp-1">
              Capacité : {chasse.getCapacite()} personnes
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Euro className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-800 line-clamp-1">Prix : {chasse.getPrix()} €</span>
          </div>
          {chasse.getIdChateau() && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-800 line-clamp-1">{chateau?.getAdressePostale()}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4">
        <Link href={getChasseLink()} className="w-full">
          <Button className="w-full">Voir plus</Button>
        </Link>
        {participantType === 'participants' && (
          <Link href={getChasseLink() + "/classements"} className="w-full lg:ml-2">
            <Button className="w-full bg-gold text-gray-900 hover:bg-orange-200">Classement</Button>
          </Link>
        )}
        {participantType === 'proprietaire' && (
          <>
            <Button className="w-full" variant={'outline'}>
              Valider
            </Button>
            <Button className="w-full" variant={'destructive'}>
              Refuser
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CardChasse;