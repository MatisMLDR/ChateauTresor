import React from 'react';

const Reward: React.FC<{ setCurrentPage: (page: string) => void; points: number }> = ({ setCurrentPage, points }) => {
  return (
    <div>
      <h1>{points >= 9 ? 'Récompense vérifiée' : 'Récompense invalide'}</h1>
      <p>
        {points >= 9
          ? 'Vous avez réussi toutes les énigmes et obtenu 9 points.'
          : 'La vérification du QR Code a échoué.'}
      </p>
      <button onClick={() => setCurrentPage('available-lots')}>Voir les lots disponibles</button>
    </div>
  );
};

export default Reward;
