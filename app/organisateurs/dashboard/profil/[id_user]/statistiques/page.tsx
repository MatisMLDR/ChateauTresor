import { Profil } from '@/classes/Profil';
import { UUID } from 'crypto';
import React from 'react'

const ProfileStatistics = async ({ params }: { params : { id_user: UUID }}) => {

  const { id_user } = await params;

  const profil = await Profil.readId(id_user);

  return (
    <div>
      <h1 className="text-3xl p-4 mb-8">
        Statistiques du profil {profil.getPrenom()} {profil.getNom()}
      </h1>
    </div>
  )
}

export default ProfileStatistics
