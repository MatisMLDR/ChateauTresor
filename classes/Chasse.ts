import { ChasseType } from "@/types";
import { getAllParticipations, getChasseById, createChasse, deleteChasse, updateChasse } from '@/utils/dao/ChasseUtils';
import { getAllRecompensesByChasse } from "@/utils/dao/RecompenseUtils";
import { getAllAvisByChasse } from "@/utils/dao/AvisUtils";

class Chasse {
  private id_chasse: number;
  private titre: string;
  private capacite: number;
  private description: string;
  private age_requis: number;
  private image: string | null;
  private date_creation: string;
  private date_modification: string;
  private date_debut: string | null;
  private date_fin: string | null;
  private prix: number;
  private difficulte: number;
  private duree_estime: string;
  private theme: string;
  private statut: string;
  private id_chateau: number | null;
  private id_equipe: number | null;

  constructor(chasse: ChasseType) {
    this.id_chasse = chasse.id_chasse ?? -1;
    this.titre = chasse.titre ?? "Nouvelle Chasse";
    this.capacite = chasse.capacite ?? 0;
    this.description = chasse.description ?? "Pas de description";
    this.age_requis = chasse.age_requis ?? 0;
    this.image = chasse.image ?? null;
    this.date_creation = chasse.date_creation ?? new Date().toISOString();
    this.date_modification = chasse.date_modification ?? new Date().toISOString();
    this.date_debut = chasse.date_debut ?? null;
    this.date_fin = chasse.date_fin ?? null;
    this.prix = chasse.prix ?? 0.0;
    this.difficulte = chasse.difficulte ?? 1;
    this.duree_estime = chasse.duree_estime ?? "00:00:00";
    this.theme = chasse.theme ?? "Aucun thème";
    this.statut = chasse.statut ?? "Inactif";
    this.id_chateau = chasse.id_chateau ?? null;
    this.id_equipe = chasse.id_equipe ?? null;
  }

  // Getters

  public getIdChasse(): number {
    return this.id_chasse;
  }
  public getImage(): string | null {
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
  public getDateDebut(): string | null {
    return this.date_debut;
  }
  public getDateFin(): string | null {
    return this.date_fin;
  }
  public getCapacite(): number {
    return this.capacite;
  }
  public getAgeRequis(): number {
    return this.age_requis;
  }
  public getDureeEstime(): string {
    return this.duree_estime;
  }
  public getTheme(): string {
    return this.theme;
  }
  public getIdChateau(): number | null {
    return this.id_chateau;
  }
  public getIdEquipe(): number | null {
    return this.id_equipe;
  }
  public getStatut(): string {
    return this.statut;
  }
  public getDateModification(): string {
    return this.date_modification;
  }
  public getDateCreation(): string {
    return this.date_creation;
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
  public setDureeEstime(duree_estime: string): void {
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
  public setIdChasse(id_chasse: number): void {
    this.id_chasse = id_chasse;
  }
  public setDateCreation(date_creation: string): void {
    this.date_creation = date_creation;
  }

  /* 
   * Méthode pour charger les données de l'objet indice dans la classe
    * @returns Promise<any> L'objet Chasse avec les données chargées à partir de l'id
   */
  public static async readId(id_chasse: number): Promise<any> {

      const data = await getChasseById(id_chasse) as any;

      if (!data) {
        throw new Error("La chasse n'existe pas");
      }
    
      return new Chasse(data);
  }

  public async read(): Promise<any> {
      if (!this.id_chasse) {
          throw new Error('Avis ID is required');
      }
  
      const avis = await getChasseById(this.id_chasse) as any
  
      if (!avis) {
          throw new Error('Chasse not found');
      }
  
      return new Chasse(avis);
    }
  
    public async load(): Promise<void> {
      if (!this.id_chasse) {
          throw new Error('Chasse ID is required');
      }
  
      const avis = await getChasseById(this.id_chasse) as any
  
      if (!avis) {
          throw new Error('Chasse not found');
      }
  
      this.id_chasse = avis.id_chasse;
      this.titre = avis.titre;
      this.capacite = avis.capacite;
      this.description = avis.description;
      this.age_requis = avis.age_requis;
      this.image = avis.image;
      this.date_creation = avis.date_creation;
      this.date_modification = avis.date_modification;
      this.date_debut = avis.date_debut;
      this.date_fin = avis.date_fin;
      this.prix = avis.prix;
      this.difficulte = avis.difficulte;
      this.duree_estime = avis.duree_estime;
      this.theme = avis.theme;
      this.statut = avis.statut;
      this.id_chateau = avis.id_chateau;
      this.id_equipe = avis.id_equipe;
    }
  
    public async create(): Promise<void> {
      const avis = await createChasse(this) as any
  
      if (!avis) {
          throw new Error('Chasse not created');
      }
    }
  
    public async deleteId(id_chasse: number): Promise<void> {
      try {
        await deleteChasse(id_chasse);
      } catch (error) {
          throw new Error('Chasse does not exist');
      }
    }
  
  public async delete(): Promise<void> {
    console.log("Delete : ChasseId : ", this.id_chasse);
      if (!this.id_chasse) {
        throw new Error('id_chasse is required');
      }
      try {
        await deleteChasse(this.id_chasse);
      } catch (error) {
          throw new Error('Chasse does not exist');
      }
    }
  
    public async update(): Promise<void> {
      try {
        await updateChasse(this);
      } catch (error) {
          throw new Error('Chasse does not exist');
      }
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
    return (sum / data.length)  * 100;
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
    const data = await getAllRecompensesByChasse(this.id_chasse);
    return data.length;
  }

  /*
  * Méthode pour calculer la note moyenne des participants
  * @returns number La note moyenne des participants
  */
  public async getNoteMoyenne(): Promise<number> {
    // Récupération dans la base des notes attribuées de chaques avis avec l'id de la chasse

    // On récupère les données
    const data = await getAllAvisByChasse(this.id_chasse);

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
    const data = await getAllAvisByChasse(this.id_chasse);
    return data.length;
  }

}

export default Chasse;