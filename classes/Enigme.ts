import { IndiceType } from "@/types";

export class Enigme {
  id: string;
  titre: string;
  indices: IndiceType[]; // Composition 1..*
  qrCode: string;
  code: string;
  description: string;
  endroit_qrcode: string;
  temps_max: number;
  description_reponse: string;
  image_reponse: string;

  constructor(id: string, titre: string, qrCode: string, code: string, description: string, endroit_qrcode: string, temps_max: number, description_reponse: string, image_reponse: string) {
    this.id = id;
    this.titre = titre;
    this.indices = []; // Composition 1..*
    this.qrCode = qrCode;
    this.code = code;
    this.description = description;
    this.endroit_qrcode = endroit_qrcode;
    this.temps_max = temps_max;
    this.description_reponse = description_reponse;
    this.image_reponse = image_reponse;
  }

  public addIndice(indice: IndiceType): void {
    this.indices.push(indice);
    // Appel API pour ajouter l'indice à la base de données
  }

  public removeIndice(indice: IndiceType): void {
    const index = this.indices.indexOf(indice);
    if (index > -1) {
      this.indices.splice(index, 1);
    }
  }
}
