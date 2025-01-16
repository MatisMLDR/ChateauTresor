import { createClient } from '@/utils/supabase/client'
import React from 'react'

const Accueil = async () => {

  const supabase = createClient()
  const data = (await supabase.auth.getUser()).data

  const user = data.user;

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold mb-3'>Bienvenue [Nom de l'utilisateur]</h1>
    </div>
  )
}

export default Accueil
