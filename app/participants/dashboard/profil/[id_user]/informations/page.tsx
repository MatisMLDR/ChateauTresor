import { Participant } from '@/classes/Participant';
import { Profil } from '@/classes/Profil';
import Loader from '@/components/global/loader';
import ProfilStatistiques from '@/components/participants/ProfilStatistiques';
import { UUID } from 'crypto';
import React from 'react'

const ProfilInformations = async ({ params }: { params: { id_user: string } }) => {

  const { id_user } = await params;
  const profile = await Profil.readId(id_user);
  const participant = await Participant.readByIdUser(id_user as UUID);
  let nbEnigmesResolues, meilleurScore, tempsMoyenParChasse, nbIndicesRevelesMoyen, tempsMoyenResolutionEnigme, nbChassesTerminees, reussiteMoyenneChasse, allChasses;
  try {
    nbEnigmesResolues = await participant.getNbEnigmesResolues()
  } catch (error) {
    nbEnigmesResolues = 0
  }

  try {
    meilleurScore = await participant.getBestScoreChasse();
  } catch (error) {
    meilleurScore = 0
  }

  try {
    tempsMoyenParChasse = await participant.getDureeMoyenneChasse();
  } catch (error) {
    tempsMoyenParChasse = 0;
  }

  try {
    nbIndicesRevelesMoyen = await participant.getIndicesMoyens();
  } catch (error) {
    nbIndicesRevelesMoyen = 0
  }

  try {
    tempsMoyenResolutionEnigme = await participant.getTempsMoyenResolutionEnigme()
  } catch (error) {
    tempsMoyenResolutionEnigme = 0
  }

  try {
    nbChassesTerminees = await participant.getNbChassesTerminees()
  } catch (error) {
    nbChassesTerminees = 0
  }
  try {
    reussiteMoyenneChasse = await participant.getReussiteMoyenneChasse()
  } catch {
    reussiteMoyenneChasse = 0
  }

  try {
    allChasses = await participant.getAllChasses()
  } catch (error) {
    allChasses = []
  }

  const participantData = {
    nbEnigmesResolues,
    meilleurScore,
    tempsMoyenParChasse,
    nbIndicesRevelesMoyen,
    tempsMoyenResolutionEnigme,
    nbChassesTerminees,
    reussiteMoyenneChasse,
    nom: profile.getNom(),
    prenom: profile.getPrenom(),
    email: profile.getEmail(),
    username: profile.getUsername(),
    dateNaissance: profile.getBirthday(),
    ville: profile.getVille(),
    allChasses,
    idUser: id_user
  }

  if (!profile || !participant) {
    return <Loader />;
  }

  return (
    <ProfilStatistiques participantData={participantData}/>
  )
}

export default ProfilInformations
