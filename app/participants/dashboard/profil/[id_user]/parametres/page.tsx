import { Profil } from '@/classes/Profil';
import Loader from '@/components/global/loader';
import React from 'react'

const ProfilParametres = async ({ params }: { params: { id_user: string }}) => {
  
  const { id_user } = await params;
  const profile = await Profil.readId(id_user);

  if (!profile) {
    return <Loader />;
  }

  return (
    <div>
      Parametres du profil de {profile.prenom} {profile.nom}
    </div>
  )
}

export default ProfilParametres
