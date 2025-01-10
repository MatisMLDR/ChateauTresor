import { TexteType } from "@/types";

import { getAllTextes, getTexteById } from '@/utils/dao/TexteUtils';

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


    public async read(id_texte: number): Promise<void> {
        const texte = await getTexteById(id_texte);

        if (!texte) {
            throw new Error("Texte not found");
        }

        console.log("Texte après appel API dans read", texte); 

        const row = texte[0];
        this.id_texte = row.id_texte;
        this.contenu = row.contenu;
        this.id_indice = row.id_indice;
    }
}

export default Texte;
