import { EnigmeType } from "@/types";
import { getAllEnigmesParticipants } from "@/utils/dao/EnigmeUtils";

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
   * Méthode pour charger les données de l'objet indice dans la classe
   */
  public read(): void {
    /* A compléter */
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
  public getReussiteMoyenne(): number {
    /* A compléter */

    return 0;
  }

  /* 
   * Méthode pour calculer le nombre de fois qu'un indice a été révélé
   * @returns number Le nombre de fois qu'un indice a été révélé
   */

  public getNbIndiceRevele(): number {
    /* A compléter */

    return 0;
  }



}
