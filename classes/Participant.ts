import { ParticipantType } from "@/types";
import { getAllParticipantAvis, getAllParticipantChasses, getAllParticipantEnigmes, getAllParticipantIndice, getParticipantById, createParticipant, deleteParticipant, updateParticipant, getParticipantByUserId } from "@/utils/dao/ParticipantUtils";
import { UUID } from "crypto";

export class Participant {
  private id_participant: UUID;
  private id_user: UUID;


  constructor(participant: ParticipantType) {
    this.id_participant = participant.id_participant;
    this.id_user = participant.id_user;
  }

  // Getters
  public getIdParticipant(): UUID {
    return this.id_participant;
  }

  public getIdUser(): UUID {
    return this.id_user;
  }

  // Setters
  public setIdParticipant(id_participant: UUID): void {
    this.id_participant = id_participant;
  }

  public setIdUser(id_user: UUID): void {
    this.id_user = id_user;
  }

  public getParticipant(): ParticipantType {
    return {
      id_participant: this.id_participant,
      id_user: this.id_user,
    };
  }

  // Méthodes
  /* 
   * Méthode pour charger les données de l'objet participant dans la classe
   * @param id_user L'identifiant de l'utilisateur
   */
  public static async readId(id_participant: UUID): Promise<any> {
    const data = await getParticipantById(id_participant) as any;

    if (!data) {
      throw new Error("Le participant n'a pas été trouvé");
    }

    return new Participant(data);
  }

  public static async readByIdUser(id_user: UUID): Promise<Participant> {
    const data = await getParticipantByUserId(id_user) as any;

    if (!data) {
      throw new Error("Le participant n'a pas été trouvé");
    }

    return new Participant(data);
  }

  public async read(): Promise<any> {
    if (!this.id_participant) {
      throw new Error('Participant ID is required');
    }

    const avis = await getParticipantById(this.id_participant) as any

    if (!avis) {
      throw new Error('Participant not found');
    }

    return new Participant(avis);
  }

  public async load(): Promise<void> {
    if (!this.id_participant) {
      throw new Error('Participant ID is required');
    }

    const avis = await getParticipantById(this.id_participant) as any

    if (!avis) {
      throw new Error('Participant not found');
    }

    this.id_participant = avis.id_participant;
    this.id_user = avis.id_user;
  }

  public async create(): Promise<void> {
    const avis = await createParticipant(this) as any

    if (!avis) {
      throw new Error('Participant not created');
    }
  }

  public async deleteId(id_participant: UUID): Promise<void> {
    try {
      await deleteParticipant(id_participant);
    } catch (error) {
      throw new Error('Participant does not exist');
    }
  }

  public async delete(): Promise<void> {
    if (!this.id_participant) {
      console.log("Pas d'id Participant");
      throw new Error('id_participant is required');
    }
    try {
      await deleteParticipant(this.id_participant);
    } catch (error) {
      throw new Error('Participant does not exist');
    }
  }

  public async update(): Promise<void> {
    try {
      await updateParticipant(this);
    } catch (error) {
      throw new Error('Participant does not exist');
    }
  }

  /*
    * Méthode pour retourner toutes les chasses auxquelles le participant a participé
    * @returns any Les chasses auxquelles le participant a participé
    * @throws Error si la récupération des participations échoue
    */
  public async getAllChasses(): Promise<any> {
    const chasses = await getAllParticipantChasses(this.id_participant);

    return chasses;
  }

  // Méthodes pour calculer des statistiques 
  /*
    * Méthode pour calculer le meilleur score d'un participant à une chasse
    * @returns number Le meilleur score du participant à une chasse ou 0 si le participant n'a pas encore participé à une chasse
    */
  public async getBestScoreChasse(): Promise<number> {
    // On récupère les données
    const data = await getAllParticipantChasses(this.id_participant);
    if (data.length === 0) {
      return 0;
    }
    // On calcule le meilleur score
    return data.reduce((acc: number, participation: any) => Math.max(acc, participation.score), 0);
  }


  /*
    * Méthode pour calculer la durée moyenne des participations à une chasse
    * @returns number La durée moyenne des participations
    */
  public async getDureeMoyenneChasse(): Promise<number> {
    // On récupère les données
    const data = await getAllParticipantChasses(this.id_participant);
    if (data.length === 0) {
      return 0;
    }
    // On calcule la somme des durées
    const sum = data.reduce((acc: number, participation: any) => acc + participation.duree_totale, 0);
    // On retourne la moyenne
    return sum / data.length;
  }

  /*
    * Méthode pour calculer la reussite moyenne des participations à une chasse
    * @returns number La reussite moyenne des participations
    */
  public async getReussiteMoyenneChasse(): Promise<number> {
    // On récupère les données
    const data = await getAllParticipantChasses(this.id_participant);
    if (data.length === 0) {
      return 0;
    }
    // On calcule la somme des réussites
    const sum = data.reduce((acc: number, participation: any) => acc + participation.est_terminee, 0);
    // On retourne la moyenne
    return sum / data.length;
  }

  /*
    * Méthode pour calculer le score moyen des participations à une chasse
    * @returns number Le score moyen des participations
    */
  public async getScoreMoyenChasse(): Promise<number> {
    // On récupère les données
    const data = await getAllParticipantChasses(this.id_participant);
    if (data.length === 0) {
      return 0;
    }
    // On calcule la somme des scores
    const sum = data.reduce((acc: number, participation: any) => acc + participation.score, 0);
    // On retourne la moyenne
    return sum / data.length;
  }

  /*
    * Méthode pour calculer le nombre de participations total à des chasses
    * @returns number Le nombre de participations total à des chasses
    */
  public async getNbParticipationsChasse(): Promise<number> {
    // On récupère les données
    const data = await getAllParticipantChasses(this.id_participant);
    return data.length;
  }

  /*
    * Méthode pour calculer le nombre moyen d'indices utilisés par les participants
    * @returns number Le nombre moyen d'indices utilisés
    */
  public async getIndicesMoyens(): Promise<number> {
    // On récupère les données
    const data = await getAllParticipantIndice(this.id_participant);
    if (data.length === 0) {
      return 0;
    }
    // On calcule la somme des indices
    const sum = data.reduce((acc: number, participation: any) => acc + participation.est_decouvert, 0);
    // On retourne la moyenne
    return sum / data.length;
  }

  /*
   * Méthode pour calculer le temps moyen passé pour résoudre une énigme
    * @returns number Le temps moyen en secondes
    */
  public async getTempsMoyenResolutionEnigme(): Promise<number> {
    const data = await getAllParticipantEnigmes(this.id_participant);
    if (data.length === 0) {
      return 0;
    }

    const total = data.reduce((acc: number, curr: any) => acc + curr.duree, 0);
    return total / data.length;
  }

  /*
    * Méthode pour calculer le nombre d'énigmes résolues par les participants
    * @returns number Le nombre d'énigmes résolues
    */
  public async getNbEnigmesResolues(): Promise<number> {
    // On récupère les données
    const data = await getAllParticipantEnigmes(this.id_participant);
    return data.length;
  }

  /*
    * Méthode pour calculer le nombre de chasses terminées par les participants
    * @returns number Le nombre de chasses terminées
    */
  public async getNbChassesTerminees(): Promise<number> {
    const data = await getAllParticipantChasses(this.id_participant);
    return data.filter((chasse: any) => chasse.est_terminee).length;
  }

  /*
   * Méthode pour calculer le nombre d'avis donnés par les participants
    * @returns number Le nombre d'avis donnés
    */
  public async getNbAvisDonnes(): Promise<number> {
    const data = await getAllParticipantAvis(this.id_participant);
    return data.length;
  }

  /*
    * Méthode pour retourner les avis donnés par le participant
    * @returns any Les avis donnés par le participant
    * @throws Error si la récupération des avis échoue
    */
  public async getAllAvisDonnes(): Promise<any> {
    return await getAllParticipantAvis(this.id_participant);
  }

  /*
    * Méthode pour calculer la note moyenne donnée par les participants
    * @returns number La note moyenne donnée
    */
  public async getNoteMoyenneDonnee(): Promise<number> {
    const data = await getAllParticipantAvis(this.id_participant);
    if (data.length === 0) {
      return 0;
    }
    const sum = data.reduce((acc: number, avis: any) => acc + avis.note, 0);
    return sum / data.length;
  }

}