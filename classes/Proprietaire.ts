import { ProprietaireType } from '@/types';
import { createProprietaire, deleteProprietaire, getChassesEnValidationParProprietaire, getProprietaireById, getProprietaireByUserId, updateProprietaire } from '@/utils/dao/ProprietaireUtils';
import { UUID } from "crypto";
import Chateau from './Chateau';

export class Proprietaire {
  private id_proprietaire: UUID;
  private id_user: UUID;

  constructor(proprietaire: ProprietaireType) {
    this.id_proprietaire = proprietaire.id_proprietaire;
    this.id_user = proprietaire.id_user;
  }

  // Getters
  public getIdProprietaire(): UUID {
    return this.id_proprietaire;
  }

  public getIdUser(): UUID {
    return this.id_user;
  }

  // Méthode pour obtenir les données du proprietaire sous forme d'objet
  public getProprietaire(): ProprietaireType {
    return {
      id_proprietaire: this.id_proprietaire,
      id_user: this.id_user,
    };
  }

  public static async readId(id_proprietaire: UUID): Promise<any> {
    const data = await getProprietaireById(id_proprietaire) as any;

    if (!data) {
      throw new Error("proprietaire not found");
    }

    console.log("proprietaireEquipe après appel API dans read", data);

    return new Proprietaire(data);
  }

  public static async readByIdUser(id_user: UUID): Promise<Proprietaire> {
    const data = await getProprietaireByUserId(id_user) as any;

    if (!data) {
      throw new Error("L'utilisateur n'a pas été trouvé");
    }

    // Retourne une instance de proprietaireEquipe
    return new Proprietaire(data);
  }


  public async read(): Promise<any> {
    if (!this.id_proprietaire) {
      throw new Error('proprietaire ID is required');
    }

    const avis = await getProprietaireById(this.id_proprietaire) as any

    if (!avis) {
      throw new Error('proprietaire not found');
    }

    return new Proprietaire(avis);
  }

  public async load(): Promise<void> {
    if (!this.id_proprietaire) {
      throw new Error('proprietaire ID is required');
    }

    const avis = await getProprietaireById(this.id_proprietaire) as any

    if (!avis) {
      throw new Error('proprietaire not found');
    }

    this.id_proprietaire = avis.id_proprietaire;
    this.id_user = avis.id_user;
  }

  public async create(): Promise<void> {
    const proprietaire = await createProprietaire(this) as any

    if (!proprietaire) {
      throw new Error('proprietaire not created');
    }
  }

  public async deleteId(id_proprietaire: UUID): Promise<void> {
    try {
      await deleteProprietaire(id_proprietaire);
    } catch (error) {
      throw new Error('proprietaire does not exist');
    }
  }

  public async delete(): Promise<void> {
    if (!this.id_proprietaire) {
      console.log("Pas d'id proprietaire");
      throw new Error('id_proprietaire is required');
    }
    try {
      await deleteProprietaire(this.id_proprietaire);
    } catch (error) {
      throw new Error('proprietaire does not exist');
    }
  }

  public async update(): Promise<void> {
    try {
      await updateProprietaire(this);
    } catch (error) {
      throw new Error('proprietaire does not exist');
    }
  }

  public async getChateau(): Promise<Chateau> {
    const chateau = await Chateau.readByIdProprietaire(this.id_proprietaire);

    return chateau;
  }

   /**
   * Méthode pour récupérer les chasses en cours de validation pour ce propriétaire
   * @returns Promise<any[]> Une liste de chasses en cours de validation
   * @throws Error si la récupération échoue
   */
   public async getChassesEnValidation(): Promise<any[]> {
    try {
      return await getChassesEnValidationParProprietaire(this.id_proprietaire);
    } catch (error) {
      console.error('Erreur lors de la récupération des chasses en cours de validation:', error);
      throw new Error('Erreur lors de la récupération des chasses en cours de validation');
    }
  }
}
