import { EnigmeType, IndiceType, ImageFile } from "@/types";
import { createEnigme, deleteEnigme, getAllEnigmesParticipants, getEnigmeById, updateEnigme } from "@/utils/dao/EnigmeUtils";
import { getAllIndicesParticipants } from "@/utils/dao/IndiceUtils";
import { UUID } from "crypto";
import { getAllIndicesByEnigme } from "@/utils/dao/IndiceUtils";
import Indice from '@/classes/Indice';

export class Enigme {
  private id_enigme: UUID;
  private id_chasse: UUID;
  private titre: string;
  private code_reponse: string;
  private ordre: number;
  private description: string;
  private endroit_qrcode: string;
  private temps_max: number;
  private description_reponse: string;
  private degre_difficulte: number;
  private image_reponse: ImageFile;
  private indices: IndiceType[] = [];

  constructor(enigme: EnigmeType) {
    this.id_enigme = enigme.id_enigme as UUID;
    this.id_chasse = enigme.id_chasse as UUID;
    this.titre = enigme.titre;
    this.code_reponse = enigme.code_reponse;
    this.ordre = enigme.ordre ?? 0;
    this.description = enigme.description;
    this.endroit_qrcode = enigme.endroit_qrcode;
    this.temps_max = enigme.temps_max;
    this.description_reponse = enigme.description_reponse;
    this.degre_difficulte = enigme.degre_difficulte;
    this.image_reponse = enigme.image_reponse;
    this.indices = enigme.indices || [];
  }

  // Getters
  public getId(): UUID {
    return this.id_enigme;
  }

  public getIdChasse(): UUID {
    return this.id_chasse;
  }

  public getTitre(): string {
    return this.titre;
  }

  public getCode_reponse(): string {
    return this.code_reponse;
  }

  public getOrdre(): number {
    return this.ordre;
  }

  public getDescription(): string {
    return this.description;
  }

  public getEndroitQrCode(): string {
    return this.endroit_qrcode;
  }

  public getTempsMax(): number {
    return this.temps_max;
  }

  public getDescriptionReponse(): string {
    return this.description_reponse;
  }

  public getDegreDifficulte(): number {
    return this.degre_difficulte;
  }

  public getImageReponse(): ImageFile {
    return this.image_reponse;
  }

  // Setters

  public setId(id: UUID): void {
    this.id_enigme = id;
  }

  public setIdChasse(id_chasse: UUID): void {
    this.id_chasse = id_chasse;
  }

  public setTitre(titre: string): void {
    this.titre = titre;
  }


  public setCode(code: string): void {
    this.code_reponse = code;
  }

  public setOrdre(ordre: number): void {
    this.ordre = ordre;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public setEndroitQrCode(endroit_qrcode: string): void {
    this.endroit_qrcode = endroit_qrcode;
  }

  public setTempsMax(temps_max: number): void {
    this.temps_max = temps_max;
  }

  public setDescriptionReponse(description_reponse: string): void {
    this.description_reponse = description_reponse;
  }

  public setDegreDifficulte(degre_difficulte: number): void {
    this.degre_difficulte = degre_difficulte;
  }

  public setImageReponse(image_reponse: ImageFile): void {
    this.image_reponse = image_reponse;
  }

  /* 
   * Méthode pour charger les données de l'objet énigme dans la classe
    * @param id_chasse L'identifiant de la chasse
    * @throws Error si l'énigme n'existe pas ou si plusieurs énigmes sont trouvés
   */
  public static async readId(id: UUID): Promise<any> {
    
    const data = await getEnigmeById(id) as any;
    
    if (!data) {
      throw new Error("L'énigme n'existe pas");
    }
    console.log("Enigme après appel API dans read", data); 
    
    return new Enigme(data);
  }

  /* 
   * Méthode pour charger les données de l'objet énigme dans la classe
    * @param id_chasse L'identifiant de la chasse
    * @throws Error si l'énigme n'existe pas ou si plusieurs énigmes sont trouvés
   */
  public async read(): Promise<any> {
        if (!this.id_enigme) {
            throw new Error('Enigme ID is required');
        }
    
        const avis = await getEnigmeById(this.id_enigme) as any
    
        if (!avis) {
            throw new Error('Enigme not found');
        }
    
        return new Enigme(avis);
      }
    
      public async load(): Promise<void> {
        if (!this.id_enigme) {
            throw new Error('Enigme ID is required');
        }
    
        const avis = await getEnigmeById(this.id_enigme) as any
    
        if (!avis) {
            throw new Error('Enigme not found');
        }
    
        this.id_enigme = avis.id;
        this.titre = avis.titre;
        this.code_reponse = avis.code;
        this.description = avis.description;
        this.endroit_qrcode = avis.endroit_qrcode;
        this.temps_max = avis.temps_max;
        this.description_reponse = avis.description_reponse;
        this.image_reponse = avis.image_reponse;
      }
    
      public async create(): Promise<void> {
        // Exclure la propriété 'indices' avant l'insertion
        const { indices, ...dataSansIndices } = this;
        const avis = await createEnigme(dataSansIndices) as any;
      
        if (!avis) {
          throw new Error('Enigme not created');
        }
      }
    
      public async deleteId(id_enigme: UUID): Promise<void> {
        try {
          await deleteEnigme(id_enigme);
        } catch (error) {
            throw new Error('Chasse does not exist');
        }
      }
    
      public async delete(): Promise<void> {
        if (!this.id_enigme) {
          console.log("Pas d'id Enigme");
          throw new Error('id is required');
        }
        try {
          await deleteEnigme(this.id_enigme);
        } catch (error) {
            throw new Error('Enigme does not exist');
        }
      }
    
      public async update(): Promise<void> {
        // Exclure 'indices' lors de la mise à jour
        const { indices, ...dataSansIndices } = this;
        try {
          await updateEnigme(dataSansIndices);
        } catch (error) {
          throw new Error('Enigme does not exist');
        }
      }

    /**
     * Méthode pour charger les indices associés à cette énigme
     */
    public async loadIndices(): Promise<void> {
      try {
        const indicesData = await getAllIndicesByEnigme(this.id_enigme);
        this.indices = indicesData.map((indice: IndiceType) => ({ ...indice }));
        console.log(`Indices chargés pour l'énigme ${this.id_enigme}:`, this.indices);
      } catch (error) {
        console.error(`Erreur lors du chargement des indices pour l'énigme ${this.id_enigme}:`, error);
        throw new Error('Erreur lors du chargement des indices');
      }
    }

  // Calculs
  /*
  * Méthode pour calculer le temps moyen passé pour résoudre une énigme
  * @returns number Le temps moyen en secondes
  */
  public async getTempsMoyen(): Promise<number> {
    const data = await getAllEnigmesParticipants(this.id_enigme);
    if (data.length === 0) {
      return 0;
    }
    const total = data.reduce((acc: number, curr: any) => acc + curr.duree, 0);
    return total / data.length;
  }

  /* 
   * Méthode pour calculer la réussite moyenne d'une énigme
   * @returns number La réussite moyenne d'une enigme en pourcentage
   */
  public async getReussiteMoyenne(): Promise<number> {
    // Récupération dans la base de la réussite de chaques participations avec l'id de la chasse

    // On récupère les données
    const data = await getAllEnigmesParticipants(this.id_enigme);

    if (data.length === 0) {
      return 0;
    }
    // On calcule la somme des réussites
    const sum = data.reduce((acc: number, participation: any) => acc + participation.est_resolue, 0);
    // On retourne la moyenne
    return (sum / data.length) * 100;
  }

  /* 
   * Méthode pour calculer le nombre de fois qu'un indice a été révélé
   * @returns number Le nombre de fois qu'un indice a été révélé
   */
  public async getNbIndiceRevele(): Promise<number> {
    const data = await getAllIndicesParticipants(this.id_enigme);
    if (data.length === 0) {
      return 0;
    }
    return data.reduce((acc: number, curr: any) => acc + curr.est_decouvert, 0);
  }

  /**
   * Méthode pour récupérer tous les indices d'une énigme
   */
  public async getAllIndices(): Promise<Indice[]> {
    const indicesData = await getAllIndicesByEnigme(this.id_enigme);

    const indices = indicesData.map((indicesData: IndiceType)=> new Indice(indicesData)) ;
    return indices;
  }




}
