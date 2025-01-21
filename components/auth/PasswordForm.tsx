"use client"

import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Lock } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const PasswordForm = ({ email }: { email: string }) => {

  const router = useRouter()

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!newPassword || !confirmPassword) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error("Le nouveau mot de passe doit être différent de l'ancien.");
      }
      toast.success('Mot de passe mis à jour avec succès !');
      router.refresh();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Erreur lors de la mise à jour du mot de passe.');
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-4">
      <Toaster />
      <div className="space-y-2">
        <label className="text-sm font-medium">Nouveau mot de passe
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder='Entrez votre nouveau mot de passe' type="password" name="newPassword" required />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Confirmer le nouveau mot de passe
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder='Confirmez votre nouveau mot de passe' type="password" name="confirmPassword" required />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Mettre à jour
      </Button>
      <p>
        (<span className="text-red-500">*</span>) Champs obligatoires
      </p>
    </form>

  )
}

export default PasswordForm
