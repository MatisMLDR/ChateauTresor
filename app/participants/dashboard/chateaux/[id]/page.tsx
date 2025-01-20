'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Euro, Globe, MapPin, Navigation2, Phone, PhoneCall, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CardChasse from '@/components/global/CardChasse';
import Chasse from '@/classes/Chasse';

const ChateauDetailsPage: React.FC = () => {
  const params = useParams();
  const [chateau, setChateau] = useState<any | null>(null);
  const [chasses, setChasses] = useState<Chasse[]>([]); // Typage explicite pour les chasses
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChasses, setIsLoadingChasses] = useState(true);

  useEffect(() => {
    const fetchChateau = async () => {
      try {
        // Récupérer les détails du château
        const response = await fetch(`/api/chateaux/${params.id}`);
        const data = await response.json();
        setChateau(data);

        // Récupérer les chasses associées au château
        const chassesResponse = await fetch(`/api/chasses/chateau?id_chateau=${params.id}`);
        const chassesData = await chassesResponse.json();

        // Convertir les chasses en instances de la classe Chasse
        const chassesInstances = chassesData.map((chasseData: any) => new Chasse(chasseData));
        setChasses(chassesInstances);
      } catch (err) {
        console.error(
          'Erreur lors de la récupération des détails du château ou des chasses :',
          err
        );
      } finally {
        setIsLoading(false);
        setIsLoadingChasses(false);
      }
    };

    fetchChateau();
  }, [params.id]);

  const handleRedirectToCastleWebsite = () => {
    if (chateau?.site_web) {
      window.open(chateau.site_web, '_blank');
    }
  };

  const handleRedirectToMaps = () => {
    if (chateau?.localisation) {
      const [latitude, longitude] = chateau.localisation.split(', ');
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="mb-2 h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-4 h-48 w-full rounded-lg" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-2/3" />
            <Skeleton className="mb-2 h-4 w-1/2" />
            <Skeleton className="mb-2 h-4 w-3/4" />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch justify-between gap-2 md:flex-row md:items-center">
            <Skeleton className="h-10 w-24" />
            <div className="flex flex-col gap-2 md:flex-row">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      {/* Carte du château */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{chateau.nom}</CardTitle>
          <CardDescription>Découvrez tout ce que ce château a à offrir.</CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src={chateau.image || '/default-castle.webp'}
            alt={chateau.nom}
            className="mb-4 max-h-80 w-full rounded-lg object-cover shadow-md"
          />
          <p className="mb-4 text-lg text-gray-700">{chateau.description}</p>
          <div className="space-y-2">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>Capacité : {chateau.capacite} personnes</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span>Adresse : {chateau.adresse_postale}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch justify-between gap-2 md:flex-row md:items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Navigation2 className="mr-2 h-4 w-4" /> S&apos;y rendre
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Redirection vers Google Maps</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action vous redirigera vers une autre page, voulez-vous continuer ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleRedirectToMaps}>Continuer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className={'flex flex-col gap-2 md:flex-row'}>
            {chateau.site_web && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <Globe className="mr-2 h-4 w-4" /> Site
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Redirection vers le site du chateau</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action vous redirigera vers une autre page, voulez-vous continuer ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRedirectToCastleWebsite}>
                      Continuer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {chateau.telephone && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PhoneCall className="mr-2 h-4 w-4" /> Contacter
                  </Button>
                </DialogTrigger>
                <DialogContent className="scale-90 sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Contacter</DialogTitle>
                    <DialogDescription>
                      Pour plus d&apos;informations, utilisez les coordonnées ci-dessous.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span>
                      Téléphone : <Link href={`tel:${chateau.telephone}`}>{chateau.telephone}</Link>
                    </span>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Section des chasses */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Chasses associées</h2>
        {isLoadingChasses ? (
          // Squelette de chargement pour les chasses
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : chasses.length > 0 ? (
          // Affichage des chasses sous forme de cartes
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chasses.map((chasse: Chasse) => (
              <CardChasse
                key={chasse.getIdChasse()} // Utilisation de la méthode getIdChasse()
                chasse={chasse}
              />
            ))}
          </div>
        ) : (
          // Message si aucune chasse n'est disponible
          <p className="text-gray-500">Aucune chasse disponible pour ce château.</p>
        )}
      </div>
    </div>
  );
};

export default ChateauDetailsPage;
