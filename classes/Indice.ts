import { Indice as IndiceType, IndiceType as TypeIndice } from "@/types";
import { getIndiceById } from "@/utils/dao/IndiceUtils";

class Indice {
  private id_indice: number;
  private type: TypeIndice;
  private contenu: string;
  private degre_aide: number;
  private ordre: number;
  private id_enigme: number;


  constructor(indice: IndiceType) {
    this.id_indice = indice.id_indice;
    this.type = indice.type;
    this.contenu = indice.contenu || "Pas de contenu";
    this.degre_aide = Math.min(Math.max(indice.degre_aide || 1, 1), 5); // Assure le degré entre 1 et 5
    this.ordre = indice.ordre || 1;
    this.id_enigme = indice.id_enigme;

  }

  // Getters
  public getId(): number {
    return this.id_indice;
  }
  public getType(): TypeIndice {
    return this.type;
  }
  public getContenu(): string {
    return this.contenu;
  }
  public getDegreAide(): number {
    return this.degre_aide;
  }
  public getOrdre(): number {
    return this.ordre;
  }
  public getIdEnigme(): number {
    return this.id_enigme;
  }

  // Setters
  public setType(type: TypeIndice): void {
    this.type = type;
  }
  public setContenu(contenu: string): void {
    this.contenu = contenu;
  }
  public setDegreAide(degre_aide: number): void {
    this.degre_aide = degre_aide;
  }
  public setOrdre(ordre: number): void {
    this.ordre = ordre;
  }
  public setId(id: number): void {
    this.id_indice = id;
  }
  public setIdEnigme(id_enigme: number): void {
    this.id_enigme = id_enigme;
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