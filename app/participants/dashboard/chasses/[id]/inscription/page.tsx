"use client";

import Chasse from '@/classes/Chasse';
import { Participant } from '@/classes/Participant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import Loader from '@/components/global/loader';
import { UUID } from 'crypto';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Page = () => {
  const [chasse, setChasse] = useState<Chasse | null>(null);
  const [idUser, setIdUser] = useState<UUID | null>(null);
  const [idParticipant, setIdParticipant] = useState<UUID | null>(null);

  const params = useParams();
  const router = useRouter();

  // Récupération des données utilisateur et de la chasse
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        // Vérifier si l'utilisateur est connecté
        if (error || !data || !data.user) {
          toast.error('Vous devez être connecté pour accéder à cette page');
          router.push('/login');
          return; // Arrêter l'exécution si l'utilisateur n'est pas connecté
        }

        // Mettre à jour l'ID de l'utilisateur
        setIdUser(data.user.id as UUID);

        // Récupération des détails de la chasse
        const chasseDetails = await Chasse.readId(params.id as UUID);
        setChasse(chasseDetails);

        // Récupération du participant lié à l'utilisateur
        const participant = await Participant.readByIdUser(data.user.id as UUID);
        if (participant) {
          setIdParticipant(participant.getIdParticipant());
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données :', err);
        toast.error('Une erreur est survenue. Veuillez réessayer plus tard.');
      }
    };

    fetchData();
  }, [params.id]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const day = form.day.value;

    if (!idParticipant) {
      toast.error('Participant introuvable. Veuillez vérifier vos informations.');
      return;
    }

    try {
      await chasse?.addParticipant(idParticipant, day);
      toast.success('Inscription à la chasse effectuée avec succès !');
      router.push('/participants/dashboard/chassesAchete');
    } catch (err) {
      console.error("Erreur lors de l'inscription à la chasse :", err);
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  if (!chasse || !idUser) {
    return <Loader />;
  }

  return (
    <div>
      <h3>Log pour voir</h3>
      <p>idUser : {idUser}</p>
      <p>idParticipant : {idParticipant}</p>
      <h1 className="text-3xl font-bold mb-4">
        Paiement chasse : {chasse.getTitre()}
      </h1>
      <p>Envoyer un chèque de {chasse.getPrix()} € à l'adresse suivante :</p>
      <Link
        className="mb-4 underline text-blue-500 hover:text-blue-400"
        href="https://www.google.com/maps/search/I.U.T.2+Institut+Universitaire+de+Technologie+-+B%C3%A2timent/@45.1916643,5.7171449,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDExMC4wIKXMDSoASAFQAw%3D%3D"
      >
        2 Pl. Doyen Gosse, 38000 Grenoble
      </Link>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="day">Choisir le jour : </label>
        <Input type="text" name="day" id="day" required />
        <Button type="submit">Commencer</Button>
      </form>
      <h2 className="mb-2">Merci pour le paiement !</h2>
    </div>
  );
};

export default Page;