'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Euro, MapPin, Users } from 'lucide-react';
import Chateau from '@/classes/Chateau';
import Chasse from '@/classes/Chasse';
import { getAllChassesByChateau } from '@/utils/dao/ChasseUtils';
import { ChasseType } from '@/types';
import { usePathname } from 'next/navigation'; // Import du hook usePathname

interface CardChateauProps {
  chateau: Chateau;
}

const CardChateau = ({ chateau }: CardChateauProps) => {
  const [chasses, setChasses] = useState<Chasse[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchChasses = async () => {
      try {
        const chassesData = await getAllChassesByChateau(chateau.getIdChateau());
        setChasses(chassesData.map((chasseData: ChasseType) => new Chasse(chasseData)));
      } catch (error) {
        console.error('Error fetching chasses:', error);
      }
    };
    fetchChasses();
  }, [chateau.getIdChateau()]);

  const availableChasses = chasses.filter((chasse) => chasse.isAvailable());

  const isParticipants = pathname.includes('participants');

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
        <CardTitle className="mb-2 text-xl font-bold">{chateau.getNom()}</CardTitle>
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
          <div className="flex items-center space-x-2">
            <Euro className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-800">
              Prix de location : {chateau.getPrixLocation()} €
            </span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold">Chasses Disponibles ({availableChasses.length})</h3>
          {availableChasses.length > 0 ? (
            <ul className="max-h-40 list-disc overflow-y-auto pl-5">
              {availableChasses.map((chasse) => (
                <li key={chasse.getIdChasse()} className="text-sm text-gray-800">
                  <Link
                    href={
                      isParticipants
                        ? `/participants/dashboard/chasses/${chasse.getIdChasse()}`
                        : `/organisateurs/dashboard/chasses/${chasse.getIdChasse()}`
                    }
                    className="hover:text-blue-600"
                  >
                    {chasse.getTitre()}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">Aucune chasse disponible pour le moment.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Link href={
          isParticipants
          ? `/participants/dashboard/chateau/${chateau.getIdChateau()}`
          : `/organisateurs/dashboard/chateau/${chateau.getIdChateau()}`
          } className="w-full">
          <Button className="w-full">Voir plus</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardChateau;
