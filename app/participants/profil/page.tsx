"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { User, Mail, Lock, Trophy, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { DatePicker } from "@/components/ui/date-picker";

const mockData = {
    tasks: [
        { date: "2024-03-01", completed: 4 },
        { date: "2024-03-02", completed: 6 },
        { date: "2024-03-03", completed: 3 },
        { date: "2024-03-04", completed: 8 },
        { date: "2024-03-05", completed: 5 },
    ],
    winRate: 75,
    recentTasks: [
        { id: 1, title: "Chasse d'eau", status: "Terminée" },
        { id: 2, title: "Chasse neige", status: "Terminée" },
        { id: 3, title: "Chasse au trésor", status: "En cours" },
    ],
};

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [firstLetter, setFirstLetter] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined); // Utilisation de Date pour le DatePicker
    const [userId, setUserId] = useState('');
    const [activeTab, setActiveTab] = useState("profile");
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user && user.email) {
                setFirstLetter(user.email.charAt(0).toUpperCase());
                setEmail(user.email);
                setUserId(user.id);
                try {
                    const response = await fetch(`/api/profils/${user.id}`);
                    const data = await response.json();
                    setUsername(data.username);
                    setFirstName(data.prenom || '');
                    setLastName(data.nom || '');
                    setAddress(data.adresse || '');
                    setPostalCode(data.postalCode || '');
                    setCity(data.ville || '');
                    setBirthDate(data.birthday ? new Date(data.birthday) : undefined); // Conversion en Date pour le DatePicker
                } catch (err) {
                    console.error('Erreur lors de la récupération du profil :', err);
                }
                setIsLoading(false);
            } else {
                router.push('/login');
            }
        };

        fetchUser();
    }, [router]);

    const handleUpdateProfile = async () => {
        try {
            const response = await fetch(`/api/profils/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    address,
                    postalCode,
                    city,
                    birthDate: birthDate?.toISOString().split('T')[0] // Formatage de la date pour l'API
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile' + response);
            }

            alert('Profil mis à jour avec succès !');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erreur lors de la mise à jour du profil.');
        }
    };

    const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
            alert('Mot de passe mis à jour avec succès !');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Erreur lors de la mise à jour du mot de passe.');
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex items-center space-x-4">
                    {(isLoading || !username) ? (
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
                                <AvatarFallback className={"text-xl"}>{firstLetter}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-3xl font-bold">{username}</h1>
                                <p className="text-muted-foreground">{email}</p>
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Custom Tabs */}
                    <div className="flex w-full max-w-md border rounded-lg overflow-hidden">
                        <Button
                            onClick={() => setActiveTab("profile")}
                            variant={activeTab === "profile" ? "default" : "ghost"}
                            className="flex-1 rounded-none"
                        >
                            Profil
                        </Button>
                        <Button
                            onClick={() => setActiveTab("statistics")}
                            variant={activeTab === "statistics" ? "default" : "ghost"}
                            className="flex-1 rounded-none"
                        >
                            Statistiques
                        </Button>
                    </div>

                    {/* Profile Content */}
                    {activeTab === "profile" && (
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Personal Information */}
                            <Card>
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
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Nom d&apos;utilisateur</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9"
                                                        value={username}
                                                        placeholder={`${username || 'marilyn.monroe'}`}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Prénom</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9"
                                                        value={firstName}
                                                        placeholder={`${firstName || 'Marilyn'}`}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Nom</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9"
                                                        value={lastName}
                                                        placeholder={`${lastName || 'MONROE'}`}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Adresse</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9"
                                                        value={address}
                                                        placeholder={`${address || '12305 5th Brentwood'}`}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Ville</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9"
                                                        value={city}
                                                        placeholder={`${city || 'Los Angeles'}`}
                                                        onChange={(e) => setCity(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Date de naissance</label>
                                                <DatePicker className={"w-full"} defaultDate={birthDate}/>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9"
                                                        type="email"
                                                        value={email}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <Button className="w-full" onClick={handleUpdateProfile}>Sauvegarder les changements</Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Password Update */}
                            <Card>
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
                                                <label className="text-sm font-medium">Mot de passe actuel</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" type="password" name="currentPassword" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Nouveau mot de passe</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" type="password" name="newPassword" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Confirmer le nouveau mot de passe</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" type="password" name="confirmPassword" />
                                                </div>
                                            </div>
                                            <Button type="submit" variant="secondary" className="w-full">Mettre à jour</Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Statistics Content */}
                    {activeTab === "statistics" && (
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Task Completion Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Progression</CardTitle>
                                    <CardDescription>Nombre d&apos;énigmes résolues au fil du temps</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    {isLoading ? (
                                        <Skeleton className="w-full h-full" />
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={mockData.tasks}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Win Rate and Recent Tasks */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center space-x-2">
                                            <Trophy className="w-5 h-5 text-yellow-500" />
                                            <span>Taux de réussite</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoading ? (
                                            <>
                                                <Skeleton className="h-8 w-24 mb-2" />
                                                <Skeleton className="h-4 w-48" />
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-3xl font-bold">{mockData.winRate}%</div>
                                                <p className="text-muted-foreground">Basé sur vos chasses récentes</p>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Chasses récentes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {isLoading ? (
                                                <>
                                                    <Skeleton className="h-6 w-full" />
                                                    <Skeleton className="h-6 w-full" />
                                                    <Skeleton className="h-6 w-full" />
                                                </>
                                            ) : (
                                                mockData.recentTasks.map((task) => (
                                                    <div key={task.id} className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <CheckCircle2 className={`w-5 h-5 ${
                                                                task.status === "Terminée" ? "text-green-500" : "text-gray-300"
                                                            }`} />
                                                            <span>{task.title}</span>
                                                        </div>
                                                        <span className={`text-sm ${
                                                            task.status === "Terminée" ? "text-green-500" : "text-muted-foreground"
                                                        }`}>
                              {task.status}
                            </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}