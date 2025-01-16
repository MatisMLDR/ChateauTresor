'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Navigation2, Globe, Phone, PhoneCall, MapPin, Users, Euro } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useParams } from 'next/navigation';
import Link from 'next/link';

const ChateauDetailsPage: React.FC = () => {
  const params = useParams();
  const [chateau, setChateau] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChateau = async () => {
      try {
        const response = await fetch(`/api/chateaux/${params.id}`);
        const data = await response.json();
        setChateau(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails du château :', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChateau();
  }, [params.id]);

  const handleRedirectToCastleWebsite = () => {
    window.open(chateau.site_web, '_blank');
  };

  const handleRedirectToMaps = () => {
    const [latitude, longitude] = chateau.localisation.split(', ');
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  };

  if (isLoading) {
    return (
        <div className="container mx-auto p-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-48 rounded-lg mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
            </CardContent>
            <CardFooter className="flex justify-between items-stretch md:items-center flex-col md:flex-row gap-2">
              <Skeleton className="h-10 w-24" />
              <div className="flex flex-col md:flex-row gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardFooter>
          </Card>
        </div>
    );
  }

  return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{chateau.nom}</CardTitle>
            <CardDescription>Découvrez tout ce que ce château a à offrir.</CardDescription>
          </CardHeader>
          <CardContent>
            <img
                src={chateau.image || '/default-chateau.jpg'}
                alt={chateau.nom}
                className="w-full max-h-80 object-cover rounded-lg shadow-md mb-4"
            />
            <p className="text-lg text-gray-700 mb-4">{chateau.description}</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Capacité : {chateau.capacite} personnes</span>
              </div>
              <div className="flex items-center">
                <Euro className="mr-2 h-4 w-4" />
                <span>Prix de location : {chateau.prix_location} €</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>Adresse : {chateau.adresse_postale}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-stretch md:items-center flex-col md:flex-row gap-2">
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
            <div className={"flex flex-col md:flex-row gap-2"}>
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
                        <AlertDialogAction onClick={handleRedirectToCastleWebsite}>Continuer</AlertDialogAction>
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
                    <DialogContent className="sm:max-w-md scale-90">
                      <DialogHeader>
                        <DialogTitle>Contacter</DialogTitle>
                        <DialogDescription>
                          Pour plus d&apos;informations, utilisez les coordonnées ci-dessous.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        <span>Téléphone : <Link href={`tel:${chateau.telephone}`}>{chateau.telephone}</Link></span>
                      </div>
                    </DialogContent>
                  </Dialog>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
  );
};

export default ChateauDetailsPage;