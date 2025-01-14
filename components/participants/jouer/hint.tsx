import React from 'react';

const Hint: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 p-4">
      <h1 className="text-2xl font-bold">Indice pour l'Énigme</h1>
      <p className="text-lg">Voici un indice fictif pour vous aider !</p>
      <button
        className="bg-secondary text-text px-6 py-3 rounded hover:bg-highlight"
        onClick={() => setCurrentPage('enigma1')}
      >
        Retour
      </button>
    </div>
  );
};

export default Hint;
