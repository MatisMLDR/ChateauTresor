import { UUID } from 'crypto'
import Link from 'next/link';
import React from 'react'

const Profil = async ({ params }: { params : { id_user: UUID }}) => {

  const { id_user } = await params;

  return (
    <div>
      <h1 className='text-3xl mb-8'>Profil</h1>
      <Link href={`/organisateurs/dashboard/profil/${id_user}/informations`}>
        Informations
      </Link>
      <Link href={`/organisateurs/dashboard/profil/${id_user}/statistiques`}>
        Statistiques
      </Link>
    </div>
  )
}

export default Profil
