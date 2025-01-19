'use client'; // Indique que ce composant est un Client Component

import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { UUID } from 'crypto';

export function DeleteChasseButton({ chasseId }: { chasseId: UUID }) {
  const handleDeleteChasse = async () => {
    try {
      // Appeler l'API pour supprimer la chasse
      const response = await fetch(`/api/chasses/${chasseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la chasse');
      }

      // Rediriger vers le tableau de bord après la suppression
      window.location.href = '/organisateurs/dashboard';
    } catch (error) {
      console.error('Erreur lors de la suppression de la chasse :', error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action supprimera définitivement cette chasse. Vous ne pourrez pas annuler cette action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteChasse}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}