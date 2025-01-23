import { Profil } from '@/classes/Profil';
import PasswordForm from '@/components/auth/PasswordForm';
import ProfileForm from '@/components/auth/ProfileForm';
import Loader from '@/components/global/loader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UUID } from 'crypto';

const ProfileParameters = async ({ params }: { params: { id_user: string} }) => {

  const { id_user } = await params;

  const profil = await Profil.readId(id_user as UUID);

  if (!profil) {
    return <Loader />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold p-4 mb-8">
        Vos Paramètres
      </h1>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header Section */}
        <div className="flex items-center space-x-4">
          {!profil ? (
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
                <AvatarFallback className={'text-2xl bg-gold text-primary font-semibold'}>{profil?.getPrenom().charAt(0).toUpperCase()}</AvatarFallback>
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
                    {!profil ? (
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
                      <ProfileForm initialData={profil.toObject()} />
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
                    {!profil ? (
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
                      <PasswordForm email={profil.getEmail()} />
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
