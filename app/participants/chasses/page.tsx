'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CardChasse from '@/components/CardChasse';
import Chasse from '@/classes/Chasse';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ChasseListPage: React.FC = () => {
  const [chasses, setChasses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Récupérer toutes les chasses
  useEffect(() => {
    const fetchChasses = async () => {
      try {
        const everyChasses = await Chasse.getAllChasses();
        setChasses(everyChasses);
      } catch (err) {
        console.error('Erreur lors de la récupération des chasses :', err);
      }
    };

    fetchChasses();
  }, []);

  // Gérer la soumission du formulaire de filtre
  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const minPrice = formData.get('input-min-price') as string;
    const maxPrice = formData.get('input-max-price') as string;
    if (minPrice) {
      chasses.filter((chasse) => chasse.getPrix() >= parseInt(minPrice));
    }
    if (maxPrice) {
      chasses.filter((chasse) => chasse.getPrix() <= parseInt(maxPrice));
    }
    // A rajouter après : 
    // const localisation = formData.get('input-location') as string;

    const duration = formData.get('input-duration') as string;
    if (duration) {
      chasses.filter((chasse) => chasse.getDureeTotale() <= parseInt(duration));
    }
    const difficulty = formData.get('input-difficulty') as string;
    if (difficulty) {
      chasses.filter((chasse) => chasse.getDifficulte() <= parseInt(difficulty));
    }

    const noteMin = formData.get('input-stars') as string;
    if (noteMin) {
      chasses.filter((chasse) => chasse.getNoteMoyenne() >= parseInt(noteMin));
    }

    const capacity = formData.get('input-capacity') as string;
    if (capacity) {
      chasses.filter((chasse) => chasse.getNbParticipants() <= parseInt(capacity));
    }

    const family = formData.get('input-family') as string;
    if (family) {
      chasses.filter((chasse) => chasse.isFamilyFriendly());
    }

    const available = formData.get('input-available') as string;
    if (available) {
      chasses.filter((chasse) => chasse.isAvailable());
    }

    setChasses(chasses);

    console.log('Filtrer les chasses');
  };

  // Filtrer les chasses en fonction de la recherche
  const chassesFiltrees = chasses.filter((chasse) =>
    chasse.getTitre().toLowerCase().includes(searchQuery.toLowerCase())
   && !chasse.isTer
  );

  return (
    <div className="flex">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Liste des Chasses</h1>

        {/* Barre de recherche */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher une chasse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Filtre des chasses */}
        <div className='border p-4 rounded-md shadow-md'>
          <h2 className='text-2xl mb-3'>Filtre</h2>
          <form onSubmit={handleFilterSubmit}>
            <div className='mb-3'>
              <h2 className='mb-2'>Fourchette de prix</h2>
              <div>
                <label htmlFor='input-min-price'>Prix min</label>
                <Input className='mb-1' type="number" name='input-min-price' placeholder="Prix min" />
              </div>
              <div>
                <label htmlFor='input-max-price'>Prix max</label>
                <Input className='mb-1' type="number" name='input-max-price' placeholder="Prix max" />
              </div>
            </div>
            {/* TODO : Ajouter fonctionnalité pour filtrer les chasses par la localisation (les plus proches du participant) */}
            {/* <div className='mb-3'>
              <label htmlFor='input-location'>Proche de chez moi</label>
              <Input type="checkbox" name='input-location' placeholder="Localisation" />
            </div> */}
            <div className='mb-3'>
              <label htmlFor='input-duration'>Durée max</label>
              <Input type="number" name='input-duration' placeholder="Durée max" />
            </div>
            <div className='mb-3'>
              <label htmlFor='input-difficulty'>Difficulté max</label>
              <Input type="number" name='input-difficulty' placeholder="Difficulté max" />
            </div>
            <div className='mb-3'>
              <label htmlFor='input-capacity'>Capacité max</label>
              <Input type="number" name='input-capacity' placeholder="Capacité max" />
            </div>
            <div className='mb-3'>
              <label htmlFor='input-family'>Note minimum</label>
              <Input type="number" name='input-stars' />
            </div>
            <div className='mb-3'>
              <label htmlFor='input-family'>Pensé pour les familles</label>
              <Input type="checkbox" name='input-family' />
            </div>
            <div className='mb-3'>
              <label htmlFor='input-available'>Disponible Maintenant</label>
              <Input type="checkbox" name='input-available' />
            </div>
            <Button type='submit'>Filtrer</Button>
          </form>
        </div>

        {/* Liste des chasses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chassesFiltrees.map((chasse) => (
            <CardChasse key={chasse.id_chasse} chasse={chasse} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChasseListPage;