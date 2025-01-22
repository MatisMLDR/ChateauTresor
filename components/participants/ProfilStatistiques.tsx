import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InformationBadge } from "@/components/ui/information-badge";
import { Separator } from "@radix-ui/react-separator";
import { CheckCircle2, Trophy, Clock, Puzzle, ScrollText, MapPin, Calendar, PenBox, Plus } from "lucide-react";
import Link from "next/link";

export default function ProfilStatistiques({ participantData }: { participantData: any }) {
  const badgesData = [
    { id: 1, text: "Champion", hoverText: "Être le 1er à avoir fini une chasse" },
    { id: 2, text: "Speedy Gonzales", hoverText: "Etre le gagnant le plus rapide" },
    { id: 3, text: "Inspecteur Gadget", hoverText: "Avoir fini une chasse sans utiliser d'indice" },
  ];

  // Formatage de la date de naissance
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Profil */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0 md:items-start w-full">
          <div className="flex items-center gap-6 flex-wrap">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-xl">
                {participantData.prenom?.[0]}{participantData.nom?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{participantData.nom} {participantData.prenom}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{participantData.ville}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Né(e) le {formatDate(participantData.dateNaissance)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-4 md:mt-2">
            <Link href={`/participants/dashboard/profil/${participantData.idUser}/parametres`}>
              <PenBox className="h-6 w-6" />
            </Link> 
            <Link href="/participants/dashboard/classements">
              <Trophy className="h-6 w-6" />
            </Link> 
            <Link href="/participants/dashboard/chasses">
              <Plus className="h-6 w-6" />
            </Link> 
          </div>
        </div>
        <Separator orientation="horizontal" className="text-gray-400 bg-gray-200 w-full h-[1px]" />
        {/* Badges */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold">
            Haut fait
          </h3>
          <div className="flex flex-wrap gap-2">
            {badgesData.map((badge) => (
              <InformationBadge key={badge.id} hoverText={badge.hoverText}>
                {badge.text}
              </InformationBadge>
            ))}
          </div>

        </div>
        <Separator orientation="horizontal" className="text-gray-400 bg-gray-200 w-full h-[1px]" />

        {/* Statistiques principales */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Puzzle className="h-5 w-5" />
                Énigmes résolues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{participantData.nbEnigmesResolues}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Meilleur score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{participantData.meilleurScore}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-5 w-5" />
                Temps moyen/enigme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {participantData.tempsMoyenResolutionEnigme} min
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section détaillée */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Statistiques avancées */}
          <Card>
            <CardHeader>
              <CardTitle>Détails des performances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Chasses terminées</span>
                <span className="font-semibold">{participantData.nbChassesTerminees}</span>
              </div>
              <div className="flex justify-between">
                <span>Indices utilisés (moyenne)</span>
                <span className="font-semibold">{participantData.nbIndicesRevelesMoyen}</span>
              </div>
              <div className="flex justify-between">
                <span>Taux de réussite moyen</span>
                <span className="font-semibold">
                  {Math.round(participantData.reussiteMoyenneChasse)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Historique des chasses */}
          <Card>
            <CardHeader>
              <CardTitle>Dernières chasses</CardTitle>
              <CardDescription>{participantData.allChasses?.length} participations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participantData.allChasses?.map((chasse: any) => (
                  <div key={chasse.id_chasse} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`h-5 w-5 ${chasse.status === "Terminée" ? "text-green-500" : "text-gray-300"
                        }`} />
                      <span>{chasse.titre}</span>
                    </div>
                    <span className={`text-sm ${chasse.status === "Terminée" ? "text-green-500" : "text-muted-foreground"
                      }`}>
                      {chasse.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}