"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

export default function StatisticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [firstLetter, setFirstLetter] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
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
                try {
                    const response = await fetch(`/api/profils/${user.id}`);
                    const data = await response.json();
                    setUsername(data.username);
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
                    {/* Statistics Content */}
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
                </div>
            </div>
        </div>
    );
}