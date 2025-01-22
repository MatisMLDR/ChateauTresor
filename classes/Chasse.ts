import { ChasseType, ChateauType, EnigmeType, IndiceType, ProfilType, ImageFile, RecompenseType } from "@/types";
import { getAllParticipations, getChasseById, createChasse, deleteChasse, updateChasse, getAllChasses, isChasseAvailableForDay, getAllChassesDisponibles, getChassesByEquipeId, getAllChassesFinies, getClassementPointsOfChasse } from '@/utils/dao/ChasseUtils';
import { getAllRecompensesByChasse } from "@/utils/dao/RecompenseUtils";
import { getAllAvisByChasse } from "@/utils/dao/AvisUtils";
import { UUID } from "crypto";
import { getAllEnigmesByChasse } from "@/utils/dao/EnigmeUtils";
import Avis from "./Avis";
import { getProfilById } from "@/utils/dao/ProfilUtils";
import { addParticipation, getClassementChassesTerminees } from "@/utils/dao/ParticipantUtils";
import Chateau from "./Chateau";
import { Enigme } from "./Enigme";

class Chasse {
  private id_chasse: UUID;
  private titre: string;
  private capacite: number;
  private description: string;
  private age_requis: number;
  private image: ImageFile;
  private date_creation: string;
  private date_modification: string;
  private date_debut: string | null;
  private date_fin: string | null;
  private horaire_debut: string | null;
  private horaire_fin: string | null;
  private prix: number;
  private difficulte: number;
  private duree_estime: string;
  private theme: string;
  private statut: string;
  private id_chateau: UUID | null;
  private id_equipe: UUID | null;
  private chateau?: Chateau;


  private enigmes?: EnigmeType[];
  private indices?: IndiceType[];
  private recompenses?: RecompenseType[];

  constructor(chasse: ChasseType) {
    this.id_chasse = chasse.id_chasse as UUID;
    this.titre = chasse.titre ?? "Nouvelle Chasse";
    this.capacite = chasse.capacite ?? 0;
    this.description = chasse.description ?? "Pas de description";
    this.age_requis = chasse.age_requis ?? 0;
    this.image = chasse.image;
    this.date_creation = chasse.date_creation ?? new Date().toISOString();
    this.date_modification = chasse.date_modification ?? new Date().toISOString();
    this.date_debut = chasse.date_debut ?? null;
    this.date_fin = chasse.date_fin ?? null;
    this.horaire_debut = chasse.horaire_debut ?? null;
    this.horaire_fin = chasse.horaire_fin ?? null;
    this.prix = chasse.prix ?? 0.0;
    this.difficulte = chasse.difficulte ?? 1;
    this.duree_estime = chasse.duree_estime ?? "00:00:00";
    this.theme = chasse.theme ?? "Aucun thème";
    this.statut = chasse.statut ?? "Inactif";
    this.id_chateau = chasse.id_chateau ?? null;
    this.id_equipe = chasse.id_equipe ?? null;
  }

  // Getters

  public getIdChasse(): UUID {
    return this.id_chasse;
  }
  public getImage(): ImageFile {
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
  public getHoraireDebut(): string | null {
    return this.horaire_debut;
  }
  public getHoraireFin(): string | null {
    return this.horaire_fin;
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
  public getIdChateau(): UUID | null {
    return this.id_chateau;
  }
  public getIdEquipe(): UUID | null {
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
  public getIndices(): IndiceType[] {
    return this.indices ?? [];
  }
  public getRecompenses(): RecompenseType[] {
    return this.recompenses ?? [];
  }
  public getEnigmes(): EnigmeType[] {
    return this.enigmes ?? [];
  }
  public getChateau(): Chateau | undefined {
    return this.chateau;
  }


  // Setters
  public setImage(image: ImageFile): void {
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
  public setHoraireDebut(horaire_debut: string): void {
    this.horaire_debut = horaire_debut;
  }
  public setHoraireFin(horaire_fin: string): void {
    this.horaire_fin = horaire_fin;
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
  public setIdChateau(id_chateau: UUID): void {
    this.id_chateau = id_chateau;
  }
  public setIdEquipe(id_equipe: UUID): void {
    this.id_equipe = id_equipe;
  }
  public setStatut(statut: string): void {
    this.statut = statut;
  }
  public setDateModification(date_modification: string): void {
    this.date_modification = date_modification;
  }
  public setIdChasse(id_chasse: UUID): void {
    this.id_chasse = id_chasse;
  }
  public setDateCreation(date_creation: string): void {
    this.date_creation = date_creation;
  }
  public setEnigmes(enigmes: EnigmeType[]): void {
    this.enigmes = enigmes;
  }
  public setIndices(indices: IndiceType[]): void {
    this.indices = indices;
  }
  public setRecompenses(recompenses: RecompenseType[]): void {
    this.recompenses = recompenses;
  }
  public setChateau(chateau: Chateau): void {
    this.chateau = chateau;
  }

  public toObject(): ChasseType {
    return {
      id_chasse: this.id_chasse,
      titre: this.titre,
      capacite: this.capacite,
      description: this.description,
      age_requis: this.age_requis,
      image: this.image,
      date_creation: this.date_creation,
      date_modification: this.date_modification,
      date_debut: this.date_debut,
      date_fin: this.date_fin,
      horaire_debut: this.horaire_debut!,
      horaire_fin: this.horaire_fin!,
      prix: this.prix,
      difficulte: this.difficulte,
      duree_estime: this.duree_estime,
      theme: this.theme,
      statut: this.statut,
      id_chateau: this.id_chateau,
      id_equipe: this.id_equipe!,
    }
  }

  /* 
   * Méthode pour charger les données de l'objet indice dans la classe
    * @returns Promise<any> L'objet Chasse avec les données chargées à partir de l'id
   */
  public static async readId(id_chasse: UUID): Promise<Chasse> {

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

  public async loadChateau(): Promise<void> {
    if (this.id_chateau) {
      const chateau= await Chateau.readId(this.id_chateau);
      this.chateau = chateau;}
  }
  
  public async loadEnigmes(): Promise<void> {
    try {
      const enigmesData = await getAllEnigmesByChasse(this.id_chasse);
      this.enigmes = await Promise.all(
        enigmesData.map(async (enigmeData: EnigmeType) => {
          const enigme = new Enigme(enigmeData); // Utilisez la classe Enigme ici
          await enigme.loadIndices(); // Charge les indices pour chaque énigme
          return enigme;
        })
      );
      console.log('Énigmes et leurs indices chargés:', this.enigmes);
    } catch (error) {
      console.error('Erreur lors du chargement des énigmes:', error);
    }
  }
  
  public async loadRecompenses(): Promise<void> {
    const recompenses = await getAllRecompensesByChasse(this.id_chasse);
    this.recompenses = recompenses;
  }

  public async getAllEnigmes(): Promise<Enigme[]> {
    // Récupération dans la base des énigmes de chaques participations avec l'id de la chasse

    // On récupère les données
    const enigmesData = await getAllEnigmesByChasse(this.id_chasse);

    const enigmes = enigmesData.map((enigmesData: EnigmeType)=> new Enigme(enigmesData)) ;

    return enigmes;
  }

  public static async getChassesByEquipeId(id_equipe: UUID): Promise<Chasse[]> {
    try {
      // Appel de la méthode du DAO pour récupérer les chasses par id_equipe
      const chassesData = await getChassesByEquipeId(id_equipe);
  
      // Convertir les données en instances de la classe Chasse
      const chasses = chassesData.map((chasseData: ChasseType) => new Chasse(chasseData));
  
      return chasses;
    } catch (error) {
      console.error('Erreur lors de la récupération des chasses par équipe :', error);
      throw new Error('Erreur lors de la récupération des chasses par équipe');
    }
  }

  public async create(): Promise<any> {
    const avis = await createChasse(this) as any

    if (!avis) {
      throw new Error('Chasse not created');
    }
  }

  public static async getAllChasses(): Promise<Chasse[]> {
    // On récupère les données
    const chassesData = await getAllChasses();

    const chasses = chassesData.map((enigmesData: EnigmeType)=> new Enigme(enigmesData)) ;

    return chasses;
  }

  /*
  * Méthode pour récupérer le nombre de participants à une chasse
  * @returns number Le nombre de participants
  * @throws Error si la récupération échoue
  * @example const nbParticipants = await getNbParticipants();
  */
  public async getNbParticipants(): Promise<number> {
    // Récupération dans la base du nombre de participants avec l'id de la chasse

    // On récupère les données
    const data = await getAllParticipations(this.id_chasse);
    return data.length;
  }

  public async deleteId(id_chasse: UUID): Promise<void> {
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

  // Méthodes pour vérifier si une chasse est familiale
  /*
  * Méthode pour vérifier si une chasse est familiale (pour les enfants)
  * @returns boolean true si la chasse est familiale, false sinon
  */
  public isFamilyFriendly(): boolean {
    return this.age_requis <= 16;
  }

  /*
   * Méthode pour vérifier si une chasse est disponible
    * @returns boolean true si la chasse est disponible, false sinon
    */
  public isAvailable(): boolean {
    return this.isStarted() && !this.isFinished();
  }

  /**
   * Determines if the current instance is finished based on the `date_fin` property.
   *
   * @returns {boolean} - Returns `true` if the current date and time is later than `date_fin`, otherwise `false`.
   */
  public isFinished(): boolean {
    const now = new Date();
    const dateFin = new Date(this.date_fin as string);

    return now >= dateFin;
  }

  public isStarted(): boolean {
    const now = new Date();
    const dateDebut = new Date(this.date_debut as string);

    return now >= dateDebut;
  }

  /*
  * Méthode pour vérifier si une chasse est pleine
  * @returns boolean true si la chasse est pleine, false sinon
  */
  public async isFull(): Promise<boolean> {
    return await this.getNbParticipants() >= this.capacite;
  }

  public async isAvailableForDay(day: Date): Promise<boolean> {
    const isAvailable = isChasseAvailableForDay(this.id_chasse, day);

    return isAvailable;
  }

  public static async getAllDisponibles(): Promise<any> {
    const chasses = await getAllChassesDisponibles();
    
    return chasses.map((chasse: any) => new Chasse(chasse));
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
    return (sum / data.length) * 100;
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
    return (sum / data.length) * 100;
  }

  /*
  * Méthode pour calculer le nombre moyen d'indices utilisés par les participants
  * @returns number Le nombre moyen d'indices utilisés
  */
    public async getIndicesMoyens(): Promise<number> {
  //  // Récupération dans la base des participations avec l'id de la chasse
    const data = await getAllParticipations(this.id_chasse);

    if (data.length === 0) {
      return 0;
    }

    // Calcul de la somme des indices utilisés
    const sum = data.reduce((acc: number, participation: any) => acc + (participation.nb_indices_utilises || 0), 0);

    // Calcul de la moyenne
    return sum / data.length;
  }

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
    // Récupération dans la base des avis avec l'id de la chasse
    const avis = await getAllAvisByChasse(this.id_chasse);
  
    if (avis.length === 0) {
      return 0; // Si aucun avis n'est trouvé, retourner 0
    }
  
    // Calcul de la somme des notes
    const sommeNotes = avis.reduce((acc: number, avis: any) => acc + avis.note, 0);
  
    // Calcul de la moyenne
    const moyenne = sommeNotes / avis.length;
  
    return moyenne;
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

  public async getAllAvis(): Promise<any> {
    // Récupération dans la base des avis avec l'id de la chasse
    const data = await getAllAvisByChasse(this.id_chasse);

    if (data.length === 0) {
      return [];
    }

    return data.map((avis: any) => new Avis(avis));
  }

  public async addParticipant(id_participant: UUID, jour: string): Promise<void> {
    
    const participation = {
      id_participant: id_participant,
      id_chasse: this.id_chasse,
      jour: jour,
    }

    await addParticipation(participation);
    
  }

  public async getScoreInitial(): Promise<number> {
    // Récupérer les énigmes de la chasse
    const enigmes = await this.getAllEnigmes();

    // Faire la somme du degré de difficulté de chaque énigme
    const scoreInitial = enigmes.reduce((acc: number, enigme: any) => acc + enigme.degre_difficulte, 0);

    // Multiplier par la difficulté de la chasse

    return scoreInitial * this.difficulte;
  }

  public static async getAllChassesFinies(): Promise<any> {
    const chasses = await getAllChassesFinies();

    if (chasses.length === 0) {
      return [];
    }
    
    return chasses.map((chasse: any) => new Chasse(chasse));
  }
  public async getClassementPoints(): Promise<any> {
    const data = await getClassementPointsOfChasse(this.id_chasse)

    return data;
    
  }

}

export default Chasse;