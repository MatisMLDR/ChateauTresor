import Link from 'next/link';
import React from 'react'

interface CardChasseProps {
  chasse: any;
}

const CardChasse = ({ chasse }: CardChasseProps) => {
  return (
    <div key={chasse.id_chasse} className="border rounded-md p-4 shadow-md">
      <img
        src={chasse.image || '/default-chasse.jpg'}
        alt={chasse.titre}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="font-bold text-lg mb-2">{chasse.getTitre()}</h3>
      <p>{chasse.note}</p>
      <p className="text-gray-600 text-sm mb-2">{chasse.description}</p>
      <p className="text-gray-800 font-medium">Difficulté : {chasse.difficulte} / 3</p>
      <p className="text-gray-800 font-medium">Durée : {chasse.duree_totale} minutes</p>
      <p className="text-gray-800 font-medium">Nombre de participants : {chasse.nb_participants} participants</p>
      <p className="text-gray-800 font-medium">
        <span>
          Icone localisation
        </span>
        {
          chasse.chateau
        }
      </p>
      <p className="text-gray-800 font-medium">Prix : {chasse.prix} €</p>
      <Link href={`/participants/chasses/${chasse.id_chasse}`}>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full">
          Voir plus
        </button>
      </Link>
    </div>
  )
}

export default CardChasse
