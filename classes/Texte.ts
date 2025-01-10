import { TexteType } from "@/types";

import { getAllTextes, getTexteById, createTexte, updateTexte, deleteTexte } from '@/utils/dao/TexteUtils';

class Texte {
  private id_texte: number;
  private contenu: string;
  private id_indice: number | null;

  constructor(texte: Texte) {
    this.id_texte = texte.id_texte;
    this.contenu = texte.contenu;
    this.id_indice = texte.id_indice;
  }

  // Getters
  public getIdTexte(): number {
    return this.id_texte;
  }

  public getContenu(): string {
    return this.contenu;
  }

  public getIdIndice(): number | null {
    return this.id_indice;
  }

  // Setters
  public setIdTexte(id_texte: number): void {
    this.id_texte = id_texte;
  }

  public setContenu(contenu: string): void {
    this.contenu = contenu;
  }

  public setIdIndice(id_indice: number | null): void {
    this.id_indice = id_indice;
  }


    public static async readId(id_texte: number): Promise<any> {
        const texte = await getTexteById(id_texte) as any;

        if (!texte) {
            throw new Error("Texte not found");
        }

        console.log("Texte après appel API dans read", texte); 

        return new Texte(texte);
    }

    public async read(): Promise<any> {
                if (!this.id_texte) {
                    throw new Error('Participant ID is required');
                }
            
                const avis = await getTexteById(this.id_texte) as any
            
                if (!avis) {
                    throw new Error('Texte not found');
                }
            
                return new Texte(avis);
              }
            
              public async load(): Promise<void> {
                if (!this.id_texte) {
                    throw new Error('Texte ID is required');
                }
            
                const avis = await getTexteById(this.id_texte) as any
            
                if (!avis) {
                    throw new Error('Participant not found');
                }
            
                this.id_texte = avis.id_texte;
                this.contenu = avis.contenu;
                this.id_indice = avis.id_indice;
              }
              
              public async create(): Promise<void> {
                const avis = await createTexte(this) as any
            
                if (!avis) {
                    throw new Error('Texte not created');
                }
              }
            
              public async deleteId(id_texte: number): Promise<void> {
                try {
                  await deleteTexte(id_texte);
                } catch (error) {
                    throw new Error('Texte does not exist');
                }
              }
            
              public async delete(): Promise<void> {
                if (!this.id_texte) {
                  console.log("Pas d'id Texte");
                  throw new Error('id_texte is required');
                }
                try {
                  await deleteTexte(this.id_texte);
                } catch (error) {
                    throw new Error('Texte does not exist');
                }
              }
            
              public async update(): Promise<void> {
                try {
                  await updateTexte(this);
                } catch (error) {
                    throw new Error('Texte does not exist');
                }
              }
}

export default Texte;
