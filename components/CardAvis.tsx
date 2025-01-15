import React from 'react'
import LikeButton from './LikeButton';
import Avis from '@/classes/Avis';

interface CardAvisProps {
  avis: Avis;
}

const CardAvis = async ({ avis }: CardAvisProps) => {

  return (
    <div className='border rounded-md p-4 shadow-md'>
      <p className='text-gray-800'>{avis.getDateModification()}</p>
      <p className='text-2xl font-bold'>{avis.getTitre()}</p>
      <p className='text-gray-800'>{avis.getDescription()}</p>
      <p className='text-gray-800'>Note : {avis.getNote()} / 5</p>
      <div className="flex gap-2">
        <LikeButton avisObject={avis.toObject()} />
      </div>
    </div>
  )
}

export default CardAvis
