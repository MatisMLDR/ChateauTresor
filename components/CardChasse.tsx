import { convertTimeToMinutesAndHours } from '@/lib/utils';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface CardChasseProps {
  chasse: any;
}

const CardChasse = ({ chasse }: CardChasseProps) => {

  const [nbAvis, setNbAvis] = useState<number>(0);
  const [note, setNote] = useState<number>(0);

  useEffect(() => {
    const fetchNbAvis = async () => {
      try {
        const nbAvis = await chasse.getNbAvis();
        setNbAvis(nbAvis);
      } catch (err) {
        console.error('Erreur lors de la récupération du nombre d\'avis :', err);
      }
    }
    const fetchNote = async () => {
      try {
        const noteMoyenne = await chasse.getNoteMoyenne();
        setNote(noteMoyenne);
      } catch (err) {
        console.error('Erreur lors de la récupération de la note :', err);
      }
    }
    fetchNbAvis();
    fetchNote();
  }, [nbAvis, note]);

  return (
    <div key={chasse.id_chasse} className="border rounded-md p-4 shadow-md">
      <img
        src={chasse.getImage() || '/default-chasse.jpg'}
        alt={chasse.getTitre()}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="font-bold text-lg mb-2">{chasse.getTitre()}</h3>
      <p className="text-gray-600 text-sm mb-2">{chasse.getDescription()}</p>
      <p className="text-gray-800 mb-2 bg-yellow-400">Nb étoiles : {note}</p>
      <p className="text-gray-800 font-medium">Difficulté : {chasse.getDifficulte()} / 3</p>
      <p className="text-gray-800 font-medium">Durée : {convertTimeToMinutesAndHours(chasse.getDureeEstime()).minutesFormatted}</p>
      <p className="text-gray-800 font-medium">Nombre d'avis : {nbAvis}</p>
      {/* <p className="text-gray-800 font-medium">
        <span>
          Icone localisation
        </span>
        {
          chasse.chateau
        }
      </p> */}
      <p className="text-gray-800 font-medium">Capacité : {chasse.getCapacite()}</p>
      <p className="text-gray-800 font-medium">Prix : {chasse.getPrix()} €</p>
      <Link href={`/participants/chasses/${chasse.getIdChasse()}`}>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full">
          Voir plus
        </button>
      </Link>
    </div>
  )
}

export default CardChasse
