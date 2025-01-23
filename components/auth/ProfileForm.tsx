"use client"

import { Profil } from '@/classes/Profil'
import { CalendarIcon, Mail, User } from 'lucide-react';
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ProfilType } from '@/types';
import { DatePicker } from '../ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ProfileForm = ({ initialData }: { initialData: ProfilType }) => {
  const [profil, setProfil] = useState(initialData);
  const [date, setDate] = useState<Date | undefined>(profil.birthday ? new Date(profil.birthday) : undefined);

  const handleInputChange = (field: keyof ProfilType, value: string) => {
    setProfil((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profil) return;

    const formData = new FormData(event.currentTarget);

    if (!formData.get('username') || !formData.get('prenom') || !formData.get('nom')) {
      toast.error('Le nom d\'utilisateur est obligatoire.');
      return;
    }

    if (formData.get('code_postal')?.toString().length !== 5) {
      toast.error('Le code postal doit contenir 5 chiffres.');
      return;
    }

    // Mettez à jour l'état local
    const updatedProfil = new Profil({
      username: formData.get('username') as string,
      prenom: formData.get('prenom') as string,
      nom: formData.get('nom') as string,
      adresse: formData.get('adresse') as string,
      ville: formData.get('ville') as string,
      birthday: formData.get('birthday') as string,
      code_postal: formData.get('code_postal') as string,
      id: profil.id,
      email: profil.email,
      email_confirm: profil.email_confirm,
      plan: profil.plan,
    });

    setProfil(updatedProfil.toObject());

    try {
      await updatedProfil.update();
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil.');
    }
  };

  return (
    <form onSubmit={(e) => handleUpdateProfile(e)} className='space-y-4'>
      <Toaster />
      <div className="space-y-2">
        <label className="text-sm font-medium">Nom d&apos;utilisateur
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={profil.username ?? ''}
            placeholder="anonyme"
            name="username"
            onChange={(e) => handleInputChange('username', e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Prénom
          <span className="text-red-500 ml-1">*</span>

        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={profil.prenom ?? ''}
            placeholder="Jean"
            name="prenom"
            onChange={(e) => handleInputChange('prenom', e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Nom
          <span className="text-red-500 ml-1">*</span>

        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={profil.nom ?? ''}
            placeholder="Dupont"
            name="nom"
            onChange={(e) => handleInputChange('nom', e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Adresse</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={profil.adresse ?? ''}
            placeholder="12305 5th Brentwood"
            name="adresse"
            onChange={(e) => handleInputChange('adresse', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Ville</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={profil.ville ?? ''}
            placeholder="Los Angeles"
            name="ville"
            onChange={(e) => handleInputChange('ville', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Code Postal</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={profil.code_postal ?? ''}
            placeholder="12305"
            name="code_postal"
            onChange={(e) => handleInputChange('code_postal', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2 flex flex-col mt-2">
        <label className="text-sm font-medium">Date de naissance</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                `w-full justify-start text-left font-normal`,
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Sélectionner une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date);
                if (date) {
                  handleInputChange('birthday', date.toISOString());
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email
          <span className="text-red-500 ml-1">*</span>

        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" type="email" value={profil.email} disabled />
        </div>
      </div>
      <Button className="w-full mt-4" type="submit">
        Sauvegarder les changements
      </Button>
      <p className="text-muted-foreground mt-4">
        (<span className="text-red-500">*</span>) Champs obligatoires
      </p>
    </form>
  )
}

export default ProfileForm
