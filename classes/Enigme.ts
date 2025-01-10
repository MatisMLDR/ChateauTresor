import { EnigmeType } from "@/types";
import { createEnigme, deleteEnigme, getAllEnigmesParticipants, getEnigmeById, updateEnigme } from "@/utils/dao/EnigmeUtils";
import { getAllParticipations } from '@/utils/dao/ChasseUtils';
import { getAllIndicesParticipants } from "@/utils/dao/IndiceUtils";

export class Enigme {
  id: number;
  titre: string;
  qrCode: string;
  code: string;
  description: string;
  endroit_qrcode: string;
  temps_max: number;
  description_reponse: string;
  image_reponse: string;

  constructor(enigme: EnigmeType) {
    this.id = enigme.id;
    this.titre = enigme.titre;
    this.qrCode = enigme.qrCode;
    this.code = enigme.code;
    this.description = enigme.description;
    this.endroit_qrcode = enigme.endroit_qrcode;
    this.temps_max = enigme.temps_max;
    this.description_reponse = enigme.description_reponse;
    this.image_reponse = enigme.image_reponse;
  }

  // Getters
  public getId(): number {
    return this.id;
  }

  public getTitre(): string {
    return this.titre;
  }

  public getQrCode(): string {
    return this.qrCode;
  }

  public getCode(): string {
    return this.code;
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

  public getImageReponse(): string {
    return this.image_reponse;
  }

  // Setters

  public setId(id: number): void {
    this.id = id;
  }

  public setTitre(titre: string): void {
    this.titre = titre;
  }

  public setQrCode(qrCode: string): void {
    this.qrCode = qrCode;
  }

  public setCode(code: string): void {
    this.code = code;
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

  public setImageReponse(image_reponse: string): void {
    this.image_reponse = image_reponse;
  }

  /* 
   * Méthode pour charger les données de l'objet énigme dans la classe
    * @param id_chasse L'identifiant de la chasse
    * @throws Error si l'énigme n'existe pas ou si plusieurs énigmes sont trouvés
   */
  public async readId(id: number): Promise<any> {
    
    const data = getEnigmeById(id) as any;
    
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
        if (!this.id) {
            throw new Error('Enigme ID is required');
        }
    
        const avis = await getEnigmeById(this.id) as any
    
        if (!avis) {
            throw new Error('Enigme not found');
        }
    
        return new Enigme(avis);
      }
    
      public async load(): Promise<void> {
        if (!this.id) {
            throw new Error('Enigme ID is required');
        }
    
        const avis = await getEnigmeById(this.id) as any
    
        if (!avis) {
            throw new Error('Enigme not found');
        }
    
        this.id = avis.id;
        this.titre = avis.titre;
        this.qrCode = avis.qrCode;
        this.code = avis.code;
        this.description = avis.description;
        this.endroit_qrcode = avis.endroit_qrcode;
        this.temps_max = avis.temps_max;
        this.description_reponse = avis.description_reponse;
        this.image_reponse = avis.image_reponse;
      }
    
      public async create(): Promise<void> {
        const avis = await createEnigme(this) as any
    
        if (!avis) {
            throw new Error('Enigme not created');
        }
      }
    
      public async deleteId(id: number): Promise<void> {
        try {
          await deleteEnigme(id);
        } catch (error) {
            throw new Error('Chasse does not exist');
        }
      }
    
      public async delete(): Promise<void> {
        if (!this.id) {
          console.log("Pas d'id Enigme");
          throw new Error('id is required');
        }
        try {
          await deleteEnigme(this.id);
        } catch (error) {
            throw new Error('Enigme does not exist');
        }
      }
    
      public async update(): Promise<void> {
        try {
          await updateEnigme(this);
        } catch (error) {
            throw new Error('Enigme does not exist');
        }
      }

  // Calculs
  /*
  * Méthode pour calculer le temps moyen passé pour résoudre une énigme
  * @returns number Le temps moyen en secondes
  */
  public getTempsMoyen(): number {
    const data = getAllEnigmesParticipants(this.id) as any;
    if (data.length == 0) {
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
    const data = await getAllEnigmesParticipants(this.id);

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

  public getNbIndiceRevele(): number {
    const data = getAllIndicesParticipants(this.id) as any;
    if (data.length == 0) {
      return 0;
    }
    return data.reduce((acc: number, curr: any) => acc + curr.est_decouvert, 0);
  }
}
