'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Euro, MapPin, Users } from 'lucide-react';
import Chateau from '@/classes/Chateau';
import { getAllChassesByChateau } from '@/utils/dao/ChasseUtils';
import { ChasseType } from '@/types';
import { usePathname } from 'next/navigation'; // Import du hook usePathname

interface CardChateauProps {
  chateau: Chateau;
}

const CardChateau = ({ chateau }: CardChateauProps) => {
  const pathname = usePathname();

  const url = pathname.split('/');
  let teamId = null;

  const participantType = url[1]
  if(participantType === 'organisateurs') {
    teamId = url[3]
  }

  return (
    <Card className="flex h-full flex-col transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="relative p-0">
        <div className="relative">
          <img
            src={chateau.getImage() || '/default-castle.webp'}
            alt={chateau.getNom()}
            className="h-48 w-full rounded-t-md object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-2 text-xl font-bold line-clamp-1">{chateau.getNom()}</CardTitle>
        <p className="mb-4 line-clamp-1 text-sm text-gray-600">
          {chateau.getDescription() || 'Pas de description disponible.'}
        </p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="line-clamp-1 text-sm text-gray-800">
              Localisation : {chateau.getAdressePostale()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-800">
              Capacité : {chateau.getCapacite()} personnes
            </span>
          </div>
          {
          participantType === 'organisateur' &&
            <div className="flex items-center space-x-2">
              <Euro className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-800">
                Prix de location : {chateau.getPrixLocation()} €
              </span>
            </div>
          }
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Link href={`/${participantType}/dashboard${teamId ? `/${teamId}` : ''}/chateaux/${chateau.getIdChateau()}`} className="w-full">
          <Button className="w-full">Voir plus</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardChateau;
