import { MembreEquipeType } from '@/types';
import { getMembreById } from '@/utils/dao/MembreEquipeUtils';

export class MembreEquipeClass {
  private id_membre: number;
  private carte_identite: string | null;
  private est_verifie: boolean;
  private role_equipe: string;
  private id_user: string;

  constructor(membre: MembreEquipeType) {
    this.id_membre = membre.id_membre;
    this.carte_identite = membre.carte_identite ?? null;
    this.est_verifie = membre.est_verifie ?? false;
    this.role_equipe = membre.role_equipe ?? "Membre";
    this.id_user = membre.id_user;
  }

  // Getters
  public getIdMembre(): number {
    return this.id_membre;
  }

  public getCarteIdentite(): string | null {
    return this.carte_identite;
  }

  public isVerifie(): boolean {
    return this.est_verifie;
  }

  public getRoleEquipe(): string {
    return this.role_equipe;
  }

  public getIdUser(): string {
    return this.id_user;
  }

  // Setters
  public setCarteIdentite(carte_identite: string | null): void {
    this.carte_identite = carte_identite;
  }

  public setEstVerifie(est_verifie: boolean): void {
    this.est_verifie = est_verifie;
  }

  public setRoleEquipe(role_equipe: string): void {
    this.role_equipe = role_equipe;
  }

  // Méthode pour obtenir les données du membre sous forme d'objet
  public getMembre(): MembreEquipeType {
    return {
      id_membre: this.id_membre,
      carte_identite: this.carte_identite,
      est_verifie: this.est_verifie,
      role_equipe: this.role_equipe,
      id_user: this.id_user,
    };
  }

  public async read(id_membre: number): Promise<any> {
     const data = await getMembreById(id_membre) as any;

     if (!data) {
      throw new Error("Membre not found");
     }

     console.log("MembreEquipe après appel API dans read", data); 

      return new MembreEquipeClass(data); 
  }
}
