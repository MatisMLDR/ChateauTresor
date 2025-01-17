"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import React, { useState } from 'react'

const OnBording = () => {

  const [equipe, setEquipe] = useState('');
  const [carteIdentite, setCarteIdentite] = useState('');

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      equipe: formData.get('equipe'),
      role: formData.get('select-role'),
      carteIdentite: formData.get('carteIdentite'),
    }
  }

  return (
    <div className='h-screen flex justify-center items-center'>
      <h1 className='text-3xl font-bold'>Bienvenue Yvan</h1>
      <h2>Nous avons besoin de plus d'information</h2>
      <form onSubmit={handleFormSubmit}>
        <div className='space-y-2'>
          <label htmlFor="equipe">Avez-vous une équipe existente</label>
          <Input
            id='equipe'
            name='equipe'
            type='text'
            value={equipe}
            onChange={(e) => setEquipe(e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <label htmlFor="equipe">Quel est votre rôle dans l'équipe ?</label>
          <Select name='select-role'>
            <option id='chef' value="chef">Chef de projet</option>
            <option id='organisateur' value="organisateur">Organisateur</option>
            <option id='createur' value="createur">Créateur</option>
            <option id='membre' value="Membre">Membre d'équipe</option>
          </Select>
          <label htmlFor="carteIdentite">Carte d'identité</label>
          <Input
            id='carteIdentite'
            name='carteIdentite'
            type="file"
            value={carteIdentite}
            onChange={(e) => setCarteIdentite(e.target.value)}
          />
        </div>
        <Button type='submit'>Continuer</Button>
      </form >
    </div >
  )
}

export default OnBording
