import { AppartenanceEquipeType, EquipeOrganisatriceType, MembreEquipeType } from '@/types';
import { createAppartenanceMembreEquipe, createMembre, deleteAppartenanceMembreEquipe, deleteMembre, getAllAppartenancesMembre, getAppartenanceMembreEquipe, getMembreById, getMembreByUserId, updateMembre } from '@/utils/dao/MembreEquipeUtils';
import { UUID } from "crypto";
import EquipeOrganisatrice from './EquipeOrganisatrice';

export class MembreEquipe {
  private id_membre: UUID;
  private id_user: UUID;

  constructor(membre: MembreEquipeType) {
    this.id_membre = membre.id_membre;
    this.id_user = membre.id_user;
  }

  // Getters
  public getIdMembre(): UUID {
    return this.id_membre;
  }

  public getIdUser(): UUID {
    return this.id_user;
  }

  // Méthode pour obtenir les données du membre sous forme d'objet
  public getMembre(): MembreEquipeType {
    return {
      id_membre: this.id_membre,
      id_user: this.id_user,
    };
  }

  public static async readId(id_membre: UUID): Promise<any> {
    const data = await getMembreById(id_membre) as any;

    if (!data) {
      throw new Error("Membre not found");
    }

    console.log("MembreEquipe après appel API dans read", data);

    return new MembreEquipe(data);
  }

  public static async readByIdUser(id_user: UUID): Promise<MembreEquipe> {
    const data = await getMembreByUserId(id_user) as any;

    if (!data) {
      throw new Error("L'utilisateur n'a pas été trouvé");
    }

    // Retourne une instance de MembreEquipe
    return new MembreEquipe(data);
  }

  public static async createAppartenanceEquipe(appartenanceData: AppartenanceEquipeType): Promise<void> {
    try {
      await createAppartenanceMembreEquipe(appartenanceData);
    } catch (error) {
      throw new Error('Membre not created');
    }
  }

  public static async getAllAppartenancesOfMembre(id_membre: UUID): Promise<any[]> {
    const data = await getAllAppartenancesMembre(id_membre) as any;

    return data;
  }

  public static async getAllEquipesOfMembre(id_membre: UUID): Promise<EquipeOrganisatrice[]> {
    const data = await getAllAppartenancesMembre(id_membre) as any;
    // Use Promise.all to ensure the array of promises is awaited
    const equipes = await Promise.all(
      data.map(async (appartenance: any) => {
        return await EquipeOrganisatrice.readId(appartenance.id_equipe);
      })
    );

    return equipes; // Now this will return the resolved array of EquipeOrganisatrice objects
  }

  public async getAppartenanceEquipe(id_equipe: UUID): Promise<AppartenanceEquipeType> {
    const appartenance = await getAppartenanceMembreEquipe(this.id_membre, id_equipe) as AppartenanceEquipeType;
    return appartenance;
  }


  public async read(): Promise<any> {
    if (!this.id_membre) {
      throw new Error('Membre ID is required');
    }

    const avis = await getMembreById(this.id_membre) as any

    if (!avis) {
      throw new Error('Membre not found');
    }

    return new MembreEquipe(avis);
  }

  public async load(): Promise<void> {
    if (!this.id_membre) {
      throw new Error('Membre ID is required');
    }

    const avis = await getMembreById(this.id_membre) as any

    if (!avis) {
      throw new Error('Membre not found');
    }

    this.id_membre = avis.id_membre;
    this.id_user = avis.id_user;
  }

  public async create(): Promise<void> {
    const avis = await createMembre(this) as any

    if (!avis) {
      throw new Error('Membre not created');
    }
  }

  public async deleteId(id_membre: UUID): Promise<void> {
    try {
      await deleteMembre(id_membre);
    } catch (error) {
      throw new Error('Membre does not exist');
    }
  }

  public async delete(): Promise<void> {
    if (!this.id_membre) {
      console.log("Pas d'id Membre");
      throw new Error('id_membre is required');
    }
    try {
      await deleteMembre(this.id_membre);
    } catch (error) {
      throw new Error('Membre does not exist');
    }
  }

  public async update(): Promise<void> {
    try {
      await updateMembre(this);
    } catch (error) {
      throw new Error('Membre does not exist');
    }
  }

  public static async quitterEquipe(id_membre: UUID, id_equipe: UUID): Promise<void> {
    try {
      await deleteAppartenanceMembreEquipe(id_membre, id_equipe)
    } catch (error) {
      throw new Error('Appartenance does not exist');
    }
  }
}
