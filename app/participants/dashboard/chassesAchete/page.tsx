'use client';

import React, { useState, useEffect } from 'react';
import ChasseCard from '@/components/participants/jouer/chasseCard';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Chasse from '@/classes/Chasse';
import { Participant } from '@/classes/Participant';
import { UUID } from 'crypto';
import Loader from '@/components/global/loader';
import CardChasse from '@/components/global/CardChasse';

const ChasseList: React.FC = () => {
  const [chasses, setChasses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération de l'utilisateur
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Récupération du participant
        const participant = await Participant.readByIdUser(user.id as UUID);
        const participantId = participant.getIdParticipant();

        // Récupération des chasses
        const chassesData = await Chasse.getChassesByParticipantId(participantId);
        setChasses(Array.isArray(chassesData) ? chassesData : []);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase.auth]);

  const chassesFiltrees = chasses.filter((chasse) =>
    chasse.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJouer = (chasseId: string) => {
    router.push(`/participants/dashboard/jouer?chasseId=${chasseId}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mes Chasses Achetées</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une chasse..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {chassesFiltrees.map((chasse) => (
          <ChasseCard
            key={chasse.id_chasse}
            chasse={chasse}
            isAchetee={true}
            onJouer={() => handleJouer(chasse.id_chasse)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChasseList;