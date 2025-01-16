'use client';

import { convertTimeToMinutesAndHours } from '@/lib/utils';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Euro, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/RatingStars';
import Chasse from '@/classes/Chasse';

interface CardChasseProps {
  chasse: Chasse;
}

const CardChasse = ({ chasse }: CardChasseProps) => {
  const [nbAvis, setNbAvis] = useState<number>(0);
  const [note, setNote] = useState<number>(0);

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

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return 'Facile';
      case 2:
        return 'Moyen';
      case 3:
        return 'Difficile';
      default:
        return 'Inconnu';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return 'bg-green-500 hover:bg-green-700 text-secondary';
      case 2:
        return 'bg-orange-500 hover:bg-orange-700 text-secondary';
      case 3:
        return 'bg-red-500 hover:bg-red-700 text-secondary';
      default:
        return 'bg-gray-500 hover:bg-gray-700 text-secondary';
    }
  };

  const formattedNote = note.toFixed(1);

  return (
    <Card className="transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="relative p-0">
        <div className="relative">
          <img
            src={chasse.getImage() || '/default-chasse.jpg'}
            alt={chasse.getTitre()}
            className="h-48 w-full rounded-t-md object-cover"
          />
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
        <div className="mb-4 flex items-center space-x-2">
          <RatingStars value={note} maxStars={5} />
          <span className="text-sm text-gray-600">
            {formattedNote} ({nbAvis} avis)
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-800">
              Durée : {convertTimeToMinutesAndHours(chasse.getDureeEstime()).minutesFormatted}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-800">
              Capacité : {chasse.getCapacite()} personnes
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Euro className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-800">Prix : {chasse.getPrix()} €</span>
          </div>
          {chasse.getIdChateau() && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-800">{chasse.getIdChateau()}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Link href={`/participants/chasses/${chasse.getIdChasse()}`} className="w-full">
          <Button className="w-full">Voir plus</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardChasse;
