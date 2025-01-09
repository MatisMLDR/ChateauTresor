import { TexteType } from "@/types";

import { getAllTextes, getTexteById } from '@/utils/dao/TexteUtils';

class Texte {
  private id_texte: number;
  private contenu: string; 
  private id_indice: number; 

  constructor(texte: TexteType) {
      this.id_texte = texte.id_texte;
      this.contenu = texte.contenu;
      this.id_indice = texte.id_indice;
  }

    public getIdTexte(): number {
        return this.id_texte;
    }

    public getContenu(): string {
        return this.contenu;
    }

    public getIdIndice(): number {
        return this.id_indice;
    }

    public setIdTexte(id_texte: number): void {
        this.id_texte = id_texte;
    }

    public setContenu(contenu: string): void {
        this.contenu = contenu;
    }

    public setIdIndice(id_indice: number): void {
        this.id_indice = id_indice;
    }

    public async read(id_texte: number): Promise<void> {
        const texte = await getTexteById(id_texte);
        const row = texte[0];
        this.id_texte = row.id_texte;
        this.contenu = row.contenu;
        this.id_indice = row.id_indice;
    }
}

export default Texte;
