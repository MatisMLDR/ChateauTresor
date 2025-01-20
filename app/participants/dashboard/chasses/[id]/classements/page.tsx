import Chasse from '@/classes/Chasse';
import { LoaderCircle } from 'lucide-react';
import React from 'react'

const ClassementsOfChasse = async ({ params }: { params: { id } }) => {

  const { id } = await params;

  const chasse = await Chasse.readId(id);

  if (!chasse) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className='p-4'>
      <h1 className="text-3xl font-bold mb-8">
        Classements de la chasse {chasse.getTitre()}
      </h1>
      <h2>
        Classement général du nombre de points total par participant
      </h2>
      {/* <ClassementGeneralPointOfChasse id_chasse={id} /> */}
    </div>
  )
}

export default ClassementsOfChasse
