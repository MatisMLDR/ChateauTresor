'use client';

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
import Chasse from "@/classes/Chasse";
import { useParams } from 'next/navigation';

interface DeleteChasseButtonProps {
  chasseId: UUID;
  id_equipe: UUID; // Ajout de la prop id_equipe
}

export function DeleteChasseButton({ chasseId, id_equipe }: DeleteChasseButtonProps) {
  const handleDeleteChasse = async () => {
    try {
      const response = await fetch(`/api/chasses/${chasseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      // Utilisation de l'id_equipe dans la redirection
      window.location.href = `/organisateurs/dashboard/${id_equipe}`;
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
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
          <AlertDialogTitle>Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette chasse ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteChasse}>
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}