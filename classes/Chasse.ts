import { ChasseType } from "@/types";
import { getAllParticipations, getAllRecompenses, getAllAvis } from "@/utils/dao/ChasseUtils";

class Chasse {
  private id_chasse: number;
  private image: string;
  private titre: string;
  private description: string;
  private difficulte: number;
  private prix: number;
  private date_debut: string;
  private date_fin: string;
  private capacite: number;
  private age_requis: number;
  private duree_estime: number;
  private theme: string;
  private id_chateau: number;
  private id_equipe: number;
  private statut: string;
  private date_modification: string;

  constructor(chasse: ChasseType) {
    this.id_chasse = chasse.id_chasse;
    this.image = chasse.image;
    this.titre = chasse.titre;
    this.description = chasse.description;
    this.difficulte = chasse.difficulte;
    this.prix = chasse.prix;
    this.date_debut = chasse.date_debut;
    this.date_fin = chasse.date_fin;
    this.capacite = chasse.capacite;
    this.age_requis = chasse.age_requis;
    this.duree_estime = chasse.duree_estime;
    this.theme = chasse.theme;
    this.id_chateau = chasse.id_chateau;
    this.id_equipe = chasse.id_equipe;
    this.statut = chasse.statut;
    this.date_modification = chasse.date_modification;
  }

  // Getters

  public getIdChasse(): number {
    return this.id_chasse;
  }
  public getImage(): string {
    return this.image;
  }
  public getTitre(): string {
    return this.titre;
  }
  public getDescription(): string {
    return this.description;
  }
  public getDifficulte(): number {
    return this.difficulte;
  }
  public getPrix(): number {
    return this.prix;
  }
  public getDateDebut(): string {
    return this.date_debut;
  }
  public getDateFin(): string {
    return this.date_fin;
  }
  public getCapacite(): number {
    return this.capacite;
  }
  public getAgeRequis(): number {
    return this.age_requis;
  }
  public getDureeEstime(): number {
    return this.duree_estime;
  }
  public getTheme(): string {
    return this.theme;
  }
  public getIdChateau(): number {
    return this.id_chateau;
  }
  public getIdEquipe(): number {
    return this.id_equipe;
  }
  public getStatut(): string {
    return this.statut;
  }
  public getDateModification(): string {
    return this.date_modification;
  }

  // Setters
  public setImage(image: string): void {
    this.image = image;
  }
  public setTitre(titre: string): void {
    this.titre = titre;
  }
  public setDescription(description: string): void {
    this.description = description;
  }
  public setDifficulte(difficulte: number): void {
    this.difficulte = difficulte;
  }
  public setPrix(prix: number): void {
    this.prix = prix;
  }
  public setDateDebut(date_debut: string): void {
    this.date_debut = date_debut;
  }
  public setDateFin(date_fin: string): void {
    this.date_fin = date_fin;
  }
  public setCapacite(capacite: number): void {
    this.capacite = capacite;
  }
  public setAgeRequis(age_requis: number): void {
    this.age_requis = age_requis;
  }
  public setDureeEstime(duree_estime: number): void {
    this.duree_estime = duree_estime;
  }
  public setTheme(theme: string): void {
    this.theme = theme;
  }
  public setIdChateau(id_chateau: number): void {
    this.id_chateau = id_chateau;
  }
  public setIdEquipe(id_equipe: number): void {
    this.id_equipe = id_equipe;
  }
  public setStatut(statut: string): void {
    this.statut = statut;
  }
  public setDateModification(date_modification: string): void {
    this.date_modification = date_modification;
  }

  /* 
   * Méthode pour charger les données de l'objet indice dans la classe
   */
  public read(): void {
    /* A compléter */
  }

  // Méthodes pour calculer des statistiques
  /*
  * Méthode pour calculer la durée moyenne des participations à une chasse
  * @returns number La durée moyenne des participations
  */
  public async getDureeMoyenne(): Promise<number> {

    // On récupère les données
    const data = await getAllParticipations(this.id_chasse);
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
  public async getReussiteMoyenne(): Promise<number> {
    // Récupération dans la base de la réussite de chaques participations avec l'id de la chasse

    // On récupère les données
    const data = await getAllParticipations(this.id_chasse);

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
  public async getScoreMoyen(): Promise<number> {
    // Récupération dans la base des scores de chaques participations avec l'id de la chasse

    // On récupère les données
    const data = await getAllParticipations(this.id_chasse);
    if (data.length === 0) {
      return 0;
    }
    // On calcule la somme des scores
    const sum = data.reduce((acc: number, participation: any) => acc + participation.score, 0);
    // On retourne la moyenne
    return sum / data.length;
  }

  /*
  * Méthode pour calculer le nombre moyen d'indices utilisés par les participants
  * @returns number Le nombre moyen d'indices utilisés
  */
  // public async getIndicesMoyens(): Promise<number> {
  //   // Récupération dans la base des indices utilisés par chaques participations avec l'id de la chasse

  //   // On récupère les données
  //   const data = await getAllIndices();
  //   if (data.length === 0) {
  //     return 0;
  //   }


  //   return 0;
  // }

  /*
  * Méthode pour calculer le nombre moyen d'énigmes résolues par les participants
  * @returns number Le nombre moyen d'énigmes résolues
  */
  public async getEnigmesResoluesMoyennes(): Promise<number> {
    // Récupération dans la base des énigmes résolues par chaques participations avec l'id de la chasse

    // On récupère les données
    const data = await getAllParticipations(this.id_chasse);
    if (data.length === 0) {
      return 0;
    }
    // On calcule la somme des énigmes résolues
    const sum = data.reduce((acc: number, participation: any) => acc + participation.nb_enigmes_resolues, 0);
    // On retourne la moyenne
    return sum / data.length;
  }

  /*
  * Méthode pour calculer le nombre de récompenses attribuées aux participants
  * @returns number Le nombre de récompenses attribuées
  */

  public async getNbRecompensesAttribuees(): Promise<number> {
    // Récupération dans la base des récompenses attribuées avec l'id de la chasse

    // On récupère les données
    const data = await getAllRecompenses(this.id_chasse);
    return data.length;
  }

  /*
  * Méthode pour calculer la note moyenne des participants
  * @returns number La note moyenne des participants
  */
  public async getNoteMoyenne(): Promise<number> {
    // Récupération dans la base des notes attribuées de chaques avis avec l'id de la chasse

    // On récupère les données
    const data = await getAllAvis(this.id_chasse);

    if (data.length === 0) {
      return 0;
    }
    // On calcule la somme des notes
    const sum = data.reduce((acc: number, avis: any) => acc + avis.note, 0);
    // On retourne la moyenne
    return sum / data.length;
  }

  /*
  * Méthode pour calculer le nombre d'avis d'une chasse
  * @returns number Le nombre d'avis
  */
  public async getNbAvis(): Promise<number> {
    // Récupération dans la base des avis avec l'id de la chasse
    const data = await getAllAvis(this.id_chasse);
    return data.length;
  }

}

export default Chasse;