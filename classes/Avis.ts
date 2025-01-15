import { AvisType } from "@/types";
import { getAvisById, createAvis, deleteAvis, updateAvis } from '@/utils/dao/AvisUtils';
import { UUID } from "crypto";
import { Participant } from "./Participant";


class Avis {
  private id_avis: UUID;
  private note: number;
  private titre: string;
  private description: string;
  private nb_like: number;
  private date_modification: string;
  private id_chasse: UUID;
  private id_participant: UUID;

  constructor(avis: AvisType) {
    this.id_avis = avis.id_avis;
    this.note = avis.note;
    this.titre = avis.titre;
    this.description = avis.description;
    this.nb_like = avis.nb_like;
    this.date_modification = avis.date_modification;
    this.id_chasse = avis.id_chasse;
    this.id_participant = avis.id_participant;
  }

  // Getters

  public getIdAvis(): UUID {
    return this.id_avis;
  }
  public getNote(): number {
    return this.note;
  }
  public getTitre(): string {
    return this.titre;
  }
  public getDescription(): string {
    return this.description;
  }
  public getNbLike(): number {
    return this.nb_like;
  }
  public getDateModification(): string {
    return this.date_modification;
  }
  public getIdChasse(): UUID {
    return this.id_chasse;
  }
  public getIdParticipant(): UUID {
    return this.id_participant;
  }

  public setIdAvis(id_avis: UUID): void {
    this.id_avis = id_avis;
  }

  public setNote(note: number): void {
    this.note = note;
  }

  public setTitre(titre: string): void {
    this.titre = titre;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public setNbLike(nb_like: number): void {
    this.nb_like = nb_like;
  }

  public setDateModification(date_modification: string): void {
    this.date_modification = date_modification;
  }

  public setIdChasse(id_chasse: UUID): void {
    this.id_chasse = id_chasse;
  }

  public setIdParticipant(id_participant: UUID): void {
    this.id_participant = id_participant;
  }

  public toObject(): AvisType {
    return {
      id_avis: this.id_avis,
      note: this.note,
      titre: this.titre,
      description: this.description,
      nb_like: this.nb_like,
      date_modification: this.date_modification,
      id_chasse: this.id_chasse,
      id_participant: this.id_participant
    };
  }

  public static async readId(id_avis: UUID): Promise<any> {

    const avis = await getAvisById(id_avis) as any

    if (!avis) {
      throw new Error('Avis not found');
    }

    console.log("Avis après appel API dans read", avis);

    return new Avis(avis);
  }

  public async read(): Promise<any> {
    if (!this.id_avis) {
      throw new Error('Avis ID is required');
    }

    const avis = await getAvisById(this.id_avis) as any

    if (!avis) {
      throw new Error('Avis not found');
    }

    return new Avis(avis);
  }

  public async load(): Promise<void> {
    if (!this.id_avis) {
      throw new Error('Avis ID is required');
    }

    const avis = await getAvisById(this.id_avis) as any

    if (!avis) {
      throw new Error('Avis not found');
    }

    this.note = avis.note;
    this.titre = avis.titre;
    this.description = avis.description;
    this.nb_like = avis.nb_like;
    this.date_modification = avis.date_modification;
    this.id_chasse = avis.id_chasse;
    this.id_participant = avis.id_participant;
  }

  public async create(): Promise<void> {
    const avis = await createAvis(this) as any

    if (!avis) {
      throw new Error('Avis not created');
    }
  }

  public async deleteId(id_avis: UUID): Promise<void> {
    try {
      await deleteAvis(id_avis);
    } catch (error) {
      throw new Error('Avis does not exist');
    }
  }

  public async delete(): Promise<void> {
    if (!this.id_avis) {
      console.log("Pas d'id avis");
      throw new Error('Avis ID is required');
    }
    try {
      await deleteAvis(this.id_avis);
    } catch (error) {
      throw new Error('Avis does not exist');
    }
  }

  public async update(): Promise<void> {
    try {
      await updateAvis(this);
    } catch (error) {
      throw new Error('Avis does not exist');
    }
  }

  public async getAuteur(): Promise<any> {
    const participant = await Participant.readId(this.id_participant) as any

    return new Participant(participant);
  }

  public async addLike(): Promise<void> {
    this.nb_like++;
    await this.update();
  }

  public async removeLike(): Promise<void> {
    this.nb_like--;
    await this.update();
  }
}

export default Avis;