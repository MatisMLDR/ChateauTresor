import { IndiceType } from "@/types";

export class Indice {
  id: string; 
  contenu: string; 
  ordre: number; 
  degreAide: number; 
  idEnigme: string;

  constructor(id: string, contenu: string = "Pas de contenu", ordre: number = 1, degreAide: number = 1, idEnigme: string) {
    if (degreAide < 1 || degreAide > 5) {
      throw new Error("Le degré d'aide doit être compris entre 1 et 5.");
    }
    this.id = id;
    this.contenu = contenu;
    this.ordre = ordre;
    this.degreAide = degreAide;
    this.idEnigme = idEnigme;
  }

    public getId(): string {
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

    public setId(id: string): void {
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
}