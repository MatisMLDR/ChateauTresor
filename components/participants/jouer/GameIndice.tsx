'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getIndiceById } from '@/utils/dao/IndiceUtils';
import { Undo2 } from 'lucide-react';
import { UUID } from 'crypto';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

interface Indice {
  id_indice: UUID;
  contenu: string;
  degre_aide: number;
  id_enigme: UUID;
  ordre: number;
  type: string;
}

interface GameIndiceProps {
  chasseId: UUID;
  enigmeId: UUID;
}

export default function GameIndice({chasseId, enigmeId}: GameIndiceProps) {
  const [indice, setIndice] = useState<Indice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<boolean>(false);

  const params = useParams();
  const router = useRouter();

  const id_indice = params.id as UUID;

  useEffect(() => {
    const fetchIndice = async () => {
      try {
        const indice = await getIndiceById(id_indice);
        setIndice(indice);
        setError(null);

        const discoveredIndices = JSON.parse(localStorage.getItem('discoveredIndices') || '[]');
        if (discoveredIndices.includes(id_indice)) {
          setDiscovered(true);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'indice :', error);
        setError('Impossible de charger l\'indice. Veuillez réessayer plus tard.');
      }
    };

    if (id_indice) {
      fetchIndice();
    }
  }, [id_indice]);

  const handleBackToEnigme = () => {
    router.push(`/participants/dashboard/jouer?chasseId=${chasseId}&enigmeId=${enigmeId}`);
  };

  if (error) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Erreur</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleBackToEnigme}>
              Retour à l&apos;énigme
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <Button 
        onClick={handleBackToEnigme}
        className="w-full sm:w-auto"
      >
        <Undo2 />Retour à l&apos;énigme
      </Button>

      {!indice ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Indice {indice.ordre}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                {indice.contenu.endsWith('.jpg') || indice.contenu.endsWith('jpeg') || indice.contenu.endsWith('.png') || indice.contenu.endsWith('.webp') ? (
                  <img src={indice.contenu} alt={`Indice ${indice.ordre}`} className="w-full h-auto rounded-lg" />
                ) : (indice.contenu.endsWith('.mp3') || (indice.contenu.endsWith('.ogg') || indice.contenu.endsWith('.wav') || indice.contenu.endsWith('.aac')) ? (
                  <AudioPlayer soundLink={indice.contenu} />
                ) : (
                  <p className='text-primary'>{indice.contenu}</p>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Degré d&apos;aide : {indice.degre_aide}/5
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}