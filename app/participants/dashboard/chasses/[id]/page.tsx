import React from 'react';
import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';

import { InformationBadge } from "@/components/ui/information-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Chasse from '@/classes/Chasse';
import { UUID } from 'crypto';
import Loader from '@/components/global/loader';
import AddAvisForm from '@/components/participants/AddAvisForm';
import Chateau from '@/classes/Chateau';
import { convertTimeToMinutesAndHours } from '@/lib/utils';
import { Participant } from '@/classes/Participant';
import { createClient } from '@/utils/supabase/server';
import { Skeleton } from '@/components/ui/skeleton';
import { profile } from 'console';
import { Profil } from '@/classes/Profil';

export default async function ChassePage({ params }: { params: { id: UUID } }) {
    const { id } = await params;
    const chasse = await Chasse.readId(id);
    const note = await chasse.getNoteMoyenne();
    const avis = await chasse.getAllAvis();
    const chateau = await Chateau.readId(chasse.getIdChateau() as UUID);
    // fetch user data for id of participant
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()

    const participant = await Participant.readByIdUser(user?.id as UUID);

    if (!participant) {
        return <Loader />;
    }

    const chasseimage = String(chasse.getImage());

    // Vérifier que les dates ne sont pas null avant de les utiliser
    const dateDebut = chasse.getDateDebut();
    const dateFin = chasse.getDateFin();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className={'relative min-h-[30vh]'}>
                    <img src={chasseimage} alt="Chasse Image" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-4">{chasse.getTitre()}</h1>
                    <div className={"flex flex-wrap gap-2 mt-4 mb-4"}>
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
                    <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${star <= note ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                        <span className="ml-2">({note.toFixed(1)})</span>
                    </div>
                    <p className="mb-2 text-gray-700">{chasse.getDescription()}</p>

                    <p className="mb-2 flex items-center">
                        Lieu : <Link href={`/participants/dashboard/chateaux/${chasse.getIdChateau()}`} className="text-blue-600 hover:underline ml-1 flex justify-around items-center">
                            {chateau.getNom()} <ExternalLink className="w-4 h-4 ml-1" />
                        </Link>
                    </p>
                    <p className="mb-2">Durée estimée : {convertTimeToMinutesAndHours(chasse.getDureeEstime()).totalMinutes} minutes</p>
                    <p className="mb-2">Prix : {chasse.getPrix()}€</p>
                    <p className="mt-2 mb-4">
                        {dateDebut ? new Date(dateDebut).toLocaleDateString() : "Non spécifiée"} - {dateFin ? new Date(dateFin).toLocaleDateString() : "Non spécifiée"}
                    </p>
                    <Button className="mb-2 px-16">
                        <Link href={`/participants/dashboard/chasses/${id}/inscription`}>
                            Réserver
                        </Link>
                    </Button>
                    <Button className="mb-2 px-16 bg-gold text-gray-900 hover:bg-orange-200">
                        <Link href={`/participants/dashboard/chasses/${id}/classements`}>
                            Classement
                        </Link>
                    </Button>

                </div>

            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6">Laisser un avis</h2>
            <AddAvisForm chasseId={id} participantId={participant.getIdParticipant()} />

            <h2 className="text-2xl font-bold mt-12 mb-6">Avis des utilisateurs</h2>
            <div className="space-y-6">
                {avis
                    .sort((a: any, b: any) => {
                        if (new Date(a.getDateModification()) > new Date(b.getDateModification())) {
                            return -1;
                        }
                        return 1;
                    })
                    .map(async (avis: any) => {

                        const participant = await Participant.readId(avis.getIdParticipant() as UUID);
                        console.log("ID PARTICIPANT DANS MAP : ", participant);
                        const profile = await Profil.readId(participant.getIdUser());

                        if (!profile) {
                            return <Skeleton key={avis.getIdAvis()} className="h-10 w-full rounded-md"/>;
                        }

                        return (
                        <Card key={avis.getIdAvis()}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarFallback>{profile.getNom().charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{profile.getNom() + " " + profile.getPrenom()}</p>
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= avis.getNote() ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Publié le {new Date(avis.getDateModification()).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {avis.getTitre() && (
                                    <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                                        {avis.getTitre()}
                                    </h3>
                                )}
                                {avis.getDescription() && (
                                    <p className="mt-4 text-gray-700">{avis.getDescription()}</p>
                                )}
                            </CardContent>
                        </Card>
                    )})
                }
            </div>
        </div>
    );
}