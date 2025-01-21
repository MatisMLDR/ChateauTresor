"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Euro, Users, Trophy, Star } from "lucide-react";
import { formatEuro } from "@/lib/utils";
import Chasse from '@/classes/Chasse';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { getNbParticipationsByChasse, getParticipationsByChasseAndDate } from '@/utils/dao/ParticipationUtils';

interface DashboardStats {
  totalRevenue: number;
  totalParticipants: number;
  averageSuccess: number;
  averageRating: number;
}

interface HuntStats {
  id: string;
  title: string;
  dailyRevenue: { date: string; revenue: number }[];
  averageRating: number;
  reviewCount: number;
  successRate: number;
  riddleCompletionRate: number;
  cluesRevealed: number;
}

  export default function DashboardPage() {
    const params = useParams();
    const id_equipe = params.id_equipe;
    const [stats, setStats] = useState<DashboardStats>({
      totalRevenue: 0,
      totalParticipants: 0,
      averageSuccess: 0,
      averageRating: 0,
    });

    const [recentHunts, setRecentHunts] = useState<HuntStats[]>([]);
    const [selectedHunt, setSelectedHunt] = useState<HuntStats | null>(null);
    const [popupHunt, setPopupHunt] = useState<HuntStats | null>(null);
    const [totalDailyRevenue, setTotalDailyRevenue] = useState<{ date: string; revenue: number }[]>([]);
    const [selectedInterval, setSelectedInterval] = useState<number>(30); // Par défaut, 30 jours

    const intervalOptions = [
      { label: "7 derniers jours", value: 7 },
      { label: "30 derniers jours", value: 30 },
      { label: "90 derniers jours", value: 90 },
      { label: "Année en cours", value: 365 },
    ];


    const getLastNDays = (days: number): string[] => {
      const dates: string[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split("T")[0]); // Format YYYY-MM-DD
      }
      return dates;
    };


    const fetchData = async () => {
      try {
        if (!params.id_equipe) return;

        const equipeId = params.id_equipe as UUID;

        // Récupérer les chasses associées à l'équipe
        const chasses = await Chasse.getChassesByEquipeId(equipeId);

        // Récupérer les dates en fonction de l'intervalle sélectionné
        const lastNDays = getLastNDays(selectedInterval);

        // Transformer les chasses en format HuntStats
        const hunts: HuntStats[] = await Promise.all(
          chasses.map(async (chasse) => {
            // Calculer les revenus journaliers en fonction des participations
            const dailyRevenue = await Promise.all(
              lastNDays.map(async (date) => {
                const participations = await getParticipationsByChasseAndDate(chasse.getIdChasse(), date);
                return {
                  date,
                  revenue: chasse.getPrix() * participations, // Revenu = prix * nombre de participations
                };
              })
            );""

            // Récupérer les statistiques de la chasse
            const averageRating = await chasse.getNoteMoyenne();
            const reviewCount = await getNbParticipationsByChasse(chasse.getIdChasse());
            const successRate = await chasse.getReussiteMoyenne();
            const riddleCompletionRate = await chasse.getEnigmesResoluesMoyennes();
            const cluesRevealed = await chasse.getIndicesMoyens();

            return {
              id: chasse.getIdChasse(),
              title: chasse.getTitre(),
              dailyRevenue,
              averageRating,
              reviewCount,
              successRate,
              riddleCompletionRate,
              cluesRevealed,
            };
          })
        );

        // Calculer les revenus journaliers totaux
        const dailyRevenueMap = new Map();
        hunts.forEach((hunt) => {
          hunt.dailyRevenue.forEach(({ date, revenue }) => {
            dailyRevenueMap.set(date, (dailyRevenueMap.get(date) || 0) + revenue);
          });
        });

        const totalRevenueData = Array.from(dailyRevenueMap.entries()).map(([date, revenue]) => ({
          date,
          revenue,
        }));

        setTotalDailyRevenue(totalRevenueData);

        // Calculer les statistiques globales
        const totalRevenue = hunts.reduce(
          (sum, hunt) => sum + hunt.dailyRevenue.reduce((revSum, day) => revSum + day.revenue, 0),
          0
        );
        const totalParticipants = hunts.reduce((sum, hunt) => sum + hunt.reviewCount, 0);
        const averageSuccess = hunts.reduce((sum, hunt) => sum + hunt.successRate, 0) / hunts.length;
        const averageRating = hunts.reduce((sum, hunt) => sum + hunt.averageRating, 0) / hunts.length;

        setStats({
          totalRevenue,
          totalParticipants,
          averageSuccess,
          averageRating,
        });

        setRecentHunts(hunts);
        setSelectedHunt(hunts[0]); // Sélectionner la première chasse par défaut
      } catch (error) {
        console.error("Failed to fetch chasses:", error);
      }
    };

    useEffect(() => {
      fetchData();
    }, [id_equipe, selectedInterval]); // Recharger les données lorsque l'intervalle change

  const handleHuntSelection = (huntId: string) => {
    if (huntId === "total") {
      setSelectedHunt({
        id: "total",
        title: "Revenus Totaux",
        dailyRevenue: totalDailyRevenue,
        averageRating: 0,
        reviewCount: 0,
        successRate: 0,
        riddleCompletionRate: 0,
        cluesRevealed: 0,
      });
    } else {
      const hunt = recentHunts.find((h) => h.id === huntId);
      setSelectedHunt(hunt || null);
    }
  };


  const handleHuntClick = (huntId: string) => {
    const hunt = recentHunts.find((h) => h.id === huntId);
    if (hunt) {
      setPopupHunt(hunt);
    }
  };

  const closePopup = () => {
    setPopupHunt(null);
  };


  return (
    <div className="flex">

      {/* Contenu de la page */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Tableau de Bord</h1>
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatEuro(stats.totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalParticipants}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageSuccess.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
        {/* Select Hunt Dropdown */}
        <div className="mb-4">
          <label htmlFor="hunt-select" className="mb-2 block text-sm font-medium">
            Sélectionnez une chasse pour voir ses revenus journaliers :
          </label>
          <select
            id="hunt-select"
            className="block w-full rounded border p-2"
            onChange={(e) => handleHuntSelection(e.target.value)}
            value={selectedHunt?.id || ''}
          >
            <option value="total">Revenus Totaux</option>
            {recentHunts.map((hunt) => (
              <option key={hunt.id} value={hunt.id}>
                {hunt.title}
              </option>
            ))}
          </select>
        </div>


        <div className="mb-4">
          <label htmlFor="interval-select" className="mb-2 block text-sm font-medium">
            Sélectionnez un intervalle :
          </label>
          <select
            id="interval-select"
            className="block w-full rounded border p-2"
            value={selectedInterval}
            onChange={(e) => {
              setSelectedInterval(Number(e.target.value));
              fetchData(); // Recharger les données lorsque l'intervalle change
            }}
          >
            {intervalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        </div>
        {/* Revenue Chart */}
        {selectedHunt && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Revenus journaliers : {selectedHunt.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedHunt.dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenus"
                      stroke="#28a745"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Hunts */}
        <Card>
          <CardHeader>
            <CardTitle>Chasses Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Nom de la Chasse
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Note Moyenne</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Nombre d&apos;Avis
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Taux de Réussite
                  </th>
                </tr>
                </thead>
                <tbody>
                {recentHunts.map((hunt) => (
                  <tr
                    key={hunt.id}
                    className="cursor-pointer border-b hover:bg-gray-100"
                    onClick={() => handleHuntClick(hunt.id)}
                  >
                    <td className="h-12 px-4 align-middle">{hunt.title}</td>
                    <td className="h-12 px-4 align-middle">{hunt.averageRating.toFixed(1)}</td>
                    <td className="h-12 px-4 align-middle">{hunt.reviewCount}</td>
                    <td className="h-12 px-4 align-middle">{hunt.successRate}%</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Popup for Hunt Details */}
        {popupHunt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 rounded bg-white p-6 shadow-lg md:w-2/3 lg:w-1/2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">{popupHunt.title}</h2>
                <button
                  onClick={closePopup}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Note Moyenne:</strong> {popupHunt.averageRating.toFixed(1)}
                </p>
                <p>
                  <strong>Nombre d&apos;Avis:</strong> {popupHunt.reviewCount}
                </p>
                <p>
                  <strong>Taux de Réussite:</strong> {popupHunt.successRate}%
                </p>
                <p>
                  <strong>Taux de Complétion des Enigmes:</strong> {popupHunt.riddleCompletionRate}%
                </p>
                <p>
                  <strong>Indices Révélés:</strong> {popupHunt.cluesRevealed}
                </p>
              </div>
              <button
                onClick={closePopup}
                className="mt-6 w-full rounded bg-primary py-2 text-white hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
  }
