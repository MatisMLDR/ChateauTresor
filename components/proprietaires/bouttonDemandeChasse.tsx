'use client';

import Chasse from '@/classes/Chasse';
import { UUID } from 'crypto';
import { Check, Loader, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type ButtonDemandeChasseProps = {
  action: 'accepter' | 'refuser';
  id_chasse: UUID;
  chasseData: any; // Données de la chasse
};

const ButtonDemandeChasse = ({ action, id_chasse, chasseData }: ButtonDemandeChasseProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const chasse = new Chasse(chasseData);

  async function handleDemandeChasse(id_chasse: UUID, action: 'accepter' | 'refuser') {
    setLoading(true); // Début du chargement
    try {
      if (action === 'accepter') {
        chasse.setStatut('Validée'); // Mettre à jour le statut de la chasse
      } else {
        chasse.setStatut('En attente de validation'); // Mettre à jour le statut de la chasse
      }
      await chasse.update(); // Enregistrer les modifications
     
    } catch (error) {
      console.error('Erreur lors du traitement de la demande', error);
    } finally {
      router.refresh(); // Rafraîchir la page après l'action
      setLoading(false); // Fin du chargement
    }
  }

  return (
    <button
      className={`${
        action === 'accepter' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
      } text-white px-4 py-2 rounded transition duration-200 flex items-center justify-center`}
      onClick={async () => handleDemandeChasse(id_chasse, action)}
      disabled={loading} // Désactiver le bouton pendant le chargement
    >
      {loading ? (
        // Afficher un loader pendant le chargement
        <Loader size={16} className="animate-spin" color="#fff" />
      ) : action === 'accepter' ? (
        <Check size={16} color="#fff" />
      ) : (
        <X size={16} color="#fff" />
      )}
    </button>
  );
};

export default ButtonDemandeChasse;