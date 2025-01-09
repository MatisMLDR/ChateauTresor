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
  public async read(id_chateau: number): Promise<void> {

    const data = await getChateauById(id_chateau) as any;

    if (data.length == 0) {
      throw new Error("La chasse n'existe pas");
    }
    if (data.length > 1) {
      throw new Error("Plusieurs chasses trouvées");
    }

    const row = data[0];
    this.setIdChateau(row.id_chateau);
    this.setNom(row.nom);
    this.setAdressePostale(row.adresse_postale);
    this.setLocalisation(row.localisation);
    this.setCapacite(row.capacite);
    this.setPrixLocation(row.prix_location);
    this.setTelephone(row.telephone);
    this.setDescription(row.description);
    this.setImage(row.image);
    this.setSiteWeb(row.site_web);
    this.setIdProprietaire(row.id_proprietaire);

  }




}

export default Chateau;