import { ChateauType } from "@/types";

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
    this.nom = chateau.nom;
    this.adresse_postale = chateau.adresse_postale;
    this.localisation = chateau.localisation;
    this.capacite = chateau.capacite;
    this.prix_location = chateau.prix_location;
    this.telephone = chateau.telephone;
    this.description = chateau.description;
    this.image = chateau.image;
    this.site_web = chateau.site_web;
    this.id_proprietaire = chateau.id_proprietaire;
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

}

export default Chateau;