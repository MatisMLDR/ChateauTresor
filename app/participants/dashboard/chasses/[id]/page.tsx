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

export default async function ChassePage({ params }: { params: { id: UUID } }) {
    const chasse = await Chasse.readId(params.id);
    const note = await chasse.getNoteMoyenne();
    const avis = await chasse.getAllAvis();

    if (!chasse) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className={"relative min-h-[30vh]"}>
                    <img
                        src={chasse.getImage() || "/logo.svg"}
                        alt={chasse.getTitre()}
                        className="rounded-lg shadow-lg object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-4">{chasse.getTitre()}</h1>
                    <p className="mb-4 text-gray-700">{chasse.getDescription()}</p>
                    <p className="mb-2 flex items-center">
                        Lieu : <Link href={`/participants/dashboard/chateaux/${chasse.getIdChateau()}`} className="text-blue-600 hover:underline ml-1 flex justify-around items-center">
                        {chasse.getIdChateau()} <ExternalLink className="w-4 h-4 ml-1" />
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
                        Date : {new Date(chasse.getDateDebut()).toLocaleDateString()} - {new Date(chasse.getDateFin()).toLocaleDateString()}
                    </p>
                    <Button className="mt-4">
                        <Link href={`/participants/dashboard/chasses/${params.id}/inscription`}>
                            Réserver
                        </Link>
                    </Button>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6">Laisser un avis</h2>
            <AddAvisForm chasseId={params.id} />

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

