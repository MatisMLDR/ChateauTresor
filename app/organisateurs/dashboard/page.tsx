"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Euro, Users, Trophy, Star } from "lucide-react";
import { formatEuro } from "@/lib/utils";
import { SideBarHuntCreator } from '@/components/ui/SideBarHuntCreator';


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
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalParticipants: 0,
    averageSuccess: 0,
    averageRating: 0,
  });

  const [recentHunts, setRecentHunts] = useState<HuntStats[]>([]);
  const [selectedHunt, setSelectedHunt] = useState<HuntStats | null>(null);
  const [popupHunt, setPopupHunt] = useState<HuntStats | null>(null);

// Possible implémentation de la récupération des données de la base de données Supabase
  //useEffect(() => {
    // Commented Supabase fetch implementation
    /*
    async function fetchDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: hunts } = await supabase
        .from('treasure_hunts')
        .select(`
          id,
          title,
          price,
          hunt_participations (
            riddles_solved,
            total_riddles,
            clues_revealed,
            completed_at
          ),
          hunt_reviews (
            rating
          )
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (!hunts) return;

      // Process fetched data
      // ...
    }
    */

    // Données de test temporares
    useEffect(() => {
      // Temporary test data
      const testHunts: HuntStats[] = [
        {
          id: "1",
          title: "Chasse au trésor 1",
          dailyRevenue: [
            { date: "2025-01-01", revenue: 100 },
            { date: "2025-01-02", revenue: 200 },
            { date: "2025-01-03", revenue: 150 },
          ],
          averageRating: 4.5,
          reviewCount: 10,
          successRate: 75,
          riddleCompletionRate: 85,
          cluesRevealed: 50,
        },
        {
          id: "2",
          title: "Chasse au trésor 2",
          dailyRevenue: [
            { date: "2025-01-01", revenue: 50 },
            { date: "2025-01-02", revenue: 80 },
            { date: "2025-01-03", revenue: 100 },
          ],
          averageRating: 4.0,
          reviewCount: 8,
          successRate: 60,
          riddleCompletionRate: 70,
          cluesRevealed: 30,
        },
        {
          id: "3",
          title: "Chasse au trésor 3",
          dailyRevenue: [
            { date: "2025-01-01", revenue: 30 },
            { date: "2025-01-02", revenue: 70 },
            { date: "2025-01-03", revenue: 90 },
          ],
          averageRating: 3.8,
          reviewCount: 5,
          successRate: 40,
          riddleCompletionRate: 55,
          cluesRevealed: 20,
        },
      ];

      const totalRevenue = testHunts.reduce(
        (sum, hunt) => sum + hunt.dailyRevenue.reduce((revSum, day) => revSum + day.revenue, 0),
        0
      );
      const totalParticipants = 50; // Example participants
      const averageSuccess = testHunts.reduce((sum, hunt) => sum + hunt.successRate, 0) / testHunts.length;
      const averageRating = testHunts.reduce((sum, hunt) => sum + hunt.averageRating, 0) / testHunts.length;

      // Set temporary test stats
    setStats({
      totalRevenue,
      totalParticipants,
      averageSuccess,
      averageRating,
    });

    setRecentHunts(testHunts);
      setSelectedHunt(testHunts[0]); // Default selection
    }, []);

  const handleHuntSelection = (huntId: string) => {
    const hunt = recentHunts.find(h => h.id === huntId);
    if (hunt) {
      setSelectedHunt(hunt);
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
      <SideBarHuntCreator />

      {/* Contenu de la page */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de Bord</h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Select Hunt Dropdown */}
        <div className="mb-4">
          <label htmlFor="hunt-select" className="block text-sm font-medium mb-2">
            Sélectionnez une chasse pour voir ses revenus journaliers :
          </label>
          <select
            id="hunt-select"
            className="block w-full p-2 border rounded"
            onChange={(e) => handleHuntSelection(e.target.value)}
            value={selectedHunt?.id || ""}
          >
            {recentHunts.map((hunt) => (
              <option key={hunt.id} value={hunt.id}>
                {hunt.title}
              </option>
            ))}
          </select>
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
                  <th className="h-12 px-4 text-left align-middle font-medium">Nom de la Chasse</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Note Moyenne</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Nombre d&apos;Avis</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Taux de Réussite</th>
                </tr>
                </thead>
                <tbody>
                {recentHunts.map((hunt) => (
                  <tr
                    key={hunt.id}
                    className="border-b cursor-pointer hover:bg-gray-100"
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/2">
              <div className="flex justify-between items-center mb-4">
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
                className="mt-6 w-full bg-primary text-white py-2 rounded hover:bg-blue-700"
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
