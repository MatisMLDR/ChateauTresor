'use client'
import EquipeOrganisatrice from '@/classes/EquipeOrganisatrice';
import { UUID } from 'crypto';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

type ButtonDemandeProps = {
  action: "accepter" | "refuser";
  id_membre: UUID;
  id_equipe: UUID;
  equipeData: any;
}

const ButtonDemande = ({ action, id_membre, id_equipe, equipeData }: ButtonDemandeProps) => {

  const router = useRouter();

  const equipe = new EquipeOrganisatrice(equipeData);

  async function handleDemande(id_membre: UUID, action: "accepter" | "refuser") {
    if (action === "accepter") {
      await equipe.accepterDemande(id_membre);
    } else {
      await equipe.refuserDemande(id_membre);
    }
    router.refresh();
  }

  if (action === "accepter") {
    return (
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 transition duration-200"
        onClick={async () => handleDemande(id_membre, "accepter")}
      >
        <Check size={16} color="#fff" />
      </button>
    )
  } else {
    return (
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        onClick={async () => handleDemande(id_membre, "refuser")}
      >
        <X size={16} color="#fff" />
      </button>
    )
  }

}

export default ButtonDemande
