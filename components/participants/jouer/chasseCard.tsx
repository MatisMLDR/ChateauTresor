import React from 'react';

interface ChasseCardProps {
  chasse: any;
  isAchetee: boolean;
  onJouer: () => void;
}

const ChasseCard: React.FC<ChasseCardProps> = ({ chasse, isAchetee, onJouer }) => {
  return (
    <div className="border rounded-md p-4 shadow-md">
      <img
        src={chasse.image || '/default-chasse.jpg'}
        alt={chasse.titre}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="font-bold text-lg mb-2">{chasse.titre}</h3>
      <p className="text-gray-600 text-sm mb-2">{chasse.description}</p>
      <p className="text-gray-800 font-medium">Difficulté : {chasse.difficulte} / 3</p>
      <p className="text-gray-800 font-medium">Prix : {chasse.prix} €</p>


        <button
          onClick={onJouer}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md w-full"
        >
          Jouer
        </button>

    </div>
  );
};

export default ChasseCard;
