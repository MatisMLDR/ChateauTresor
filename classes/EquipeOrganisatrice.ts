import { EquipeOrganisatriceType as EquipeOrganisatriceType } from "@/types";
import { getEquipeById, getAllEquipes, deleteEquipe, createEquipe, updateEquipe, getEquipeByMembreId, getAllEquipesVerifiees } from '@/utils/dao/EquipeOrganisatriceUtils';
import { UUID } from "crypto";

class EquipeOrganisatrice {
  private id_equipe: UUID;
  private nom: string;
  private type: "Société" | "Particulier";
  private n_siret: string | null;
  private id_taxes: string | null;
  private site_web: string | null;
  private adresse_postale: string;
  private telephone: string | null;
  private statut_verification: string;
  private carte_identite_chef: string | null;
  private description: string | null;


  constructor(equipe: EquipeOrganisatriceType) {
    this.id_equipe = equipe.id_equipe;
    this.nom = equipe.nom;
    this.type = equipe.type;
    this.n_siret = equipe.n_siret;
    this.id_taxes = equipe.id_taxes;
    this.site_web = equipe.site_web;
    this.adresse_postale = equipe.adresse_postale;
    this.telephone = equipe.telephone;
    this.statut_verification = equipe.statut_verification;
    this.carte_identite_chef = equipe.carte_identite_chef;
    this.description = equipe.description
  }

  // Getters
  public getIdEquipe(): UUID {
    return this.id_equipe;
  }
  public getNSiret(): string | null {
    return this.n_siret;
  }
  public getIdTaxes(): string | null {
    return this.id_taxes;
  }
  public getType(): "Société" | "Particulier" {
    return this.type;
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
  public getNom(): string {
    return this.nom;
  }
  public getStatutVerification(): string {
    return this.statut_verification;
  }
  public getCarteIdentiteChef(): string | null {
    return this.carte_identite_chef;
  }
  public getDescription(): string | null {
    return this.description;
  }
  

  // Setters
  public setNSiret(n_siret: string | null): void {
    this.n_siret = n_siret;
  }
  public setIdTaxes(id_taxes: string | null): void {
    this.id_taxes = id_taxes;
  }
  public setType(type: "Société" | "Particulier"): void {
    this.type = type;
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
  public setNom(nom: string): void {
    this.nom = nom;
  }
  public setStatutVerification(statut_verification: string): void {
    this.statut_verification = statut_verification;
  }
  public setCarteIdentiteChef(carte_identite_chef: string | null): void {
    this.carte_identite_chef = carte_identite_chef;
  }
  public setDescription(description: string | null): void {
    this.description = description;
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

    /**
   * Récupère une équipe en fonction de l'id_membre.
   * @param id_membre - L'identifiant du membre.
   * @returns Une instance de EquipeOrganisatrice.
   * @throws Error si l'équipe n'est pas trouvée.
   */
  
    public static async getEquipeByMembreId(id_membre: UUID): Promise<EquipeOrganisatrice> {
      try {
        const data = await getEquipeByMembreId(id_membre);
  
        if (!data) {
          throw new Error(`Aucune équipe trouvée pour le membre avec l'ID ${id_membre}`);
        }
  
        // Retourne une instance de EquipeOrganisatrice
        return new EquipeOrganisatrice(data);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'équipe :', error);
        throw new Error('Erreur lors de la récupération de l\'équipe');
      }
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
          this.nom = avis.nom;
          this.n_siret = avis.n_siret;
          this.id_taxes = avis.id_taxes;
          this.site_web = avis.site_web;
          this.adresse_postale = avis.adresse_postale;
          this.telephone = avis.telephone;
          this.statut_verification = avis.statut_verification;
          this.carte_identite_chef = avis.carte_identite_chef;
          this.description = avis.description
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

  public static async getAllEquipesVerifiees(): Promise<EquipeOrganisatrice[]> {
    const data = await getAllEquipesVerifiees();
    return data.map(
      (equipe) => new EquipeOrganisatrice(equipe)
    );
  }

  public static async createEquipe(equipe: EquipeOrganisatrice): Promise<EquipeOrganisatrice> {
    const data = await createEquipe(equipe);
    return new EquipeOrganisatrice(data);
  }

  
  
}

export default EquipeOrganisatrice;

