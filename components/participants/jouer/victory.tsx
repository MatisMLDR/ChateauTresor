import React from 'react';

const Victory: React.FC<{ points: number }> = ({ points }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 p-4">
      <h1 className="text-2xl font-bold">Victoire !</h1>
      <p className="text-lg">Vous avez {points} points</p>
      <p>Présentez cette page à l'organisateur pour recevoir votre récompense.</p>
    </div>
  );
};

export default Victory;
