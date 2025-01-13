'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const JouerPage: React.FC = () =>{
  const router = useRouter();
  const { id_chasse } = router.query;
  const [enigmes, setEnigmes] = useState<any[]>([]);

  useEffect(() => {
    if (!id_chasse) return;

    const fetchEnigmes = async () => {
      try {
        const response = await fetch(`/api/enigmes/chasse?id_chasse=${id_chasse}`);
        const data = await response.json();
        setEnigmes(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des énigmes :', err);
      }
    };

    fetchEnigmes();
  }, [id_chasse]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Jouer à la Chasse</h1>
      <ul>
        {enigmes.map((enigme) => (
          <li key={enigme.id_enigme} className="mb-4">
            <h2 className="font-bold">{enigme.titre}</h2>
            <p>{enigme.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JouerPage;
