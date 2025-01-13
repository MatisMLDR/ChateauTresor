import React, { useEffect, useState } from 'react';

interface GameInterfaceProps {
  chasse: any;
  onBack: () => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ chasse, onBack }) => {
  const [enigmes, setEnigmes] = useState<any[]>([]);
  const [currentEnigmeIndex, setCurrentEnigmeIndex] = useState(0); // Index de l'énigme en cours
  const [inputCode, setInputCode] = useState(''); // Code saisi par l'utilisateur
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Charger les énigmes de la chasse
  useEffect(() => {
    const fetchEnigmes = async () => {
      try {
        const response = await fetch(`/api/enigmes/chasse?id_chasse=${chasse.id_chasse}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setEnigmes(data);
        } else {
          console.warn('Les données des énigmes ne sont pas un tableau', data);
          setEnigmes([]);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des énigmes :', err);
        setEnigmes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnigmes();
  }, [chasse.id_chasse]);

  // Vérifier si les énigmes sont en cours de chargement
  if (loading) return <p>Chargement des énigmes...</p>;

  // Si aucune énigme n'est trouvée
  if (enigmes.length === 0) return <p>Aucune énigme trouvée pour cette chasse.</p>;

  // Énigme actuelle
  const currentEnigme = enigmes[currentEnigmeIndex];

  // Gestion de la validation du code
  const handleValidateCode = () => {
    if (inputCode === currentEnigme.code_reponse) {
      setErrorMessage(''); // Effacer les erreurs
      setInputCode(''); // Réinitialiser le champ de saisie
      if (currentEnigmeIndex < enigmes.length - 1) {
        setCurrentEnigmeIndex((prevIndex) => prevIndex + 1); // Passer à l'énigme suivante
      } else {
        alert('Félicitations, vous avez terminé toutes les énigmes de cette chasse !');
        onBack(); // Retour à la liste des chasses
      }
    } else {
      setErrorMessage('Code incorrect. Essayez à nouveau.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={onBack} className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md">
        Retour à la liste
      </button>
      <h1 className="text-2xl font-bold mb-6">{chasse.titre}</h1>
      <p className="mb-4">{chasse.description}</p>

      {/* Affichage de l'énigme actuelle */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{currentEnigme.titre}</h2>
        <p className="mb-4">{currentEnigme.description}</p>
        {currentEnigme.image && (
          <img
            src={currentEnigme.image}
            alt={currentEnigme.titre}
            className="w-full h-auto rounded-md mb-4"
          />
        )}
      </div>

      {/* Formulaire pour entrer le code */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Entrez le code de l'énigme"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm mb-2"
        />
        <button
          onClick={handleValidateCode}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        >
          Valider
        </button>
      </div>

      {/* Message d'erreur */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default GameInterface;
