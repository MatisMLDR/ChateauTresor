"use client"
import Chasse from '@/classes/Chasse';
import { Participant } from '@/classes/Participant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import { UUID } from 'crypto';
import { set } from 'date-fns';
import Link from 'next/link';
import { redirect, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const page = () => {
  const [chasse, setChasse] = useState<Chasse | null>(null);
  const [idUser, setIdUser] = useState<UUID | null>(null);
  const [idParticipant, setIdParticipant] = useState<UUID | null>(null);
  // J'ai besoin de récupérer l'id de la chasse qui est dans l'url : .../chasses/[id]/inscription
  const params = useParams();


  useEffect(() => {
      // Je vais faire une requête API pour récupérer les informations de la chasse
      const fetchChasse = async () => {
        try {
          const chasse = await Chasse.readId(params.id as UUID);
          setChasse(chasse);
        } catch (err) {
          console.error('Erreur lors de la récupération des détails de la chasse :', err);
        }
      };

      const fetchUser = async () => {
        const supabase = createClient();
        try {
          const { data, error } = await supabase.auth.getUser()
          if (error) {
            throw error;
          }
          if (!data) {
            toast.error('Vous devez être connecté pour accéder à cette page');
            redirect('/login');
          }
          const userId = data.user.id as UUID;
          setIdUser(userId);

        } catch (err) {
          console.error('Erreur lors de la récupération des détails de la chasse :', err);
        }
      }
  
      fetchChasse();
      fetchUser();
  }, [params.id, idUser]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Je vais récupérer la valeur du champ input
    const form = e.target as HTMLFormElement;

    const day = form.day.value;

    try {
      const {data, error} = await Participant.readByIdUser(idUser!);

      if (!data) {
        throw new Error('Aucun participant trouvé pour cet utilisateur');
      }

      setIdParticipant(data.getIdParticipant());
    } catch (err) {
      console.error('Erreur lors de la récupération des détails du participant :', err);
    }

    try {
      await chasse?.addParticipant(idParticipant!, day);

      toast.success('Inscription à la chasse effectuée avec succès !');

      redirect('/participants/chassesAchete') 
    } catch (err) {
      console.error('Erreur lors de l\'inscription à la chasse :', err);
    }

  }

  if (!chasse) {
    return <div>Chargement des informations de la chasse...</div>;
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-4'>
        Paiement chasse : {chasse?.getTitre()}
      </h1>
      <p>
        Envoyer un chèque de {chasse?.getPrix()} € à l'adresse suivante :
      </p>
      <Link className='mb-4 underline text-blue-500 hover:text-blue-400' href="https://www.google.com/maps/search/I.U.T.2+Institut+Universitaire+de+Technologie+-+B%C3%A2timent/@45.1916643,5.7171449,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDExMC4wIKXMDSoASAFQAw%3D%3D">
        2 Pl. Doyen Gosse, 38000 Grenoble
      </Link>
      <form action="" onSubmit={handleFormSubmit}>
        <label htmlFor="day">Choisir le jour : </label>
        <Input type="text" name='day' id='day' required/>
        <Button type='submit'>
          Commencer
        </Button>
      </form>
      <h2 className='mb-2'>Merci pour le paiement !</h2>
    </div>
  )
}

export default page
