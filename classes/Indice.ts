import { IndiceType } from "@/types";
import { getIndiceById } from '@/utils/dao/IndiceUtils';

export class Indice {
  id: number;
  contenu: string; 
  ordre: number; 
  degreAide: number; 
  idEnigme: string;

  constructor(id: number, contenu: string = "Pas de contenu", ordre: number = 1, degreAide: number = 1, idEnigme: string) {
    if (degreAide < 1 || degreAide > 5) {
      throw new Error("Le degré d'aide doit être compris entre 1 et 5.");
    }
    this.id = id;
    this.contenu = contenu;
    this.ordre = ordre;
    this.degreAide = degreAide;
    this.idEnigme = idEnigme;
  }

  // Getters

  public getId(): number {
    return this.id;
  }

  public getContenu(): string {
      return this.contenu;
  }

  public getOrdre(): number {
      return this.ordre;
  }

  public getDegreAide(): number {
      return this.degreAide;
  }

  public getIdEnigme(): string {
      return this.idEnigme;
  }

  // Setters

  public setId(id: number): void {
      this.id = id;
    }

  public setContenu(contenu: string): void {
      this.contenu = contenu;
  }

  public setOrdre(ordre: number): void {
      this.ordre = ordre;
  }

  public setDegreAide(degreAide: number): void {
      this.degreAide = degreAide;
  }

  public setIdEnigme(idEnigme: string): void {
      this.idEnigme = idEnigme;
  }

  /*
   * Méthode pour charger les données de l'objet indice dans la classe
   */
  public async read(id_indice: number): Promise<void> {

    const data = await getIndiceById(id_indice) as any;

    if (data.length == 0) {
      throw new Error("La chasse n'existe pas");
    }
    if (data.length > 1) {
      throw new Error("Plusieurs chasses trouvées");
    }

    const row = data[0];
    this.setId(row.id);
    this.setContenu(row.contenu);
    this.setOrdre(row.ordre);
    this.setDegreAide(row.degre_aide);
    this.setIdEnigme(row.id_enigme);
  }

}