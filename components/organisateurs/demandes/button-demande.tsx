'use client'
import EquipeOrganisatrice from '@/classes/EquipeOrganisatrice';
import { UUID } from 'crypto';
import { Check, Loader, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

type ButtonDemandeProps = {
  action: "accepter" | "refuser";
  id_membre: UUID;
  id_equipe: UUID;
  equipeData: any;
}

const ButtonDemande = ({ action, id_membre, id_equipe, equipeData }: ButtonDemandeProps) => {

  const router = useRouter();
  // State to handle loading
  const [loading, setLoading] = useState(false);

  const equipe = new EquipeOrganisatrice(equipeData);

  async function handleDemande(id_membre: UUID, action: "accepter" | "refuser") {
    setLoading(true); // Start loading
    try {
      if (action === "accepter") {
        await equipe.accepterDemande(id_membre);
      } else {
        await equipe.refuserDemande(id_membre);
      } 
      router.refresh(); // Refresh the page after action
    } catch (error) {
      console.error('Erreur lors du traitement de la demande', error);
    } finally {
      setLoading(false); // Stop loading
    }

  }

  return (
    <button
      className={`${
        action === "accepter" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
      } text-white px-4 py-2 rounded transition duration-200 flex items-center justify-center`}
      onClick={async () => handleDemande(id_membre, action)}
      disabled={loading} // Disable button while loading
    >
      {loading ? (
        // Show loader during loading state
        <Loader size={16} className="animate-spin" color="#fff" />
      ) : action === "accepter" ? (
        <Check size={16} color="#fff" />
      ) : (
        <X size={16} color="#fff" />
      )}
    </button>
  );

}

export default ButtonDemande
