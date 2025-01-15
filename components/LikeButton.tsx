'use client'

import React, { useEffect, useState } from 'react'
import { ThumbsUp } from 'lucide-react';
import { AvisType } from '@/types';
import Avis from '@/classes/Avis';


interface LikeButtonProps {
  avisObject: AvisType;
}

const LikeButton = ({ avisObject }: LikeButtonProps) => {


  const [avis, setAvis] = useState(new Avis(avisObject));
  const [isLiked, setIsLiked] = useState(false);
  const [nbLike, setNbLike] = useState(0);
  useEffect(() => {
    // Récupérer le nombre de like de l'avis
    const fetchLike = async () => {
      try {
        const nbLike = await avis.getNbLike();
        setNbLike(nbLike);
      } catch (err) {
        console.error('Erreur lors de la récupération du nombre de like :', err);
      }
    }
    fetchLike();
  }, [isLiked]);



  const handleLikeClick = async () => {
    // Utiliser la classe Avis pour liker l'avis
    try {
      if (isLiked) {
        await avis.removeLike();
      } else {
        await avis.addLike();
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Erreur lors du like :', err);
    }
  }

  return (
    <button onClick={handleLikeClick} className='flex items-center gap-2'>
      <ThumbsUp size={24} />
      <span className=''>{nbLike}</span>
    </button>
  )
}

export default LikeButton
