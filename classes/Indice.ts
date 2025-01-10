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
  public async readId(id_indice: number): Promise<any> {

    const data = await getIndiceById(id_indice) as any;

    if (!data) {
      throw new Error("La chasse n'existe pas");
    }
    
    console.log("Indice après appel API dans read", data); 

    return new Indice(data);
  }

  public async read(): Promise<any> {
          if (!this.id_indice) {
              throw new Error('Indice ID is required');
          }
      
          const avis = await getIndiceById(this.id_indice) as any
      
          if (!avis) {
              throw new Error('Indice not found');
          }
      
          return new Indice(avis);
        }
      
        public async load(): Promise<void> {
          if (!this.id_indice) {
              throw new Error('Indice ID is required');
          }
      
          const avis = await getIndiceById(this.id_indice) as any
      
          if (!avis) {
              throw new Error('Indice not found');
          }
      
          this.id_indice = avis.id_indice;
          this.type = avis.type;
          this.contenu = avis.contenu;
          this.degre_aide = avis.degre_aide;
          this.ordre = avis.ordre;
          this.id_enigme = avis.id_enigme;
        }
      
        public async create(): Promise<void> {
          const avis = await createIndice(this) as any
      
          if (!avis) {
              throw new Error('Indice not created');
          }
        }
      
        public async deleteId(id_indice: number): Promise<void> {
          try {
            await deleteIndice(id_indice);
          } catch (error) {
              throw new Error('Indice does not exist');
          }
        }
      
        public async delete(): Promise<void> {
          if (!this.id_indice) {
            console.log("Pas d'id Indice");
            throw new Error('id_indice is required');
          }
          try {
            await deleteIndice(this.id_indice);
          } catch (error) {
              throw new Error('Indice does not exist');
          }
        }
      
        public async update(): Promise<void> {
          try {
            await updateIndice(this.id_indice, this.getId());
          } catch (error) {
              throw new Error('Indice does not exist');
          }
        }
}

export default Indice;