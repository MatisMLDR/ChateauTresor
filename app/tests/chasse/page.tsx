'use client';

import React, { useState } from 'react';
import { ChasseType } from '@/types';
import Chasse from '@/classes/Chasse';

const TestChassePage: React.FC = () => {
  const [chasse, setChasse] = useState<Chasse | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Exemple d'instance d'une chasse
  const sampleChasse: ChasseType = {
    id_chasse: 1,
    image: 'https://example.com/chasse.jpg',
    titre: 'Chasse Mystère',
    description: 'Une chasse passionnante dans un château historique.',
    difficulte: 2,
    prix: 15,
    date_debut: '2025-01-01T10:00:00Z',
    date_fin: '2025-01-10T18:00:00Z',
    capacite: 20,
    age_requis: 12,
    duree_estime: 120,
    theme: 'Histoire',
    id_chateau: 1,
    id_equipe: 2,
    statut: 'Actif',
    date_modification: '2025-01-05T12:00:00Z',
  };

  const handleLoadChasse = () => {
    const chasseInstance = new Chasse(sampleChasse);
    setChasse(chasseInstance);
    setResult(null);
    setError(null);
  };

  const handleTestMethod = async (method: keyof Chasse) => {
    if (!chasse) {
      setError('Veuillez charger une chasse d\'abord.');
      return;
    }

    try {
      const result = await (chasse[method] as any)();
      setResult(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Test de la classe Chasse</h1>

      <button
        onClick={handleLoadChasse}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Charger une chasse
      </button>

      {chasse && (
        <div className="mb-6">
          <h2 className="text-xl font-bold">Chasse chargée :</h2>
          <p>ID : {chasse.getIdChasse()}</p>
          <p>Titre : {chasse.getTitre()}</p>
          <p>Description : {chasse.getDescription()}</p>
          <p>Difficulté : {chasse.getDifficulte()}</p>
          <p>Prix : {chasse.getPrix()} €</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleTestMethod('getAllParticipations')}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Tester getAllParticipations
        </button>
        <button
          onClick={() => handleTestMethod('getAllEnigmes')}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Tester getAllEnigmes
        </button>
        <button
          onClick={() => handleTestMethod('getAllIndices')}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Tester getAllIndices
        </button>
        <button
          onClick={() => handleTestMethod('getAllRecompenses')}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Tester getAllRecompenses
        </button>
        <button
          onClick={() => handleTestMethod('getAllAvis')}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Tester getAllAvis
        </button>
        <button
          onClick={() => handleTestMethod('getDureeMoyenne')}
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
        >
          Tester getDureeMoyenne
        </button>
        <button
          onClick={() => handleTestMethod('getReussiteMoyenne')}
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
        >
          Tester getReussiteMoyenne
        </button>
        <button
          onClick={() => handleTestMethod('getScoreMoyen')}
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
        >
          Tester getScoreMoyen
        </button>
        <button
          onClick={() => handleTestMethod('getEnigmesResoluesMoyennes')}
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
        >
          Tester getEnigmesResoluesMoyennes
        </button>
        <button
          onClick={() => handleTestMethod('getNbRecompensesAttribuees')}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
        >
          Tester getNbRecompensesAttribuees
        </button>
        <button
          onClick={() => handleTestMethod('getNoteMoyenne')}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
        >
          Tester getNoteMoyenne
        </button>
        <button
          onClick={() => handleTestMethod('getNbAvis')}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
        >
          Tester getNbAvis
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h2 className="text-lg font-bold">Résultat :</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
          <h2 className="text-lg font-bold">Erreur :</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TestChassePage;