'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import du composant Button personnalisé

interface ChasseCardProps {
  chasse: any;
  isAchetee: boolean;
  onJouer: () => void;
}

const ChasseCard: React.FC<ChasseCardProps> = ({ chasse, isAchetee, onJouer }) => {
  const pathname = usePathname();
  const urlParts = pathname.split('/');
  const participantType = urlParts[1];
  let teamId = null;

  if (participantType === 'organisateurs' && urlParts.length > 3) {
    teamId = urlParts[3];
  }

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Facile';
      case 2: return 'Moyen';
      case 3: return 'Difficile';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-red-500';
    }
  };

  const getChasseLink = () => {
    return `/${participantType}/dashboard${teamId ? `/${teamId}` : ''}/chasses/${chasse.id}`;
  };

  return (
    <div className="border rounded-md p-4 shadow-md">
      <div className="relative">
        <img
          src={chasse.image || '/default-chasse.webp'}
          alt={chasse.titre}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <Badge className={`${getDifficultyColor(chasse.difficulte)} absolute top-2 right-2 text-white`}>
          {getDifficultyText(chasse.difficulte)}
        </Badge>
      </div>
      
      <h3 className="font-bold text-lg mb-2">{chasse.titre}</h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{chasse.description}</p>
      <p className="text-gray-800 font-medium">Prix : {chasse.prix} €</p>

      <div className="mt-4 space-y-2">
        <Link href={getChasseLink()} passHref legacyBehavior>
          <Button 
            onClick={onJouer}
            className="w-full"
          >
            Jouer
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ChasseCard;