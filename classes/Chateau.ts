import { ChateauType } from "@/types";
import { getChateauById } from '@/utils/dao/ChateauUtils';

class Chateau {
  private id_chateau: number;
  private nom: string;
  private adresse_postale: string;
  private localisation: string;
  private capacite: number;
  private prix_location: number;
  private telephone: string | null;
  private description: string;
  private image: string | null;
  private site_web: string | null;
  private id_proprietaire: number | null;

  constructor(chateau: ChateauType) {
    this.id_chateau = chateau.id_chateau;
    this.nom = chateau.nom || 'Château inconnu'; // Valeur par défaut si nom est non défini
    this.adresse_postale = chateau.adresse_postale || 'Non spécifiée'; // Valeur par défaut
    this.localisation = chateau.localisation || 'Non spécifiée'; // Valeur par défaut
    this.capacite = chateau.capacite || 0; // Valeur par défaut
    this.prix_location = chateau.prix_location || 0.00; // Valeur par défaut
    this.telephone = chateau.telephone || null; // Valeur par défaut
    this.description = chateau.description || 'Pas de description'; // Valeur par défaut
    this.image = chateau.image || null; // Valeur par défaut
    this.site_web = chateau.site_web || null; // Valeur par défaut
    this.id_proprietaire = chateau.id_proprietaire || null; // Valeur par défaut
  }

  // Getters
  public getIdChateau(): number {
    return this.id_chateau;
  }

  public getNom(): string {
    return this.nom;
  }

  public getAdressePostale(): string {
    return this.adresse_postale;
  }

  public getLocalisation(): string {
    return this.localisation;
  }

  public getCapacite(): number {
    return this.capacite;
  }

  public getPrixLocation(): number {
    return this.prix_location;
  }

  public getTelephone(): string | null {
    return this.telephone;
  }

  public getDescription(): string {
    return this.description;
  }

  public getImage(): string | null {
    return this.image;
  }

  public getSiteWeb(): string | null {
    return this.site_web;
  }

  public getIdProprietaire(): number | null {
    return this.id_proprietaire;
  }

  // Setters
  public setIdChateau(id_chateau: number): void {
    this.id_chateau = id_chateau;
  }

  public setNom(nom: string): void {
    this.nom = nom;
  }

  public setAdressePostale(adresse_postale: string): void {
    this.adresse_postale = adresse_postale;
  }

  public setLocalisation(localisation: string): void {
    this.localisation = localisation;
  }

  public setCapacite(capacite: number): void {
    this.capacite = capacite;
  }

  public setPrixLocation(prix_location: number): void {
    this.prix_location = prix_location;
  }

  public setTelephone(telephone: string | null): void {
    this.telephone = telephone;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public setImage(image: string | null): void {
    this.image = image;
  }

  public setSiteWeb(site_web: string | null): void {
    this.site_web = site_web;
  }

  public setIdProprietaire(id_proprietaire: number | null): void {
    this.id_proprietaire = id_proprietaire;
  }

  /*
   * Méthode pour charger les données de l'objet indice dans la classe
   */
  public async readId(id_chateau: number): Promise<any> {

    const data = await getChateauById(id_chateau) as any;

    if (!data) {
      throw new Error("Le château n'existe pas");
    }
    
    console.log("Château après appel API dans read", data); 

    return new Chateau(data);
  }

  public async read(): Promise<any> {
        if (!this.id_chateau) {
            throw new Error('Chateau ID is required');
        }
    
        const avis = await getChateauById(this.id_chateau) as any
    
        if (!avis) {
            throw new Error('Chateau not found');
        }
    
        return new Chateau(avis);
      }
    
      public async load(): Promise<void> {
        if (!this.id_chateau) {
            throw new Error('chateau ID is required');
        }
    
        const avis = await getChateauById(this.id_chateau) as any
    
        if (!avis) {
            throw new Error('Chateau not found');
        }
    
        this.id_chateau = avis.id_chateau;
        this.nom = avis.nom;
        this.adresse_postale = avis.adresse_postale;
        this.localisation = avis.localisation;
        this.capacite = avis.capacite;
        this.prix_location = avis.prix_location;
        this.telephone = avis.telephone;
        this.description = avis.description;
        this.image = avis.image;
        this.site_web = avis.site_web;
        this.id_proprietaire = avis.id_proprietaire;
      }
    
      public async create(): Promise<void> {
        const avis = await createChateau(this) as any
    
        if (!avis) {
            throw new Error('Chasse not created');
        }
      }
    
      public async deleteId(id_chateau: number): Promise<void> {
        try {
          await deleteChateau(id_chateau);
        } catch (error) {
            throw new Error('Chateau does not exist');
        }
      }
    
      public async delete(): Promise<void> {
        if (!this.id_chateau) {
          console.log("Pas d'id chateau");
          throw new Error('id_chateau is required');
        }
        try {
          await deleteChateau(this.id_chateau);
        } catch (error) {
            throw new Error('Chateau does not exist');
        }
      }
    
      public async update(): Promise<void> {
        try {
          await updateChateau(this.id_chateau, this.getIdChateau());
        } catch (error) {
            throw new Error('Chateau does not exist');
        }
      }
}

export default Chateau;