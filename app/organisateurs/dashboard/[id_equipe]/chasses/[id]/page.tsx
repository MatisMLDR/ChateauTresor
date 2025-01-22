// app/organisateurs/dashboard/[id_equipe]/chasses/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { ExternalLink, Star, Pencil, QrCode } from 'lucide-react'; // Ajoutez l'icône QrCode

import { InformationBadge } from "@/components/ui/information-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Chasse from '@/classes/Chasse';
import Loader from '@/components/global/loader';
import { UUID } from 'crypto';
import { DeleteChasseButton } from '@/components/organisateurs/deleteChasse'; // Importez le Client Component
import Chateau from '@/classes/Chateau';

export default async function OrganisateurChassePage({ params }: { params: { id_equipe: UUID; id: UUID } }) {
  // Récupérer les paramètres dynamiques
  const { id_equipe, id } = params;

  // Utiliser l'ID pour récupérer les données de la chasse
  const chasse = await Chasse.readId(id);
  const note = await chasse.getNoteMoyenne();
  const avis = await chasse.getAllAvis();
  const nbParticipants = await chasse.getNbParticipants();
  const reussiteMoyenne = await chasse.getReussiteMoyenne();
  const dureeMoyenne = await chasse.getDureeMoyenne();
  const chateau = await Chateau.readId(chasse.getIdChateau()!);

  if (!chasse || !chateau) {
    return <Loader />;
  }

  const chasseimage = String(chasse.getImage())



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className={"relative min-h-[30vh]"}>
          <img src={chasseimage} alt="Chasse Image" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{chasse.getTitre()}</h1>
            {chasse.getIdEquipe() === params.id_equipe && (
              <div className="flex items-center space-x-2">
              {/* Bouton de modification de la chasse */}
              <Link href={`/organisateurs/dashboard/${id_equipe}/modifier_chasse/${chasse.getIdChasse()}`}>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>

              {/* Bouton de suppression de la chasse */}
              <DeleteChasseButton chasseId={chasse.getIdChasse()} />

              {/* Bouton pour accéder aux QR codes */}
              <Link href={`/organisateurs/dashboard/${id_equipe}/chasses/${chasse.getIdChasse()}/qrcodes`}>
                <Button variant="ghost" size="icon">
                  <QrCode className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            )}
          </div>
          <p className="mb-4 text-gray-700">{chasse.getDescription()}</p>
          <p className="mb-2 flex items-center">
            Lieu : <Link href={`/organisateurs/chateaux/${chasse.getIdChateau()}`} className="text-blue-600 hover:underline ml-1 flex justify-around items-center">
              {chateau.getLocalisation()} <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </p>
          <p className="mb-2">Durée estimée : {chasse.getDureeEstime()} minutes</p>
          <p className="mb-2">Prix : {chasse.getPrix()}€</p>
          <div className="flex items-center mb-2">
            <span className="mr-2">Note moyenne :</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= note ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-2">({note.toFixed(1)})</span>
          </div>
          <div className={"flex flex-wrap gap-2"}>
            <InformationBadge hoverText={`Adapté aux joueurs ${chasse.getDifficulte() === 1 ? "débutants" : chasse.getDifficulte() === 2 ? "occasionnels" : "experimentés"}`} buttonClassName={`text-secondary bg-${chasse.getDifficulte() === 1 ? "green" :
              chasse.getDifficulte() === 2 ? "orange" : "red"}-500 hover:bg-${chasse.getDifficulte() === 1 ? "green" :
              chasse.getDifficulte() === 2 ? "orange" : "red"}-700`}>
              {chasse.getDifficulte() === 1 ? "Facile" : chasse.getDifficulte() === 2 ? "Moyen" : "Difficile"}
            </InformationBadge>
            {chasse.isFamilyFriendly() &&
              <InformationBadge hoverText={"Adapté pour les enfants de moins de 16 ans"}>Familial</InformationBadge>
            }
            <InformationBadge hoverText={`Thème de la chasse`}>{chasse.getTheme()}</InformationBadge>
          </div>
          <p className="mt-2">
            Date : {chasse.getDateDebut() ? new Date(chasse.getDateDebut() as string).toLocaleDateString() : 'N/A'} - {chasse.getDateFin() ? new Date(chasse.getDateFin() as string).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Statistiques de la chasse */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Statistiques de la chasse</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-semibold">Nombre de participants</p>
            <p className="text-2xl">{nbParticipants}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-semibold">Taux de réussite moyen</p>
            <p className="text-2xl">{reussiteMoyenne.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-semibold">Durée moyenne</p>
            <p className="text-2xl">{dureeMoyenne.toFixed(1)} minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Avis des utilisateurs */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Avis des utilisateurs</h2>
      <div className="space-y-6">
        {avis
          .sort((a: any, b: any) => {
            if (new Date(a.getDateModification()) > new Date(b.getDateModification())) {
              return -1;
            }
            return 1;
          })
          .map((avis: any) => (
            <Card key={avis.getIdAvis()}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{avis.getIdParticipant().charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{avis.getIdParticipant()}</p>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 w-4 ${star <= avis.getNote() ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        Publié le {new Date(avis.getDateModification()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                {avis.getDescription() && (
                  <p className="mt-4 text-gray-700">{avis.getDescription()}</p>
                )}
              </CardContent>
            </Card>
          ))
        }
      </div>
    </div>
  );
}