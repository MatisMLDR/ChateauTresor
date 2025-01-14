import React from 'react'

interface CardAvisProps {
  avis: any;
}

const CardAvis = async ({ avis }: CardAvisProps) => {

  const handleLikeClick = async () => {
    try {
      await avis.like();
    } catch (err) {
      console.error('Erreur lors du like :', err);
    }
  }

  return (
    <div className='border rounded-md p-4 shadow-md'>
      <p className='text-gray-800'>{avis.getDateModification()}</p>
      <p className='text-2xl font-bold'>{avis.getTitre()}</p>
      <p className='text-gray-800'>{avis.getDescription()}</p>
      <p className='text-gray-800'>Note : {avis.getNote()} / 5</p>
      <div className="flex gap-2">
        <button onClick={handleLikeClick}>
          <img src='/thumbsUp.svg' alt='like' />
          <span>{avis.getNbLike()}</span>
        </button>
      </div>

    </div>
  )
}

export default CardAvis
