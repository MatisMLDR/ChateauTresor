'use client';

import { Profil } from '@/classes/Profil';
import { UUID } from 'crypto';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Mail, User } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { ProfilType } from '@/types';
import toast from 'react-hot-toast';

const ProfileParameters = () => {

  const { id_user } = useParams();

  const [profil, setProfil] = useState<Profil | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profilModel = await Profil.readId(id_user as UUID);
        setProfil(profilModel);
      } catch (err) {
        console.error('Erreur lors de la récupération du profil :', err);
      }
    };
    fetchProfile();
    setIsLoading(false);
  }, [id_user]);

const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
  if (!profil) return;
  try {
    await profil.update();
    toast.success('Profil mis à jour avec succès !');
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Erreur lors de la mise à jour du profil.');
  }
};

const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (newPassword !== confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas.');
    return;
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    toast.success('Mot de passe mis à jour avec succès !');
  } catch (error) {
    console.error('Error updating password:', error);
    toast.error('Erreur lors de la mise à jour du mot de passe.');
  }
};

return (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold p-4 mb-8">
      Vos Paramètres
    </h1>
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header Section */}
      <div className="flex items-center space-x-4">
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </>
        ) : (
          <>
            <Avatar className="h-20 w-20">
              <AvatarFallback className={'text-xl'}>{profil?.getPrenom().charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{profil?.getUsername()}</h1>
              <p className="text-muted-foreground">{profil?.getEmail()}</p>
            </div>
          </>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Content */}
        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            {/* Personal Information Card */}
            <div className={'flex justify-center'}>
              <Card className={'w-full md:w-1/2'}>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Modifier vos informations personnelles ici</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </>
                  ) : (
                    <form onSubmit={handleUpdateProfile}>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nom d&apos;utilisateur
                        <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            value={profil?.getUsername() ?? ''}
                            placeholder="anonyme"
                            onChange={(e) => profil?.setUsername(e.target.value)}
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
                            value={profil?.getPrenom() ?? ''}
                            placeholder="Jean"
                            onChange={(e) => profil?.setPrenom(e.target.value)}
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
                            value={profil?.getNom() ?? ''}
                            placeholder="Dupont"
                            onChange={(e) => profil?.setNom(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Adresse</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            value={profil?.getAdresse() ?? ''}
                            placeholder="12305 5th Brentwood"
                            onChange={(e) => profil?.setAdresse(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ville</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            value={profil?.getVille() ?? ''}
                            placeholder="Los Angeles"
                            onChange={(e) => profil?.setVille(e.target.value)}
                          />
                        </div>
                      </div>
                        <div className="space-y-2">
                        <label className="text-sm font-medium">Date de naissance</label>
                        <DatePicker className={'w-full'} defaultDate={profil?.getBirthday() ? new Date(profil.getBirthday()!) : undefined} />
                        </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email
                        <span className="text-red-500 ml-1">*</span>

                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input className="pl-9" type="email" value={profil?.getEmail()} disabled />
                        </div>
                      </div>
                      <Button className="w-full mt-4" type="submit">
                        Sauvegarder les changements
                      </Button>
                      <p className="text-muted-foreground mt-4">
                        (<span className="text-red-500">*</span>) Champs obligatoires
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="security">
            {/* Security Card */}
            <div className={'flex justify-center'}>
              <Card className={'w-full md:w-1/2'}>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>Changer votre mot de passe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </>
                  ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Mot de passe actuel
                        <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input className="pl-9" placeholder='Entrez votre mot de passe actuel' type="password" name="currentPassword" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nouveau mot de passe
                        <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input className="pl-9" placeholder='Entrez votre nouveau mot de passe' type="password" name="newPassword" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Confirmer le nouveau mot de passe
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input className="pl-9" placeholder='Confirmez votre nouveau mot de passe' type="password" name="confirmPassword" />
                        </div>
                      </div>
                      <Button type="submit" variant="secondary" className="w-full">
                        Mettre à jour
                      </Button>
                      <p>
                        (<span className="text-red-500">*</span>) Champs obligatoires
                      </p>
                    </form>
                    
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
);
}

export default ProfileParameters
