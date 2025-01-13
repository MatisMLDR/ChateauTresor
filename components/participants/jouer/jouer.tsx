"use client";

import { useState } from 'react';
import ChassesAchetees from '@/components/participants/jouer/chassesAchetees';
import Enigmes from '@/components/participants/jouer/enigmes';

const Jouer = ({ participantId }) => {
  const [selectedChasse, setSelectedChasse] = useState(null);

  return (
    <div className="container">
      {!selectedChasse ? (
        <ChassesAchetees participantId={participantId} setSelectedChasse={setSelectedChasse} />
      ) : (
        <Enigmes chasseId={selectedChasse.id_chasse} />
      )}
    </div>
  );
};

export default Jouer;
