"use client";

import { MembreEquipe } from '@/classes/MembreEquipe';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { UUID } from 'crypto';
import { LucideLogOut } from 'lucide-react';
import React from 'react'

type ButtonQuitTeamProps = {
  id_membre: UUID;
  id_equipe: UUID;
}

const ButtonQuitTeam = ({
  id_membre,
  id_equipe
}: ButtonQuitTeamProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          <LucideLogOut className="mr-2 h-4 w-4" /> Quitter l'équipe
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Quitter l'équipe</AlertDialogTitle>
          <AlertDialogDescription>
            Vous allez quitter votre équipe, voulez-vous continuer ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
            await MembreEquipe.quitterEquipe(id_membre, id_equipe)
          }}>
            Continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ButtonQuitTeam
