"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [chasse, setChasse] = useState<any | null>(null);
  
  // J'ai besoin de récupérer l'id de la chasse qui est dans l'url : .../chasses/[id]/inscription
  const params = useParams();


  useEffect(() => {
      // Je vais faire une requête API pour récupérer les informations de la chasse
      const fetchChasse = async () => {
        try {
          const response = await fetch(`/api/chasses/${params.id}`);
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la chasse');
          }
          const data = await response.json();
          setChasse(data);
        } catch (err) {
          console.error('Erreur lors de la récupération des détails de la chasse :', err);
        }
      };
  
      fetchChasse();
  }, [params.id]);

  return (
    <div>
      Inscription chasse {params.id}

    </div>
  )
}

export default page
