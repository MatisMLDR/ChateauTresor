import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Chasse from '@/classes/Chasse';
import { UUID } from 'crypto';

const ChasseDetailsPage = async ({ params }: {params: {id: UUID}}) => {

  // Récupérer l'id de la chasse depuis les search params
  const { id } = await params;
  // Récupérer les informations de la chasse
  const chasse = await Chasse.readId(id);

  const note = await chasse.getNoteMoyenne();

  const avis = await chasse.getAllAvis();

  if (!chasse) {
    return <div>Chargement des informations de la chasse...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{chasse.getTitre()}</h1>
      <img
        src={chasse.getImage() || '/default-chasse.jpg'}
        alt={chasse.getTitre()}
        className="w-full max-h-80 object-cover rounded-lg shadow-md mb-4"
      />
      <p className="text-lg text-gray-700 mb-4">{chasse.getDescription()}</p>
      <div className="text-md font-medium text-gray-800">
        <p>Nb etoiles : {note} / 5</p>
        <p>Difficulté : {chasse.getDifficulte()} / 3</p>
        <p>Prix : {chasse.getPrix()} €</p>
        <p>
          Date : {new Date(chasse.getDateDebut()).toLocaleDateString()} -{' '}
          {new Date(chasse.getDateFin()).toLocaleDateString()}
        </p>
        <Button>
          <Link href={`/participants/chasses/${id}/inscription`}>
            Réserver
          </Link>
        </Button>
      </div>
      <div>
        {avis
          .sort((a, b) => {
            if (
              new Date(a.getDateModification()) > new Date(b.DateModification)
            ) {
              return -1;
            }
            return 1;
          })
          .map((avis) => (
            <CardAvis key={avis.getIdAvis()} avis={avis} />
          )}
      </div>
    </div>
  );
};

export default ChasseDetailsPage;