'use client'
import EquipeOrganisatrice from '@/classes/EquipeOrganisatrice';
import { UUID } from 'crypto';
import { Check, Loader, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

type ButtonDemandeProps = {
  action: "accepter" | "refuser";
  id_membre: UUID;
  id_equipe: UUID;
  equipeData: any;
}

const ButtonDemande = ({ action, id_membre, id_equipe, equipeData }: ButtonDemandeProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const equipe = new EquipeOrganisatrice(equipeData);

  async function handleConfirmation() {
    setLoading(true);
    try {
      if (action === "accepter") {
        await equipe.accepterDemande(id_membre);
      } else {
        await equipe.refuserDemande(id_membre);
      }
      router.refresh();
    } catch (error) {
      console.error('Erreur lors du traitement de la demande', error);
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  }

  return (
    <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
      <AlertDialogTrigger asChild>
        <button
          className={`${
            action === "accepter" 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-red-500 hover:bg-red-600"
          } text-white px-4 py-2 rounded transition duration-200 flex items-center justify-center`}
        >
          {action === "accepter" ? (
            <Check size={16} color="#fff" />
          ) : (
            <X size={16} color="#fff" />
          )}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer l&apos;action</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir {action === "accepter" ? "accepter" : "refuser"} cette demande ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirmation}
            disabled={loading}
            className={`${
              action === "accepter" 
                ? "bg-green-500 hover:bg-green-600" 
                : "bg-red-500 hover:bg-red-600"
            } flex gap-2`}
          >
            {loading && <Loader size={18} className="animate-spin" />}
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ButtonDemande