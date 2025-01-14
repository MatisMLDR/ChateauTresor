import { EquipeOrganisatriceType as EquipeOrganisatriceType } from "@/types";
import { getEquipeById, getAllEquipes, deleteEquipe, createEquipe, updateEquipe } from '@/utils/dao/EquipeOrganisatriceUtils';
import { UUID } from "crypto";

class EquipeOrganisatrice {
  private id_equipe: UUID;
  private type: string;
  private n_siret: string | null;
  private id_taxes: string | null;
  private nb_membres: number;
  private site_web: string | null;
  private adresse_postale: string;
  private telephone: string | null;
  private id_user: string;

  constructor(equipe: EquipeOrganisatriceType) {
    this.id_equipe = equipe.id_equipe;
    this.type = equipe.type;
    this.n_siret = equipe.n_siret;
    this.id_taxes = equipe.id_taxes;
    this.nb_membres = equipe.nb_membres;
    this.site_web = equipe.site_web;
    this.adresse_postale = equipe.adresse_postale;
    this.telephone = equipe.telephone;
    this.id_user = equipe.id_user;
  }

  // Getters
  public getIdEquipe(): UUID {
    return this.id_equipe;
  }
  public getType(): string {
    return this.type;
  }
  public getNSiret(): string | null {
    return this.n_siret;
  }
  public getIdTaxes(): string | null {
    return this.id_taxes;
  }
  public getNbMembres(): number {
    return this.nb_membres;
  }
  public getSiteWeb(): string | null {
    return this.site_web;
  }
  public getAdressePostale(): string {
    return this.adresse_postale;
  }
  public getTelephone(): string | null {
    return this.telephone;
  }
  public getIdUser(): string {
    return this.id_user;
  }

  // Setters
  public setType(type: string): void {
    this.type = type;
  }
  public setNSiret(n_siret: string | null): void {
    this.n_siret = n_siret;
  }
  public setIdTaxes(id_taxes: string | null): void {
    this.id_taxes = id_taxes;
  }
  public setNbMembres(nb_membres: number): void {
    this.nb_membres = nb_membres;
  }
  public setSiteWeb(site_web: string | null): void {
    this.site_web = site_web;
  }
  public setAdressePostale(adresse_postale: string): void {
    this.adresse_postale = adresse_postale;
  }
  public setTelephone(telephone: string | null): void {
    this.telephone = telephone;
  }
  public setIdUser(id_user: string): void {
    this.id_user = id_user;
  }

  // Méthode pour charger les données de l'équipe organisatrice
  public static async readId(id_equipe: UUID): Promise<any> {
    
    const data = await getEquipeById(id_equipe) as any;

    if (!data) {
      throw new Error("Équipe organisatrice introuvable.");
    }

    console.log("EquipeOrganisatrice après appel API dans read", data); 

    return new EquipeOrganisatrice(data);
  }

  public async read(): Promise<any> {
          if (!this.id_equipe) {
              throw new Error('Equipe ID is required');
          }
      
          const avis = await getEquipeById(this.id_equipe) as any
      
          if (!avis) {
              throw new Error('EQUIPE not found');
          }
      
          return new EquipeOrganisatrice(avis);
        }
      
        public async load(): Promise<void> {
          if (!this.id_equipe) {
              throw new Error('Equipe ID is required');
          }
      
          const avis = await getEquipeById(this.id_equipe) as any
      
          if (!avis) {
              throw new Error('Equipe not found');
          }
      
          this.id_equipe = avis.id_equipe;
          this.type = avis.type;
          this.n_siret = avis.n_siret;
          this.id_taxes = avis.id_taxes;
          this.nb_membres = avis.nb_membres;
          this.site_web = avis.site_web;
          this.adresse_postale = avis.adresse_postale;
          this.telephone = avis.telephone;
          this.id_user = avis.id_user;
        }
      
        public async create(): Promise<void> {
          const avis = await createEquipe(this) as any
      
          if (!avis) {
              throw new Error('Equipe not created');
          }
        }
      
        public async deleteId(id_equipe: UUID): Promise<void> {
          try {
            await deleteEquipe(id_equipe);
          } catch (error) {
              throw new Error('Equipe does not exist');
          }
        }
      
        public async delete(): Promise<void> {
          if (!this.id_equipe) {
            console.log("Pas d'id Equipe");
            throw new Error('Equipe ID is required');
          }
          try {
            await deleteEquipe(this.id_equipe);
          } catch (error) {
              throw new Error('Equipe does not exist');
          }
        }
      
        public async update(): Promise<void> {
          try {
            await updateEquipe(this);
          } catch (error) {
              throw new Error('Equipe does not exist');
          }
        }

  // Méthode pour obtenir la liste de toutes les équipes organisatrices
  public static async getAllEquipes(): Promise<EquipeOrganisatrice[]> {
    const data = await getAllEquipes();
    return data.map(
      (equipe) => new EquipeOrganisatrice(equipe)
    );
  }

  // Exemple de méthode de calcul
  public getNbMembresParMoyenneEquipe(totalEquipes: number): number {
    if (totalEquipes === 0) return 0;
    return this.nb_membres / totalEquipes;
  }
}

export default EquipeOrganisatrice;

